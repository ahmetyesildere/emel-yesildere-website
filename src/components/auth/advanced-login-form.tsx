'use client'

import React, { useState, useCallback } from 'react'
import { Mail, Lock, LogIn, Loader2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { useToast } from '@/components/ui/toast-provider'
import { useAuthRetry } from '@/hooks/use-retry'
import { logAuthError, logValidationError } from '@/lib/error-logger'
import { signIn, resetPassword } from '@/lib/auth-helpers'
import { loginFormConfig, validateForm, ValidationResult } from '@/lib/form-validation'

interface AdvancedLoginFormProps {
  onSuccess?: () => void
  onSwitchToRegister?: () => void
}

interface FormData {
  email: string
  password: string
}

interface ValidationState {
  [key: string]: ValidationResult
}

const AdvancedLoginForm: React.FC<AdvancedLoginFormProps> = ({ 
  onSuccess, 
  onSwitchToRegister 
}) => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  })

  const [validationState, setValidationState] = useState<ValidationState>({})
  const [loading, setLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmailSent, setResetEmailSent] = useState(false)
  const [resettingPassword, setResettingPassword] = useState(false)

  const toast = useToast()

  // Network retry for signin
  const signInRetry = useAuthRetry(
    () => signIn({
      email: formData.email,
      password: formData.password
    }),
    {
      onRetry: (attempt, error) => {
        toast.warning('Bağlantı Sorunu', `Tekrar deneniyor... (${attempt}/2)`)
        logAuthError(`SignIn retry attempt ${attempt}`, { error: error.message })
      }
    }
  )

  // Form field change handler
  const handleFieldChange = useCallback((fieldName: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }))
  }, [])

  // Validation handler
  const handleFieldValidation = useCallback((fieldName: string, result: ValidationResult) => {
    setValidationState(prev => ({ ...prev, [fieldName]: result }))
  }, [])

  // Form validation check
  const isFormValid = () => {
    const validation = validateForm(formData, loginFormConfig)
    return validation.isValid && Object.values(validationState).every(v => v.isValid)
  }

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Final validation
    const validation = validateForm(formData, loginFormConfig)
    if (!validation.isValid) {
      logValidationError('Login form validation failed', { 
        errors: validation.errors,
        formData: { ...formData, password: '[REDACTED]' }
      })
      toast.error('Form Hatası', 'Lütfen tüm alanları doğru şekilde doldurun')
      return
    }

    setLoading(true)

    try {
      const { data, error } = await signInRetry.execute()

      if (error) {
        const errorMessage = typeof error === 'string' ? error : error.message || 'Giriş sırasında bir hata oluştu'
        logAuthError('Login failed', { 
          error: errorMessage, 
          email: formData.email 
        })
        toast.error('Giriş Hatası', errorMessage)
      } else if (data?.user) {
        const successMessage = 'Giriş başarılı! Yönlendiriliyorsunuz...'
        
        if (onSuccess) {
          setTimeout(() => {
            onSuccess()
          }, 1000)
        }
      }
    } catch (err: any) {
      console.error('Login error:', err)
      const errorMessage = 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.'
      logAuthError('Login exception', { 
        error: err.message, 
        stack: err.stack,
        formData: { ...formData, password: '[REDACTED]' }
      })
      toast.error('Sistem Hatası', errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Forgot password handler
  const handleForgotPassword = async () => {
    if (!formData.email) {
      toast.error('Email Gerekli', 'Şifre sıfırlama için email adresinizi girin')
      return
    }

    const emailValidation = validateForm({ email: formData.email }, { 
      email: loginFormConfig.email 
    })
    
    if (!emailValidation.isValid) {
      toast.error('Geçersiz Email', 'Geçerli bir email adresi girin')
      return
    }

    setResettingPassword(true)

    try {
      const { error } = await resetPassword(formData.email)
      
      if (error) {
        toast.error('Hata', 'Şifre sıfırlama emaili gönderilemedi')
        logAuthError('Password reset failed', { error, email: formData.email })
      } else {
        setResetEmailSent(true)
        setShowForgotPassword(false)
        toast.success('Email Gönderildi', 'Şifre sıfırlama linki email adresinize gönderildi!')
      }
    } catch (err: any) {
      toast.error('Hata', 'Şifre sıfırlama sırasında hata oluştu')
      logAuthError('Password reset exception', { error: err.message })
    } finally {
      setResettingPassword(false)
    }
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Giriş Yap</h2>
        <p className="text-gray-600">Hesabınıza giriş yapın</p>
      </div>

      {/* Reset Email Sent Notice */}
      {resetEmailSent && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
          <div className="flex items-start space-x-3">
            <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-blue-900">Şifre Sıfırlama Emaili Gönderildi</h3>
              <p className="text-sm text-blue-700 mt-1">
                {formData.email} adresine şifre sıfırlama linki gönderildi. 
                Email'inizi kontrol edin ve linke tıklayarak yeni şifrenizi belirleyin.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <FormField
          label="E-posta"
          name="email"
          type="email"
          value={formData.email}
          onChange={(value) => handleFieldChange('email', value)}
          onValidation={(result) => handleFieldValidation('email', result)}
          rules={loginFormConfig.email}
          formData={formData}
          placeholder="ornek@email.com"
          required
          icon={<Mail className="w-5 h-5" />}
          disabled={loading}
        />

        {/* Password Field */}
        <FormField
          label="Şifre"
          name="password"
          type="password"
          value={formData.password}
          onChange={(value) => handleFieldChange('password', value)}
          onValidation={(result) => handleFieldValidation('password', result)}
          rules={loginFormConfig.password}
          formData={formData}
          placeholder="Şifrenizi girin"
          required
          icon={<Lock className="w-5 h-5" />}
          disabled={loading}
        />

        {/* Forgot Password */}
        <div className="text-right">
          <button
            type="button"
            onClick={() => setShowForgotPassword(!showForgotPassword)}
            className="text-sm text-purple-600 hover:text-purple-700 transition-colors"
            disabled={loading}
          >
            Şifremi unuttum
          </button>
        </div>

        {/* Forgot Password Section */}
        {showForgotPassword && (
          <div className="p-4 bg-gray-50 rounded-lg border">
            <p className="text-sm text-gray-700 mb-3">
              Email adresinizi girin, şifre sıfırlama linki gönderelim:
            </p>
            <div className="flex space-x-2">
              <Button
                type="button"
                onClick={handleForgotPassword}
                disabled={resettingPassword || !formData.email}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                {resettingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Link Gönder
                  </>
                )}
              </Button>
              <Button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                variant="outline"
                disabled={resettingPassword}
              >
                İptal
              </Button>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading || !isFormValid()}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Giriş yapılıyor...
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5 mr-2" />
              Giriş Yap
            </>
          )}
        </Button>
      </form>

      {/* Switch to Register */}
      <div className="text-center pt-4 border-t border-gray-200 mt-6">
        <p className="text-gray-600">
          Hesabınız yok mu?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
            disabled={loading}
          >
            Kayıt olun
          </button>
        </p>
      </div>
    </div>
  )
}

export default AdvancedLoginForm
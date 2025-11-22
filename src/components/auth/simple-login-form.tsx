'use client'

import React, { useState } from 'react'
import { signIn, isValidEmail, resetPassword } from '@/lib/auth-helpers'
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, CheckCircle, Loader2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSafeToast } from '@/hooks/use-safe-toast'
import { useAuthRetry } from '@/hooks/use-retry'
import { logAuthError, logValidationError } from '@/lib/error-logger'

interface SimpleLoginFormProps {
  onSuccess?: () => void
  onSwitchToRegister?: () => void
}

interface FormErrors {
  email?: string
  password?: string
}

const SimpleLoginForm: React.FC<SimpleLoginFormProps> = ({ onSuccess, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({})
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmailSent, setResetEmailSent] = useState(false)
  const [resettingPassword, setResettingPassword] = useState(false)

  // Safe toast hook with fallback
  const toast = useSafeToast()

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null)
    
    // Clear field-specific errors
    if (fieldErrors[field as keyof FormErrors]) {
      setFieldErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validateField = (field: keyof FormErrors, value: string): string | undefined => {
    switch (field) {
      case 'email':
        if (!value.trim()) return 'Email alanı zorunludur'
        return !isValidEmail(value) ? 'Geçerli bir email adresi girin' : undefined
      case 'password':
        return !value ? 'Şifre alanı zorunludur' : undefined
      default:
        return undefined
    }
  }

  const validateForm = (): boolean => {
    const errors: FormErrors = {}
    
    Object.keys(formData).forEach(key => {
      const field = key as keyof FormErrors
      const error = validateField(field, formData[field])
      if (error) {
        errors[field] = error
      }
    })

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!validateForm()) {
      const validationError = 'Lütfen tüm alanları doğru şekilde doldurun'
      setError(validationError)
      logValidationError('Login form validation failed', { fieldErrors })
      toast.error('Form Hatası', validationError)
      return
    }

    setLoading(true)

    try {
      const { data, error } = await signInRetry.execute()

      if (error) {
        const errorMessage = typeof error === 'string' ? error : error.message || 'Giriş sırasında bir hata oluştu'
        setError(errorMessage)
        logAuthError('Login failed', { error: errorMessage, email: formData.email })
        toast.error('Giriş Hatası', errorMessage)
      } else if (data?.user) {
        const successMessage = 'Giriş başarılı! Yönlendiriliyorsunuz...'
        setSuccess(successMessage)
        
        // Ana sayfaya yönlendir
        setTimeout(() => {
          if (onSuccess) {
            onSuccess()
          } else {
            window.location.href = '/'
          }
        }, 1000)
      }
    } catch (err: any) {
      console.error('Login error:', err)
      const errorMessage = 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.'
      setError(errorMessage)
      logAuthError('Login exception', { error: err.message, stack: err.stack })
      toast.error('Sistem Hatası', errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError('Şifre sıfırlama için email adresinizi girin')
      return
    }

    if (!isValidEmail(formData.email)) {
      setError('Geçerli bir email adresi girin')
      return
    }

    setResettingPassword(true)
    setError(null)

    try {
      const { error } = await resetPassword(formData.email)
      if (error) {
        setError('Şifre sıfırlama emaili gönderilemedi')
      } else {
        setSuccess('Şifre sıfırlama linki email adresinize gönderildi!')
        setResetEmailSent(true)
        setShowForgotPassword(false)
      }
    } catch (err) {
      setError('Şifre sıfırlama sırasında hata oluştu')
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

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 mb-4">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-800 text-sm">{error}</span>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2 mb-4">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800 text-sm">{success}</span>
        </div>
      )}

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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            E-posta *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="ornek@email.com"
              className={`pl-10 h-12 border-2 focus:border-purple-400 ${
                fieldErrors.email ? 'border-red-300 focus:border-red-400' : ''
              }`}
              required
              disabled={loading}
            />
          </div>
          {fieldErrors.email && (
            <p className="text-red-600 text-sm mt-1">{fieldErrors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Şifre *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Şifrenizi girin"
              className={`pl-10 pr-10 h-12 border-2 focus:border-purple-400 ${
                fieldErrors.password ? 'border-red-300 focus:border-red-400' : ''
              }`}
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              disabled={loading}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="text-red-600 text-sm mt-1">{fieldErrors.password}</p>
          )}
        </div>

        {/* Forgot Password */}
        <div className="text-right">
          <button
            type="button"
            onClick={() => setShowForgotPassword(!showForgotPassword)}
            className="text-sm text-purple-600 hover:text-purple-700"
            disabled={loading}
          >
            Şifremi unuttum
          </button>
        </div>

        {/* Forgot Password Section */}
        {showForgotPassword && (
          <div className="p-4 bg-gray-50 rounded-lg">
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

        <Button
          type="submit"
          disabled={loading}
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
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Kayıt olun
          </button>
        </p>
      </div>
    </div>
  )
}

export default SimpleLoginForm
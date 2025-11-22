'use client'

import React, { useState, useEffect } from 'react'
import { signUp, isValidEmail, isStrongPassword } from '@/lib/auth-helpers'
import { User, Mail, Lock, Eye, EyeOff, UserPlus, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { useSafeToast } from '@/hooks/use-safe-toast'
import { useNetworkRetry } from '@/hooks/use-retry'
import { logAuthError, logValidationError } from '@/lib/error-logger'

interface SimpleRegisterFormProps {
  onSuccess?: () => void
  onSwitchToLogin?: () => void
}

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  confirmPassword?: string
}

interface ValidationState {
  email: { isValid: boolean; message: string }
  password: { isValid: boolean; message: string }
}

const SimpleRegisterForm: React.FC<SimpleRegisterFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({})
  const [validation, setValidation] = useState<ValidationState>({
    email: { isValid: false, message: '' },
    password: { isValid: false, message: '' }
  })



  // Safe toast hook with fallback
  const toast = useSafeToast()

  const signUpRetry = useNetworkRetry(
    () => signUp({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName
    }),
    {
      maxAttempts: 3,
      onRetry: (attempt, error) => {
        toast.warning('Bağlantı Sorunu', `Tekrar deneniyor... (${attempt}/3)`)
        logAuthError(`SignUp retry attempt ${attempt}: ${error.message}`)
      }
    }
  )

  // Real-time validation
  useEffect(() => {
    if (formData.email) {
      const emailValid = isValidEmail(formData.email)
      setValidation(prev => ({
        ...prev,
        email: {
          isValid: emailValid,
          message: emailValid ? 'Geçerli email formatı' : 'Geçersiz email formatı'
        }
      }))
    }

    if (formData.password) {
      const passwordCheck = isStrongPassword(formData.password)
      setValidation(prev => ({
        ...prev,
        password: passwordCheck
      }))
    }
  }, [formData.email, formData.password])

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
      case 'firstName':
        return !value.trim() ? 'Ad alanı zorunludur' : undefined
      case 'lastName':
        return !value.trim() ? 'Soyad alanı zorunludur' : undefined
      case 'email':
        if (!value.trim()) return 'Email alanı zorunludur'
        return !isValidEmail(value) ? 'Geçerli bir email adresi girin' : undefined

      case 'password':
        if (!value) return 'Şifre alanı zorunludur'
        return value.length < 6 ? 'Şifre en az 6 karakter olmalı' : undefined
      case 'confirmPassword':
        if (!value) return 'Şifre tekrarı zorunludur'
        return value !== formData.password ? 'Şifreler eşleşmiyor' : undefined
      default:
        return undefined
    }
  }

  const validateForm = (): boolean => {
    const errors: FormErrors = {}
    
    // Sadece zorunlu alanları kontrol et (telefon hariç)
    const requiredFields = ['firstName', 'lastName', 'email', 'password', 'confirmPassword']
    
    requiredFields.forEach(key => {
      const field = key as keyof FormErrors
      const error = validateField(field, formData[field])
      if (error) {
        errors[field] = error
      }
    })

    // Telefon alanını tamamen atla - opsiyonel

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
      logValidationError('Registration form validation failed', { fieldErrors })
      toast.error('Form Hatası', validationError)
      return
    }

    setLoading(true)

    try {
      const { data, error } = await signUpRetry.execute()

      if (error) {
        const errorMessage = typeof error === 'string' ? error : error.message || 'Kayıt sırasında bir hata oluştu'
        setError(errorMessage)
        logAuthError('Registration failed: ' + errorMessage)
        toast.error('Kayıt Hatası', errorMessage)
      } else if (data) {
        const successMessage = 'Kayıt başarılı! Şimdi giriş yapabilirsiniz.'
        setSuccess(successMessage)
        toast.success('Kayıt Başarılı', successMessage)
        
        // Form'u temizle
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: ''
        })
        
        // onSuccess callback'ini çağır
        if (onSuccess) {
          onSuccess()
        }
      }
    } catch (err: any) {
      console.error('Registration error:', err)
      const errorMessage = 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.'
      setError(errorMessage)
      logAuthError('Registration exception: ' + err.message)
      toast.error('Sistem Hatası', errorMessage)
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Kayıt Ol</h2>
        <p className="text-gray-600">Yeni hesap oluşturun</p>
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



      {/* Register Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ad *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Adınız"
                className={`pl-10 h-12 border-2 focus:border-purple-400 ${
                  fieldErrors.firstName ? 'border-red-300 focus:border-red-400' : ''
                }`}
                required
                disabled={loading}
              />
            </div>
            {fieldErrors.firstName && (
              <p className="text-red-600 text-sm mt-1">{fieldErrors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Soyad *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Soyadınız"
                className={`pl-10 h-12 border-2 focus:border-purple-400 ${
                  fieldErrors.lastName ? 'border-red-300 focus:border-red-400' : ''
                }`}
                required
                disabled={loading}
              />
            </div>
            {fieldErrors.lastName && (
              <p className="text-red-600 text-sm mt-1">{fieldErrors.lastName}</p>
            )}
          </div>
        </div>

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
                fieldErrors.email ? 'border-red-300 focus:border-red-400' : 
                formData.email && validation.email.isValid ? 'border-green-300' : ''
              }`}
              required
              disabled={loading}
            />
          </div>
          {fieldErrors.email && (
            <p className="text-red-600 text-sm mt-1">{fieldErrors.email}</p>
          )}
          {formData.email && !fieldErrors.email && (
            <p className={`text-sm mt-1 ${
              validation.email.isValid ? 'text-green-600' : 'text-red-600'
            }`}>
              {validation.email.message}
            </p>
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
              placeholder="En az 6 karakter"
              className={`pl-10 pr-10 h-12 border-2 focus:border-purple-400 ${
                fieldErrors.password ? 'border-red-300 focus:border-red-400' : 
                formData.password && validation.password.isValid ? 'border-green-300' : ''
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
          {formData.password && !fieldErrors.password && (
            <div className="mt-1">
              <div className="flex items-center space-x-2">
                <div className={`h-1 flex-1 rounded ${
                  validation.password.message === 'Güçlü şifre' ? 'bg-green-500' :
                  validation.password.message === 'Orta güçlükte şifre' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}></div>
              </div>
              <p className={`text-sm mt-1 ${
                validation.password.message === 'Güçlü şifre' ? 'text-green-600' :
                validation.password.message === 'Orta güçlükte şifre' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {validation.password.message}
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Şifre Tekrar *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Şifrenizi tekrar girin"
              className={`pl-10 pr-10 h-12 border-2 focus:border-purple-400 ${
                fieldErrors.confirmPassword ? 'border-red-300 focus:border-red-400' : 
                formData.confirmPassword && formData.confirmPassword === formData.password ? 'border-green-300' : ''
              }`}
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              disabled={loading}
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {fieldErrors.confirmPassword && (
            <p className="text-red-600 text-sm mt-1">{fieldErrors.confirmPassword}</p>
          )}
          {formData.confirmPassword && !fieldErrors.confirmPassword && formData.confirmPassword === formData.password && (
            <p className="text-green-600 text-sm mt-1">Şifreler eşleşiyor</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Kayıt yapılıyor...
            </>
          ) : (
            <>
              <UserPlus className="w-5 h-5 mr-2" />
              Kayıt Ol
            </>
          )}
        </Button>
      </form>

      {/* Switch to Login */}
      <div className="text-center pt-4 border-t border-gray-200 mt-6">
        <p className="text-gray-600">
          Zaten hesabınız var mı?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Giriş yapın
          </button>
        </p>
      </div>
    </div>
  )
}

export default SimpleRegisterForm
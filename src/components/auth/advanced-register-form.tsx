'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { User, Mail, Lock, UserPlus, CheckCircle, Info, Loader2, RefreshCw, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormField, PasswordStrength, EmailAvailability } from '@/components/ui/form-field'
import PhoneInput from '@/components/ui/phone-input'
import { useToast } from '@/components/ui/toast-provider'
import { useNetworkRetry } from '@/hooks/use-retry'
import { logAuthError, logValidationError } from '@/lib/error-logger'
import { signUp } from '@/lib/auth-helpers'
import {
  registrationFormConfig,
  validateForm,
  ValidationResult,
  checkEmailAvailability
} from '@/lib/form-validation'
import { usePerformanceTracking } from '@/lib/performance-monitor'
import { securityMiddleware, rateLimiter } from '@/lib/security-utils'

interface AdvancedRegisterFormProps {
  onSuccess?: () => void
  onSwitchToLogin?: () => void
}

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

interface ValidationState {
  [key: string]: ValidationResult
}

const AdvancedRegisterForm: React.FC<AdvancedRegisterFormProps> = ({ 
  onSuccess, 
  onSwitchToLogin 
}) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })

  const [validationState, setValidationState] = useState<ValidationState>({})
  const [loading, setLoading] = useState(false)

  const [resendingEmail, setResendingEmail] = useState(false)
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null)
  const [securityScore, setSecurityScore] = useState(0)
  const [remainingAttempts, setRemainingAttempts] = useState(5)

  const toast = useToast()
  const performance = usePerformanceTracking()

  // Performance tracking
  useEffect(() => {
    performance.trackFormStart()
  }, [performance])

  // Rate limiting check
  useEffect(() => {
    const identifier = 'registration_form'
    const remaining = rateLimiter.getRemainingAttempts(identifier)
    setRemainingAttempts(remaining)
  }, [])

  // Network retry for signup
  const signUpRetry = useNetworkRetry(
    () => signUp({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone
    }),
    {
      maxAttempts: 3,
      onRetry: (attempt, error) => {
        toast.warning('Bağlantı Sorunu', `Tekrar deneniyor... (${attempt}/3)`)
        logAuthError(`SignUp retry attempt ${attempt}`, { error: error.message })
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

  // Email availability check
  const handleEmailAvailabilityCheck = useCallback((available: boolean) => {
    setEmailAvailable(available)
  }, [])

  // Async email validator
  const emailAsyncValidator = useCallback(async (email: string) => {
    try {
      const result = await checkEmailAvailability(email)
      return {
        isValid: result.available,
        message: result.message
      }
    } catch (error) {
      return {
        isValid: true,
        message: 'Email kontrol edilemedi'
      }
    }
  }, [])

  // Form validation check
  const isFormValid = () => {
    const validation = validateForm(formData, registrationFormConfig)
    return validation.isValid && 
           Object.values(validationState).every(v => v.isValid) &&
           emailAvailable !== false
  }

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    performance.trackSubmitStart()

    // Rate limiting check
    const identifier = 'registration_form'
    if (!rateLimiter.isAllowed(identifier)) {
      const resetTime = rateLimiter.getResetTime(identifier)
      const waitTime = resetTime ? Math.ceil((resetTime - Date.now()) / 1000 / 60) : 15
      toast.error('Çok Fazla Deneme', `${waitTime} dakika sonra tekrar deneyin`)
      performance.trackSubmitEnd(false)
      return
    }

    // Security middleware check
    const securityCheck = securityMiddleware(formData, {
      ip: 'client_ip', // In real app, get from request
      userAgent: navigator.userAgent
    })

    if (!securityCheck.isValid) {
      logValidationError('Security validation failed', { 
        issues: securityCheck.issues,
        formData: { ...formData, password: '[REDACTED]', confirmPassword: '[REDACTED]' }
      })
      toast.error('Güvenlik Hatası', securityCheck.issues[0])
      performance.trackSubmitEnd(false)
      return
    }

    // Final validation
    const validation = validateForm(securityCheck.sanitizedData, registrationFormConfig)
    if (!validation.isValid) {
      logValidationError('Registration form validation failed', { 
        errors: validation.errors,
        formData: { ...formData, password: '[REDACTED]', confirmPassword: '[REDACTED]' }
      })
      toast.error('Form Hatası', 'Lütfen tüm alanları doğru şekilde doldurun')
      performance.trackSubmitEnd(false)
      return
    }

    if (emailAvailable === false) {
      toast.error('Email Hatası', 'Bu email adresi zaten kullanımda')
      performance.trackSubmitEnd(false)
      return
    }

    setLoading(true)

    try {
      const { data, error } = await signUpRetry.execute()

      if (error) {
        const errorMessage = typeof error === 'string' ? error : error.message || 'Kayıt sırasında bir hata oluştu'
        logAuthError('Registration failed', { 
          error: errorMessage, 
          email: formData.email,
          hasValidEmail: emailAvailable,
          securityScore
        })
        toast.error('Kayıt Hatası', errorMessage)
        performance.trackSubmitEnd(false)
        
        // Update remaining attempts
        setRemainingAttempts(rateLimiter.getRemainingAttempts(identifier))
      } else {
        const successMessage = 'Kayıt başarılı! Şimdi giriş yapabilirsiniz.'
        toast.success('Kayıt Başarılı', successMessage)
        performance.trackSubmitEnd(true)
        
        // Clear form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: ''
        })
        setValidationState({})
        setEmailAvailable(null)
        
        if (onSuccess) {
          onSuccess()
        }
      }
    } catch (err: any) {
      console.error('Registration error:', err)
      const errorMessage = 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.'
      logAuthError('Registration exception', { 
        error: err.message, 
        stack: err.stack,
        formData: { ...formData, password: '[REDACTED]', confirmPassword: '[REDACTED]' }
      })
      toast.error('Sistem Hatası', errorMessage)
      performance.trackSubmitEnd(false)
    } finally {
      setLoading(false)
    }
  }

  // Resend email confirmation
  const handleResendEmail = async () => {
    if (!formData.email) return

    setResendingEmail(true)
    try {
      // Simulated resend
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Email Gönderildi', 'Doğrulama emaili yeniden gönderildi!')
    } catch (err) {
      toast.error('Hata', 'Email gönderimi başarısız')
    } finally {
      setResendingEmail(false)
    }
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Kayıt Ol</h2>
        <p className="text-gray-600">Yeni hesap oluşturun</p>
      </div>



      {/* Security Status */}
      {remainingAttempts < 5 && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">
              Kalan deneme hakkı: {remainingAttempts}
            </span>
          </div>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Ad"
            name="firstName"
            value={formData.firstName}
            onChange={(value) => handleFieldChange('firstName', value)}
            onValidation={(result) => handleFieldValidation('firstName', result)}
            rules={registrationFormConfig.firstName}
            formData={formData}
            placeholder="Adınız"
            required
            icon={<User className="w-5 h-5" />}
            disabled={loading}
          />

          <FormField
            label="Soyad"
            name="lastName"
            value={formData.lastName}
            onChange={(value) => handleFieldChange('lastName', value)}
            onValidation={(result) => handleFieldValidation('lastName', result)}
            rules={registrationFormConfig.lastName}
            formData={formData}
            placeholder="Soyadınız"
            required
            icon={<User className="w-5 h-5" />}
            disabled={loading}
          />
        </div>

        {/* Email Field */}
        <div>
          <FormField
            label="E-posta"
            name="email"
            type="email"
            value={formData.email}
            onChange={(value) => handleFieldChange('email', value)}
            onValidation={(result) => handleFieldValidation('email', result)}
            rules={registrationFormConfig.email}
            formData={formData}
            placeholder="ornek@email.com"
            required
            icon={<Mail className="w-5 h-5" />}
            disabled={loading}
            asyncValidator={emailAsyncValidator}
          />
          <EmailAvailability 
            email={formData.email} 
            onCheck={handleEmailAvailabilityCheck}
          />
        </div>

        {/* Phone Field */}
        <PhoneInput
          label="Telefon (İsteğe bağlı)"
          value={formData.phone}
          onChange={(value) => handleFieldChange('phone', value)}
          disabled={loading}
        />

        {/* Password Field */}
        <div>
          <FormField
            label="Şifre"
            name="password"
            type="password"
            value={formData.password}
            onChange={(value) => handleFieldChange('password', value)}
            onValidation={(result) => handleFieldValidation('password', result)}
            rules={registrationFormConfig.password}
            formData={formData}
            placeholder="En az 6 karakter"
            required
            icon={<Lock className="w-5 h-5" />}
            disabled={loading}
          />
          <PasswordStrength password={formData.password} />
        </div>

        {/* Confirm Password Field */}
        <FormField
          label="Şifre Tekrar"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={(value) => handleFieldChange('confirmPassword', value)}
          onValidation={(result) => handleFieldValidation('confirmPassword', result)}
          rules={registrationFormConfig.confirmPassword}
          formData={formData}
          placeholder="Şifrenizi tekrar girin"
          required
          icon={<Lock className="w-5 h-5" />}
          disabled={loading}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading || !isFormValid()}
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
            disabled={loading}
          >
            Giriş yapın
          </button>
        </p>
      </div>
    </div>
  )
}

export default AdvancedRegisterForm
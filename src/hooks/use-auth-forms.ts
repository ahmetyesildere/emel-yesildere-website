import { useState, useCallback } from 'react'
import { useAuth } from '@/lib/auth/auth-context'
import { isValidEmail, isStrongPassword } from '@/lib/auth-helpers'

export interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  confirmPassword?: string
}

export interface ValidationState {
  email: { isValid: boolean; message: string }
  password: { isValid: boolean; message: string }
}

export function useAuthForms() {
  const { signIn, signUp, resendConfirmation, resetPassword } = useAuth()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const clearMessages = useCallback(() => {
    setError(null)
    setSuccess(null)
  }, [])

  const validateEmail = useCallback((email: string) => {
    if (!email) return { isValid: false, message: '' }
    const isValid = isValidEmail(email)
    return {
      isValid,
      message: isValid ? 'Geçerli email formatı' : 'Geçersiz email formatı'
    }
  }, [])

  const validatePassword = useCallback((password: string) => {
    if (!password) return { isValid: false, message: '' }
    return isStrongPassword(password)
  }, [])

  const validateField = useCallback((field: keyof FormErrors, value: string, formData?: any): string | undefined => {
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
        return value !== formData?.password ? 'Şifreler eşleşmiyor' : undefined
      default:
        return undefined
    }
  }, [])

  const validateForm = useCallback((formData: any): { isValid: boolean; errors: FormErrors } => {
    const errors: FormErrors = {}
    
    Object.keys(formData).forEach(key => {
      const field = key as keyof FormErrors
      const error = validateField(field, formData[field], formData)
      if (error) {
        errors[field] = error
      }
    })

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }, [validateField])

  const handleSignUp = useCallback(async (formData: {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
  }) => {
    setLoading(true)
    clearMessages()

    try {
      const validation = validateForm(formData)
      if (!validation.isValid) {
        setError('Lütfen tüm alanları doğru şekilde doldurun')
        return { success: false, errors: validation.errors }
      }

      const { error, data } = await signUp(
        formData.email,
        formData.password,
        {
          first_name: formData.firstName,
          last_name: formData.lastName
        }
      )

      if (error) {
        setError(error.message || 'Kayıt sırasında bir hata oluştu')
        return { success: false, error: error.message }
      }

      setSuccess('Kayıt başarılı! Email adresinizi kontrol edin.')
      return { success: true, data, needsEmailConfirmation: !data?.session }
    } catch (err: any) {
      setError('Beklenmeyen bir hata oluştu')
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [signUp, validateForm, clearMessages])

  const handleSignIn = useCallback(async (formData: {
    email: string
    password: string
  }) => {
    setLoading(true)
    clearMessages()

    try {
      if (!formData.email || !formData.password) {
        setError('Email ve şifre alanları zorunludur')
        return { success: false }
      }

      if (!isValidEmail(formData.email)) {
        setError('Geçerli bir email adresi girin')
        return { success: false }
      }

      const { error, data } = await signIn(formData.email, formData.password)

      if (error) {
        setError(error.message || 'Giriş sırasında bir hata oluştu')
        return { success: false, error: error.message }
      }

      setSuccess('Giriş başarılı! Yönlendiriliyorsunuz...')
      return { success: true, data }
    } catch (err: any) {
      setError('Beklenmeyen bir hata oluştu')
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [signIn, clearMessages])

  const handleResendConfirmation = useCallback(async (email: string) => {
    if (!email || !isValidEmail(email)) {
      setError('Geçerli bir email adresi girin')
      return { success: false }
    }

    setLoading(true)
    clearMessages()

    try {
      const { error } = await resendConfirmation(email)

      if (error) {
        setError('Email gönderimi başarısız')
        return { success: false }
      }

      setSuccess('Doğrulama emaili yeniden gönderildi!')
      return { success: true }
    } catch (err) {
      setError('Email gönderimi sırasında hata oluştu')
      return { success: false }
    } finally {
      setLoading(false)
    }
  }, [resendConfirmation, clearMessages])

  const handleResetPassword = useCallback(async (email: string) => {
    if (!email || !isValidEmail(email)) {
      setError('Geçerli bir email adresi girin')
      return { success: false }
    }

    setLoading(true)
    clearMessages()

    try {
      const { error } = await resetPassword(email)

      if (error) {
        setError('Şifre sıfırlama emaili gönderilemedi')
        return { success: false }
      }

      setSuccess('Şifre sıfırlama linki email adresinize gönderildi!')
      return { success: true }
    } catch (err) {
      setError('Şifre sıfırlama sırasında hata oluştu')
      return { success: false }
    } finally {
      setLoading(false)
    }
  }, [resetPassword, clearMessages])

  return {
    // State
    loading,
    error,
    success,
    
    // Actions
    handleSignUp,
    handleSignIn,
    handleResendConfirmation,
    handleResetPassword,
    clearMessages,
    
    // Validation helpers
    validateEmail,
    validatePassword,
    validateField,
    validateForm
  }
}
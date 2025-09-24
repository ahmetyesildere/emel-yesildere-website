'use client'

import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { ValidationResult, validateField, ValidationRule } from '@/lib/form-validation'
import { CheckCircle, AlertCircle, AlertTriangle, Eye, EyeOff, Loader2 } from 'lucide-react'

interface FormFieldProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'password'
  value: string
  onChange: (value: string) => void
  onValidation?: (result: ValidationResult) => void
  rules: ValidationRule[]
  formData?: any
  placeholder?: string
  disabled?: boolean
  required?: boolean
  showValidation?: boolean
  asyncValidator?: (value: string) => Promise<{ isValid: boolean; message: string }>
  icon?: React.ReactNode
}

export function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onValidation,
  rules,
  formData,
  placeholder,
  disabled = false,
  required = false,
  showValidation = true,
  asyncValidator,
  icon
}: FormFieldProps) {
  const [validation, setValidation] = useState<ValidationResult>({
    isValid: true,
    message: '',
    severity: 'success'
  })
  const [asyncValidating, setAsyncValidating] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [touched, setTouched] = useState(false)

  // Debounced validation
  useEffect(() => {
    if (!touched && !value) return

    const timeoutId = setTimeout(async () => {
      // Sync validation
      const syncResult = validateField(value, rules, formData)
      setValidation(syncResult)
      
      if (onValidation) {
        onValidation(syncResult)
      }

      // Async validation (sadece sync validation başarılıysa)
      if (syncResult.isValid && asyncValidator && value.trim()) {
        setAsyncValidating(true)
        try {
          const asyncResult = await asyncValidator(value)
          const finalResult: ValidationResult = {
            isValid: asyncResult.isValid,
            message: asyncResult.message,
            severity: asyncResult.isValid ? 'success' : 'error'
          }
          setValidation(finalResult)
          
          if (onValidation) {
            onValidation(finalResult)
          }
        } catch (error) {
          console.error('Async validation error:', error)
        } finally {
          setAsyncValidating(false)
        }
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(timeoutId)
  }, [value, rules, formData, asyncValidator, onValidation, touched])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    if (!touched) setTouched(true)
  }

  const handleBlur = () => {
    if (!touched) setTouched(true)
  }

  const getValidationIcon = () => {
    if (asyncValidating) {
      return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
    }

    if (!showValidation || !touched) return null

    switch (validation.severity) {
      case 'success':
        return validation.isValid ? <CheckCircle className="w-4 h-4 text-green-500" /> : null
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const getInputClassName = () => {
    let baseClass = "pl-10 pr-10 h-12 border-2 focus:border-purple-400 transition-colors"
    
    if (!showValidation || !touched) {
      return baseClass
    }

    switch (validation.severity) {
      case 'success':
        return validation.isValid 
          ? `${baseClass} border-green-300 focus:border-green-400`
          : baseClass
      case 'warning':
        return `${baseClass} border-yellow-300 focus:border-yellow-400`
      case 'error':
        return `${baseClass} border-red-300 focus:border-red-400`
      default:
        return baseClass
    }
  }

  const getMessageClassName = () => {
    switch (validation.severity) {
      case 'success':
        return 'text-green-600'
      case 'warning':
        return 'text-yellow-600'
      case 'error':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-2">
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        {/* Input */}
        <Input
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={getInputClassName()}
          disabled={disabled}
          name={name}
        />

        {/* Right Icons */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          {/* Password Toggle */}
          {type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={disabled}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}

          {/* Validation Icon */}
          {getValidationIcon()}
        </div>
      </div>

      {/* Validation Message */}
      {showValidation && touched && validation.message && (
        <p className={`text-sm ${getMessageClassName()}`}>
          {validation.message}
        </p>
      )}
    </div>
  )
}

// Password Strength Indicator Component
interface PasswordStrengthProps {
  password: string
  show?: boolean
}

export function PasswordStrength({ password, show = true }: PasswordStrengthProps) {
  if (!show || !password) return null

  const getStrength = () => {
    let score = 0
    let level = 'very-weak'
    let color = 'bg-red-500'
    let width = '20%'

    if (password.length >= 6) score += 20
    if (password.length >= 8) score += 20
    if (/[A-Z]/.test(password)) score += 20
    if (/[a-z]/.test(password)) score += 20
    if (/\d/.test(password)) score += 10
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 10

    if (score < 30) {
      level = 'Çok Zayıf'
      color = 'bg-red-500'
      width = '20%'
    } else if (score < 50) {
      level = 'Zayıf'
      color = 'bg-orange-500'
      width = '40%'
    } else if (score < 70) {
      level = 'Orta'
      color = 'bg-yellow-500'
      width = '60%'
    } else if (score < 90) {
      level = 'İyi'
      color = 'bg-blue-500'
      width = '80%'
    } else {
      level = 'Güçlü'
      color = 'bg-green-500'
      width = '100%'
    }

    return { level, color, width }
  }

  const strength = getStrength()

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-600">Şifre Güçlülüğü</span>
        <span className="text-xs font-medium">{strength.level}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
          style={{ width: strength.width }}
        />
      </div>
    </div>
  )
}

// Email Availability Checker Component
interface EmailAvailabilityProps {
  email: string
  onCheck?: (available: boolean) => void
}

export function EmailAvailability({ email, onCheck }: EmailAvailabilityProps) {
  const [checking, setChecking] = useState(false)
  const [result, setResult] = useState<{ available: boolean; message: string } | null>(null)

  useEffect(() => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setResult(null)
      return
    }

    const timeoutId = setTimeout(async () => {
      setChecking(true)
      try {
        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Mock result
        const available = !['test@example.com', 'admin@example.com'].includes(email.toLowerCase())
        const mockResult = {
          available,
          message: available ? 'Email adresi kullanılabilir' : 'Bu email adresi zaten kayıtlı'
        }
        
        setResult(mockResult)
        if (onCheck) onCheck(available)
      } catch (error) {
        console.error('Email availability check failed:', error)
      } finally {
        setChecking(false)
      }
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [email, onCheck])

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return null
  }

  return (
    <div className="mt-1">
      {checking && (
        <div className="flex items-center space-x-2 text-blue-600">
          <Loader2 className="w-3 h-3 animate-spin" />
          <span className="text-xs">Email kontrol ediliyor...</span>
        </div>
      )}
      
      {result && !checking && (
        <div className={`flex items-center space-x-2 ${result.available ? 'text-green-600' : 'text-red-600'}`}>
          {result.available ? (
            <CheckCircle className="w-3 h-3" />
          ) : (
            <AlertCircle className="w-3 h-3" />
          )}
          <span className="text-xs">{result.message}</span>
        </div>
      )}
    </div>
  )
}
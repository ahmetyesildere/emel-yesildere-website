'use client'

import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { maskPhoneInput, parsePhoneNumber, isValidPhoneNumber, PHONE_PLACEHOLDER } from '@/lib/phone-utils'
import { Phone } from 'lucide-react'

interface PhoneInputProps {
  value?: string
  onChange?: (value: string) => void
  onValidation?: (isValid: boolean) => void
  placeholder?: string
  disabled?: boolean
  required?: boolean
  className?: string
  label?: string
  error?: string
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value = '',
  onChange,
  onValidation,
  placeholder = PHONE_PLACEHOLDER,
  disabled = false,
  required = false,
  className = '',
  label,
  error
}) => {
  const [displayValue, setDisplayValue] = useState('')
  const [isValid, setIsValid] = useState(false)

  // Initialize display value
  useEffect(() => {
    if (value) {
      const masked = maskPhoneInput(value)
      setDisplayValue(masked)
    }
  }, [value])

  // Validate phone number
  useEffect(() => {
    const valid = isValidPhoneNumber(displayValue)
    setIsValid(valid)
    if (onValidation) {
      onValidation(valid)
    }
  }, [displayValue, onValidation])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    
    // Apply mask
    const masked = maskPhoneInput(inputValue)
    setDisplayValue(masked)
    
    // Parse and send raw value to parent
    if (onChange) {
      const parsed = parsePhoneNumber(masked)
      onChange(parsed)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow backspace, delete, tab, escape, enter
    if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
        // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (e.keyCode === 65 && e.ctrlKey === true) ||
        (e.keyCode === 67 && e.ctrlKey === true) ||
        (e.keyCode === 86 && e.ctrlKey === true) ||
        (e.keyCode === 88 && e.ctrlKey === true)) {
      return
    }
    
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault()
    }
  }

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="tel"
          value={displayValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={`pl-10 ${className} ${
            error ? 'border-red-300 focus:border-red-400' : 
            displayValue && isValid ? 'border-green-300 focus:border-green-400' : ''
          }`}
          maxLength={19} // +90 (xxx) xxx xx xx = 19 characters
        />
      </div>
      
      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}
      
      {displayValue && !error && (
        <p className={`text-sm ${
          isValid ? 'text-green-600' : 'text-red-600'
        }`}>
          {isValid ? 'Geçerli telefon numarası' : 'Geçersiz telefon numarası formatı'}
        </p>
      )}
      
      {!displayValue && !error && (
        <p className="text-gray-500 text-sm">
          Örnek: +90 (555) 123 45 67
        </p>
      )}
    </div>
  )
}

export default PhoneInput
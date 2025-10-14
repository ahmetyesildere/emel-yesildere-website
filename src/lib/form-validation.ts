// Gelişmiş Form Validasyon Sistemi

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: string, formData?: any) => string | null
  message?: string
}

export interface ValidationResult {
  isValid: boolean
  message: string
  severity: 'error' | 'warning' | 'success'
}

export interface FieldValidationConfig {
  [fieldName: string]: ValidationRule[]
}

// Email validasyon kuralları
export const emailValidationRules: ValidationRule[] = [
  {
    required: true,
    message: 'Email adresi zorunludur'
  },
  {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Geçerli bir email adresi girin'
  },
  {
    maxLength: 254,
    message: 'Email adresi çok uzun'
  },
  {
    custom: (email) => {
      // Yaygın email hatalarını kontrol et
      if (email.includes('..')) return 'Email adresinde ardışık nokta olamaz'
      if (email.startsWith('.') || email.endsWith('.')) return 'Email adresi nokta ile başlayamaz veya bitemez'
      if (email.includes('@.') || email.includes('.@')) return '@ işaretinin yanında nokta olamaz'
      
      // Yaygın domain hatalarını kontrol et
      const commonDomains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com']
      const domain = email.split('@')[1]?.toLowerCase()
      
      if (domain) {
        // Yaygın yazım hatalarını tespit et
        const typos: { [key: string]: string } = {
          'gmial.com': 'gmail.com',
          'gmai.com': 'gmail.com',
          'gmail.co': 'gmail.com',
          'hotmial.com': 'hotmail.com',
          'hotmai.com': 'hotmail.com',
          'yahooo.com': 'yahoo.com',
          'yaho.com': 'yahoo.com'
        }
        
        if (typos[domain]) {
          return `${typos[domain]} demek istediniz mi?`
        }
      }
      
      return null
    }
  }
]

// Şifre validasyon kuralları
export const passwordValidationRules: ValidationRule[] = [
  {
    required: true,
    message: 'Şifre zorunludur'
  },
  {
    minLength: 6,
    message: 'Şifre en az 6 karakter olmalı'
  },
  {
    maxLength: 128,
    message: 'Şifre çok uzun (maksimum 128 karakter)'
  },
  {
    custom: (password) => {
      // Yaygın zayıf şifreleri kontrol et
      const commonPasswords = [
        '123456', 'password', '123456789', '12345678', '12345',
        '1234567', '1234567890', 'qwerty', 'abc123', 'password123'
      ]
      
      if (commonPasswords.includes(password.toLowerCase())) {
        return 'Bu şifre çok yaygın kullanılıyor, daha güvenli bir şifre seçin'
      }
      
      // Tekrarlayan karakterleri kontrol et
      if (/(.)\1{3,}/.test(password)) {
        return 'Şifrede çok fazla tekrarlayan karakter var'
      }
      
      // Klavye dizilimini kontrol et
      const keyboardPatterns = ['qwerty', 'asdfgh', 'zxcvbn', '123456', '654321']
      for (const pattern of keyboardPatterns) {
        if (password.toLowerCase().includes(pattern)) {
          return 'Klavye dizilimi kullanmayın'
        }
      }
      
      return null
    }
  }
]

// İsim validasyon kuralları
export const nameValidationRules: ValidationRule[] = [
  {
    required: true,
    message: 'Bu alan zorunludur'
  },
  {
    minLength: 2,
    message: 'En az 2 karakter olmalı'
  },
  {
    maxLength: 50,
    message: 'Maksimum 50 karakter olabilir'
  },
  {
    pattern: /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/,
    message: 'Sadece harf ve boşluk kullanabilirsiniz'
  },
  {
    custom: (name) => {
      // Sadece boşluk kontrolü
      if (name.trim().length === 0) return 'Sadece boşluk girilemez'
      
      // Çok fazla boşluk kontrolü
      if (/\s{2,}/.test(name)) return 'Ardışık boşluklar kullanmayın'
      
      // Başında/sonunda boşluk kontrolü
      if (name !== name.trim()) return 'Başında veya sonunda boşluk olamaz'
      
      return null
    }
  }
]

// Şifre tekrar validasyon kuralları
export const confirmPasswordValidationRules: ValidationRule[] = [
  {
    required: true,
    message: 'Şifre tekrarı zorunludur'
  },
  {
    custom: (confirmPassword, formData) => {
      if (confirmPassword !== formData?.password) {
        return 'Şifreler eşleşmiyor'
      }
      return null
    }
  }
]

// Validasyon fonksiyonu
export function validateField(
  value: string,
  rules: ValidationRule[],
  formData?: any
): ValidationResult {
  for (const rule of rules) {
    // Required kontrolü
    if (rule.required && (!value || value.trim().length === 0)) {
      return {
        isValid: false,
        message: rule.message || 'Bu alan zorunludur',
        severity: 'error'
      }
    }
    
    // Boş değer için diğer kuralları atla
    if (!value || value.trim().length === 0) {
      continue
    }
    
    // MinLength kontrolü
    if (rule.minLength && value.length < rule.minLength) {
      return {
        isValid: false,
        message: rule.message || `En az ${rule.minLength} karakter olmalı`,
        severity: 'error'
      }
    }
    
    // MaxLength kontrolü
    if (rule.maxLength && value.length > rule.maxLength) {
      return {
        isValid: false,
        message: rule.message || `Maksimum ${rule.maxLength} karakter olabilir`,
        severity: 'error'
      }
    }
    
    // Pattern kontrolü
    if (rule.pattern && !rule.pattern.test(value)) {
      return {
        isValid: false,
        message: rule.message || 'Geçersiz format',
        severity: 'error'
      }
    }
    
    // Custom validasyon
    if (rule.custom) {
      const customResult = rule.custom(value, formData)
      if (customResult) {
        return {
          isValid: false,
          message: customResult,
          severity: 'error'
        }
      }
    }
  }
  
  return {
    isValid: true,
    message: 'Geçerli',
    severity: 'success'
  }
}

// Şifre güçlülük analizi
export function analyzePasswordStrength(password: string): {
  score: number
  level: 'very-weak' | 'weak' | 'fair' | 'good' | 'strong'
  feedback: string[]
  color: string
} {
  if (!password) {
    return {
      score: 0,
      level: 'very-weak',
      feedback: ['Şifre girin'],
      color: 'red'
    }
  }
  
  let score = 0
  const feedback: string[] = []
  
  // Uzunluk kontrolü
  if (password.length >= 8) {
    score += 25
  } else if (password.length >= 6) {
    score += 10
    feedback.push('Daha uzun şifre kullanın (en az 8 karakter)')
  } else {
    feedback.push('Çok kısa (en az 6 karakter)')
  }
  
  // Büyük harf kontrolü
  if (/[A-Z]/.test(password)) {
    score += 20
  } else {
    feedback.push('Büyük harf ekleyin')
  }
  
  // Küçük harf kontrolü
  if (/[a-z]/.test(password)) {
    score += 20
  } else {
    feedback.push('Küçük harf ekleyin')
  }
  
  // Rakam kontrolü
  if (/\d/.test(password)) {
    score += 20
  } else {
    feedback.push('Rakam ekleyin')
  }
  
  // Özel karakter kontrolü
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 15
  } else {
    feedback.push('Özel karakter ekleyin (!@#$%^&*)')
  }
  
  // Çeşitlilik bonusu
  const uniqueChars = new Set(password).size
  if (uniqueChars >= password.length * 0.7) {
    score += 10
  }
  
  // Seviye belirleme
  let level: 'very-weak' | 'weak' | 'fair' | 'good' | 'strong'
  let color: string
  
  if (score < 30) {
    level = 'very-weak'
    color = 'red'
  } else if (score < 50) {
    level = 'weak'
    color = 'orange'
  } else if (score < 70) {
    level = 'fair'
    color = 'yellow'
  } else if (score < 90) {
    level = 'good'
    color = 'blue'
  } else {
    level = 'strong'
    color = 'green'
  }
  
  return { score, level, feedback, color }
}

// Email availability check (simulated)
export async function checkEmailAvailability(email: string): Promise<{
  available: boolean
  message: string
}> {
  // Simulated API call
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Simulated logic - in real app, this would be an API call
  const unavailableEmails = [
    'test@example.com',
    'admin@example.com',
    'user@example.com'
  ]
  
  const available = !unavailableEmails.includes(email.toLowerCase())
  
  return {
    available,
    message: available ? 'Email adresi kullanılabilir' : 'Bu email adresi zaten kayıtlı'
  }
}

// Form validasyon konfigürasyonu
export const registrationFormConfig: FieldValidationConfig = {
  firstName: nameValidationRules,
  lastName: nameValidationRules,
  email: emailValidationRules,
  password: passwordValidationRules,
  confirmPassword: confirmPasswordValidationRules
}

export const loginFormConfig: FieldValidationConfig = {
  email: [
    { required: true, message: 'Email adresi zorunludur' },
    { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Geçerli bir email adresi girin' }
  ],
  password: [
    { required: true, message: 'Şifre zorunludur' }
  ]
}

// Tüm form validasyonu
export function validateForm(
  formData: { [key: string]: string },
  config: FieldValidationConfig
): {
  isValid: boolean
  errors: { [key: string]: string }
  warnings: { [key: string]: string }
} {
  const errors: { [key: string]: string } = {}
  const warnings: { [key: string]: string } = {}
  
  Object.keys(config).forEach(fieldName => {
    const value = formData[fieldName] || ''
    const rules = config[fieldName]
    const result = validateField(value, rules, formData)
    
    if (!result.isValid) {
      if (result.severity === 'error') {
        errors[fieldName] = result.message
      } else if (result.severity === 'warning') {
        warnings[fieldName] = result.message
      }
    }
  })
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings
  }
}
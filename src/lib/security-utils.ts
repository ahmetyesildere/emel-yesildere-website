// Güvenlik Utilities

// Input sanitization
export function sanitizeInput(input: string): string {
  if (!input) return ''
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Basic XSS protection
    .replace(/['"]/g, '') // SQL injection protection
    .replace(/javascript:/gi, '') // JavaScript protocol protection
    .replace(/on\w+=/gi, '') // Event handler protection
    .substring(0, 1000) // Length limit
}

// Email sanitization
export function sanitizeEmail(email: string): string {
  if (!email) return ''
  
  return email
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9@._-]/g, '') // Only allow valid email characters
    .substring(0, 254) // RFC 5321 limit
}

// Password strength validation
export function validatePasswordSecurity(password: string): {
  isSecure: boolean
  issues: string[]
  score: number
} {
  const issues: string[] = []
  let score = 0

  if (!password) {
    return { isSecure: false, issues: ['Şifre boş olamaz'], score: 0 }
  }

  // Length check
  if (password.length < 8) {
    issues.push('Şifre en az 8 karakter olmalı')
  } else if (password.length >= 12) {
    score += 20
  } else {
    score += 10
  }

  // Character variety checks
  if (!/[a-z]/.test(password)) {
    issues.push('En az bir küçük harf içermeli')
  } else {
    score += 10
  }

  if (!/[A-Z]/.test(password)) {
    issues.push('En az bir büyük harf içermeli')
  } else {
    score += 10
  }

  if (!/\d/.test(password)) {
    issues.push('En az bir rakam içermeli')
  } else {
    score += 10
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    issues.push('En az bir özel karakter içermeli')
  } else {
    score += 15
  }

  // Common password check
  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123',
    'password123', 'admin', 'letmein', 'welcome', 'monkey'
  ]
  
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    issues.push('Yaygın kullanılan şifre kalıpları içeriyor')
    score -= 20
  }

  // Sequential characters check
  if (/123|abc|qwe/i.test(password)) {
    issues.push('Ardışık karakterler içeriyor')
    score -= 10
  }

  // Repeated characters check
  if (/(.)\1{2,}/.test(password)) {
    issues.push('Çok fazla tekrarlayan karakter içeriyor')
    score -= 10
  }

  // Personal info check (basic)
  const personalPatterns = [
    /admin/i, /user/i, /test/i, /demo/i
  ]
  
  if (personalPatterns.some(pattern => pattern.test(password))) {
    issues.push('Kişisel bilgi içeriyor olabilir')
    score -= 15
  }

  // Entropy bonus
  const uniqueChars = new Set(password).size
  if (uniqueChars >= password.length * 0.8) {
    score += 10
  }

  const isSecure = issues.length === 0 && score >= 50

  return { isSecure, issues, score: Math.max(0, Math.min(100, score)) }
}

// Rate limiting
class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map()

  isAllowed(identifier: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
    const now = Date.now()
    const record = this.attempts.get(identifier)

    if (!record || now > record.resetTime) {
      // First attempt or window expired
      this.attempts.set(identifier, { count: 1, resetTime: now + windowMs })
      return true
    }

    if (record.count >= maxAttempts) {
      return false
    }

    record.count++
    return true
  }

  getRemainingAttempts(identifier: string, maxAttempts: number = 5): number {
    const record = this.attempts.get(identifier)
    if (!record || Date.now() > record.resetTime) {
      return maxAttempts
    }
    return Math.max(0, maxAttempts - record.count)
  }

  getResetTime(identifier: string): number | null {
    const record = this.attempts.get(identifier)
    if (!record || Date.now() > record.resetTime) {
      return null
    }
    return record.resetTime
  }

  reset(identifier: string) {
    this.attempts.delete(identifier)
  }
}

export const rateLimiter = new RateLimiter()

// CSRF protection
export function generateCSRFToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

export function validateCSRFToken(token: string, expectedToken: string): boolean {
  if (!token || !expectedToken) return false
  return token === expectedToken
}

// Content Security Policy helpers
export function getSecurityHeaders(): Record<string, string> {
  return {
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js requires unsafe-inline/eval
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; '),
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  }
}

// Input validation patterns
export const VALIDATION_PATTERNS = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  name: /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]{2,50}$/,
  phone: /^(\+90|0)?[5][0-9]{9}$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
}

// Secure random string generation
export function generateSecureRandomString(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return Array.from(array, byte => chars[byte % chars.length]).join('')
}

// Session security
export function validateSession(sessionData: any): boolean {
  if (!sessionData) return false
  
  // Check session expiry
  if (sessionData.expiresAt && new Date(sessionData.expiresAt) < new Date()) {
    return false
  }
  
  // Check required fields
  if (!sessionData.userId || !sessionData.email) {
    return false
  }
  
  return true
}

// Audit logging
interface AuditLog {
  timestamp: Date
  userId?: string
  action: string
  resource: string
  ip?: string
  userAgent?: string
  success: boolean
  details?: any
}

class AuditLogger {
  private logs: AuditLog[] = []
  private maxLogs = 1000

  log(entry: Omit<AuditLog, 'timestamp'>) {
    const auditEntry: AuditLog = {
      timestamp: new Date(),
      ...entry
    }

    this.logs.unshift(auditEntry)
    
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs)
    }

    // Development logging
    if (process.env.NODE_ENV === 'development') {
      console.log('🔒 Security Audit:', auditEntry)
    }
  }

  getLogs(filter?: {
    userId?: string
    action?: string
    success?: boolean
    limit?: number
  }): AuditLog[] {
    let filteredLogs = this.logs

    if (filter?.userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === filter.userId)
    }

    if (filter?.action) {
      filteredLogs = filteredLogs.filter(log => log.action === filter.action)
    }

    if (filter?.success !== undefined) {
      filteredLogs = filteredLogs.filter(log => log.success === filter.success)
    }

    if (filter?.limit) {
      filteredLogs = filteredLogs.slice(0, filter.limit)
    }

    return filteredLogs
  }

  getSecuritySummary() {
    const totalLogs = this.logs.length
    const failedAttempts = this.logs.filter(log => !log.success).length
    const successRate = totalLogs > 0 ? ((totalLogs - failedAttempts) / totalLogs) * 100 : 100

    const actionCounts = this.logs.reduce((acc, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      totalLogs,
      failedAttempts,
      successRate,
      actionCounts,
      recentFailures: this.logs.filter(log => !log.success).slice(0, 10)
    }
  }
}

export const auditLogger = new AuditLogger()

// Security middleware for forms
export function securityMiddleware(formData: any, userInfo?: any) {
  const issues: string[] = []

  // Rate limiting check
  const identifier = userInfo?.ip || 'anonymous'
  if (!rateLimiter.isAllowed(identifier)) {
    issues.push('Çok fazla deneme yapıldı. Lütfen bekleyin.')
  }

  // Input sanitization
  const sanitizedData = Object.keys(formData).reduce((acc, key) => {
    if (key === 'email') {
      acc[key] = sanitizeEmail(formData[key])
    } else if (typeof formData[key] === 'string') {
      acc[key] = sanitizeInput(formData[key])
    } else {
      acc[key] = formData[key]
    }
    return acc
  }, {} as any)

  // Password security check
  if (formData.password) {
    const passwordCheck = validatePasswordSecurity(formData.password)
    if (!passwordCheck.isSecure) {
      issues.push(...passwordCheck.issues)
    }
  }

  // Audit log
  auditLogger.log({
    userId: userInfo?.userId,
    action: 'form_submission',
    resource: 'registration_form',
    ip: userInfo?.ip,
    userAgent: userInfo?.userAgent,
    success: issues.length === 0,
    details: { issues, hasPassword: !!formData.password }
  })

  return {
    isValid: issues.length === 0,
    issues,
    sanitizedData
  }
}
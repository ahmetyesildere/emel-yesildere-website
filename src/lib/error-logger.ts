// Error Logging ve Monitoring Sistemi

export interface ErrorLog {
  id: string
  timestamp: Date
  level: 'error' | 'warning' | 'info'
  category: 'auth' | 'network' | 'validation' | 'database' | 'ui' | 'unknown'
  message: string
  details?: any
  userAgent?: string
  url?: string
  userId?: string
  sessionId?: string
  stack?: string
}

class ErrorLogger {
  private logs: ErrorLog[] = []
  private maxLogs = 100 // Maksimum log sayısı
  private sessionId: string

  constructor() {
    this.sessionId = this.generateSessionId()
    this.setupGlobalErrorHandlers()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private setupGlobalErrorHandlers() {
    // Global JavaScript hataları - sadece browser'da
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
      this.logError({
        category: 'ui',
        message: `Global Error: ${event.message}`,
        details: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error: event.error
        },
        stack: event.error?.stack
      })
    })

      // Promise rejection hataları
      window.addEventListener('unhandledrejection', (event) => {
        this.logError({
          category: 'unknown',
          message: `Unhandled Promise Rejection: ${event.reason}`,
          details: { reason: event.reason },
          stack: event.reason?.stack
        })
      })

      // Network hataları için fetch wrapper
      this.wrapFetch()
    }
  }

  private wrapFetch() {
    if (typeof window !== 'undefined' && window.fetch) {
      const originalFetch = window.fetch
      window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args)
        
        // HTTP hata kodlarını logla
        if (!response.ok) {
          this.logWarning({
            category: 'network',
            message: `HTTP Error: ${response.status} ${response.statusText}`,
            details: {
              url: args[0],
              status: response.status,
              statusText: response.statusText
            }
          })
        }
        
        return response
      } catch (error: any) {
        this.logError({
          category: 'network',
          message: `Network Error: ${error.message}`,
          details: {
            url: args[0],
            error: error.name,
            message: error.message
          },
          stack: error.stack
        })
        throw error
      }
      }
    }
  }

  private createLogEntry(
    level: ErrorLog['level'],
    category: ErrorLog['category'],
    message: string,
    details?: any,
    stack?: string
  ): ErrorLog {
    return {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      level,
      category,
      message,
      details,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'Unknown',
      sessionId: this.sessionId,
      stack
    }
  }

  logError(params: {
    category: ErrorLog['category']
    message: string
    details?: any
    stack?: string
    userId?: string
  }) {
    const logEntry = this.createLogEntry('error', params.category, params.message, params.details, params.stack)
    if (params.userId) logEntry.userId = params.userId
    
    this.addLog(logEntry)
    
    // Console'da da göster (development)
    if (process.env.NODE_ENV === 'development') {
      console.error('🚨 Error logged:', logEntry)
    }
  }

  logWarning(params: {
    category: ErrorLog['category']
    message: string
    details?: any
    userId?: string
  }) {
    const logEntry = this.createLogEntry('warning', params.category, params.message, params.details)
    if (params.userId) logEntry.userId = params.userId
    
    this.addLog(logEntry)
    
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Warning logged:', logEntry)
    }
  }

  logInfo(params: {
    category: ErrorLog['category']
    message: string
    details?: any
    userId?: string
  }) {
    const logEntry = this.createLogEntry('info', params.category, params.message, params.details)
    if (params.userId) logEntry.userId = params.userId
    
    this.addLog(logEntry)
    
    if (process.env.NODE_ENV === 'development') {
      console.info('ℹ️ Info logged:', logEntry)
    }
  }

  private addLog(log: ErrorLog) {
    this.logs.unshift(log) // En yeni log en başta
    
    // Maksimum log sayısını aş
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs)
    }
  }

  // Auth spesifik hata loglama
  logAuthError(message: string, details?: any, userId?: string) {
    this.logError({
      category: 'auth',
      message: `Auth Error: ${message}`,
      details,
      userId
    })
  }

  // Network spesifik hata loglama
  logNetworkError(message: string, details?: any) {
    this.logError({
      category: 'network',
      message: `Network Error: ${message}`,
      details
    })
  }

  // Validation spesifik hata loglama
  logValidationError(message: string, details?: any) {
    this.logError({
      category: 'validation',
      message: `Validation Error: ${message}`,
      details
    })
  }

  // Database spesifik hata loglama
  logDatabaseError(message: string, details?: any) {
    this.logError({
      category: 'database',
      message: `Database Error: ${message}`,
      details
    })
  }

  // Logları al
  getLogs(filter?: {
    level?: ErrorLog['level']
    category?: ErrorLog['category']
    limit?: number
  }): ErrorLog[] {
    let filteredLogs = this.logs

    if (filter?.level) {
      filteredLogs = filteredLogs.filter(log => log.level === filter.level)
    }

    if (filter?.category) {
      filteredLogs = filteredLogs.filter(log => log.category === filter.category)
    }

    if (filter?.limit) {
      filteredLogs = filteredLogs.slice(0, filter.limit)
    }

    return filteredLogs
  }

  // Logları temizle
  clearLogs() {
    this.logs = []
  }

  // Error istatistikleri
  getErrorStats() {
    const stats = {
      total: this.logs.length,
      byLevel: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
      recent: this.logs.slice(0, 5)
    }

    this.logs.forEach(log => {
      stats.byLevel[log.level] = (stats.byLevel[log.level] || 0) + 1
      stats.byCategory[log.category] = (stats.byCategory[log.category] || 0) + 1
    })

    return stats
  }

  // Logları export et (debugging için)
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }
}

// Singleton instance
export const errorLogger = new ErrorLogger()

// Utility functions
export const logAuthError = (message: string, details?: any, userId?: string) => {
  errorLogger.logAuthError(message, details, userId)
}

export const logNetworkError = (message: string, details?: any) => {
  errorLogger.logNetworkError(message, details)
}

export const logValidationError = (message: string, details?: any) => {
  errorLogger.logValidationError(message, details)
}

export const logDatabaseError = (message: string, details?: any) => {
  errorLogger.logDatabaseError(message, details)
}

export const logError = (category: ErrorLog['category'], message: string, details?: any) => {
  errorLogger.logError({ category, message, details })
}

export const logWarning = (category: ErrorLog['category'], message: string, details?: any) => {
  errorLogger.logWarning({ category, message, details })
}

export const logInfo = (category: ErrorLog['category'], message: string, details?: any) => {
  errorLogger.logInfo({ category, message, details })
}
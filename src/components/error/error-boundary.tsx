'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { errorLogger } from '@/lib/error-logger'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorId: string | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Error'ı logla
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    errorLogger.logError({
      category: 'ui',
      message: `React Error Boundary: ${error.message}`,
      details: {
        errorId,
        componentStack: errorInfo.componentStack,
        errorBoundary: this.constructor.name,
        props: this.props
      },
      stack: error.stack
    })

    this.setState({
      errorInfo,
      errorId
    })

    // Custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Development'ta console'a da yazdır
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  handleReportError = () => {
    const { error, errorInfo, errorId } = this.state
    
    // Error report oluştur
    const report = {
      errorId,
      message: error?.message,
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    }

    // Clipboard'a kopyala
    navigator.clipboard.writeText(JSON.stringify(report, null, 2)).then(() => {
      alert('Hata raporu panoya kopyalandı!')
    }).catch(() => {
      // Fallback: console'a yazdır
      console.log('Error Report:', report)
      alert('Hata raporu console\'a yazdırıldı!')
    })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback varsa onu kullan
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            {/* Error Icon */}
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-red-100 p-3">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>

            {/* Error Message */}
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                Bir Hata Oluştu
              </h1>
              <p className="text-gray-600 text-sm mb-4">
                Üzgünüz, beklenmeyen bir hata oluştu. Lütfen sayfayı yenilemeyi deneyin.
              </p>
              
              {/* Error Details (Development) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-red-50 border border-red-200 rounded p-3 mb-4 text-left">
                  <p className="text-red-800 text-xs font-mono">
                    <strong>Error:</strong> {this.state.error.message}
                  </p>
                  {this.state.errorId && (
                    <p className="text-red-600 text-xs mt-1">
                      <strong>ID:</strong> {this.state.errorId}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={this.handleRetry}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Tekrar Dene
              </Button>

              <Button
                onClick={this.handleGoHome}
                variant="outline"
                className="w-full"
              >
                <Home className="w-4 h-4 mr-2" />
                Ana Sayfaya Dön
              </Button>

              {process.env.NODE_ENV === 'development' && (
                <Button
                  onClick={this.handleReportError}
                  variant="outline"
                  className="w-full text-gray-600"
                >
                  <Bug className="w-4 h-4 mr-2" />
                  Hata Raporunu Kopyala
                </Button>
              )}
            </div>

            {/* Help Text */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Sorun devam ederse, lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Auth spesifik Error Boundary
export class AuthErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    errorLogger.logAuthError(
      `Auth Component Error: ${error.message}`,
      {
        componentStack: errorInfo.componentStack,
        stack: error.stack
      }
    )

    this.setState({ errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2 text-red-800">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">Kimlik Doğrulama Hatası</span>
          </div>
          <p className="text-red-700 text-sm mt-2">
            Giriş sistemi ile ilgili bir sorun oluştu. Lütfen sayfayı yenileyin.
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-3 bg-red-600 hover:bg-red-700 text-white text-sm"
          >
            Sayfayı Yenile
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

// HOC wrapper
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}
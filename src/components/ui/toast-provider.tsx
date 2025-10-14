'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => string
  removeToast: (id: string) => void
  clearToasts: () => void
  // Convenience methods
  success: (title: string, description?: string, duration?: number) => string
  error: (title: string, description?: string, duration?: number) => string
  warning: (title: string, description?: string, duration?: number) => string
  info: (title: string, description?: string, duration?: number) => string
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newToast: Toast = {
      id,
      duration: 5000, // Default 5 seconds
      ...toast
    }

    setToasts(prev => [...prev, newToast])

    // Auto remove after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }

    return id
  }, [removeToast])

  const clearToasts = useCallback(() => {
    setToasts([])
  }, [])

  const success = useCallback((title: string, description?: string, duration?: number) => {
    return addToast({ type: 'success', title, description, duration })
  }, [addToast])

  const error = useCallback((title: string, description?: string, duration?: number) => {
    return addToast({ type: 'error', title, description, duration: duration || 8000 }) // Errors stay longer
  }, [addToast])

  const warning = useCallback((title: string, description?: string, duration?: number) => {
    return addToast({ type: 'warning', title, description, duration })
  }, [addToast])

  const info = useCallback((title: string, description?: string, duration?: number) => {
    return addToast({ type: 'info', title, description, duration })
  }, [addToast])

  const value = {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    success,
    error,
    warning,
    info
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

export function ToastContainer() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />
    }
  }

  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'info':
        return 'bg-blue-50 border-blue-200'
    }
  }

  const getTextColor = () => {
    switch (toast.type) {
      case 'success':
        return 'text-green-900'
      case 'error':
        return 'text-red-900'
      case 'warning':
        return 'text-yellow-900'
      case 'info':
        return 'text-blue-900'
    }
  }

  return (
    <div className={`
      ${getBackgroundColor()} 
      border rounded-lg shadow-lg p-4 
      animate-in slide-in-from-right-full duration-300
      hover:shadow-xl transition-shadow
    `}>
      <div className="flex items-start space-x-3">
        {getIcon()}
        
        <div className="flex-1 min-w-0">
          <h4 className={`font-medium text-sm ${getTextColor()}`}>
            {toast.title}
          </h4>
          {toast.description && (
            <p className={`text-sm mt-1 ${getTextColor()} opacity-80`}>
              {toast.description}
            </p>
          )}
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className={`text-sm font-medium mt-2 ${getTextColor()} hover:underline`}
            >
              {toast.action.label}
            </button>
          )}
        </div>

        <button
          onClick={() => onRemove(toast.id)}
          className={`${getTextColor()} opacity-60 hover:opacity-100 transition-opacity`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// Convenience hooks
export function useSuccessToast() {
  const { success } = useToast()
  return success
}

export function useErrorToast() {
  const { error } = useToast()
  return error
}

export function useWarningToast() {
  const { warning } = useToast()
  return warning
}

export function useInfoToast() {
  const { info } = useToast()
  return info
}
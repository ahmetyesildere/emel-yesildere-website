'use client'

import React, { useState, useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'info'
  isVisible: boolean
  onClose: () => void
  duration?: number
}

export const Toast: React.FC<ToastProps> = ({ 
  message, 
  type, 
  isVisible, 
  onClose, 
  duration = 4000 
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  if (!isVisible) return null

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />
    }
  }

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[99999] transition-all duration-300 ease-in-out">
      <div className={`flex items-center p-4 rounded-xl border shadow-xl min-w-80 max-w-md ${getStyles()}`}>
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}



// Toast Hook
export const useToast = () => {
  const [toast, setToast] = useState<{
    message: string
    type: 'success' | 'error' | 'info'
    isVisible: boolean
  }>({
    message: '',
    type: 'info',
    isVisible: false
  })



  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type, isVisible: true })
  }

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }))
  }



  return {
    toast,
    showToast,
    hideToast,
    success: (message: string) => {
      showToast(message, 'success')
    },
    error: (message: string) => {
      showToast(message, 'error')
    },
    info: (message: string) => {
      showToast(message, 'info')
    }
  }
}
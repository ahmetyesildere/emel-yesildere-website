'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'warning' | 'danger' | 'info'
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Evet',
  cancelText = 'İptal',
  type = 'warning'
}) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!isOpen || !mounted) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('🔘 Confirm button clicked')
    onConfirm()
  }

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          iconColor: 'text-red-600',
          iconBg: 'bg-red-100',
          confirmButton: 'bg-red-600 hover:bg-red-700'
        }
      case 'info':
        return {
          iconColor: 'text-blue-600',
          iconBg: 'bg-blue-100',
          confirmButton: 'bg-blue-600 hover:bg-blue-700'
        }
      default:
        return {
          iconColor: 'text-orange-600',
          iconBg: 'bg-orange-100',
          confirmButton: 'bg-orange-600 hover:bg-orange-700'
        }
    }
  }

  const styles = getTypeStyles()

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4"
      style={{ zIndex: 2147483647 }}
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-6">
          {/* Icon */}
          <div className={`w-12 h-12 ${styles.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <AlertTriangle className={`w-6 h-6 ${styles.iconColor}`} />
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
            {title}
          </h3>

          {/* Message */}
          <p className="text-gray-600 text-center mb-6">
            {message}
          </p>

          {/* Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onClose()
              }}
              className="flex-1"
            >
              {cancelText}
            </Button>
            <Button
              onClick={handleConfirm}
              className={`flex-1 text-white ${styles.confirmButton}`}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  // Portal'ı güvenli bir şekilde render et
  if (typeof window === 'undefined') return null
  
  return createPortal(modalContent, document.body)
}

export default ConfirmDialog
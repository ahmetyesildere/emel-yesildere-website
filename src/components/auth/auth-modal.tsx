'use client'

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import SimpleLoginForm from './simple-login-form'
import SimpleRegisterForm from './simple-register-form'
import { useAuth } from '@/lib/auth/auth-context'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'login' | 'register'
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode)
  const [mounted, setMounted] = useState(false)
  const { user } = useAuth()

  // Reset mode when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode)
    }
  }, [isOpen, initialMode])

  // Close modal when user successfully logs in
  useEffect(() => {
    if (user && isOpen) {
      console.log('User logged in, closing modal')
      onClose()
    }
  }, [user, isOpen, onClose])

  // Mount check for portal
  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = '0px'
    } else {
      document.body.style.overflow = 'unset'
      document.body.style.paddingRight = '0px'
    }

    return () => {
      document.body.style.overflow = 'unset'
      document.body.style.paddingRight = '0px'
    }
  }, [isOpen])

  if (!isOpen || !mounted) return null

  const handleSuccess = () => {
    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/60 overflow-y-auto"
      style={{ 
        zIndex: 2147483647, // Maximum z-index value
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
      onClick={handleBackdropClick}
    >
      {/* Modal Container */}
      <div className="min-h-full flex items-center justify-center py-8 px-4">
        <div 
          className="relative bg-white rounded-xl shadow-2xl w-full max-w-md my-auto"
          style={{ 
            maxHeight: 'calc(100vh - 4rem)',
            minHeight: 'auto',
            zIndex: 2147483647
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="max-h-full overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Content */}
            <div className="p-6 pt-12">
              {mode === 'login' ? (
                <SimpleLoginForm
                  onSuccess={handleSuccess}
                  onSwitchToRegister={() => setMode('register')}
                />
              ) : (
                <SimpleRegisterForm
                  onSuccess={handleSuccess}
                  onSwitchToLogin={() => setMode('login')}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

export default AuthModal
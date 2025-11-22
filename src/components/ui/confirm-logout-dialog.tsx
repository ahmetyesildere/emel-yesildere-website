'use client'

import React from 'react'
import { LogOut, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ConfirmLogoutDialogProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmLogoutDialog: React.FC<ConfirmLogoutDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onCancel}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <LogOut className="w-6 h-6 text-red-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              Çıkış Onayı
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-600">
            Hesabınızdan çıkış yapmak istediğinizden emin misiniz?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Tekrar giriş yapmak için email ve şifrenizi kullanmanız gerekecek.
          </p>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1"
          >
            İptal
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Çıkış Yap
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmLogoutDialog
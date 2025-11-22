'use client'

import React from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface UserEditModalProps {
  isOpen: boolean
  user: any
  onClose: () => void
  onSave: () => void
}

const UserEditModal: React.FC<UserEditModalProps> = ({
  isOpen,
  user,
  onClose,
  onSave
}) => {
  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4" style={{ zIndex: 2147483647 }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl" style={{ zIndex: 2147483648 }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">
              Kullanıcı Düzenle - {user.first_name} {user.last_name}
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Bu basit bir test modal'ıdır. Kullanıcı: {user.email}
          </p>
          
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              İptal
            </Button>
            <Button onClick={onSave} className="bg-purple-600 hover:bg-purple-700">
              Kaydet
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserEditModal
'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { X, User, Mail, Save, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useSafeToast } from '@/hooks/use-safe-toast'

interface ProfileEditModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
}

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user, profile, isVisitor } = useAuth()
  const toast = useSafeToast()
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)


  // Initialize form data only when modal opens
  useEffect(() => {
    if (profile && isOpen) {
      setFormData({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        email: profile.email || '',
        phone: profile.phone || ''
      })
      setErrors({})
    }
  }, [isOpen]) // Remove profile dependency to prevent unnecessary re-renders

  // Don't render for visitors
  if (isVisitor) {
    return null
  }

  if (!isOpen) return null

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Ad alanı zorunludur'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Soyad alanı zorunludur'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email alanı zorunludur'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Geçerli bir email adresi girin'
    }

    if (formData.phone && !phoneValid) {
      newErrors.phone = 'Geçerli bir telefon numarası girin'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Form Hatası', 'Lütfen tüm alanları doğru şekilde doldurun')
      return
    }

    if (!user) {
      toast.error('Hata', 'Kullanıcı oturumu bulunamadı')
      return
    }

    setLoading(true)

    try {
      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) {
        console.error('Profile update error:', error)
        toast.error('Güncelleme Hatası', 'Profil güncellenirken bir hata oluştu')
        return
      }

      // Update auth user email if changed
      if (formData.email !== profile?.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: formData.email.trim().toLowerCase()
        })

        if (emailError) {
          console.error('Email update error:', emailError)
          toast.warning('Uyarı', 'Profil güncellendi ancak email güncellemesi başarısız oldu')
        }
      }

      toast.success('Başarılı', 'Profil bilgileriniz güncellendi')
      
      if (onSuccess) {
        onSuccess()
      }
      
      onClose()

    } catch (error) {
      console.error('Profile update exception:', error)
      toast.error('Sistem Hatası', 'Beklenmeyen bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Profili Düzenle
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ad *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Adınız"
                className={`pl-10 ${errors.firstName ? 'border-red-300' : ''}`}
                disabled={loading}
                required
              />
            </div>
            {errors.firstName && (
              <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Soyad *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Soyadınız"
                className={`pl-10 ${errors.lastName ? 'border-red-300' : ''}`}
                disabled={loading}
                required
              />
            </div>
            {errors.lastName && (
              <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-posta *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="ornek@email.com"
                className={`pl-10 ${errors.email ? 'border-red-300' : ''}`}
                disabled={loading}
                required
              />
            </div>
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefon
            </label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+90 (5xx) xxx xx xx"
              className={errors.phone ? 'border-red-300' : ''}
              disabled={loading}
            />
            {errors.phone && (
              <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
            )}
            <p className="text-gray-500 text-sm mt-1">
              Örnek: +90 (555) 123 45 67
            </p>
          </div>

          {/* Role Info */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Rol:</strong> {
                profile?.role === 'admin' ? 'Admin' :
                profile?.role === 'consultant' ? 'Danışman' :
                profile?.role === 'client' ? 'Danışan' : 'Ziyaretçi'
              }
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Rol değişikliği için admin ile iletişime geçin.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              İptal
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Kaydet
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProfileEditModal
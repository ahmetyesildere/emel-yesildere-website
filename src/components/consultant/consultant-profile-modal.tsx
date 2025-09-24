'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { X, User, Mail, Phone, FileText, Upload, Camera, Save, Loader2, Plus, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useSafeToast } from '@/hooks/use-safe-toast'
import { Toast, useToast } from '@/components/ui/toast'

interface ConsultantProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  bio: string
  specialties: string[]
  certificates: string[]
  profilePhoto: File | null
  documents: File[]
}

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  bio?: string
}

const ConsultantProfileModal: React.FC<ConsultantProfileModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user, profile, updateProfile } = useAuth()
  const toast = useSafeToast()
  const { toast: customToast, showToast, hideToast, success, error, info } = useToast()
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    specialties: [],
    certificates: [],
    profilePhoto: null,
    documents: []
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [newSpecialty, setNewSpecialty] = useState('')
  const [newCertificate, setNewCertificate] = useState('')
  const [deletePhoto, setDeletePhoto] = useState(false)

  // Profile yüklendiğinde form data'yı güncelle
  useEffect(() => {
    if (profile && isOpen) {
      setFormData({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        specialties: profile.specialties || [],
        certificates: profile.certificates || [],
        profilePhoto: null,
        documents: []
      })
    }
  }, [profile, isOpen])

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
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Geçerli bir email adresi girin'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const deleteProfilePhoto = async (): Promise<boolean> => {
    if (!profile?.avatar_url) {
      return false
    }

    if (!confirm('Profil fotoğrafını silmek istediğinizden emin misiniz?')) {
      return false
    }

    try {
      // Extract file path from storage URL
      // URL format: https://[project].supabase.co/storage/v1/object/public/avatars/[userName]/[fileName]
      const url = new URL(profile.avatar_url)
      const pathParts = url.pathname.split('/')
      const avatarsIndex = pathParts.indexOf('avatars')
      
      if (avatarsIndex !== -1 && avatarsIndex < pathParts.length - 1) {
        // Get path after 'avatars': userName/fileName
        const filePath = pathParts.slice(avatarsIndex + 1).join('/')
        
        console.log('🗑️ Consultant storage\'dan siliniyor:', filePath)
        
        // Delete from Supabase Storage
        const { error: deleteError } = await supabase.storage
          .from('avatars')
          .remove([filePath])

        if (deleteError) {
          console.error('❌ Consultant storage delete error:', deleteError)
          // Continue even if storage delete fails
        } else {
          console.log('✅ Consultant storage\'dan silindi')
        }
      }

      return true
    } catch (error) {
      console.error('❌ Consultant photo delete error:', error)
      return false
    }
  }

  const uploadProfilePhoto = async (file: File): Promise<string | null> => {
    console.log('🔄 Consultant profil fotoğrafı storage\'a yükleniyor...', { fileName: file.name })
    try {
      // Create file path: avatars/[kullanıcı_adı]/[kullanıcı_adı].jpg
      // Convert Turkish characters to English equivalents
      const turkishToEnglish = (text: string) => {
        const turkishChars = 'çğıöşüÇĞIİÖŞÜ'
        const englishChars = 'cgiosuCGIIOSU'
        let result = text
        for (let i = 0; i < turkishChars.length; i++) {
          result = result.replace(new RegExp(turkishChars[i], 'g'), englishChars[i])
        }
        return result.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_.-]/g, '')
      }
      
      const userName = turkishToEnglish(`${formData.firstName}_${formData.lastName}`)
      const fileExtension = file.name.split('.').pop()
      const timestamp = Date.now()
      const fileName = `${userName}_${timestamp}.${fileExtension}`
      const filePath = fileName // Timestamp ile unique dosya adı

      console.log('📤 Consultant storage\'a yükleniyor:', filePath)

      // Delete ALL existing photos for this user first
      try {
        console.log('🗑️ Consultant tüm eski fotoğrafları siliniyor...')
        
        // List all files in avatars bucket
        const { data: files, error: listError } = await supabase.storage
          .from('avatars')
          .list()

        if (!listError && files) {
          // Find files that belong to this user (start with userName)
          const userFiles = files.filter(file => 
            file.name.startsWith(userName) && file.name !== filePath
          )
          
          if (userFiles.length > 0) {
            const filesToDelete = userFiles.map(file => file.name)
            console.log('🗑️ Consultant silinecek dosyalar:', filesToDelete)
            
            const { error: deleteError } = await supabase.storage
              .from('avatars')
              .remove(filesToDelete)
              
            if (deleteError) {
              console.error('❌ Consultant eski dosyalar silinemedi:', deleteError)
            } else {
              console.log('✅ Consultant eski dosyalar silindi:', filesToDelete.length)
            }
          } else {
            console.log('ℹ️ Consultant silinecek eski dosya yok')
          }
        }
      } catch (deleteError) {
        console.error('❌ Consultant eski dosya silme hatası:', deleteError)
      }

      // Upload to Supabase Storage with timeout and cache-busting
      const uploadPromise = supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '0', // No cache to prevent issues
          upsert: true
        })

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Upload timeout - 15 saniye')), 15000)
      )

      const { data: uploadData, error: uploadError } = await Promise.race([
        uploadPromise,
        timeoutPromise
      ]) as any

      if (uploadError) {
        console.error('❌ Consultant storage upload error:', uploadError)
        return null
      }
      console.log('✅ Consultant storage\'a başarıyla yüklendi:', uploadData)

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      console.log('🔗 Consultant public URL alındı:', publicUrl)
      return publicUrl
    } catch (error) {
      console.error('❌ Consultant photo upload error:', error)
      return null
    }
  }

  const uploadDocuments = async (files: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = []

    for (const file of files) {
      try {
        const fileName = `${file.name.split('.')[0]}_${Date.now()}.${file.name.split('.').pop()}`
        const filePath = `documents/consultant-documents/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file)

        if (uploadError) {
          console.error('Document upload error:', uploadError)
          continue
        }

        const { data: { publicUrl } } = supabase.storage
          .from('documents')
          .getPublicUrl(filePath)

        uploadedUrls.push(publicUrl)
      } catch (error) {
        console.error('Document upload exception:', error)
      }
    }

    return uploadedUrls
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      let profilePhotoUrl = profile?.avatar_url || ''
      let documentUrls: string[] = []

      // Profil fotoğrafını sil
      if (deletePhoto) {
        const deleted = await deleteProfilePhoto()
        if (deleted) {
          profilePhotoUrl = ''
          // Reset deletePhoto state immediately
          setDeletePhoto(false)
        }
      }

      // Profil fotoğrafı yükle
      if (formData.profilePhoto) {
        const uploadedPhotoUrl = await uploadProfilePhoto(formData.profilePhoto)
        if (uploadedPhotoUrl) {
          profilePhotoUrl = uploadedPhotoUrl
        }
      }

      // Belgeleri yükle
      if (formData.documents.length > 0) {
        documentUrls = await uploadDocuments(formData.documents)
      }

      // Profil güncelle
      const updateData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio,
        specialties: formData.specialties,
        certificates: formData.certificates,
        avatar_url: profilePhotoUrl,
        document_urls: documentUrls.length > 0 ? documentUrls : profile?.document_urls || []
      }

      const { error } = await updateProfile(updateData)

      if (error) {
        toast.error('Hata', 'Profil güncellenirken hata oluştu: ' + error.message)
      } else {
        toast.success('Başarılı', 'Profil başarıyla güncellendi!')
        onSuccess?.()
        onClose()
      }
    } catch (error) {
      console.error('Profile update exception:', error)
      toast.error('Hata', 'Beklenmeyen bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error for this field
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const addSpecialty = () => {
    if (newSpecialty.trim() && !formData.specialties.includes(newSpecialty.trim())) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }))
      setNewSpecialty('')
    }
  }

  const removeSpecialty = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index)
    }))
  }

  const addCertificate = () => {
    if (newCertificate.trim() && !formData.certificates.includes(newCertificate.trim())) {
      setFormData(prev => ({
        ...prev,
        certificates: [...prev.certificates, newCertificate.trim()]
      }))
      setNewCertificate('')
    }
  }

  const removeCertificate = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certificates: prev.certificates.filter((_, i) => i !== index)
    }))
  }

  // Compress image
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        // Calculate new dimensions (max 800x800)
        const maxSize = 800
        let { width, height } = img
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width
            width = maxSize
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height
            height = maxSize
          }
        }

        canvas.width = width
        canvas.height = height

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              })
              resolve(compressedFile)
            } else {
              resolve(file)
            }
          },
          'image/jpeg',
          0.8 // 80% quality
        )
      }

      img.src = URL.createObjectURL(file)
    })
  }

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // File size check (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Hata', 'Profil fotoğrafı 5MB\'dan küçük olmalıdır')
      e.target.value = ''
      return
    }

    // File type check
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Hata', 'Sadece JPG, PNG dosyaları yükleyebilirsiniz')
      e.target.value = ''
      return
    }

    // Set file directly without compression for now
    setFormData(prev => ({ ...prev, profilePhoto: file }))
    toast.success('Başarılı', 'Fotoğraf seçildi')
  }

  const handleDocumentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData(prev => ({ ...prev, documents: files }))
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Danışman Profili Düzenle
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ad *
              </label>
              <Input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Adınız"
                className={errors.firstName ? 'border-red-300' : ''}
                disabled={loading}
                required
              />
              {errors.firstName && (
                <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Soyad *
              </label>
              <Input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Soyadınız"
                className={errors.lastName ? 'border-red-300' : ''}
                disabled={loading}
                required
              />
              {errors.lastName && (
                <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-posta *
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="ornek@email.com"
                className={errors.email ? 'border-red-300' : ''}
                disabled={loading}
                required
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefon
              </label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+90 (5xx) xxx xx xx"
                disabled={loading}
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Biyografi
            </label>
            <Textarea
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Kendinizi tanıtın..."
              rows={4}
              disabled={loading}
            />
          </div>

          {/* Profile Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profil Fotoğrafı
            </label>
            <div className="flex items-center space-x-4">
              {/* Photo Preview */}
              <div className="relative">
                <div className="w-20 h-24 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center overflow-hidden">
                  {(profile?.avatar_url && !deletePhoto) ? (
                    <img
                      src={profile.avatar_url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-white">
                      <User className="w-8 h-8 mb-1" />
                      <span className="text-xs text-center">Fotoğraf Yok</span>
                    </div>
                  )}
                </div>

                {/* Delete Photo Button - only show if photo exists */}
                {(profile?.avatar_url && !deletePhoto) && (
                  <button
                    type="button"
                    onClick={() => setDeletePhoto(true)}
                    disabled={loading}
                    className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors"
                    title="Profil fotoğrafını sil"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePhotoChange}
                  className="hidden"
                  id="profile-photo"
                  disabled={loading}
                />
                <label
                  htmlFor="profile-photo"
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Fotoğraf Seç
                </label>
                
                {formData.profilePhoto && (
                  <p className="text-sm text-green-600 mt-1">
                    ✓ {formData.profilePhoto.name} seçildi
                  </p>
                )}
                
                {deletePhoto && (
                  <div className="mt-2">
                    <p className="text-sm text-red-600">
                      ⚠️ Mevcut fotoğraf silinecek
                    </p>
                    <button
                      type="button"
                      onClick={() => setDeletePhoto(false)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      İptal et
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Specialties */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Uzmanlık Alanları
            </label>
            <div className="space-y-4">
              {/* Belge Türü ve Dosya Yükleme - Yan Yana */}
              <div className="grid grid-cols-2 gap-4">
                {/* Belge Türü Seçimi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Belge Türü (Opsiyonel)
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Belge türü seçin</option>
                    <option value="diploma">Diploma</option>
                    <option value="sertifika">Sertifika</option>
                    <option value="lisans">Lisans Belgesi</option>
                    <option value="kurs">Kurs Belgesi</option>
                    <option value="diger">Diğer</option>
                  </select>
                </div>

                {/* Dosya Yükleme */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Belge Yükle (Opsiyonel)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      className="hidden"
                      id="specialty-document"
                      disabled={loading}
                    />
                    <label
                      htmlFor="specialty-document"
                      className="flex items-center px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 text-sm"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Dosya Seç
                    </label>
                  </div>
                  {/* Seçilen dosya bilgisi gösterimi için placeholder */}
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700 hidden">
                    <div className="font-medium">Seçilen dosya:</div>
                    <div>dosya_adi.pdf (2.5 MB)</div>
                  </div>
                </div>
              </div>

              {/* Açıklama */}
              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
                <strong>Not:</strong> Belge türü seçmeden de dosya yükleyebilirsiniz. 
                Desteklenen formatlar: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
              </div>

              {/* Uzmanlık Alanı Ekleme */}
              <div className="flex space-x-2">
                <Input
                  type="text"
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  placeholder="Yeni uzmanlık alanı"
                  disabled={loading}
                />
                <Button
                  type="button"
                  onClick={addSpecialty}
                  disabled={loading || !newSpecialty.trim()}
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Mevcut Uzmanlık Alanları */}
              <div className="flex flex-wrap gap-2">
                {formData.specialties.map((specialty, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {specialty}
                    <button
                      type="button"
                      onClick={() => removeSpecialty(index)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                      disabled={loading}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Certificates */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sertifikalar
            </label>
            <div className="space-y-2">
              <div className="flex space-x-2">
                <Input
                  type="text"
                  value={newCertificate}
                  onChange={(e) => setNewCertificate(e.target.value)}
                  placeholder="Yeni sertifika"
                  disabled={loading}
                />
                <Button
                  type="button"
                  onClick={addCertificate}
                  disabled={loading || !newCertificate.trim()}
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.certificates.map((certificate, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                  >
                    {certificate}
                    <button
                      type="button"
                      onClick={() => removeCertificate(index)}
                      className="ml-2 text-green-600 hover:text-green-800"
                      disabled={loading}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Documents */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Belgeler (Sertifika, Diploma vb.)
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                multiple
                onChange={handleDocumentsChange}
                className="hidden"
                id="documents"
                disabled={loading}
              />
              <label
                htmlFor="documents"
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
              >
                <Upload className="w-4 h-4 mr-2" />
                Belge Seç
              </label>
              {formData.documents.length > 0 && (
                <span className="text-sm text-gray-600">
                  {formData.documents.length} dosya seçildi
                </span>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              İptal
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
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
    
      {/* Toast Notification - Modal dışında */}
      <Toast
        message={customToast.message}
        type={customToast.type}
        isVisible={customToast.isVisible}
        onClose={hideToast}
      />
    </>
  )
}

export default ConsultantProfileModal
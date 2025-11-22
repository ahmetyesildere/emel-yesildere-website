'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Plus, User, Camera, Award, Settings, Save, Trash2, Eye, Upload, FileText } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Toast } from '@/components/ui/toast'


interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string | null
  tc_no: string | null
  bio: string | null
  role: 'visitor' | 'client' | 'consultant' | 'admin' | 'staff'
  is_active: boolean
  email_verified: boolean
  avatar_url?: string
  profile_photo_url?: string
}

interface SpecialtyDocument {
  specialty: string
  experienceYears: number
  experienceMonths: number
  documentType?: string
  file?: File
}

interface UserEditModalProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
  onSave: (user: User) => void
  toastFunctions: {
    success: (message: string) => void
    error: (message: string) => void
    info: (message: string) => void
  }
}

const UserEditModal: React.FC<UserEditModalProps> = ({ user, isOpen, onClose, onSave, toastFunctions }) => {
  // Toast functions from parent
  const { success: parentSuccess, error: parentError, info: parentInfo } = toastFunctions

  // Local toast functions
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000)
  }

  const success = (message: string) => showToast(message, 'success')
  const showError = (message: string) => showToast(message, 'error')
  const info = (message: string) => showToast(message, 'info')



  // Form state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    tc_no: '',
    bio: '',
    role: 'visitor' as User['role'],
    is_active: true,
    email_verified: false
  })

  // Tab state
  const [activeTab, setActiveTab] = useState('basic')

  // Loading states
  const [savingBasic, setSavingBasic] = useState(false)
  const [savingPhoto, setSavingPhoto] = useState(false)
  const [savingSpecialties, setSavingSpecialties] = useState(false)

  // Success messages
  const [successMessages, setSuccessMessages] = useState({
    basic: false,
    photo: false,
    specialties: false
  })

  // Toast state
  const [toast, setToast] = useState<{
    show: boolean
    message: string
    type: 'success' | 'error' | 'info'
  }>({
    show: false,
    message: '',
    type: 'success'
  })

  // Profile photo state
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null)
  const [profilePhotoPreview, setProfilePhotoPreview] = useState('')

  // Specialty state
  const [specialtyDocuments, setSpecialtyDocuments] = useState<SpecialtyDocument[]>([])
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [selectedDocumentType, setSelectedDocumentType] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [experienceYears, setExperienceYears] = useState(1)
  const [experienceMonths, setExperienceMonths] = useState(0)
  const [existingSpecialties, setExistingSpecialties] = useState<any[]>([])
  const [existingDocuments, setExistingDocuments] = useState<any[]>([])

  // Role options
  const roleOptions = [
    { value: 'visitor', label: 'Ziyaretçi', color: 'bg-gray-100 text-gray-800' },
    { value: 'client', label: 'Müşteri', color: 'bg-blue-100 text-blue-800' },
    { value: 'consultant', label: 'Danışman', color: 'bg-green-100 text-green-800' },
    { value: 'admin', label: 'Admin', color: 'bg-red-100 text-red-800' },
    { value: 'staff', label: 'Personel', color: 'bg-purple-100 text-purple-800' }
  ]

  // Specialty areas - state olarak tanımla ki dinamik olarak güncellenebilsin
  const [specialtyAreas, setSpecialtyAreas] = useState([
    'Psikoloji',
    'Psikiyatri',
    'Aile Danışmanlığı',
    'Çift Terapisi',
    'Çocuk Psikolojisi',
    'Ergen Psikolojisi',
    'Travma Terapisi',
    'Bağımlılık Danışmanlığı',
    'Kariyer Danışmanlığı',
    'Eğitim Danışmanlığı'
  ])

  // Yeni uzmanlık alanı ekleme state'leri
  const [newSpecialtyArea, setNewSpecialtyArea] = useState('')
  const [showAddSpecialtyInput, setShowAddSpecialtyInput] = useState(false)

  // Load specialty areas from localStorage on component mount
  useEffect(() => {
    try {
      const savedCustomAreas = localStorage.getItem('custom_specialty_areas')
      const deletedDefaultAreas = JSON.parse(localStorage.getItem('deleted_default_specialty_areas') || '[]')
      
      const defaultAreas = [
        'Psikoloji',
        'Psikiyatri',
        'Aile Danışmanlığı',
        'Çift Terapisi',
        'Çocuk Psikolojisi',
        'Ergen Psikolojisi',
        'Travma Terapisi',
        'Bağımlılık Danışmanlığı',
        'Kariyer Danışmanlığı',
        'Eğitim Danışmanlığı'
      ]
      
      // Silinen varsayılan alanları çıkar
      const activeDefaultAreas = defaultAreas.filter(area => !deletedDefaultAreas.includes(area))
      
      // Özel alanları ekle
      const customAreas = savedCustomAreas ? JSON.parse(savedCustomAreas) : []
      
      // Birleştir ve unique yap
      const allAreas = [...activeDefaultAreas, ...customAreas]
      const uniqueAreas = [...new Set(allAreas)]
      
      setSpecialtyAreas(uniqueAreas)
      console.log('📚 Uzmanlık alanları yüklendi:', {
        activeDefault: activeDefaultAreas.length,
        custom: customAreas.length,
        deleted: deletedDefaultAreas.length,
        total: uniqueAreas.length
      })
    } catch (error) {
      console.error('Specialty areas yüklenirken hata:', error)
    }
  }, [])

  // Document types
  const documentTypes = [
    'Diploma',
    'Sertifika',
    'Lisans Belgesi',
    'Kurs Belgesi',
    'Diğer'
  ]

  // Load user data when modal opens
  useEffect(() => {
    if (isOpen && user) {
      console.log('📝 Form data yükleniyor:', {
        tc_no: user.tc_no,
        bio: user.bio,
        user: user
      })

      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        tc_no: user.tc_no || '',
        bio: user.bio || '',
        role: user.role || 'visitor',
        is_active: user.is_active ?? true,
        email_verified: user.email_verified ?? false
      })

      // Set profile photo preview - hem avatar_url hem profile_photo_url kontrol et
      const photoUrl = user.avatar_url || user.profile_photo_url
      if (photoUrl) {
        console.log('📸 Setting profile photo preview:', photoUrl)
        setProfilePhotoPreview(photoUrl)
      } else {
        console.log('📸 No profile photo found for user:', user.id)
        setProfilePhotoPreview('')
      }

      // Reset photo-related states when user changes
      setProfilePhoto(null)

      // Clear file input when user changes
      const fileInput = document.getElementById('profile-photo-input') as HTMLInputElement
      if (fileInput) {
        fileInput.value = ''
        fileInput.files = null
      }

      // Load cached data first, then fresh data
      loadCachedData()
      loadExistingSpecialties()
      loadExistingDocuments()
    }
  }, [isOpen, user])

  // Update preview when user.avatar_url changes (for real-time updates)
  useEffect(() => {
    if (user?.avatar_url) {
      console.log('🔄 Avatar URL değişti, preview güncelleniyor:', user.avatar_url)
      setProfilePhotoPreview(user.avatar_url)
    } else if (user && !user.avatar_url) {
      console.log('🔄 Avatar URL silindi, preview temizleniyor')
      setProfilePhotoPreview('')
    }
  }, [user?.avatar_url])

  // Clear success messages after 3 seconds
  useEffect(() => {
    Object.keys(successMessages).forEach(key => {
      if (successMessages[key as keyof typeof successMessages]) {
        setTimeout(() => {
          setSuccessMessages(prev => ({ ...prev, [key]: false }))
        }, 3000)
      }
    })
  }, [successMessages])

  // Load data when specialties tab is opened
  useEffect(() => {
    if (activeTab === 'specialties' && user?.id) {
      console.log('🔄 Uzmanlık alanları sekmesi açıldı, veriler yükleniyor...')
      loadExistingSpecialties()
      loadExistingDocuments()
    }
  }, [activeTab, user?.id])

  // Handle window focus/blur to maintain data consistency
  useEffect(() => {
    const handleFocus = () => {
      if (isOpen && activeTab === 'specialties' && user?.id) {
        console.log('🔄 Window focus - veriler yeniden yükleniyor...')
        loadExistingSpecialties()
        loadExistingDocuments()
      }
    }

    const handleVisibilityChange = () => {
      if (!document.hidden && isOpen && activeTab === 'specialties' && user?.id) {
        console.log('🔄 Page visibility changed - veriler yeniden yükleniyor...')
        loadExistingSpecialties()
        loadExistingDocuments()
      }
    }

    // Add event listeners
    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Cleanup
    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isOpen, activeTab, user?.id])

  // Load cached data from localStorage
  const loadCachedData = () => {
    if (!user?.id) return

    try {
      // Load cached specialties
      const cachedSpecialties = localStorage.getItem(`specialties_${user.id}`)
      if (cachedSpecialties) {
        const specialties = JSON.parse(cachedSpecialties)
        console.log('💾 Cache\'den specialties yüklendi:', specialties.length, 'adet')
        setExistingSpecialties(specialties)
      }

      // Load cached documents
      const cachedDocuments = localStorage.getItem(`documents_${user.id}`)
      if (cachedDocuments) {
        const documents = JSON.parse(cachedDocuments)
        console.log('💾 Cache\'den documents yüklendi:', documents.length, 'adet')
        setExistingDocuments(documents)
      }
    } catch (error) {
      console.log('❌ Cache yükleme hatası:', error)
    }
  }

  // Load existing specialties
  const loadExistingSpecialties = async () => {
    if (!user?.id) {
      console.log('❌ User ID bulunamadı, specialties yüklenemiyor')
      return
    }

    console.log('🔍 Uzmanlık alanları yükleniyor, user ID:', user.id)

    try {
      console.log('🔍 Supabase sorgusu başlatılıyor...')
      
      const { data: specialties, error } = await supabase
        .from('consultant_specialties')
        .select('*')
        .eq('consultant_id', user.id)
        .order('created_at', { ascending: false })

      console.log('📡 Supabase response:', { data: specialties, error })

      if (error) {
        console.log('❌ Specialties yükleme hatası:', error)
        console.log('❌ Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        setExistingSpecialties([])
        return
      }

      console.log('📊 Bulunan specialties:', specialties)
      console.log('📊 Specialties type:', typeof specialties)
      console.log('📊 Specialties is array:', Array.isArray(specialties))

      if (specialties && specialties.length > 0) {
        console.log('✅ Specialties başarıyla yüklendi:', specialties.length, 'adet')
        console.log('✅ First specialty:', specialties[0])
        setExistingSpecialties(specialties)
        
        // Cache to localStorage
        try {
          localStorage.setItem(`specialties_${user.id}`, JSON.stringify(specialties))
          console.log('💾 Specialties localStorage\'a kaydedildi')
        } catch (e) {
          console.log('❌ localStorage kaydetme hatası:', e)
        }
      } else {
        console.log('ℹ️ Hiç specialty bulunamadı (data null veya boş array)')
        setExistingSpecialties([])
        
        // Clear cache
        try {
          localStorage.removeItem(`specialties_${user.id}`)
        } catch (e) {
          console.log('❌ localStorage temizleme hatası:', e)
        }
      }
    } catch (error) {
      console.log('❌ Specialties yükleme exception:', error)
      console.log('❌ Exception details:', {
        name: (error as Error).name,
        message: (error as Error).message,
        stack: (error as Error).stack
      })
      setExistingSpecialties([])
    }
  }

  // Load existing documents
  const loadExistingDocuments = async () => {
    if (!user?.id) {
      console.log('❌ User ID bulunamadı, documents yüklenemiyor')
      return
    }

    console.log('🔍 Belgeler yükleniyor, user ID:', user.id)

    try {
      console.log('🔍 Documents sorgusu başlatılıyor...')
      
      const { data: documents, error } = await supabase
        .from('consultant_documents')
        .select('*')
        .eq('consultant_id', user.id)
        .order('created_at', { ascending: false })

      console.log('📡 Documents response:', { data: documents, error })

      if (error) {
        console.log('❌ Documents yükleme hatası:', error)
        console.log('❌ Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        setExistingDocuments([])
        return
      }

      console.log('📄 Bulunan documents:', documents)
      console.log('📄 Documents type:', typeof documents)
      console.log('📄 Documents is array:', Array.isArray(documents))

      if (documents && documents.length > 0) {
        console.log('✅ Documents başarıyla yüklendi:', documents.length, 'adet')
        console.log('✅ First document:', documents[0])
        setExistingDocuments(documents)
        
        // Cache to localStorage
        try {
          localStorage.setItem(`documents_${user.id}`, JSON.stringify(documents))
          console.log('💾 Documents localStorage\'a kaydedildi')
        } catch (e) {
          console.log('❌ localStorage kaydetme hatası:', e)
        }
      } else {
        console.log('ℹ️ Hiç document bulunamadı (data null veya boş array)')
        setExistingDocuments([])
        
        // Clear cache
        try {
          localStorage.removeItem(`documents_${user.id}`)
        } catch (e) {
          console.log('❌ localStorage temizleme hatası:', e)
        }
      }
    } catch (error) {
      console.log('❌ Documents yükleme exception:', error)
      console.log('❌ Exception details:', {
        name: (error as Error).name,
        message: (error as Error).message,
        stack: (error as Error).stack
      })
      setExistingDocuments([])
    }
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

  // Handle profile photo selection
  const handleProfilePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // File size check (5MB before compression)
    if (file.size > 5 * 1024 * 1024) {
      showError('Profil fotoğrafı 5MB\'dan küçük olmalıdır')
      event.target.value = ''
      return
    }

    // File type check
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
    if (!allowedTypes.includes(file.type)) {
      showError('Sadece JPG, PNG dosyaları yükleyebilirsiniz')
      return
    }

    setProfilePhoto(file)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setProfilePhotoPreview(result)
    }
    reader.readAsDataURL(file)
  }

  // Add new specialty area to the list
  const addNewSpecialtyArea = () => {
    if (!newSpecialtyArea.trim()) {
      showError('Lütfen uzmanlık alanı adını girin')
      return
    }

    const trimmedArea = newSpecialtyArea.trim()

    // Duplicate check (case insensitive)
    if (specialtyAreas.some(area => area.toLowerCase() === trimmedArea.toLowerCase())) {
      showError('Bu uzmanlık alanı zaten mevcut')
      return
    }

    // Add to list
    const updatedAreas = [...specialtyAreas, trimmedArea]
    setSpecialtyAreas(updatedAreas)
    setSelectedSpecialty(trimmedArea) // Otomatik olarak seç
    
    // Save custom areas to localStorage
    try {
      const defaultAreas = [
        'Psikoloji',
        'Psikiyatri',
        'Aile Danışmanlığı',
        'Çift Terapisi',
        'Çocuk Psikolojisi',
        'Ergen Psikolojisi',
        'Travma Terapisi',
        'Bağımlılık Danışmanlığı',
        'Kariyer Danışmanlığı',
        'Eğitim Danışmanlığı'
      ]
      const customAreas = updatedAreas.filter(area => !defaultAreas.includes(area))
      localStorage.setItem('custom_specialty_areas', JSON.stringify(customAreas))
    } catch (error) {
      console.error('Specialty areas kaydedilirken hata:', error)
    }

    setNewSpecialtyArea('')
    setShowAddSpecialtyInput(false)
    success(`"${trimmedArea}" uzmanlık alanı eklendi ve seçildi`)
  }

  // Add specialty
  const addSpecialty = () => {
    if (!selectedSpecialty) {
      showError('Lütfen uzmanlık alanı seçin')
      return
    }

    const newSpecialty: SpecialtyDocument = {
      specialty: selectedSpecialty,
      experienceYears: experienceYears,
      experienceMonths: experienceMonths,
      documentType: selectedDocumentType || undefined,
      file: selectedFile || undefined
    }

    setSpecialtyDocuments(prev => [...prev, newSpecialty])

    // Reset form
    setSelectedSpecialty('')
    setSelectedDocumentType('')
    setSelectedFile(null)
    setExperienceYears(1)
    setExperienceMonths(0)
  }

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // File size check (5MB)
      if (file.size > 5 * 1024 * 1024) {
        showError('Dosya boyutu 5MB\'dan küçük olmalıdır')
        return
      }

      // File type check
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
      if (!allowedTypes.includes(file.type)) {
        showError('Sadece PDF, JPG, PNG dosyaları yükleyebilirsiniz')
        return
      }

      setSelectedFile(file)
    }
  }

  // Remove specialty
  const removeSpecialty = (index: number) => {
    setSpecialtyDocuments(prev => prev.filter((_, i) => i !== index))
  }

  // Format phone number for display
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, '')
    
    // If starts with 90, remove it (country code)
    const withoutCountryCode = cleaned.startsWith('90') ? cleaned.slice(2) : cleaned
    
    // Format as (xxx) xxx xx xx
    if (withoutCountryCode.length >= 10) {
      return `+90 (${withoutCountryCode.slice(0, 3)}) ${withoutCountryCode.slice(3, 6)} ${withoutCountryCode.slice(6, 8)} ${withoutCountryCode.slice(8, 10)}`
    } else if (withoutCountryCode.length >= 6) {
      return `+90 (${withoutCountryCode.slice(0, 3)}) ${withoutCountryCode.slice(3, 6)} ${withoutCountryCode.slice(6)}`
    } else if (withoutCountryCode.length >= 3) {
      return `+90 (${withoutCountryCode.slice(0, 3)}) ${withoutCountryCode.slice(3)}`
    } else if (withoutCountryCode.length > 0) {
      return `+90 (${withoutCountryCode}`
    }
    return '+90 ('
  }

  // Handle phone input change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Remove all non-digits for storage
    const cleaned = value.replace(/\D/g, '')
    // Remove country code if present for storage
    const withoutCountryCode = cleaned.startsWith('90') ? cleaned.slice(2) : cleaned
    // Store only the 10-digit number
    setFormData(prev => ({ ...prev, phone: withoutCountryCode.slice(0, 10) }))
  }

  // Save basic info
  const handleSaveBasicInfo = async () => {
    if (!user) return

    setSavingBasic(true)

    try {
      const updateData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        tc_no: formData.tc_no,
        bio: formData.bio,
        role: formData.role,
        is_active: formData.is_active,
        email_verified: formData.email_verified,
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating basic info:', error)
        showError('Temel bilgiler güncellenirken hata oluştu: ' + error.message)
        return
      }

      // Update local user object
      const updatedUser = { ...user, ...updateData }
      onSave(updatedUser)

      setSuccessMessages(prev => ({ ...prev, basic: true }))
    } catch (error) {
      console.error('Error saving basic info:', error)
      showError('Kaydetme sırasında hata oluştu: ' + (error as Error).message)
    } finally {
      setSavingBasic(false)
    }
  }

  // Delete profile photo - DISABLED
  /*
  const handleDeletePhoto = async () => {
    if (!user?.avatar_url) {
      error('Silinecek profil fotoğrafı bulunamadı')
      return
    }

    // Basit confirm dialog
    if (window.confirm('Profil fotoğrafını silmek istediğinizden emin misiniz?')) {
      console.log('🔥 Confirm onaylandı, performDeletePhoto başlatılıyor...')
      performDeletePhoto().catch(err => {
        console.error('❌ performDeletePhoto error:', err)
        error('Silme işlemi sırasında hata oluştu: ' + err.message)
      })
    }
  }

  // Actual delete photo function - DISABLED
  const performDeletePhoto = async () => {
    console.log('🚀 performDeletePhoto başladı')
    if (!user?.avatar_url) {
      error('Silinecek profil fotoğrafı bulunamadı')
      return
    }

    setSavingPhoto(true)
    info('Profil resminiz siliniyor, lütfen bekleyiniz...')
    console.log('📝 Info mesajı gönderildi')

    try {
      // Extract file path from URL
      const url = new URL(user.avatar_url)
      // Supabase storage URL format: /storage/v1/object/public/avatars/filename.jpg
      const pathParts = url.pathname.split('/')
      const avatarsIndex = pathParts.indexOf('avatars')
      const filePath = pathParts.slice(avatarsIndex + 1).join('/') // Get filename after 'avatars/'
      
      console.log('🗑️ Storage\'dan siliniyor:', filePath)

      // Delete from Supabase Storage
      const { error: deleteError } = await supabase.storage
        .from('avatars')
        .remove([filePath])

      if (deleteError) {
        console.error('❌ Storage delete error:', deleteError)
        // Continue even if storage delete fails
      } else {
        console.log('✅ Storage\'dan dosya silindi')
      }

      // Update user profile - clear avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: null
        })
        .eq('id', user.id)

      if (updateError) {
        console.error('Profile update error:', updateError)
        error('Profil güncellenirken hata oluştu: ' + updateError.message)
        return
      }

      console.log('✅ Database\'den avatar_url silindi')

      // Update local user object
      const updatedUser = { ...user, avatar_url: null }
      onSave(updatedUser)

      // Clear ALL photo-related states immediately
      setProfilePhotoPreview('')
      setProfilePhoto(null)
      
      // Clear file input
      const fileInput = document.getElementById('profile-photo-input') as HTMLInputElement
      if (fileInput) {
        fileInput.value = ''
        fileInput.files = null
      }

      // Force component re-render by updating form data
      setFormData(prev => ({ ...prev, email: prev.email + '' }))

      // Update success message
      setSuccessMessages(prev => ({ ...prev, photo: true }))
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessages(prev => ({ ...prev, photo: false }))
      }, 3000)
      
      console.log('🎉 Profil fotoğrafı başarıyla silindi!')
      console.log('✅ Success mesajı gönderiliyor...')
      success('Silme işlemi başarıyla gerçekleştirilmiştir.')
      console.log('✅ Success mesajı gönderildi!')
    } catch (error) {
      console.error('❌ Photo delete error:', error)
      console.error('❌ Error details:', error)
      error('Fotoğraf silinirken hata oluştu: ' + (error as Error).message)
    } finally {
      console.log('🏁 performDeletePhoto finally bloğu')
      setSavingPhoto(false)
    }
  }
  */

  // Save profile photo (Alternative: Base64 approach)
  const handleSavePhoto = async () => {
    if (!user) {
      showError('Kullanıcı bilgisi bulunamadı')
      return
    }

    if (!profilePhoto) {
      showError('Lütfen önce bir fotoğraf seçin')
      return
    }

    setSavingPhoto(true)
    info('Profil fotoğrafınız kaydediliyor, lütfen bekleyiniz...')
    console.log('🔄 Profil fotoğrafı storage\'a kaydediliyor...', { user: user.id, fileName: profilePhoto.name })

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

      const userName = turkishToEnglish(`${user.first_name}_${user.last_name}`)
      const fileExtension = profilePhoto.name.split('.').pop()
      const timestamp = Date.now()
      const fileName = `${userName}_${timestamp}.${fileExtension}`
      const filePath = fileName // Timestamp ile unique dosya adı

      console.log('📤 Storage\'a yükleniyor:', filePath)

      // Delete ALL existing photos for this user first
      try {
        console.log('🗑️ Kullanıcının tüm eski fotoğrafları siliniyor...')

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
            console.log('🗑️ Silinecek dosyalar:', filesToDelete)

            const { error: deleteError } = await supabase.storage
              .from('avatars')
              .remove(filesToDelete)

            if (deleteError) {
              console.error('❌ Eski dosyalar silinemedi:', deleteError)
            } else {
              console.log('✅ Eski dosyalar silindi:', filesToDelete.length)
            }
          } else {
            console.log('ℹ️ Silinecek eski dosya yok')
          }
        }
      } catch (deleteError) {
        console.error('❌ Eski dosya silme hatası:', deleteError)
      }

      // Upload to Supabase Storage with timeout and cache-busting
      const uploadPromise = supabase.storage
        .from('avatars')
        .upload(filePath, profilePhoto, {
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
        console.error('❌ Storage upload error:', uploadError)
        showError('Fotoğraf storage\'a yüklenirken hata oluştu: ' + uploadError.message)
        return
      }
      console.log('✅ Storage\'a başarıyla yüklendi:', uploadData)

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      console.log('🔗 Public URL alındı:', publicUrl)

      // Update user profile - avatar_url kolununa URL kaydet
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: publicUrl
        })
        .eq('id', user.id)

      if (updateError) {
        console.error('❌ Profile update error:', updateError)
        showError('Profil güncellenirken hata oluştu: ' + updateError.message)
        return
      }
      console.log('✅ Database başarıyla güncellendi')

      // Update local user object
      const updatedUser = { ...user, avatar_url: publicUrl }
      onSave(updatedUser)

      // Update preview with new URL immediately
      setProfilePhotoPreview(publicUrl)

      // Reset file input and state completely
      setProfilePhoto(null)

      // Clear file input element completely
      const fileInput = document.getElementById('profile-photo-input') as HTMLInputElement
      if (fileInput) {
        fileInput.value = ''
        fileInput.files = null
      }

      // Force component re-render
      setFormData(prev => ({ ...prev, email: prev.email + '' }))

      // Update success message
      setSuccessMessages(prev => ({ ...prev, photo: true }))

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessages(prev => ({ ...prev, photo: false }))
      }, 3000)

      console.log('🎉 Profil fotoğrafı başarıyla kaydedildi!')
      success('Yeni profil resminiz başarıyla kaydedilmiştir.')
    } catch (error) {
      console.error('❌ Photo save error:', error)
      console.error('❌ Error details:', {
        message: (error as Error).message,
        stack: (error as Error).stack,
        user: user.id,
        fileName: profilePhoto.name
      })
      showError('Fotoğraf kaydedilirken hata oluştu: ' + (error as Error).message)
    } finally {
      setSavingPhoto(false)
    }
  }

  // Save specialties
  const handleSaveSpecialties = async () => {
    if (!user || specialtyDocuments.length === 0) {
      showError('Lütfen en az bir uzmanlık alanı ekleyin')
      return
    }

    setSavingSpecialties(true)
    info('Uzmanlık alanları kaydediliyor, lütfen bekleyiniz...')

    try {
      // Turkish to English conversion for file paths
      const turkishToEnglish = (text: string) => {
        const turkishChars = 'çğıöşüÇĞIİÖŞÜ'
        const englishChars = 'cgiosuCGIIOSU'
        let result = text
        for (let i = 0; i < turkishChars.length; i++) {
          result = result.replace(new RegExp(turkishChars[i], 'g'), englishChars[i])
        }
        return result.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_.-]/g, '')
      }

      const userName = turkishToEnglish(`${user.first_name}_${user.last_name}`)

      for (const doc of specialtyDocuments) {
        console.log('📝 Uzmanlık alanı kaydediliyor:', doc.specialty)

        // 1. Insert specialty first
        const { data: specialtyData, error: specialtyError } = await supabase
          .from('consultant_specialties')
          .insert({
            consultant_id: user.id,
            specialty_area: doc.specialty,
            experience_years: doc.experienceYears,
            experience_months: doc.experienceMonths
          })
          .select()

        if (specialtyError) {
          console.error('❌ Specialty insert error:', specialtyError)
          showError(`Uzmanlık alanı kaydedilemedi: ${specialtyError.message}`)
          continue
        }

        console.log('✅ Uzmanlık alanı kaydedildi:', doc.specialty)

        // 2. Upload document if exists
        if (doc.file && doc.documentType) {
          console.log('📄 Belge yükleniyor:', doc.file.name)

          // Create file path: consultant_documents/[kullanıcı_adı]/[belge_adı].[dosya_türü]
          const fileExtension = doc.file.name.split('.').pop()
          const timestamp = Date.now()
          const fileName = `${turkishToEnglish(doc.specialty)}_${doc.documentType}_${timestamp}.${fileExtension}`
          const filePath = `consultant_documents/${userName}/${fileName}`

          console.log('📤 Storage path:', filePath)

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('documents')
            .upload(filePath, doc.file)

          if (uploadError) {
            console.error('❌ Document upload error:', uploadError)
            showError(`Belge yüklenemedi: ${uploadError.message}`)
            continue
          }

          console.log('✅ Belge storage\'a yüklendi:', filePath)

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('documents')
            .getPublicUrl(filePath)

          console.log('🔗 Public URL:', publicUrl)

          // 3. Insert document record
          const documentData = {
            consultant_id: user.id,
            specialty_area: doc.specialty,
            document_type: doc.documentType,
            document_url: publicUrl,
            file_name: doc.file.name
          }

          console.log('📝 Document data to insert:', documentData)

          // Document'i direkt client-side'da kaydet
          const { data: insertedDoc, error: docError } = await supabase
            .from('consultant_documents')
            .insert(documentData)
            .select()

          if (docError) {
            console.error('❌ Document record insert error:', docError)
            showError(`Belge kaydı oluşturulamadı: ${docError.message}`)
          } else {
            console.log('✅ Belge kaydı oluşturuldu:', insertedDoc)
          }
        }
      }

      // Clear form and reload data
      setSpecialtyDocuments([])
      setSelectedSpecialty('')
      setSelectedDocumentType('')
      setSelectedFile(null)
      setExperienceYears(1)
      setExperienceMonths(0)

      loadExistingSpecialties()
      loadExistingDocuments()

      success('Uzmanlık alanları başarıyla kaydedildi!')
      console.log('🎉 Tüm işlemler tamamlandı!')

    } catch (error) {
      console.error('❌ Save specialties error:', error)
      showError('Kaydetme sırasında hata oluştu: ' + (error as Error).message)
    } finally {
      setSavingSpecialties(false)
    }
  }

  // Delete specialty
  const handleDeleteSpecialty = async (id: string, specialtyName: string) => {
    if (!window.confirm(`"${specialtyName}" uzmanlık alanını silmek istediğinizden emin misiniz?`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('consultant_specialties')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Delete specialty error:', error)
        showError('Uzmanlık alanı silinirken hata oluştu: ' + error.message)
        return
      }

      loadExistingSpecialties()
      success('Uzmanlık alanı başarıyla silindi!')
    } catch (error) {
      console.error('Delete specialty error:', error)
      showError('Uzmanlık alanı silinirken hata oluştu: ' + (error as Error).message)
    }
  }

  // Delete document
  const handleDeleteDocument = async (id: string, fileName: string) => {
    if (!window.confirm(`"${fileName}" belgesini silmek istediğinizden emin misiniz?`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('consultant_documents')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Delete document error:', error)
        showError('Belge silinirken hata oluştu: ' + error.message)
        return
      }

      loadExistingDocuments()
      success('Belge başarıyla silindi!')
    } catch (error) {
      console.error('Delete document error:', error)
      showError('Belge silinirken hata oluştu: ' + (error as Error).message)
    }
  }

  // Delete specialty area from the list
  const handleDeleteSpecialtyArea = async (areaName: string) => {
    // Varsayılan alanlar listesi (localStorage güncellemesi için)
    const defaultAreas = [
      'Psikoloji',
      'Psikiyatri',
      'Aile Danışmanlığı',
      'Çift Terapisi',
      'Çocuk Psikolojisi',
      'Ergen Psikolojisi',
      'Travma Terapisi',
      'Bağımlılık Danışmanlığı',
      'Kariyer Danışmanlığı',
      'Eğitim Danışmanlığı'
    ]

    // Confirm dialog
    const isDefault = defaultAreas.includes(areaName)
    const confirmMessage = `"${areaName}" uzmanlık alanını silmek istediğinizden emin misiniz?\n\n⚠️ Bu işlem:\n• Bu alanla ilgili tüm danışman kayıtlarını silecek\n• Bu alanla ilgili tüm belgeleri silecek\n• ${isDefault ? 'Varsayılan alan olduğu için sistem genelinde etkileyecek' : 'Özel eklenen alan olduğu için sadece bu listeden kaldırılacak'}\n• Geri alınamaz\n\nDevam etmek istiyor musunuz?`
    
    if (!window.confirm(confirmMessage)) {
      return
    }

    try {
      console.log(`🗑️ "${areaName}" uzmanlık alanı siliniyor...`)

      // 1. Bu uzmanlık alanıyla ilgili tüm belgeleri sil
      const { error: documentsError } = await supabase
        .from('consultant_documents')
        .delete()
        .eq('specialty_area', areaName)

      if (documentsError) {
        console.error('Documents delete error:', documentsError)
        showError('İlgili belgeler silinirken hata oluştu: ' + documentsError.message)
        return
      }

      console.log(`✅ "${areaName}" ile ilgili belgeler silindi`)

      // 2. Bu uzmanlık alanıyla ilgili tüm danışman kayıtlarını sil
      const { error: specialtiesError } = await supabase
        .from('consultant_specialties')
        .delete()
        .eq('specialty_area', areaName)

      if (specialtiesError) {
        console.error('Specialties delete error:', specialtiesError)
        showError('İlgili uzmanlık kayıtları silinirken hata oluştu: ' + specialtiesError.message)
        return
      }

      console.log(`✅ "${areaName}" ile ilgili uzmanlık kayıtları silindi`)

      // 3. Local state'den sil
      const updatedAreas = specialtyAreas.filter(area => area !== areaName)
      setSpecialtyAreas(updatedAreas)

      // 4. localStorage'ı güncelle
      try {
        // Eğer silinen alan varsayılan bir alanıysa, silinen alanları da takip et
        if (defaultAreas.includes(areaName)) {
          // Silinen varsayılan alanları kaydet
          const deletedDefaultAreas = JSON.parse(localStorage.getItem('deleted_default_specialty_areas') || '[]')
          if (!deletedDefaultAreas.includes(areaName)) {
            deletedDefaultAreas.push(areaName)
            localStorage.setItem('deleted_default_specialty_areas', JSON.stringify(deletedDefaultAreas))
          }
        }
        
        // Özel alanları güncelle
        const customAreas = updatedAreas.filter(area => !defaultAreas.includes(area))
        localStorage.setItem('custom_specialty_areas', JSON.stringify(customAreas))
        console.log('✅ localStorage güncellendi')
      } catch (storageError) {
        console.error('localStorage güncelleme hatası:', storageError)
      }

      // 5. Seçili alan bu alanı ise temizle
      if (selectedSpecialty === areaName) {
        setSelectedSpecialty('')
      }

      // 6. Mevcut verileri yeniden yükle
      loadExistingSpecialties()
      loadExistingDocuments()

      success(`"${areaName}" uzmanlık alanı ve ilgili tüm veriler başarıyla silindi`)
      console.log(`🎉 "${areaName}" uzmanlık alanı tamamen silindi`)

    } catch (error) {
      console.error('Delete specialty area error:', error)
      showError('Uzmanlık alanı silinirken hata oluştu: ' + (error as Error).message)
    }
  }

  // Reset specialty areas to default
  const handleResetSpecialtyAreas = () => {
    const confirmMessage = `Uzmanlık alanlarını varsayılan haline sıfırlamak istediğinizden emin misiniz?\n\n✅ Bu işlem:\n• Tüm özel eklenen alanları silecek\n• Varsayılan alanları geri yükleyecek\n• Mevcut danışman kayıtları korunacak\n\nDevam etmek istiyor musunuz?`
    
    if (!window.confirm(confirmMessage)) {
      return
    }

    try {
      const defaultAreas = [
        'Psikoloji',
        'Psikiyatri',
        'Aile Danışmanlığı',
        'Çift Terapisi',
        'Çocuk Psikolojisi',
        'Ergen Psikolojisi',
        'Travma Terapisi',
        'Bağımlılık Danışmanlığı',
        'Kariyer Danışmanlığı',
        'Eğitim Danışmanlığı'
      ]

      // State'i güncelle
      setSpecialtyAreas(defaultAreas)

      // localStorage'ı temizle
      localStorage.removeItem('custom_specialty_areas')
      localStorage.removeItem('deleted_default_specialty_areas')

      // Seçili alanı temizle
      setSelectedSpecialty('')

      success('Uzmanlık alanları varsayılan haline sıfırlandı')
      console.log('🔄 Uzmanlık alanları varsayılan haline sıfırlandı')

    } catch (error) {
      console.error('Reset specialty areas error:', error)
      showError('Sıfırlama sırasında hata oluştu: ' + (error as Error).message)
    }
  }

  // Delete all specialty areas
  const handleDeleteAllSpecialtyAreas = async () => {
    const confirmMessage = `TÜM uzmanlık alanlarını silmek istediğinizden emin misiniz?\n\n⚠️ Bu işlem:\n• Tüm uzmanlık alanlarını silecek\n• Tüm danışman kayıtlarını silecek\n• Tüm belgeleri silecek\n• Sistem genelinde etki edecek\n• GERİ ALINAMAZ\n\nBu çok tehlikeli bir işlemdir. Devam etmek istiyor musunuz?`
    
    if (!window.confirm(confirmMessage)) {
      return
    }

    // İkinci onay
    const secondConfirm = window.prompt('Bu işlemi onaylamak için "SİL" yazın:', '')
    if (secondConfirm !== 'SİL') {
      showError('İşlem iptal edildi. Onay metni yanlış.')
      return
    }

    try {
      console.log('🗑️ Tüm uzmanlık alanları siliniyor...')

      // 1. Tüm belgeleri sil
      const { error: documentsError } = await supabase
        .from('consultant_documents')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Tüm kayıtları sil

      if (documentsError) {
        console.error('All documents delete error:', documentsError)
        showError('Belgeler silinirken hata oluştu: ' + documentsError.message)
        return
      }

      console.log('✅ Tüm belgeler silindi')

      // 2. Tüm uzmanlık kayıtlarını sil
      const { error: specialtiesError } = await supabase
        .from('consultant_specialties')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Tüm kayıtları sil

      if (specialtiesError) {
        console.error('All specialties delete error:', specialtiesError)
        showError('Uzmanlık kayıtları silinirken hata oluştu: ' + specialtiesError.message)
        return
      }

      console.log('✅ Tüm uzmanlık kayıtları silindi')

      // 3. Local state'i temizle
      setSpecialtyAreas([])

      // 4. localStorage'ı temizle
      localStorage.removeItem('custom_specialty_areas')
      localStorage.removeItem('deleted_default_specialty_areas')

      // 5. Seçili alanı temizle
      setSelectedSpecialty('')

      // 6. Mevcut verileri yeniden yükle
      loadExistingSpecialties()
      loadExistingDocuments()

      success('Tüm uzmanlık alanları ve ilgili veriler başarıyla silindi')
      console.log('🎉 Tüm uzmanlık alanları tamamen silindi')

    } catch (error) {
      console.error('Delete all specialty areas error:', error)
      showError('Toplu silme sırasında hata oluştu: ' + (error as Error).message)
    }
  }

  // Clear cache when modal closes
  useEffect(() => {
    if (!isOpen && user?.id) {
      console.log('🗑️ Modal kapandı, cache temizleniyor...')
      try {
        localStorage.removeItem(`specialties_${user.id}`)
        localStorage.removeItem(`documents_${user.id}`)
      } catch (e) {
        console.log('❌ Cache temizleme hatası:', e)
      }
    }
  }, [isOpen, user?.id])

  if (!isOpen) return null

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[98vw] max-h-[90vh] overflow-y-auto w-[98vw] min-w-[1200px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Kullanıcı Düzenle</span>
            </DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="sticky top-0 bg-white z-10 border-b pb-4 mb-6">
              <TabsList className="grid w-full grid-cols-3 h-12 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger value="basic" className="flex items-center space-x-2 h-10 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Temel Bilgiler</span>
                  <span className="sm:hidden">Temel</span>
                </TabsTrigger>
                <TabsTrigger value="photo" className="flex items-center space-x-2 h-10 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Camera className="w-4 h-4" />
                  <span className="hidden sm:inline">Profil Fotoğrafı</span>
                  <span className="sm:hidden">Fotoğraf</span>
                </TabsTrigger>
                <TabsTrigger value="specialties" className="flex items-center space-x-2 h-10 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Award className="w-4 h-4" />
                  <span className="hidden sm:inline">Uzmanlık Alanları</span>
                  <span className="sm:hidden">Uzmanlık</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Kişisel Bilgiler</CardTitle>
                  <CardDescription>Kullanıcının temel bilgilerini düzenleyin</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ad *
                      </label>
                      <Input
                        type="text"
                        value={formData.first_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                        placeholder="Ad"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Soyad *
                      </label>
                      <Input
                        type="text"
                        value={formData.last_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                        placeholder="Soyad"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-posta *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="E-posta"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefon
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone ? formatPhoneNumber(formData.phone) : '+90 ('}
                      onChange={handlePhoneChange}
                      placeholder="+90 (5xx) xxx xx xx"
                      maxLength={19}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      TC Kimlik No
                    </label>
                    <Input
                      type="text"
                      value={formData.tc_no}
                      onChange={(e) => setFormData(prev => ({ ...prev, tc_no: e.target.value }))}
                      placeholder="TC Kimlik Numarası"
                      maxLength={11}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Özgeçmiş / Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Kişi hakkında kısa bilgi, özgeçmiş..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-vertical"
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rol *
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as User['role'] }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {roleOptions.map(role => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                    <div className="mt-2">
                      {roleOptions.map(role => (
                        formData.role === role.value && (
                          <Badge key={role.value} className={role.color}>
                            {role.label}
                          </Badge>
                        )
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                      />
                      <span className="text-sm">Aktif</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.email_verified}
                        onChange={(e) => setFormData(prev => ({ ...prev, email_verified: e.target.checked }))}
                      />
                      <span className="text-sm">E-posta Doğrulandı</span>
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Success Message */}
              {successMessages.basic && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm">✅ Temel bilgiler başarıyla güncellendi!</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={onClose}>
                  İptal
                </Button>
                <Button
                  onClick={handleSaveBasicInfo}
                  disabled={savingBasic}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {savingBasic ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Kaydediliyor...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Temel Bilgileri Kaydet
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            {/* Profile Photo Tab */}
            <TabsContent value="photo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profil Fotoğrafı</CardTitle>
                  <CardDescription>Kullanıcının profil fotoğrafını yükleyin veya değiştirin</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <div className="w-64 h-80 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center overflow-hidden">
                        {savingPhoto ? (
                          <div className="flex flex-col items-center justify-center text-white">
                            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4" />
                            <span className="text-sm text-center">Yükleniyor...</span>
                          </div>
                        ) : (profilePhotoPreview || user?.avatar_url) ? (
                          <img
                            src={profilePhotoPreview || user?.avatar_url || ''}
                            alt="Profile Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-white">
                            <User className="w-32 h-32 mb-4" />
                            <span className="text-sm text-center">Profil Fotoğrafı Yok</span>
                          </div>
                        )}
                      </div>

                      {/* Delete Photo Button - DISABLED */}
                      {/* {profilePhotoPreview && !savingPhoto && (
                      <button
                        onClick={handleDeletePhoto}
                        disabled={savingPhoto}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors"
                        title="Profil fotoğrafını sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )} */}

                      {/* Camera/Upload Button */}
                      <label className={`absolute bottom-2 right-2 bg-white rounded-full p-3 shadow-lg transition-colors ${savingPhoto ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-gray-50'
                        }`}>
                        <Camera className="w-6 h-6 text-gray-600" />
                        <input
                          id="profile-photo-input"
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePhotoSelect}
                          className="hidden"
                          disabled={savingPhoto}
                        />
                      </label>
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-gray-600">
                        JPG, PNG formatında, maksimum 3MB
                      </p>
                      {user?.avatar_url && !profilePhoto && (
                        <p className="text-xs text-blue-600 mt-1">
                          ✓ Mevcut profil fotoğrafı var
                        </p>
                      )}
                      {profilePhoto && (
                        <p className="text-xs text-green-600 mt-1">
                          ✓ {profilePhoto.name} seçildi (değiştirilecek)
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Success Message */}
              {successMessages.photo && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm">✅ Profil fotoğrafı başarıyla güncellendi!</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={onClose}>
                  İptal
                </Button>
                <Button
                  onClick={handleSavePhoto}
                  disabled={savingPhoto}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {savingPhoto ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Kaydediliyor...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Profil Fotoğrafını Kaydet
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            {/* Specialties Tab */}
            <TabsContent value="specialties" className="space-y-6">
              {/* Existing Specialties and Documents Display */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <div className="w-2 h-6 bg-green-500 rounded-full mr-3"></div>
                      Kayıtlı Uzmanlık Alanları ve Belgeler
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        Specialties: {existingSpecialties.length} | Documents: {existingDocuments.length}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          console.log('🔄 Manuel veri yükleme başlatıldı')
                          console.log('👤 Current user:', user)
                          console.log('📊 Current specialties:', existingSpecialties)
                          console.log('📄 Current documents:', existingDocuments)
                          
                          // Supabase bağlantısını test et
                          console.log('🧪 Supabase bağlantısı test ediliyor...')
                          try {
                            const { data: testData, error: testError } = await supabase
                              .from('profiles')
                              .select('id, first_name, last_name')
                              .eq('id', user?.id)
                              .single()
                            
                            console.log('🧪 Test sorgusu sonucu:', { data: testData, error: testError })
                          } catch (testErr) {
                            console.log('🧪 Test sorgusu exception:', testErr)
                          }
                          
                          loadExistingSpecialties()
                          loadExistingDocuments()
                        }}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        🔄 Yenile
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {existingSpecialties.length > 0 ? (
                    <div className="w-full">
                      <table className="w-full border-collapse table-auto min-w-[1000px]">
                        <thead>
                          <tr className="bg-gray-50 border-b">
                            <th className="text-left p-4 font-medium text-gray-700 border-r" style={{width: '200px'}}>
                              Uzmanlık Alanı
                            </th>
                            <th className="text-center p-4 font-medium text-gray-700 border-r" colSpan={2} style={{width: '150px'}}>
                              Tecrübe Süresi
                            </th>
                            <th className="text-left p-4 font-medium text-gray-700 border-r" style={{width: 'auto', minWidth: '400px'}}>
                              Belgeler
                            </th>
                            <th className="text-center p-4 font-medium text-gray-700" style={{width: '120px'}}>
                              İşlemler
                            </th>
                          </tr>
                          <tr className="bg-gray-25 border-b">
                            <th className="p-2 border-r" style={{width: '200px'}}></th>
                            <th className="text-center p-2 text-sm font-medium text-gray-600 border-r" style={{width: '75px'}}>
                              Yıl
                            </th>
                            <th className="text-center p-2 text-sm font-medium text-gray-600 border-r" style={{width: '75px'}}>
                              Ay
                            </th>
                            <th className="p-2 border-r" style={{width: 'auto', minWidth: '400px'}}></th>
                            <th className="p-2" style={{width: '120px'}}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {existingSpecialties.map((specialty, index) => {
                            // Bu uzmanlık alanına ait belgeleri bul
                            const relatedDocuments = existingDocuments.filter(
                              doc => doc.specialty_area === specialty.specialty_area
                            )

                            return (
                              <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                                {/* Uzmanlık Alanı */}
                                <td className="p-4 border-r">
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                    {specialty.specialty_area}
                                  </span>
                                </td>
                                
                                {/* Tecrübe Yılı */}
                                <td className="p-4 text-center border-r">
                                  <span className="text-lg font-semibold text-blue-600">
                                    {specialty.experience_years}
                                  </span>
                                </td>
                                
                                {/* Tecrübe Ayı */}
                                <td className="p-4 text-center border-r">
                                  <span className="text-lg font-semibold text-purple-600">
                                    {specialty.experience_months}
                                  </span>
                                </td>
                                
                                {/* Belgeler */}
                                <td className="p-4 border-r">
                                  {relatedDocuments.length > 0 ? (
                                    <div className="space-y-2">
                                      {relatedDocuments.map((doc, docIndex) => (
                                        <div key={docIndex} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2">
                                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                {doc.document_type}
                                              </span>
                                            </div>
                                            <p className="text-xs text-gray-600 mt-1 break-words">
                                              📄 {doc.file_name}
                                            </p>
                                          </div>
                                          <div className="flex items-center space-x-1 ml-2">
                                            {/* Preview Button */}
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => window.open(doc.document_url, '_blank')}
                                              className="text-blue-600 hover:text-blue-700 border-blue-300 hover:bg-blue-50 px-2 py-1"
                                              title="Yeni sekmede aç"
                                            >
                                              <Eye className="w-3 h-3" />
                                            </Button>
                                            {/* Delete Document Button */}
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => handleDeleteDocument(doc.id, doc.file_name)}
                                              className="text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50 px-2 py-1"
                                              title="Belgeyi Sil"
                                            >
                                              <X className="w-3 h-3" />
                                            </Button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-gray-400 text-sm italic">Belge yok</span>
                                  )}
                                </td>
                                
                                {/* İşlemler */}
                                <td className="p-4 text-center">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteSpecialty(specialty.id, specialty.specialty_area)}
                                    className="text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50"
                                    title="Uzmanlık Alanını Sil"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Award className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <h4 className="text-lg font-medium mb-2">Henüz uzmanlık alanı kaydı yok</h4>
                      <p className="text-sm mb-4">Aşağıdaki formdan yeni uzmanlık alanları ekleyebilirsiniz</p>
                      <div className="text-xs text-gray-400 bg-gray-50 p-3 rounded-lg">
                        <p><strong>Debug Info:</strong></p>
                        <p>User ID: {user?.id || 'Yok'}</p>
                        <p>User Role: {user?.role || 'Yok'}</p>
                        <p>Specialties Array Length: {existingSpecialties.length}</p>
                        <p>Documents Array Length: {existingDocuments.length}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Specialty Areas Management */}
              <Card className="border-2 border-dashed border-orange-300 bg-orange-50/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-orange-800">
                    <Settings className="w-5 h-5 mr-2" />
                    Uzmanlık Alanları Yönetimi
                  </CardTitle>
                  <CardDescription>Mevcut uzmanlık alanlarını görüntüleyin ve yönetin</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm text-gray-600">
                        Toplam {specialtyAreas.length} uzmanlık alanı mevcut. Tüm alanlar silinebilir.
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleResetSpecialtyAreas}
                          className="text-blue-600 hover:text-blue-700 border-blue-300 hover:bg-blue-50"
                          title="Varsayılan alanları geri yükle"
                        >
                          🔄 Varsayılanları Geri Yükle
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDeleteAllSpecialtyAreas}
                          className="text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50"
                          title="Tüm alanları sil"
                        >
                          🗑️ Tümünü Sil
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                      {specialtyAreas.map((area, index) => {
                        const isDefault = [
                          'Psikoloji',
                          'Psikiyatri',
                          'Aile Danışmanlığı',
                          'Çift Terapisi',
                          'Çocuk Psikolojisi',
                          'Ergen Psikolojisi',
                          'Travma Terapisi',
                          'Bağımlılık Danışmanlığı',
                          'Kariyer Danışmanlığı',
                          'Eğitim Danışmanlığı'
                        ].includes(area)
                        
                        return (
                          <div
                            key={index}
                            className={`flex items-center justify-between p-3 rounded-lg border ${
                              isDefault 
                                ? 'bg-blue-50 border-blue-200' 
                                : 'bg-green-50 border-green-200'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                isDefault 
                                  ? 'bg-blue-100 text-blue-700' 
                                  : 'bg-green-100 text-green-700'
                              }`}>
                                {isDefault ? '📚' : '✨'} {area}
                              </span>
                            </div>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteSpecialtyArea(area)}
                              className="text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50 px-2 py-1"
                              title="Uzmanlık alanını sil"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Add New Specialty Form */}
              <Card className="border-2 border-dashed border-blue-300 bg-blue-50/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-800">
                    <Plus className="w-5 h-5 mr-2" />
                    Yeni Uzmanlık Alanı Ekle
                  </CardTitle>
                  <CardDescription>Yeni uzmanlık alanı, tecrübe bilgisi ve belge ekleyin</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Form Fields */}
                  <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 gap-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Uzmanlık Alanı *
                      </label>
                      <div className="space-y-2">
                        <select
                          value={selectedSpecialty}
                          onChange={(e) => setSelectedSpecialty(e.target.value)}
                          className="w-full h-11 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        >
                          <option value="">Uzmanlık alanı seçin</option>
                          {specialtyAreas.map(area => (
                            <option key={area} value={area}>{area}</option>
                          ))}
                        </select>
                        
                        {/* Yeni uzmanlık alanı ekleme butonu */}
                        {!showAddSpecialtyInput ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setShowAddSpecialtyInput(true)}
                            className="w-full text-blue-600 border-blue-300 hover:bg-blue-50"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Yeni Uzmanlık Alanı Ekle
                          </Button>
                        ) : (
                          <div className="flex space-x-2">
                            <Input
                              type="text"
                              value={newSpecialtyArea}
                              onChange={(e) => setNewSpecialtyArea(e.target.value)}
                              placeholder="Yeni uzmanlık alanı adı"
                              className="flex-1"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault()
                                  addNewSpecialtyArea()
                                }
                              }}
                            />
                            <Button
                              type="button"
                              size="sm"
                              onClick={addNewSpecialtyArea}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setShowAddSpecialtyInput(false)
                                setNewSpecialtyArea('')
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tecrübe Yılı *</label>
                      <select
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(Number(e.target.value))}
                        className="w-full h-11 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      >
                        {Array.from({ length: 20 }, (_, i) => i + 1).map(year => (
                          <option key={year} value={year}>{year} yıl</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tecrübe Ayı</label>
                      <select
                        value={experienceMonths}
                        onChange={(e) => setExperienceMonths(Number(e.target.value))}
                        className="w-full h-11 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      >
                        {Array.from({ length: 12 }, (_, i) => i).map(month => (
                          <option key={month} value={month}>{month} ay</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Document Upload Section */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h5 className="font-medium text-gray-800 mb-4 flex items-center">
                      📄 Belge Yükleme (İsteğe Bağlı)
                    </h5>

                    <div className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Belge Türü
                        </label>
                        <select
                          value={selectedDocumentType}
                          onChange={(e) => setSelectedDocumentType(e.target.value)}
                          className="w-full h-11 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        >
                          <option value="">Belge türü seçin (isteğe bağlı)</option>
                          {documentTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Belge Dosyası
                        </label>
                        <div className="relative">
                          <input
                            id="document-file-input"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                          <label
                            htmlFor="document-file-input"
                            className="w-full h-11 rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer flex items-center justify-center gap-2 text-blue-700 hover:text-blue-800 font-medium"
                          >
                            <Upload className="w-4 h-4" />
                            {selectedFile ? 'Dosya Değiştir' : 'Dosya Seç'}
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="text-xs text-gray-500">
                        PDF, JPG, PNG formatında, maksimum 5MB
                      </div>
                      {selectedFile && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-3">
                          <div className="flex-shrink-0">
                            <FileText className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-green-800 truncate">
                              {selectedFile.name}
                            </p>
                            <p className="text-xs text-green-600">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFile(null)
                              const input = document.getElementById('document-file-input') as HTMLInputElement
                              if (input) input.value = ''
                            }}
                            className="flex-shrink-0 text-green-600 hover:text-green-800 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Add to List Button */}
                  <div className="flex justify-center">
                    <Button
                      onClick={addSpecialty}
                      disabled={!selectedSpecialty}
                      className="bg-blue-600 hover:bg-blue-700 px-8 py-2 rounded-lg"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Listeye Ekle
                    </Button>
                  </div>

                  {/* Added Specialties Preview */}
                  {specialtyDocuments.length > 0 && (
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                      <h5 className="font-medium text-yellow-800 mb-3 flex items-center">
                        ⏳ Kaydedilmeyi Bekleyen Uzmanlık Alanları ({specialtyDocuments.length})
                      </h5>
                      <div className="space-y-3">
                        {specialtyDocuments.map((doc, index) => (
                          <div key={index} className="bg-white rounded-lg p-3 border border-yellow-300">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    {doc.specialty}
                                  </span>
                                  <span className="text-xs text-gray-600">
                                    {doc.experienceYears} yıl {doc.experienceMonths} ay
                                  </span>
                                </div>
                                {doc.documentType && doc.file && (
                                  <div className="text-xs text-blue-600 flex items-center">
                                    📄 <span className="ml-1">{doc.documentType}: {doc.file.name}</span>
                                  </div>
                                )}
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeSpecialty(index)}
                                className="text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Save All Button */}
                      <div className="flex justify-center mt-4 pt-4 border-t border-yellow-300">
                        <div className="flex space-x-3">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSpecialtyDocuments([])
                              setSelectedSpecialty('')
                              setSelectedDocumentType('')
                              setSelectedFile(null)
                              setExperienceYears(1)
                              setExperienceMonths(0)
                            }}
                            disabled={savingSpecialties}
                            className="border-yellow-400 text-yellow-700 hover:bg-yellow-50"
                          >
                            Temizle
                          </Button>
                          <Button
                            onClick={handleSaveSpecialties}
                            disabled={savingSpecialties || specialtyDocuments.length === 0}
                            className="bg-green-600 hover:bg-green-700 px-6"
                          >
                            {savingSpecialties ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Kaydediliyor...
                              </>
                            ) : (
                              <>
                                <Save className="w-4 h-4 mr-2" />
                                Tümünü Kaydet ({specialtyDocuments.length})
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Success Message */}
              {successMessages.specialties && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm font-medium">✅ Uzmanlık alanları başarıyla güncellendi!</p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Modal Close Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Modalı Kapat
            </Button>
          </div>
        </DialogContent>
      </Dialog>



      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.show}
          onClose={() => setToast(prev => ({ ...prev, show: false }))}
        />
      )}

    </>
  )
}

export default UserEditModal
'use client'

import React, { useState, useEffect, useRef } from 'react'
import { X, Camera, Trash2, Upload, Plus, User, Mail, Phone, FileText, MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import { useToast, ToastContainer } from '@/components/ui/toast'

interface UserEditModalProps {
  isOpen: boolean
  user: any
  onClose: () => void
  onSave: () => void
}

interface SpecialtyDocument {
  specialty: string
  documentType: string
  experienceYears: number
  experienceMonths: number
  file: File | null
  url?: string
}

const UserEditModal: React.FC<UserEditModalProps> = ({
  isOpen,
  user,
  onClose,
  onSave
}) => {
  const { toasts, showSuccess, showError, removeToast } = useToast()

  // Form state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    tc_no: '',
    email: '',
    phone: '',
    bio: ''
  })

  // Photo state
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null)
  const [profilePhotoPreview, setProfilePhotoPreview] = useState('')

  // Specialty state
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [selectedDocumentType, setSelectedDocumentType] = useState('')
  const [specialtyDocuments, setSpecialtyDocuments] = useState<SpecialtyDocument[]>([])

  // UI state
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Uzmanlık alanları listesi
  const specialtyAreas = [
    'Duygu Temizliği',
    'Travma İyileştirme',
    'Yaşam Koçluğu',
    'Holistik Koçluk',
    'Stres Yönetimi',
    'İlişki Danışmanlığı',
    'Kariyer Koçluğu',
    'Aile Danışmanlığı',
    'Diğer'
  ]

  // Belge türleri listesi
  const documentTypes = [
    'Sertifika',
    'Diploma',
    'CV',
    'Kimlik Belgesi',
    'Başarı Belgesi',
    'Referans'
  ]  // Modal açıldığında user verilerini yükle
  useEffect(() => {
    const loadUserData = async () => {
      if (isOpen && user?.id) {
        setIsLoading(true)
        console.log('🔄 User verileri yükleniyor...', user.id)

        try {
          // User temel bilgilerini yükle
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

          if (userError) {
            console.error('❌ User verileri yüklenemedi:', userError)
            setFormData({
              first_name: user.first_name || '',
              last_name: user.last_name || '',
              tc_no: user.tc_no || '',
              email: user.email || '',
              phone: user.phone || '',
              bio: user.bio || ''
            })
            setProfilePhotoPreview(user.avatar_url || '')
          } else {
            console.log('✅ User verileri yüklendi:', userData)
            setFormData({
              first_name: userData.first_name || '',
              last_name: userData.last_name || '',
              tc_no: userData.tc_no || '',
              email: userData.email || '',
              phone: userData.phone || '',
              bio: userData.bio || ''
            })
            setProfilePhotoPreview(userData.avatar_url || '')
          }

          // Uzmanlık alanları ve belgeleri yükle
          const { data: specialtiesData, error: specialtiesError } = await supabase
            .from('consultant_specialties')
            .select('*')
            .eq('consultant_id', user.id)

          if (!specialtiesError && specialtiesData) {
            const loadedDocuments: SpecialtyDocument[] = []

            for (const spec of specialtiesData) {
              const { data: docsData } = await supabase
                .from('consultant_documents')
                .select('*')
                .eq('consultant_id', user.id)
                .eq('specialty_area', spec.specialty_area)

              if (docsData && docsData.length > 0) {
                docsData.forEach(doc => {
                  loadedDocuments.push({
                    specialty: spec.specialty_area,
                    documentType: doc.document_type,
                    experienceYears: spec.experience_years || 1,
                    experienceMonths: spec.experience_months || 0,
                    file: null,
                    url: doc.document_url
                  })
                })
              } else {
                // Belge yoksa sadece uzmanlık alanını ekle
                loadedDocuments.push({
                  specialty: spec.specialty_area,
                  documentType: '',
                  experienceYears: spec.experience_years || 1,
                  experienceMonths: spec.experience_months || 0,
                  file: null
                })
              }
            }

            setSpecialtyDocuments(loadedDocuments)
          }

        } catch (error) {
          console.error('💥 Veri yükleme hatası:', error)
        } finally {
          setIsLoading(false)
        }

        // State'leri reset et
        setProfilePhoto(null)
        setSelectedSpecialty('')
        setSelectedDocumentType('')
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    }

    loadUserData()
  }, [isOpen, user?.id])
  // Form input handlers
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // TC No formatı (sadece sayı, 11 karakter)
  const handleTcNoChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 11)
    handleInputChange('tc_no', numericValue)
  }

  // Telefon formatı (+90 (xxx) xxx xx xx)
  const handlePhoneChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '')
    let formattedValue = numericValue

    if (numericValue.length > 0) {
      if (numericValue.length <= 3) {
        formattedValue = `+90 (${numericValue}`
      } else if (numericValue.length <= 6) {
        formattedValue = `+90 (${numericValue.slice(0, 3)}) ${numericValue.slice(3)}`
      } else if (numericValue.length <= 8) {
        formattedValue = `+90 (${numericValue.slice(0, 3)}) ${numericValue.slice(3, 6)} ${numericValue.slice(6)}`
      } else if (numericValue.length <= 10) {
        formattedValue = `+90 (${numericValue.slice(0, 3)}) ${numericValue.slice(3, 6)} ${numericValue.slice(6, 8)} ${numericValue.slice(8)}`
      } else {
        formattedValue = `+90 (${numericValue.slice(0, 3)}) ${numericValue.slice(3, 6)} ${numericValue.slice(6, 8)} ${numericValue.slice(8, 10)}`
      }
    }

    handleInputChange('phone', formattedValue)
  }

  // Profil fotoğrafı işlemleri
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showError('Dosya boyutu 5MB\'dan küçük olmalıdır')
        if (fileInputRef.current) fileInputRef.current.value = ''
        return
      }

      if (!file.type.startsWith('image/')) {
        showError('Sadece resim dosyaları yüklenebilir')
        if (fileInputRef.current) fileInputRef.current.value = ''
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        const base64String = event.target?.result as string
        setProfilePhoto(file)
        setProfilePhotoPreview(base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDeletePhoto = async () => {
    try {
      if (user.avatar_url) {
        const urlParts = user.avatar_url.split('/')
        const fileName = urlParts[urlParts.length - 1].split('?')[0]
        await supabaseAdmin.storage.from('avatars').remove([fileName])
      }

      await supabase.from('profiles').update({ avatar_url: null }).eq('id', user.id)

      setProfilePhoto(null)
      setProfilePhotoPreview('')
      if (fileInputRef.current) fileInputRef.current.value = ''

      showSuccess('Fotoğraf başarıyla silindi!')
    } catch (error) {
      console.error('Fotoğraf silme hatası:', error)
      showError('Fotoğraf silinemedi')
    }
  }

  // Uzmanlık alanı ve belge ekleme
  const addSpecialtyDocument = () => {
    if (!selectedSpecialty || !selectedDocumentType) {
      showError('Lütfen uzmanlık alanı ve belge türü seçin')
      return
    }

    // Dosya seçimi için input oluştur
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png'
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        // Dosya boyutu kontrolü (10MB)
        if (file.size > 10 * 1024 * 1024) {
          showError('Dosya boyutu 10MB\'dan küçük olmalıdır')
          return
        }

        const newDocument: SpecialtyDocument = {
          specialty: selectedSpecialty,
          documentType: selectedDocumentType,
          experienceYears: 1,
          experienceMonths: 0,
          file: file
        }

        setSpecialtyDocuments(prev => [...prev, newDocument])
        setSelectedSpecialty('')
        setSelectedDocumentType('')
        showSuccess(`${selectedDocumentType} belgesi eklendi`)
      }
    }
    fileInput.click()
  }

  // Belge silme
  const removeSpecialtyDocument = (index: number) => {
    setSpecialtyDocuments(prev => prev.filter((_, i) => i !== index))
  }

  // Tecrübe güncelleme
  const updateExperience = (index: number, field: 'experienceYears' | 'experienceMonths', value: number) => {
    setSpecialtyDocuments(prev => prev.map((doc, i) =>
      i === index ? { ...doc, [field]: value } : doc
    ))
  }

  // Başarı mesajı göster (sistem mesajı değil)
  const showCustomSuccess = () => {
    const successMessage = document.createElement('div')
    successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce'
    successMessage.textContent = '✅ Kayıt işlemi başarılı!'
    successMessage.style.zIndex = '9999'
    document.body.appendChild(successMessage)

    setTimeout(() => {
      if (document.body.contains(successMessage)) {
        document.body.removeChild(successMessage)
      }
    }, 3000)
  }

  // Form validasyonu
  const validateForm = () => {
    if (!formData.first_name.trim()) {
      showError('Ad alanı zorunludur')
      return false
    }
    if (!formData.last_name.trim()) {
      showError('Soyad alanı zorunludur')
      return false
    }
    if (!formData.email.trim()) {
      showError('E-posta alanı zorunludur')
      return false
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      showError('Geçerli bir e-posta adresi girin')
      return false
    }
    if (formData.tc_no && formData.tc_no.length !== 11) {
      showError('TC Kimlik No 11 haneli olmalıdır')
      return false
    }
    return true
  }

  // Kaydet işlemi
  const handleSave = async () => {
    if (!validateForm()) return

    setIsSaving(true)
    console.log('🚀 Kullanıcı kayıt işlemi başlıyor...')

    try {
      let profilePhotoUrl = profilePhotoPreview

      // Profil fotoğrafı yükleme
      if (profilePhoto) {
        const fileExt = profilePhoto.name.split('.').pop()
        const fileName = `${user.id}-avatar.${fileExt}`

        const { error: uploadError } = await supabaseAdmin.storage
          .from('avatars')
          .upload(fileName, profilePhoto, { cacheControl: '3600', upsert: true })

        if (!uploadError) {
          const { data: urlData } = supabaseAdmin.storage
            .from('avatars')
            .getPublicUrl(fileName)
          profilePhotoUrl = `${urlData.publicUrl}?t=${Date.now()}`
        }
      }

      // Profil bilgilerini güncelle
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          tc_no: formData.tc_no,
          email: formData.email,
          phone: formData.phone,
          bio: formData.bio,
          avatar_url: profilePhotoUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (profileError) throw profileError

      // Mevcut uzmanlık alanları ve belgeleri sil
      await supabase.from('consultant_specialties').delete().eq('consultant_id', user.id)
      await supabase.from('consultant_documents').delete().eq('consultant_id', user.id)

      // Uzmanlık alanlarını grupla
      const specialtyGroups = specialtyDocuments.reduce((acc, doc) => {
        if (!acc[doc.specialty]) {
          acc[doc.specialty] = {
            experienceYears: doc.experienceYears,
            experienceMonths: doc.experienceMonths,
            documents: []
          }
        }
        if (doc.documentType && (doc.file || doc.url)) {
          acc[doc.specialty].documents.push(doc)
        }
        return acc
      }, {} as Record<string, any>)

      // Uzmanlık alanlarını ve belgeleri kaydet
      for (const [specialtyArea, data] of Object.entries(specialtyGroups)) {
        // Uzmanlık alanını kaydet
        await supabase.from('consultant_specialties').insert({
          consultant_id: user.id,
          specialty_area: specialtyArea,
          experience_years: data.experienceYears,
          experience_months: data.experienceMonths
        })

        // Belgeleri kaydet
        for (const doc of data.documents) {
          let documentUrl = doc.url

          if (doc.file) {
            const fileExt = doc.file.name.split('.').pop()
            const fileName = `${user.id}-${specialtyArea}-${doc.documentType}-${Date.now()}.${fileExt}`

            const { error: docUploadError } = await supabaseAdmin.storage
              .from('consultant-documents')
              .upload(fileName, doc.file, { cacheControl: '3600', upsert: true })

            if (!docUploadError) {
              const { data: docUrlData } = supabaseAdmin.storage
                .from('consultant-documents')
                .getPublicUrl(fileName)
              documentUrl = docUrlData.publicUrl
            }
          }

          if (documentUrl) {
            await supabase.from('consultant_documents').insert({
              consultant_id: user.id,
              specialty_area: specialtyArea,
              document_type: doc.documentType,
              document_url: documentUrl,
              file_name: doc.file?.name || doc.documentType
            })
          }
        }
      }

      // Özel başarı mesajı göster
      showCustomSuccess()

      onSave()
      onClose()

    } catch (error) {
      console.error('💥 Kayıt hatası:', error)
      showError('Kayıt sırasında bir hata oluştu')
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen || !user) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4" style={{ zIndex: 2147483647 }}>
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden" style={{ zIndex: 2147483648 }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">
                  Kullanıcı Düzenle
                </h3>
                <p className="text-purple-100 text-sm">
                  {formData.first_name} {formData.last_name}
                </p>
              </div>
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
          <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="p-6">

              {/* Ana İçerik - 2 Kolon */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Sol Kolon - Kişisel Bilgiler */}
                <div className="lg:col-span-2 space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center text-lg">
                        <User className="w-5 h-5 mr-2 text-green-600" />
                        Kişisel Bilgiler
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ad <span className="text-red-500">*</span>
                          </label>
                          <Input
                            value={formData.first_name}
                            onChange={(e) => handleInputChange('first_name', e.target.value)}
                            placeholder="Adınızı girin"
                            className={`h-9 ${!formData.first_name.trim() ? 'border-red-300 focus:border-red-500' : ''}`}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Soyad <span className="text-red-500">*</span>
                          </label>
                          <Input
                            value={formData.last_name}
                            onChange={(e) => handleInputChange('last_name', e.target.value)}
                            placeholder="Soyadınızı girin"
                            className={`h-9 ${!formData.last_name.trim() ? 'border-red-300 focus:border-red-500' : ''}`}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">TC Kimlik No</label>
                          <Input
                            value={formData.tc_no}
                            onChange={(e) => handleTcNoChange(e.target.value)}
                            placeholder="12345678901 (11 haneli)"
                            maxLength={11}
                            className={`h-9 ${formData.tc_no && formData.tc_no.length !== 11 ? 'border-red-300 focus:border-red-500' : ''}`}
                          />
                          {formData.tc_no && formData.tc_no.length !== 11 && (
                            <p className="text-xs text-red-500 mt-1">TC Kimlik No 11 haneli olmalıdır</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <Mail className="w-4 h-4 inline mr-1" />
                            E-posta <span className="text-red-500">*</span>
                          </label>
                          <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="ornek@email.com"
                            className={`h-9 ${!formData.email.trim() || (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) ? 'border-red-300 focus:border-red-500' : ''}`}
                            required
                          />
                          {formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                            <p className="text-xs text-red-500 mt-1">Geçerli bir e-posta adresi girin</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <Phone className="w-4 h-4 inline mr-1" />
                          Telefon
                        </label>
                        <Input
                          value={formData.phone}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          placeholder="+90 (555) 123 45 67"
                          className="h-9"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <FileText className="w-4 h-4 inline mr-1" />
                          Özgeçmiş / Bio
                        </label>
                        <Textarea
                          value={formData.bio}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          placeholder="Kendiniz hakkında kısa bilgi..."
                          rows={3}
                          className="resize-none"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sağ Kolon - Profil Fotoğrafı */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center text-lg">
                        <Camera className="w-5 h-5 mr-2 text-blue-600" />
                        Profil Fotoğrafı
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Fotoğraf Önizleme - Dikey Dikdörtgen */}
                      <div className="relative mx-auto w-32">
                        <div className="w-32 h-40 rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200 shadow-sm">
                          {isLoading ? (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                            </div>
                          ) : profilePhotoPreview ? (
                            <img
                              src={profilePhotoPreview}
                              alt="Profil fotoğrafı"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
                              <Camera className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Silme Butonu */}
                        {profilePhotoPreview && !isLoading && (
                          <button
                            onClick={handleDeletePhoto}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                            title="Fotoğrafı sil"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {/* Fotoğraf Ekleme Butonu */}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-9 text-sm"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Fotoğraf Ekle
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handlePhotoChange}
                      />
                      <p className="text-xs text-gray-500 text-center">
                        PNG, JPG, JPEG (Max 5MB)
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              {/* Uzmanlık Alanları ve Belgeler */}
              <Card className="mt-6">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg">
                    <MapPin className="w-5 h-5 mr-2 text-orange-600" />
                    Uzmanlık Alanları ve Belgeler
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Uzmanlık ve Belge Ekleme */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Uzmanlık Alanı</label>
                      <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {specialtyAreas.map((area) => (
                            <SelectItem key={area} value={area}>
                              {area}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Belge Türü</label>
                      <Select value={selectedDocumentType} onValueChange={setSelectedDocumentType}>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {documentTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="md:col-span-2">
                      <Button
                        type="button"
                        onClick={addSpecialtyDocument}
                        disabled={!selectedSpecialty || !selectedDocumentType}
                        className="w-full h-9 bg-green-600 hover:bg-green-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Ekle
                      </Button>
                    </div>
                  </div>

                  {/* Uzmanlık Alanları Tablosu */}
                  {specialtyDocuments.length > 0 && (
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left font-medium text-gray-700">Uzmanlık Alanı</th>
                            <th className="px-3 py-2 text-left font-medium text-gray-700">Belge Türü</th>
                            <th className="px-3 py-2 text-left font-medium text-gray-700">Tecrübe Yıl</th>
                            <th className="px-3 py-2 text-left font-medium text-gray-700">Tecrübe Ay</th>
                            <th className="px-3 py-2 text-left font-medium text-gray-700">İşlem</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {specialtyDocuments.map((doc, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-3 py-2">
                                <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs">
                                  {doc.specialty}
                                </Badge>
                              </td>
                              <td className="px-3 py-2">
                                <Badge variant="outline" className="text-xs">
                                  {doc.documentType || 'Belge Yok'}
                                </Badge>
                              </td>
                              <td className="px-3 py-2">
                                <Input
                                  type="number"
                                  min="0"
                                  max="50"
                                  value={doc.experienceYears}
                                  onChange={(e) => updateExperience(index, 'experienceYears', parseInt(e.target.value) || 0)}
                                  className="w-16 h-7 text-xs"
                                />
                              </td>
                              <td className="px-3 py-2">
                                <Input
                                  type="number"
                                  min="0"
                                  max="11"
                                  value={doc.experienceMonths}
                                  onChange={(e) => updateExperience(index, 'experienceMonths', parseInt(e.target.value) || 0)}
                                  className="w-16 h-7 text-xs"
                                />
                              </td>
                              <td className="px-3 py-2">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeSpecialtyDocument(index)}
                                  className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {specialtyDocuments.length === 0 && (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                      <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm font-medium mb-1">Henüz uzmanlık alanı eklenmemiş</p>
                      <p className="text-xs text-gray-400">Yukarıdaki form ile uzmanlık alanı ve belge ekleyebilirsiniz</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSaving || isLoading}
            >
              İptal
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || isLoading || !formData.first_name.trim() || !formData.last_name.trim() || !formData.email.trim()}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Kaydediliyor...
                </>
              ) : isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Yükleniyor...
                </>
              ) : (
                'Kaydet'
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  )
}

export default UserEditModal
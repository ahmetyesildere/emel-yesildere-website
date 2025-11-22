'use client'

import React, { useState, useEffect } from 'react'
import { X, Edit, User, Camera, Upload, Eye, Trash2, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    tc_no: '',
    email: '',
    phone: '',
    bio: '',
    role: '',
    profile_photo: null as File | null,
    profile_photo_preview: ''
  })

  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [selectedDocumentType, setSelectedDocumentType] = useState('')
  const [specialties, setSpecialties] = useState<{
    area: string
    documents: {
      file: File | null
      type: string
      preview?: string
    }[]
    experience_years: string
    experience_months: string
  }[]>([])

  // Uzmanlık alanları
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

  // Belge türleri
  const documentTypes = [
    'Sertifika',
    'Diploma',
    'CV',
    'Kimlik',
    'Diğer Belge'
  ]

  const [previewDocument, setPreviewDocument] = useState<{ file: File, type: string, preview: string } | null>(null)

  // Form verilerini kullanıcı bilgileri ile doldur
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        tc_no: user.tc_no || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        role: user.role || '',
        profile_photo: null,
        profile_photo_preview: user.profile_photo_url || ''
      })

      // Mevcut uzmanlık alanlarını yükle
      if (user.specialties && Array.isArray(user.specialties)) {
        const existingSpecialties = user.specialties.map((spec: any) => ({
          area: spec.area || spec,
          documents: [],
          experience_years: spec.experience_years || '1',
          experience_months: spec.experience_months || '0'
        }))
        setSpecialties(existingSpecialties)
      }
    }
  }, [user])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const base64String = event.target?.result as string
        setFormData(prev => ({
          ...prev,
          profile_photo: file,
          profile_photo_preview: base64String
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const addSpecialtyWithDocument = () => {
    if (selectedSpecialty && selectedDocumentType) {
      // Dosya seçimi için input'u tetikle
      const fileInput = document.createElement('input')
      fileInput.type = 'file'
      fileInput.accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx'
      fileInput.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = (event) => {
            const preview = event.target?.result as string

            // Mevcut uzmanlık alanını bul veya yeni oluştur
            const existingSpecialtyIndex = specialties.findIndex(s => s.area === selectedSpecialty)

            if (existingSpecialtyIndex >= 0) {
              // Mevcut uzmanlık alanına belge ekle
              setSpecialties(prev => prev.map((spec, i) =>
                i === existingSpecialtyIndex ? {
                  ...spec,
                  documents: [...spec.documents, { file, type: selectedDocumentType, preview }]
                } : spec
              ))
            } else {
              // Yeni uzmanlık alanı oluştur
              setSpecialties(prev => [...prev, {
                area: selectedSpecialty,
                documents: [{ file, type: selectedDocumentType, preview }],
                experience_years: '1',
                experience_months: '0'
              }])
            }
          }
          reader.readAsDataURL(file)
        }
      }
      fileInput.click()

      // Seçimleri sıfırla
      setSelectedSpecialty('')
      setSelectedDocumentType('')
    }
  }

  const removeSpecialty = (index: number) => {
    setSpecialties(prev => prev.filter((_, i) => i !== index))
  }

  const updateSpecialty = (index: number, field: string, value: any) => {
    setSpecialties(prev => prev.map((spec, i) =>
      i === index ? { ...spec, [field]: value } : spec
    ))
  }

  const addDocument = (specialtyIndex: number, file: File, type: string) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const preview = event.target?.result as string
      setSpecialties(prev => prev.map((spec, i) =>
        i === specialtyIndex ? {
          ...spec,
          documents: [...spec.documents, { file, type, preview }]
        } : spec
      ))
    }
    reader.readAsDataURL(file)
  }

  const removeDocument = (specialtyIndex: number, documentIndex: number) => {
    setSpecialties(prev => prev.map((spec, i) =>
      i === specialtyIndex ? {
        ...spec,
        documents: spec.documents.filter((_, j) => j !== documentIndex)
      } : spec
    ))
  }

  // Document Upload Button Component
  const DocumentUploadButton: React.FC<{
    specialtyIndex: number
    onUpload: (specialtyIndex: number, file: File, type: string) => void
  }> = ({ specialtyIndex, onUpload }) => {
    const [selectedDocType, setSelectedDocType] = useState('')
    const [showTypeSelector, setShowTypeSelector] = useState(false)

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file && selectedDocType) {
        onUpload(specialtyIndex, file, selectedDocType)
        setSelectedDocType('')
        setShowTypeSelector(false)
        // Reset file input
        e.target.value = ''
      }
    }

    return (
      <div className="relative">
        {!showTypeSelector ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTypeSelector(true)}
            className="text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-3 h-3 mr-1" />
            Belge Ekle
          </Button>
        ) : (
          <div className="flex items-center space-x-2">
            <Select value={selectedDocType} onValueChange={setSelectedDocType}>
              <SelectTrigger className="w-32 h-8">
                <SelectValue placeholder="Belge türü" />
              </SelectTrigger>
              <SelectContent
                className="z-[2147483651]"
                style={{ zIndex: 2147483651 }}
                sideOffset={5}
              >
                {documentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
              id={`file-upload-${specialtyIndex}`}
              disabled={!selectedDocType}
            />
            <label
              htmlFor={`file-upload-${specialtyIndex}`}
              className={`cursor-pointer px-2 py-1 text-xs rounded ${selectedDocType
                ? 'bg-green-50 text-green-600 hover:bg-green-100'
                : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
            >
              <Upload className="w-3 h-3 mr-1 inline" />
              Dosya Seç
            </label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowTypeSelector(false)
                setSelectedDocType('')
              }}
              className="h-6 w-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
    )
  }

  // Document Preview Modal
  const DocumentPreviewModal: React.FC<{
    document: { file: File, type: string, preview: string } | null
    onClose: () => void
  }> = ({ document, onClose }) => {
    if (!document) return null

    const isImage = document.file.type.startsWith('image/')
    const isPDF = document.file.type === 'application/pdf'

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4" style={{ zIndex: 2147483651 }}>
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <div>
              <h3 className="text-lg font-semibold">Belge Önizleme</h3>
              <p className="text-sm text-gray-600">{document.type} - {document.file.name}</p>
            </div>
            <Button variant="ghost" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="p-4 max-h-[calc(90vh-100px)] overflow-auto">
            {isImage ? (
              <img
                src={document.preview}
                alt={document.type}
                className="max-w-full max-h-full mx-auto rounded-lg"
              />
            ) : isPDF ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-red-600" />
                </div>
                <p className="text-gray-600 mb-4">PDF dosyası önizlemesi desteklenmiyor</p>
                <Button
                  onClick={() => {
                    const url = URL.createObjectURL(document.file)
                    window.open(url, '_blank')
                  }}
                  className="bg-red-600 hover:bg-red-700"
                >
                  PDF'i Yeni Sekmede Aç
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-gray-600" />
                </div>
                <p className="text-gray-600 mb-2">Bu dosya türü önizlenemiyor</p>
                <p className="text-sm text-gray-500">{document.file.name}</p>
                <p className="text-sm text-gray-500">Boyut: {(document.file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (!isOpen || !user) return null

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { label: 'Admin', color: 'bg-red-100 text-red-800' },
      consultant: { label: 'Danışman', color: 'bg-purple-100 text-purple-800' },
      client: { label: 'Müşteri', color: 'bg-blue-100 text-blue-800' },
      visitor: { label: 'Ziyaretçi', color: 'bg-gray-100 text-gray-800' }
    }
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.visitor
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const handleSave = () => {
    // TODO: Implement save functionality
    alert('Rol güncelleme özelliği geliştiriliyor.')
    onSave()
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4" style={{ zIndex: 2147483647 }}>
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden" style={{ zIndex: 2147483648 }}>
          {/* Sticky Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Edit className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Kullanıcı Bilgilerini Düzenle
                  </h3>
                  <p className="text-purple-100 text-sm">
                    {user.first_name} {user.last_name} - {user.email}
                  </p>
                </div>
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

          {/* Scrollable Content */}
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
            <div className="p-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column - Form Fields */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Basic Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <User className="w-5 h-5 mr-2 text-blue-600" />
                        Temel Bilgiler
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Ad *</label>
                          <Input
                            value={formData.first_name}
                            onChange={(e) => handleInputChange('first_name', e.target.value)}
                            placeholder="Ad"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Soyad *</label>
                          <Input
                            value={formData.last_name}
                            onChange={(e) => handleInputChange('last_name', e.target.value)}
                            placeholder="Soyad"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">TC Kimlik No</label>
                          <Input
                            value={formData.tc_no}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').slice(0, 11)
                              handleInputChange('tc_no', value)
                            }}
                            placeholder="12345678901"
                            maxLength={11}
                            className="font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">E-posta *</label>
                          <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="ornek@email.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onKeyDown={(e) => {
                            if (e.key === 'Backspace') {
                              e.preventDefault()
                              const currentDigits = formData.phone.replace(/\D/g, '')
                              if (currentDigits.length > 0) {
                                const newDigits = currentDigits.slice(0, -1)
                                if (newDigits.length === 0) {
                                  handleInputChange('phone', '')
                                } else {
                                  // Yeniden formatla
                                  let formatted = '+90 '
                                  if (newDigits.length >= 3) {
                                    formatted += `(${newDigits.substring(0, 3)}) `
                                    if (newDigits.length >= 6) {
                                      formatted += `${newDigits.substring(3, 6)} `
                                      if (newDigits.length >= 8) {
                                        formatted += `${newDigits.substring(6, 8)} `
                                        if (newDigits.length >= 10) {
                                          formatted += `${newDigits.substring(8, 10)}`
                                        } else {
                                          formatted += newDigits.substring(8)
                                        }
                                      } else {
                                        formatted += newDigits.substring(6)
                                      }
                                    } else {
                                      formatted += newDigits.substring(3)
                                    }
                                  } else if (newDigits.length > 0) {
                                    formatted += `(${newDigits}`
                                  }
                                  handleInputChange('phone', formatted)
                                }
                              }
                            }
                          }}
                          onChange={(e) => {
                            const inputValue = e.target.value
                            const currentValue = formData.phone.replace(/\D/g, '')
                            let newValue = inputValue.replace(/\D/g, '')

                            // Eğer kullanıcı silme işlemi yapıyorsa (yeni değer daha kısa)
                            if (newValue.length < currentValue.length) {
                              // Sadece rakam sayısına göre formatla
                              if (newValue.length === 0) {
                                handleInputChange('phone', '')
                                return
                              }
                            }

                            // Ülke kodunu temizle
                            if (newValue.startsWith('90')) {
                              newValue = newValue.substring(2)
                            }
                            if (newValue.startsWith('0')) {
                              newValue = newValue.substring(1)
                            }

                            // Maksimum 10 rakam
                            if (newValue.length <= 10) {
                              let formatted = '+90 '
                              if (newValue.length >= 3) {
                                formatted += `(${newValue.substring(0, 3)}) `
                                if (newValue.length >= 6) {
                                  formatted += `${newValue.substring(3, 6)} `
                                  if (newValue.length >= 8) {
                                    formatted += `${newValue.substring(6, 8)} `
                                    if (newValue.length >= 10) {
                                      formatted += `${newValue.substring(8, 10)}`
                                    } else {
                                      formatted += newValue.substring(8)
                                    }
                                  } else {
                                    formatted += newValue.substring(6)
                                  }
                                } else {
                                  formatted += newValue.substring(3)
                                }
                              } else if (newValue.length > 0) {
                                formatted += `(${newValue}`
                              } else {
                                formatted = ''
                              }
                              handleInputChange('phone', formatted)
                            }
                          }}
                          placeholder="+90 (555) 123 45 67"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Özgeçmiş</label>
                        <Textarea
                          value={formData.bio}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          placeholder="Kişi hakkında bilgi, deneyimler ve yaklaşım..."
                          rows={4}
                          className="resize-none"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Specialties */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <User className="w-5 h-5 mr-2 text-purple-600" />
                        Uzmanlık Alanları ve Belgeler
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Add Specialty and Document */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div style={{ zIndex: 2147483649 }}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Uzmanlık Alanı</label>
                          <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                            <SelectTrigger>
                              <SelectValue placeholder="Uzmanlık alanı seçin" />
                            </SelectTrigger>
                            <SelectContent
                              className="z-[2147483650]"
                              style={{ zIndex: 2147483650 }}
                              sideOffset={5}
                            >
                              {specialtyAreas.map((area) => (
                                <SelectItem key={area} value={area}>
                                  {area}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div style={{ zIndex: 2147483649 }}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Belge Türü</label>
                          <Select value={selectedDocumentType} onValueChange={setSelectedDocumentType}>
                            <SelectTrigger>
                              <SelectValue placeholder="Belge türü seçin" />
                            </SelectTrigger>
                            <SelectContent
                              className="z-[2147483650]"
                              style={{ zIndex: 2147483650 }}
                              sideOffset={5}
                            >
                              {documentTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-end">
                          <Button
                            onClick={addSpecialtyWithDocument}
                            disabled={!selectedSpecialty || !selectedDocumentType}
                            className="w-full"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Belge Ekle
                          </Button>
                        </div>
                      </div>

                      {/* Specialties Table */}
                      {specialties.length > 0 && (
                        <div className="border rounded-lg overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-3 py-3 text-left text-sm font-medium text-gray-700" style={{ width: '25%' }}>Uzmanlık Alanı</th>
                                <th className="px-3 py-3 text-left text-sm font-medium text-gray-700" style={{ width: '35%' }}>Belgeler</th>
                                <th className="px-3 py-3 text-left text-sm font-medium text-gray-700" style={{ width: '12%' }}>Yıl</th>
                                <th className="px-3 py-3 text-left text-sm font-medium text-gray-700" style={{ width: '12%' }}>Ay</th>
                                <th className="px-3 py-3 text-center text-sm font-medium text-gray-700" style={{ width: '16%' }}>İşlemler</th>
                              </tr>
                            </thead>
                            <tbody>
                              {specialties.map((specialty, specialtyIndex) => (
                                <tr key={specialtyIndex} className="border-t hover:bg-gray-50">
                                  <td className="px-4 py-3">
                                    <div className="font-medium text-gray-900">{specialty.area}</div>
                                  </td>
                                  <td className="px-3 py-3">
                                    <div className="space-y-1">
                                      {specialty.documents.length > 0 && (
                                        <div className="space-y-1">
                                          {specialty.documents.map((doc, docIndex) => (
                                            <div key={docIndex} className="flex items-center justify-between bg-blue-50 px-2 py-1 rounded text-xs">
                                              <Badge variant="outline" className="text-xs border-blue-200">
                                                {doc.type}
                                              </Badge>
                                              <div className="flex items-center space-x-1">
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => setPreviewDocument(doc)}
                                                  className="h-4 w-4 p-0 text-blue-600 hover:text-blue-700"
                                                >
                                                  <Eye className="w-3 h-3" />
                                                </Button>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => removeDocument(specialtyIndex, docIndex)}
                                                  className="h-4 w-4 p-0 text-red-600 hover:text-red-700"
                                                >
                                                  <X className="w-3 h-3" />
                                                </Button>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                      <div className="mt-1">
                                        <DocumentUploadButton
                                          specialtyIndex={specialtyIndex}
                                          onUpload={addDocument}
                                        />
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <Input
                                      type="number"
                                      min="0"
                                      max="50"
                                      value={specialty.experience_years}
                                      onChange={(e) => updateSpecialty(specialtyIndex, 'experience_years', e.target.value)}
                                      className="w-16 h-8"
                                    />
                                  </td>
                                  <td className="px-3 py-3">
                                    <Input
                                      type="number"
                                      min="0"
                                      max="11"
                                      value={specialty.experience_months}
                                      onChange={(e) => updateSpecialty(specialtyIndex, 'experience_months', e.target.value)}
                                      className="w-16 h-8"
                                    />
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => removeSpecialty(specialtyIndex)}
                                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Profile & Role */}
                <div className="space-y-6">
                  {/* Profile Photo */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Camera className="w-5 h-5 mr-2 text-indigo-600" />
                        Profil Fotoğrafı
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="w-32 h-40 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                          {formData.profile_photo_preview ? (
                            <img
                              src={formData.profile_photo_preview}
                              alt="Profile"
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="text-center">
                              <User className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                              <p className="text-xs text-gray-500">Fotoğraf Yok</p>
                            </div>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="hidden"
                          id="profile-photo-upload"
                        />
                        <label
                          htmlFor="profile-photo-upload"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Fotoğraf Seç
                        </label>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Role Selection */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Kullanıcı Rolü</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mevcut Rol:</label>
                        <div className="mb-4">{getRoleBadge(user.role)}</div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Yeni Rol:</label>
                        <div style={{ zIndex: 2147483649 }}>
                          <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Rol seçin" />
                            </SelectTrigger>
                            <SelectContent
                              className="z-[2147483650]"
                              style={{ zIndex: 2147483650 }}
                              sideOffset={5}
                            >
                              <SelectItem value="visitor">
                                <div className="flex items-center space-x-2">
                                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                                  <span>Ziyaretçi</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="client">
                                <div className="flex items-center space-x-2">
                                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                  <span>Müşteri</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="consultant">
                                <div className="flex items-center space-x-2">
                                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                  <span>Danışman</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="admin">
                                <div className="flex items-center space-x-2">
                                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                  <span>Admin</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <Button variant="outline" onClick={onClose}>
                  İptal
                </Button>
                <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
                  Değişiklikleri Kaydet
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Document Preview Modal */}
      <DocumentPreviewModal
        document={previewDocument}
        onClose={() => setPreviewDocument(null)}
      />
    </>
  )
}

export default UserEditModal
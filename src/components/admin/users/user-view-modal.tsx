'use client'

import React, { useState, useEffect } from 'react'
import { X, User, Edit, Mail, Phone, Camera, MapPin, FileText, Eye, Download } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

interface UserViewModalProps {
  isOpen: boolean
  user: any
  onClose: () => void
  onEdit: (user: any) => void
}

interface SpecialtyData {
  specialty_area: string
  experience_years: number
  experience_months: number
  documents: DocumentData[]
}

interface DocumentData {
  document_type: string
  document_url: string
  file_name: string
}

const UserViewModal: React.FC<UserViewModalProps> = ({
  isOpen,
  user,
  onClose,
  onEdit
}) => {
  const [specialties, setSpecialties] = useState<SpecialtyData[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Uzmanlık alanları ve belgeleri yükle
  useEffect(() => {
    const loadSpecialties = async () => {
      if (isOpen && user?.id) {
        setIsLoading(true)
        try {
          // Uzmanlık alanlarını yükle
          const { data: specialtiesData, error: specialtiesError } = await supabase
            .from('consultant_specialties')
            .select('*')
            .eq('consultant_id', user.id)

          if (!specialtiesError && specialtiesData) {
            const specialtiesWithDocs: SpecialtyData[] = []

            for (const spec of specialtiesData) {
              // Her uzmanlık alanı için belgeleri yükle
              const { data: docsData } = await supabase
                .from('consultant_documents')
                .select('*')
                .eq('consultant_id', user.id)
                .eq('specialty_area', spec.specialty_area)

              specialtiesWithDocs.push({
                specialty_area: spec.specialty_area,
                experience_years: spec.experience_years || 0,
                experience_months: spec.experience_months || 0,
                documents: docsData || []
              })
            }

            setSpecialties(specialtiesWithDocs)
          }
        } catch (error) {
          console.error('Uzmanlık alanları yükleme hatası:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadSpecialties()
  }, [isOpen, user?.id])

  if (!isOpen || !user) return null

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { label: 'Admin', color: 'bg-red-100 text-red-800' },
      admin_assistant: { label: 'Admin Yrd.', color: 'bg-orange-100 text-orange-800' },
      consultant: { label: 'Danışman', color: 'bg-purple-100 text-purple-800' },
      client: { label: 'Danışan', color: 'bg-blue-100 text-blue-800' },
      visitor: { label: 'Ziyaretçi', color: 'bg-gray-100 text-gray-800' }
    }
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.visitor
    return <Badge className={config.color}>{config.label}</Badge>
  }

  // Belge önizleme fonksiyonu
  const previewDocument = (documentUrl: string) => {
    window.open(documentUrl, '_blank')
  }

  // Telefon formatı
  const formatPhone = (phone: string) => {
    if (!phone) return ''
    const numericValue = phone.replace(/\D/g, '')
    if (numericValue.length === 10) {
      return `+90 (${numericValue.slice(0, 3)}) ${numericValue.slice(3, 6)} ${numericValue.slice(6, 8)} ${numericValue.slice(8, 10)}`
    }
    return phone
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4" style={{ zIndex: 2147483647 }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" style={{ zIndex: 2147483648 }}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Kullanıcı Detayları
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Sol Kolon - Kişisel Bilgiler */}
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="w-5 h-5 mr-2 text-blue-600" />
                      Profil Bilgileri
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
                        <p className="text-gray-900 bg-gray-50 p-2 rounded">{user.first_name || '-'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Soyad</label>
                        <p className="text-gray-900 bg-gray-50 p-2 rounded">{user.last_name || '-'}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                      <p className="text-gray-900 bg-gray-50 p-2 rounded">{user.email}</p>
                    </div>

                    {user.phone && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                        <p className="text-gray-900 bg-gray-50 p-2 rounded">{formatPhone(user.phone)}</p>
                      </div>
                    )}

                    {user.tc_no && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">TC Kimlik No</label>
                        <p className="text-gray-900 bg-gray-50 p-2 rounded">{user.tc_no}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                        <div>{getRoleBadge(user.role)}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                        <Badge className={user.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {user.is_active ? 'Aktif' : 'Pasif'}
                        </Badge>
                      </div>
                    </div>

                    {user.bio && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded">{user.bio}</p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Kayıt Tarihi</label>
                      <p className="text-gray-900 bg-gray-50 p-2 rounded text-sm">
                        {new Date(user.created_at).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sağ Kolon - Profil Fotoğrafı */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Camera className="w-5 h-5 mr-2 text-blue-600" />
                      Profil Fotoğrafı
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center">
                      <div className="w-32 h-40 rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200 shadow-sm">
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt="Profil fotoğrafı"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
                            <Camera className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Uzmanlık Alanları ve Belgeler */}
            {specialties.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-orange-600" />
                    Uzmanlık Alanları ve Belgeler
                    {isLoading && (
                      <div className="ml-2 animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {specialties.map((specialty, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-800">{specialty.specialty_area}</h4>
                          <Badge variant="outline" className="text-xs">
                            {specialty.experience_years} yıl {specialty.experience_months} ay tecrübe
                          </Badge>
                        </div>

                        {specialty.documents.length > 0 ? (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-600 mb-2">Belgeler:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {specialty.documents.map((doc, docIndex) => (
                                <div key={docIndex} className="flex items-center justify-between bg-gray-50 p-2 rounded border">
                                  <div className="flex items-center">
                                    <FileText className="w-4 h-4 text-blue-600 mr-2" />
                                    <span className="text-sm text-gray-700">{doc.document_type}</span>
                                  </div>
                                  <div className="flex space-x-1">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => previewDocument(doc.document_url)}
                                      className="h-7 px-2 text-xs"
                                    >
                                      <Eye className="w-3 h-3 mr-1" />
                                      Önizle
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => window.open(doc.document_url, '_blank')}
                                      className="h-7 px-2 text-xs"
                                    >
                                      <Download className="w-3 h-3 mr-1" />
                                      İndir
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 italic">Bu uzmanlık alanı için henüz belge yüklenmemiş.</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Hızlı İşlemler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    onClick={() => {
                      onClose()
                      onEdit(user)
                    }}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Düzenle
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(user.email)
                      alert('E-posta adresi kopyalandı!')
                    }}
                    className="w-full"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    E-posta Kopyala
                  </Button>
                  {user.phone && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(user.phone)
                        alert('Telefon numarası kopyalandı!')
                      }}
                      className="w-full"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Telefon Kopyala
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
            <Button variant="outline" onClick={onClose}>
              Kapat
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserViewModal
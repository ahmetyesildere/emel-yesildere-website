'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/auth-context'
import { User, Mail, Phone, Calendar, Edit, Save, X, MapPin, Cake, Heart } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'

export default function ProfilePage() {
  const { user, profile, loading, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    bio: '',
    address: '',
    city: '',
    birth_date: '',
    gender: ''
  })
  const [saving, setSaving] = useState(false)

  // Profile yüklendiğinde edit data'yı güncelle
  useEffect(() => {
    if (profile) {
      setEditData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        address: profile.address || '',
        city: profile.city || '',
        birth_date: profile.birth_date || '',
        gender: profile.gender || ''
      })
    }
  }, [profile])

  const handleEdit = () => {
    if (profile) {
      setEditData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        address: profile.address || '',
        city: profile.city || '',
        birth_date: profile.birth_date || '',
        gender: profile.gender || ''
      })
    }
    setIsEditing(true)
  }

  const handleSave = async () => {
    // Onay mesajı göster
    const confirmMessage = `Profil bilgileriniz güncellenecek:

Ad: ${editData.first_name}
Soyad: ${editData.last_name}
Telefon: ${editData.phone || 'Belirtilmemiş'}
Şehir: ${editData.city || 'Belirtilmemiş'}
Adres: ${editData.address || 'Belirtilmemiş'}
Doğum Tarihi: ${editData.birth_date || 'Belirtilmemiş'}
Cinsiyet: ${editData.gender || 'Belirtilmemiş'}

Bu değişiklikleri kaydetmek istediğinizden emin misiniz?`

    if (!confirm(confirmMessage)) {
      return
    }

    setSaving(true)
    try {
      console.log('Saving profile data:', editData)
      
      const { error } = await updateProfile(editData)
      
      if (error) {
        console.error('Profile update error:', error)
        alert('Profil güncellenirken hata oluştu: ' + error.message)
      } else {
        console.log('Profile updated successfully')
        alert('Profil bilgileriniz başarıyla güncellendi!')
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Profile update exception:', error)
      alert('Profil güncellenirken hata oluştu!')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    if (profile) {
      setEditData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        address: profile.address || '',
        city: profile.city || '',
        birth_date: profile.birth_date || '',
        gender: profile.gender || ''
      })
    }
  }

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

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profil</h1>
          <p className="text-gray-600">Hesap bilgilerinizi görüntüleyin ve düzenleyin</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Kişisel Bilgiler</span>
                  {!isEditing ? (
                    <Button variant="outline" size="sm" onClick={handleEdit}>
                      <Edit className="w-4 h-4 mr-2" />
                      Düzenle
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={handleCancel}>
                        <X className="w-4 h-4 mr-2" />
                        İptal
                      </Button>
                      <Button size="sm" onClick={handleSave} disabled={saving}>
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? 'Kaydediliyor...' : 'Kaydet'}
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {profile.first_name} {profile.last_name}
                    </h3>
                    <p className="text-gray-600">{profile.email}</p>
                    {getRoleBadge(profile.role)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ad</label>
                    {isEditing ? (
                      <Input
                        value={editData.first_name}
                        onChange={(e) => setEditData({...editData, first_name: e.target.value})}
                        placeholder="Adınız"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-900">{profile.first_name || '-'}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Soyad</label>
                    {isEditing ? (
                      <Input
                        value={editData.last_name}
                        onChange={(e) => setEditData({...editData, last_name: e.target.value})}
                        placeholder="Soyadınız"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-900">{profile.last_name || '-'}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                    <div className="p-3 bg-gray-50 rounded-lg flex items-center">
                      <Mail className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{profile.email}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                    {isEditing ? (
                      <Input
                        value={editData.phone}
                        onChange={(e) => setEditData({...editData, phone: e.target.value})}
                        placeholder="Telefon numaranız"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg flex items-center">
                        <Phone className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-900">{profile.phone || '-'}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Doğum Tarihi</label>
                    {isEditing ? (
                      <Input
                        type="date"
                        value={editData.birth_date}
                        onChange={(e) => setEditData({...editData, birth_date: e.target.value})}
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg flex items-center">
                        <Cake className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-900">
                          {profile.birth_date ? new Date(profile.birth_date).toLocaleDateString('tr-TR') : '-'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cinsiyet</label>
                    {isEditing ? (
                      <select
                        value={editData.gender}
                        onChange={(e) => setEditData({...editData, gender: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Seçiniz</option>
                        <option value="Erkek">Erkek</option>
                        <option value="Kadın">Kadın</option>
                        <option value="Diğer">Diğer</option>
                      </select>
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg flex items-center">
                        <Heart className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-900">{profile.gender || '-'}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Şehir</label>
                    {isEditing ? (
                      <Input
                        value={editData.city}
                        onChange={(e) => setEditData({...editData, city: e.target.value})}
                        placeholder="Şehriniz"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-900">{profile.city || '-'}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Adres</label>
                    {isEditing ? (
                      <Input
                        value={editData.address}
                        onChange={(e) => setEditData({...editData, address: e.target.value})}
                        placeholder="Adresiniz"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-900">{profile.address || '-'}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bio Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hakkımda</label>
                  {isEditing ? (
                    <textarea
                      value={editData.bio}
                      onChange={(e) => setEditData({...editData, bio: e.target.value})}
                      placeholder="Kendiniz hakkında kısa bilgi..."
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-900">{profile.bio || 'Henüz bir açıklama eklenmemiş.'}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hesap İstatistikleri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Üyelik Tarihi</span>
                  <span className="font-medium">
                    {profile.created_at ? new Date(profile.created_at).toLocaleDateString('tr-TR') : '-'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Toplam Seans</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Son Güncelleme</span>
                  <span className="font-medium">
                    {profile.updated_at ? new Date(profile.updated_at).toLocaleDateString('tr-TR') : '-'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Hesap Durumu</span>
                  <Badge className={profile.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {profile.is_active ? 'Aktif' : 'Pasif'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hızlı İşlemler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Randevu Al
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Mesaj Gönder
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'

import React, { useState } from 'react'
import { Save, Phone, Mail, MapPin, Clock, Globe } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useContactInfo } from '@/hooks/use-contact-info'
import { useSafeToast } from '@/hooks/use-safe-toast'

const ContactSettings = () => {
  const { contactInfo, updateContactInfo, isLoading } = useContactInfo()
  const toast = useSafeToast()
  const [saving, setSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    phone: contactInfo.phone,
    email: contactInfo.email,
    whatsapp: contactInfo.whatsapp,
    address: contactInfo.address,
    mapUrl: contactInfo.mapUrl,
    workingHours: {
      weekdays: contactInfo.workingHours.weekdays,
      saturday: contactInfo.workingHours.saturday,
      sunday: contactInfo.workingHours.sunday
    }
  })

  // contactInfo değiştiğinde formData'yı güncelle
  React.useEffect(() => {
    setFormData({
      phone: contactInfo.phone,
      email: contactInfo.email,
      whatsapp: contactInfo.whatsapp,
      address: contactInfo.address,
      mapUrl: contactInfo.mapUrl,
      workingHours: {
        weekdays: contactInfo.workingHours.weekdays,
        saturday: contactInfo.workingHours.saturday,
        sunday: contactInfo.workingHours.sunday
      }
    })
  }, [contactInfo])

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('workingHours.')) {
      const subField = field.split('.')[1]
      setFormData(prev => ({
        ...prev,
        workingHours: {
          ...prev.workingHours,
          [subField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      console.log('💾 Kaydedilecek form verisi:', formData)
      const success = await updateContactInfo(formData)
      if (success) {
        toast.success('İletişim bilgileri başarıyla güncellendi!')
        console.log('✅ İletişim bilgileri başarıyla kaydedildi')
      } else {
        toast.error('Güncelleme sırasında bir hata oluştu')
        console.error('❌ updateContactInfo false döndü')
      }
    } catch (error) {
      console.error('❌ Kaydetme hatası:', error)
      toast.error('Kaydetme sırasında bir hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-2">İletişim bilgileri yükleniyor...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">İletişim Bilgileri Ayarları</h2>
          <p className="text-gray-600">Web sitesinde görünen iletişim bilgilerini düzenleyin</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* İletişim Bilgileri */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              İletişim Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="phone">Telefon Numarası</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+90 555 123 4567"
              />
            </div>

            <div>
              <Label htmlFor="email">E-posta Adresi</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="emel@emelyesildere.com"
              />
            </div>

            <div>
              <Label htmlFor="whatsapp">WhatsApp Numarası</Label>
              <Input
                id="whatsapp"
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                placeholder="+90 555 123 4567"
              />
            </div>
          </CardContent>
        </Card>

        {/* Adres Bilgileri */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Adres Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Adres</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Günaydın mah. Terziler cad. No:74 Kat 3 Daire 5 Bandırma-Balıkesir"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="mapUrl">Harita URL'i</Label>
              <Input
                id="mapUrl"
                type="url"
                value={formData.mapUrl}
                onChange={(e) => handleInputChange('mapUrl', e.target.value)}
                placeholder="https://maps.google.com/..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Google Maps embed URL'ini buraya yapıştırın
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Çalışma Saatleri */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Çalışma Saatleri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="weekdays">Hafta İçi (Pzt-Cum)</Label>
                <Input
                  id="weekdays"
                  value={formData.workingHours.weekdays}
                  onChange={(e) => handleInputChange('workingHours.weekdays', e.target.value)}
                  placeholder="09:00 - 18:00"
                />
              </div>

              <div>
                <Label htmlFor="saturday">Cumartesi</Label>
                <Input
                  id="saturday"
                  value={formData.workingHours.saturday}
                  onChange={(e) => handleInputChange('workingHours.saturday', e.target.value)}
                  placeholder="10:00 - 16:00"
                />
              </div>

              <div>
                <Label htmlFor="sunday">Pazar</Label>
                <Input
                  id="sunday"
                  value={formData.workingHours.sunday}
                  onChange={(e) => handleInputChange('workingHours.sunday', e.target.value)}
                  placeholder="Kapalı"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Önizleme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Web sitesinde böyle görünecek:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Phone className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="font-medium">Telefon</span>
                </div>
                <p className="text-gray-700">{formData.phone}</p>
                <p className="text-xs text-gray-500 mt-1">{formData.workingHours.weekdays}</p>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Mail className="w-4 h-4 mr-2 text-purple-600" />
                  <span className="font-medium">E-posta</span>
                </div>
                <p className="text-gray-700">{formData.email}</p>
                <p className="text-xs text-gray-500 mt-1">24 saat içinde yanıt</p>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Phone className="w-4 h-4 mr-2 text-green-600" />
                  <span className="font-medium">WhatsApp</span>
                </div>
                <p className="text-gray-700">{formData.whatsapp}</p>
                <p className="text-xs text-gray-500 mt-1">24/7 Aktif</p>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <MapPin className="w-4 h-4 mr-2 text-red-600" />
                  <span className="font-medium">Adres</span>
                </div>
                <p className="text-gray-700 text-xs">{formData.address}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ContactSettings
'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useAboutInfo } from '@/hooks/use-about-info'
import { Save, X, Plus, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

const AboutManagement = () => {
  const { aboutInfo, updateAboutInfo, isLoading } = useAboutInfo()
  const [formData, setFormData] = useState(aboutInfo)
  const [newService, setNewService] = useState('')
  const [uploadingPhoto, setUploadingPhoto] = useState(false)

  // aboutInfo değiştiğinde formData'yı güncelle
  React.useEffect(() => {
    setFormData(aboutInfo)
  }, [aboutInfo])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddService = () => {
    if (newService.trim()) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, newService.trim()]
      }))
      setNewService('')
    }
  }

  const handleRemoveService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }))
  }

  const handleSave = async () => {
    const result = await updateAboutInfo(formData)
    if (result.success) {
      toast.success('Hakkımda bilgileri başarıyla güncellendi!')
    } else {
      toast.error('Güncelleme başarısız: ' + result.error)
    }
  }



  // Basit dosya yükleme (local) - Otomatik kaydetme ile
  const handleLocalPhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    console.log('Dosya seçildi:', file.name, file.type, file.size)

    // Dosya türü kontrolü
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Sadece JPG, JPEG ve PNG formatları desteklenir!')
      return
    }

    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Dosya boyutu 5MB\'dan küçük olmalıdır!')
      return
    }

    setUploadingPhoto(true)
    toast.info('Fotoğraf yükleniyor...')

    // FileReader ile dosyayı base64'e çevir
    const reader = new FileReader()
    reader.onload = async (e) => {
      const result = e.target?.result as string
      console.log('Base64 dönüşümü tamamlandı, boyut:', result.length)
      
      // Fotoğrafı formData'ya ekle
      const updatedFormData = {
        ...formData,
        photo: result
      }
      
      console.log('FormData güncelleniyor...')
      setFormData(updatedFormData)
      
      // Otomatik olarak kaydet
      console.log('Kaydetme işlemi başlatılıyor...')
      const saveResult = await updateAboutInfo(updatedFormData)
      console.log('Kaydetme sonucu:', saveResult)
      
      if (saveResult.success) {
        toast.success('Fotoğraf başarıyla yüklendi ve kaydedildi!')
        console.log('Fotoğraf başarıyla kaydedildi')
      } else {
        toast.error('Fotoğraf yüklendi ancak kaydetme başarısız: ' + saveResult.error)
        console.error('Kaydetme hatası:', saveResult.error)
      }
      
      setUploadingPhoto(false)
    }
    reader.onerror = (error) => {
      console.error('FileReader hatası:', error)
      toast.error('Fotoğraf yükleme hatası!')
      setUploadingPhoto(false)
    }
    reader.readAsDataURL(file)
  }

  // URL değiştiğinde otomatik kaydetme
  const handlePhotoUrlChange = async (url: string) => {
    const updatedFormData = {
      ...formData,
      photo: url
    }
    
    setFormData(updatedFormData)
    
    // Eğer URL boş değilse otomatik kaydet
    if (url.trim()) {
      const saveResult = await updateAboutInfo(updatedFormData)
      if (saveResult.success) {
        toast.success('Fotoğraf URL\'si kaydedildi!')
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Hakkımda Yönetimi</h2>
        <Button 
          onClick={handleSave} 
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temel Bilgiler - Tam genişlik */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Temel Bilgiler ve Profil Fotoğrafı</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Sol Kolon - Temel Bilgiler */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Ad Soyad</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Emel Yeşildere"
                  />
                </div>

                <div>
                  <Label htmlFor="title">Unvan</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Duygu Temizliği Uzmanı & Yaşam Koçu"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Kısa Açıklama</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Kısa tanıtım yazısı..."
                    rows={4}
                  />
                </div>
              </div>

              {/* Sağ Kolon - Profil Fotoğrafı */}
              <div>
                <Label className="text-base font-semibold">Profil Fotoğrafı</Label>
                
                {/* Mevcut Fotoğraf Önizleme */}
                {formData.photo && (
                  <div className="mb-4 mt-2">
                    <div className="relative w-48 h-60 rounded-lg overflow-hidden border border-gray-200 mx-auto">
                      {formData.photo.startsWith('data:') ? (
                        // Base64 image için img tag kullan
                        <img
                          src={formData.photo}
                          alt="Profil fotoğrafı"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        // Normal URL için Next.js Image kullan
                        <Image
                          src={formData.photo}
                          alt="Profil fotoğrafı"
                          fill
                          className="object-cover"
                        />
                      )}
                      <button
                        onClick={() => handleInputChange('photo', '')}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 text-center">Mevcut fotoğraf</p>
                  </div>
                )}

                {/* Fotoğraf Yükleme */}
                <div className="space-y-4 mt-4">
                  {/* Basit Dosya Yükleme */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleLocalPhotoUpload}
                      className="hidden"
                      id="photo-upload"
                      disabled={uploadingPhoto}
                    />
                    <label 
                      htmlFor="photo-upload" 
                      className="cursor-pointer flex flex-col items-center space-y-2"
                    >
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                      <div className="text-sm text-gray-600">
                        {uploadingPhoto ? 'Yükleniyor...' : 'Fotoğraf Seç'}
                      </div>
                      <div className="text-xs text-gray-500">
                        JPG, JPEG, PNG (Max: 5MB)
                      </div>
                    </label>
                  </div>
                  
                  <div className="text-center text-gray-500 text-sm">veya</div>
                  
                  <div>
                    <Label htmlFor="photo">Fotoğraf URL'si</Label>
                    <Input
                      id="photo"
                      value={formData.photo}
                      onChange={(e) => handlePhotoUrlChange(e.target.value)}
                      placeholder="/images/emel-profile.jpg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* İstatistikler */}
        <Card>
          <CardHeader>
            <CardTitle>İstatistikler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="experience">Deneyim (Yıl)</Label>
              <Input
                id="experience"
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                placeholder="3+"
              />
            </div>

            <div>
              <Label htmlFor="clientCount">Müşteri Sayısı</Label>
              <Input
                id="clientCount"
                value={formData.clientCount}
                onChange={(e) => handleInputChange('clientCount', e.target.value)}
                placeholder="100+"
              />
            </div>

            <div>
              <Label htmlFor="rating">Puan</Label>
              <Input
                id="rating"
                value={formData.rating}
                onChange={(e) => handleInputChange('rating', e.target.value)}
                placeholder="4.9"
              />
            </div>
          </CardContent>
        </Card>

        {/* Hizmetler */}
        <Card>
          <CardHeader>
            <CardTitle>Hizmetler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {formData.services.map((service, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {service}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-red-500" 
                    onClick={() => handleRemoveService(index)}
                  />
                </Badge>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                placeholder="Yeni hizmet ekle..."
                onKeyDown={(e) => e.key === 'Enter' && handleAddService()}
              />
              <Button onClick={handleAddService} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Hikaye */}
        <Card>
          <CardHeader>
            <CardTitle>Hikayem</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.story}
              onChange={(e) => handleInputChange('story', e.target.value)}
              placeholder="Kişisel hikayenizi yazın..."
              rows={6}
            />
          </CardContent>
        </Card>

        {/* Yaklaşım */}
        <Card>
          <CardHeader>
            <CardTitle>Yaklaşımım</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.approach}
              onChange={(e) => handleInputChange('approach', e.target.value)}
              placeholder="Çalışma yaklaşımınızı açıklayın..."
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Yolculuk */}
        <Card>
          <CardHeader>
            <CardTitle>Yolculuğum</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.journey}
              onChange={(e) => handleInputChange('journey', e.target.value)}
              placeholder="Sürekli gelişim yolculuğunuzdan bahsedin..."
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Tutku */}
        <Card>
          <CardHeader>
            <CardTitle>Tutkum</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.passion}
              onChange={(e) => handleInputChange('passion', e.target.value)}
              placeholder="İnsanlara yardım etme tutkunuzdan bahsedin..."
              rows={4}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AboutManagement
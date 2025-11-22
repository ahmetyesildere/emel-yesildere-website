'use client'

import React, { useState } from 'react'
import { 
  Edit, Image, FileText, Star, Users, Heart, 
  Plus, Trash2, Eye, Save, Upload, Download,
  Globe, Smartphone, Monitor, Settings, Palette
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const ContentManagement = () => {
  const [activeContentTab, setActiveContentTab] = useState('homepage')

  const contentSections = [
    { id: 'homepage', label: 'Ana Sayfa', icon: Globe },
    { id: 'about', label: 'Hakkımda', icon: Users },
    { id: 'services', label: 'Hizmetler', icon: Heart },
    { id: 'testimonials', label: 'Yorumlar', icon: Star },
    { id: 'media', label: 'Medya', icon: Image },
    { id: 'seo', label: 'SEO', icon: Settings }
  ]

  // Homepage Content
  const homepageContent = {
    hero: {
      title: 'Duygu Temizliği ve Holistik Koçluk',
      subtitle: 'İç huzurunuzu bulun, yaşamınızı dönüştürün',
      description: 'Uzman duygu temizliği ve holistik koçluk hizmetleri ile kişisel gelişim yolculuğunuzda size rehberlik ediyorum.',
      ctaText: 'Ücretsiz Danışma Al',
      backgroundImage: '/images/hero-bg.jpg'
    },
    stats: [
      { label: 'Mutlu Müşteri', value: '100+', icon: 'users' },
      { label: 'Başarılı Seans', value: '2000+', icon: 'calendar' },
      { label: 'Deneyim Yılı', value: '3+', icon: 'award' },
      { label: 'Memnuniyet Oranı', value: '%98', icon: 'heart' }
    ],
    services: [
      {
        title: 'Duygu Temizliği',
        description: 'Bilinçaltınızdaki olumsuz duyguları temizleyerek iç huzurunuzu bulun',
        price: '₺500',
        duration: '60 dakika'
      },
      {
        title: 'Travma İyileştirme',
        description: 'Geçmiş travmalarınızı işleyerek iyileşme sürecinizi destekliyoruz',
        price: '₺750',
        duration: '60 dakika'
      },
      {
        title: 'Yaşam Koçluğu',
        description: 'Hedeflerinize ulaşmanız için kişisel gelişim desteği',
        price: '₺400',
        duration: '60 dakika'
      }
    ]
  }

  const testimonials = [
    {
      id: 1,
      name: 'Ayşe Kaya',
      title: 'Pazarlama Uzmanı',
      content: 'Emel Hanım ile yaptığım duygu temizliği seansları hayatımı değiştirdi. Kendimi çok daha huzurlu hissediyorum.',
      rating: 5,
      image: '/images/testimonial-1.jpg',
      featured: true,
      approved: true
    },
    {
      id: 2,
      name: 'Mehmet Demir',
      title: 'Mühendis',
      content: 'Travma iyileştirme sürecinde aldığım destek sayesinde geçmişimle barışabildim. Çok teşekkür ederim.',
      rating: 5,
      image: '/images/testimonial-2.jpg',
      featured: false,
      approved: true
    },
    {
      id: 3,
      name: 'Fatma Özkan',
      title: 'Öğretmen',
      content: 'Yaşam koçluğu seansları ile hedeflerimi netleştirdim ve hayallerimi gerçekleştirme yolunda ilerliyorum.',
      rating: 5,
      image: '/images/testimonial-3.jpg',
      featured: true,
      approved: false
    }
  ]

  const mediaFiles = [
    {
      id: 1,
      name: 'hero-background.jpg',
      type: 'image',
      size: '2.4 MB',
      dimensions: '1920x1080',
      uploadDate: '2024-07-20',
      usage: 'Ana sayfa hero bölümü'
    },
    {
      id: 2,
      name: 'about-photo.jpg',
      type: 'image',
      size: '1.8 MB',
      dimensions: '800x600',
      uploadDate: '2024-07-18',
      usage: 'Hakkımda sayfası'
    },
    {
      id: 3,
      name: 'service-icon-1.svg',
      type: 'image',
      size: '24 KB',
      dimensions: '64x64',
      uploadDate: '2024-07-15',
      usage: 'Hizmetler ikonu'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">İçerik Yönetimi</h2>
          <p className="text-gray-600">Website içeriklerini düzenleyin ve yönetin</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Yedek Al
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" />
            Değişiklikleri Kaydet
          </Button>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs value={activeContentTab} onValueChange={setActiveContentTab}>
        <TabsList className="grid w-full grid-cols-6">
          {contentSections.map((section) => {
            const IconComponent = section.icon
            return (
              <TabsTrigger
                key={section.id}
                value={section.id}
                className="flex items-center space-x-2"
              >
                <IconComponent className="w-4 h-4" />
                <span className="hidden sm:inline">{section.label}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {/* Homepage Content */}
        <TabsContent value="homepage" className="space-y-6">
          {/* Hero Section */}
          <Card>
            <CardHeader>
              <CardTitle>Hero Bölümü</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
                  <Input defaultValue={homepageContent.hero.title} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Alt Başlık</label>
                  <Input defaultValue={homepageContent.hero.subtitle} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                <Textarea defaultValue={homepageContent.hero.description} rows={3} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Buton Metni</label>
                  <Input defaultValue={homepageContent.hero.ctaText} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Arkaplan Görseli</label>
                  <div className="flex items-center space-x-2">
                    <Input defaultValue={homepageContent.hero.backgroundImage} />
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Section */}
          <Card>
            <CardHeader>
              <CardTitle>İstatistikler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {homepageContent.stats.map((stat, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="space-y-2">
                      <Input defaultValue={stat.label} placeholder="Etiket" />
                      <Input defaultValue={stat.value} placeholder="Değer" />
                      <Input defaultValue={stat.icon} placeholder="İkon" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Services Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Hizmetler Önizleme</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {homepageContent.services.map((service, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="space-y-2">
                      <Input defaultValue={service.title} placeholder="Hizmet Adı" />
                      <Textarea defaultValue={service.description} placeholder="Açıklama" rows={2} />
                      <div className="grid grid-cols-2 gap-2">
                        <Input defaultValue={service.price} placeholder="Fiyat" />
                        <Input defaultValue={service.duration} placeholder="Süre" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Content */}
        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hakkımda İçeriği</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
                <Input defaultValue="Emel Yeşildere" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alt Başlık</label>
                <Input defaultValue="Duygu Temizliği ve Holistik Koçluk Uzmanı" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hikayem</label>
                <Textarea 
                  defaultValue="8 yıldır duygu temizliği ve holistik koçluk alanında çalışıyorum. Binlerce kişinin hayatına dokunarak onların iç huzurlarını bulmalarına yardımcı oldum..."
                  rows={6}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profil Fotoğrafı</label>
                  <div className="flex items-center space-x-2">
                    <Input defaultValue="/images/emel-profile.jpg" />
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sertifikalar</label>
                  <Button variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Sertifika Ekle
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Content */}
        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Hizmetler</CardTitle>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Hizmet
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {homepageContent.services.map((service, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Input defaultValue={service.title} placeholder="Hizmet Adı" />
                      <Input defaultValue={service.price} placeholder="Fiyat" />
                      <Input defaultValue={service.duration} placeholder="Süre" />
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2">
                      <Textarea defaultValue={service.description} placeholder="Açıklama" rows={2} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Testimonials Content */}
        <TabsContent value="testimonials" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Müşteri Yorumları</CardTitle>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Yorum
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
                          <p className="text-sm text-gray-600">{testimonial.title}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {testimonial.featured && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Star className="w-3 h-3 mr-1" />
                            Öne Çıkan
                          </Badge>
                        )}
                        <Badge className={testimonial.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {testimonial.approved ? 'Onaylandı' : 'Beklemede'}
                        </Badge>
                        <div className="flex">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">{testimonial.content}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2">
                        {!testimonial.approved && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Onayla
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          {testimonial.featured ? 'Öne Çıkarmayı Kaldır' : 'Öne Çıkar'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Media Content */}
        <TabsContent value="media" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Medya Kütüphanesi</CardTitle>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Upload className="w-4 h-4 mr-2" />
                  Dosya Yükle
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mediaFiles.map((file) => (
                  <div key={file.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Image className="w-8 h-8 text-blue-600" />
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">{file.name}</h4>
                          <p className="text-xs text-gray-600">{file.size}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button variant="outline" size="sm">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-1 text-xs text-gray-600">
                      <p>Boyut: {file.dimensions}</p>
                      <p>Tarih: {file.uploadDate}</p>
                      <p>Kullanım: {file.usage}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Content */}
        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO Ayarları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Global SEO */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Genel SEO</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Site Başlığı</label>
                    <Input defaultValue="Emel Yeşildere - Duygu Temizliği & Holistik Koçluk" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Site Açıklaması</label>
                    <Textarea 
                      defaultValue="Uzman duygu temizliği ve holistik koçluk hizmetleri. İç huzurunuzu bulun, yaşamınızı dönüştürün."
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Anahtar Kelimeler</label>
                    <Input defaultValue="duygu temizliği, holistik koçluk, travma iyileştirme, yaşam koçluğu, kişisel gelişim" />
                  </div>
                </div>
              </div>

              {/* Page-specific SEO */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Sayfa Bazlı SEO</h3>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Ana Sayfa</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input placeholder="Meta Başlık" />
                      <Input placeholder="Meta Açıklama" />
                    </div>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Hakkımda</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input placeholder="Meta Başlık" />
                      <Input placeholder="Meta Açıklama" />
                    </div>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Hizmetler</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input placeholder="Meta Başlık" />
                      <Input placeholder="Meta Açıklama" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ContentManagement
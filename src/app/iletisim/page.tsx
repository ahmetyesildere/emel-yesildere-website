'use client'

import React, { useState } from 'react'
import { Metadata } from 'next'
import { Phone, Mail, MapPin, MessageCircle, Send, User, MessageSquare } from 'lucide-react'
import { useContactInfo } from '@/hooks/use-contact-info'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const { contactInfo, formatPhoneNumber } = useContactInfo()



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Yeni mesaj objesi oluştur
      const newMessage = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        status: 'new' as const,
        priority: 'medium' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // Mevcut mesajları al
      const existingMessages = JSON.parse(localStorage.getItem('contact_messages') || '[]')
      
      // Yeni mesajı başa ekle
      existingMessages.unshift(newMessage)
      
      // localStorage'a kaydet
      localStorage.setItem('contact_messages', JSON.stringify(existingMessages))
      
      console.log('Form gönderildi:', newMessage)
      alert('Mesajınız gönderildi! En kısa sürede size dönüş yapacağız.')
      
      // Formu temizle
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (error) {
      console.error('Mesaj gönderilirken hata:', error)
      alert('Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.')
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            İletişim
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
              Bize Ulaşın
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sorularınız, randevu talepleriniz veya herhangi bir konuda bizimle iletişime geçebilirsiniz.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Left Column - Contact Form and Map */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <MessageSquare className="w-6 h-6 mr-3 text-purple-600" />
                  İletişim Formu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ad Soyad *
                      </label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Adınız ve soyadınız"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        E-posta *
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="ornek@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefon
                      </label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+90 555 123 4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Konu *
                      </label>
                      <Input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        placeholder="Mesajınızın konusu"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mesaj *
                    </label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Mesajınızı buraya yazın..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Mesaj Gönder
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Google Maps Section - Same width as form */}
            <Card className="shadow-lg overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <MapPin className="w-5 h-5 mr-2 text-red-600" />
                  Konum
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative">
                  {/* Google Maps Embed */}
                  <div className="w-full h-64 bg-gray-100 rounded-b-lg overflow-hidden relative">
                    <iframe
                      key={contactInfo.mapUrl} // Sadece URL değiştiğinde yeniden render et
                      src={contactInfo.mapUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Ofis Konumu"
                      className="w-full h-full"
                    />
                    
                    {/* Overlay Buttons */}
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactInfo.address)}`, '_blank')}
                        className="bg-white/90 hover:bg-white text-gray-800 shadow-lg backdrop-blur-sm"
                      >
                        <MapPin className="w-4 h-4 mr-1" />
                        Büyüt
                      </Button>
                    </div>
                  </div>
                  

                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {/* İletişim Bilgileri */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">İletişim Bilgileri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900">Telefon</div>
                    <div className="text-gray-600">{formatPhoneNumber(contactInfo.phone)}</div>
                    <div className="text-sm text-gray-500">Pzt-Cum: {contactInfo.workingHours.weekdays}</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900">E-posta</div>
                    <div className="text-gray-600">{contactInfo.email}</div>
                    <div className="text-sm text-gray-500">24 saat içinde yanıt</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MessageCircle className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900">WhatsApp</div>
                    <div className="text-gray-600">{formatPhoneNumber(contactInfo.whatsapp)}</div>
                    <div className="text-sm text-gray-500">24/7 Aktif</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-red-600 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900">Adres</div>
                    <div className="text-gray-600">{contactInfo.address}</div>
                    <div className="text-sm text-gray-500">Yüz yüze seanslar</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hızlı İletişim */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Hızlı İletişim</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => window.open(`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`, '_blank')}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp ile Yaz
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => window.location.href = `tel:${contactInfo.phone}`}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Hemen Ara
                </Button>

                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => window.location.href = `mailto:${contactInfo.email}`}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  E-posta Gönder
                </Button>
              </CardContent>
            </Card>

            {/* Çalışma Saatleri */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Çalışma Saatleri</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Pazartesi - Cuma</span>
                    <span className="font-medium">{contactInfo.workingHours.weekdays}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cumartesi</span>
                    <span className="font-medium">{contactInfo.workingHours.saturday}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pazar</span>
                    <span className={contactInfo.workingHours.sunday === 'Kapalı' ? 'text-gray-500' : 'font-medium'}>
                      {contactInfo.workingHours.sunday}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-sm text-green-800">
                    <strong>WhatsApp:</strong> 24/7 aktif - Acil durumlar için her zaman ulaşabilirsiniz
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>


      </div>
    </div>
  )
}
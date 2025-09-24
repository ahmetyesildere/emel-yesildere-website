'use client'

import React from 'react'
import { Phone, Mail, MapPin, Clock, MessageCircle, Calendar, Globe, Shield, Users, Star, CheckCircle, Heart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const ContactInfo = () => {
  const contactDetails = [
    {
      icon: Phone,
      title: 'Telefon',
      items: [
        { label: 'Ana Hat', value: '+90 555 123 4567', available: 'Pzt-Cum: 09:00-18:00' },
        { label: 'Acil Hat', value: '+90 555 123 4568', available: '24/7 Aktif' }
      ],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Mail,
      title: 'E-posta',
      items: [
        { label: 'Genel', value: 'emel@emelyesildere.com', available: '24 saat içinde yanıt' },
        { label: 'Randevu', value: 'randevu@emelyesildere.com', available: '2 saat içinde yanıt' }
      ],
      color: 'from-purple-500 to-indigo-500'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      items: [
        { label: 'Destek', value: '+90 555 123 4567', available: '24/7 Aktif' },
        { label: 'Acil', value: '+90 555 123 4568', available: 'Anında yanıt' }
      ],
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: MapPin,
      title: 'Adres',
      items: [
        { label: 'Ofis', value: 'İstanbul, Türkiye', available: 'Yüz yüze seanslar' },
        { label: 'Online', value: 'Tüm Türkiye', available: 'Video konferans' }
      ],
      color: 'from-red-500 to-pink-500'
    }
  ]

  const workingHours = [
    { day: 'Pazartesi', hours: '09:00 - 18:00', available: true },
    { day: 'Salı', hours: '09:00 - 18:00', available: true },
    { day: 'Çarşamba', hours: '09:00 - 18:00', available: true },
    { day: 'Perşembe', hours: '09:00 - 18:00', available: true },
    { day: 'Cuma', hours: '09:00 - 18:00', available: true },
    { day: 'Cumartesi', hours: '10:00 - 16:00', available: true },
    { day: 'Pazar', hours: 'Kapalı', available: false }
  ]

  const socialMedia = [
    {
      platform: 'Instagram',
      handle: '@emelyesildere',
      url: 'https://instagram.com/emelyesildere',
      icon: '📷',
      followers: '2.5K'
    },
    {
      platform: 'Facebook',
      handle: 'Emel Yeşildere',
      url: 'https://facebook.com/emelyesildere',
      icon: '👥',
      followers: '1.8K'
    },
    {
      platform: 'LinkedIn',
      handle: 'Emel Yeşildere',
      url: 'https://linkedin.com/in/emelyesildere',
      icon: '💼',
      followers: '950'
    }
  ]

  const serviceAreas = [
    {
      area: 'İstanbul',
      type: 'Yüz Yüze + Online',
      description: 'Merkezi lokasyonda ofis hizmeti',
      icon: '🏢'
    },
    {
      area: 'Türkiye Geneli',
      type: 'Online',
      description: 'Video konferans ile seans',
      icon: '💻'
    },
    {
      area: 'Yurtdışı',
      type: 'Online',
      description: 'Türkçe konuşan müşteriler için',
      icon: '🌍'
    }
  ]

  const responseTime = [
    { method: 'WhatsApp', time: 'Anında', icon: MessageCircle, color: 'text-green-600' },
    { method: 'E-posta', time: '2-4 saat', icon: Mail, color: 'text-blue-600' },
    { method: 'Telefon', time: 'Çalışma saatleri', icon: Phone, color: 'text-purple-600' },
    { method: 'Acil Durum', time: '30 dakika', icon: Heart, color: 'text-red-600' }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            İletişim Bilgileri
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
              Size Ulaşmanın Yolları
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Size en uygun iletişim yöntemini seçin. Her kanaldan hızlı ve 
            profesyonel destek alabilirsiniz.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {contactDetails.map((contact, index) => {
            const IconComponent = contact.icon
            return (
              <Card key={index} className="p-6 bg-white hover:shadow-lg transition-shadow border border-gray-200">
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${contact.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{contact.title}</h3>
                </div>

                <div className="space-y-4">
                  {contact.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="text-center">
                      <div className="font-medium text-gray-900 mb-1">{item.label}</div>
                      <div className="text-lg font-semibold text-purple-600 mb-1">{item.value}</div>
                      <div className="text-sm text-gray-500">{item.available}</div>
                    </div>
                  ))}
                </div>
              </Card>
            )
          })}
        </div>

        {/* Working Hours & Response Time */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Working Hours */}
          <Card className="p-8 bg-white shadow-lg border border-gray-200">
            <div className="flex items-center mb-6">
              <Clock className="w-8 h-8 text-blue-600 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">Çalışma Saatleri</h3>
            </div>
            
            <div className="space-y-3">
              {workingHours.map((schedule, index) => (
                <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${schedule.available ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                  <span className="font-medium text-gray-900">{schedule.day}</span>
                  <span className={`font-semibold ${schedule.available ? 'text-green-700' : 'text-gray-500'}`}>
                    {schedule.hours}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-800">WhatsApp Desteği</span>
              </div>
              <p className="text-blue-700 text-sm">24/7 aktif - Acil durumlar için her zaman ulaşabilirsiniz</p>
            </div>
          </Card>

          {/* Response Time */}
          <Card className="p-8 bg-white shadow-lg border border-gray-200">
            <div className="flex items-center mb-6">
              <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">Yanıt Süreleri</h3>
            </div>
            
            <div className="space-y-4">
              {responseTime.map((response, index) => {
                const IconComponent = response.icon
                return (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <IconComponent className={`w-5 h-5 ${response.color}`} />
                      <span className="font-medium text-gray-900">{response.method}</span>
                    </div>
                    <span className={`font-semibold ${response.color}`}>{response.time}</span>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-800">Garanti</span>
              </div>
              <p className="text-green-700 text-sm">Acil durumlar 30 dakika içinde, diğer tüm mesajlar 24 saat içinde yanıtlanır</p>
            </div>
          </Card>
        </div>

        {/* Service Areas */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Hizmet Alanlarımız</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {serviceAreas.map((area, index) => (
              <Card key={index} className="p-6 bg-white hover:shadow-lg transition-shadow border border-gray-200 text-center">
                <div className="text-4xl mb-4">{area.icon}</div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{area.area}</h4>
                <Badge className="mb-3 bg-blue-100 text-blue-800">{area.type}</Badge>
                <p className="text-gray-600 text-sm">{area.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Social Media */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Sosyal Medya</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {socialMedia.map((social, index) => (
              <Card key={index} className="p-6 bg-white hover:shadow-lg transition-shadow border border-gray-200 text-center">
                <div className="text-4xl mb-4">{social.icon}</div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{social.platform}</h4>
                <p className="text-purple-600 font-medium mb-2">{social.handle}</p>
                <p className="text-sm text-gray-600 mb-4">{social.followers} takipçi</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  Takip Et
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Privacy & Security */}
        <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 text-center">
          <Shield className="w-16 h-16 text-purple-600 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Gizlilik ve Güvenlik</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="space-y-2">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto" />
              <h4 className="font-semibold text-gray-900">%100 Gizli</h4>
              <p className="text-sm text-gray-600">Tüm görüşmeler tamamen gizlidir</p>
            </div>
            
            <div className="space-y-2">
              <Shield className="w-8 h-8 text-blue-600 mx-auto" />
              <h4 className="font-semibold text-gray-900">Güvenli İletişim</h4>
              <p className="text-sm text-gray-600">SSL şifreli güvenli bağlantı</p>
            </div>
            
            <div className="space-y-2">
              <Users className="w-8 h-8 text-purple-600 mx-auto" />
              <h4 className="font-semibold text-gray-900">Profesyonel Etik</h4>
              <p className="text-sm text-gray-600">Etik kurallara tam uyum</p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}

export default ContactInfo
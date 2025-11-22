'use client'

import React from 'react'
import { Phone, Mail, MapPin, Clock, MessageCircle, Calendar, Heart, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useContactInfo } from '@/hooks/use-contact-info'

const ContactHero = () => {
  const { contactInfo } = useContactInfo()
  
  const contactMethods = [
    {
      icon: Phone,
      title: 'Telefon',
      primary: contactInfo.phone,
      secondary: `Pazartesi - Cuma: ${contactInfo.workingHours.weekdays}`,
      color: 'from-blue-500 to-cyan-500',
      action: 'Ara'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      primary: contactInfo.whatsapp,
      secondary: '24/7 Aktif Destek',
      color: 'from-green-500 to-emerald-500',
      action: 'Mesaj Gönder'
    },
    {
      icon: Mail,
      title: 'E-posta',
      primary: contactInfo.email,
      secondary: '24 saat içinde yanıt',
      color: 'from-purple-500 to-indigo-500',
      action: 'E-posta Gönder'
    },
    {
      icon: Calendar,
      title: 'Online Randevu',
      primary: 'Anında Rezervasyon',
      secondary: 'Esnek saatler mevcut',
      color: 'from-pink-500 to-red-500',
      action: 'Randevu Al'
    }
  ]

  const quickStats = [
    { number: '24/7', label: 'Destek Hattı' },
    { number: '< 2 saat', label: 'Yanıt Süresi' },
    { number: '100+', label: 'Mutlu Müşteri' },
    { number: '4.9/5', label: 'Memnuniyet' }
  ]

  return (
    <section className="relative py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                İletişim
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
                  Bizimle
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  İletişime Geçin
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                Sorularınız, randevu talepleriniz veya hizmetlerimiz hakkında 
                bilgi almak için bizimle iletişime geçebilirsiniz. 
                Size en uygun iletişim yöntemini seçin.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickStats.map((stat, index) => (
                <div key={index} className="text-center p-4 bg-white/80 rounded-lg border border-purple-200">
                  <div className="text-2xl font-bold text-purple-600">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Location Info */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border border-purple-200">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ofis Lokasyonu</h3>
                  <p className="text-gray-600 mb-2">Bandırma, Balıkesir</p>
                  <p className="text-sm text-gray-500">
                    Yüz yüze seanslar için merkezi lokasyonda hizmet veriyoruz. 
                    Detaylı adres randevu alırken paylaşılacaktır.
                  </p>
                </div>
              </div>
            </Card>

            {/* Working Hours */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border border-blue-200">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Çalışma Saatleri</h3>
                  <div className="space-y-1 text-gray-600">
                    <p>Pazartesi - Cuma: 09:00 - 18:00</p>
                    <p>Cumartesi: 10:00 - 16:00</p>
                    <p>Pazar: Kapalı</p>
                  </div>
                  <p className="text-sm text-green-600 mt-2">
                    ✅ WhatsApp desteği 24/7 aktif
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Content - Contact Methods */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon
              return (
                <Card key={index} className="p-6 bg-white/80 backdrop-blur-sm border-2 border-white/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <CardContent className="p-0 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{method.title}</h3>
                    <p className="text-lg font-medium text-gray-800 mb-1">{method.primary}</p>
                    <p className="text-sm text-gray-600 mb-4">{method.secondary}</p>
                    
                    <Button 
                      className={`w-full bg-gradient-to-r ${method.color} hover:opacity-90 text-white`}
                    >
                      {method.action}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Bottom Section - Emergency Contact */}
        <div className="mt-20">
          <Card className="p-8 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Acil Durum Desteği</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Kriz anlarında veya acil durumlarda size destek olmak için buradayız. 
                WhatsApp hattımız 24/7 aktiftir ve acil durumlar için özel randevu imkanı sunuyoruz.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-4"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Acil WhatsApp Desteği
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-red-300 text-red-700 hover:bg-red-50 px-8 py-4"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Acil Arama Hattı
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center space-x-8 mb-6">
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-gray-600">4.9/5 (200+ değerlendirme)</span>
            </div>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="text-gray-600">100+ Mutlu Müşteri</span>
            </div>
          </div>
          <p className="text-gray-600">
            Güvenilir hizmet, hızlı yanıt ve profesyonel destek için bize ulaşın.
          </p>
        </div>
      </div>
    </section>
  )
}

export default ContactHero
'use client'

import React from 'react'
import { Heart, MessageCircle, Calendar, ArrowRight, Star, Users, CheckCircle, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const AboutCTA = () => {
  const reasons = [
    {
      icon: Heart,
      title: '8+ Yıl Deneyim',
      description: 'Duygu temizliği alanında kanıtlanmış uzmanlık'
    },
    {
      icon: Users,
      title: '500+ Mutlu Müşteri',
      description: 'Başarılı dönüşüm hikayeleri'
    },
    {
      icon: Star,
      title: '4.9/5 Puan',
      description: '200+ değerlendirme ortalaması'
    },
    {
      icon: CheckCircle,
      title: '%95 Başarı Oranı',
      description: 'Müşteri memnuniyeti ve iyileşme oranı'
    }
  ]

  const contactOptions = [
    {
      icon: MessageCircle,
      title: 'Ücretsiz Ön Görüşme',
      description: '15 dakikalık ücretsiz değerlendirme',
      action: 'Hemen Başla',
      primary: true
    },
    {
      icon: Calendar,
      title: 'Randevu Al',
      description: 'Doğrudan seans randevusu',
      action: 'Randevu Al',
      primary: false
    },
    {
      icon: Phone,
      title: 'Telefon Görüşmesi',
      description: 'Detaylı bilgi için arayın',
      action: 'Ara',
      primary: false
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main CTA */}
        <div className="text-center text-white mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Dönüşüm Yolculuğunuza
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Başlamaya Hazır mısınız?
            </span>
          </h2>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
            8 yıllık deneyimimle, sizin de yaşamınızda pozitif değişiklikler 
            yaratmanıza yardımcı olmak istiyorum.
          </p>
        </div>

        {/* Reasons to Choose */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {reasons.map((reason, index) => {
            const IconComponent = reason.icon
            return (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
                <CardContent className="p-6 text-center text-white">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{reason.title}</h3>
                  <p className="text-sm opacity-90">{reason.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {contactOptions.map((option, index) => {
            const IconComponent = option.icon
            return (
              <Card key={index} className={`${option.primary ? 'bg-white' : 'bg-white/10 backdrop-blur-sm border border-white/20'} hover:shadow-xl transition-all duration-300 hover:-translate-y-2`}>
                <CardContent className={`p-8 text-center ${option.primary ? 'text-gray-900' : 'text-white'}`}>
                  <div className={`w-16 h-16 ${option.primary ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-white/20'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className={`w-8 h-8 ${option.primary ? 'text-white' : 'text-white'}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{option.title}</h3>
                  <p className={`mb-6 ${option.primary ? 'text-gray-600' : 'text-white/80'}`}>{option.description}</p>
                  <Button 
                    size="lg" 
                    className={option.primary 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white w-full' 
                      : 'bg-white/20 hover:bg-white/30 text-white border border-white/30 w-full'
                    }
                  >
                    {option.action}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Testimonial */}
        <Card className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 text-center text-white max-w-4xl mx-auto mb-12">
          <div className="text-6xl mb-4 opacity-50">"</div>
          <blockquote className="text-xl md:text-2xl leading-relaxed mb-6 italic">
            Emel hanımla çalışmak hayatımın dönüm noktası oldu. 
            Yıllardır taşıdığım ağırlıkları bırakıp, kendimi yeniden keşfettim. 
            Herkese tavsiye ederim.
          </blockquote>
          <div className="flex items-center justify-center space-x-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <div className="text-lg opacity-90">— Ayşe K., Öğretmen</div>
        </Card>

        {/* Final CTA */}
        <div className="text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
            İlk Adımı Atmak İçin Geç Kalmayın
          </h3>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Ücretsiz ön görüşme ile tanışalım ve size nasıl yardımcı olabileceğimi keşfedelim.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              <Heart className="w-5 h-5 mr-2" />
              Ücretsiz Ön Görüşme Al
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              WhatsApp ile Yaz
            </Button>
          </div>

          {/* Contact Info */}
          <div className="mt-12 text-white/80">
            <p className="mb-2">📞 +90 555 123 4567</p>
            <p className="mb-2">✉️ emel@emelyesildere.com</p>
            <p>🕒 Pazartesi - Cuma: 09:00 - 18:00</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutCTA
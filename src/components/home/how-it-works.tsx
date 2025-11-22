'use client'

import React from 'react'
import { Calendar, MessageCircle, Heart, Sparkles, ArrowRight, CheckCircle, Clock, Shield } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useWhatsApp } from '@/hooks/use-whatsapp'

const HowItWorks = () => {
  const { createWhatsAppLink } = useWhatsApp()
  const steps = [
    {
      id: 1,
      icon: MessageCircle,
      title: 'Ücretsiz Ön Görüşme',
      description: 'İlk adımda, ihtiyaçlarınızı anlayabilmek için 15 dakikalık ücretsiz bir ön görüşme yapıyoruz.',
      details: [
        'Mevcut durumunuzu değerlendiriyoruz',
        'Hedeflerinizi belirliyoruz',
        'Size en uygun hizmeti öneriyoruz'
      ],
      duration: '15 dakika',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50'
    },
    {
      id: 2,
      icon: Calendar,
      title: 'Randevu Planlama',
      description: 'Size uygun tarih ve saatte, online veya yüz yüze seans randevunuzu planlıyoruz.',
      details: [
        'Esnek randevu saatleri',
        'Online veya yüz yüze seçeneği',
        'Hatırlatma mesajları'
      ],
      duration: '5 dakika',
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-50'
    },
    {
      id: 3,
      icon: Heart,
      title: 'Duygu Temizliği Seansı',
      description: 'Güvenli bir ortamda, bilinçaltınızdaki olumsuz duyguları tespit ederek temizleme sürecini başlatıyoruz.',
      details: [
        'Kişiye özel yaklaşım',
        'Güvenli ve destekleyici ortam',
        'Travma temizliği teknikleri'
      ],
      duration: '60 dakika',
      color: 'from-pink-500 to-red-500',
      bgColor: 'bg-pink-50'
    },

  ]

  const benefits = [
    {
      icon: Shield,
      title: 'Güvenli Süreç',
      description: 'Tüm seanslar gizlilik ilkesi çerçevesinde yapılır'
    },
    {
      icon: Clock,
      title: 'Esnek Saatler',
      description: 'Size uygun saatlerde randevu alabilirsiniz'
    },
    {
      icon: CheckCircle,
      title: 'Kanıtlanmış Yöntem',
      description: '100+ başarılı seans deneyimi'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            Süreç
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
              Nasıl Çalışır?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Duygu temizliği yolculuğunuz 3 basit adımda başlıyor. 
            Her adımda size rehberlik ediyor ve destekliyoruz.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mb-20">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
            <div className="relative h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 rounded-full">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-30 animate-pulse"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => {
              const IconComponent = step.icon
              return (
                <div key={step.id} className="relative">
                  <Card className={`${step.bgColor} border-2 border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden`}>
                    {/* Step Number */}
                    <div className="absolute top-4 right-4">
                      <div className={`w-8 h-8 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                        {step.id}
                      </div>
                    </div>

                    <CardContent className="p-6">
                      {/* Icon */}
                      <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                      <p className="text-gray-700 mb-4 leading-relaxed">{step.description}</p>

                      {/* Duration */}
                      <div className="flex items-center space-x-2 mb-4">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600 font-medium">{step.duration}</span>
                      </div>

                      {/* Details */}
                      <div className="space-y-2">
                        {step.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>

                    {/* Arrow for desktop */}
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                        <div className="w-8 h-8 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center shadow-md">
                          <ArrowRight className="w-4 h-4 text-gray-600" />
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              )
            })}
          </div>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon
            return (
              <Card key={index} className="p-6 text-center bg-white hover:shadow-lg transition-shadow border border-gray-200">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </Card>
            )
          })}
        </div>

        {/* FAQ Preview */}
        <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Sık Sorulan Sorular</h3>
            <p className="text-gray-600">Merak ettiklerinizin yanıtları</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Duygu temizliği güvenli mi?</h4>
                <p className="text-gray-600 text-sm">Evet, tamamen doğal ve güvenli bir süreçtir. Hiçbir yan etkisi yoktur.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Kaç seans gerekir?</h4>
                <p className="text-gray-600 text-sm">Kişiye göre değişir, genellikle 3-5 seans yeterli olmaktadır.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Online seanslar etkili mi?</h4>
                <p className="text-gray-600 text-sm">Evet, online seanslar yüz yüze seanslar kadar etkilidir.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Yaş sınırı var mı?</h4>
                <p className="text-gray-600 text-sm">18 yaş üstü herkese hizmet veriyoruz.</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button 
              variant="outline" 
              className="border-purple-300 text-purple-700 hover:bg-purple-50"
              onClick={() => {
                window.location.href = '/sss'
              }}
            >
              Tüm SSS'leri Gör
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>

        {/* CTA */}
        <div className="text-center mt-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            İlk Adımı Atmaya Hazır mısınız?
          </h3>
          <p className="text-xl text-gray-600 mb-8">
            Ücretsiz ön görüşme ile başlayalım
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold"
            onClick={() => {
              const link = createWhatsAppLink('consultation')
              if (link !== '#') {
                window.open(link, '_blank')
              }
            }}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Ücretsiz Ön Görüşme Al
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
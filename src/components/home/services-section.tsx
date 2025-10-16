'use client'

import React from 'react'
import { Heart, Brain, Compass, Sparkles, ArrowRight, Clock, Users, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useWhatsApp } from '@/hooks/use-whatsapp'

const ServicesSection = () => {
  const { createWhatsAppLink } = useWhatsApp()
  
  const services = [
    {
      id: 1,
      icon: Compass,
      title: 'Yaşam Koçluğu',
      description: 'Kişisel hedeflerinize ulaşmanız için size rehberlik ediyor, yaşam kalitenizi artırıyoruz.',
      features: ['Hedef belirleme', 'Motivasyon artırma', 'Yaşam dengesi'],
      duration: '60 dakika',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      popular: false
    },
    {
      id: 2,
      icon: Sparkles,
      title: 'Holistik Koçluk',
      description: 'Beden, zihin ve ruh bütünlüğü içinde kişisel dönüşümünüzü destekliyoruz.',
      features: ['Enerji dengeleme', 'Chakra uyumlaması', 'Ruhsal gelişim'],
      duration: '60 dakika',
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      popular: false
    },
    {
      id: 3,
      icon: Brain,
      title: 'Nefes Koçluğu',
      description: 'Nefes teknikleri ile stres yönetimi, rahatlama ve iç huzuru bulmanızı sağlıyoruz.',
      features: ['Stres azaltma', 'Nefes teknikleri', 'Meditasyon rehberliği'],
      duration: '60 dakika',
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      popular: false
    },
    {
      id: 4,
      icon: Heart,
      title: 'Bilinçaltı Temizliği',
      description: 'Bilinçaltınızda biriken olumsuz duygu ve inançları tespit ederek temizliyoruz.',
      features: ['Travma temizliği', 'Olumsuz inanç değişimi', 'Duygusal blokaj açma'],
      duration: '60 dakika',
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      popular: true
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            Hizmetlerimiz
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
              Size Özel Çözümler
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Yaşam koçluğu, holistik koçluk, nefes koçluğu ve bilinçaltı temizliği 
            hizmetleriyle kişisel dönüşümünüzü destekliyoruz.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {services.map((service) => {
            const IconComponent = service.icon
            return (
              <Card 
                key={service.id} 
                className="relative overflow-hidden hover:shadow-lg transition-all duration-300 bg-white border border-gray-200"
              >
                {service.popular && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                      En Popüler
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className={`w-12 h-12 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                      <div className="flex items-center mt-1">
                        <span className="text-sm text-gray-600">{service.duration}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-2 mb-4">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className={`w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
                    onClick={() => {
                      const link = createWhatsAppLink('consultation', undefined, service.title)
                      if (link !== '#') {
                        window.open(link, '_blank')
                      }
                    }}
                  >
                    <svg 
                      className="w-5 h-5 mr-2" 
                      viewBox="0 0 24 24" 
                      fill="currentColor"
                    >
                      <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                    </svg>
                    Ücretsiz Ön Görüşme
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="p-6 text-center bg-white/80 backdrop-blur-sm border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Online & Yüz Yüze</h3>
            <p className="text-gray-600">
              Tüm seanslarımız hem online hem de yüz yüze yapılabilir. Size en uygun seçeneği belirleyin.
            </p>
          </Card>

          <Card className="p-6 text-center bg-white/80 backdrop-blur-sm border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Güvenli Ortam</h3>
            <p className="text-gray-600">
              Tüm seanslarımız gizlilik ilkesi çerçevesinde, güvenli ve destekleyici bir ortamda gerçekleşir.
            </p>
          </Card>

          <Card className="p-6 text-center bg-white/80 backdrop-blur-sm border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Kişiye Özel</h3>
            <p className="text-gray-600">
              Her seans, kişinin ihtiyaçlarına göre özelleştirilir ve bireysel yaklaşım uygulanır.
            </p>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">
            Dönüşüm Yolculuğunuza Başlamaya Hazır mısınız?
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Ücretsiz ön görüşme ile size en uygun hizmeti belirleyelim
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-pulse hover:animate-none relative overflow-hidden group"
              onClick={() => {
                const link = createWhatsAppLink('consultation')
                if (link !== '#') {
                  window.open(link, '_blank')
                }
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <Heart className="w-5 h-5 mr-2 animate-bounce" />
              <span className="relative z-10">Ücretsiz Ön Görüşme</span>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg font-semibold bg-transparent"
              onClick={() => {
                window.location.href = '/hizmetlerimiz'
              }}
            >
              <Users className="w-5 h-5 mr-2" />
              Tüm Hizmetleri Gör
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ServicesSection
'use client'

import React from 'react'
import { Heart, Brain, Compass, Sparkles, ArrowRight, CheckCircle, Star, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const ServicesHero = () => {
  const scrollToDetails = (serviceId: string) => {
    // URL'e hash ekle
    window.location.hash = `#${serviceId}`
    
    // Detaylar bölümüne scroll yap
    const detailsSection = document.getElementById('hizmet-detaylari')
    if (detailsSection) {
      detailsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }
  const services = [
    {
      id: 'yasam-koclugu',
      icon: Compass,
      title: 'Yaşam Koçluğu',
      description: 'Kişisel hedeflere ulaşma',
      color: 'from-blue-500 to-cyan-500',
      popular: false
    },
    {
      id: 'holistik-kocluk',
      icon: Sparkles,
      title: 'Holistik Koçluk',
      description: 'Bütüncül dönüşüm',
      color: 'from-emerald-500 to-teal-500',
      popular: false
    },
    {
      id: 'nefes-koclugu',
      icon: Brain,
      title: 'Nefes Koçluğu',
      description: 'Nefes teknikleri ve rahatlama',
      color: 'from-purple-500 to-indigo-500',
      popular: false
    },
    {
      id: 'bilincalti-temizligi',
      icon: Heart,
      title: 'Bilinçaltı Temizliği',
      description: 'Bilinçaltı travma temizliği',
      color: 'from-red-500 to-pink-500',
      popular: true
    }
  ]

  const features = [
    'Online ve yüz yüze seanslar',
    'Kişiye özel yaklaşım',
    'Güvenli ve destekleyici ortam',
    '3+ yıl deneyim',
    '100+ başarılı seans',
    '24/7 destek hattı'
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
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                Profesyonel Hizmetler
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
                  Size Özel
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Dönüşüm Hizmetleri
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                Yaşam koçluğu, holistik koçluk, nefes koçluğu ve bilinçaltı temizliği 
                hizmetleriyle yaşamınızda kalıcı pozitif değişiklikler yaratın. Her hizmet, 
                kişisel ihtiyaçlarınıza göre özelleştirilir.
              </p>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center p-4 bg-white/80 rounded-lg border border-purple-200">
                <div className="text-2xl font-bold text-purple-600">100+</div>
                <div className="text-sm text-gray-600">Mutlu Danışan</div>
              </div>
              <div className="text-center p-4 bg-white/80 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">95%</div>
                <div className="text-sm text-gray-600">Başarı Oranı</div>
              </div>
              <div className="text-center p-4 bg-white/80 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-600">4.9</div>
                <div className="text-sm text-gray-600">Danışan Puanı</div>
              </div>
            </div>


          </div>

          {/* Right Content - Services Grid */}
          <div className="grid grid-cols-2 gap-6">
            {services.map((service, index) => {
              const IconComponent = service.icon
              return (
                <Card key={index} className={`relative p-6 bg-white/80 backdrop-blur-sm border-2 border-white/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${service.popular ? 'ring-2 ring-purple-400' : ''}`}>
                  {service.popular && (
                    <div className="absolute -top-3 -right-3">
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                        Popüler
                      </Badge>
                    </div>
                  )}
                  
                  <CardContent className="p-0 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => scrollToDetails(service.id)}
                      className="mt-4 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                    >
                      Detaylar
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Bottom Section - Trust Indicators */}
        <div className="mt-20 text-center">
          <div className="flex items-center justify-center space-x-8 mb-8">
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-gray-600">4.9/5 (50+ değerlendirme)</span>
            </div>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-gray-600">Güvenilir Hizmet</span>
            </div>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-gray-600">100+ Mutlu Danışan</span>
            </div>
          </div>

          <Card className="max-w-4xl mx-auto p-6 bg-gradient-to-r from-white/80 to-purple-50/80 backdrop-blur-sm border-2 border-white/50">
            <p className="text-lg text-gray-700 leading-relaxed">
              <strong>Her hizmetimiz</strong>, kişisel ihtiyaçlarınıza göre özelleştirilir ve 
              <strong> 3+ yıllık deneyimimle</strong> desteklenir. Amacımız, sadece semptomları değil, 
              sorunların kök nedenlerini ele alarak <strong>kalıcı çözümler</strong> sunmaktır.
            </p>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default ServicesHero
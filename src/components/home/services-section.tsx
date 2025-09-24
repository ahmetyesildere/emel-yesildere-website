'use client'

import React from 'react'
import { Heart, Brain, Compass, Sparkles, ArrowRight, Clock, Users, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const ServicesSection = () => {
  const services = [
    {
      id: 1,
      icon: Heart,
      title: 'Duygu Temizliği',
      description: 'Bilinçaltınızda biriken olumsuz duyguları tespit ederek temizliyoruz. Bu süreç tamamen doğal ve güvenlidir.',
      features: ['Travma temizliği', 'Olumsuz inanç değişimi', 'Duygusal blokaj açma'],
      duration: '90 dakika',
      price: '500₺',
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      popular: true
    },
    {
      id: 2,
      icon: Brain,
      title: 'Travma İyileştirme',
      description: 'Geçmiş travmalarınızı güvenli bir ortamda işleyerek iyileştirme sürecini başlatıyoruz.',
      features: ['Çocukluk travmaları', 'İlişki travmaları', 'Kayıp ve yas süreci'],
      duration: '120 dakika',
      price: '750₺',
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      popular: false
    },
    {
      id: 3,
      icon: Compass,
      title: 'Yaşam Koçluğu',
      description: 'Kişisel hedeflerinize ulaşmanız için size rehberlik ediyor, yaşam kalitenizi artırıyoruz.',
      features: ['Hedef belirleme', 'Motivasyon artırma', 'Yaşam dengesi'],
      duration: '60 dakika',
      price: '400₺',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      popular: false
    },
    {
      id: 4,
      icon: Sparkles,
      title: 'Holistik Koçluk',
      description: 'Beden, zihin ve ruh bütünlüğü içinde kişisel dönüşümünüzü destekliyoruz.',
      features: ['Enerji dengeleme', 'Chakra uyumlaması', 'Ruhsal gelişim'],
      duration: '90 dakika',
      price: '600₺',
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      popular: false
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
            Her bireyin ihtiyacına özel olarak tasarlanmış holistik yaklaşımla 
            duygu temizliği ve kişisel dönüşüm hizmetleri sunuyoruz.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {services.map((service) => {
            const IconComponent = service.icon
            return (
              <Card 
                key={service.id} 
                className={`relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${service.bgColor} ${service.borderColor} border-2`}
              >
                {service.popular && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                      En Popüler
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{service.title}</h3>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{service.duration}</span>
                        </div>
                        <div className="text-2xl font-bold text-purple-600">{service.price}</div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed">
                    {service.description}
                  </p>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3 mb-6">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      className={`flex-1 bg-gradient-to-r ${service.color} hover:opacity-90 text-white`}
                    >
                      Randevu Al
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Detayları Gör
                    </Button>
                  </div>
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
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              <Heart className="w-5 h-5 mr-2" />
              Ücretsiz Ön Görüşme
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold"
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
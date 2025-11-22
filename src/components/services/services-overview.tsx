'use client'

import React from 'react'
import { Heart, Brain, Compass, Sparkles, Clock, Users, CheckCircle, ArrowRight, Star, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const ServicesOverview = () => {
  const services = [
    {
      id: 'yasam-koclugu',
      icon: Compass,
      title: 'Yaşam Koçluğu',
      subtitle: 'Kişisel Hedeflere Ulaşma',
      description: 'Yaşam hedeflerinizi netleştirmeniz, motivasyonunuzu artırmanız ve yaşam kalitenizi yükseltmeniz için rehberlik ediyoruz.',
      benefits: [
        'Net hedef belirleme',
        'Motivasyon artırma',
        'Yaşam-iş dengesi kurma',
        'Kişisel potansiyeli keşfetme'
      ],
      techniques: ['Goal Setting', 'Mindfulness Coaching', 'Cognitive Restructuring'],
      duration: '60 dakika',
      price: '400₺',
      successRate: '90%',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      popular: false,
      idealFor: ['Hedef belirlemek isteyenler', 'Motivasyon arayanlar', 'Kariyer değişimi düşünenler']
    },
    {
      id: 'holistik-kocluk',
      icon: Sparkles,
      title: 'Holistik Koçluk',
      subtitle: 'Bütüncül Dönüşüm',
      description: 'Beden, zihin ve ruh bütünlüğü içinde kişisel dönüşümünüzü destekliyoruz. Enerji dengeleme ve chakra uyumlaması dahil.',
      benefits: [
        'Enerji dengeleme',
        'Chakra uyumlaması',
        'Ruhsal gelişim desteği',
        'Bütüncül iyileşme'
      ],
      techniques: ['Energy Healing', 'Chakra Balancing', 'Meditation Guidance'],
      duration: '60 dakika',
      price: '600₺',
      successRate: '94%',
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      popular: true,
      idealFor: ['Ruhsal gelişim isteyenler', 'Enerji dengesizliği yaşayanlar', 'Bütüncül iyileşme arayanlar']
    },
    {
      id: 'nefes-koclugu',
      icon: Brain,
      title: 'Nefes Koçluğu',
      subtitle: 'Nefes Teknikleri ve Rahatlama',
      description: 'Nefes teknikleri ile stres yönetimi, rahatlama ve iç huzuru bulmanızı sağlıyoruz. Doğru nefes alma yaşam kalitenizi artırır.',
      benefits: [
        'Stres seviyesini azaltma',
        'Nefes tekniklerini öğrenme',
        'Meditasyon rehberliği',
        'İç huzuru bulma'
      ],
      techniques: ['Breathwork', 'Pranayama', 'Mindful Breathing'],
      duration: '60 dakika',
      price: '450₺',
      successRate: '88%',
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      popular: false,
      idealFor: ['Stres yaşayanlar', 'Nefes problemleri olanlar', 'Rahatlama arayanlar']
    },
    {
      id: 'bilincalti-temizligi',
      icon: Heart,
      title: 'Bilinçaltı Temizliği',
      subtitle: 'Bilinçaltı Travma Temizliği',
      description: 'Bilinçaltınızda biriken olumsuz duyguları tespit ederek güvenli bir şekilde temizliyoruz. Bu süreç tamamen doğal ve etkilidir.',
      benefits: [
        'Travmatik anıların etkisini azaltma',
        'Olumsuz inanç sistemlerini değiştirme',
        'Duygusal blokajları açma',
        'İç huzuru ve dengeyi sağlama'
      ],
      techniques: ['EFT (Emotional Freedom Technique)', 'Matrix Reimprinting', 'Inner Child Healing'],
      duration: '60 dakika',
      price: '500₺',
      successRate: '92%',
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      popular: false,
      idealFor: ['Travma yaşayanlar', 'Duygusal blokajı olanlar', 'İç huzur arayanlar']
    }
  ]



  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            Hizmet Detayları
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
              Size En Uygun Hizmeti Seçin
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Her hizmetimiz, farklı ihtiyaçlara yönelik olarak tasarlanmıştır. 
            Detayları inceleyerek size en uygun olanı seçebilirsiniz.
          </p>
        </div>

        {/* Main Services */}
        <div className="space-y-12 mb-20">
          {services.map((service, index) => {
            const IconComponent = service.icon
            const isEven = index % 2 === 0
            
            return (
              <div key={service.id} className={`grid lg:grid-cols-2 gap-12 items-center ${!isEven ? 'lg:grid-flow-col-dense' : ''}`}>
                {/* Content */}
                <div className={`space-y-6 ${!isEven ? 'lg:col-start-2' : ''}`}>
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900">{service.title}</h3>
                      <p className="text-lg text-gray-600">{service.subtitle}</p>
                    </div>
                    {service.popular && (
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                        En Popüler
                      </Badge>
                    )}
                  </div>

                  <p className="text-lg text-gray-700 leading-relaxed">{service.description}</p>

                  {/* Benefits */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Faydaları:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {service.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>



                  {/* Ideal For */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Kimler İçin İdeal:</h4>
                    <div className="flex flex-wrap gap-2">
                      {service.idealFor.map((ideal, idealIndex) => (
                        <Badge key={idealIndex} variant="outline" className="text-xs">
                          <Target className="w-3 h-3 mr-1" />
                          {ideal}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button className={`bg-gradient-to-r ${service.color} hover:opacity-90 text-white`}>
                      Randevu Al
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button variant="outline">
                      Detaylı Bilgi
                    </Button>
                  </div>
                </div>

                {/* Service Card */}
                <div className={!isEven ? 'lg:col-start-1' : ''}>
                  <Card className={`${service.bgColor} ${service.borderColor} border-2 shadow-xl hover:shadow-2xl transition-shadow`}>
                    <CardHeader className="text-center">
                      <div className="flex items-center justify-center mb-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-600">{service.duration}</span>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Success Rate */}
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 mb-1">{service.successRate}</div>
                        <div className="text-sm text-gray-600">Başarı Oranı</div>
                        <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                            style={{ width: service.successRate }}
                          ></div>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Seans Türü:</span>
                          <span className="font-medium">Online & Yüz Yüze</span>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="text-center pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <div className="text-xs text-gray-600">4.9/5 (50+ değerlendirme)</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )
          })}
        </div>


      </div>
    </section>
  )
}

export default ServicesOverview
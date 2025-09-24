'use client'

import React from 'react'
import { Heart, Brain, Compass, Sparkles, Clock, Users, CheckCircle, ArrowRight, Star, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const ServicesOverview = () => {
  const services = [
    {
      id: 'duygu-temizligi',
      icon: Heart,
      title: 'Duygu Temizliği',
      subtitle: 'Bilinçaltı Travma Temizliği',
      description: 'Bilinçaltınızda biriken olumsuz duyguları tespit ederek güvenli bir şekilde temizliyoruz. Bu süreç tamamen doğal ve etkilidir.',
      benefits: [
        'Travmatik anıların etkisini azaltma',
        'Olumsuz inanç sistemlerini değiştirme',
        'Duygusal blokajları açma',
        'İç huzuru ve dengeyi sağlama'
      ],
      techniques: ['EFT (Emotional Freedom Technique)', 'Matrix Reimprinting', 'Inner Child Healing'],
      duration: '90 dakika',
      price: '500₺',
      successRate: '92%',
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      popular: true,
      idealFor: ['Travma yaşayanlar', 'Duygusal blokajı olanlar', 'İç huzur arayanlar']
    },
    {
      id: 'travma-iyilestirme',
      icon: Brain,
      title: 'Travma İyileştirme',
      subtitle: 'Geçmiş Travmaların Güvenli İşlenmesi',
      description: 'Çocukluk travmaları, ilişki travmaları ve kayıp yaşantılarını güvenli bir ortamda işleyerek iyileştirme sürecini başlatıyoruz.',
      benefits: [
        'Çocukluk travmalarının iyileştirilmesi',
        'İlişki travmalarının işlenmesi',
        'Kayıp ve yas sürecinde destek',
        'Travma sonrası büyüme'
      ],
      techniques: ['EMDR Teknikleri', 'Somatic Experiencing', 'Narrative Therapy'],
      duration: '120 dakika',
      price: '750₺',
      successRate: '88%',
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      popular: false,
      idealFor: ['Çocukluk travması yaşayanlar', 'İlişki sorunları olanlar', 'Kayıp yaşayanlar']
    },
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
      duration: '90 dakika',
      price: '600₺',
      successRate: '94%',
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      popular: false,
      idealFor: ['Ruhsal gelişim isteyenler', 'Enerji dengesizliği yaşayanlar', 'Bütüncül iyileşme arayanlar']
    }
  ]

  const additionalServices = [
    {
      title: 'Grup Seansları',
      description: 'Grup halinde duygu temizliği ve paylaşım',
      duration: '120 dakika',
      price: '200₺',
      capacity: '6-8 kişi'
    },
    {
      title: 'Online Seanslar',
      description: 'Tüm hizmetler online olarak sunulabilir',
      duration: 'Hizmete göre',
      price: 'Aynı fiyat',
      capacity: 'Bireysel'
    },
    {
      title: 'Acil Destek',
      description: '24/7 WhatsApp destek hattı',
      duration: 'Sürekli',
      price: 'Ücretsiz',
      capacity: 'Sınırsız'
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

                  {/* Techniques */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Kullanılan Teknikler:</h4>
                    <div className="flex flex-wrap gap-2">
                      {service.techniques.map((technique, techIndex) => (
                        <Badge key={techIndex} variant="secondary" className="text-xs">
                          {technique}
                        </Badge>
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
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-600">{service.duration}</span>
                        </div>
                        <div className="text-2xl font-bold text-purple-600">{service.price}</div>
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
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Takip Desteği:</span>
                          <span className="font-medium">7 Gün</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Garanti:</span>
                          <span className="font-medium">Memnuniyet</span>
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

        {/* Additional Services */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Ek Hizmetler</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {additionalServices.map((service, index) => (
              <Card key={index} className="p-6 bg-white hover:shadow-lg transition-shadow border border-gray-200">
                <div className="text-center">
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h4>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Süre:</span>
                      <span className="font-medium">{service.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Fiyat:</span>
                      <span className="font-medium text-purple-600">{service.price}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Kapasite:</span>
                      <span className="font-medium">{service.capacity}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">Hizmet Karşılaştırması</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Özellik</th>
                  <th className="text-center py-3 px-4 font-semibold text-red-600">Duygu Temizliği</th>
                  <th className="text-center py-3 px-4 font-semibold text-purple-600">Travma İyileştirme</th>
                  <th className="text-center py-3 px-4 font-semibold text-blue-600">Yaşam Koçluğu</th>
                  <th className="text-center py-3 px-4 font-semibold text-emerald-600">Holistik Koçluk</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium">Süre</td>
                  <td className="text-center py-3 px-4">90 dk</td>
                  <td className="text-center py-3 px-4">120 dk</td>
                  <td className="text-center py-3 px-4">60 dk</td>
                  <td className="text-center py-3 px-4">90 dk</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium">Fiyat</td>
                  <td className="text-center py-3 px-4">500₺</td>
                  <td className="text-center py-3 px-4">750₺</td>
                  <td className="text-center py-3 px-4">400₺</td>
                  <td className="text-center py-3 px-4">600₺</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium">Başarı Oranı</td>
                  <td className="text-center py-3 px-4">92%</td>
                  <td className="text-center py-3 px-4">88%</td>
                  <td className="text-center py-3 px-4">90%</td>
                  <td className="text-center py-3 px-4">94%</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Online Mevcut</td>
                  <td className="text-center py-3 px-4"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="text-center py-3 px-4"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="text-center py-3 px-4"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="text-center py-3 px-4"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </section>
  )
}

export default ServicesOverview
'use client'

import React, { useState } from 'react'
import { Heart, Brain, Compass, Sparkles, Check, X, Star, Clock, Users, ArrowRight, Gift, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const ServicePricing = () => {
  const [billingType, setBillingType] = useState<'single' | 'package'>('single')

  const services = [
    {
      id: 'duygu-temizligi',
      icon: Heart,
      title: 'Duygu Temizliği',
      subtitle: 'Bilinçaltı Travma Temizliği',
      singlePrice: 500,
      packagePrice: 1800,
      packageSessions: 4,
      duration: '60 dakika',
      color: 'from-red-500 to-pink-500',
      popular: true,
      features: [
        'EFT Teknikleri',
        'Matrix Reimprinting',
        'Inner Child Healing',
        'Seans sonrası takip',
        'WhatsApp desteği',
        'Kayıt imkanı'
      ],
      notIncluded: [
        'Grup seansları',
        'Acil müdahale'
      ],
      savings: 200,
      successRate: '92%'
    },
    {
      id: 'travma-iyilestirme',
      icon: Brain,
      title: 'Travma İyileştirme',
      subtitle: 'Geçmiş Travmaların İşlenmesi',
      singlePrice: 750,
      packagePrice: 2700,
      packageSessions: 4,
      duration: '60 dakika',
      color: 'from-purple-500 to-indigo-500',
      popular: false,
      features: [
        'EMDR Teknikleri',
        'Somatic Experiencing',
        'Narrative Therapy',
        'Detaylı değerlendirme',
        'Sürekli destek',
        'İlerleme raporu'
      ],
      notIncluded: [
        'Grup terapisi',
        'Aile danışmanlığı'
      ],
      savings: 300,
      successRate: '88%'
    },
    {
      id: 'yasam-koclugu',
      icon: Compass,
      title: 'Yaşam Koçluğu',
      subtitle: 'Kişisel Hedeflere Ulaşma',
      singlePrice: 400,
      packagePrice: 1400,
      packageSessions: 4,
      duration: '60 dakika',
      color: 'from-blue-500 to-cyan-500',
      popular: false,
      features: [
        'Goal Setting',
        'Mindfulness Coaching',
        'Cognitive Restructuring',
        'Eylem planı',
        'Motivasyon desteği',
        'İlerleme takibi'
      ],
      notIncluded: [
        'Kariyer danışmanlığı',
        'Finansal planlama'
      ],
      savings: 200,
      successRate: '90%'
    },
    {
      id: 'holistik-kocluk',
      icon: Sparkles,
      title: 'Holistik Koçluk',
      subtitle: 'Bütüncül Dönüşüm',
      singlePrice: 600,
      packagePrice: 2100,
      packageSessions: 4,
      duration: '60 dakika',
      color: 'from-emerald-500 to-teal-500',
      popular: false,
      features: [
        'Energy Healing',
        'Chakra Balancing',
        'Meditation Guidance',
        'Enerji değerlendirmesi',
        'Ruhsal rehberlik',
        'Bütüncül yaklaşım'
      ],
      notIncluded: [
        'Fiziksel tedavi',
        'Tıbbi müdahale'
      ],
      savings: 300,
      successRate: '94%'
    }
  ]

  const additionalServices = [
    {
      title: 'Grup Seansları',
      description: '6-8 kişilik grup seansları',
      price: 200,
      duration: '60 dakika',
      features: ['Grup dinamiği', 'Paylaşım ortamı', 'Sosyal destek', 'Maliyet avantajı']
    },
    {
      title: 'Acil Destek',
      description: 'Kriz anlarında acil destek',
      price: 300,
      duration: '30-60 dakika',
      features: ['24/7 erişim', 'Hızlı müdahale', 'Kriz yönetimi', 'Stabilizasyon']
    },
    {
      title: 'Takip Seansı',
      description: 'Ana seanslar sonrası takip',
      price: 200,
      duration: '30 dakika',
      features: ['İlerleme değerlendirmesi', 'Destek sağlama', 'Pekiştirme', 'Motivasyon']
    }
  ]

  const paymentOptions = [
    {
      title: 'Tek Ödeme',
      description: 'Seans başına ödeme',
      icon: '💳',
      benefits: ['Esnek ödeme', 'Taahhüt yok', 'İstediğiniz zaman', 'Risk yok']
    },
    {
      title: 'Paket Ödeme',
      description: '4 seans paketi',
      icon: '💰',
      benefits: ['%15 indirim', 'Garantili randevu', 'Süreklilik', 'Daha etkili']
    },
    {
      title: 'Taksitli Ödeme',
      description: '2-3 taksit imkanı',
      icon: '📅',
      benefits: ['Bütçe dostu', 'Kredi kartı', 'Esnek vade', 'Faiz yok']
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
            Fiyatlandırma
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
              Şeffaf ve Adil Fiyatlar
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Kaliteli hizmet, uygun fiyat. Paket seçenekleriyle %15'e varan indirimlerden yararlanın.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 p-1 rounded-full">
            <button
              onClick={() => setBillingType('single')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingType === 'single'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Tek Seans
            </button>
            <button
              onClick={() => setBillingType('package')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingType === 'package'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              4 Seans Paketi
              <Badge className="ml-2 bg-green-500 text-white text-xs">%15 İndirim</Badge>
            </button>
          </div>
        </div>

        {/* Main Services Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {services.map((service) => {
            const IconComponent = service.icon
            const currentPrice = billingType === 'single' ? service.singlePrice : service.packagePrice
            const originalPackagePrice = service.singlePrice * service.packageSessions
            
            return (
              <Card key={service.id} className={`relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${service.popular ? 'ring-2 ring-purple-400 scale-105' : ''}`}>
                {service.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-2 text-sm font-semibold">
                    En Popüler
                  </div>
                )}
                
                <CardHeader className={`${service.popular ? 'pt-12' : 'pt-6'} pb-4`}>
                  <div className="text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 mb-2">{service.title}</CardTitle>
                    <p className="text-sm text-gray-600 mb-4">{service.subtitle}</p>
                    
                    <div className="space-y-2">
                      <div className="text-4xl font-bold text-gray-900">
                        {currentPrice}₺
                        {billingType === 'package' && (
                          <span className="text-lg text-gray-500 ml-1">/ 4 seans</span>
                        )}
                      </div>
                      
                      {billingType === 'package' && (
                        <div className="space-y-1">
                          <div className="text-sm text-gray-500 line-through">
                            {originalPackagePrice}₺
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            {service.savings}₺ tasarruf
                          </Badge>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{service.duration}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="px-6 pb-6">
                  <div className="space-y-4">
                    {/* Success Rate */}
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-gray-900">{service.successRate}</span>
                      </div>
                      <div className="text-xs text-gray-600">Başarı Oranı</div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2">
                      {service.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                      {service.notIncluded.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2 opacity-50">
                          <X className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-sm text-gray-500">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <Button 
                      className={`w-full bg-gradient-to-r ${service.color} hover:opacity-90 text-white`}
                    >
                      {billingType === 'single' ? 'Randevu Al' : 'Paketi Seç'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Additional Services */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Ek Hizmetler</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {additionalServices.map((service, index) => (
              <Card key={index} className="p-6 bg-white hover:shadow-lg transition-shadow border border-gray-200">
                <div className="text-center mb-4">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h4>
                  <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                  
                  <div className="text-3xl font-bold text-purple-600 mb-2">{service.price}₺</div>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{service.duration}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="w-full">
                  Bilgi Al
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Payment Options */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Ödeme Seçenekleri</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {paymentOptions.map((option, index) => (
              <Card key={index} className="p-6 bg-white hover:shadow-lg transition-shadow border border-gray-200 text-center">
                <div className="text-4xl mb-4">{option.icon}</div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{option.title}</h4>
                <p className="text-gray-600 text-sm mb-4">{option.description}</p>
                
                <div className="space-y-2">
                  {option.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center justify-center space-x-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Special Offers */}
        <Card className="p-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center mb-16">
          <Gift className="w-16 h-16 mx-auto mb-6 opacity-80" />
          <h3 className="text-3xl font-bold mb-4">Özel Fırsatlar</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <Zap className="w-5 h-5" />
                <span className="font-semibold">İlk Seans İndirimi</span>
              </div>
              <p className="text-sm opacity-90">İlk seansınızda %20 indirim</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <Users className="w-5 h-5" />
                <span className="font-semibold">Arkadaş Referansı</span>
              </div>
              <p className="text-sm opacity-90">Arkadaşınızı getirin, %10 indirim kazanın</p>
            </div>
          </div>
        </Card>

        {/* FAQ */}
        <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">Fiyatlandırma SSS</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Ödeme nasıl yapılır?</h4>
                <p className="text-gray-600 text-sm">Kredi kartı, banka havalesi veya nakit ödeme kabul edilir.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Erteleme politikası nedir?</h4>
                <p className="text-gray-600 text-sm">Seansınız iptal edilmez, uygun bir gün ve saate ertelenebilir. En fazla 2 kez erteleme yapabilirsiniz.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Paket seansları ne kadar sürede kullanılmalı?</h4>
                <p className="text-gray-600 text-sm">Paket seansları 6 ay içinde kullanılmalıdır.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Fatura kesilir mi?</h4>
                <p className="text-gray-600 text-sm">Evet, tüm ödemeler için fatura kesilir.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}

export default ServicePricing
'use client'

import React from 'react'
import { Heart, Users, Shield, Sparkles, Target, Clock, CheckCircle, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const AboutApproach = () => {
  const principles = [
    {
      icon: Heart,
      title: 'Kişiye Özel Yaklaşım',
      description: 'Her bireyin benzersiz olduğuna inanıyor, kişiye özel tedavi planları oluşturuyorum.',
      details: [
        'Detaylı ön değerlendirme',
        'Kişisel ihtiyaç analizi',
        'Esnek seans planlaması',
        'Sürekli gözden geçirme'
      ],
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: Shield,
      title: 'Güvenli Ortam',
      description: 'Yargısız, destekleyici ve tamamen gizli bir ortamda çalışıyoruz.',
      details: [
        'Tam gizlilik garantisi',
        'Yargısız yaklaşım',
        'Destekleyici atmosfer',
        'Güvenli iletişim'
      ],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Sparkles,
      title: 'Holistik Bakış',
      description: 'Beden, zihin ve ruh bütünlüğünü gözetiyorum.',
      details: [
        'Fiziksel belirtiler',
        'Duygusal durumlar',
        'Zihinsel örüntüler',
        'Ruhsal boyut'
      ],
      color: 'from-purple-500 to-indigo-500'
    },
    {
      icon: Target,
      title: 'Sonuç Odaklı',
      description: 'Somut hedefler belirleyip, ölçülebilir sonuçlar elde ediyoruz.',
      details: [
        'Net hedef belirleme',
        'İlerleme takibi',
        'Düzenli değerlendirme',
        'Sonuç ölçümü'
      ],
      color: 'from-green-500 to-emerald-500'
    }
  ]

  const processSteps = [
    {
      step: 1,
      title: 'İlk Görüşme',
      description: 'Ücretsiz 15 dakikalık ön görüşmede durumunuzu değerlendiriyoruz.',
      duration: '15 dakika',
      activities: ['Durum tespiti', 'İhtiyaç analizi', 'Beklenti belirleme']
    },
    {
      step: 2,
      title: 'Değerlendirme',
      description: 'Detaylı değerlendirme ile kişiye özel tedavi planı oluşturuyoruz.',
      duration: '30 dakika',
      activities: ['Geçmiş analizi', 'Travma tespiti', 'Plan oluşturma']
    },
    {
      step: 3,
      title: 'Aktif Seans',
      description: 'Belirlenen teknikleri kullanarak duygu temizliği sürecini başlatıyoruz.',
      duration: '60 dakika',
      activities: ['Teknik uygulama', 'Duygu işleme', 'Enerji temizliği']
    },
    {
      step: 4,
      title: 'Takip',
      description: 'Seans sonrası süreçte destek olmaya ve ilerlemeyi takip etmeye devam ediyoruz.',
      duration: 'Sürekli',
      activities: ['İlerleme takibi', 'Destek sağlama', 'Gerektiğinde ek seanslar']
    }
  ]

  const techniques = [
    {
      name: 'EFT (Emotional Freedom Technique)',
      description: 'Enerji meridyenlerine dokunarak duygusal blokajları açma',
      effectiveness: '95%'
    },
    {
      name: 'Matrix Reimprinting',
      description: 'Geçmiş travmatik anıları yeniden programlama',
      effectiveness: '90%'
    },
    {
      name: 'Inner Child Healing',
      description: 'İç çocuk iyileştirmesi ve bütünleştirme',
      effectiveness: '88%'
    },
    {
      name: 'Mindfulness Coaching',
      description: 'Farkındalık temelli yaşam koçluğu',
      effectiveness: '92%'
    },
    {
      name: 'Energy Healing',
      description: 'Enerji dengeleme ve chakra uyumlaması',
      effectiveness: '87%'
    },
    {
      name: 'Cognitive Restructuring',
      description: 'Olumsuz düşünce kalıplarını değiştirme',
      effectiveness: '91%'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            Yaklaşımım
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
              Nasıl Çalışıyorum?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            8 yıllık deneyimimle geliştirdiğim kişiye özel, holistik ve 
            sonuç odaklı yaklaşımım hakkında detaylar.
          </p>
        </div>

        {/* Core Principles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {principles.map((principle, index) => {
            const IconComponent = principle.icon
            return (
              <Card key={index} className="p-6 bg-white hover:shadow-lg transition-shadow border border-gray-200">
                <div className="flex items-start space-x-4 mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${principle.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{principle.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{principle.description}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {principle.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{detail}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )
          })}
        </div>

        {/* Process Steps */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Çalışma Sürecim</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <Card key={index} className="p-6 bg-white hover:shadow-lg transition-shadow border border-gray-200 relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {step.step}
                </div>
                
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">{step.description}</p>
                  
                  <div className="flex items-center space-x-2 mb-4">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-600">{step.duration}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {step.activities.map((activity, actIndex) => (
                    <div key={actIndex} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      <span className="text-xs text-gray-600">{activity}</span>
                    </div>
                  ))}
                </div>

                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Techniques */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Kullandığım Teknikler</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techniques.map((technique, index) => (
              <Card key={index} className="p-6 bg-white hover:shadow-lg transition-shadow border border-gray-200">
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{technique.name}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{technique.description}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-sm text-gray-600">Etkinlik Oranı:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                        style={{ width: technique.effectiveness }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-green-600">{technique.effectiveness}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Philosophy Quote */}
        <Card className="p-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center">
          <div className="max-w-4xl mx-auto">
            <Sparkles className="w-12 h-12 mx-auto mb-6 opacity-80" />
            <h3 className="text-3xl font-bold mb-6">Çalışma Felsefem</h3>
            <blockquote className="text-xl leading-relaxed mb-6 italic">
              "Her bireyin kendi iyileşme gücü vardır. Benim görevim, bu gücü ortaya çıkarmak 
              ve kişinin kendi potansiyelini keşfetmesine rehberlik etmektir. 
              Çünkü gerçek dönüşüm, kişinin içinden gelir."
            </blockquote>
            <div className="text-lg opacity-90">— Emel Yeşildere</div>
          </div>
        </Card>
      </div>
    </section>
  )
}

export default AboutApproach
'use client'

import React from 'react'
import { Users, Clock, Star, Award, TrendingUp, Heart, CheckCircle, Target } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const AboutExperience = () => {
  const experienceStats = [
    {
      icon: Users,
      number: '100+',
      label: 'Başarılı Seans',
      description: 'Farklı yaş gruplarından müşterilerle gerçekleştirilen seanslar',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Clock,
      number: '2000+',
      label: 'Seans Saati',
      description: 'Toplam duygu temizliği ve koçluk seans süresi',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      icon: Star,
      number: '4.9/5',
      label: 'Müşteri Puanı',
      description: '200+ değerlendirme ortalaması',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: TrendingUp,
      number: '95%',
      label: 'Başarı Oranı',
      description: 'Müşteri memnuniyet ve iyileşme oranı',
      color: 'from-green-500 to-emerald-500'
    }
  ]

  const specializations = [
    {
      title: 'Duygu Temizliği',
      experience: '8+ Yıl',
      description: 'Bilinçaltı travma temizliği ve olumsuz inanç değişimi',
      techniques: ['EFT (Emotional Freedom Technique)', 'Matrix Reimprinting', 'Inner Child Healing'],
      successRate: '92%',
      icon: Heart
    },
    {
      title: 'Travma İyileştirme',
      experience: '6+ Yıl',
      description: 'Çocukluk ve ilişki travmalarının güvenli işlenmesi',
      techniques: ['EMDR Teknikleri', 'Somatic Experiencing', 'Narrative Therapy'],
      successRate: '88%',
      icon: Award
    },
    {
      title: 'Yaşam Koçluğu',
      experience: '7+ Yıl',
      description: 'Kişisel hedeflere ulaşma ve yaşam kalitesini artırma',
      techniques: ['Goal Setting', 'Mindfulness Coaching', 'Cognitive Restructuring'],
      successRate: '90%',
      icon: Target
    },
    {
      title: 'Holistik Koçluk',
      experience: '5+ Yıl',
      description: 'Beden, zihin ve ruh bütünlüğü ile iyileşme',
      techniques: ['Energy Healing', 'Chakra Balancing', 'Meditation Guidance'],
      successRate: '94%',
      icon: CheckCircle
    }
  ]

  const clientTypes = [
    {
      category: 'Yaş Grupları',
      data: [
        { label: '18-25 yaş', percentage: 20 },
        { label: '26-35 yaş', percentage: 35 },
        { label: '36-45 yaş', percentage: 30 },
        { label: '46+ yaş', percentage: 15 }
      ]
    },
    {
      category: 'Başvuru Nedenleri',
      data: [
        { label: 'Travma İyileştirme', percentage: 40 },
        { label: 'Kişisel Gelişim', percentage: 25 },
        { label: 'İlişki Sorunları', percentage: 20 },
        { label: 'Kariyer Koçluğu', percentage: 15 }
      ]
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            Deneyim & Uzmanlık
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
              8 Yıllık Deneyimim
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Binlerce saat deneyim, sürekli eğitim ve müşteri odaklı yaklaşımla 
            elde ettiğim uzmanlığım hakkında detaylar.
          </p>
        </div>

        {/* Experience Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {experienceStats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <Card key={index} className="p-6 text-center bg-white hover:shadow-lg transition-shadow border border-gray-200">
                <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{stat.label}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{stat.description}</p>
              </Card>
            )
          })}
        </div>

        {/* Specializations */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Uzmanlık Alanlarım</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {specializations.map((spec, index) => {
              const IconComponent = spec.icon
              return (
                <Card key={index} className="p-6 bg-white hover:shadow-lg transition-shadow border border-gray-200">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xl font-semibold text-gray-900">{spec.title}</h4>
                        <Badge variant="outline" className="text-purple-600 border-purple-300">
                          {spec.experience}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-4">{spec.description}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Kullandığım Teknikler:</h5>
                      <div className="flex flex-wrap gap-2">
                        {spec.techniques.map((technique, techIndex) => (
                          <Badge key={techIndex} variant="secondary" className="text-xs">
                            {technique}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <span className="text-sm text-gray-600">Başarı Oranı:</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                            style={{ width: spec.successRate }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-green-600">{spec.successRate}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Client Demographics */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Müşteri Profili</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {clientTypes.map((type, index) => (
              <Card key={index} className="p-6 bg-white border border-gray-200">
                <h4 className="text-xl font-semibold text-gray-900 mb-6">{type.category}</h4>
                <div className="space-y-4">
                  {type.data.map((item, itemIndex) => (
                    <div key={itemIndex} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">{item.label}</span>
                        <span className="font-semibold text-purple-600">{item.percentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Testimonial Quote */}
        <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="text-6xl text-purple-300 mb-4">"</div>
            <blockquote className="text-xl text-gray-700 leading-relaxed mb-6 italic">
              Emel hanımın deneyimi ve yaklaşımı gerçekten etkileyici. 8 yıllık tecrübesi 
              her seansında hissediliyor. Beni anlıyor, doğru yönlendiriyor ve 
              her adımda yanımda olduğunu hissediyorum.
            </blockquote>
            <div className="flex items-center justify-center space-x-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <div className="text-gray-600">— Ayşe K., Öğretmen</div>
          </div>
        </Card>
      </div>
    </section>
  )
}

export default AboutExperience
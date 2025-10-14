'use client'

import React, { useEffect, useState } from 'react'
import { Users, Heart, Star, Award, TrendingUp, Clock, CheckCircle, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const StatsSection = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById('stats-section')
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [])

  const AnimatedNumber = ({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) => {
    const [current, setCurrent] = useState(0)

    useEffect(() => {
      if (!isVisible) return

      let startTime: number
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / duration, 1)
        setCurrent(Math.floor(progress * end))
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      requestAnimationFrame(animate)
    }, [isVisible, end, duration])

    return <span>{current}{suffix}</span>
  }

  const mainStats = [
    {
      icon: Users,
      number: 100,
      suffix: '+',
      label: 'Mutlu Danışan',
      description: 'Yaşamında pozitif değişim yaşayan kişi sayısı',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Heart,
      number: 95,
      suffix: '%',
      label: 'Başarı Oranı',
      description: 'Danışanlarımızın memnuniyet oranı',
      color: 'from-pink-500 to-red-500',
      bgColor: 'bg-pink-50'
    },
    {
      icon: Award,
      number: 3,
      suffix: '+',
      label: 'Yıl Deneyim',
      description: 'Holistik koçluk alanındaki uzmanlık',
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Star,
      number: 4.9,
      suffix: '/5',
      label: 'Danışan Puanı',
      description: '50+ değerlendirme ortalaması',
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50'
    }
  ]

  const additionalStats = [
    {
      icon: Clock,
      number: 500,
      suffix: '+',
      label: 'Seans Saati',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: CheckCircle,
      number: 5,
      suffix: '',
      label: 'Sertifika',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: TrendingUp,
      number: 95,
      suffix: '%',
      label: 'Tavsiye Oranı',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Sparkles,
      number: 24,
      suffix: '/7',
      label: 'Destek',
      color: 'from-pink-500 to-purple-500'
    }
  ]

  const testimonialStats = [
    {
      category: 'Yaşam Koçluğu',
      percentage: 88,
      description: 'Hedef başarı oranı'
    },
    {
      category: 'Holistik Koçluk',
      percentage: 94,
      description: 'Bütüncül iyileşme oranı'
    },
    {
      category: 'Bilinçaltı Temizliği',
      percentage: 92,
      description: 'Dönüşüm başarı oranı'
    }
  ]

  return (
    <section id="stats-section" className="py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
              Rakamlarla Başarı
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            3 yılı aşkın deneyimimiz ve yüzlerce mutlu danışanımızla 
            elde ettiğimiz başarı hikayemiz
          </p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {mainStats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <Card key={index} className={`${stat.bgColor} border-2 border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden relative`}>
                <CardContent className="p-6 text-center">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-transparent"></div>
                  </div>
                  
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg relative z-10`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Number */}
                  <div className="text-4xl font-bold text-gray-900 mb-2 relative z-10">
                    <AnimatedNumber end={stat.number} suffix={stat.suffix} />
                  </div>

                  {/* Label */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 relative z-10">{stat.label}</h3>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed relative z-10">{stat.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {additionalStats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <Card key={index} className="p-6 text-center bg-white hover:shadow-lg transition-shadow border border-gray-200">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  <AnimatedNumber end={stat.number} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </Card>
            )
          })}
        </div>

        {/* Success Rates */}
        <Card className="p-8 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Hizmet Başarı Oranları</h3>
            <p className="text-gray-600">Farklı hizmet alanlarındaki başarı yüzdelerimiz</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialStats.map((item, index) => (
              <div key={index} className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  {/* Background Circle */}
                  <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
                  
                  {/* Progress Circle */}
                  <div 
                    className="absolute inset-0 rounded-full border-8 border-transparent"
                    style={{
                      background: `conic-gradient(from 0deg, #6B73FF 0%, #9B59B6 ${item.percentage}%, transparent ${item.percentage}%)`,
                      borderRadius: '50%',
                      mask: 'radial-gradient(circle at center, transparent 60%, black 60%)',
                      WebkitMask: 'radial-gradient(circle at center, transparent 60%, black 60%)'
                    }}
                  ></div>
                  
                  {/* Percentage Text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">
                      <AnimatedNumber end={item.percentage} suffix="%" />
                    </span>
                  </div>
                </div>
                
                <h4 className="font-semibold text-gray-900 mb-2">{item.category}</h4>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Trust Indicators */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-6">Güvenilir ve Deneyimli</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="space-y-2">
              <div className="text-4xl font-bold">
                <AnimatedNumber end={3} suffix="+" />
              </div>
              <div className="text-lg opacity-90">Yıl Deneyim</div>
              <div className="text-sm opacity-75">Sürekli gelişim ve uzmanlaşma</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-4xl font-bold">
                <AnimatedNumber end={5} />
              </div>
              <div className="text-lg opacity-90">Sertifika</div>
              <div className="text-sm opacity-75">Uluslararası geçerlilikte</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-4xl font-bold">
                <AnimatedNumber end={100} suffix="%" />
              </div>
              <div className="text-lg opacity-90">Gizlilik</div>
              <div className="text-sm opacity-75">Tam güvenlik garantisi</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default StatsSection
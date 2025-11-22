'use client'

import React from 'react'
import { MessageCircle, Calendar, Heart, Sparkles, ArrowRight, CheckCircle, Clock, Shield, Users, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useContactInfo } from '@/hooks/use-contact-info'

const ServiceProcess = () => {
  const { contactInfo } = useContactInfo()
  const processSteps = [
    {
      step: 1,
      icon: MessageCircle,
      title: 'Ücretsiz Ön Görüşme',
      subtitle: 'Tanışma ve Değerlendirme',
      description: 'İlk adımda, ihtiyaçlarınızı anlayabilmek için 15 dakikalık ücretsiz bir ön görüşme yapıyoruz.',
      duration: '15 dakika',
      details: [
        'Mevcut durumunuzu dinliyoruz',
        'Hedeflerinizi belirliyoruz',
        'Size en uygun hizmeti öneriyoruz',
        'Süreç hakkında bilgi veriyoruz'
      ],
      whatToExpect: 'Rahat bir sohbet ortamında kendinizi ifade edebilirsiniz. Hiçbir yargı olmadan dinleneceksiniz.',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50'
    },
    {
      step: 2,
      icon: Calendar,
      title: 'Randevu Planlama',
      subtitle: 'Esnek Zamanlama',
      description: 'Size uygun tarih ve saatte, online veya yüz yüze seans randevunuzu planlıyoruz.',
      duration: '5 dakika',
      details: [
        'Esnek randevu saatleri (09:00-18:00)',
        'Online veya yüz yüze seçeneği',
        'Hatırlatma mesajları',
        'Kolay iptal/erteleme imkanı'
      ],
      whatToExpect: 'Yaşam tarzınıza uygun saatlerde randevu alabilirsiniz. Online seanslar için teknik destek sağlanır.',
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-50'
    },
    {
      step: 3,
      icon: Heart,
      title: 'Ana Seans',
      subtitle: 'Dönüşüm Süreci',
      description: 'Güvenli bir ortamda, belirlenen teknikleri kullanarak dönüşüm sürecinizi başlatıyoruz.',
      duration: '60 dakika',
      details: [
        'Kişiye özel yaklaşım',
        'Güvenli ve destekleyici ortam',
        'Kanıtlanmış teknikler',
        'Sürekli geri bildirim'
      ],
      whatToExpect: 'Derin bir iyileşme deneyimi yaşayacaksınız. Süreç boyunca kendinizi güvende hissedeceksiniz.',
      color: 'from-pink-500 to-red-500',
      bgColor: 'bg-pink-50'
    },
    {
      step: 4,
      icon: Sparkles,
      title: 'Takip ve Destek',
      subtitle: 'Sürekli Rehberlik',
      description: 'Seans sonrası süreçte size destek olmaya devam ediyor, iyileşme yolculuğunuzu takip ediyoruz.',
      duration: 'Sürekli',
      details: [
        'Seans sonrası takip',
        'WhatsApp destek hattı',
        'Gerektiğinde ek seanslar',
        'İlerleme değerlendirmesi'
      ],
      whatToExpect: 'Yalnız değilsiniz. Süreç boyunca yanınızda olacağız ve sorularınızı yanıtlayacağız.',
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50'
    }
  ]

  const sessionTypes = [
    {
      type: 'Online Seans',
      icon: '💻',
      description: 'Video konferans üzerinden gerçekleştirilen seanslar',
      advantages: [
        'Evinizin rahatlığında',
        'Ulaşım sorunu yok',
        'Esnek saatler',
        'Kayıt imkanı'
      ],
      requirements: [
        'Stabil internet bağlantısı',
        'Sessiz ortam',
        'Kamera ve mikrofon',
        'Site İçi Seans Odası'
      ],

    },
    {
      type: 'Yüz Yüze Seans',
      icon: '🏢',
      description: 'Ofiste gerçekleştirilen geleneksel seanslar',
      advantages: [
        'Daha kişisel bağlantı',
        'Dikkat dağıtıcı yok',
        'Enerji çalışması için ideal',
        'Tam odaklanma'
      ],
      requirements: [
        'Bandırma lokasyonu',
        'Randevu saatine uyum',
        'Ulaşım planlaması',
        'Maske (gerektiğinde)'
      ],

    },
    {
      type: 'Hibrit Seans',
      icon: '🔄',
      description: 'Online ve yüz yüze seansların kombinasyonu',
      advantages: [
        'Maksimum esneklik',
        'İhtiyaca göre seçim',
        'Süreklilik',
        'Maliyet optimizasyonu'
      ],
      requirements: [
        'Her iki seçenek için hazırlık',
        'Esnek planlama',
        'İletişim koordinasyonu',
        'Teknik altyapı'
      ],

    }
  ]

  const guarantees = [
    {
      icon: Shield,
      title: 'Gizlilik Garantisi',
      description: 'Tüm görüşmeleriniz tamamen gizlidir ve üçüncü kişilerle paylaşılmaz.'
    },
    {
      icon: Users,
      title: 'Profesyonel Destek',
      description: '3+ yıl deneyimli uzman tarafından verilen profesyonel hizmet.'
    },
    {
      icon: Clock,
      title: 'Zamanında Hizmet',
      description: 'Randevu saatlerine titizlikle uyulur, bekleme süresi minimumda tutulur.'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            Süreç & Yöntem
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
              Nasıl Çalışıyoruz?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            İlk görüşmeden takip sürecine kadar, adım adım nasıl çalıştığımızı 
            ve size nasıl destek olduğumuzu keşfedin.
          </p>
        </div>

        {/* Process Steps */}
        <div className="relative mb-20">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-32 left-1/2 transform -translate-x-1/2 w-full max-w-6xl">
            <div className="relative h-1 bg-gradient-to-r from-blue-200 via-purple-200 via-pink-200 to-emerald-200 rounded-full">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-emerald-500 rounded-full opacity-30 animate-pulse"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => {
              const IconComponent = step.icon
              return (
                <div key={step.step} className="relative">
                  <Card className={`${step.bgColor} border-2 border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden`}>
                    {/* Step Number */}
                    <div className="absolute top-4 right-4">
                      <div className={`w-10 h-10 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white font-bold`}>
                        {step.step}
                      </div>
                    </div>

                    <CardContent className="p-6">
                      {/* Icon */}
                      <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-sm font-medium text-purple-600 mb-3">{step.subtitle}</p>
                      <p className="text-gray-700 mb-4 leading-relaxed text-sm">{step.description}</p>

                      {/* Duration */}
                      <div className="flex items-center space-x-2 mb-4">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600 font-medium">{step.duration}</span>
                      </div>

                      {/* Details */}
                      <div className="space-y-2 mb-4">
                        {step.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-start space-x-2">
                            <CheckCircle className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                            <span className="text-xs text-gray-600">{detail}</span>
                          </div>
                        ))}
                      </div>

                      {/* What to Expect */}
                      <div className="pt-3 border-t border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Ne Bekleyebilirsiniz?</h4>
                        <p className="text-xs text-gray-600 leading-relaxed">{step.whatToExpect}</p>
                      </div>
                    </CardContent>

                    {/* Arrow for desktop */}
                    {index < processSteps.length - 1 && (
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

        {/* Session Types */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Seans Türleri</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sessionTypes.map((session, index) => (
              <Card key={index} className="p-6 bg-white hover:shadow-lg transition-shadow border border-gray-200">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-4">{session.icon}</div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">{session.type}</h4>
                  <p className="text-gray-600 text-sm">{session.description}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Avantajları:</h5>
                    <div className="space-y-1">
                      {session.advantages.map((advantage, advIndex) => (
                        <div key={advIndex} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{advantage}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Gereksinimler:</h5>
                    <div className="space-y-1">
                      {session.requirements.map((requirement, reqIndex) => (
                        <div key={reqIndex} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                          <span className="text-sm text-gray-600">{requirement}</span>
                        </div>
                      ))}
                    </div>
                  </div>


                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Guarantees */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Garantilerimiz</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {guarantees.map((guarantee, index) => {
              const IconComponent = guarantee.icon
              return (
                <Card key={index} className="p-6 text-center bg-white hover:shadow-lg transition-shadow border border-gray-200">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{guarantee.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{guarantee.description}</p>
                </Card>
              )
            })}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">
            Süreç Hakkında Sorularınız mı Var?
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Ücretsiz ön görüşme ile tüm sorularınızı yanıtlayalım
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Ücretsiz Ön Görüşme
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Randevu Al
            </Button>
          </div>

          {/* Contact Info */}
          <div className="mt-8 text-white/80 text-sm">
            <p>📞 {contactInfo.phone} | ✉️ {contactInfo.email}</p>
            <p>🕒 Pazartesi - Cuma: {contactInfo.workingHours.weekdays}</p>
          </div>
        </Card>
      </div>
    </section>
  )
}

export default ServiceProcess
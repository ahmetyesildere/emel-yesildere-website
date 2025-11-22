'use client'

import React from 'react'
import { Heart, MessageCircle, Calendar, ArrowRight, Star, Users, CheckCircle, Phone, Mail, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useContactInfo } from '@/hooks/use-contact-info'

const ServicesCTA = () => {
  const { contactInfo } = useContactInfo()
  const ctaOptions = [
    {
      icon: MessageCircle,
      title: 'Ücretsiz Ön Görüşme',
      subtitle: '15 dakikalık değerlendirme',
      description: 'Size en uygun hizmeti belirlemek için ücretsiz ön görüşme yapıyoruz.',
      benefits: ['Durum değerlendirmesi', 'Hizmet önerisi', 'Süreç bilgilendirmesi', 'Soru-cevap'],
      action: 'Hemen Başla',
      primary: true,
      popular: true
    },
    {
      icon: Calendar,
      title: 'Doğrudan Randevu',
      subtitle: 'Hemen seans rezervasyonu',
      description: 'Hangi hizmeti istediğinizi biliyorsanız doğrudan randevu alabilirsiniz.',
      benefits: ['Hızlı rezervasyon', 'Esnek saatler', 'Online/yüz yüze', 'Anında onay'],
      action: 'Randevu Al',
      primary: false,
      popular: false
    },
    {
      icon: Phone,
      title: 'Telefon Görüşmesi',
      subtitle: 'Detaylı bilgi almak için',
      description: 'Hizmetler hakkında detaylı bilgi almak için telefon görüşmesi yapabilirsiniz.',
      benefits: ['Kişisel danışma', 'Detaylı açıklama', 'Özel durumlar', 'Anında yanıt'],
      action: 'Ara',
      primary: false,
      popular: false
    }
  ]

  const testimonialHighlights = [
    {
      text: "Emel hanımla çalışmak hayatımın dönüm noktası oldu.",
      author: "Ayşe K.",
      service: "Duygu Temizliği",
      rating: 5
    },
    {
      text: "Profesyonel yaklaşımı ve etkili teknikleri sayesinde kendimi yeniden keşfettim.",
      author: "Mehmet Y.",
      service: "Travma İyileştirme",
      rating: 5
    },
    {
      text: "Yaşam koçluğu seansları sayesinde hedeflerimi netleştirdim.",
      author: "Zeynep M.",
      service: "Yaşam Koçluğu",
      rating: 5
    }
  ]

  const guarantees = [
    {
      icon: Users,
      title: '3+ Yıl Deneyim',
      description: 'Alanında uzman ve deneyimli hizmet'
    },
    {
      icon: Star,
      title: '4.9/5 Puan',
      description: '50+ danışan değerlendirmesi'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main CTA */}
        <div className="text-center text-white mb-16">
          <Badge className="mb-6 bg-white/20 text-white border-white/30">
            Dönüşüm Zamanı
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Hayatınızı Değiştirmeye
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Hazır mısınız?
            </span>
          </h2>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
            100+ kişi gibi siz de yaşamınızda pozitif değişiklikler yaratabilirsiniz. 
            İlk adımı atmak için aşağıdaki seçeneklerden birini seçin.
          </p>
        </div>

        {/* CTA Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {ctaOptions.map((option, index) => {
            const IconComponent = option.icon
            return (
              <Card key={index} className={`relative overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${option.primary ? 'bg-white scale-105 ring-4 ring-white/50' : 'bg-white/95 backdrop-blur-sm'}`}>
                {option.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-2 text-sm font-semibold">
                    En Popüler Seçenek
                  </div>
                )}
                
                <CardContent className={`p-8 text-center ${option.popular ? 'pt-12' : 'pt-8'}`}>
                  <div className={`w-20 h-20 ${option.primary ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gradient-to-r from-gray-600 to-gray-700'} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{option.title}</h3>
                  <p className="text-purple-600 font-medium mb-4">{option.subtitle}</p>
                  <p className="text-gray-600 mb-6 leading-relaxed">{option.description}</p>

                  <div className="space-y-3 mb-8">
                    {option.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    size="lg" 
                    className={`w-full ${option.primary 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white' 
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                    } py-4 text-lg font-semibold`}
                  >
                    {option.action}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Testimonial Highlights */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Müşterilerimiz Ne Diyor?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialHighlights.map((testimonial, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
                <CardContent className="p-6 text-white text-center">
                  <div className="text-6xl mb-4 opacity-50">"</div>
                  <p className="text-lg leading-relaxed mb-4 italic">
                    {testimonial.text}
                  </p>
                  <div className="flex items-center justify-center space-x-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm opacity-80">{testimonial.service}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Guarantees */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {guarantees.map((guarantee, index) => {
              const IconComponent = guarantee.icon
              return (
                <div key={index} className="text-center text-white">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">{guarantee.title}</h4>
                  <p className="text-sm opacity-90">{guarantee.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Contact Information */}
        <Card className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-6">İletişim Bilgileri</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="flex items-center justify-center space-x-3">
              <Phone className="w-6 h-6" />
              <div>
                <div className="font-semibold">Telefon</div>
                <div className="text-sm opacity-90">{contactInfo.phone}</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3">
              <Mail className="w-6 h-6" />
              <div>
                <div className="font-semibold">E-posta</div>
                <div className="text-sm opacity-90">{contactInfo.email}</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3">
              <Clock className="w-6 h-6" />
              <div>
                <div className="font-semibold">Çalışma Saatleri</div>
                <div className="text-sm opacity-90">Pzt-Cum: {contactInfo.workingHours.weekdays}</div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-6">
            <p className="text-lg mb-6">
              Sorularınız için 24/7 WhatsApp destek hattımız aktif
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp ile Yaz
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Randevu Takvimi
              </Button>
            </div>
          </div>
        </Card>

        {/* Final Message */}
        <div className="text-center text-white mt-12">
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Dönüşüm yolculuğunuz bir tık uzağınızda. 
            <strong> İlk adımı atmak</strong> için yukarıdaki seçeneklerden birini seçin ve 
            <strong> yeni yaşamınıza</strong> merhaba deyin.
          </p>
        </div>
      </div>
    </section>
  )
}

export default ServicesCTA
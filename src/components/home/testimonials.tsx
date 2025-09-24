'use client'

import React, { useState, useEffect } from 'react'
import { Star, Quote, ChevronLeft, ChevronRight, Heart, CheckCircle, User } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const testimonials = [
    {
      id: 1,
      name: 'Ayşe K.',
      title: 'Öğretmen',
      rating: 5,
      content: 'Emel hanımla yaptığım duygu temizliği seansları hayatımı tamamen değiştirdi. Yıllardır taşıdığım olumsuz duygulardan kurtuldum ve kendimi çok daha huzurlu hissediyorum.',
      service: 'Duygu Temizliği',
      date: '2024-01-15',
      avatar: '👩‍🏫'
    },
    {
      id: 2,
      name: 'Mehmet Y.',
      title: 'Mühendis',
      rating: 5,
      content: 'Çocukluk travmalarım nedeniyle yaşadığım sorunlar için Emel hanıma başvurdum. Profesyonel yaklaşımı ve etkili teknikleri sayesinde kendimi yeniden keşfettim.',
      service: 'Travma İyileştirme',
      date: '2024-02-20',
      avatar: '👨‍💼'
    },
    {
      id: 3,
      name: 'Zeynep M.',
      title: 'Pazarlama Uzmanı',
      rating: 5,
      content: 'Yaşam koçluğu seansları sayesinde hedeflerimi netleştirdim ve kariyerimde büyük adımlar attım. Emel hanımın rehberliği paha biçilemez.',
      service: 'Yaşam Koçluğu',
      date: '2024-03-10',
      avatar: '👩‍💻'
    },
    {
      id: 4,
      name: 'Ali R.',
      title: 'Doktor',
      rating: 5,
      content: 'Holistik koçluk yaklaşımı ile sadece zihinsel değil, ruhsal olarak da büyük bir dönüşüm yaşadım. Kendimi daha dengeli ve mutlu hissediyorum.',
      service: 'Holistik Koçluk',
      date: '2024-03-25',
      avatar: '👨‍⚕️'
    },
    {
      id: 5,
      name: 'Fatma S.',
      title: 'Ev Hanımı',
      rating: 5,
      content: 'Online seanslar başlangıçta tereddüt etmeme neden olmuştu ama Emel hanımın sıcak yaklaşımı sayesinde çok rahat hissettim. Sonuçlar harika!',
      service: 'Online Seans',
      date: '2024-04-05',
      avatar: '👩‍🦳'
    },
    {
      id: 6,
      name: 'Can T.',
      title: 'Öğrenci',
      rating: 5,
      content: 'Sınav kaygım ve özgüven eksikliğim için aldığım seanslar sayesinde hem akademik hem de sosyal hayatımda büyük gelişmeler yaşadım.',
      service: 'Kişisel Gelişim',
      date: '2024-04-18',
      avatar: '👨‍🎓'
    }
  ]

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(nextTestimonial, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const currentTestimonial = testimonials[currentIndex]

  const stats = [
    { label: 'Toplam Değerlendirme', value: '200+' },
    { label: 'Ortalama Puan', value: '4.9/5' },
    { label: 'Tavsiye Oranı', value: '98%' }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-white to-purple-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            Müşteri Yorumları
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
              Müşterilerimiz Ne Diyor?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Duygu temizliği ve holistik koçluk hizmetlerimizden yararlanan
            müşterilerimizin gerçek deneyimleri
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 text-center bg-white hover:shadow-lg transition-shadow border border-gray-200">
              <div className="text-3xl font-bold text-purple-600 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Main Testimonial */}
        <div className="relative mb-16">
          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-white to-purple-50 border-2 border-purple-200 shadow-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-3">
                {/* Left - Avatar and Info */}
                <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-8 text-white flex flex-col justify-center items-center">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-4xl mb-4">
                    {currentTestimonial.avatar}
                  </div>
                  <h3 className="text-xl font-bold mb-1">{currentTestimonial.name}</h3>
                  <p className="text-purple-100 mb-4">{currentTestimonial.title}</p>

                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <Badge className="bg-white/20 text-white border-white/30">
                    {currentTestimonial.service}
                  </Badge>
                </div>

                {/* Right - Content */}
                <div className="md:col-span-2 p-8 flex flex-col justify-center">
                  <Quote className="w-12 h-12 text-purple-300 mb-6" />

                  <blockquote className="text-lg text-gray-700 leading-relaxed mb-6 italic">
                    "{currentTestimonial.content}"
                  </blockquote>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Doğrulanmış Müşteri</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(currentTestimonial.date).toLocaleDateString('tr-TR')}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-center space-x-4 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={prevTestimonial}
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
              className="w-12 h-12 rounded-full border-purple-300 text-purple-600 hover:bg-purple-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            {/* Dots */}
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${index === currentIndex ? 'bg-purple-600' : 'bg-purple-200'
                    }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={nextTestimonial}
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
              className="w-12 h-12 rounded-full border-purple-300 text-purple-600 hover:bg-purple-50"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* All Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {testimonials.slice(0, 6).map((testimonial) => (
            <Card key={testimonial.id} className="p-6 bg-white hover:shadow-lg transition-shadow border border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-lg">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.title}</p>
                </div>
              </div>

              <div className="flex items-center space-x-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                "{testimonial.content.substring(0, 120)}..."
              </p>

              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {testimonial.service}
                </Badge>
                <span className="text-xs text-gray-500">
                  {new Date(testimonial.date).toLocaleDateString('tr-TR')}
                </span>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">
            Siz de Dönüşüm Hikayenizi Yazmaya Hazır mısınız?
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Binlerce kişi gibi siz de yaşamınızda pozitif değişiklikler yaratabilirsiniz
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
              <User className="w-5 h-5 mr-2" />
              Tüm Yorumları Gör
            </Button>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 bg-green-50 border border-green-200 rounded-full px-6 py-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">Tüm yorumlar doğrulanmış müşterilerden gelir</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
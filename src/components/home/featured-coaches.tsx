'use client'

import React from 'react'
import Image from 'next/image'
import { Star, Award, Users, Heart, BookOpen, CheckCircle, ArrowRight, Quote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const FeaturedCoaches = () => {
  const achievements = [
    {
      icon: Users,
      number: '100+',
      label: 'Mutlu Müşteri',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Award,
      number: '8+',
      label: 'Yıl Deneyim',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      icon: Star,
      number: '4.9',
      label: 'Müşteri Puanı',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Heart,
      number: '95%',
      label: 'Başarı Oranı',
      color: 'from-pink-500 to-red-500'
    }
  ]

  const certifications = [
    'Duygu Temizliği Uzmanı Sertifikası',
    'Travma İyileştirme Sertifikası',
    'Yaşam Koçluğu Sertifikası',
    'Holistik Koçluk Sertifikası',
    'NLP Practitioner Sertifikası',
    'Mindfulness Eğitmeni Sertifikası'
  ]

  const specialties = [
    {
      title: 'Duygu Temizliği',
      description: 'Bilinçaltı travma temizliği ve olumsuz inanç değişimi',
      icon: Heart
    },
    {
      title: 'Travma İyileştirme',
      description: 'Çocukluk ve ilişki travmalarının güvenli işlenmesi',
      icon: Award
    },
    {
      title: 'Holistik Yaklaşım',
      description: 'Beden, zihin ve ruh bütünlüğü ile iyileşme',
      icon: Star
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            Uzman Profili
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
              Emel Yeşildere ile Tanışın
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Duygu temizliği ve travma iyileştirme konusunda uzman, 
            sertifikalı yaşam koçu ve holistik koç
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left - Image and Quote */}
          <div className="relative">
            <Card className="overflow-hidden shadow-2xl bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
              <CardContent className="p-0">
                {/* Profile Image Placeholder */}
                <div className="aspect-[4/5] bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex items-center justify-center relative">
                  <div className="w-32 h-32 bg-white/80 rounded-full flex items-center justify-center shadow-lg">
                    <Users className="w-16 h-16 text-purple-600" />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Quote className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-gray-900">Emel Yeşildere</span>
                    </div>
                    <p className="text-sm text-gray-700 italic">
                      "Her bireyin içinde iyileşme gücü vardır. Ben sadece o gücü ortaya çıkarmanıza yardımcı oluyorum."
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Floating Achievement Cards */}
            <div className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-lg border border-blue-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">4.9/5</div>
                  <div className="text-xs text-gray-600">200+ Değerlendirme</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-lg border border-purple-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">100+</div>
                  <div className="text-xs text-gray-600">Başarılı Seans</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="space-y-8">
            {/* Bio */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Hakkımda</h3>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  8 yılı aşkın süredir duygu temizliği ve travma iyileştirme alanında çalışıyorum. 
                  Binlerce kişinin yaşamında olumlu değişiklikler yaratmanın mutluluğunu yaşadım.
                </p>
                <p>
                  Holistik yaklaşımımla, sadece semptomları değil, sorunların kök nedenlerini 
                  ele alarak kalıcı çözümler sunuyorum. Her bireyin benzersiz olduğuna inanıyor 
                  ve bu doğrultuda kişiye özel tedavi planları oluşturuyorum.
                </p>
                <p>
                  Amacım, insanların içlerindeki iyileşme gücünü keşfetmelerine yardımcı olmak 
                  ve onları daha mutlu, huzurlu bir yaşama kavuşturmaktır.
                </p>
              </div>
            </div>

            {/* Specialties */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Uzmanlık Alanlarım</h3>
              <div className="space-y-4">
                {specialties.map((specialty, index) => {
                  const IconComponent = specialty.icon
                  return (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{specialty.title}</h4>
                        <p className="text-sm text-gray-600">{specialty.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Heart className="w-5 h-5 mr-2" />
                Benimle Çalış
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg">
                <BookOpen className="w-5 h-5 mr-2" />
                Daha Fazla Bilgi
              </Button>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {achievements.map((achievement, index) => {
            const IconComponent = achievement.icon
            return (
              <Card key={index} className="p-6 text-center bg-white hover:shadow-lg transition-shadow border border-gray-200">
                <div className={`w-16 h-16 bg-gradient-to-r ${achievement.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{achievement.number}</div>
                <div className="text-sm text-gray-600">{achievement.label}</div>
              </Card>
            )
          })}
        </div>

        {/* Certifications */}
        <Card className="p-8 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Sertifikalar ve Eğitimler</h3>
            <p className="text-gray-600">Sürekli gelişim ve uzmanlaşma</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certifications.map((cert, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{cert}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
              <Award className="w-4 h-4 mr-2" />
              Tüm Sertifikaları Gör
            </Button>
          </div>
        </Card>

        {/* Personal Touch */}
        <div className="text-center mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
          <div className="max-w-3xl mx-auto">
            <Quote className="w-12 h-12 mx-auto mb-6 opacity-80" />
            <blockquote className="text-2xl font-medium mb-6 italic">
              "İyileşme bir yolculuktur ve bu yolculukta yalnız değilsiniz. 
              Her adımda yanınızda olacağım ve birlikte dönüşümünüzü gerçekleştireceğiz."
            </blockquote>
            <div className="text-lg opacity-90">
              — Emel Yeşildere
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedCoaches
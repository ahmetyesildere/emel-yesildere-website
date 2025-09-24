'use client'

import React from 'react'
import { Heart, Star, Users, Award, ArrowRight, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const AboutHero = () => {
  return (
    <section className="relative py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                Uzman Profili
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
                  Merhaba, Ben
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Emel Yeşildere
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                8 yılı aşkın süredir duygu temizliği ve travma iyileştirme alanında çalışan, 
                sertifikalı yaşam koçu ve holistik koçum. Amacım, insanların içlerindeki 
                iyileşme gücünü keşfetmelerine yardımcı olmak.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white/80 rounded-lg border border-purple-200">
                <div className="text-2xl font-bold text-purple-600">500+</div>
                <div className="text-sm text-gray-600">Mutlu Müşteri</div>
              </div>
              <div className="text-center p-4 bg-white/80 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">8+</div>
                <div className="text-sm text-gray-600">Yıl Deneyim</div>
              </div>
              <div className="text-center p-4 bg-white/80 rounded-lg border border-pink-200">
                <div className="text-2xl font-bold text-pink-600">12</div>
                <div className="text-sm text-gray-600">Sertifika</div>
              </div>
              <div className="text-center p-4 bg-white/80 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-600">4.9</div>
                <div className="text-sm text-gray-600">Puan</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold"
              >
                <Heart className="w-5 h-5 mr-2" />
                Benimle Çalış
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 px-8 py-4 rounded-full text-lg font-semibold"
              >
                <Users className="w-5 h-5 mr-2" />
                İletişime Geç
              </Button>
            </div>
          </div>

          {/* Right Content - Profile Image */}
          <div className="relative">
            <Card className="overflow-hidden shadow-2xl bg-gradient-to-br from-white/80 to-purple-50/80 backdrop-blur-sm border-2 border-white/50">
              <div className="aspect-[4/5] relative">
                {/* Profile Image Placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex items-center justify-center">
                  <div className="w-40 h-40 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                    <Users className="w-20 h-20 text-purple-600" />
                  </div>
                </div>

                {/* Overlay Quote */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-6 border border-white/50">
                  <Quote className="w-6 h-6 text-purple-600 mb-3" />
                  <p className="text-gray-700 italic leading-relaxed">
                    "Her bireyin içinde iyileşme gücü vardır. Ben sadece o gücü ortaya çıkarmanıza yardımcı oluyorum."
                  </p>
                  <div className="mt-3 font-semibold text-purple-700">— Emel Yeşildere</div>
                </div>
              </div>
            </Card>

            {/* Floating Elements */}
            <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <Heart className="w-8 h-8 text-white" />
            </div>
            
            <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <Award className="w-10 h-10 text-white" />
            </div>

            <div className="absolute top-1/4 -right-4 bg-white/90 rounded-2xl p-4 shadow-lg border border-purple-200">
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-700">4.9/5</span>
              </div>
              <div className="text-xs text-gray-600 mt-1">200+ Değerlendirme</div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Mission Statement */}
        <div className="mt-20 text-center">
          <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-white/80 to-purple-50/80 backdrop-blur-sm border-2 border-white/50">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Misyonum</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              İnsanların bilinçaltlarında biriken olumsuz duyguları temizleyerek, 
              travmalarını iyileştirmelerine ve potansiyellerini keşfetmelerine yardımcı olmak. 
              Her bireyin benzersiz olduğuna inanıyor ve bu doğrultuda kişiye özel yaklaşımlar geliştiriyorum.
            </p>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default AboutHero
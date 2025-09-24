'use client'

import React, { useState } from 'react'
import { Play, ArrowRight, Heart, Star, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const HeroSection = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-pink-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-purple-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gray-700">Online Seanslar Aktif</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
                  Duygu Temizliği ile
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  İçsel Huzura
                </span>
                <br />
                <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
                  Ulaşın
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Bilinçaltınızda biriken olumsuz duyguları temizleyerek, 
                travmalarınızı iyileştirin ve yaşamınızı dönüştürün.
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">500+</div>
                <div className="text-sm text-gray-600">Mutlu Müşteri</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">8+</div>
                <div className="text-sm text-gray-600">Yıl Deneyim</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">95%</div>
                <div className="text-sm text-gray-600">Başarı Oranı</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Heart className="w-5 h-5 mr-2" />
                Ücretsiz Ön Görüşme
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 px-8 py-4 rounded-full text-lg font-semibold"
              >
                <Users className="w-5 h-5 mr-2" />
                Hizmetleri Keşfet
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 pt-4">
              <div className="flex items-center space-x-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">4.9/5 (200+ değerlendirme)</span>
              </div>
            </div>
          </div>

          {/* Right Content - Video Section */}
          <div className="relative">
            <Card className="relative overflow-hidden rounded-3xl shadow-2xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="aspect-video relative">
                {!isVideoPlaying ? (
                  <>
                    {/* Video Thumbnail */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center mx-auto shadow-lg hover:shadow-xl transition-shadow cursor-pointer group"
                             onClick={() => setIsVideoPlaying(true)}>
                          <Play className="w-8 h-8 text-purple-600 ml-1 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="text-white">
                          <h3 className="text-xl font-semibold mb-2">Emel Yeşildere ile Tanışın</h3>
                          <p className="text-white/80">Duygu temizliği yolculuğunuzu keşfedin</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Decorative Elements */}
                    <div className="absolute top-4 right-4 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute bottom-4 left-4 bg-white/90 rounded-full px-3 py-1">
                      <span className="text-sm font-medium text-purple-700">3 dakika</span>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 bg-black flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4" />
                      <p>Video yükleniyor...</p>
                      <p className="text-sm text-gray-300 mt-2">
                        Gerçek videoda Emel Yeşildere'nin tanıtım videosu olacak
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Floating Elements */}
            <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <Heart className="w-6 h-6 text-white" />
            </div>
            
            <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <Star className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Bottom Section - Quick Info */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-white/80 backdrop-blur-sm border border-purple-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Duygu Temizliği</h3>
                <p className="text-sm text-gray-600">Bilinçaltı travma temizliği</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm border border-purple-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Holistik Koçluk</h3>
                <p className="text-sm text-gray-600">Bütüncül yaşam dönüşümü</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm border border-purple-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Kişisel Gelişim</h3>
                <p className="text-sm text-gray-600">Potansiyelinizi keşfedin</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
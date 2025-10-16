'use client'

import React, { useState } from 'react'
import { Play, ArrowRight, Heart, Star, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import WhatsAppButton from '@/components/ui/whatsapp-button'
import { useVideoContent } from '@/hooks/use-video-content'

const HeroSection = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const { videoContent } = useVideoContent()

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-16 items-center max-w-7xl mx-auto">
          {/* Sol Taraf - Video Kartı */}
          <div className="relative order-2 lg:order-1">
            <div className="relative group">
              {/* Organic Shape Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100 rounded-[3rem] rotate-3 scale-105 opacity-60 z-0"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-blue-100 via-purple-50 to-pink-100 rounded-[3rem] -rotate-2 scale-110 opacity-40 z-0"></div>
              
              {/* Main Video Container */}
              <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl transform group-hover:scale-105 transition-transform duration-500">
                <div className="aspect-[4/3] relative min-h-[400px] lg:min-h-[500px]">
                  {!isVideoPlaying ? (
                    <>
                      {/* Video Thumbnail */}
                      <div 
                        className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center"
                        style={{
                          backgroundImage: videoContent.thumbnailUrl ? `url(${videoContent.thumbnailUrl})` : undefined,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      >
                        {videoContent.thumbnailUrl && (
                          <div className="absolute inset-0 bg-black/30" />
                        )}
                        <div className="text-center space-y-4 relative z-10">
                          <div 
                            className="w-28 h-28 bg-white/90 rounded-full flex items-center justify-center mx-auto shadow-lg hover:shadow-xl transition-shadow cursor-pointer group"
                            onClick={() => {
                              if (videoContent.videoUrl && videoContent.isActive) {
                                setIsVideoPlaying(true)
                              }
                            }}
                          >
                            <Play className="w-12 h-12 text-purple-600 ml-1 group-hover:scale-110 transition-transform" />
                          </div>
                          <div className="text-white">
                            <h3 className="text-2xl font-bold mb-3">
                              {videoContent.title || 'Emel Yeşildere ile Tanışın'}
                            </h3>
                            <p className="text-lg text-white/90">
                              {videoContent.description || 'Duygu temizliği yolculuğunuzu keşfedin'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Bottom Quote Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 z-20">
                        <div className="text-white">
                          <p className="text-sm italic leading-relaxed opacity-90">
                            "Gerçek dönüşüm, kalpten bağlantıyla mümkün."
                          </p>
                          <div className="mt-2 text-xs font-medium text-purple-200">— Emel Yeşildere</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-black flex items-center justify-center">
                      {videoContent.videoUrl && videoContent.isActive ? (
                        <video 
                          controls 
                          autoPlay
                          className="w-full h-full object-cover"
                          onEnded={() => setIsVideoPlaying(false)}
                        >
                          <source src={videoContent.videoUrl} type="video/mp4" />
                          Tarayıcınız video oynatmayı desteklemiyor.
                        </video>
                      ) : (
                        <div className="text-white text-center">
                          <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4" />
                          <p>Video yükleniyor...</p>
                          <p className="text-sm text-gray-300 mt-2">
                            Admin panelinden video yükleyebilirsiniz
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>


            </div>
          </div>

          {/* Sağ Taraf - Metin İçeriği */}
          <div className="space-y-8 order-1 lg:order-2 relative z-40">
            <div className="space-y-6">
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                Online Seanslar Aktif
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
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

              <p className="text-xl text-gray-600 leading-relaxed">
                Bilinçaltınızda biriken olumsuz duyguları temizleyerek, 
                travmalarınızı iyileştirin ve yaşamınızı dönüştürün.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white/80 rounded-lg border border-purple-200">
                <div className="text-2xl font-bold text-blue-600">3+</div>
                <div className="text-sm text-gray-600">Yıl Deneyim</div>
              </div>
              <div className="text-center p-4 bg-white/80 rounded-lg border border-purple-200">
                <div className="text-2xl font-bold text-purple-600">100+</div>
                <div className="text-sm text-gray-600">Mutlu Müşteri</div>
              </div>
              <div className="text-center p-4 bg-white/80 rounded-lg border border-pink-200">
                <div className="text-2xl font-bold text-pink-600">4.9</div>
                <div className="text-sm text-gray-600">Puan</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <WhatsAppButton
                templateType="consultation"
                size="lg"
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-full text-lg font-bold w-full sm:w-auto border-0 shadow-xl hover:shadow-2xl"
                showStatus={true}
              >
                🎯 Ücretsiz Ön Görüşme
              </WhatsAppButton>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 px-8 py-4 rounded-full text-lg font-semibold w-full sm:w-auto"
              >
                <Users className="w-5 h-5 mr-2" />
                Hizmetleri Keşfet
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
'use client'

import React, { useState } from 'react'
import { Play, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import WhatsAppButton from '@/components/ui/whatsapp-button'
import { useVideoContent } from '@/hooks/use-video-content'

const HeroSection = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false)
  const [playClicked, setPlayClicked] = useState(false)
  const { videoContent } = useVideoContent()
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const [mounted, setMounted] = React.useState(false)
  
  // Client-side mount kontrolü
  React.useEffect(() => {
    setMounted(true)
  }, [])
  
  // Thumbnail ve video URL'lerini al (boş string kontrolü yap)
  const thumbnailUrl = mounted && videoContent.thumbnailUrl && videoContent.thumbnailUrl.trim() !== '' 
    ? videoContent.thumbnailUrl 
    : '/media/images/thumbnail-1762982413119.png'
  
  const videoUrl = mounted && videoContent.videoUrl && videoContent.videoUrl.trim() !== '' 
    ? videoContent.videoUrl 
    : '/media/videos/C5881.mp4'
  
  // Debug için log
  React.useEffect(() => {
    if (mounted) {
      console.log('🎬 Hero Section Video Content:', {
        thumbnailUrl: videoContent.thumbnailUrl,
        videoUrl: videoContent.videoUrl,
        usedThumbnail: thumbnailUrl,
        usedVideo: videoUrl
      })
    }
  }, [mounted, videoContent.thumbnailUrl, videoContent.videoUrl, thumbnailUrl, videoUrl])

  const handlePlayClick = () => {
    if (videoUrl && videoContent.isActive) {
      setPlayClicked(true)
      
      // Önce video player'ı göster (arka planda)
      setTimeout(() => {
        setIsVideoPlaying(true)
        // Video'yu preload et ve oynat
        if (videoRef.current) {
          videoRef.current.load()
          videoRef.current.play().catch(err => console.log('Video play error:', err))
        }
      }, 400) // Ripple efekti için kısa gecikme
      
      // Not: Thumbnail artık video başladıktan 1.5 saniye sonra onPlaying event'inde kaldırılacak
    }
  }

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6 lg:gap-10 items-center max-w-7xl mx-auto">
          {/* Sol Taraf - Video Kartı */}
          <div className="relative order-2 lg:order-1 w-full">
            <div className="relative group">
              {/* Organic Shape Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100 rounded-2xl sm:rounded-[3rem] rotate-3 scale-105 opacity-60 z-0"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-blue-100 via-purple-50 to-pink-100 rounded-2xl sm:rounded-[3rem] -rotate-2 scale-110 opacity-40 z-0"></div>
              
              {/* Main Video Container */}
              <div className="relative z-10 rounded-2xl sm:rounded-[2.5rem] overflow-hidden shadow-2xl transform group-hover:scale-105 transition-transform duration-500 max-w-[750px] mx-auto lg:mx-0">
                <div className="aspect-[750/440] relative min-h-[280px] sm:min-h-[440px]">
                  {/* Thumbnail Preload */}
                  {mounted && (
                    <img 
                      key={thumbnailUrl}
                      src={thumbnailUrl} 
                      alt="Video thumbnail"
                      className="hidden"
                      onLoad={() => {
                        console.log('✅ Thumbnail yüklendi:', thumbnailUrl)
                        setThumbnailLoaded(true)
                      }}
                      onError={(e) => {
                        console.error('❌ Thumbnail yükleme hatası:', thumbnailUrl)
                        setThumbnailLoaded(true)
                      }}
                    />
                  )}

                  {/* Video Thumbnail - Video başladıktan 1.5 saniye sonra DOM'dan kaldırılır */}
                  {!(isVideoPlaying && videoReady) && (
                    <div 
                      className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-out ${
                        isVideoPlaying 
                          ? 'opacity-0 scale-110' 
                          : 'opacity-100 scale-100'
                      }`}
                    >
                      {/* Loading state for thumbnail */}
                      {!thumbnailLoaded && (
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/40 to-blue-600/40 flex items-center justify-center">
                          <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full" />
                        </div>
                      )}

                      {/* Thumbnail Image - Video ile aynı object-fit kullan */}
                      {thumbnailLoaded && (
                        <>
                          <img 
                            src={thumbnailUrl}
                            alt="Video thumbnail"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20" />
                          {/* Dark Overlay */}
                          <div className="absolute inset-0 bg-black/30" />
                        </>
                      )}
                      
                      <div className={`text-center space-y-3 sm:space-y-4 relative z-10 px-4 transition-all duration-700 ${
                        isVideoPlaying ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
                      }`}>
                        <div className="relative inline-block">
                          {/* Ripple Effect */}
                          {playClicked && !videoReady && (
                            <>
                              <div className="absolute inset-0 w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-purple-400/30 rounded-full animate-ping" />
                              <div className="absolute inset-0 w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-purple-400/20 rounded-full animate-pulse" />
                            </>
                          )}
                          
                          <div 
                            className={`w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-white/90 rounded-full flex items-center justify-center mx-auto shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group hover:scale-110 active:scale-95 relative ${
                              playClicked ? 'ring-4 ring-purple-400/50' : ''
                            }`}
                            onClick={handlePlayClick}
                          >
                            <Play className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-purple-600 ml-1 group-hover:scale-110 transition-transform" />
                          </div>
                        </div>
                        <div className="text-white">
                          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3 transition-all duration-500">
                            {videoContent.title || 'Emel Yeşildere ile Tanışın'}
                          </h3>
                          <p className="text-sm sm:text-base lg:text-lg text-white/90 transition-all duration-500">
                            {videoContent.description || 'Duygu temizliği yolculuğunuzu keşfedin'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Bottom Quote Overlay */}
                  <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 sm:p-4 lg:p-6 z-20 transition-all duration-1000 ${
                    isVideoPlaying && videoReady 
                      ? 'opacity-0 translate-y-4 pointer-events-none' 
                      : 'opacity-100 translate-y-0'
                  }`}>
                    <div className="text-white">
                      <p className="text-xs sm:text-sm italic leading-relaxed opacity-90">
                        "Gerçek dönüşüm, kalpten bağlantıyla mümkün."
                      </p>
                      <div className="mt-1 sm:mt-2 text-xs font-medium text-purple-200">— Emel Yeşildere</div>
                    </div>
                  </div>

                  {/* Video Player */}
                  {isVideoPlaying && (
                    <div className={`absolute inset-0 bg-black transition-all duration-1000 ${
                      videoReady ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}>
                      {videoUrl && videoContent.isActive ? (
                        <>
                          {/* Loading spinner - video başlayana kadar göster */}
                          {!videoReady && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10 animate-in fade-in duration-300">
                              <div className="text-white text-center">
                                <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4" />
                                <p className="animate-pulse">Video yükleniyor...</p>
                              </div>
                            </div>
                          )}
                          
                          <video 
                            ref={videoRef}
                            controls 
                            autoPlay
                            preload="auto"
                            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
                              videoReady ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                            }`}
                            onLoadedData={() => {
                              console.log('✅ Video yüklendi ve oynatılmaya hazır')
                            }}
                            onCanPlay={() => {
                              console.log('✅ Video oynatılabilir')
                            }}
                            onPlaying={() => {
                              console.log('▶️ Video oynatılıyor')
                              // Video başladıktan 1.5 saniye sonra thumbnail'i kaldır
                              setTimeout(() => {
                                setVideoReady(true)
                                console.log('✅ Thumbnail kaldırıldı (video başladıktan 1.5 sn sonra)')
                              }, 1500)
                            }}
                            onEnded={() => {
                              setVideoReady(false)
                              setTimeout(() => {
                                setIsVideoPlaying(false)
                                setPlayClicked(false)
                              }, 800) // Smooth fade out için gecikme
                            }}
                            onError={(e) => {
                              console.error('❌ Video yükleme hatası:', e)
                              setVideoReady(false)
                              setTimeout(() => {
                                setIsVideoPlaying(false)
                                setPlayClicked(false)
                              }, 800)
                            }}
                          >
                            <source src={videoUrl} type="video/mp4" />
                            Tarayıcınız video oynatmayı desteklemiyor.
                          </video>
                        </>
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
          <div className="space-y-6 lg:space-y-7 order-1 lg:order-2 relative z-40">
            <div className="space-y-4 lg:space-y-5">
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm">
                Online Seanslar Aktif
              </Badge>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
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

              <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
                Bilinçaltınızda biriken olumsuz duyguları temizleyerek, 
                travmalarınızı iyileştirin ve yaşamınızı dönüştürün.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 lg:gap-4">
              <div className="text-center p-3 lg:p-4 bg-white/80 rounded-lg border border-purple-200">
                <div className="text-xl lg:text-2xl font-bold text-blue-600">3+</div>
                <div className="text-xs lg:text-sm text-gray-600">Yıl Deneyim</div>
              </div>
              <div className="text-center p-3 lg:p-4 bg-white/80 rounded-lg border border-purple-200">
                <div className="text-xl lg:text-2xl font-bold text-purple-600">100+</div>
                <div className="text-xs lg:text-sm text-gray-600">Mutlu Müşteri</div>
              </div>
              <div className="text-center p-3 lg:p-4 bg-white/80 rounded-lg border border-pink-200">
                <div className="text-xl lg:text-2xl font-bold text-pink-600">4.9</div>
                <div className="text-xs lg:text-sm text-gray-600">Puan</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
              <WhatsAppButton
                templateType="consultation"
                size="lg"
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-5 lg:px-7 py-3 lg:py-4 rounded-full text-base lg:text-lg font-bold w-full sm:w-auto border-0 shadow-xl hover:shadow-2xl"
                showStatus={true}
              >
                🎯 Ücretsiz Ön Görüşme
              </WhatsAppButton>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 px-5 lg:px-7 py-3 lg:py-4 rounded-full text-base lg:text-lg font-semibold w-full sm:w-auto"
                onClick={() => {
                  window.location.href = '/hizmetlerimiz'
                }}
              >
                <Users className="w-4 lg:w-5 h-4 lg:h-5 mr-2" />
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
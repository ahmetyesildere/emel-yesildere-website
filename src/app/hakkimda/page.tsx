'use client'

import { Heart, Users, Award, ArrowRight, Star, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAboutInfo } from '@/hooks/use-about-info'
import Link from 'next/link'
import Image from 'next/image'
function AboutContent() {
  const { aboutInfo } = useAboutInfo()
  
  // Debug için
  console.log('AboutInfo:', aboutInfo)
  console.log('Photo URL:', aboutInfo.photo)
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section with Photo */}
      <section className="py-20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Left - Photo Section */}
            <div className="relative order-2 lg:order-1">
              <div className="relative group">
                {/* Organic Shape Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100 rounded-[3rem] rotate-3 scale-105 opacity-60 z-0"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-blue-100 via-purple-50 to-pink-100 rounded-[3rem] -rotate-2 scale-110 opacity-40 z-0"></div>
                
                {/* Main Photo Container */}
                <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl transform group-hover:scale-105 transition-transform duration-500">
                  <div className="aspect-[4/5] relative">
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-blue-900/10 z-10"></div>
                    
                    {aboutInfo.photo ? (
                      aboutInfo.photo.startsWith('data:') ? (
                        // Base64 image için img tag kullan
                        <img
                          src={aboutInfo.photo}
                          alt={`${aboutInfo.name} - ${aboutInfo.title}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        // Normal URL için Next.js Image kullan
                        <Image
                          src={aboutInfo.photo}
                          alt={`${aboutInfo.name} - ${aboutInfo.title}`}
                          fill
                          className="object-cover"
                          priority
                        />
                      )
                    ) : (
                      // Fallback image
                      <Image
                        src="/images/emel-profile.jpg"
                        alt={`${aboutInfo.name} - ${aboutInfo.title}`}
                        fill
                        className="object-cover"
                        priority
                      />
                    )}
                    
                    {/* Bottom Quote Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 z-20">
                      <div className="text-white">
                        <Quote className="w-5 h-5 text-purple-300 mb-2" />
                        <p className="text-sm italic leading-relaxed opacity-90">
                          "Gerçek dönüşüm, kalpten bağlantıyla mümkün."
                        </p>
                        <div className="mt-2 text-xs font-medium text-purple-200">— {aboutInfo.name}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Decorative Elements */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-2xl rotate-12 flex items-center justify-center shadow-lg animate-float z-30">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg animate-pulse z-30">
                  <Award className="w-8 h-8 text-white" />
                </div>

                {/* Experience Badge */}
                <div className="absolute top-6 -right-6 bg-white rounded-2xl p-3 shadow-xl border border-purple-100 transform rotate-6 z-30">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{aboutInfo.experience}</div>
                    <div className="text-xs text-gray-600 font-medium">Yıl Deneyim</div>
                  </div>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-1/3 -left-6 bg-white rounded-2xl p-3 shadow-xl border border-blue-100 transform -rotate-6 z-30">
                  <div className="flex items-center space-x-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{aboutInfo.rating}</div>
                    <div className="text-xs text-gray-600">{aboutInfo.clientCount} Müşteri</div>
                  </div>
                </div>

                {/* Decorative Dots */}
                <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-purple-400 rounded-full animate-ping z-20"></div>
                <div className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-blue-400 rounded-full animate-pulse z-20"></div>
                <div className="absolute top-3/4 right-1/3 w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce z-20"></div>
              </div>
            </div>

            {/* Right - Content Section */}
            <div className="space-y-8 order-1 lg:order-2 relative z-40">
              <div className="space-y-6">
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  Uzman Profili
                </Badge>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
                    Merhaba, Ben
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {aboutInfo.name}
                  </span>
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed">
                  {aboutInfo.description}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white/80 rounded-lg border border-purple-200">
                  <div className="text-2xl font-bold text-blue-600">{aboutInfo.experience}</div>
                  <div className="text-sm text-gray-600">Yıl Deneyim</div>
                </div>
                <div className="text-center p-4 bg-white/80 rounded-lg border border-purple-200">
                  <div className="text-2xl font-bold text-purple-600">{aboutInfo.clientCount}</div>
                  <div className="text-sm text-gray-600">Mutlu Müşteri</div>
                </div>
                <div className="text-center p-4 bg-white/80 rounded-lg border border-pink-200">
                  <div className="text-2xl font-bold text-pink-600">{aboutInfo.rating}</div>
                  <div className="text-sm text-gray-600">Puan</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/iletisim">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold w-full sm:w-auto"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Benimle Çalış
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                
                <Link href="/hizmetlerimiz">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 px-8 py-4 rounded-full text-lg font-semibold w-full sm:w-auto"
                  >
                    <Users className="w-5 h-5 mr-2" />
                    Hizmetlerimi İncele
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Mission Statement */}
          <div className="mt-20 text-center">
            <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-white/80 to-purple-50/80 backdrop-blur-sm border-2 border-white/50">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Misyonum</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Benim için bu yolculuk, yalnızca bir meslek değil — aynı zamanda kendi içsel uyanışımın, 
                farkındalıkla geçen yıllarımın ve çok sayıda dönüşüm hikâyesinin bir yansıması. 
                Her bireyin içinde taşıdığı potansiyele ulaşmasına rehberlik ediyorum.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Hikayem</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>{aboutInfo.story}</p>
              </div>
            </Card>

            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Ne Yapıyorum?</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Çalışmalarımda bilinçaltı kalıpları dönüştürmek, duygusal yükleri serbest bırakmak, 
                  nefes farkındalığıyla bedeni ve zihni dengelemek, holistik (bütünsel) bakış açısıyla 
                  yaşamın tüm alanlarına temas etmek gibi çok yönlü yöntemler kullanıyorum.
                </p>
                <p>
                  Kullandığım teknikler arasında; nefes çalışmaları, meditasyon, içsel çocuk terapisi, 
                  kök inanç dönüşümü ve bireysel koçluk seansları yer alıyor.
                </p>
              </div>
            </Card>

            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Hangi Sonuçlara Ulaşıyoruz?</h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>Birlikte çalıştığım danışanlar genellikle:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Tekrarlayan döngülerin nedenlerini fark ediyor</li>
                  <li>Öz güvenlerini yeniden inşa ediyor</li>
                  <li>Duygusal olarak hafifliyor</li>
                  <li>Daha net kararlar alabiliyor</li>
                  <li>Yaşamlarında kendi merkezlerine dönüyorlar</li>
                </ul>
                <p className="mt-4 font-medium text-purple-700">
                  Tüm bu süreçte amacım, sana yargısız bir alan sunmak ve içsel rehberliğini bulman için destek olmak.
                </p>
              </div>
            </Card>

            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Yaklaşımım</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>{aboutInfo.approach}</p>
              </div>
            </Card>

            {aboutInfo.journey && (
              <Card className="p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Yolculuğum</h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>{aboutInfo.journey}</p>
                </div>
              </Card>
            )}

            {aboutInfo.passion && (
              <Card className="p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Tutkum</h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>{aboutInfo.passion}</p>
                </div>
              </Card>
            )}

            <Card className="p-8 mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <h2 className="text-2xl font-bold text-purple-900 mb-6">Sen de Hazırsan...</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Eğer artık eski kalıplarını geride bırakmak, kendine daha derin bir bağ kurmak ve 
                  yaşamında fark yaratmak istiyorsan, birlikte çalışabiliriz.
                </p>
                <p className="text-lg font-medium text-purple-700">
                  Unutma, bazen hayatı değiştirmek için tek gereken şey… <em>Gerçekten duyulmak.</em>
                </p>
                <p className="text-lg font-semibold text-purple-800">
                  Ben seni duymak ve sana alan tutmak için buradayım.
                </p>
                <p className="text-right text-purple-600 font-medium mt-6">
                  Sevgiyle,<br />
                  <span className="text-xl">{aboutInfo.name}</span>
                </p>
              </div>
            </Card>


          </div>
        </div>
      </section>
    </div>
  )
}

export default function AboutPage() {
  return <AboutContent />
}
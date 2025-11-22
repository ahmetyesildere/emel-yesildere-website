'use client'

import React, { useState, useEffect } from 'react'
import { Heart, Brain, Compass, Sparkles, ChevronDown, ChevronUp, Play, CheckCircle, Clock, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const ServiceDetails = () => {
  const [activeService, setActiveService] = useState('yasam-koclugu')
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)

  // URL hash'ini dinle ve aktif hizmeti güncelle
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash && services.find(s => s.id === hash)) {
        setActiveService(hash)
      }
    }

    // Sayfa yüklendiğinde hash'i kontrol et
    handleHashChange()

    // Hash değişikliklerini dinle
    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  const services = [
    {
      id: 'yasam-koclugu',
      icon: Compass,
      title: 'Yaşam Koçluğu',
      color: 'from-blue-500 to-cyan-500',
      description: 'Yaşam hedeflerinizi netleştirmeniz ve bu hedeflere ulaşmanız için rehberlik ediyoruz.',
      detailedDescription: `
        Yaşam koçluğu, kişinin potansiyelini keşfetmesi ve yaşam hedeflerine ulaşması için verilen profesyonel destektir. 
        
        Yaşam koçluğu, geçmişe odaklanmak yerine şimdiki zamanda durumu değerlendirip 
        geleceğe yönelik eylem planları oluşturmaya odaklanır.
      `,
      process: [
        'Mevcut durum analizi',
        'Değerler ve önceliklerin belirlenmesi',
        'SMART hedeflerin oluşturulması',
        'Eylem planının hazırlanması',
        'İlerlemenin takibi ve desteklenmesi'
      ],
      benefits: [
        'Net hedef belirleme',
        'Motivasyon artışı',
        'Zaman yönetimi becerileri',
        'Özgüven gelişimi',
        'Yaşam-iş dengesi',
        'Kişisel tatmin artışı'
      ],
      whoCanBenefit: [
        'Hedef belirlemek isteyenler',
        'Kariyer değişimi düşünenler',
        'Motivasyon sorunu yaşayanlar',
        'Yaşam dengesi arayanlar',
        'Kişisel gelişim isteyenler',
        'Potansiyelini keşfetmek isteyenler'
      ],
      duration: '60 dakika',
      sessions: '4-6 seans',
      faqs: [
        {
          question: 'Yaşam koçluğu terapiden farkı nedir?',
          answer: 'Yaşam koçluğu geleceğe odaklanır ve hedef belirlemeye yardımcı olur. Terapi ise geçmiş sorunları ele alır.'
        },
        {
          question: 'Hangi yaşta yaşam koçluğu alınabilir?',
          answer: '18 yaş üstü herkese uygun. Özellikle yaşam geçişlerinde (kariyer, ilişki, yaş) çok faydalıdır.'
        },
        {
          question: 'Sonuçları ne kadar sürede görürüm?',
          answer: 'İlk seanslardan itibaren netlik ve motivasyon artışı hissedilir. Kalıcı değişimler 4-6 seans sonrası görülür.'
        }
      ]
    },
    {
      id: 'holistik-kocluk',
      icon: Sparkles,
      title: 'Holistik Koçluk',
      color: 'from-emerald-500 to-teal-500',
      popular: false,
      description: 'Beden, zihin ve ruh bütünlüğü içinde kişisel dönüşümünüzü destekliyoruz.',
      detailedDescription: `
        Holistik koçluk, kişiyi beden, zihin ve ruh bütünlüğü içinde ele alan kapsamlı bir yaklaşımdır. 
        
        Bu yaklaşım, sadece zihinsel değil, enerjisel ve ruhsal boyutları da içerir. 
        Kişinin tüm varlık düzeylerinde dengeyi sağlamayı hedefler.
      `,
      process: [
        'Enerji durumunun değerlendirilmesi',
        'Chakra dengesizliklerinin tespiti',
        'Enerji temizliği ve dengeleme',
        'Meditasyon ve farkındalık çalışmaları',
        'Bütüncül yaşam planının oluşturulması'
      ],
      benefits: [
        'Enerji dengesinin sağlanması',
        'Chakra uyumlaması',
        'Ruhsal farkındalık artışı',
        'İç huzur ve denge',
        'Sezgisel yeteneklerin gelişimi',
        'Yaşam amacının netleşmesi'
      ],
      whoCanBenefit: [
        'Ruhsal gelişim isteyenler',
        'Enerji dengesizliği yaşayanlar',
        'Meditasyon öğrenmek isteyenler',
        'Yaşam amacını arayanlar',
        'Bütüncül iyileşme isteyenler',
        'Sezgisel gelişim arayanlar'
      ],
      duration: '60 dakika',
      sessions: '6-8 seans',
      faqs: [
        {
          question: 'Holistik koçluk bilimsel mi?',
          answer: 'Enerji çalışmaları binlerce yıllık geleneklere dayanır. Modern araştırmalar da enerji terapilerinin etkinliğini destekler.'
        },
        {
          question: 'Dini inançlarımla çelişir mi?',
          answer: 'Holistik koçluk herhangi bir dini inanç sistemi değildir. Tüm inançlarla uyumlu evrensel prensipleri kullanır.'
        },
        {
          question: 'Enerji hissedebilir miyim?',
          answer: 'Çoğu kişi ilk seanslardan itibaren enerji değişimlerini hisseder. Bu kişiden kişiye değişebilir.'
        }
      ]
    },
    {
      id: 'nefes-koclugu',
      icon: Brain,
      title: 'Nefes Koçluğu',
      color: 'from-purple-500 to-indigo-500',
      description: 'Nefes teknikleri ile stres yönetimi, rahatlama ve iç huzuru bulmanızı sağlıyoruz.',
      detailedDescription: `
        Nefes koçluğu, doğru nefes alma teknikleri ile stres yönetimi ve rahatlama sağlayan bir yaklaşımdır. 
        
        Nefes, yaşamın en temel fonksiyonudur ve doğru nefes alma teknikleri ile 
        fiziksel, zihinsel ve duygusal dengeyi sağlamak mümkündür.
      `,
      process: [
        'Mevcut nefes alışkanlıklarının değerlendirilmesi',
        'Doğru nefes tekniklerinin öğretilmesi',
        'Stres anlarında kullanılacak tekniklerin pratik edilmesi',
        'Günlük nefes rutinlerinin oluşturulması',
        'İlerlemenin takibi ve teknik gelişimi'
      ],
      benefits: [
        'Stres seviyesinin azalması',
        'Nefes tekniklerinin öğrenilmesi',
        'Meditasyon becerisinin gelişimi',
        'İç huzurun bulunması',
        'Uyku kalitesinin artması',
        'Genel sağlık durumunun iyileşmesi'
      ],
      whoCanBenefit: [
        'Stres yaşayanlar',
        'Nefes problemleri olanlar',
        'Rahatlama arayanlar',
        'Meditasyon öğrenmek isteyenler',
        'Uyku sorunu yaşayanlar',
        'Genel sağlığını iyileştirmek isteyenler'
      ],
      duration: '60 dakika',
      sessions: '4-6 seans',
      faqs: [
        {
          question: 'Nefes koçluğu kimler için uygun?',
          answer: 'Herkes için uygun. Özellikle stres, anksiyete ve uyku sorunları yaşayanlar için çok faydalıdır.'
        },
        {
          question: 'Nefes teknikleri öğrenmek zor mu?',
          answer: 'Hayır, basit tekniklerle başlanır ve kademeli olarak geliştirilir. Herkes kolayca öğrenebilir.'
        },
        {
          question: 'Günlük hayatta nasıl uygularım?',
          answer: 'Öğrenilen teknikler günlük rutinlere entegre edilir. 5-10 dakikalık pratikler bile etkili olur.'
        }
      ]
    },
    {
      id: 'bilincalti-temizligi',
      icon: Heart,
      title: 'Bilinçaltı Temizliği',
      color: 'from-red-500 to-pink-500',
      popular: true,
      description: 'Bilinçaltınızda biriken olumsuz duyguları tespit ederek güvenli bir şekilde temizliyoruz.',
      detailedDescription: `
        Bilinçaltı temizliği, bilinçaltımızda biriken olumsuz duyguların fark edilmesi ve serbest bırakılması sürecidir. 
        
        Travmatik yaşantılar, olumsuz deneyimler ve stresli durumlar bilinçaltımızda enerji blokajları oluşturur. 
        Bu blokajlar, günlük yaşamımızda çeşitli fiziksel ve duygusal belirtiler olarak kendini gösterir.
      `,
      process: [
        'Duygusal durumun değerlendirilmesi',
        'Travmatik anıların tespiti',
        'EFT tekniği ile enerji noktalarına dokunma',
        'Olumsuz duyguların serbest bırakılması',
        'Pozitif programlamanın yerleştirilmesi'
      ],
      benefits: [
        'Travmatik anıların etkisinin azalması',
        'Duygusal dengenin sağlanması',
        'Fiziksel belirtilerin hafiflemesi',
        'Özgüven artışı',
        'İlişkilerde iyileşme',
        'Uyku kalitesinin artması'
      ],
      whoCanBenefit: [
        'Travma yaşamış kişiler',
        'Duygusal blokajı olanlar',
        'Anksiyete ve depresyon yaşayanlar',
        'Fobisi olanlar',
        'Öfke kontrolü sorunu yaşayanlar',
        'İç huzur arayanlar'
      ],
      duration: '60 dakika',
      sessions: '3-5 seans',
      faqs: [
        {
          question: 'Bilinçaltı temizliği güvenli mi?',
          answer: 'Evet, bilinçaltı temizliği tamamen doğal ve güvenli bir süreçtir. Hiçbir yan etkisi yoktur ve kişinin kendi hızında ilerler.'
        },
        {
          question: 'Kaç seans gerekir?',
          answer: 'Genellikle 3-5 seans yeterlidir, ancak kişinin durumuna göre değişebilir. İlk seansın ardından belirgin iyileşmeler görülür.'
        },
        {
          question: 'Online seans etkili mi?',
          answer: 'Evet, bilinçaltı temizliği online seanslar için çok uygun bir tekniktir. Etkinlik açısından yüz yüze seanslarla aynıdır.'
        }
      ]
    }
  ]

  const activeServiceData = services.find(s => s.id === activeService) || services[0]

  return (
    <section id="hizmet-detaylari" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            Detaylı Bilgiler
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
              Hizmet Detayları
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Her hizmetimizin detaylarını, süreçlerini ve faydalarını keşfedin. 
            Size en uygun hizmeti seçmenize yardımcı olacak kapsamlı bilgiler.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Service Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Hizmetlerimiz</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {services.map((service) => {
                  const IconComponent = service.icon
                  return (
                    <button
                      key={service.id}
                      onClick={() => setActiveService(service.id)}
                      className={`w-full text-left p-4 rounded-lg transition-all duration-200 relative ${
                        activeService === service.id
                          ? 'bg-gradient-to-r ' + service.color + ' text-white shadow-lg'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <IconComponent className="w-5 h-5" />
                          <div>
                            <h3 className="font-medium">{service.title}</h3>
                          </div>
                        </div>
                        {service.popular && (
                          <Badge className="bg-orange-500 text-white text-xs px-2 py-1">
                            En Popüler
                          </Badge>
                        )}
                      </div>
                    </button>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Service Details */}
          <div className="lg:col-span-3">
            <Card className="shadow-xl">
              <CardHeader className={`bg-gradient-to-r ${activeServiceData.color} text-white rounded-t-lg`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <activeServiceData.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-white">{activeServiceData.title}</CardTitle>
                      <p className="text-white/90 mt-2">{activeServiceData.description}</p>
                    </div>
                  </div>
                  {activeServiceData.popular && (
                    <Badge className="bg-orange-500 text-white">
                      En Popüler
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-8 space-y-8">
                {/* Service Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="font-semibold text-gray-900">{activeServiceData.duration}</div>
                    <div className="text-sm text-gray-600">Seans Süresi</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="font-semibold text-gray-900">{activeServiceData.sessions}</div>
                    <div className="text-sm text-gray-600">Önerilen Seans</div>
                  </div>
                </div>

                {/* Detailed Description */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Hizmet Hakkında</h3>
                  <div className="prose prose-gray max-w-none">
                    {activeServiceData.detailedDescription.split('\n').map((paragraph, index) => (
                      paragraph.trim() && (
                        <p key={index} className="text-gray-700 leading-relaxed mb-4">
                          {paragraph.trim()}
                        </p>
                      )
                    ))}
                  </div>
                </div>

                {/* Process */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Süreç Nasıl İşler?</h3>
                  <div className="space-y-3">
                    {activeServiceData.process.map((step, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`w-8 h-8 bg-gradient-to-r ${activeServiceData.color} rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-0.5`}>
                          {index + 1}
                        </div>
                        <p className="text-gray-700">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Faydaları</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeServiceData.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Who Can Benefit */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Kimler İçin Uygun?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeServiceData.whoCanBenefit.map((person, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className={`w-2 h-2 bg-gradient-to-r ${activeServiceData.color} rounded-full`}></div>
                        <span className="text-gray-700">{person}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FAQs */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Sık Sorulan Sorular</h3>
                  <div className="space-y-4">
                    {activeServiceData.faqs.map((faq, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg">
                        <button
                          onClick={() => setExpandedFAQ(expandedFAQ === `${activeService}-${index}` ? null : `${activeService}-${index}`)}
                          className="w-full text-left p-4 flex items-center justify-between hover:bg-gray-50"
                        >
                          <span className="font-medium text-gray-900">{faq.question}</span>
                          {expandedFAQ === `${activeService}-${index}` ? (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          )}
                        </button>
                        {expandedFAQ === `${activeService}-${index}` && (
                          <div className="px-4 pb-4">
                            <p className="text-gray-700">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="text-center pt-8 border-t border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {activeServiceData.title} ile Başlamaya Hazır mısınız?
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      size="lg" 
                      className={`bg-gradient-to-r ${activeServiceData.color} hover:opacity-90 text-white px-8 py-3`}
                    >
                      Randevu Al
                    </Button>
                    <Button variant="outline" size="lg" className="px-8 py-3">
                      Ücretsiz Ön Görüşme
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ServiceDetails
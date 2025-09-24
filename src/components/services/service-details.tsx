'use client'

import React, { useState } from 'react'
import { Heart, Brain, Compass, Sparkles, ChevronDown, ChevronUp, Play, CheckCircle, Clock, Users, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const ServiceDetails = () => {
  const [activeService, setActiveService] = useState('duygu-temizligi')
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)

  const services = [
    {
      id: 'duygu-temizligi',
      icon: Heart,
      title: 'Duygu Temizliği',
      color: 'from-red-500 to-pink-500',
      description: 'Bilinçaltınızda biriken olumsuz duyguları tespit ederek güvenli bir şekilde temizliyoruz.',
      detailedDescription: `
        Duygu temizliği, bilinçaltımızda biriken olumsuz duyguların fark edilmesi ve serbest bırakılması sürecidir. 
        Bu süreçte EFT (Emotional Freedom Technique) ve Matrix Reimprinting gibi kanıtlanmış teknikler kullanılır.
        
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
      duration: '90 dakika',
      sessions: '3-5 seans',
      price: '500₺',
      faqs: [
        {
          question: 'Duygu temizliği güvenli mi?',
          answer: 'Evet, duygu temizliği tamamen doğal ve güvenli bir süreçtir. Hiçbir yan etkisi yoktur ve kişinin kendi hızında ilerler.'
        },
        {
          question: 'Kaç seans gerekir?',
          answer: 'Genellikle 3-5 seans yeterlidir, ancak kişinin durumuna göre değişebilir. İlk seansın ardından belirgin iyileşmeler görülür.'
        },
        {
          question: 'Online seans etkili mi?',
          answer: 'Evet, duygu temizliği online seanslar için çok uygun bir tekniktir. Etkinlik açısından yüz yüze seanslarla aynıdır.'
        }
      ]
    },
    {
      id: 'travma-iyilestirme',
      icon: Brain,
      title: 'Travma İyileştirme',
      color: 'from-purple-500 to-indigo-500',
      description: 'Geçmiş travmalarınızı güvenli bir ortamda işleyerek iyileşme sürecini başlatıyoruz.',
      detailedDescription: `
        Travma iyileştirme, geçmişte yaşanan zor deneyimlerin güvenli bir ortamda işlenmesi ve entegre edilmesi sürecidir. 
        EMDR, Somatic Experiencing ve Narrative Therapy gibi kanıtlanmış yöntemler kullanılır.
        
        Travmalar, yaşandığı anda tam olarak işlenemediği için beyin ve vücutta "donmuş" kalır. 
        Bu durum, tetikleyici durumlarla karşılaştığımızda travmatik tepkilerin yeniden yaşanmasına neden olur.
      `,
      process: [
        'Travma geçmişinin detaylı değerlendirilmesi',
        'Güvenli ortamın oluşturulması',
        'Travmatik anının güvenli şekilde hatırlanması',
        'EMDR veya diğer tekniklerle işleme',
        'Yeni, sağlıklı anlamlandırmanın oluşturulması'
      ],
      benefits: [
        'Travmatik belirtilerin azalması',
        'Tetikleyici durumlarla başa çıkabilme',
        'Uyku kalitesinin iyileşmesi',
        'İlişkilerde güven artışı',
        'Travma sonrası büyüme',
        'Yaşam kalitesinin artması'
      ],
      whoCanBenefit: [
        'Çocukluk travması yaşayanlar',
        'İlişki travması geçirenler',
        'Kayıp yaşayanlar',
        'Kaza geçirenler',
        'PTSD belirtileri olanlar',
        'Duygusal istismar yaşayanlar'
      ],
      duration: '120 dakika',
      sessions: '5-8 seans',
      price: '750₺',
      faqs: [
        {
          question: 'Travma iyileştirme acı verici mi?',
          answer: 'Süreç güvenli bir ortamda yürütülür ve kişinin dayanabileceği hızda ilerler. Geçici rahatsızlık olabilir ancak bu iyileşmenin bir parçasıdır.'
        },
        {
          question: 'Eski travmalar da iyileştirilebilir mi?',
          answer: 'Evet, travmanın ne kadar eski olduğu önemli değildir. Beyin plastisitesi sayesinde her yaşta iyileşme mümkündür.'
        },
        {
          question: 'Travmayı hatırlamak zorunda mıyım?',
          answer: 'Detaylı hatırlama gerekmez. Vücudun ve duygusal sistemin tepkileriyle çalışılır.'
        }
      ]
    },
    {
      id: 'yasam-koclugu',
      icon: Compass,
      title: 'Yaşam Koçluğu',
      color: 'from-blue-500 to-cyan-500',
      description: 'Yaşam hedeflerinizi netleştirmeniz ve bu hedeflere ulaşmanız için rehberlik ediyoruz.',
      detailedDescription: `
        Yaşam koçluğu, kişinin potansiyelini keşfetmesi ve yaşam hedeflerine ulaşması için verilen profesyonel destektir. 
        Goal Setting, Mindfulness Coaching ve Cognitive Restructuring teknikleri kullanılır.
        
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
      price: '400₺',
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
      description: 'Beden, zihin ve ruh bütünlüğü içinde kişisel dönüşümünüzü destekliyoruz.',
      detailedDescription: `
        Holistik koçluk, kişiyi beden, zihin ve ruh bütünlüğü içinde ele alan kapsamlı bir yaklaşımdır. 
        Energy Healing, Chakra Balancing ve Meditation Guidance teknikleri kullanılır.
        
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
      duration: '90 dakika',
      sessions: '6-8 seans',
      price: '600₺',
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
    }
  ]

  const activeServiceData = services.find(s => s.id === activeService) || services[0]

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
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
            <div className="sticky top-8 space-y-2">
              {services.map((service) => {
                const IconComponent = service.icon
                return (
                  <button
                    key={service.id}
                    onClick={() => setActiveService(service.id)}
                    className={`w-full p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                      activeService === service.id
                        ? 'border-purple-300 bg-purple-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-purple-200 hover:bg-purple-25'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 bg-gradient-to-r ${service.color} rounded-lg flex items-center justify-center`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{service.title}</h3>
                        <p className="text-sm text-gray-600">{service.price}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Service Details */}
          <div className="lg:col-span-3">
            <Card className="shadow-xl border-2 border-gray-200">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 bg-gradient-to-r ${activeServiceData.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <activeServiceData.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-bold text-gray-900">{activeServiceData.title}</CardTitle>
                    <p className="text-lg text-gray-600">{activeServiceData.description}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-8 space-y-8">
                {/* Service Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Star className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="font-semibold text-gray-900">{activeServiceData.price}</div>
                    <div className="text-sm text-gray-600">Seans Ücreti</div>
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
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 pt-1">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits & Who Can Benefit */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Faydaları</h3>
                    <div className="space-y-2">
                      {activeServiceData.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Kimler Faydalanabilir?</h3>
                    <div className="space-y-2">
                      {activeServiceData.whoCanBenefit.map((person, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          <span className="text-gray-700">{person}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* FAQs */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Sık Sorulan Sorular</h3>
                  <div className="space-y-4">
                    {activeServiceData.faqs.map((faq, index) => (
                      <Card key={index} className="border border-gray-200">
                        <button
                          onClick={() => setExpandedFAQ(expandedFAQ === `${activeService}-${index}` ? null : `${activeService}-${index}`)}
                          className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-semibold text-gray-900">{faq.question}</span>
                          {expandedFAQ === `${activeService}-${index}` ? (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          )}
                        </button>
                        {expandedFAQ === `${activeService}-${index}` && (
                          <div className="px-4 pb-4">
                            <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {activeServiceData.title} Hizmetini Almak İster misiniz?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Ücretsiz ön görüşme ile başlayabilir veya doğrudan randevu alabilirsiniz.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      size="lg" 
                      className={`bg-gradient-to-r ${activeServiceData.color} hover:opacity-90 text-white`}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Ücretsiz Ön Görüşme
                    </Button>
                    <Button variant="outline" size="lg">
                      Randevu Al
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
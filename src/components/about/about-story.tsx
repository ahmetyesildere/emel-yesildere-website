'use client'

import React from 'react'
import { Heart, Lightbulb, Target, Users, ArrowRight, BookOpen, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const AboutStory = () => {
  const journeySteps = [
    {
      year: '2016',
      title: 'Kişisel Keşif',
      description: 'Kendi yaşadığım zorluklar sonrasında duygu temizliği ile tanıştım ve hayatımda büyük değişimler yaşadım.',
      icon: Lightbulb,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      year: '2017',
      title: 'Eğitim Süreci',
      description: 'Duygu temizliği, travma iyileştirme ve holistik koçluk alanlarında kapsamlı eğitimler aldım.',
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      year: '2018',
      title: 'İlk Adımlar',
      description: 'Yakın çevremden başlayarak ilk müşterilerime hizmet vermeye başladım ve olumlu geri dönüşler aldım.',
      icon: Target,
      color: 'from-green-500 to-emerald-500'
    },
    {
      year: '2020',
      title: 'Profesyonel Hizmet',
      description: 'Tam zamanlı olarak duygu temizliği ve holistik koçluk hizmetleri vermeye başladım.',
      icon: Users,
      color: 'from-purple-500 to-indigo-500'
    },
    {
      year: '2022',
      title: 'Online Dönüşüm',
      description: 'Pandemi süreciyle birlikte online seansları hayata geçirdim ve erişimi artırdım.',
      icon: Sparkles,
      color: 'from-pink-500 to-red-500'
    },
    {
      year: '2024',
      title: 'Bugün',
      description: '500+ mutlu müşteri, 8+ yıl deneyim ve sürekli gelişen bir hizmet anlayışı.',
      icon: Heart,
      color: 'from-red-500 to-pink-500'
    }
  ]

  const values = [
    {
      title: 'Güven',
      description: 'Her müşterimle güven temelli, samimi ve destekleyici bir ilişki kuruyorum.',
      icon: Heart,
      color: 'from-red-500 to-pink-500'
    },
    {
      title: 'Bütünlük',
      description: 'Holistik yaklaşımla beden, zihin ve ruh bütünlüğünü gözetiyorum.',
      icon: Sparkles,
      color: 'from-purple-500 to-indigo-500'
    },
    {
      title: 'Kişisellik',
      description: 'Her bireyin benzersiz olduğuna inanıyor, kişiye özel çözümler sunuyorum.',
      icon: Target,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Süreklilik',
      description: 'Sadece seans sırasında değil, süreç boyunca yanınızda olmaya devam ediyorum.',
      icon: Users,
      color: 'from-green-500 to-emerald-500'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            Hikayem
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
              Nasıl Başladı Bu Yolculuk?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Kendi iyileşme yolculuğumdan başlayarak, binlerce kişinin hayatına dokunduğum 
            bu anlamlı mesleğe nasıl adım attığımı sizlerle paylaşıyorum.
          </p>
        </div>

        {/* Personal Story */}
        <div className="max-w-4xl mx-auto mb-20">
          <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-lg">
                Benim bu alana olan ilgim, aslında kendi yaşadığım zorlu dönemlerle başladı. 
                Hayatımda yaşadığım travmatik olaylar sonrasında kendimi çok kötü hissediyordum 
                ve geleneksel yöntemlerle istediğim sonuçları alamıyordum.
              </p>
              
              <p className="text-lg">
                Duygu temizliği ile tanıştığımda, ilk seansımdan sonra yaşadığım değişim 
                beni çok etkiledi. Yıllardır taşıdığım ağırlıkların hafiflemesi, 
                kendimi daha huzurlu ve dengeli hissetmem, bu alanı daha derinlemesine 
                öğrenmek istememde büyük rol oynadı.
              </p>
              
              <p className="text-lg">
                Kendi iyileşme sürecimde yaşadığım bu mucizeyi başkalarıyla da paylaşmak, 
                onların da bu dönüşümü yaşamalarına yardımcı olmak istiyordum. 
                Bu düşünceyle kapsamlı eğitimler aldım ve bu yolculuğa başladım.
              </p>
              
              <p className="text-lg font-semibold text-purple-700">
                Bugün, 8 yılı aşkın deneyimimle 500'den fazla kişinin hayatında 
                pozitif değişiklikler yaratmanın mutluluğunu yaşıyorum.
              </p>
            </div>
          </Card>
        </div>

        {/* Journey Timeline */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Yolculuğumun Kilometre Taşları</h3>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-200 via-purple-200 to-pink-200"></div>
            
            <div className="space-y-12">
              {journeySteps.map((step, index) => {
                const IconComponent = step.icon
                const isEven = index % 2 === 0
                
                return (
                  <div key={step.year} className={`flex items-center ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                    <div className={`w-full lg:w-5/12 ${isEven ? 'lg:pr-8' : 'lg:pl-8'}`}>
                      <Card className="p-6 bg-white hover:shadow-lg transition-shadow border border-gray-200">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className={`w-12 h-12 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-purple-600">{step.year}</div>
                            <h4 className="text-xl font-semibold text-gray-900">{step.title}</h4>
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{step.description}</p>
                      </Card>
                    </div>
                    
                    {/* Timeline Node */}
                    <div className="hidden lg:flex w-2/12 justify-center">
                      <div className={`w-6 h-6 bg-gradient-to-r ${step.color} rounded-full border-4 border-white shadow-lg`}></div>
                    </div>
                    
                    <div className="hidden lg:block w-5/12"></div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Değerlerim</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon
              return (
                <Card key={index} className="p-6 text-center bg-white hover:shadow-lg transition-shadow border border-gray-200">
                  <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Philosophy */}
        <Card className="p-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center">
          <h3 className="text-3xl font-bold mb-6">Felsefem</h3>
          <p className="text-xl leading-relaxed max-w-4xl mx-auto mb-6">
            "Her insan doğuştan gelen bir iyileşme kapasitesine sahiptir. Benim rolüm, 
            bu doğal gücü ortaya çıkarmak ve kişinin kendi potansiyelini keşfetmesine 
            yardımcı olmaktır. Çünkü gerçek değişim, kişinin içinden gelir."
          </p>
          <div className="text-lg opacity-90">— Emel Yeşildere</div>
        </Card>
      </div>
    </section>
  )
}

export default AboutStory
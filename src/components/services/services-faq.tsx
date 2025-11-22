'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Search, Heart, Brain, Compass, Sparkles, HelpCircle, Clock, Shield, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

const ServicesFAQ = () => {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'Tümü', icon: HelpCircle },
    { id: 'duygu-temizligi', name: 'Duygu Temizliği', icon: Heart },
    { id: 'travma-iyilestirme', name: 'Travma İyileştirme', icon: Brain },
    { id: 'yasam-koclugu', name: 'Yaşam Koçluğu', icon: Compass },
    { id: 'holistik-kocluk', name: 'Holistik Koçluk', icon: Sparkles },
    { id: 'genel', name: 'Genel', icon: Users }
  ]

  const faqs = [
    // Duygu Temizliği
    {
      id: 'dt-1',
      category: 'duygu-temizligi',
      question: 'Duygu temizliği nedir ve nasıl çalışır?',
      answer: 'Duygu temizliği, bilinçaltımızda biriken olumsuz duyguların fark edilmesi ve serbest bırakılması sürecidir. EFT (Emotional Freedom Technique) gibi kanıtlanmış teknikler kullanılarak enerji meridyenlerine dokunulur ve duygusal blokajlar açılır. Bu süreç tamamen doğal ve güvenlidir.',
      tags: ['eft', 'bilinçaltı', 'duygu', 'temizlik']
    },
    {
      id: 'dt-2',
      category: 'duygu-temizligi',
      question: 'Duygu temizliği güvenli mi? Yan etkisi var mı?',
      answer: 'Evet, duygu temizliği tamamen güvenli ve doğal bir süreçtir. Hiçbir yan etkisi yoktur. Kişinin kendi hızında ilerler ve zorla bir şey yapılmaz. Bazı kişiler seans sonrası hafif yorgunluk hissedebilir, bu normal bir iyileşme tepkisidir.',
      tags: ['güvenlik', 'yan etki', 'doğal']
    },
    {
      id: 'dt-3',
      category: 'duygu-temizligi',
      question: 'Kaç seans duygu temizliği gerekir?',
      answer: 'Genellikle 3-5 seans yeterlidir, ancak kişinin durumuna göre değişebilir. Basit duygusal blokajlar 1-2 seansta çözülebilirken, derin travmalar daha fazla seans gerektirebilir. İlk seansın ardından belirgin iyileşmeler görülür.',
      tags: ['seans sayısı', 'süre', 'iyileşme']
    },
    
    // Travma İyileştirme
    {
      id: 'ti-1',
      category: 'travma-iyilestirme',
      question: 'Travma iyileştirme süreci acı verici mi?',
      answer: 'Travma iyileştirme süreci güvenli bir ortamda yürütülür ve kişinin dayanabileceği hızda ilerler. Geçici rahatsızlık olabilir ancak bu iyileşmenin doğal bir parçasıdır. Sürekli destek sağlanır ve kişi hiçbir zaman yalnız bırakılmaz.',
      tags: ['acı', 'güvenlik', 'destek']
    },
    {
      id: 'ti-2',
      category: 'travma-iyilestirme',
      question: 'Eski travmalar da iyileştirilebilir mi?',
      answer: 'Evet, travmanın ne kadar eski olduğu önemli değildir. Beyin plastisitesi sayesinde her yaşta iyileşme mümkündür. Çocukluk travmaları da dahil olmak üzere tüm travma türleri başarıyla işlenebilir.',
      tags: ['eski travma', 'çocukluk', 'iyileşme']
    },
    {
      id: 'ti-3',
      category: 'travma-iyilestirme',
      question: 'Travmayı detaylı hatırlamak zorunda mıyım?',
      answer: 'Hayır, detaylı hatırlama gerekmez. EMDR ve diğer tekniklerle vücudun ve duygusal sistemin tepkileriyle çalışılır. Kişi sadece genel bir hatırlama yapar, detayları zorla hatırlamaya çalışmaz.',
      tags: ['hatırlama', 'emdr', 'detay']
    },

    // Yaşam Koçluğu
    {
      id: 'yk-1',
      category: 'yasam-koclugu',
      question: 'Yaşam koçluğu terapiden farkı nedir?',
      answer: 'Yaşam koçluğu geleceğe odaklanır ve hedef belirlemeye yardımcı olur. Terapi ise geçmiş sorunları ele alır. Koçluk daha çok "nasıl" sorularına odaklanırken, terapi "neden" sorularını araştırır. Her ikisi de değerli yaklaşımlardır.',
      tags: ['terapi farkı', 'gelecek', 'hedef']
    },
    {
      id: 'yk-2',
      category: 'yasam-koclugu',
      question: 'Hangi yaşta yaşam koçluğu alınabilir?',
      answer: '18 yaş üstü herkese uygun. Özellikle yaşam geçişlerinde (kariyer değişimi, ilişki, yaş dönümleri) çok faydalıdır. Gençler için kariyer koçluğu, yetişkinler için yaşam dengesi konularında etkilidir.',
      tags: ['yaş', 'kariyer', 'geçiş']
    },
    {
      id: 'yk-3',
      category: 'yasam-koclugu',
      question: 'Yaşam koçluğu sonuçları ne kadar sürede görürüm?',
      answer: 'İlk seanslardan itibaren netlik ve motivasyon artışı hissedilir. Kalıcı değişimler 4-6 seans sonrası görülür. Hedeflere ulaşma süresi kişinin durumuna ve hedeflerinin büyüklüğüne bağlıdır.',
      tags: ['sonuç', 'süre', 'motivasyon']
    },

    // Holistik Koçluk
    {
      id: 'hk-1',
      category: 'holistik-kocluk',
      question: 'Holistik koçluk bilimsel mi?',
      answer: 'Enerji çalışmaları binlerce yıllık geleneklere dayanır. Modern araştırmalar da enerji terapilerinin etkinliğini destekler. Chakra sistemi ve enerji meridyenleri artık bilimsel olarak kabul görmektedir.',
      tags: ['bilim', 'enerji', 'araştırma']
    },
    {
      id: 'hk-2',
      category: 'holistik-kocluk',
      question: 'Dini inançlarımla çelişir mi?',
      answer: 'Holistik koçluk herhangi bir dini inanç sistemi değildir. Tüm inançlarla uyumlu evrensel prensipleri kullanır. Kişinin kendi inançlarına saygı gösterilir ve hiçbir dayatma yapılmaz.',
      tags: ['din', 'inanç', 'evrensel']
    },
    {
      id: 'hk-3',
      category: 'holistik-kocluk',
      question: 'Enerji değişimlerini hissedebilir miyim?',
      answer: 'Çoğu kişi ilk seanslardan itibaren enerji değişimlerini hisseder. Bu kişiden kişiye değişebilir. Bazıları fiziksel sensasyonlar, bazıları duygusal değişimler, bazıları da zihinsel netlik hisseder.',
      tags: ['enerji', 'hissetme', 'değişim']
    },

    // Genel Sorular
    {
      id: 'g-1',
      category: 'genel',
      question: 'Online seanslar etkili mi?',
      answer: 'Evet, online seanslar yüz yüze seanslar kadar etkilidir. Özellikle duygu temizliği ve yaşam koçluğu için çok uygun. Teknik altyapı sağlanır ve kişi kendi rahat ortamında seans alabilir.',
      tags: ['online', 'etkinlik', 'teknoloji']
    },
    {
      id: 'g-2',
      category: 'genel',
      question: 'Seanslar ne kadar sürer?',
      answer: 'Tüm seanslarımız 60 dakika sürmektedir. Bu süre, etkili bir dönüşüm için optimal olarak belirlenmiştir. İlk seans değerlendirme içerdiği için biraz daha uzun sürebilir.',
      tags: ['süre', 'dakika', 'hizmet']
    },
    {
      id: 'g-3',
      category: 'genel',
      question: 'Gizlilik nasıl sağlanır?',
      answer: 'Tüm görüşmeler tamamen gizlidir ve üçüncü kişilerle paylaşılmaz. Profesyonel etik kurallarına uyulur. Online seanslar güvenli platformlarda yapılır ve kayıt tutulmaz.',
      tags: ['gizlilik', 'etik', 'güvenlik']
    },
    {
      id: 'g-4',
      category: 'genel',
      question: 'Randevu nasıl alınır?',
      answer: 'Randevu almak için web sitesinden, WhatsApp hattından veya telefon ile iletişime geçebilirsiniz. Esnek saatler mevcuttur ve acil durumlar için özel randevu imkanı vardır.',
      tags: ['randevu', 'iletişim', 'esnek']
    },
    {
      id: 'g-5',
      category: 'genel',
      question: 'Ödeme seçenekleri nelerdir?',
      answer: 'Kredi kartı, banka havalesi ve nakit ödeme kabul edilir. Paket seçenekleri için taksitli ödeme imkanı vardır. Fatura kesilir ve ödeme güvenliği sağlanır.',
      tags: ['ödeme', 'kredi kartı', 'taksit']
    },
    {
      id: 'g-6',
      category: 'genel',
      question: 'Erteleme politikası nedir?',
      answer: 'Seansınız iptal edilmemektedir. Ücret iadesi yapılmaz ancak seansınız uygun bir gün ve saate ertelenebilir. En fazla 2 kez erteleme yapabilirsiniz. Erteleme için en az 24 saat önceden bildirim yapınız.',
      tags: ['erteleme', 'politika', 'ücret']
    }
  ]

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory
    const matchesSearch = searchTerm === '' || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId)
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            Merak Ettikleriniz
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
              Merak Ettikleriniz
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Hizmetlerimiz hakkında en çok sorulan soruların yanıtlarını burada bulabilirsiniz. 
            Aradığınızı bulamazsanız bizimle iletişime geçin.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Soru ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-base border-2 focus:border-purple-400"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full border-2 transition-all ${
                  activeCategory === category.id
                    ? 'border-purple-400 bg-purple-50 text-purple-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-purple-200 hover:bg-purple-25'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            )
          })}
        </div>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto space-y-4 mb-16">
          {filteredFAQs.length === 0 ? (
            <Card className="p-8 text-center">
              <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sonuç Bulunamadı</h3>
              <p className="text-gray-600">
                Aradığınız kriterlere uygun soru bulunamadı. Lütfen farklı anahtar kelimeler deneyin.
              </p>
            </Card>
          ) : (
            filteredFAQs.map((faq) => (
              <Card key={faq.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                  {expandedFAQ === faq.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                {expandedFAQ === faq.id && (
                  <CardContent className="px-6 pb-6 pt-0">
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-gray-700 leading-relaxed mb-4">{faq.answer}</p>
                      <div className="flex flex-wrap gap-2">
                        {faq.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>

        {/* Quick Help */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="p-6 text-center bg-white hover:shadow-lg transition-shadow border border-gray-200">
            <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Hızlı Yanıt</h3>
            <p className="text-gray-600 text-sm mb-4">
              WhatsApp üzerinden anında yanıt alın
            </p>
            <Badge className="bg-green-100 text-green-800">24/7 Aktif</Badge>
          </Card>

          <Card className="p-6 text-center bg-white hover:shadow-lg transition-shadow border border-gray-200">
            <Shield className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Güvenli İletişim</h3>
            <p className="text-gray-600 text-sm mb-4">
              Tüm sorularınız gizli kalır
            </p>
            <Badge className="bg-purple-100 text-purple-800">%100 Gizli</Badge>
          </Card>

          <Card className="p-6 text-center bg-white hover:shadow-lg transition-shadow border border-gray-200">
            <Users className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Uzman Desteği</h3>
            <p className="text-gray-600 text-sm mb-4">
              8+ yıl deneyimli uzman yanıtlar
            </p>
            <Badge className="bg-emerald-100 text-emerald-800">Profesyonel</Badge>
          </Card>
        </div>

        {/* Contact CTA */}
        <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 text-center">
          <HelpCircle className="w-16 h-16 text-purple-600 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Sorunuz Burada Yok mu?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Aklınıza takılan başka sorular varsa, çekinmeden bizimle iletişime geçin. 
            Size yardımcı olmaktan mutluluk duyarız.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity">
              WhatsApp ile Sor
            </button>
            <button className="border-2 border-purple-300 text-purple-700 px-8 py-3 rounded-full font-semibold hover:bg-purple-50 transition-colors">
              E-posta Gönder
            </button>
          </div>
        </Card>
      </div>
    </section>
  )
}

export default ServicesFAQ
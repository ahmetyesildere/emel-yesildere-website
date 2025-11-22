'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Phone, Mail, MessageCircle, Calendar, Clock, HelpCircle, CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useContactInfo } from '@/hooks/use-contact-info'

const ContactFAQ = () => {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  const { contactInfo } = useContactInfo()

  const faqs = [
    {
      id: 'contact-1',
      question: 'Randevu nasıl alabilirim?',
      answer: `Randevu almak için birkaç seçeneğiniz var: 1) Web sitemizdeki randevu formunu doldurabilirsiniz, 2) WhatsApp hattımızdan (${contactInfo.whatsapp}) mesaj gönderebilirsiniz, 3) Telefon ile arayabilirsiniz, 4) E-posta gönderebilirsiniz. En hızlı yanıt WhatsApp üzerinden alırsınız.`,
      category: 'randevu'
    },
    {
      id: 'contact-2',
      question: 'Acil durumda nasıl ulaşabilirim?',
      answer: `Acil durumlar için WhatsApp hattımız 24/7 aktiftir. ${contactInfo.whatsapp} numarasından mesaj gönderebilirsiniz. Acil durum mesajlarına 30 dakika içinde yanıt veriyoruz. Kriz anlarında size destek olmak için buradayız.`,
      category: 'acil'
    },
    {
      id: 'contact-3',
      question: 'Mesajlarıma ne kadar sürede yanıt alırım?',
      answer: 'Yanıt sürelerimiz: WhatsApp - Anında, E-posta - 2-4 saat, Telefon - Çalışma saatleri içinde, Acil durumlar - 30 dakika. Çalışma saatleri dışında gelen mesajlara ertesi iş günü yanıt veriyoruz.',
      category: 'yanit'
    },
    {
      id: 'contact-4',
      question: 'Online seans nasıl yapılır?',
      answer: 'Online seanslar Zoom veya Google Meet üzerinden yapılır. Randevu aldıktan sonra size toplantı linki gönderilir. Sadece internet bağlantısı, kamera ve mikrofon gereklidir. Teknik destek sağlanır.',
      category: 'online'
    },
    {
      id: 'contact-5',
      question: 'Ofis adresi nedir?',
      answer: 'Güvenlik nedeniyle tam adres randevu alırken SMS ile gönderilir. Ofisimiz Bandırma merkezi lokasyonda, toplu taşıma ile kolayca ulaşılabilir. Randevu saatinden 15 dakika önce detaylı adres bilgisi paylaşılır.',
      category: 'adres'
    },
    {
      id: 'contact-6',
      question: 'Randevumu erteleyebilir miyim?',
      answer: 'Evet, seansınız iptal edilmez ancak uygun bir gün ve saate ertelenebilir. En fazla 2 kez erteleme yapabilirsiniz. Erteleme için en az 24 saat önceden WhatsApp veya telefon ile iletişime geçin.',
      category: 'erteleme'
    },
    {
      id: 'contact-7',
      question: 'Hangi saatlerde ulaşabilirim?',
      answer: 'Çalışma saatleri: Pazartesi-Cuma 09:00-18:00, Cumartesi 10:00-16:00, Pazar kapalı. WhatsApp desteği 24/7 aktif. Acil durumlar için her zaman ulaşabilirsiniz.',
      category: 'saat'
    },
    {
      id: 'contact-8',
      question: 'İletişim bilgilerim güvende mi?',
      answer: 'Evet, tüm iletişim bilgileriniz tamamen gizlidir. KVKK uyumlu çalışıyoruz. Bilgileriniz üçüncü kişilerle paylaşılmaz. SSL şifreli güvenli bağlantı kullanıyoruz.',
      category: 'guvenlik'
    },
    {
      id: 'contact-9',
      question: 'Grup seansları var mı?',
      answer: 'Evet, 6-8 kişilik grup seansları düzenliyoruz. Grup seansları için özel randevu gereklidir. Fiyat avantajı vardır. Detaylı bilgi için iletişime geçin.',
      category: 'grup'
    },
    {
      id: 'contact-10',
      question: 'Ödeme nasıl yapılır?',
      answer: 'Kredi kartı, banka havalesi ve nakit ödeme kabul edilir. Online seanslar için kredi kartı öneriyoruz. Fatura kesilir. Taksitli ödeme seçenekleri mevcuttur.',
      category: 'odeme'
    }
  ]

  const contactMethods = [
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      description: 'En hızlı yanıt',
      response: 'Anında',
      action: 'Mesaj Gönder',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Phone,
      title: 'Telefon',
      description: 'Sesli görüşme',
      response: 'Çalışma saatleri',
      action: 'Ara',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Mail,
      title: 'E-posta',
      description: 'Detaylı mesaj',
      response: '2-4 saat',
      action: 'E-posta Gönder',
      color: 'from-purple-500 to-indigo-500'
    }
  ]

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId)
  }

  return (
    <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            Sık Sorulan Sorular
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
              İletişim Hakkında Sorular
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            İletişim, randevu alma ve hizmetlerimiz hakkında en çok sorulan 
            soruların yanıtlarını burada bulabilirsiniz.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* FAQ List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {faqs.map((faq) => (
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
                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Methods Sidebar */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Hızlı İletişim</h3>
              <div className="space-y-4">
                {contactMethods.map((method, index) => {
                  const IconComponent = method.icon
                  return (
                    <Card key={index} className="p-4 hover:shadow-lg transition-shadow border border-gray-200">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${method.color} rounded-lg flex items-center justify-center`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{method.title}</h4>
                          <p className="text-sm text-gray-600">{method.description}</p>
                          <p className="text-xs text-purple-600 font-medium">Yanıt: {method.response}</p>
                        </div>
                      </div>
                      <Button 
                        className={`w-full bg-gradient-to-r ${method.color} hover:opacity-90 text-white`}
                        size="sm"
                      >
                        {method.action}
                      </Button>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Emergency Contact */}
            <Card className="p-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HelpCircle className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Acil Durum</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Kriz anlarında 24/7 WhatsApp desteği
                </p>
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                  Acil Destek
                </Button>
              </div>
            </Card>

            {/* Working Hours */}
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
              <div className="flex items-center mb-4">
                <Clock className="w-6 h-6 text-blue-600 mr-3" />
                <h4 className="text-lg font-semibold text-gray-900">Çalışma Saatleri</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Pazartesi - Cuma</span>
                  <span className="font-medium text-gray-900">09:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cumartesi</span>
                  <span className="font-medium text-gray-900">10:00 - 16:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pazar</span>
                  <span className="font-medium text-red-600">Kapalı</span>
                </div>
                <div className="pt-2 border-t border-blue-200">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-700 font-medium text-xs">WhatsApp 24/7 Aktif</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Contact Info */}
            <Card className="p-6 bg-white border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">İletişim Bilgileri</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700">{contactInfo.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-purple-600" />
                  <span className="text-gray-700">{contactInfo.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageCircle className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">WhatsApp Destek</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Still Have Questions */}
        <div className="mt-20">
          <Card className="p-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center">
            <HelpCircle className="w-16 h-16 mx-auto mb-6 opacity-80" />
            <h3 className="text-3xl font-bold mb-4">
              Hala Sorunuz mu Var?
            </h3>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Aradığınız yanıtı bulamadıysanız, bizimle doğrudan iletişime geçin. 
              Size yardımcı olmaktan mutluluk duyarız.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp ile Sor
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Randevu Al
              </Button>
            </div>
            
            <div className="mt-8 text-white/80 text-sm">
              <p>Ortalama yanıt süresi: WhatsApp - Anında, E-posta - 2-4 saat</p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default ContactFAQ
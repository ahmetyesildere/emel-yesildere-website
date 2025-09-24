'use client'

import React, { useState } from 'react'
import { Send, User, Mail, Phone, MessageCircle, Calendar, Heart, CheckCircle, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    landline: '',
    subject: '',
    service: '',
    message: '',
    preferredContact: 'email',
    urgency: 'normal'
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const subjects = [
    'Randevu Talebi',
    'Hizmet Bilgisi',
    'Fiyat Bilgisi',
    'Genel Soru',
    'Teknik Destek',
    'Şikayet/Öneri',
    'Acil Durum'
  ]

  const services = [
    'Duygu Temizliği',
    'Travma İyileştirme',
    'Yaşam Koçluğu',
    'Holistik Koçluk',
    'Grup Seansları',
    'Online Seans',
    'Henüz Karar Vermedim'
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Here you would typically send the data to your Supabase database
      // const { data, error } = await supabase
      //   .from('contact_messages')
      //   .insert([formData])
      
      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        phone: '',
        landline: '',
        subject: '',
        service: '',
        message: '',
        preferredContact: 'email',
        urgency: 'normal'
      })
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const quickActions = [
    {
      icon: Calendar,
      title: 'Hızlı Randevu',
      description: 'Doğrudan randevu almak için',
      action: 'Randevu Al',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp Destek',
      description: 'Anında yanıt için',
      action: 'WhatsApp Aç',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Phone,
      title: 'Telefon Görüşmesi',
      description: 'Detaylı bilgi için',
      action: 'Hemen Ara',
      color: 'from-purple-500 to-indigo-500'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            İletişim Formu
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
              Bize Ulaşın
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Sorularınızı, randevu taleplerinizi veya önerilerinizi aşağıdaki form ile 
            bize iletebilirsiniz. En kısa sürede size dönüş yapacağız.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-2 border-gray-200">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                  <Send className="w-6 h-6 mr-3 text-purple-600" />
                  İletişim Formu
                </CardTitle>
                <p className="text-gray-600">
                  Tüm alanları doldurarak bize mesajınızı gönderin
                </p>
              </CardHeader>

              <CardContent className="p-8">
                {submitStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-green-800 font-medium">Mesajınız başarıyla gönderildi!</p>
                      <p className="text-green-600 text-sm">En kısa sürede size dönüş yapacağız.</p>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="text-red-800 font-medium">Bir hata oluştu!</p>
                      <p className="text-red-600 text-sm">Lütfen tekrar deneyin veya WhatsApp ile iletişime geçin.</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Ad Soyad *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Adınız ve soyadınız"
                          className="pl-10 h-12 border-2 focus:border-purple-400"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        E-posta *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="ornek@email.com"
                          className="pl-10 h-12 border-2 focus:border-purple-400"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Cep Telefonu
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '')
                            if (value.length > 0) {
                              if (value.startsWith('90')) {
                                value = value.substring(2)
                              }
                              if (value.startsWith('0')) {
                                value = value.substring(1)
                              }
                              if (value.length <= 10) {
                                const formatted = value.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '+90 ($1) $2 $3 $4')
                                handleInputChange('phone', formatted)
                              }
                            } else {
                              handleInputChange('phone', '')
                            }
                          }}
                          placeholder="+90 (555) 123 45 67"
                          className="pl-10 h-12 border-2 focus:border-purple-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Sabit Telefon
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          type="tel"
                          value={formData.landline}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '')
                            if (value.length > 0) {
                              if (value.startsWith('90')) {
                                value = value.substring(2)
                              }
                              if (value.startsWith('0')) {
                                value = value.substring(1)
                              }
                              if (value.length <= 10) {
                                const formatted = value.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '+90 ($1) $2 $3 $4')
                                handleInputChange('landline', formatted)
                              }
                            } else {
                              handleInputChange('landline', '')
                            }
                          }}
                          placeholder="+90 (212) 123 45 67"
                          className="pl-10 h-12 border-2 focus:border-purple-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Konu *
                      </label>
                      <Select value={formData.subject} onValueChange={(value) => handleInputChange('subject', value)}>
                        <SelectTrigger className="h-12 border-2 focus:border-purple-400">
                          <SelectValue placeholder="Konu seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map((subject) => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        İlgilendiğiniz Hizmet
                      </label>
                      <Select value={formData.service} onValueChange={(value) => handleInputChange('service', value)}>
                        <SelectTrigger className="h-12 border-2 focus:border-purple-400">
                          <SelectValue placeholder="Hizmet seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((service) => (
                            <SelectItem key={service} value={service}>
                              {service}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tercih Edilen İletişim
                      </label>
                      <Select value={formData.preferredContact} onValueChange={(value) => handleInputChange('preferredContact', value)}>
                        <SelectTrigger className="h-12 border-2 focus:border-purple-400">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">E-posta</SelectItem>
                          <SelectItem value="phone">Telefon</SelectItem>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Aciliyet Durumu
                      </label>
                      <Select value={formData.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
                        <SelectTrigger className="h-12 border-2 focus:border-purple-400">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Düşük - Genel bilgi</SelectItem>
                          <SelectItem value="normal">Normal - Birkaç gün içinde</SelectItem>
                          <SelectItem value="high">Yüksek - 24 saat içinde</SelectItem>
                          <SelectItem value="urgent">Acil - Hemen</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Mesajınız *
                    </label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Mesajınızı buraya yazın..."
                      rows={6}
                      className="border-2 focus:border-purple-400 resize-none"
                      required
                    />
                  </div>



                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 text-lg font-semibold"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full" />
                        Gönderiliyor...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Mesajı Gönder
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Hızlı İşlemler</h3>
              <div className="space-y-4">
                {quickActions.map((action, index) => {
                  const IconComponent = action.icon
                  return (
                    <Card key={index} className="p-4 hover:shadow-lg transition-shadow border border-gray-200">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{action.title}</h4>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </div>
                      </div>
                      <Button 
                        className={`w-full mt-4 bg-gradient-to-r ${action.color} hover:opacity-90 text-white`}
                        size="sm"
                      >
                        {action.action}
                      </Button>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Response Time Info */}
            <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Yanıt Süremiz</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>📧 E-posta: 2-4 saat</p>
                  <p>📱 WhatsApp: Anında</p>
                  <p>📞 Telefon: Çalışma saatleri</p>
                  <p>🚨 Acil: 30 dakika</p>
                </div>
              </div>
            </Card>

            {/* Trust Badge */}
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 text-center">
              <Heart className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Güvenli İletişim</h4>
              <p className="text-sm text-gray-600">
                Tüm mesajlarınız gizli tutulur ve sadece Emel Yeşildere tarafından görülür.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactForm
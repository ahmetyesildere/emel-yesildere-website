'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, Copy, ArrowLeft, CreditCard, Clock, User, Calendar, Phone, Mail, MessageSquare, X, Send } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/lib/auth/auth-context'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/toast-provider'
import { useContactInfo } from '@/hooks/use-contact-info'

interface SessionDetails {
  id: string
  title: string
  session_date: string
  duration_minutes: number
  price: number
  status: string
  payment_status: string
  consultant: {
    first_name: string
    last_name: string
  }
  session_type: string
}

const OdemePage = () => {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { success: showSuccess, error: showError } = useToast()
  
  const sessionId = searchParams.get('session')
  
  const [session, setSession] = useState<SessionDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [isSendingMessage, setIsSendingMessage] = useState(false)
  
  const { contactInfo } = useContactInfo()

  // IBAN bilgileri - Admin panelinden yönetilebilir hale getirilebilir
  const IBAN = 'TR00 0000 0000 0000 0000 0000 00'
  const ACCOUNT_HOLDER = 'Emel Yeşildere'
  const BANK_NAME = 'Banka Adı'

  useEffect(() => {
    // Auth loading sırasında bekle
    if (authLoading) {
      console.log('⏳ Auth yükleniyor, bekleniyor...')
      return
    }

    // Auth yüklendikten sonra user yoksa yönlendir
    if (!user) {
      console.log('❌ Kullanıcı yok, seans-al sayfasına yönlendiriliyor')
      router.push('/seans-al')
      return
    }

    console.log('✅ Kullanıcı var, session detayları yükleniyor:', sessionId)
    if (sessionId) {
      loadSessionDetails()
    }
  }, [authLoading, user, sessionId])

  const loadSessionDetails = async () => {
    if (!sessionId) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          id,
          title,
          session_date,
          duration_minutes,
          price,
          status,
          payment_status,
          session_type,
          consultant:consultant_id (
            first_name,
            last_name
          )
        `)
        .eq('id', sessionId)
        .single()

      if (error) throw error

      setSession(data as any)
    } catch (error) {
      console.error('Seans detayları yüklenirken hata:', error)
      showError('Seans bilgileri yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    showSuccess('IBAN kopyalandı!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePaymentConfirmation = async () => {
    if (!sessionId) return

    try {
      // Seans status'unu güncelle: pending_payment -> pending (danışman onayı bekliyor)
      const { error } = await supabase
        .from('sessions')
        .update({ 
          status: 'pending', // Artık danışman onayı bekliyor
          payment_status: 'pending' // Ödeme onayı bekleniyor
        })
        .eq('id', sessionId)

      if (error) {
        console.error('❌ Seans güncelleme hatası:', error)
        showError('Bir hata oluştu. Lütfen tekrar deneyin.')
        return
      }

      showSuccess('Ödeme bildirimi alındı. Danışman onayından sonra bilgilendirileceksiniz.')
      
      // Global flag set et - otomatik çıkışı engelle
      if (typeof window !== 'undefined') {
        (window as any).__navigating = true
      }
      
      router.push('/seanslarim')
    } catch (error) {
      console.error('❌ Ödeme onaylama hatası:', error)
      showError('Bir hata oluştu. Lütfen tekrar deneyin.')
    }
  }

  const handleSendMessage = async () => {
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      showError('Lütfen tüm zorunlu alanları doldurun')
      return
    }

    setIsSendingMessage(true)
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: contactForm.name,
          email: contactForm.email,
          phone: contactForm.phone || null,
          message: `[ÖDEME SORGUSU]\nDanışan: ${user?.email?.split('@')[0]}\nTarih: ${session ? new Date(session.session_date).toLocaleDateString('tr-TR') : ''}\nTür: ${session?.session_type}\nReferans: ${session?.id.substring(0, 8)}\n\n${contactForm.message}`,
          status: 'new'
        })

      if (error) throw error

      showSuccess('Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapılacaktır.')
      setShowContactModal(false)
      setContactForm({ name: '', email: '', phone: '', message: '' })
    } catch (error) {
      console.error('Mesaj gönderme hatası:', error)
      showError('Mesaj gönderilemedi. Lütfen tekrar deneyin.')
    } finally {
      setIsSendingMessage(false)
    }
  }

  useEffect(() => {
    if (user && showContactModal) {
      setContactForm(prev => ({
        ...prev,
        name: user.user_metadata?.full_name || '',
        email: user.email || ''
      }))
    }
  }, [user, showContactModal])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (value: number): string => {
    return new Intl.NumberFormat('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ödeme bilgileri yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 mb-4">Seans bulunamadı</p>
            <Button onClick={() => router.push('/seans-al')}>
              Seans Al
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.push('/seanslarim')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Seanslarıma Dön
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Ödeme Bilgileri</h1>
              <p className="text-gray-600">Rezervasyonunuzu tamamlamak için ödeme yapın</p>
            </div>
            <Badge className="bg-yellow-100 text-yellow-800 text-lg px-4 py-2">
              Ödeme Bekliyor
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sol Kolon - Seans Detayları */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Seans Özeti
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Danışman</div>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">
                      {session.consultant.first_name} {session.consultant.last_name}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Seans Türü</div>
                  <Badge variant="outline">
                    {session.session_type === 'online' ? '💻 Online' : '👥 Yüz Yüze'}
                  </Badge>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Tarih & Saat</div>
                  <div className="flex items-start space-x-2">
                    <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                    <span className="text-sm">{formatDate(session.session_date)}</span>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Süre</div>
                  <span className="font-medium">{session.duration_minutes} dakika</span>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">Toplam Tutar</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ₺{formatPrice(session.price)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sağ Kolon - Ödeme Bilgileri */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ödeme Talimatları */}
            <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-white">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-900">
                  <CreditCard className="w-6 h-6 mr-2" />
                  Banka Havalesi ile Ödeme
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Hesap Bilgileri</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600">Hesap Sahibi</label>
                      <div className="mt-1 p-3 bg-gray-50 rounded border border-gray-200 font-medium">
                        {ACCOUNT_HOLDER}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">Banka</label>
                      <div className="mt-1 p-3 bg-gray-50 rounded border border-gray-200 font-medium">
                        {BANK_NAME}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">IBAN</label>
                      <div className="mt-1 flex items-center space-x-2">
                        <div className="flex-1 p-3 bg-gray-50 rounded border border-gray-200 font-mono font-medium">
                          {IBAN}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(IBAN)}
                          className="flex-shrink-0"
                        >
                          {copied ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">Tutar</label>
                      <div className="mt-1 p-3 bg-blue-50 rounded border border-blue-200 text-2xl font-bold text-blue-600">
                        ₺{formatPrice(session.price)}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">Açıklama (Önemli!)</label>
                      <div className="mt-1 p-3 bg-yellow-50 rounded border border-yellow-200 space-y-1">
                        <div className="font-medium text-yellow-900">
                          {user?.email?.split('@')[0]} - {new Date(session.session_date).toLocaleDateString('tr-TR')} - {session.session_type}
                        </div>
                        <div className="text-xs text-yellow-700">
                          Referans: {session.id.substring(0, 8)}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        * Lütfen havale açıklamasına yukarıdaki bilgileri yazınız
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ödeme Talimatları */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-900 mb-2 flex items-center">
                    <span className="text-xl mr-2">💡</span>
                    Ödeme Talimatları
                  </h4>
                  <ul className="space-y-2 text-sm text-amber-800">
                    <li className="flex items-start">
                      <span className="mr-2">1.</span>
                      <span>Yukarıdaki IBAN numarasına belirtilen tutarı havale yapın</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">2.</span>
                      <span>Havale açıklamasına mutlaka yukarıdaki <strong>açıklama bilgilerini</strong> yazın</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">3.</span>
                      <span>Ödeme onaylandıktan sonra e-posta ile bilgilendirileceksiniz</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">4.</span>
                      <span>Ödeme genellikle 1-2 saat içinde onaylanır</span>
                    </li>
                  </ul>
                </div>

                {/* Onay Butonu */}
                <div className="flex flex-col space-y-3">
                  <Button
                    onClick={handlePaymentConfirmation}
                    className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Ödemeyi Yaptım
                  </Button>
                  
                  <p className="text-xs text-center text-gray-500">
                    Bu butona tıklayarak ödemeyi yaptığınızı onaylıyorsunuz.
                    Ödemeniz kontrol edildikten sonra seansınız aktif hale gelecektir.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Yardım Kartı */}
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Yardıma mı ihtiyacınız var?</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Ödeme ile ilgili sorularınız için bizimle iletişime geçebilirsiniz.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowContactModal(true)}
                  className="w-full"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  İletişime Geç
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* İletişim Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  İletişim
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowContactModal(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sol Taraf - İletişim Bilgileri */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 mb-4">İletişim Bilgileri</h3>
                  
                  <div className="space-y-3">
                    <a
                      href={`tel:${contactInfo.phone}`}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Phone className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-600">Telefon</div>
                        <div className="font-medium text-gray-900">{contactInfo.phone}</div>
                      </div>
                    </a>

                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-600">E-posta</div>
                        <div className="font-medium text-gray-900">{contactInfo.email}</div>
                      </div>
                    </a>

                    <a
                      href={`https://wa.me/${contactInfo.whatsapp.replace(/\s/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <MessageSquare className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-600">WhatsApp</div>
                        <div className="font-medium text-gray-900">{contactInfo.whatsapp}</div>
                      </div>
                    </a>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium text-gray-900 mb-2">Çalışma Saatleri</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hafta İçi:</span>
                        <span className="font-medium">{contactInfo.workingHours.weekdays}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cumartesi:</span>
                        <span className="font-medium">{contactInfo.workingHours.saturday}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pazar:</span>
                        <span className="font-medium">{contactInfo.workingHours.sunday}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sağ Taraf - İletişim Formu */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Mesaj Gönderin</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adınız Soyadınız *
                    </label>
                    <Input
                      value={contactForm.name}
                      onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Adınız Soyadınız"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      E-posta *
                    </label>
                    <Input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="ornek@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefon
                    </label>
                    <Input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="0555 123 45 67"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mesajınız *
                    </label>
                    <Textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Ödeme ile ilgili sorunuz veya mesajınız..."
                      rows={4}
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-800">
                      <strong>Not:</strong> Mesajınıza otomatik olarak rezervasyon bilgileriniz eklenecektir.
                    </p>
                  </div>

                  <Button
                    onClick={handleSendMessage}
                    disabled={isSendingMessage || !contactForm.name || !contactForm.email || !contactForm.message}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isSendingMessage ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Gönderiliyor...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Mesajı Gönder
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default OdemePage

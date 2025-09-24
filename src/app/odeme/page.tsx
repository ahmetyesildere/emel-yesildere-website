'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CreditCard, Copy, CheckCircle, Upload, ArrowLeft, Clock, User, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/lib/auth/auth-context'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/toast-provider'
import { formatDateForDisplay } from '@/lib/date-utils'

interface SessionData {
  id: string
  consultant: {
    first_name: string
    last_name: string
    avatar_url?: string
  }
  sessionType: {
    name: string
    price: number
    duration_minutes: number
  }
  date: string
  startTime: string
  endTime: string
}

const PaymentPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { success: showSuccess, error: showError } = useToast()

  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [paymentSettings, setPaymentSettings] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentNotes, setPaymentNotes] = useState('')
  const [copiedField, setCopiedField] = useState<string | null>(null)

  useEffect(() => {
    loadSessionData()
    loadPaymentSettings()
  }, [])

  const loadSessionData = async () => {
    const sessionId = searchParams.get('session')
    if (!sessionId) {
      showError('Seans bilgisi bulunamadı')
      router.push('/seans-al')
      return
    }

    try {
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          id,
          session_date,
          start_time,
          duration_minutes,
          price,
          title,
          consultant_id,
          client_id
        `)
        .eq('id', sessionId)
        .single()

      if (error) throw error

      // Consultant bilgilerini al
      const { data: consultantData, error: consultantError } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url')
        .eq('id', data.consultant_id)
        .single()

      if (consultantError) throw consultantError

      // Session data'yı formatla
      const endTime = new Date(`2000-01-01T${data.start_time}`)
      endTime.setMinutes(endTime.getMinutes() + (data.duration_minutes || 90))

      setSessionData({
        id: data.id,
        consultant: consultantData,
        sessionType: {
          name: data.title || 'Danışmanlık Seansı',
          price: data.price || 500,
          duration_minutes: data.duration_minutes || 90
        },
        date: data.session_date,
        startTime: data.start_time,
        endTime: endTime.toTimeString().slice(0, 5)
      })

    } catch (error) {
      console.error('Seans bilgileri yüklenirken hata:', error)
      showError('Seans bilgileri yüklenemedi')
      router.push('/seans-al')
    }
  }

  const loadPaymentSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_settings')
        .select('*')
        .eq('method', 'iban')
        .eq('is_active', true)
        .single()

      if (error) {
        console.error('Payment settings hatası:', error)
        // Hata durumunda varsayılan IBAN bilgilerini kullan
        setPaymentSettings({
          method: 'iban',
          is_active: true,
          settings: {
            recipient_name: "Emel Yeşildere",
            bank_name: "Enpara",
            iban: "TR02 0006 0000 2545 4587 02",
            description_template: "Danışmanlık Hizmeti - {session_date} {session_time}"
          }
        })
      } else {
        setPaymentSettings(data)
      }
    } catch (error) {
      console.error('Ödeme ayarları yüklenirken hata:', error)
      // Fallback IBAN bilgileri
      setPaymentSettings({
        method: 'iban',
        is_active: true,
        settings: {
          recipient_name: "Emel Yeşildere",
          bank_name: "Enpara", 
          iban: "TR02 0006 0000 2545 4587 02",
          description_template: "Danışmanlık Hizmeti - {session_date} {session_time}"
        }
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      showSuccess('Kopyalandı!')
      setTimeout(() => setCopiedField(null), 2000)
    } catch (error) {
      showError('Kopyalama başarısız')
    }
  }

  const submitPayment = async () => {
    if (!sessionData || !user) return

    setIsSubmitting(true)
    try {
      // Session'ı payment_submitted durumuna güncelle
      const { error: sessionError } = await supabase
        .from('sessions')
        .update({
          payment_status: 'payment_submitted',
          session_notes: paymentNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionData.id)

      if (sessionError) throw sessionError

      // Önce consultant ID'sini al
      const { data: sessionDetails, error: sessionDetailsError } = await supabase
        .from('sessions')
        .select('consultant_id')
        .eq('id', sessionData.id)
        .single()

      if (!sessionDetailsError && sessionDetails) {
        // Danışmana bildirim gönder
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert({
            user_id: sessionDetails.consultant_id,
            title: 'Yeni Ödeme Onayı Bekliyor',
            message: `${user.first_name} ${user.last_name} adlı danışan ${formatDate(sessionData.date)} tarihli seans için ödeme yaptığını bildirdi.`,
            type: 'session_payment',
            related_session_id: sessionData.id
          })

        if (notificationError) {
          console.error('Bildirim gönderme hatası:', notificationError)
          // Bildirim hatası kritik değil, devam et
        }
      }



      showSuccess('Ödeme bildiriminiz gönderildi! Danışmanınız onayladıktan sonra bilgilendirileceksiniz.')
      router.push('/client')

    } catch (error) {
      console.error('Ödeme bildirimi gönderilirken hata:', error)
      showError('Ödeme bildirimi gönderilemedi')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return formatDateForDisplay(dateString)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ödeme bilgileri yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!sessionData || !paymentSettings) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Ödeme bilgileri yüklenemedi</p>
          <Button onClick={() => router.push('/seans-al')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri Dön
          </Button>
        </div>
      </div>
    )
  }

  const ibanSettings = paymentSettings.settings

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Ödeme</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Seans Özeti */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Seans Özeti
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  {sessionData.consultant.avatar_url ? (
                    <img
                      src={sessionData.consultant.avatar_url}
                      alt={`${sessionData.consultant.first_name} ${sessionData.consultant.last_name}`}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {sessionData.consultant.first_name} {sessionData.consultant.last_name}
                  </h3>
                  <p className="text-sm text-gray-600">{sessionData.sessionType.name}</p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tarih:</span>
                  <span className="font-medium">{formatDate(sessionData.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saat:</span>
                  <span className="font-medium">{sessionData.startTime} - {sessionData.endTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Süre:</span>
                  <span className="font-medium">{sessionData.sessionType.duration_minutes} dakika</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-green-600 pt-2 border-t">
                  <span>Toplam:</span>
                  <span>{formatPrice(sessionData.sessionType.price)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ödeme Bilgileri */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                Banka Havalesi ile Ödeme
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Önemli:</strong> Ödemenizi yaptıktan sonra aşağıdaki "Ödeme Yaptım" butonuna tıklayarak danışmanınıza bildirim gönderin.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Alıcı Adı Soyadı</p>
                    <p className="font-medium">{ibanSettings.recipient_name}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(ibanSettings.recipient_name, 'name')}
                  >
                    {copiedField === 'name' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Banka</p>
                    <p className="font-medium">{ibanSettings.bank_name}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(ibanSettings.bank_name, 'bank')}
                  >
                    {copiedField === 'bank' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">IBAN</p>
                    <p className="font-medium font-mono">{ibanSettings.iban}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(ibanSettings.iban.replace(/\s/g, ''), 'iban')}
                  >
                    {copiedField === 'iban' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Tutar</p>
                    <p className="font-medium text-green-600">{formatPrice(sessionData.sessionType.price)}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(sessionData.sessionType.price.toString(), 'amount')}
                  >
                    {copiedField === 'amount' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Açıklama</p>
                    <p className="font-medium">Danışmanlık Hizmeti - {formatDate(sessionData.date)} {sessionData.startTime}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(`Danışmanlık Hizmeti - ${formatDate(sessionData.date)} ${sessionData.startTime}`, 'description')}
                  >
                    {copiedField === 'description' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Ödeme Notu (Opsiyonel)
                </label>
                <Textarea
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="Ödeme ile ilgili not ekleyebilirsiniz..."
                  rows={3}
                />
              </div>

              <Button
                onClick={submitPayment}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Bildirim Gönderiliyor...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Ödeme Yaptım
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                Bu butona tıkladığınızda danışmanınıza ödeme yaptığınız bildirilecek ve onay bekleyeceksiniz.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Suspense wrapper component
function PaymentPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>}>
      <PaymentPage />
    </Suspense>
  )
}

export default PaymentPageWrapper
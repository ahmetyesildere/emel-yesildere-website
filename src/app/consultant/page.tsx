'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle, Eye, MessageSquare, Mail, Video } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/lib/auth/auth-context'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/toast-provider'
import MessagesModal from '@/components/consultant/messages-modal'
import { ConsultantAvailabilityWidget } from '@/components/consultant/consultant-availability-widget'
import { getTodayString, formatDateForDisplay } from '@/lib/date-utils'
import { useRouter } from 'next/navigation'

interface Session {
  id: string
  client_id: string
  session_date: string
  start_time: string
  end_time: string
  duration_minutes: number
  type: 'online' | 'in_person'
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
  price: number
  client_notes?: string
  consultant_notes?: string
  client: {
    first_name: string
    last_name: string
    email: string
    phone?: string
  }
  session_type: {
    name: string
    description: string
  }
}

const ConsultantDashboard = () => {
  const { user, profile, isConsultant } = useAuth()
  const { success: showSuccess, error: showError } = useToast()
  const router = useRouter()
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending')
  const [updatingSession, setUpdatingSession] = useState<string | null>(null)
  const [messagesModalOpen, setMessagesModalOpen] = useState(false)
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0)
  const [selectedDate, setSelectedDate] = useState(() => getTodayString())

  useEffect(() => {
    console.log('🔄 useEffect çalıştı:', { userId: user?.id, isConsultant, profile: profile?.role })
    if (user?.id && isConsultant && profile) {
      console.log('✅ Koşullar sağlandı, sessions yükleniyor...')
      loadSessions()
      loadUnreadMessagesCount()
    } else {
      console.log('❌ Koşullar sağlanmadı:', { userId: user?.id, isConsultant, profile: profile?.role })
    }
  }, [user?.id, isConsultant, profile])

  const loadUnreadMessagesCount = async () => {
    if (!user?.id) return

    try {
      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .eq('is_read', false)

      if (error) {
        console.log('Messages tablosuna erişim sorunu, varsayılan değer kullanılıyor')
        setUnreadMessagesCount(0)
        return
      }

      setUnreadMessagesCount(count || 0)
    } catch (error) {
      console.error('Okunmamış mesaj sayısı yüklenirken hata:', error)
      setUnreadMessagesCount(0) // Hata durumunda 0 göster
    }
  }

  const loadSessions = async () => {
    if (!user?.id) return

    console.log('🔍 Sessions yükleniyor...', { consultantId: user.id })
    setIsLoading(true)
    try {
      // Önce sadece sessions'ları al, sonra client bilgilerini ayrı çek
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('consultant_id', user.id)
        .order('session_date', { ascending: true })
        .order('start_time', { ascending: true })

      if (error) {
        console.error('❌ Sessions yükleme hatası:', error)
        throw error
      }

      console.log('✅ Sessions yüklendi:', { count: data?.length, data })
      console.log('📊 Payment status dağılımı:', {
        payment_submitted: data?.filter(s => s.payment_status === 'payment_submitted').length,
        confirmed: data?.filter(s => s.status === 'confirmed').length,
        total: data?.length
      })
      
      // Her session'ın detaylarını göster
      console.log('🔍 SESSION DETAYLARI:')
      data?.forEach((session, index) => {
        console.log(`📋 Session ${index + 1}:`, {
          id: session.id,
          title: session.title,
          price: session.price,
          payment_status: session.payment_status,
          status: session.status,
          date: session.session_date
        })
      })
      console.log('🔍 SESSION DETAYLARI SONU')

      // Client bilgilerini ayrı çek
      if (data && data.length > 0) {
        const clientIds = [...new Set(data.map(session => session.client_id))]
        
        const { data: clientsData, error: clientsError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email, phone')
          .in('id', clientIds)

        if (!clientsError && clientsData) {
          // Sessions'lara client bilgilerini ekle
          const sessionsWithClients = data.map(session => ({
            ...session,
            client: clientsData.find(client => client.id === session.client_id),
            session_type: { 
              name: session.title || 'Genel Danışmanlık', 
              description: 'Danışmanlık seansı' 
            }
          }))
          
          setSessions(sessionsWithClients)
        } else {
          setSessions(data || [])
        }
      } else {
        setSessions(data || [])
      }
    } catch (error) {
      console.error('Seanslar yüklenirken hata:', error)
      showError('Seanslar yüklenemedi')
    } finally {
      setIsLoading(false)
    }
  }

  const updateSessionStatus = async (sessionId: string, newStatus: string) => {
    console.log('🔄 Seans durumu güncelleniyor...', { sessionId, newStatus })
    setUpdatingSession(sessionId)

    try {
      const session = sessions.find(s => s.id === sessionId)
      if (!session) throw new Error('Seans bulunamadı')

      const updateData: any = { 
        status: newStatus, 
        updated_at: new Date().toISOString() 
      }

      // Eğer onaylama işlemiyse payment_status'u da güncelle
      if (newStatus === 'confirmed') {
        updateData.payment_status = 'confirmed'
        // Constraint sorunu varsa 'scheduled' kullan
        updateData.status = 'scheduled'
        newStatus = 'scheduled'
      }
      
      // Eğer tamamlama işlemiyse consultant_notes'u kullan (session_status yerine)
      if (newStatus === 'completed') {
        updateData.consultant_notes = 'COMPLETED'
        // Status'u değiştirme, constraint sorunu olabilir
        delete updateData.status
        newStatus = 'completed' // Filtreleme için
      }

      const { data, error } = await supabase
        .from('sessions')
        .update(updateData)
        .eq('id', sessionId)
        .select()

      console.log('📥 Supabase yanıtı:', { data, error })

      if (error) {
        console.error('❌ Supabase hatası:', error)
        throw error
      }

      // Danışana bildirim gönder
      if (newStatus === 'confirmed') {
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert({
            user_id: session.client_id,
            title: 'Seansınız Onaylandı!',
            message: `${formatDate(session.session_date.split('T')[0])} tarihli seansınız onaylandı. Seans saatinde hazır olunuz.`,
            type: 'session_confirmed',
            related_session_id: sessionId
          })

        if (notificationError) {
          console.error('Bildirim gönderme hatası:', notificationError)
        }
      }
      
      // Seans tamamlandığında danışana bildirim gönder
      if (newStatus === 'completed') {
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert({
            user_id: session.client_id,
            title: 'Seansınız Tamamlandı!',
            message: `${formatDate(session.session_date.split('T')[0])} tarihli seansınız tamamlandı. Deneyiminizi değerlendirmek ister misiniz?`,
            type: 'session_completed',
            related_session_id: sessionId
          })

        if (notificationError) {
          console.error('Bildirim gönderme hatası:', notificationError)
        }
      }

      console.log('✅ Seans durumu güncellendi:', data)

      const statusMessages = {
        confirmed: 'onaylandı',
        cancelled: 'iptal edildi',
        completed: 'tamamlandı olarak işaretlendi'
      }

      showSuccess(`Seans ${statusMessages[newStatus as keyof typeof statusMessages] || 'güncellendi'}`)
      loadSessions() // Listeyi yenile
    } catch (error) {
      console.error('💥 Seans durumu güncellenirken hata:', error)

      if (error?.message) {
        showError(`Hata: ${error.message}`)
      } else {
        showError('Seans durumu güncellenemedi')
      }
    } finally {
      setUpdatingSession(null)
    }
  }

  // Seansa katılma fonksiyonu
  const joinSession = async (sessionId: string) => {
    console.log('🚀 Danışman seansa katılıyor:', sessionId)
    router.push(`/session-room/${sessionId}`)
  }

  // Danışana seans başlatma isteği gönder
  const sendSessionStartRequest = async (sessionId: string) => {
    try {
      const session = sessions.find(s => s.id === sessionId)
      if (!session) {
        showError('Seans bulunamadı')
        return
      }

      console.log('📤 Seans başlatma isteği gönderiliyor...', {
        sessionId,
        clientId: session.client_id,
        consultantName: `${profile?.first_name} ${profile?.last_name}`
      })

      // Test aşaması için bildirim göndermeyi atla, sadece mesaj göster
      try {
        // Danışana bildirim gönder (isteğe bağlı)
        const { error } = await supabase
          .from('notifications')
          .insert({
            user_id: session.client_id,
            title: '🎥 Seans Başlatma İsteği',
            message: `${profile?.first_name} ${profile?.last_name} seansınızı başlatmak istiyor. Seans odasına katılmak için "Seansa Katıl" butonuna tıklayın.`,
            type: 'session_start_request',
            related_session_id: sessionId,
            action_url: `/session-room/${sessionId}`
          })

        if (error) {
          console.warn('⚠️ Bildirim gönderilemedi (normal, test aşaması):', error.message)
        } else {
          console.log('✅ Bildirim başarıyla gönderildi')
        }
      } catch (notificationError) {
        console.warn('⚠️ Bildirim sistemi mevcut değil, test modunda devam ediliyor')
      }

      // Test aşaması mesajı
      showSuccess('🚀 Test Modu: Seans başlatıldı! Danışan da artık seansa katılabilir.')
      
      // Danışman hemen seansa katılsın
      setTimeout(() => {
        joinSession(sessionId)
      }, 1000)

    } catch (error) {
      console.error('Seans başlatma hatası:', error)
      // Test aşamasında hata olsa bile devam et
      showSuccess('🚀 Test Modu: Seans başlatıldı! (Bildirim sistemi devre dışı)')
      setTimeout(() => {
        joinSession(sessionId)
      }, 1000)
    }
  }

  // Test aşaması için seans zamanı kontrolü - her zaman true
  const canJoinSession = (sessionDate: string, startTime: string, endTime: string) => {
    return true // Test aşaması için her zaman aktif
  }

  // Test aşaması için seans durumu mesajı
  const getSessionTimeStatus = (sessionDate: string, startTime: string, endTime: string) => {
    return { 
      status: 'can_join', 
      message: 'Test Modu: Seans başlatılabilir', 
      color: 'text-green-600' 
    }
  }

  const getStatusBadge = (session: any) => {
    // Gerçek duruma göre badge göster
    let label, color
    
    if (session.consultant_notes === 'COMPLETED') {
      label = 'Tamamlandı'
      color = 'bg-blue-100 text-blue-800'
    } else if (session.payment_status === 'confirmed') {
      label = 'Onaylandı'
      color = 'bg-green-100 text-green-800'
    } else if (session.payment_status === 'pending' || session.payment_status === 'payment_submitted') {
      label = 'Bekliyor'
      color = 'bg-yellow-100 text-yellow-800'
    } else {
      label = 'Bilinmiyor'
      color = 'bg-gray-100 text-gray-800'
    }

    return <Badge className={color}>{label}</Badge>
  }

  const getSessionsByStatus = (status: string) => {
    if (status === 'pending') {
      // Bekleyen seanslar: payment_status 'pending' veya 'payment_submitted' olanlar
      return sessions.filter(session => 
        session.payment_status === 'pending' || session.payment_status === 'payment_submitted'
      )
    }
    if (status === 'confirmed') {
      // Onaylanan seanslar: payment_status 'confirmed' ama consultant_notes 'COMPLETED' olmayan
      return sessions.filter(session => 
        session.payment_status === 'confirmed' && session.consultant_notes !== 'COMPLETED'
      )
    }
    if (status === 'completed') {
      // Tamamlanan seanslar: consultant_notes 'COMPLETED' olanlar
      return sessions.filter(session => session.consultant_notes === 'COMPLETED')
    }
    return sessions.filter(session => session.status === status)
  }





  const formatDate = (date: string) => {
    return formatDateForDisplay(date)
  }

  const formatTime = (time: string | null | undefined) => {
    if (!time) return '--:--'
    return time.slice(0, 5)
  }

  // Çıkış yönlendirme useEffect'i - her zaman çalışır
  React.useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => {
        router.push('/')
      }, 1500)
      
      return () => clearTimeout(timer)
    }
  }, [user, router])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ana Sayfaya Yönlendiriliyorsunuz</h2>
          <p className="text-gray-600">Lütfen bekleyin...</p>
        </div>
      </div>
    )
  }

  // Profile yüklenene kadar loading göster
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profil Yükleniyor</h2>
          <p className="text-gray-600">Lütfen bekleyin...</p>
        </div>
      </div>
    )
  }

  if (!isConsultant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Yetkisiz Erişim</h2>
          <p className="text-gray-600">Bu sayfaya sadece danışmanlar erişebilir.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Danışman Paneli
                </h1>
                <p className="text-gray-600">
                  Hoş geldiniz, {profile?.first_name}! Seanslarınızı yönetin.
                </p>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={() => setMessagesModalOpen(true)}
                  className="bg-purple-600 hover:bg-purple-700 relative"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Mesajlar
                  {unreadMessagesCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
                      {unreadMessagesCount}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <AlertCircle className="w-8 h-8 text-yellow-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {getSessionsByStatus('pending').length}
                    </p>
                    <p className="text-sm text-gray-600">Bekleyen Seanslar</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {getSessionsByStatus('confirmed').length}
                    </p>
                    <p className="text-sm text-gray-600">Onaylanan Seanslar</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Calendar className="w-8 h-8 text-blue-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {getSessionsByStatus('completed').length}
                    </p>
                    <p className="text-sm text-gray-600">Tamamlanan Seanslar</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <XCircle className="w-8 h-8 text-red-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {getSessionsByStatus('cancelled').length}
                    </p>
                    <p className="text-sm text-gray-600">İptal Edilen Seanslar</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Tabs */}
          <Card>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="border-b border-gray-200">
                  <TabsList className="grid w-full grid-cols-5 h-auto p-1">
                    <TabsTrigger value="availability" className="py-3">
                      Müsaitlik Takvimi
                    </TabsTrigger>
                    <TabsTrigger value="pending" className="py-3">
                      Bekleyen ({getSessionsByStatus('pending').length})
                    </TabsTrigger>
                    <TabsTrigger value="confirmed" className="py-3">
                      Onaylanan ({getSessionsByStatus('confirmed').length})
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="py-3">
                      Tamamlanan ({getSessionsByStatus('completed').length})
                    </TabsTrigger>
                    <TabsTrigger value="cancelled" className="py-3">
                      İptal Edilen ({getSessionsByStatus('cancelled').length})
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Müsaitlik Takvimi Tab */}
                <TabsContent value="availability" className="p-6">
                  <div className="space-y-6">
                    {/* Tarih Seçici */}
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Müsaitlik Ayarları</h3>
                      <div className="flex items-center space-x-2">
                        <label htmlFor="date-picker" className="text-sm font-medium text-gray-700">
                          Tarih Seçin:
                        </label>
                        <input
                          id="date-picker"
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          min={getTodayString()} // Bugünden önceki tarihler seçilemez
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    
                    {/* Yeni Müsaitlik Widget'ı */}
                    <ConsultantAvailabilityWidget 
                      selectedDate={selectedDate}
                      onDateChange={setSelectedDate}
                    />
                  </div>
                </TabsContent>

                {['pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                  <TabsContent key={status} value={status} className="p-6">
                    {isLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-gray-600 mt-2">Seanslar yükleniyor...</p>
                      </div>
                    ) : getSessionsByStatus(status).length > 0 ? (
                      <div className="space-y-4">
                        {getSessionsByStatus(status).map((session) => (
                          <Card key={session.id} className="border-l-4 border-l-blue-500">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3 mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                      {session.session_type?.name}
                                    </h3>
                                    {getStatusBadge(session)}
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                    <div className="flex items-center">
                                      <User className="w-4 h-4 mr-2" />
                                      {session.client?.first_name} {session.client?.last_name}
                                    </div>
                                    <div className="flex items-center">
                                      <Calendar className="w-4 h-4 mr-2" />
                                      {session.session_date ? formatDate(session.session_date.split('T')[0]) : 'Tarih belirtilmemiş'}
                                    </div>
                                    <div className="flex items-center">
                                      <Clock className="w-4 h-4 mr-2" />
                                      {formatTime(session.start_time)} - {(() => {
                                        if (!session.start_time) return '--:--'
                                        const [hours, minutes] = session.start_time.split(':').map(Number)
                                        const totalMinutes = hours * 60 + minutes + (session.duration_minutes || 90)
                                        const endHours = Math.floor(totalMinutes / 60)
                                        const endMins = totalMinutes % 60
                                        return `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`
                                      })()}
                                    </div>
                                    <div className="flex items-center">
                                      <Badge 
                                        variant="outline" 
                                        className={`text-xs ${
                                          session.type === 'online' 
                                            ? 'border-green-500 text-green-700 bg-green-50' 
                                            : 'border-blue-500 text-blue-700 bg-blue-50'
                                        }`}
                                      >
                                        {session.type === 'online' ? (
                                          <>
                                            <Video className="w-3 h-3 mr-1" />
                                            Online
                                          </>
                                        ) : (
                                          <>
                                            <User className="w-3 h-3 mr-1" />
                                            Yüz Yüze
                                          </>
                                        )}
                                      </Badge>
                                    </div>
                                  </div>

                                  {session.client_notes && (
                                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                      <div className="flex items-start">
                                        <MessageSquare className="w-4 h-4 text-gray-500 mr-2 mt-0.5" />
                                        <div>
                                          <p className="text-sm font-medium text-gray-700">Danışan Notu:</p>
                                          <p className="text-sm text-gray-600">{session.client_notes}</p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <div className="flex flex-col space-y-2 ml-4">
                                  {/* Bekleyen seanslar (ödeme bildirimi yapılmış) */}
                                  {(session.payment_status === 'pending' || session.payment_status === 'payment_submitted') && (
                                    <>
                                      <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                                        💰 Ödeme bildirimi yapıldı
                                      </div>
                                      <Button
                                        size="sm"
                                        onClick={() => updateSessionStatus(session.id, 'confirmed')}
                                        disabled={updatingSession === session.id}
                                        className="bg-green-600 hover:bg-green-700"
                                      >
                                        <CheckCircle className="w-4 h-4 mr-1" />
                                        {updatingSession === session.id ? 'Onaylanıyor...' : 'Ödemeyi Onayla'}
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => updateSessionStatus(session.id, 'cancelled')}
                                        disabled={updatingSession === session.id}
                                        className="text-red-600 border-red-600 hover:bg-red-50"
                                      >
                                        <XCircle className="w-4 h-4 mr-1" />
                                        Reddet
                                      </Button>
                                    </>
                                  )}
                                  
                                  {/* Onaylanmış seanslar - sadece tamamlanmamış olanlar için buton göster */}
                                  {session.payment_status === 'confirmed' && session.consultant_notes !== 'COMPLETED' && (
                                    <>
                                      {/* Video Call Butonu - Online seanslar için */}
                                      {session.type === 'online' && (
                                        <div className="mb-2 space-y-2">
                                          {/* Test Modu Bilgilendirmesi */}
                                          <div className="p-2 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
                                            <div className="flex items-center space-x-2">
                                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                              <span className="text-xs font-medium text-green-700">
                                                Test Modu Aktif
                                              </span>
                                            </div>
                                            <p className="text-xs text-blue-600 mt-1">
                                              {getSessionTimeStatus(session.session_date?.split('T')[0] || '', session.start_time, session.end_time).message}
                                            </p>
                                          </div>

                                          {/* Seans Başlatma Butonu */}
                                          <Button
                                            size="sm"
                                            onClick={() => sendSessionStartRequest(session.id)}
                                            className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg"
                                            title="Danışana seans başlatma isteği gönder ve seansa katıl"
                                          >
                                            <Video className="w-4 h-4 mr-2" />
                                            🚀 Seansı Başlat
                                          </Button>

                                          {/* Direkt Katılım Butonu */}
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => joinSession(session.id)}
                                            className="w-full border-green-600 text-green-600 hover:bg-green-50"
                                            title="Direkt seans odasına katıl"
                                          >
                                            <Video className="w-4 h-4 mr-2" />
                                            Direkt Katıl
                                          </Button>

                                          <div className="text-xs text-gray-500 text-center">
                                            "Seansı Başlat" danışana bildirim gönderir
                                          </div>
                                        </div>
                                      )}
                                      
                                      <Button
                                        size="sm"
                                        onClick={() => updateSessionStatus(session.id, 'completed')}
                                        disabled={updatingSession === session.id}
                                        className="bg-blue-600 hover:bg-blue-700"
                                      >
                                        <CheckCircle className="w-4 h-4 mr-1" />
                                        {updatingSession === session.id ? 'Tamamlanıyor...' : 'Seansı Tamamla'}
                                      </Button>
                                    </>
                                  )}
                                  
                                  {/* Diğer durumlar için eski butonlar */}
                                  {session.status === 'pending' && session.payment_status !== 'confirmed' && (
                                    <>
                                      <Button
                                        size="sm"
                                        onClick={() => updateSessionStatus(session.id, 'confirmed')}
                                        disabled={updatingSession === session.id}
                                        className="bg-green-600 hover:bg-green-700"
                                      >
                                        <CheckCircle className="w-4 h-4 mr-1" />
                                        {updatingSession === session.id ? 'Onaylanıyor...' : 'Onayla'}
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => updateSessionStatus(session.id, 'cancelled')}
                                        disabled={updatingSession === session.id}
                                        className="text-red-600 border-red-600 hover:bg-red-50"
                                      >
                                        <XCircle className="w-4 h-4 mr-1" />
                                        {updatingSession === session.id ? 'İptal Ediliyor...' : 'İptal Et'}
                                      </Button>
                                    </>
                                  )}

                                  {session.status === 'confirmed' && (
                                    <Button
                                      size="sm"
                                      onClick={() => updateSessionStatus(session.id, 'completed')}
                                      disabled={updatingSession === session.id}
                                      className="bg-blue-600 hover:bg-blue-700"
                                    >
                                      <CheckCircle className="w-4 h-4 mr-1" />
                                      {updatingSession === session.id ? 'Tamamlanıyor...' : 'Tamamlandı'}
                                    </Button>
                                  )}

                                  {/* Tamamlanan seanslar için kayıt görüntüleme */}
                                  {session.consultant_notes === 'COMPLETED' && session.type === 'online' && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        // Gelecekte kayıt görüntüleme özelliği eklenecek
                                        showSuccess('Kayıt özelliği yakında eklenecek')
                                      }}
                                      className="text-purple-600 border-purple-600 hover:bg-purple-50"
                                    >
                                      <Video className="w-4 h-4 mr-1" />
                                      Seans Kaydı
                                    </Button>
                                  )}

                                  <div className="text-right">
                                    <p className="text-lg font-bold text-green-600">
                                      ₺{session.price || 'Belirtilmemiş'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>
                          {status === 'pending' && 'Henüz bekleyen seans bulunmuyor'}
                          {status === 'confirmed' && 'Henüz onaylanmış seans bulunmuyor'}
                          {status === 'completed' && 'Henüz tamamlanmış seans bulunmuyor'}
                          {status === 'cancelled' && 'Henüz iptal edilmiş seans bulunmuyor'}
                        </p>
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Messages Modal */}
      <MessagesModal
        isOpen={messagesModalOpen}
        onClose={() => {
          setMessagesModalOpen(false)
          loadUnreadMessagesCount() // Mesaj sayısını yenile
        }}
      />


    </div>
  )
}

export default ConsultantDashboard
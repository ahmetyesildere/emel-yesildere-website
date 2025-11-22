'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, Clock, User, Star, MessageSquare, Phone, Mail, MapPin, Video, Plus, Eye, XCircle, Send, AlertCircle, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/auth/auth-context'
import { supabase } from '@/lib/supabase'
import { useToast, ToastContainer } from '@/components/ui/toast-provider'
import { useRouter } from 'next/navigation'
import MessagesModal from '@/components/consultant/messages-modal'

interface Session {
  id: string
  consultant_id: string
  session_date: string
  start_time: string
  end_time: string
  duration_minutes: number
  type: 'online' | 'in_person'
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
  price: number
  client_notes?: string
  consultant_notes?: string
  rating?: number
  feedback?: string
  meeting_link?: string
  consultant: {
    first_name: string
    last_name: string
    email: string
    phone?: string
    avatar_url?: string
    bio?: string
  }
  session_type: {
    name: string
    description: string
  }
}

const ClientDashboard = () => {
  const { user, profile } = useAuth()
  const { toasts, showSuccess, showError, removeToast } = useToast()
  const router = useRouter()
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending')
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false)
  const [cancellingSession, setCancellingSession] = useState<string | null>(null)

  // Message states
  const [messagesModalOpen, setMessagesModalOpen] = useState(false)
  const [messageModalOpen, setMessageModalOpen] = useState(false)
  const [selectedConsultant, setSelectedConsultant] = useState<Session | null>(null)
  const [messageSubject, setMessageSubject] = useState('')
  const [messageContent, setMessageContent] = useState('')
  const [isSendingMessage, setIsSendingMessage] = useState(false)
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0)

  useEffect(() => {
    if (user?.id && profile) {
      console.log('🔄 Client Dashboard: Loading sessions for user:', user.email, 'Profile role:', profile.role)
      loadSessions()
      loadUnreadMessagesCount()
    }
  }, [user?.id, profile])

  // Seansa katılma fonksiyonu
  const joinSession = async (sessionId: string) => {
    console.log('🎯 Danışan seansa katılıyor:', sessionId)
    
    // Test aşaması için basit yönlendirme
    router.push(`/session-room/${sessionId}`)
  }

  // Seans zamanı kontrolü - TEST MODU: Her zaman aktif
  const canJoinSession = (sessionDate: string, startTime: string, endTime: string) => {
    // TEST AŞAMASI: Her zaman true döndür
    return true
  }

  // Seans durumu mesajı - TEST MODU: Her zaman hazır
  const getSessionTimeStatus = (sessionDate: string, startTime: string, endTime: string) => {
    // TEST AŞAMASI: Her zaman katılım hazır mesajı
    return { status: 'can_join', message: 'Test Modu: Danışman seansı başlattığında katılabilirsiniz', color: 'text-green-600' }
  }

  const loadSessions = async () => {
    if (!user?.id) return

    setIsLoading(true)
    try {
      console.log('🔍 Client sessions yükleniyor...', user.id)
      
      // Önce basit sorgu ile test et
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('💥 Supabase hatası:', error)
        throw error
      }

      console.log('✅ Sessions yüklendi:', data?.length || 0, 'adet')
      
      // Consultant bilgilerini ayrı ayrı yükle
      if (data && data.length > 0) {
        const sessionsWithConsultants = await Promise.all(
          data.map(async (session) => {
            try {
              const { data: consultant } = await supabase
                .from('profiles')
                .select('first_name, last_name, email, phone, avatar_url, bio')
                .eq('id', session.consultant_id)
                .single()
              
              return {
                ...session,
                consultant: consultant || {
                  first_name: 'Bilinmeyen',
                  last_name: 'Danışman',
                  email: '',
                  phone: '',
                  avatar_url: null,
                  bio: ''
                },
                session_type: {
                  name: session.title || 'Danışmanlık Seansı',
                  description: session.description || ''
                }
              }
            } catch (consultantError) {
              console.error('Consultant bilgisi yüklenemedi:', consultantError)
              return {
                ...session,
                consultant: {
                  first_name: 'Bilinmeyen',
                  last_name: 'Danışman',
                  email: '',
                  phone: '',
                  avatar_url: null,
                  bio: ''
                },
                session_type: {
                  name: session.title || 'Danışmanlık Seansı',
                  description: session.description || ''
                }
              }
            }
          })
        )
        
        setSessions(sessionsWithConsultants)
      } else {
        setSessions([])
      }

    } catch (error) {
      console.error('💥 Seanslar yüklenirken hata:', error)
      console.error('Seanslar yüklenemedi: ' + (error as Error).message)
      setSessions([])
    } finally {
      setIsLoading(false)
    }
  }

  const loadUnreadMessagesCount = async () => {
    if (!user?.id) return

    try {
      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .eq('is_read', false)

      if (error) throw error

      setUnreadMessagesCount(count || 0)
    } catch (error) {
      console.error('Okunmamış mesaj sayısı yüklenirken hata:', error)
    }
  }

  const sendMessage = async () => {
    if (!user?.id || !selectedConsultant || !messageContent.trim()) return

    setIsSendingMessage(true)
    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          sender_id: user.id,
          receiver_id: selectedConsultant.consultant_id,
          subject: messageSubject.trim() || null,
          content: messageContent.trim(),
          session_id: selectedConsultant.id
        }])

      if (error) throw error

      showSuccess('Mesajınız başarıyla gönderildi')
      setMessageModalOpen(false)
      setSelectedConsultant(null)
      setMessageSubject('')
      setMessageContent('')
    } catch (error) {
      console.error('Mesaj gönderilirken hata:', error)
      showError('Mesaj gönderilemedi')
    } finally {
      setIsSendingMessage(false)
    }
  }

  const cancelSession = async (sessionId: string) => {
    setCancellingSession(sessionId)
    try {
      const { error } = await supabase
        .from('sessions')
        .update({ status: 'cancelled' })
        .eq('id', sessionId)

      if (error) throw error

      showSuccess('Seans başarıyla iptal edildi')
      loadSessions()
    } catch (error) {
      console.error('Seans iptal edilirken hata:', error)
      showError('Seans iptal edilemedi')
    } finally {
      setCancellingSession(null)
    }
  }

  const submitFeedback = async () => {
    if (!selectedSession || rating === 0) {
      showError('Lütfen bir puan verin')
      return
    }

    setIsSubmittingFeedback(true)
    try {
      const { error } = await supabase
        .from('sessions')
        .update({
          rating,
          feedback: feedback || null
        })
        .eq('id', selectedSession.id)

      if (error) throw error

      showSuccess('Değerlendirmeniz kaydedildi')
      setSelectedSession(null)
      setRating(0)
      setFeedback('')
      loadSessions()
    } catch (error) {
      console.error('Değerlendirme kaydedilirken hata:', error)
      showError('Değerlendirme kaydedilemedi')
    } finally {
      setIsSubmittingFeedback(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Onay Bekliyor', color: 'bg-yellow-100 text-yellow-800' },
      confirmed: { label: 'Onaylandı', color: 'bg-green-100 text-green-800' },
      completed: { label: 'Tamamlandı', color: 'bg-blue-100 text-blue-800' },
      cancelled: { label: 'İptal Edildi', color: 'bg-red-100 text-red-800' },
      no_show: { label: 'Katılmadı', color: 'bg-gray-100 text-gray-800' }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const getSessionsByStatus = (status: string) => {
    // Client dashboard için danışman dashboard ile aynı mantık
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
    return new Date(date).toLocaleDateString('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (time: string) => {
    return time ? time.slice(0, 5) : '--:--'
  }

  const canCancelSession = (session: Session) => {
    const sessionDateTime = new Date(`${session.session_date}T${session.start_time}`)
    const now = new Date()
    const hoursDiff = (sessionDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)

    return (session.status === 'pending' || session.status === 'confirmed') && hoursDiff > 24
  }

  const renderStars = (currentRating: number, interactive: boolean = false) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && setRating(star)}
            disabled={!interactive}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
          >
            <Star
              className={`w-5 h-5 ${star <= currentRating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
                }`}
            />
          </button>
        ))}
      </div>
    )
  }

  if (!user) {
    // Çıkış işlemi sırasında yönlendirme mesajı göster
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    }, 1000)
    
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Seanslarım
                </h1>
                <p className="text-gray-600">
                  Hoş geldiniz, {profile?.first_name}! Seanslarınızı yönetin ve yeni seans alın.
                </p>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={() => setMessagesModalOpen(true)}
                  className="bg-purple-600 hover:bg-purple-700 relative"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
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

          {/* Quick Actions */}
          <div className="mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Yeni Seans Almak İster misiniz?
                    </h3>
                    <p className="text-gray-600">
                      Uzman danışmanlarımızdan randevu alın ve kişisel gelişim yolculuğunuza devam edin.
                    </p>
                  </div>
                  <Button
                    onClick={() => router.push('/seans-al')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Yeni Seans Al
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Cards - Danışman dashboard ile aynı */}
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

          {/* Sessions Tabs - Danışman dashboard ile aynı yapı */}
          <Card>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="border-b border-gray-200">
                  <TabsList className="grid w-full grid-cols-4 h-auto p-1">
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

                {['pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                  <TabsContent key={status} value={status} className="mt-6">
                    {/* Onaylanan Seanslar için Özel Bilgilendirme */}
                    {status === 'confirmed' && !isLoading && getSessionsByStatus(status).length > 0 && (
                      <div className="mb-6 p-6 bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 border border-green-200 rounded-xl">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                              <Video className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              🎉 Seanslarınız Hazır!
                            </h3>
                            <p className="text-gray-700 mb-4">
                              Onaylanan seanslarınız için video call odaları hazır. Seans saatiniz geldiğinde 
                              <strong className="text-green-700"> "Seans Odasına Gir" </strong> 
                              butonuna tıklayarak danışmanınızla görüşmeye başlayabilirsiniz.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center space-x-2 text-green-700">
                                <CheckCircle className="w-4 h-4" />
                                <span>Otomatik oda oluşturma</span>
                              </div>
                              <div className="flex items-center space-x-2 text-blue-700">
                                <Video className="w-4 h-4" />
                                <span>HD video kalitesi</span>
                              </div>
                              <div className="flex items-center space-x-2 text-purple-700">
                                <MessageSquare className="w-4 h-4" />
                                <span>Anlık mesajlaşma</span>
                              </div>
                              <div className="flex items-center space-x-2 text-orange-700">
                                <Phone className="w-4 h-4" />
                                <span>Kristal ses kalitesi</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {isLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-gray-600 mt-2">Seanslar yükleniyor...</p>
                      </div>
                    ) : getSessionsByStatus(status).length > 0 ? (
                      <div className="space-y-4">
                        {getSessionsByStatus(status).map((session) => (
                          <Card key={session.id} className="border-l-4 border-l-purple-500">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3 mb-3">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                      {session.session_type?.name}
                                    </h3>
                                    {getStatusBadge(session.status)}
                                  </div>

                                  {/* Consultant Info */}
                                  <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                      {session.consultant?.avatar_url ? (
                                        <img
                                          src={session.consultant.avatar_url}
                                          alt={`${session.consultant.first_name} ${session.consultant.last_name}`}
                                          className="w-full h-full rounded-full object-cover"
                                        />
                                      ) : (
                                        <User className="w-6 h-6 text-white" />
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-medium text-gray-900">
                                        {session.consultant?.first_name} {session.consultant?.last_name}
                                      </h4>
                                      <p className="text-sm text-gray-600">
                                        Danışman
                                      </p>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setSelectedConsultant(session)
                                        setMessageModalOpen(true)
                                      }}
                                      className="text-purple-600 border-purple-600 hover:bg-purple-50"
                                    >
                                      <Send className="w-4 h-4 mr-1" />
                                      Mesaj Gönder
                                    </Button>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                                    <div className="flex items-center">
                                      <Calendar className="w-4 h-4 mr-2" />
                                      {formatDate(session.session_date)}
                                    </div>
                                    <div className="flex items-center">
                                      <Clock className="w-4 h-4 mr-2" />
                                      {formatTime(session.start_time)} - {formatTime(session.end_time)}
                                    </div>
                                    <div className="flex items-center">
                                      {session.type === 'online' ? (
                                        <><Video className="w-4 h-4 mr-2" />Online Seans</>
                                      ) : (
                                        <><MapPin className="w-4 h-4 mr-2" />Yüz Yüze Seans</>
                                      )}
                                    </div>
                                    <div className="flex items-center">
                                      <span className="text-lg font-bold text-green-600">
                                        ₺{session.price}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Client Notes */}
                                  {session.client_notes && (
                                    <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                                      <div className="flex items-start">
                                        <MessageSquare className="w-4 h-4 text-blue-500 mr-2 mt-0.5" />
                                        <div>
                                          <p className="text-sm font-medium text-blue-700">Notlarınız:</p>
                                          <p className="text-sm text-blue-600">{session.client_notes}</p>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Onaylanan Seanslar için Hatırlatmalar */}
                                  {status === 'confirmed' && (
                                    <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
                                      <div className="flex items-start">
                                        <AlertCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                                        <div className="flex-1">
                                          <h4 className="text-sm font-semibold text-green-800 mb-2">
                                            🎉 Seansınız Onaylandı! Hazırlık Önerileri:
                                          </h4>
                                          <ul className="text-sm text-green-700 space-y-1">
                                            <li>• <strong>Seans saatinden 5-10 dakika önce</strong> sisteme giriş yapın</li>
                                            <li>• <strong>Sessiz bir ortam</strong> seçin ve kulaklık kullanın</li>
                                            <li>• <strong>İnternet bağlantınızı</strong> kontrol edin</li>
                                            <li>• <strong>Kamera ve mikrofonunuzun</strong> çalıştığından emin olun</li>
                                            <li>• Seansla ilgili <strong>sorularınızı önceden not alın</strong></li>
                                            <li>• Seans sırasında <strong>not tutmaya hazır olun</strong></li>
                                          </ul>
                                          <div className="mt-3 p-2 bg-white/50 rounded border-l-4 border-blue-400">
                                            <p className="text-xs text-blue-700">
                                              <strong>💡 İpucu:</strong> Seans saati geldiğinde "Seansa Katıl" butonu aktif olacak. 
                                              Teknik sorun yaşarsanız danışmanınıza mesaj gönderebilirsiniz.
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Consultant Notes */}
                                  {session.consultant_notes && (
                                    <div className="mb-3 p-3 bg-green-50 rounded-lg">
                                      <div className="flex items-start">
                                        <MessageSquare className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                                        <div>
                                          <p className="text-sm font-medium text-green-700">Danışman Notu:</p>
                                          <p className="text-sm text-green-600">{session.consultant_notes}</p>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Rating Display */}
                                  {session.rating && session.rating > 0 && (
                                    <div className="mb-3 p-3 bg-yellow-50 rounded-lg">
                                      <div className="flex items-start">
                                        <Star className="w-4 h-4 text-yellow-500 mr-2 mt-0.5" />
                                        <div>
                                          <p className="text-sm font-medium text-yellow-700 mb-1">Değerlendirmeniz:</p>
                                          <div className="flex items-center space-x-2">
                                            {renderStars(session.rating)}
                                            <span className="text-sm text-yellow-600">({session.rating}/5)</span>
                                          </div>
                                          {session.feedback && (
                                            <p className="text-sm text-yellow-600 mt-1">{session.feedback}</p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <div className="flex flex-col space-y-2 ml-4">
                                  {/* Cancel Button */}
                                  {canCancelSession(session) && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => cancelSession(session.id)}
                                      disabled={cancellingSession === session.id}
                                      className="text-red-600 border-red-600 hover:bg-red-50"
                                    >
                                      <XCircle className="w-4 h-4 mr-1" />
                                      {cancellingSession === session.id ? 'İptal Ediliyor...' : 'İptal Et'}
                                    </Button>
                                  )}

                                  {/* Rate Button */}
                                  {session.status === 'completed' && (!session.rating || session.rating === 0) && (
                                    <Button
                                      size="sm"
                                      onClick={() => setSelectedSession(session)}
                                      className="bg-yellow-600 hover:bg-yellow-700"
                                    >
                                      <Star className="w-4 h-4 mr-1" />
                                      Değerlendir
                                    </Button>
                                  )}

                                  {/* Video Call Butonu - Online seanslar için */}
                                  {session.payment_status === 'confirmed' && session.type === 'online' && (
                                    <div className="space-y-2">
                                      {/* Seans Durumu */}
                                      <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                                        <div className="flex items-center justify-between mb-2">
                                          <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                            <span className="text-xs font-medium text-green-700">
                                              🧪 Test Modu Aktif
                                            </span>
                                          </div>
                                          <Badge className="bg-green-100 text-green-800 text-xs">
                                            Online
                                          </Badge>
                                        </div>
                                        <p className="text-xs text-green-600 mb-1">
                                          {getSessionTimeStatus(session.session_date?.split('T')[0] || '', session.start_time, session.end_time).message}
                                        </p>
                                        <p className="text-xs text-blue-600 font-medium">
                                          💡 Danışmanınız "Seansı Başlat" dediğinde buradan katılabilirsiniz
                                        </p>
                                      </div>

                                      {/* Debug Bilgisi */}
                                      <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
                                        Debug: payment_status={session.payment_status}, type={session.type}, 
                                        canJoin={canJoinSession(session.session_date?.split('T')[0] || '', session.start_time, session.end_time).toString()}
                                      </div>

                                      {/* Seans Odası Butonu */}
                                      <Button
                                        size="sm"
                                        onClick={() => {
                                          console.log('🎯 Seansa katılma butonu tıklandı:', session.id)
                                          joinSession(session.id)
                                        }}
                                        disabled={false} // Test için her zaman aktif
                                        className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg"
                                        title="Test Modu: Video görüşme odasına katıl"
                                      >
                                        <Video className="w-4 h-4 mr-2" />
                                        🎥 Test: Seansa Katıl
                                      </Button>

                                      {/* Teknik Destek Notu */}
                                      <div className="text-xs text-gray-500 text-center">
                                        Sorun yaşarsanız danışmanınıza mesaj gönderin
                                      </div>
                                    </div>
                                  )}

                                  {/* Eski Meeting Link - fallback */}
                                  {session.status === 'confirmed' && session.type === 'online' && session.meeting_link && (
                                    <Button
                                      size="sm"
                                      onClick={() => window.open(session.meeting_link, '_blank')}
                                      className="bg-blue-600 hover:bg-blue-700"
                                      variant="outline"
                                    >
                                      <Video className="w-4 h-4 mr-1" />
                                      Eski Link
                                    </Button>
                                  )}
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
                          {status === 'upcoming' && 'Henüz yaklaşan seans bulunmuyor'}
                          {status === 'past' && 'Henüz geçmiş seans bulunmuyor'}
                          {status === 'cancelled' && 'Henüz iptal edilmiş seans bulunmuyor'}
                        </p>
                        {status === 'upcoming' && (
                          <Button
                            onClick={() => router.push('/seans-al')}
                            className="mt-4"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            İlk Seansınızı Alın
                          </Button>
                        )}
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Rating Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4" style={{ zIndex: 2147483649 }}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Seans Değerlendirmesi
              </h3>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  {selectedSession.session_type?.name} seansınızı nasıl değerlendiriyorsunuz?
                </p>
                <div className="flex justify-center mb-4">
                  {renderStars(rating, true)}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Geri Bildirim (Opsiyonel)
                </label>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Seansınız hakkında düşüncelerinizi paylaşın..."
                  rows={3}
                />
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedSession(null)
                    setRating(0)
                    setFeedback('')
                  }}
                  disabled={isSubmittingFeedback}
                  className="flex-1"
                >
                  İptal
                </Button>
                <Button
                  onClick={submitFeedback}
                  disabled={rating === 0 || isSubmittingFeedback}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                >
                  {isSubmittingFeedback ? 'Kaydediliyor...' : 'Değerlendirmeyi Kaydet'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {messageModalOpen && selectedConsultant && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4" style={{ zIndex: 2147483649 }}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Danışmanınıza Mesaj Gönderin
              </h3>

              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    {selectedConsultant.consultant?.avatar_url ? (
                      <img
                        src={selectedConsultant.consultant.avatar_url}
                        alt="Danışman"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {selectedConsultant.consultant?.first_name} {selectedConsultant.consultant?.last_name}
                    </h4>
                    <p className="text-sm text-gray-600">Danışman</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Konu (Opsiyonel)
                  </label>
                  <Input
                    value={messageSubject}
                    onChange={(e) => setMessageSubject(e.target.value)}
                    placeholder="Mesaj konusu..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mesaj
                  </label>
                  <Textarea
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="Mesajınızı yazın..."
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setMessageModalOpen(false)
                    setSelectedConsultant(null)
                    setMessageSubject('')
                    setMessageContent('')
                  }}
                  disabled={isSendingMessage}
                  className="flex-1"
                >
                  İptal
                </Button>
                <Button
                  onClick={sendMessage}
                  disabled={!messageContent.trim() || isSendingMessage}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSendingMessage ? 'Gönderiliyor...' : 'Gönder'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages Modal */}
      <MessagesModal
        isOpen={messagesModalOpen}
        onClose={() => {
          setMessagesModalOpen(false)
          loadUnreadMessagesCount()
        }}
      />

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  )
}

export default ClientDashboard
'use client'

import React, { useState, useEffect } from 'react'
import {
  Calendar, Clock, User, MessageSquare, CheckCircle, XCircle, AlertCircle,
  Filter, Search, Download, Eye
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge as BadgeComponent, Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/lib/auth/auth-context'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/toast-provider'

interface Session {
  id: string
  client_id: string
  consultant_id: string
  session_date: string
  start_time: string
  end_time: string
  duration_minutes: number
  type: 'online' | 'in_person'
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
  payment_status: string
  price: number
  client_notes?: string
  consultant_notes?: string
  title?: string
  created_at: string
  updated_at: string
  // Relations
  client?: {
    id: string
    first_name: string
    last_name: string
    email: string
    phone?: string
  }
  consultant?: {
    id: string
    first_name: string
    last_name: string
    email: string
  }
  session_type?: {
    name: string
    description: string
  }
}

const SessionsManagement = () => {
  const { user } = useAuth()
  const { success: showSuccess, error: showError } = useToast()

  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [updatingSession, setUpdatingSession] = useState<string | null>(null)

  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = async () => {
    setIsLoading(true)
    try {
      console.log('🔍 Admin - Tüm seanslar yükleniyor...')

      // Önce sadece sessions'ları al, sonra client bilgilerini ayrı çek
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .order('session_date', { ascending: false })
        .order('start_time', { ascending: false })

      if (error) {
        console.error('❌ Sessions yükleme hatası:', error)
        throw error
      }

      console.log('✅ Admin Sessions yüklendi:', { count: data?.length, data })
      console.log('📊 Payment status dağılımı:', {
        payment_submitted: data?.filter(s => s.payment_status === 'payment_submitted').length,
        confirmed: data?.filter(s => s.status === 'confirmed').length,
        total: data?.length
      })
      
      // Her session'ın detaylarını göster
      console.log('🔍 ADMIN SESSION DETAYLARI:')
      data?.forEach((session, index) => {
        console.log(`📋 Session ${index + 1}:`, {
          id: session.id,
          title: session.title,
          price: session.price,
          payment_status: session.payment_status,
          status: session.status,
          date: session.session_date,
          client_id: session.client_id,
          consultant_id: session.consultant_id
        })
      })
      console.log('🔍 ADMIN SESSION DETAYLARI SONU')

      // Client ve Consultant bilgilerini ayrı çek
      if (data && data.length > 0) {
        const clientIds = [...new Set(data.map(session => session.client_id).filter(Boolean))]
        const consultantIds = [...new Set(data.map(session => session.consultant_id).filter(Boolean))]
        
        // Client bilgilerini çek
        let clientsData = []
        if (clientIds.length > 0) {
          const { data: clients, error: clientsError } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, email, phone')
            .in('id', clientIds)

          if (!clientsError && clients) {
            clientsData = clients
          }
        }

        // Consultant bilgilerini çek
        let consultantsData = []
        if (consultantIds.length > 0) {
          const { data: consultants, error: consultantsError } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, email')
            .in('id', consultantIds)

          if (!consultantsError && consultants) {
            consultantsData = consultants
          }
        }
        
        // Sessions'lara client ve consultant bilgilerini ekle
        const sessionsWithDetails = data.map(session => ({
          ...session,
          client: clientsData.find(client => client.id === session.client_id),
          consultant: consultantsData.find(consultant => consultant.id === session.consultant_id),
          session_type: { 
            name: session.title || 'Genel Danışmanlık', 
            description: 'Danışmanlık seansı' 
          }
        }))
        
        setSessions(sessionsWithDetails)
      } else {
        setSessions(data || [])
      }

    } catch (error) {
      console.error('💥 Admin Seanslar yüklenirken hata:', error)
      showError('Seanslar yüklenemedi')
    } finally {
      setIsLoading(false)
    }
  }

  const updateSessionStatus = async (sessionId: string, newStatus: string) => {
    console.log('🔄 Admin - Seans durumu güncelleniyor...', { sessionId, newStatus })
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

      console.log('📥 Admin Supabase yanıtı:', { data, error })

      if (error) {
        console.error('❌ Admin Supabase hatası:', error)
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
          console.error('Admin Bildirim gönderme hatası:', notificationError)
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
          console.error('Admin Bildirim gönderme hatası:', notificationError)
        }
      }

      console.log('✅ Admin Seans durumu güncellendi:', data)

      const statusMessages = {
        confirmed: 'onaylandı',
        cancelled: 'iptal edildi',
        completed: 'tamamlandı olarak işaretlendi'
      }

      showSuccess(`Seans ${statusMessages[newStatus as keyof typeof statusMessages] || 'güncellendi'}`)
      loadSessions() // Listeyi yenile
    } catch (error) {
      console.error('💥 Admin Seans durumu güncellenirken hata:', error)

      if (error?.message) {
        showError(`Hata: ${error.message}`)
      } else if (error?.details) {
        showError(`Detay: ${error.details}`)
      } else {
        showError('Seans durumu güncellenemedi')
      }
    } finally {
      setUpdatingSession(null)
    }
  }

  const getStatusBadge = (session: Session) => {
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
    } else if (session.status === 'cancelled') {
      label = 'İptal Edildi'
      color = 'bg-red-100 text-red-800'
    } else {
      label = 'Bilinmiyor'
      color = 'bg-gray-100 text-gray-800'
    }

    return <Badge className={color}>{label}</Badge>
  }

  const getSessionsByStatus = (status: string) => {
    if (status === 'all') return sessions
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
    if (status === 'cancelled') {
      return sessions.filter(session => session.status === 'cancelled')
    }
    return sessions.filter(session => session.status === status)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatTime = (time: string) => {
    if (!time) return '--:--'
    return time.substring(0, 5)
  }

  const filteredSessions = getSessionsByStatus(activeTab).filter(session => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      session.client?.first_name?.toLowerCase().includes(searchLower) ||
      session.client?.last_name?.toLowerCase().includes(searchLower) ||
      session.client?.email?.toLowerCase().includes(searchLower) ||
      session.consultant?.first_name?.toLowerCase().includes(searchLower) ||
      session.consultant?.last_name?.toLowerCase().includes(searchLower) ||
      session.session_type?.name?.toLowerCase().includes(searchLower)
    )
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Seanslar</h2>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Seanslar yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Seanslar</h2>
          <p className="text-gray-600">Tüm seansları görüntüle ve yönet</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Rapor İndir
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtrele
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Danışan, danışman veya seans türü ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Tabs */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b border-gray-200">
              <TabsList className="grid w-full grid-cols-5 h-auto p-1">
                <TabsTrigger value="all" className="py-3">
                  Tümü ({sessions.length})
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

            {/* Sessions List */}
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((tabValue) => (
              <TabsContent key={tabValue} value={tabValue} className="p-6">
                <div className="space-y-4">
                  {filteredSessions.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Bu kategoride seans bulunmuyor</p>
                    </div>
                  ) : (
                    filteredSessions.map((session) => (
                      <Card key={session.id} className="border-l-4 border-l-purple-500">
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
                                  <div>
                                    <p className="font-medium">Danışan:</p>
                                    <p>{session.client?.first_name} {session.client?.last_name}</p>
                                    <p className="text-xs text-gray-500">{session.client?.email}</p>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <User className="w-4 h-4 mr-2" />
                                  <div>
                                    <p className="font-medium">Danışman:</p>
                                    <p>{session.consultant?.first_name} {session.consultant?.last_name}</p>
                                    <p className="text-xs text-gray-500">{session.consultant?.email}</p>
                                  </div>
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
                                    const totalMinutes = hours * 60 + minutes + (session.duration_minutes || 60)
                                    const endHours = Math.floor(totalMinutes / 60)
                                    const endMins = totalMinutes % 60
                                    return `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`
                                  })()}
                                </div>
                                <div className="flex items-center">
                                  <BadgeComponent variant="outline" className="text-xs">
                                    {session.type === 'online' ? 'Online' : 'Yüz Yüze'}
                                  </BadgeComponent>
                                </div>
                                <div className="flex items-center">
                                  <span className="text-sm font-medium text-gray-700">₺{session.price}</span>
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
                                <Button
                                  size="sm"
                                  onClick={() => updateSessionStatus(session.id, 'completed')}
                                  disabled={updatingSession === session.id}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  {updatingSession === session.id ? 'Tamamlanıyor...' : 'Seansı Tamamla'}
                                </Button>
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

                              {/* Detay görüntüleme butonu */}
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-purple-600 border-purple-600 hover:bg-purple-50"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Detay
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default SessionsManagement
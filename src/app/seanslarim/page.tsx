'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, Clock, User, MapPin, Video, AlertCircle, CheckCircle, XCircle, History } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth/auth-context'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/toast-provider'
import { useRouter } from 'next/navigation'
import { SessionActions } from '@/components/sessions/session-actions'

interface Session {
  id: string
  session_date: string
  start_time: string
  end_time?: string
  duration_minutes: number
  status: string
  type: string
  price: number
  client_notes?: string
  consultant_notes?: string
  reschedule_count?: number
  original_session_date?: string
  cancellation_reason?: string
  cancelled_at?: string
  consultant_id: string
  consultant: {
    id: string
    first_name: string
    last_name: string
    avatar_url?: string
  }
  session_type?: {
    name: string
    description?: string
  }
  session_type_name?: string
}

const MySessionsPage = () => {
  const { user, profile } = useAuth()
  const { error: showError } = useToast()
  const router = useRouter()

  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past' | 'cancelled'>('upcoming')

  useEffect(() => {
    if (user) {
      loadSessions()
    }
  }, [user, filter])

  // Auth kontrolü - ayrı useEffect
  useEffect(() => {
    if (!user && !profile) {
      // Sadece kesin olarak user yoksa ana sayfaya yönlendir
      const timer = setTimeout(() => {
        router.push('/')
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [user, profile])

  const loadSessions = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      let query = supabase
        .from('sessions')
        .select(`
          *,
          consultant:profiles!consultant_id(id, first_name, last_name, avatar_url)
        `)
        .eq('client_id', user.id)
        .order('session_date', { ascending: false })

      // Filtre uygula
      const now = new Date().toISOString()
      if (filter === 'upcoming') {
        query = query
          .gte('session_date', now)
          .or('status.eq.pending_payment,status.eq.pending,status.eq.confirmed')
      } else if (filter === 'past') {
        query = query.or(`session_date.lt.${now},status.eq.completed`)
      } else if (filter === 'cancelled') {
        query = query.eq('status', 'cancelled')
      }

      const { data, error } = await query

      if (error) throw error

      setSessions(data || [])
    } catch (error: any) {
      console.error('Seanslar yüklenirken hata:', error)
      showError('Seanslar yüklenemedi')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending_payment: { label: 'Ödeme Bekleniyor', color: 'bg-orange-100 text-orange-800', icon: AlertCircle },
      pending: { label: 'Onay Bekleniyor', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      confirmed: { label: 'Onaylandı', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      completed: { label: 'Tamamlandı', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      cancelled: { label: 'İptal Edildi', color: 'bg-red-100 text-red-800', icon: XCircle },
      no_show: { label: 'Katılmadı', color: 'bg-gray-100 text-gray-800', icon: XCircle }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending_payment
    const Icon = config.icon

    return (
      <Badge className={`${config.color} flex items-center space-x-1`}>
        <Icon className="w-3 h-3" />
        <span>{config.label}</span>
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long'
    }).format(date)
  }

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5)
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Seanslarım</h1>
            <p className="text-gray-600">Tüm seanslarınızı görüntüleyin ve yönetin</p>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-3">
            <Button
              variant={filter === 'upcoming' ? 'default' : 'outline'}
              onClick={() => setFilter('upcoming')}
              className="flex items-center"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Yaklaşan Seanslar
            </Button>
            <Button
              variant={filter === 'past' ? 'default' : 'outline'}
              onClick={() => setFilter('past')}
              className="flex items-center"
            >
              <History className="w-4 h-4 mr-2" />
              Geçmiş Seanslar
            </Button>
            <Button
              variant={filter === 'cancelled' ? 'default' : 'outline'}
              onClick={() => setFilter('cancelled')}
              className="flex items-center"
            >
              <XCircle className="w-4 h-4 mr-2" />
              İptal Edilenler
            </Button>
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
            >
              Tümü
            </Button>
          </div>

          {/* Sessions List */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Seanslar yükleniyor...</p>
            </div>
          ) : sessions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {filter === 'upcoming' && 'Yaklaşan seans bulunmuyor'}
                  {filter === 'past' && 'Geçmiş seans bulunmuyor'}
                  {filter === 'cancelled' && 'İptal edilmiş seans bulunmuyor'}
                  {filter === 'all' && 'Henüz seans bulunmuyor'}
                </h3>
                <p className="text-gray-600 mb-6">
                  Yeni bir seans rezervasyonu yapmak için aşağıdaki butona tıklayın
                </p>
                <Button onClick={() => router.push('/seans-al')}>
                  Seans Al
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <Card key={session.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                      {/* Sol Taraf - Seans Bilgileri */}
                      <div className="flex-1 space-y-4">
                        {/* Danışman ve Durum */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              {session.consultant.avatar_url ? (
                                <img
                                  src={session.consultant.avatar_url}
                                  alt={`${session.consultant.first_name} ${session.consultant.last_name}`}
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                <User className="w-6 h-6 text-white" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {session.consultant.first_name} {session.consultant.last_name}
                              </h3>
                              <p className="text-sm text-gray-600">{session.session_type?.name || session.type || 'Seans'}</p>
                            </div>
                          </div>
                          {getStatusBadge(session.status)}
                        </div>

                        {/* Tarih ve Saat */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="flex items-center space-x-2 text-gray-700">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">{formatDate(session.session_date)}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-700">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">
                              {formatTime(session.start_time)}
                              {session.end_time && ` - ${formatTime(session.end_time)}`}
                              {' '}({session.duration_minutes} dk)
                            </span>
                          </div>
                        </div>

                        {/* Seans Tipi */}
                        <div className="flex items-center space-x-2">
                          {session.type === 'online' ? (
                            <>
                              <Video className="w-4 h-4 text-green-600" />
                              <span className="text-sm text-gray-700">Online Seans</span>
                            </>
                          ) : (
                            <>
                              <MapPin className="w-4 h-4 text-purple-600" />
                              <span className="text-sm text-gray-700">Yüz Yüze Seans</span>
                            </>
                          )}
                        </div>

                        {/* Erteleme Bilgisi */}
                        {session.reschedule_count && session.reschedule_count > 0 && (
                          <div className="flex items-start space-x-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">Bu seans {session.reschedule_count} kez ertelendi</p>
                              {session.original_session_date && (
                                <p className="text-xs mt-1">
                                  Orijinal tarih: {formatDate(session.original_session_date)}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* İptal Bilgisi */}
                        {session.status === 'cancelled' && session.cancellation_reason && (
                          <div className="flex items-start space-x-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                            <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">İptal Nedeni:</p>
                              <p className="mt-1">{session.cancellation_reason}</p>
                              {session.cancelled_at && (
                                <p className="text-xs mt-1">
                                  İptal tarihi: {formatDate(session.cancelled_at)}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Notlar */}
                        {session.client_notes && (
                          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            <p className="font-medium mb-1">Notlarınız:</p>
                            <p>{session.client_notes}</p>
                          </div>
                        )}
                      </div>

                      {/* Sağ Taraf - Fiyat ve Aksiyonlar */}
                      <div className="lg:ml-6 space-y-4 lg:text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          ₺{session.price ? session.price.toFixed(2) : '0.00'}
                        </div>

                        {/* Aksiyonlar - pending, confirmed ve yaklaşan seanslar için */}
                        {(session.status === 'pending' || session.status === 'confirmed') && 
                         new Date(session.session_date) > new Date() && (
                          <SessionActions
                            session={session}
                            onSuccess={loadSessions}
                          />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Yeni Seans Al Butonu */}
          {sessions.length > 0 && (
            <div className="mt-8 text-center">
              <Button
                onClick={() => router.push('/seans-al')}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Yeni Seans Al
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MySessionsPage

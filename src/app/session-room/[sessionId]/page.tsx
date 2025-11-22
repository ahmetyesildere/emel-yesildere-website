'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, AlertCircle, Users, Clock, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth/auth-context'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/toast-provider'
import MockSessionRoom from '@/components/video-call/mock-session-room'
import { createMeetingToken, createDailyRoom } from '@/lib/daily-co'

interface SessionData {
  id: string
  session_date?: string
  start_time?: string
  end_time?: string
  title?: string
  type: 'online' | 'in_person'
  status: string
  payment_status: string
  daily_room_name?: string
  daily_room_url?: string
  daily_meeting_token?: string
  client_id?: string
  consultant_id?: string
  client?: {
    first_name: string
    last_name: string
    email: string
  }
  consultant?: {
    first_name: string
    last_name: string
    email: string
  }
}

const SessionRoomPage = () => {
  const params = useParams()
  const router = useRouter()
  const { user, profile } = useAuth()
  const { success: showSuccess, error: showError } = useToast()

  const sessionId = params.sessionId as string
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userToken, setUserToken] = useState<string | null>(null)
  const [isGeneratingToken, setIsGeneratingToken] = useState(false)

  useEffect(() => {
    if (sessionId && user?.id && !sessionData) {
      console.log('🔄 Session data yükleniyor...', { sessionId, userId: user.id })
      loadSessionData()
    }
  }, [sessionId, user?.id])

  const loadSessionData = async () => {
    // Eğer zaten session data varsa tekrar yükleme
    if (sessionData) {
      console.log('✅ Session data zaten mevcut, yeniden yükleme yapılmıyor')
      return
    }
    
    setIsLoading(true)
    try {
      console.log('🔍 Seans bilgileri yükleniyor:', sessionId)

      const { data: sessionData, error: sessionError } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', sessionId)
        .single()

      if (sessionError) throw sessionError

      // Client ve consultant bilgilerini ayrı çek
      const [clientResult, consultantResult] = await Promise.all([
        supabase
          .from('profiles')
          .select('first_name, last_name, email')
          .eq('id', sessionData.client_id)
          .single(),
        supabase
          .from('profiles')
          .select('first_name, last_name, email')
          .eq('id', sessionData.consultant_id)
          .single()
      ])

      const enrichedSessionData = {
        ...sessionData,
        client: clientResult.data,
        consultant: consultantResult.data
      }

      setSessionData(enrichedSessionData)

      // Kullanıcının bu seansa erişim yetkisi var mı kontrol et
      if (user?.id && sessionData.client_id && sessionData.consultant_id) {
        if (user.id !== sessionData.client_id && user.id !== sessionData.consultant_id) {
          setError('Bu seansa erişim yetkiniz bulunmuyor')
          return
        }
      } else {
        console.warn('⚠️ Kullanıcı veya seans bilgileri eksik, erişim kontrolü atlanıyor')
      }

      // Seans online değilse hata ver
      if (sessionData.type !== 'online') {
        setError('Bu seans yüz yüze gerçekleştirilecek')
        return
      }

      // Daily.co oda bilgileri yoksa otomatik oluştur
      if (!sessionData.daily_room_url) {
        console.log('🏠 Oda bulunamadı, otomatik oluşturuluyor...')
        const roomCreated = await createRoomForSession(enrichedSessionData)
        if (roomCreated) {
          // Oda oluşturulduktan sonra enrichedSessionData'yı güncelle
          enrichedSessionData.daily_room_url = roomCreated.url
          enrichedSessionData.daily_room_name = roomCreated.name
          setSessionData(enrichedSessionData)
        } else {
          setError('Video call odası oluşturulamadı')
          return
        }
      }

      // Token oluşturma devre dışı - Daily.co public room kullanılıyor
      // await generateUserToken(enrichedSessionData)

    } catch (error) {
      console.error('💥 Seans bilgileri yükleme hatası:', error)
      setError('Seans bilgileri yüklenemedi')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCallStart = () => {
    console.log('📞 Seans başladı')
    showSuccess('Seansa başarıyla katıldınız!')
    
    // Seans başlama zamanını kaydet
    if (sessionData && user?.id === sessionData.consultant_id) {
      supabase
        .from('sessions')
        .update({ 
          meeting_started_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId)
        .then(({ error }) => {
          if (error) {
            console.error('Seans başlama zamanı kaydedilemedi:', error)
          }
        })
    }
  }

  const handleCallEnd = () => {
    console.log('📞 Seans sona erdi')
    showSuccess('Seanstan ayrıldınız')
    
    // Seans bitiş zamanını kaydet
    if (sessionData && user?.id === sessionData.consultant_id) {
      supabase
        .from('sessions')
        .update({ 
          meeting_ended_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId)
        .then(({ error }) => {
          if (error) {
            console.error('Seans bitiş zamanı kaydedilemedi:', error)
          }
        })
    }

    // Yönlendirme
    setTimeout(() => {
      const isConsultant = user?.id === sessionData?.consultant_id
      if (isConsultant) {
        router.push('/consultant')
      } else {
        router.push('/dashboard')
      }
    }, 2000)
  }

  const handleCallError = (errorMessage: string) => {
    console.error('📞 Video call hatası:', errorMessage)
    showError(`Video call hatası: ${errorMessage}`)
  }

  const createRoomForSession = async (session: SessionData) => {
    try {
      console.log('🏠 Seans için oda oluşturuluyor...', session.id)

      // Daily.co odası oluştur
      const room = await createDailyRoom(session.id, {
        enable_recording: user?.id && session.consultant_id && user.id === session.consultant_id,
        enable_chat: true,
        enable_screenshare: true
      })

      // Veritabanını güncelle
      const { error: updateError } = await supabase
        .from('sessions')
        .update({
          daily_room_name: room.name,
          daily_room_url: room.url,
          updated_at: new Date().toISOString()
        })
        .eq('id', session.id)

      if (updateError) {
        console.error('Oda bilgileri kaydedilemedi:', updateError)
        // Hata olsa bile room'u döndür, mock data ile çalışabilir
      } else {
        console.log('✅ Oda oluşturuldu ve kaydedildi:', room.name)
      }

      showSuccess('Video call odası oluşturuldu!')
      return room

    } catch (error) {
      console.error('💥 Oda oluşturma hatası:', error)
      showError('Video call odası oluşturulamadı')
      return null
    }
  }

  const generateUserToken = async (session: SessionData) => {
    if (!session.daily_room_name || !user) return

    setIsGeneratingToken(true)
    try {
      const userName = `${profile?.first_name} ${profile?.last_name}` || user.email || 'Kullanıcı'
      const isOwner = user?.id && session.consultant_id && user.id === session.consultant_id

      console.log('🎫 Kullanıcı token\'ı oluşturuluyor:', { userName, isOwner })

      const tokenData = await createMeetingToken(
        session.daily_room_name,
        userName,
        isOwner,
        120 // 2 saat geçerli
      )

      setUserToken(tokenData.token)
      console.log('✅ Token oluşturuldu')

    } catch (error) {
      console.error('💥 Token oluşturma hatası:', error)
      showError('Video call token\'ı oluşturulamadı')
    } finally {
      setIsGeneratingToken(false)
    }
  }



  if (isLoading && !sessionData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Seans Odası Hazırlanıyor</h3>
            <p className="text-gray-600">Lütfen bekleyin...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !sessionData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Erişim Hatası</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-2">
              <Button onClick={() => router.back()} className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Geri Dön
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Sayfayı Yenile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isConsultant = user?.id && sessionData.consultant_id && user.id === sessionData.consultant_id
  const otherParticipant = isConsultant ? sessionData.client : sessionData.consultant

  return (
    <MockSessionRoom
      sessionData={sessionData}
      userRole={isConsultant ? 'consultant' : 'client'}
      userName={`${profile?.first_name} ${profile?.last_name}` || user?.email || 'Kullanıcı'}
    />
  )
}

export default SessionRoomPage
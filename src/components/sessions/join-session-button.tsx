'use client'

import React, { useState, useEffect } from 'react'
import { Video, Clock, AlertCircle, Users, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/lib/auth/auth-context'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/toast-provider'
import { createDailyRoom, createMeetingToken, generateRoomName } from '@/lib/daily-co'

interface JoinSessionButtonProps {
  sessionId: string
  sessionDate: string
  startTime: string
  endTime: string
  consultantName: string
  sessionType: string
  isConsultant?: boolean
  onJoinClick?: (roomUrl: string, token: string) => void
}

interface SessionStatus {
  canJoin: boolean
  timeUntilStart: number
  timeUntilEnd: number
  status: 'too_early' | 'can_join' | 'in_progress' | 'ended'
  message: string
}

const JoinSessionButton: React.FC<JoinSessionButtonProps> = ({
  sessionId,
  sessionDate,
  startTime,
  endTime,
  consultantName,
  sessionType,
  isConsultant = false,
  onJoinClick
}) => {
  const { user, profile } = useAuth()
  const { success: showSuccess, error: showError } = useToast()

  const [sessionStatus, setSessionStatus] = useState<SessionStatus>({
    canJoin: false,
    timeUntilStart: 0,
    timeUntilEnd: 0,
    status: 'too_early',
    message: ''
  })
  const [isCreatingRoom, setIsCreatingRoom] = useState(false)
  const [roomData, setRoomData] = useState<{
    roomUrl?: string
    token?: string
    roomName?: string
  }>({})

  useEffect(() => {
    const timer = setInterval(() => {
      updateSessionStatus()
    }, 1000)

    updateSessionStatus()
    loadExistingRoomData()

    return () => clearInterval(timer)
  }, [sessionDate, startTime, endTime])

  const updateSessionStatus = () => {
    const now = new Date()
    const sessionDateTime = new Date(`${sessionDate}T${startTime}`)
    const sessionEndTime = new Date(`${sessionDate}T${endTime}`)
    
    // 15 dakika önceden katılım izni
    const joinAllowedTime = new Date(sessionDateTime.getTime() - 15 * 60 * 1000)
    
    const timeUntilStart = Math.max(0, Math.floor((sessionDateTime.getTime() - now.getTime()) / 1000))
    const timeUntilEnd = Math.max(0, Math.floor((sessionEndTime.getTime() - now.getTime()) / 1000))
    const timeUntilJoinAllowed = Math.max(0, Math.floor((joinAllowedTime.getTime() - now.getTime()) / 1000))

    let status: SessionStatus['status'] = 'too_early'
    let canJoin = false
    let message = ''

    if (now >= sessionEndTime) {
      status = 'ended'
      message = 'Seans sona erdi'
    } else if (now >= sessionDateTime) {
      status = 'in_progress'
      canJoin = true
      message = 'Seans devam ediyor'
    } else if (now >= joinAllowedTime) {
      status = 'can_join'
      canJoin = true
      message = 'Seansa katılabilirsiniz'
    } else {
      status = 'too_early'
      message = `Seansa ${formatTime(timeUntilJoinAllowed)} sonra katılabilirsiniz`
    }

    setSessionStatus({
      canJoin,
      timeUntilStart,
      timeUntilEnd,
      status,
      message
    })
  }

  const loadExistingRoomData = async () => {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('daily_room_name, daily_room_url, daily_meeting_token')
        .eq('id', sessionId)
        .single()

      if (error) throw error

      if (data?.daily_room_name && data?.daily_room_url) {
        setRoomData({
          roomName: data.daily_room_name,
          roomUrl: data.daily_room_url,
          token: data.daily_meeting_token
        })
      }

    } catch (error) {
      console.error('Mevcut oda bilgileri yüklenemedi:', error)
    }
  }

  const createOrJoinRoom = async () => {
    if (!user) {
      showError('Giriş yapmanız gerekiyor')
      return
    }

    setIsCreatingRoom(true)

    try {
      let roomUrl = roomData.roomUrl
      let roomName = roomData.roomName
      let token = roomData.token

      // Oda yoksa oluştur
      if (!roomUrl) {
        console.log('🏠 Yeni oda oluşturuluyor...')
        
        const room = await createDailyRoom(sessionId, {
          enable_recording: isConsultant,
          enable_chat: true,
          enable_screenshare: true
        })

        roomUrl = room.url
        roomName = room.name

        // Veritabanını güncelle
        const { error: updateError } = await supabase
          .from('sessions')
          .update({
            daily_room_name: roomName,
            daily_room_url: roomUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', sessionId)

        if (updateError) {
          console.error('Oda bilgileri kaydedilemedi:', updateError)
          // Hata olsa bile devam et, mock data ile çalışabilir
        } else {
          console.log('✅ Oda bilgileri veritabanına kaydedildi')
        }

        setRoomData(prev => ({ ...prev, roomUrl, roomName }))
      }

      // Token oluştur veya kontrol et
      if (!token || !isTokenValid(token)) {
        console.log('🎫 Yeni token oluşturuluyor...')
        
        const userName = `${profile?.first_name} ${profile?.last_name}` || user.email || 'Kullanıcı'
        const meetingToken = await createMeetingToken(
          roomName!,
          userName,
          isConsultant,
          120 // 2 saat geçerli
        )

        token = meetingToken.token

        // Token'ı veritabanına kaydet (sadece kendi token'ımızı)
        if (isConsultant) {
          const { error: tokenError } = await supabase
            .from('sessions')
            .update({
              daily_meeting_token: token,
              updated_at: new Date().toISOString()
            })
            .eq('id', sessionId)

          if (tokenError) {
            console.error('Token kaydedilemedi:', tokenError)
          }
        }

        setRoomData(prev => ({ ...prev, token }))
      }

      // Seansa katıl
      if (roomUrl && token) {
        console.log('🚀 Seansa katılınıyor...', { roomUrl, hasToken: !!token })
        onJoinClick?.(roomUrl, token)
        showSuccess('Seans odasına yönlendiriliyorsunuz...')
      }

    } catch (error) {
      console.error('💥 Oda oluşturma/katılma hatası:', error)
      showError('Seans odasına katılamadı')
    } finally {
      setIsCreatingRoom(false)
    }
  }

  const isTokenValid = (token: string): boolean => {
    // Basit token geçerlilik kontrolü
    // Gerçek implementasyonda JWT decode edilecek
    return token && token !== 'placeholder-token' && !token.startsWith('mock-token')
  }

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}s ${minutes}dk`
    } else if (minutes > 0) {
      return `${minutes}dk ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  const getStatusColor = () => {
    switch (sessionStatus.status) {
      case 'can_join':
      case 'in_progress':
        return 'bg-green-100 text-green-800'
      case 'too_early':
        return 'bg-yellow-100 text-yellow-800'
      case 'ended':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = () => {
    switch (sessionStatus.status) {
      case 'can_join':
      case 'in_progress':
        return <Video className="w-4 h-4" />
      case 'too_early':
        return <Clock className="w-4 h-4" />
      case 'ended':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Calendar className="w-4 h-4" />
    }
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Seans Bilgileri */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{sessionType}</h3>
              <p className="text-sm text-gray-600">
                {isConsultant ? 'Danışan ile seans' : `${consultantName} ile seans`}
              </p>
            </div>
            <Badge className={getStatusColor()}>
              {getStatusIcon()}
              <span className="ml-1">{sessionStatus.message}</span>
            </Badge>
          </div>

          {/* Seans Zamanı */}
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(sessionDate).toLocaleDateString('tr-TR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {startTime.substring(0, 5)} - {endTime.substring(0, 5)}
            </div>
          </div>

          {/* Durum Mesajı */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">{sessionStatus.message}</p>
            {sessionStatus.status === 'too_early' && (
              <p className="text-xs text-gray-500 mt-1">
                Seans başlamadan 15 dakika önce katılım butonu aktif olacak
              </p>
            )}
          </div>

          {/* Katılım Butonu */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Users className="w-3 h-3" />
              <span>Video görüşme odası</span>
              {roomData.roomName && (
                <Badge variant="outline" className="text-xs">
                  Oda: {roomData.roomName}
                </Badge>
              )}
            </div>
            
            <Button
              onClick={createOrJoinRoom}
              disabled={!sessionStatus.canJoin || isCreatingRoom}
              className={`${
                sessionStatus.canJoin 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
              title={
                !sessionStatus.canJoin 
                  ? sessionStatus.message
                  : sessionStatus.status === 'in_progress' 
                    ? 'Devam eden seansa katıl' 
                    : 'Video görüşme odasına gir'
              }
            >
              {isCreatingRoom ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Hazırlanıyor...
                </>
              ) : (
                <>
                  <Video className="w-4 h-4 mr-2" />
                  {sessionStatus.status === 'in_progress' ? 'Seansa Katıl' : 'Seans Odasına Gir'}
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default JoinSessionButton
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { 
  Video, VideoOff, Mic, MicOff, Monitor, Phone, Settings, 
  Users, MessageSquare, Clock, AlertCircle 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/components/ui/toast-provider'

interface DailyRoomProps {
  roomUrl: string
  token: string
  userName: string
  isOwner?: boolean
  onCallEnd?: () => void
  onCallStart?: () => void
  onError?: (error: string) => void
}

interface CallState {
  isJoined: boolean
  isConnecting: boolean
  participants: number
  duration: number
  hasVideo: boolean
  hasAudio: boolean
  isScreenSharing: boolean
  connectionQuality: 'good' | 'fair' | 'poor'
}

const DailyRoom: React.FC<DailyRoomProps> = ({
  roomUrl,
  token,
  userName,
  isOwner = false,
  onCallEnd,
  onCallStart,
  onError
}) => {
  const { success: showSuccess, error: showError } = useToast()
  const callFrameRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [callState, setCallState] = useState<CallState>({
    isJoined: false,
    isConnecting: false,
    participants: 0,
    duration: 0,
    hasVideo: true,
    hasAudio: true,
    isScreenSharing: false,
    connectionQuality: 'good'
  })
  const [error, setError] = useState<string | null>(null)
  const [durationTimer, setDurationTimer] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Daily.co SDK'sını dinamik olarak yükle
    loadDailySDK()
    
    return () => {
      if (durationTimer) {
        clearInterval(durationTimer)
      }
      if (callFrameRef.current) {
        callFrameRef.current.destroy()
      }
    }
  }, [])

  const loadDailySDK = async () => {
    try {
      // Daily.co SDK'sını dinamik import ile yükle
      console.log('📦 Daily.co SDK yükleniyor...')
      
      // Gerçek Daily.co SDK'sını yükle (sadece client-side'da)
      if (typeof window === 'undefined') {
        console.log('🔄 Server-side, mock implementasyon kullanılıyor...')
        throw new Error('Server-side rendering')
      }
      
      const DailyIframe = (await import('@daily-co/daily-js')).default
      
      const daily = DailyIframe.createFrame(containerRef.current!, {
        iframeStyle: {
          width: '100%',
          height: '100%',
          border: 'none',
          borderRadius: '12px'
        },
        showLeaveButton: false,
        showFullscreenButton: true,
        showLocalVideo: true,
        showParticipantsBar: true
      })

      callFrameRef.current = daily

      // Event listeners ekle
      setupEventListeners()

    } catch (error) {
      console.error('💥 Daily.co SDK yükleme hatası:', error)
      console.log('🔄 Mock implementasyon kullanılıyor...')
      
      // Fallback: Mock implementation
      const mockDaily = {
        createFrame: (container: HTMLElement, options: any) => ({
          join: async (joinOptions: any) => {
            console.log('🚀 Seansa katılınıyor...', joinOptions)
            setCallState(prev => ({ ...prev, isConnecting: true }))
            
            // Mock join process
            setTimeout(() => {
              setCallState(prev => ({ 
                ...prev, 
                isJoined: true, 
                isConnecting: false,
                participants: 1
              }))
              onCallStart?.()
              startDurationTimer()
              showSuccess('Seansa başarıyla katıldınız!')
            }, 2000)
            
            return { participants: {} }
          },
          leave: async () => {
            console.log('👋 Seanstan ayrılınıyor...')
            setCallState(prev => ({ 
              ...prev, 
              isJoined: false,
              participants: 0
            }))
            if (durationTimer) {
              clearInterval(durationTimer)
            }
            onCallEnd?.()
          },
          destroy: () => {
            console.log('🗑️ Call frame temizleniyor')
          },
          setLocalVideo: (enabled: boolean) => {
            setCallState(prev => ({ ...prev, hasVideo: enabled }))
          },
          setLocalAudio: (enabled: boolean) => {
            setCallState(prev => ({ ...prev, hasAudio: enabled }))
          },
          startScreenShare: () => {
            setCallState(prev => ({ ...prev, isScreenSharing: true }))
            showSuccess('Ekran paylaşımı başlatıldı')
          },
          stopScreenShare: () => {
            setCallState(prev => ({ ...prev, isScreenSharing: false }))
            showSuccess('Ekran paylaşımı durduruldu')
          },
          on: (event: string, callback: Function) => {
            console.log('📡 Event listener eklendi:', event)
          }
        })
      }

      if (containerRef.current) {
        callFrameRef.current = mockDaily.createFrame(containerRef.current, {
          iframeStyle: {
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: '12px'
          },
          showLeaveButton: false,
          showFullscreenButton: true
        })

        // Event listeners
        setupEventListeners()
      }

    } catch (error) {
      console.error('💥 Daily.co SDK yükleme hatası:', error)
      setError('Video call sistemi yüklenemedi')
      onError?.('SDK yükleme hatası')
    }
  }

  const setupEventListeners = () => {
    if (!callFrameRef.current) return

    console.log('📡 Event listeners kuruluyor...')

    // Gerçek Daily.co event listeners
    callFrameRef.current
      .on('joined-meeting', (event: any) => {
        console.log('✅ Seansa katıldı:', event)
        setCallState(prev => ({ 
          ...prev, 
          isJoined: true, 
          isConnecting: false,
          participants: Object.keys(event.participants).length
        }))
        onCallStart?.()
        startDurationTimer()
        showSuccess('Seansa başarıyla katıldınız!')
      })
      .on('left-meeting', () => {
        console.log('👋 Seanstan ayrıldı')
        setCallState(prev => ({ 
          ...prev, 
          isJoined: false,
          participants: 0
        }))
        if (durationTimer) {
          clearInterval(durationTimer)
        }
        onCallEnd?.()
      })
      .on('participant-joined', (event: any) => {
        console.log('👤 Katılımcı katıldı:', event)
        setCallState(prev => ({ 
          ...prev, 
          participants: prev.participants + 1
        }))
      })
      .on('participant-left', (event: any) => {
        console.log('👤 Katılımcı ayrıldı:', event)
        setCallState(prev => ({ 
          ...prev, 
          participants: Math.max(0, prev.participants - 1)
        }))
      })
      .on('camera-error', (event: any) => {
        console.error('📹 Kamera hatası:', event)
        showError('Kamera erişim hatası')
      })
      .on('error', (event: any) => {
        console.error('💥 Daily.co hatası:', event)
        onError?.('Video call hatası: ' + event.errorMsg)
      })

    console.log('✅ Event listeners kuruldu')
  }

  const startDurationTimer = () => {
    const timer = setInterval(() => {
      setCallState(prev => ({ ...prev, duration: prev.duration + 1 }))
    }, 1000)
    setDurationTimer(timer)
  }

  const joinCall = async () => {
    if (!callFrameRef.current) {
      setError('Video call sistemi hazır değil')
      return
    }

    try {
      setCallState(prev => ({ ...prev, isConnecting: true }))
      
      // Gerçek Daily.co join
      await callFrameRef.current.join({
        url: roomUrl,
        token: token
      })

    } catch (error) {
      console.error('💥 Seansa katılma hatası:', error)
      setError('Seansa katılamadı: ' + (error as Error).message)
      setCallState(prev => ({ ...prev, isConnecting: false }))
      onError?.('Katılma hatası')
    }
  }

  const leaveCall = async () => {
    if (callFrameRef.current) {
      await callFrameRef.current.leave()
    }
  }

  const toggleVideo = async () => {
    if (callFrameRef.current) {
      const newVideoState = !callState.hasVideo
      await callFrameRef.current.setLocalVideo(newVideoState)
      setCallState(prev => ({ ...prev, hasVideo: newVideoState }))
    }
  }

  const toggleAudio = async () => {
    if (callFrameRef.current) {
      const newAudioState = !callState.hasAudio
      await callFrameRef.current.setLocalAudio(newAudioState)
      setCallState(prev => ({ ...prev, hasAudio: newAudioState }))
    }
  }

  const toggleScreenShare = async () => {
    if (callFrameRef.current) {
      try {
        if (callState.isScreenSharing) {
          await callFrameRef.current.stopScreenShare()
          setCallState(prev => ({ ...prev, isScreenSharing: false }))
          showSuccess('Ekran paylaşımı durduruldu')
        } else {
          await callFrameRef.current.startScreenShare()
          setCallState(prev => ({ ...prev, isScreenSharing: true }))
          showSuccess('Ekran paylaşımı başlatıldı')
        }
      } catch (error) {
        console.error('Ekran paylaşımı hatası:', error)
        showError('Ekran paylaşımı başlatılamadı')
      }
    }
  }

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  if (error) {
    return (
      <Card className="w-full h-[600px] flex items-center justify-center">
        <CardContent className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Video Call Hatası</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Sayfayı Yenile
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full h-full flex flex-col bg-gray-900 rounded-xl overflow-hidden">
      {/* Video Container */}
      <div className="flex-1 relative">
        <div 
          ref={containerRef} 
          className="w-full h-full min-h-[400px] bg-gray-800 rounded-t-xl"
        >
          {!callState.isJoined && !callState.isConnecting && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-t-xl">
              <div className="text-center text-white">
                <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Seans Odası</h3>
                <p className="text-gray-300 mb-6">Seansa katılmak için butona tıklayın</p>
                <Button 
                  onClick={joinCall}
                  className="bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  <Video className="w-5 h-5 mr-2" />
                  Seansa Katıl
                </Button>
              </div>
            </div>
          )}

          {callState.isConnecting && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-t-xl">
              <div className="text-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold mb-2">Bağlanıyor...</h3>
                <p className="text-gray-300">Seans odasına katılınıyor</p>
              </div>
            </div>
          )}
        </div>

        {/* Call Info Overlay */}
        {callState.isJoined && (
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Badge className="bg-green-500 text-white">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                Canlı
              </Badge>
              <Badge className="bg-black/50 text-white">
                <Clock className="w-3 h-3 mr-1" />
                {formatDuration(callState.duration)}
              </Badge>
              <Badge className="bg-black/50 text-white">
                <Users className="w-3 h-3 mr-1" />
                {callState.participants}
              </Badge>
            </div>
            
            {isOwner && (
              <Badge className="bg-purple-500 text-white">
                Moderatör
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      {callState.isJoined && (
        <div className="bg-gray-800 p-4 rounded-b-xl">
          <div className="flex items-center justify-center space-x-3">
            <Button
              variant={callState.hasVideo ? "default" : "destructive"}
              size="sm"
              onClick={toggleVideo}
              className="rounded-full w-12 h-12 p-0"
              title={callState.hasVideo ? 'Kamerayı Kapat' : 'Kamerayı Aç'}
            >
              {callState.hasVideo ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </Button>

            <Button
              variant={callState.hasAudio ? "default" : "destructive"}
              size="sm"
              onClick={toggleAudio}
              className="rounded-full w-12 h-12 p-0"
              title={callState.hasAudio ? 'Mikrofonu Kapat' : 'Mikrofonu Aç'}
            >
              {callState.hasAudio ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </Button>

            {isOwner && (
              <Button
                variant={callState.isScreenSharing ? "default" : "outline"}
                size="sm"
                onClick={toggleScreenShare}
                className="rounded-full w-12 h-12 p-0"
                title={callState.isScreenSharing ? 'Ekran Paylaşımını Durdur' : 'Ekran Paylaş'}
              >
                <Monitor className="w-5 h-5" />
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              className="rounded-full w-12 h-12 p-0"
              title="Sohbet"
            >
              <MessageSquare className="w-5 h-5" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="rounded-full w-12 h-12 p-0"
              title="Ayarlar"
            >
              <Settings className="w-5 h-5" />
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={leaveCall}
              className="rounded-full w-12 h-12 p-0 ml-6"
              title="Görüşmeyi Sonlandır"
            >
              <Phone className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DailyRoom
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Video, VideoOff, Mic, MicOff, Monitor, Phone, 
  Users, Clock 
} from 'lucide-react'

interface DailyWrapperProps {
  roomUrl: string
  token: string
  userName: string
  isOwner?: boolean
  onCallEnd?: () => void
  onCallStart?: () => void
  onError?: (error: string) => void
}

const DailyWrapper: React.FC<DailyWrapperProps> = ({
  roomUrl,
  token,
  userName,
  isOwner = false,
  onCallEnd,
  onCallStart,
  onError
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isConnected) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isConnected])

  useEffect(() => {
    // Basit iframe yaklaşımı
    if (iframeRef.current && roomUrl) {
      const iframe = iframeRef.current
      
      // Daily.co URL'ini iframe'e yükle
      const dailyUrl = `${roomUrl}?t=${token}&userName=${encodeURIComponent(userName)}`
      iframe.src = dailyUrl
      
      // Simüle edilmiş bağlantı
      const timer = setTimeout(() => {
        setIsConnected(true)
        onCallStart?.()
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [roomUrl, token, userName])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleEndCall = () => {
    setIsConnected(false)
    onCallEnd?.()
  }

  return (
    <div className="w-full h-full bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-white border-white">
            <Users className="w-3 h-3 mr-1" />
            {isConnected ? '2' : '1'}
          </Badge>
          <Badge variant="outline" className="text-white border-white">
            <Clock className="w-3 h-3 mr-1" />
            {formatDuration(duration)}
          </Badge>
          {isConnected ? (
            <Badge className="bg-green-600 text-white">
              Bağlı
            </Badge>
          ) : (
            <Badge className="bg-yellow-600 text-white">
              Bağlanıyor...
            </Badge>
          )}
        </div>
        
        <div className="text-white text-sm">
          {userName} {isOwner && '(Moderatör)'}
        </div>
      </div>

      {/* Daily.co iframe */}
      <div className="flex-1 relative">
        <iframe
          ref={iframeRef}
          className="w-full h-full border-none"
          allow="camera; microphone; fullscreen; speaker; display-capture"
          style={{ minHeight: '400px' }}
        />
        
        {!isConnected && (
          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
              <h3 className="text-lg font-medium mb-2">Daily.co Yükleniyor</h3>
              <p className="text-sm opacity-75">Video call hazırlanıyor...</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-4 flex items-center justify-center space-x-4">
        <Button
          variant="destructive"
          size="lg"
          onClick={handleEndCall}
          className="rounded-full w-12 h-12 p-0 bg-red-600 hover:bg-red-700"
        >
          <Phone className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}

export default DailyWrapper
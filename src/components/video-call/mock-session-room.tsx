'use client'

import React, { useState, useEffect } from 'react'
import { Users, Clock, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import PublicDaily from './public-daily'

interface MockSessionRoomProps {
  sessionData: {
    id: string
    title?: string
    client?: { first_name: string; last_name: string }
    consultant?: { first_name: string; last_name: string }
    session_date?: string
    start_time?: string
    end_time?: string
  }
  userRole: 'client' | 'consultant'
  userName: string
}

const MockSessionRoom: React.FC<MockSessionRoomProps> = ({
  sessionData,
  userRole,
  userName
}) => {
  const router = useRouter()
  
  const [sessionDuration, setSessionDuration] = useState(0)
  const [isConnected, setIsConnected] = useState(false)
  const [participants, setParticipants] = useState(1)

  // Session timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isConnected) {
      interval = setInterval(() => {
        setSessionDuration(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isConnected])

  // Mock connection after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsConnected(true)
      setParticipants(2)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-white hover:bg-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri
          </Button>
          <div>
            <h1 className="text-white font-semibold">
              {sessionData.title || 'Danışmanlık Seansı'}
            </h1>
            <p className="text-gray-300 text-sm">
              {userRole === 'client' 
                ? `Danışman: ${sessionData.consultant?.first_name} ${sessionData.consultant?.last_name}`
                : `Danışan: ${sessionData.client?.first_name} ${sessionData.client?.last_name}`
              }
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-white border-white">
            <Users className="w-3 h-3 mr-1" />
            {participants}
          </Badge>
          <Badge variant="outline" className="text-white border-white">
            <Clock className="w-3 h-3 mr-1" />
            {formatDuration(sessionDuration)}
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
      </div>

      {/* Main Video Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          <PublicDaily
            sessionId={sessionData.id}
            userName={userName}
            userRole={userRole}
          />
        </div>
      </div>
    </div>
  )
}

export default MockSessionRoom
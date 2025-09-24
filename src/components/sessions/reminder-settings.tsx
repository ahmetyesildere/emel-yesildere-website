'use client'

import React, { useState, useEffect } from 'react'
import { Bell, Mail, MessageSquare, Clock, Settings, Check, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/toast-provider'

interface ReminderSettingsProps {
  sessionId: string
  userId: string
  sessionDate: string
  sessionTime: string
  onSettingsUpdate?: () => void
}

interface ReminderSetting {
  id: string
  type: 'email' | 'sms' | 'push'
  timing: number // minutes before session
  enabled: boolean
  message?: string
}

export const ReminderSettings: React.FC<ReminderSettingsProps> = ({
  sessionId,
  userId,
  sessionDate,
  sessionTime,
  onSettingsUpdate
}) => {
  const { success: showSuccess, error: showError } = useToast()
  const [reminders, setReminders] = useState<ReminderSetting[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Varsayılan hatırlatma ayarları
  const defaultReminders: Omit<ReminderSetting, 'id'>[] = [
    {
      type: 'email',
      timing: 1440, // 24 saat önce
      enabled: true,
      message: 'Yarın seans randevunuz var'
    },
    {
      type: 'email',
      timing: 60, // 1 saat önce
      enabled: true,
      message: 'Seansınız 1 saat sonra başlayacak'
    },
    {
      type: 'sms',
      timing: 30, // 30 dakika önce
      enabled: false,
      message: 'Seansınız 30 dakika sonra başlayacak'
    },
    {
      type: 'push',
      timing: 15, // 15 dakika önce
      enabled: false,
      message: 'Seansınız 15 dakika sonra başlayacak'
    }
  ]

  useEffect(() => {
    loadReminderSettings()
  }, [sessionId])

  const loadReminderSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('session_reminders')
        .select('*')
        .eq('session_id', sessionId)
        .eq('user_id', userId)

      if (error) throw error

      if (data && data.length > 0) {
        setReminders(data)
      } else {
        // Varsayılan ayarları kullan
        const defaultWithIds = defaultReminders.map(reminder => ({
          ...reminder,
          id: `default_${reminder.type}_${reminder.timing}`
        }))
        setReminders(defaultWithIds)
      }
    } catch (error) {
      console.error('Hatırlatma ayarları yüklenirken hata:', error)
      showError('Hatırlatma ayarları yüklenemedi')
    } finally {
      setIsLoading(false)
    }
  }

  const saveReminderSettings = async () => {
    setIsSaving(true)
    try {
      // Önce mevcut ayarları sil
      await supabase
        .from('session_reminders')
        .delete()
        .eq('session_id', sessionId)
        .eq('user_id', userId)

      // Aktif hatırlatmaları kaydet
      const activeReminders = reminders
        .filter(r => r.enabled)
        .map(r => ({
          session_id: sessionId,
          user_id: userId,
          type: r.type,
          timing_minutes: r.timing,
          message: r.message,
          is_sent: false,
          created_at: new Date().toISOString()
        }))

      if (activeReminders.length > 0) {
        const { error } = await supabase
          .from('session_reminders')
          .insert(activeReminders)

        if (error) throw error
      }

      showSuccess('Hatırlatma ayarları kaydedildi')
      onSettingsUpdate?.()
    } catch (error) {
      console.error('Hatırlatma ayarları kaydedilirken hata:', error)
      showError('Hatırlatma ayarları kaydedilemedi')
    } finally {
      setIsSaving(false)
    }
  }

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(r => 
      r.id === id ? { ...r, enabled: !r.enabled } : r
    ))
  }

  const getTimingText = (minutes: number) => {
    if (minutes >= 1440) {
      const days = Math.floor(minutes / 1440)
      return `${days} gün önce`
    } else if (minutes >= 60) {
      const hours = Math.floor(minutes / 60)
      return `${hours} saat önce`
    } else {
      return `${minutes} dakika önce`
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="w-4 h-4" />
      case 'sms':
        return <MessageSquare className="w-4 h-4" />
      case 'push':
        return <Bell className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'email':
        return 'text-blue-600 bg-blue-100'
      case 'sms':
        return 'text-green-600 bg-green-100'
      case 'push':
        return 'text-purple-600 bg-purple-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getTypeName = (type: string) => {
    switch (type) {
      case 'email':
        return 'E-posta'
      case 'sms':
        return 'SMS'
      case 'push':
        return 'Bildirim'
      default:
        return type
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-gray-600">Hatırlatma ayarları yükleniyor...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="w-5 h-5 mr-2 text-blue-600" />
          Hatırlatma Ayarları
        </CardTitle>
        <p className="text-sm text-gray-600">
          Seansınız için otomatik hatırlatmalar alın
        </p>
      </CardHeader>

      <CardContent className="p-6">
        {/* Seans Bilgisi */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex items-center mb-2">
            <Clock className="w-4 h-4 text-gray-600 mr-2" />
            <span className="font-medium text-gray-900">Seans Tarihi</span>
          </div>
          <p className="text-gray-700">
            {new Date(sessionDate + 'T12:00:00').toLocaleDateString('tr-TR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })} - {sessionTime.slice(0, 5)}
          </p>
        </div>

        {/* Hatırlatma Listesi */}
        <div className="space-y-4 mb-6">
          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              className={`p-4 border rounded-lg transition-colors ${
                reminder.enabled 
                  ? 'border-blue-200 bg-blue-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${getTypeColor(reminder.type)}`}>
                    {getTypeIcon(reminder.type)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">
                        {getTypeName(reminder.type)}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {getTimingText(reminder.timing)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {reminder.message}
                    </p>
                  </div>
                </div>

                <Switch
                  checked={reminder.enabled}
                  onCheckedChange={() => toggleReminder(reminder.id)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Aktif Hatırlatma Özeti */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h5 className="font-medium text-blue-900 mb-2">Aktif Hatırlatmalar</h5>
          <div className="space-y-1">
            {reminders.filter(r => r.enabled).length === 0 ? (
              <p className="text-sm text-blue-700">Henüz aktif hatırlatma yok</p>
            ) : (
              reminders
                .filter(r => r.enabled)
                .sort((a, b) => b.timing - a.timing)
                .map((reminder, index) => (
                  <div key={index} className="flex items-center text-sm text-blue-700">
                    <Check className="w-3 h-3 mr-2" />
                    {getTypeName(reminder.type)} - {getTimingText(reminder.timing)}
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Kaydet Butonu */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Değişiklikler otomatik olarak kaydedilmez
          </div>
          <Button
            onClick={saveReminderSettings}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Kaydediliyor...
              </>
            ) : (
              <>
                <Settings className="w-4 h-4 mr-2" />
                Ayarları Kaydet
              </>
            )}
          </Button>
        </div>

        {/* Bilgi Notu */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-700">
            <strong>Not:</strong> SMS hatırlatmaları için telefon numaranızın doğrulanmış olması gerekir. 
            Push bildirimleri için tarayıcı izni vermeniz gerekir.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}


'use client'

import React, { useState, useEffect } from 'react'
import { Bell, CheckCircle, Clock, Calendar, ArrowLeft, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth/auth-context'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/toast-provider'
import { useRouter } from 'next/navigation'

interface Notification {
  id: string
  title: string
  message: string
  type: string
  is_read: boolean
  created_at: string
  related_session_id?: string
}

const NotificationsPage = () => {
  const { user } = useAuth()
  const { success: showSuccess, error: showError } = useToast()
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      loadNotifications()
    }
  }, [user?.id])

  const loadNotifications = async () => {
    if (!user?.id) return

    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setNotifications(data || [])
    } catch (error) {
      console.error('Bildirimler yüklenirken hata:', error)
      showError('Bildirimler yüklenemedi')
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)

      if (error) throw error

      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      )
    } catch (error) {
      console.error('Bildirim okundu olarak işaretlenirken hata:', error)
      showError('Bildirim güncellenemedi')
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)

      if (error) throw error

      setNotifications(prev =>
        prev.filter(notification => notification.id !== notificationId)
      )
      showSuccess('Bildirim silindi')
    } catch (error) {
      console.error('Bildirim silinirken hata:', error)
      showError('Bildirim silinemedi')
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'session_confirmed':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'session_completed':
        return <Calendar className="w-5 h-5 text-blue-600" />
      case 'session_payment':
        return <Clock className="w-5 h-5 text-yellow-600" />
      default:
        return <Bell className="w-5 h-5 text-gray-600" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'session_confirmed':
        return 'border-l-green-500 bg-green-50'
      case 'session_completed':
        return 'border-l-blue-500 bg-blue-50'
      case 'session_payment':
        return 'border-l-yellow-500 bg-yellow-50'
      default:
        return 'border-l-gray-500 bg-gray-50'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Bildirimler yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri
          </Button>
          <div className="flex items-center">
            <Bell className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bildirimler</h1>
              <p className="text-gray-600">
                {notifications.filter(n => !n.is_read).length} okunmamış bildirim
              </p>
            </div>
          </div>
        </div>

        {/* Bildirimler */}
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Henüz bildirim yok
              </h3>
              <p className="text-gray-600">
                Seans durumları ve önemli güncellemeler burada görünecek.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`border-l-4 ${getNotificationColor(notification.type)} ${
                  !notification.is_read ? 'shadow-lg' : 'opacity-75'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {notification.title}
                          </h3>
                          {!notification.is_read && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              Yeni
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-gray-700 mb-3">
                          {notification.message}
                        </p>
                        
                        <p className="text-sm text-gray-500">
                          {formatDate(notification.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      {!notification.is_read && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Okundu
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteNotification(notification.id)}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Tümünü okundu işaretle */}
        {notifications.some(n => !n.is_read) && (
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  const unreadIds = notifications
                    .filter(n => !n.is_read)
                    .map(n => n.id)

                  const { error } = await supabase
                    .from('notifications')
                    .update({ is_read: true })
                    .in('id', unreadIds)

                  if (error) throw error

                  setNotifications(prev =>
                    prev.map(notification => ({ ...notification, is_read: true }))
                  )
                  showSuccess('Tüm bildirimler okundu olarak işaretlendi')
                } catch (error) {
                  showError('Bildirimler güncellenemedi')
                }
              }}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Tümünü Okundu İşaretle
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default NotificationsPage
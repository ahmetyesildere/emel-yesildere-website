'use client'

import React, { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth/auth-context'
import { useRouter } from 'next/navigation'

export const SessionNotificationBadge = () => {
  const { user, isConsultant } = useAuth()
  const router = useRouter()
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    if (!user || !isConsultant) return

    loadPendingSessionsCount()

    // Realtime subscription for session changes
    const channel = supabase
      .channel('session-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sessions',
          filter: `consultant_id=eq.${user.id}`
        },
        (payload) => {
          console.log('🔔 Yeni seans eklendi:', payload)
          // Yeni seans eklendiğinde hemen sayıyı yenile
          loadPendingSessionsCount()
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sessions',
          filter: `consultant_id=eq.${user.id}`
        },
        (payload) => {
          console.log('🔔 Seans güncellendi:', payload)
          // Seans güncellendiğinde hemen sayıyı yenile
          loadPendingSessionsCount()
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'sessions',
          filter: `consultant_id=eq.${user.id}`
        },
        (payload) => {
          console.log('🔔 Seans silindi:', payload)
          // Seans silindiğinde hemen sayıyı yenile
          loadPendingSessionsCount()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, isConsultant])

  const loadPendingSessionsCount = async () => {
    if (!user) return

    try {
      // Bekleyen seanslar: payment_status 'pending' veya 'payment_submitted' olanlar VE status 'cancelled' olmayanlar
      // Bu, consultant sayfasındaki "Bekleyen" tab ile aynı mantık
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('consultant_id', user.id)
        .in('payment_status', ['pending', 'payment_submitted'])
        .neq('status', 'cancelled')

      if (error) throw error

      const newCount = data?.length || 0
      console.log('🔔 Bekleyen seans sayısı güncellendi:', { oldCount: pendingCount, newCount })
      setPendingCount(newCount)
    } catch (error) {
      console.error('❌ Bekleyen seans sayısı yüklenirken hata:', error)
    }
  }

  // Custom event listener for manual refresh
  useEffect(() => {
    const handleRefresh = () => {
      console.log('🔔 Manuel yenileme tetiklendi')
      loadPendingSessionsCount()
    }

    window.addEventListener('refreshSessionNotifications', handleRefresh)
    return () => {
      window.removeEventListener('refreshSessionNotifications', handleRefresh)
    }
  }, [user])

  const handleClick = () => {
    router.push('/consultant')
  }

  if (!isConsultant || pendingCount === 0) return null

  return (
    <button
      onClick={handleClick}
      className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
      title={`${pendingCount} yeni seans talebi`}
    >
      <Bell className="w-5 h-5 text-gray-600" />
      <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 min-w-[20px] h-5 flex items-center justify-center animate-pulse">
        {pendingCount}
      </Badge>
    </button>
  )
}

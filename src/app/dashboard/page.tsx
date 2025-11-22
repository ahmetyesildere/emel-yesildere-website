'use client'

import React from 'react'
import { useAuth } from '@/lib/auth/auth-context'
import ClientDashboard from '@/components/client/client-dashboard'

const DashboardPage = () => {
  const { user, profile, isClient } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ana Sayfaya Yönlendiriliyorsunuz</h2>
          <p className="text-gray-600">Lütfen bekleyin...</p>
        </div>
      </div>
    )
  }

  // Client dashboard'ı göster
  return <ClientDashboard />
}

export default DashboardPage
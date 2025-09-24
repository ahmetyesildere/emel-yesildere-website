'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
// import { AdminGuard } from '@/components/auth/admin-guard' // Geçici olarak kaldırıldı
import SessionCreateForm from '@/components/sessions/session-create-form'

export default function CreateSessionPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Yeni Seans Oluştur</h1>
          <p className="mt-2 text-gray-600">
            Danışman ve müşteri için yeni bir seans randevusu oluşturun
          </p>
        </div>

        <SessionCreateForm />
      </div>
    </div>
  )
}
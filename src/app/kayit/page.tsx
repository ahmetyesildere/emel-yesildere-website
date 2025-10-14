'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import BasicRegister from '@/components/auth/basic-register'

export default function KayitPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4">
      <BasicRegister />
    </div>
  )
}
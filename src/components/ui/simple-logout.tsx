'use client'

import React from 'react'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

const SimpleLogout: React.FC = () => {
  const handleLogout = () => {
    const confirmed = window.confirm('Çıkış yapmak istediğinizden emin misiniz?')
    if (!confirmed) return

    console.log('🚪 Simple logout başlıyor...')

    // Storage'ı temizle
    if (typeof window !== 'undefined') {
      try {
        localStorage.clear()
        sessionStorage.clear()
        console.log('✅ Storage temizlendi')
      } catch (e) {
        console.warn('Storage temizleme hatası:', e)
      }
    }

    // Sayfayı yenile
    console.log('🔄 Sayfa yenileniyor...')
    window.location.href = '/'
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      className="text-red-700 hover:bg-red-50 hover:text-red-800 w-full justify-start"
    >
      <LogOut className="w-4 h-4 mr-2" />
      Çıkış Yap (Simple)
    </Button>
  )
}

export default SimpleLogout
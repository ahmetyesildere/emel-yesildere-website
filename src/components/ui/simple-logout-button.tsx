'use client'

import React from 'react'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

export const SimpleLogoutButton: React.FC = () => {
  const handleLogout = async () => {
    const confirmed = window.confirm('Çıkış yapmak istediğinizden emin misiniz?')
    
    if (confirmed) {
      try {
        console.log('🚪 Basit çıkış yapılıyor...')
        
        // Storage temizle
        localStorage.clear()
        sessionStorage.clear()
        
        // Supabase'den çıkış yap
        await supabase.auth.signOut()
        
        // Ana sayfaya yönlendir
        window.location.href = '/'
        
      } catch (error) {
        console.error('Çıkış hatası:', error)
        window.location.href = '/'
      }
    }
  }

  return (
    <Button
      onClick={handleLogout}
      variant="outline"
      size="sm"
      className="flex items-center text-red-600 hover:text-red-700 hover:bg-red-50"
      title="Hesaptan çıkış yap"
    >
      <LogOut className="w-4 h-4 mr-2" />
      Çıkış Yap
    </Button>
  )
}
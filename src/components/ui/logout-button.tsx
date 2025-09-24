'use client'

import React, { useState } from 'react'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth/auth-context'
import { useRouter } from 'next/navigation'
import { useSafeToast } from '@/hooks/use-safe-toast'

interface LogoutButtonProps {
  className?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  children?: React.ReactNode
  onLogoutStart?: () => void
  onLogoutComplete?: () => void
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  className = '',
  variant = 'ghost',
  size = 'sm',
  showIcon = true,
  children,
  onLogoutStart,
  onLogoutComplete
}) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { signOut } = useAuth()
  const router = useRouter()
  const toast = useSafeToast()

  const handleLogout = async () => {
    if (isLoggingOut) return

    setIsLoggingOut(true)
    onLogoutStart?.()

    try {
      console.log('🚪 Logout button çıkış yapılıyor...')

      // Auth context'teki signOut fonksiyonunu kullan
      await signOut()

      console.log('✅ Logout button çıkış tamamlandı')
      onLogoutComplete?.()

      // Sayfayı tamamen yenile (en güvenli yöntem)
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }

    } catch (error) {
      console.error('❌ Logout button çıkış hatası:', error)
      
      // Hata durumunda da sayfayı yenile
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`text-red-700 hover:bg-red-50 hover:text-red-800 ${className}`}
      title={isLoggingOut ? 'Çıkış yapılıyor...' : 'Hesaptan çıkış yap'}
    >
      {showIcon && <LogOut className="w-4 h-4 mr-2" />}
      {children || (isLoggingOut ? 'Çıkış Yapılıyor...' : 'Çıkış Yap')}
    </Button>
  )
}

export default LogoutButton
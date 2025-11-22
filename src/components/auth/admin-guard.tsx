'use client'

import React from 'react'
import { useAuth } from '@/lib/auth/auth-context'
import { Shield, AlertTriangle, LogIn, User } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import SimpleLoginForm from './simple-login-form'

interface AdminGuardProps {
  children: React.ReactNode
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { user, profile, loading, isAdmin, refreshSession, session } = useAuth()

  // Debug logları
  console.log('AdminGuard state:', {
    user: user?.email,
    profile: profile,
    loading: loading,
    isAdmin: isAdmin
  })

  // Admin email kontrolü
  const adminEmails = ['ahmet@emelyesildere.com', 'ahmet.yesildere@gmail.com', 'ahmetyesildere@gmail.com']
  const isAdminEmail = adminEmails.includes(user?.email || '')

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Yükleniyor...</h3>
            <p className="text-gray-600">Kimlik doğrulanıyor...</p>
          </CardContent>
        </Card>
      </div>
    )
  }



  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md space-y-6">
          <Card>
            <CardContent className="p-6 text-center">
              <LogIn className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Ana Sayfaya Yönlendiriliyorsunuz</h2>
              <p className="text-gray-600 mb-4">
                Lütfen bekleyin...
              </p>
            </CardContent>
          </Card>

          <SimpleLoginForm />
        </div>
      </div>
    )
  }

  // Admin kontrolü - hem isAdmin hem de admin email kontrolü
  if (!isAdmin && !isAdminEmail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Erişim Reddedildi</h2>
            <p className="text-gray-600 mb-6">
              Bu sayfaya erişim yetkiniz bulunmamaktadır. Admin paneline sadece yöneticiler erişebilir.
            </p>

            <div className="p-4 bg-gray-50 rounded-lg mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">
                    {profile?.first_name} {profile?.last_name}
                  </div>
                  <div className="text-sm text-gray-600">{profile?.email}</div>
                  <div className="text-xs text-gray-500">Rol: {profile?.role}</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => window.history.back()}
                className="w-full"
              >
                Geri Dön
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = '/'}
                className="w-full"
              >
                Ana Sayfaya Git
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Admin access granted
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6 text-blue-600" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
                <p className="text-sm text-gray-600">Hoş geldiniz, {profile?.first_name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Session Refresh Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={refreshSession}
                className="text-xs"
                title="Oturumu yenile"
              >
                🔄 Yenile
              </Button>

              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {profile?.first_name} {profile?.last_name}
                </div>
                <div className="text-xs text-gray-600">{profile?.email}</div>
                {session?.expires_at && (
                  <div className="text-xs text-gray-500">
                    Oturum: {new Date(session.expires_at * 1000).toLocaleTimeString('tr-TR')}
                  </div>
                )}
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {children}
    </div>
  )
}

export default AdminGuard
'use client'

import React, { useState } from 'react'
import { useAuth } from '@/lib/auth/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, User, Bell, Shield, ChevronRight, LogOut } from 'lucide-react'
import SimpleAvailabilityCalendarV3 from '@/components/consultant/simple-availability-calendar-v3'
import ProfileEditModal from '@/components/profile/profile-edit-modal'
import ConsultantProfileModal from '@/components/consultant/consultant-profile-modal'
import ConfirmLogoutDialog from '@/components/ui/confirm-logout-dialog'
import { formatPhoneNumber } from '@/lib/phone-utils'
import { useSafeToast } from '@/hooks/use-safe-toast'

const SettingsPage = () => {
  const { user, profile, isConsultant, isVisitor, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState('general')
  const [showProfileEditModal, setShowProfileEditModal] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const toast = useSafeToast()

  // Logout handler
  const handleLogout = async () => {
    try {
      console.log('🚪 Çıkış yapılıyor...')
      await signOut()
      console.log('✅ Çıkış başarılı')
    } catch (error) {
      console.error('❌ Çıkış hatası:', error)
      toast.error('Çıkış Hatası', 'Çıkış sırasında bir hata oluştu')
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ana Sayfaya Yönlendiriliyorsunuz</h2>
          <p className="text-gray-600">Lütfen bekleyin...</p>
        </div>
      </div>
    )
  }

  // Ziyaretçiler için sadece genel ayarlar, diğerleri için tüm sekmeler
  const settingsTabs = isVisitor 
    ? [{ id: 'general', name: 'Profil Bilgileri', icon: User }]
    : [
        { id: 'general', name: 'Genel Ayarlar', icon: User },
        { id: 'notifications', name: 'Bildirimler', icon: Bell },
        { id: 'privacy', name: 'Gizlilik', icon: Shield },
        ...(isConsultant ? [{ id: 'availability', name: 'Müsaitlik Takvimi', icon: Calendar }] : [])
      ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isVisitor ? 'Profil Bilgileri' : 'Ayarlar'}
            </h1>
            <p className="text-gray-600">
              {isVisitor 
                ? 'Profil bilgilerinizi görüntüleyin' 
                : 'Hesap ayarlarınızı ve tercihlerinizi yönetin'
              }
            </p>
          </div>

          <div className={`grid grid-cols-1 ${isVisitor ? '' : 'lg:grid-cols-4'} gap-6`}>
            {/* Sidebar - Sadece ziyaretçi değilse göster */}
            {!isVisitor && (
              <div className="lg:col-span-1">
                <Card>
                  <CardContent className="p-0">
                    <nav className="space-y-1">
                      {settingsTabs.map((tab) => {
                        const Icon = tab.icon
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium rounded-lg transition-colors ${
                              activeTab === tab.id
                                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          >
                            <div className="flex items-center">
                              <Icon className="w-5 h-5 mr-3" />
                              {tab.name}
                            </div>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        )
                      })}
                    </nav>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Content */}
            <div className={isVisitor ? '' : 'lg:col-span-3'}>
              {(activeTab === 'general' || isVisitor) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      {isVisitor ? 'Profil Bilgileri' : 'Genel Ayarlar'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Profil Bilgileri</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <label className="block text-gray-600 mb-1">Ad Soyad</label>
                            <p className="text-gray-900">{profile?.first_name} {profile?.last_name}</p>
                          </div>
                          <div>
                            <label className="block text-gray-600 mb-1">E-posta</label>
                            <p className="text-gray-900">{profile?.email}</p>
                          </div>
                          <div>
                            <label className="block text-gray-600 mb-1">Telefon</label>
                            <p className="text-gray-900">{formatPhoneNumber(profile?.phone) || 'Belirtilmemiş'}</p>
                          </div>
                          <div>
                            <label className="block text-gray-600 mb-1">Rol</label>
                            <p className="text-gray-900">
                              {profile?.role === 'admin' ? 'Admin' :
                               profile?.role === 'consultant' ? 'Danışman' :
                               profile?.role === 'client' ? 'Danışan' : 'Ziyaretçi'}
                            </p>
                          </div>
                        </div>
                        {!isVisitor && (
                          <Button 
                            className="mt-4" 
                            variant="outline"
                            onClick={() => setShowProfileEditModal(true)}
                          >
                            Profili Düzenle
                          </Button>
                        )}
                        {isVisitor && (
                          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">
                              Ziyaretçi hesabı ile profil düzenleme yapılamaz. Hesap türünüzü yükseltmek için admin ile iletişime geçin.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'notifications' && !isVisitor && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bell className="w-5 h-5 mr-2" />
                      Bildirim Ayarları
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">E-posta Bildirimleri</h4>
                          <p className="text-sm text-gray-600">Yeni mesajlar ve güncellemeler için e-posta alın</p>
                        </div>
                        <Button variant="outline" size="sm">Aktif</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">SMS Bildirimleri</h4>
                          <p className="text-sm text-gray-600">Önemli güncellemeler için SMS alın</p>
                        </div>
                        <Button variant="outline" size="sm">Pasif</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'privacy' && !isVisitor && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      Gizlilik Ayarları
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Profil Görünürlüğü</h4>
                          <p className="text-sm text-gray-600">Profilinizin diğer kullanıcılar tarafından görünürlüğü</p>
                        </div>
                        <Button variant="outline" size="sm">Herkese Açık</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">İletişim Bilgileri</h4>
                          <p className="text-sm text-gray-600">Telefon ve e-posta bilgilerinizin görünürlüğü</p>
                        </div>
                        <Button variant="outline" size="sm">Sadece Danışmanlar</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'availability' && isConsultant && !isVisitor && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Müsaitlik Takvimi
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SimpleAvailabilityCalendarV3 />
                  </CardContent>
                </Card>
              )}

              {/* Logout Section */}
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-red-700">
                    <LogOut className="w-5 h-5 mr-2" />
                    Hesaptan Çıkış
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-red-600">
                      Hesabınızdan çıkış yapmak istiyorsanız aşağıdaki butona tıklayın. 
                      Tekrar giriş yapmak için email ve şifrenizi kullanmanız gerekecek.
                    </p>
                    <Button 
                      onClick={() => setShowLogoutDialog(true)}
                      variant="outline"
                      className="bg-red-600 text-white hover:bg-red-700 border-red-600 hover:border-red-700"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Çıkış Yap
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Edit Modal */}
      {isConsultant ? (
        <ConsultantProfileModal
          isOpen={showProfileEditModal}
          onClose={() => setShowProfileEditModal(false)}
          onSuccess={() => {
            // Refresh page or update context
            window.location.reload()
          }}
        />
      ) : (
        <ProfileEditModal
          isOpen={showProfileEditModal}
          onClose={() => setShowProfileEditModal(false)}
          onSuccess={() => {
            // Refresh page or update context
            window.location.reload()
          }}
        />
      )}

      {/* Logout Confirmation Dialog */}
      <ConfirmLogoutDialog
        isOpen={showLogoutDialog}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutDialog(false)}
      />
    </div>
  )
}

export default SettingsPage
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Phone, Mail, User, LogOut, Settings, Shield, ChevronDown, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import Logo from '@/components/ui/logo'
import { useAuth } from '@/lib/auth/auth-context'
import { supabase } from '@/lib/supabase'
import AuthModal from '@/components/auth/auth-modal'
import LogoutButton from '@/components/ui/logout-button'
import { useOutsideClick } from '@/hooks/use-outside-click'
import { useContactInfo } from '@/hooks/use-contact-info'
import { SessionNotificationBadge } from '@/components/notifications/session-notification-badge'

const navigation = [
  { name: 'Ana Sayfa', href: '/' },
  { name: 'Hakkımda', href: '/hakkimda' },
  { name: 'Hizmetlerimiz', href: '/hizmetlerimiz' },
  { name: 'Blog', href: '/blog' },
  { name: 'İletişim', href: '/iletisim' },
  { name: 'SSS', href: '/sss' },
]

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const { contactInfo, formatPhoneNumber, isLoading: contactLoading } = useContactInfo()
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const pathname = usePathname()
  const { user, profile, loading, isAdmin, isConsultant, isClient, isVisitor } = useAuth()

  // Outside click hook for user menu
  const userMenuRef = useOutsideClick<HTMLDivElement>(() => {
    setUserMenuOpen(false)
  })

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode)
    setAuthModalOpen(true)
  }



  const getRoleBadge = () => {
    if (isAdmin) return <Badge className="bg-red-100 text-red-800 text-xs">Admin</Badge>
    if (isConsultant) return <Badge className="bg-purple-100 text-purple-800 text-xs">Danışman</Badge>
    if (profile?.role === 'client') return <Badge className="bg-blue-100 text-blue-800 text-xs">Danışan</Badge>
    if (profile?.role === 'staff') return <Badge className="bg-green-100 text-green-800 text-xs">Personel</Badge>
    // Giriş yapmış kullanıcı için varsayılan rol gösterme
    if (user) return null
    return <Badge className="bg-gray-100 text-gray-800 text-xs">Ziyaretçi</Badge>
  }

  // Kullanıcı adını al - profil yüklenene kadar loading göster
  const getUserDisplayName = () => {
    // Profil yükleniyorsa veya profil yoksa loading göster
    if (loading || (user && !profile)) {
      return 'Yükleniyor...'
    }
    
    // Önce isim-soyisim kombinasyonunu kontrol et
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`
    }
    
    // Sadece isim varsa
    if (profile?.first_name) {
      return profile.first_name
    }
    
    // Son çare olarak email'den isim çıkar (ama bu duruma gelmemeli)
    if (profile?.email) {
      return profile.email.split('@')[0]
    }
    
    return 'Kullanıcı'
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-gradient-to-r from-white via-blue-50/30 to-purple-50/30 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-lg">
      {/* Top Bar */}
      <div className="border-b border-gray-100 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
        <div className="container mx-auto px-4">
          <div className="flex h-10 items-center justify-between text-sm">
            <div className="hidden sm:flex items-center space-x-4 text-gray-600">
              <div className="flex items-center space-x-1">
                <Phone className="h-3 w-3" />
                <span>
                  {contactLoading ? (
                    <span className="inline-block w-24 h-3 bg-gray-200 rounded animate-pulse"></span>
                  ) : (
                    formatPhoneNumber(contactInfo.phone)
                  )}
                </span>
              </div>
              <div className="hidden md:flex items-center space-x-1">
                <Mail className="h-3 w-3" />
                <span>
                  {contactLoading ? (
                    <span className="inline-block w-32 h-3 bg-gray-200 rounded animate-pulse"></span>
                  ) : (
                    contactInfo.email
                  )}
                </span>
              </div>
            </div>
            
            {/* Mobil Rezervasyon Butonu */}
            <div className="flex lg:hidden items-center gap-2">
              {user ? (
                <Link href="/seans-al">
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-4 py-2 rounded-full text-sm shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    📅 Seans Al
                  </Button>
                </Link>
              ) : (
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-4 py-2 rounded-full text-sm shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => handleAuthClick('register')}
                >
                  🚀 Kayıt
                </Button>
              )}
            </div>
            <div className="hidden lg:flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-1 rounded-full border border-blue-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">🔥 Online Randevu:</span>
              </div>
              {user ? (
                <Link href="/seans-al">
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-4 py-2 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 animate-pulse hover:animate-none"
                  >
                    ⚡ Hemen Rezervasyon Yap
                  </Button>
                </Link>
              ) : (
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-4 py-2 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 animate-pulse hover:animate-none"
                  onClick={() => handleAuthClick('register')}
                  title="Hızlı randevu almak için kayıt olun"
                >
                  🚀 Kayıt Ol & Randevu Al
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Logo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${isActive(item.href)
                  ? 'text-primary border-b-2 border-primary pb-1'
                  : 'text-gray-600'
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <SessionNotificationBadge />
                <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900">
                      {getUserDisplayName()}
                    </div>
                    <div className="flex items-center space-x-1">
                      {getRoleBadge()}
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {/* User Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-30">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <div className="text-sm font-medium text-gray-900">
                        {getUserDisplayName()}
                      </div>
                      <div className="text-xs text-gray-600">{profile?.email}</div>
                      <div className="mt-1">{getRoleBadge()}</div>
                    </div>

                    {/* Ziyaretçiler için dashboard linkleri gösterilmez */}
                    {!isVisitor && (
                      <div className="py-1">
                        {/* Dashboard Links */}
                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => {
                              console.log('Admin panel linkine tıklandı')
                              setUserMenuOpen(false)
                            }}
                          >
                            <Shield className="w-4 h-4 mr-3" />
                            Admin Panel
                          </Link>
                        )}

                        {isConsultant && (
                          <Link
                            href="/consultant"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <User className="w-4 h-4 mr-3" />
                            Danışman Paneli
                          </Link>
                        )}

                        {/* Client Dashboard - Sadece client rolü için */}
                        {isClient && (
                          <Link
                            href="/client"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <User className="w-4 h-4 mr-3" />
                            Bana Özel
                          </Link>
                        )}
                      </div>
                    )}

                    <div className="py-1">
                      {/* Ziyaretçiler için sadece profil */}
                      {isVisitor ? (
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User className="w-4 h-4 mr-3" />
                          Profil Bilgileri
                        </Link>
                      ) : (
                        <>
                          <Link
                            href="/profile"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <User className="w-4 h-4 mr-3" />
                            Profil Bilgileri
                          </Link>

                          {/* Seanslarım - Sadece client'lar için */}
                          {isClient && (
                            <Link
                              href="/seanslarim"
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <Calendar className="w-4 h-4 mr-3" />
                              Seanslarım
                            </Link>
                          )}

                          <Link
                            href="/settings"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Settings className="w-4 h-4 mr-3" />
                            Ayarlar
                          </Link>
                        </>
                      )}
                    </div>

                    <div className="border-t border-gray-100 py-1">
                      <div className="px-4 py-2 space-y-2">
                        <LogoutButton 
                          className="w-full justify-start"
                          variant="ghost"
                          onLogoutStart={() => setUserMenuOpen(false)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAuthClick('login')}
                  disabled={loading}
                  title="Mevcut hesabınızla giriş yapın"
                >
                  Giriş Yap
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleAuthClick('register')}
                  disabled={loading}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  title="Yeni hesap oluşturun"
                >
                  Kayıt Ol
                </Button>
              </>
            )}


          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm" title="Menüyü aç">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-8">
                <Logo size="sm" />

                <nav className="flex flex-col space-y-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`text-lg font-medium transition-colors hover:text-primary ${isActive(item.href) ? 'text-primary' : 'text-gray-600'
                        }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>

                <div className="pt-4 border-t space-y-3">
                  {user ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-900">
                          {getUserDisplayName()}
                        </div>
                        <div className="text-xs text-gray-600">{profile?.email}</div>
                        <div className="mt-1">{getRoleBadge()}</div>
                      </div>

                      <div className="space-y-2">
                        {/* Seans Al Butonu - Tüm kullanıcılar için */}
                        <Link
                          href="/seans-al"
                          className="flex items-center w-full p-3 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg shadow-md"
                          onClick={() => setIsOpen(false)}
                        >
                          <Calendar className="w-4 h-4 mr-3" />
                          📅 Seans Al
                        </Link>

                        {/* Dashboard Links */}
                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="flex items-center w-full p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                            onClick={() => {
                              console.log('Mobil admin panel linkine tıklandı')
                              setIsOpen(false)
                            }}
                          >
                            <Shield className="w-4 h-4 mr-3" />
                            Admin Panel
                          </Link>
                        )}

                        {isConsultant && (
                          <Link
                            href="/consultant"
                            className="flex items-center w-full p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                            onClick={() => setIsOpen(false)}
                          >
                            <User className="w-4 h-4 mr-3" />
                            Danışman Paneli
                          </Link>
                        )}

                        {/* Dashboard Links - Visitor'lar için gösterilmez */}
                        {!isVisitor && !isAdmin && !isConsultant && (
                          <Link
                            href="/client"
                            className="flex items-center w-full p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                            onClick={() => setIsOpen(false)}
                          >
                            <User className="w-4 h-4 mr-3" />
                            Bana Özel
                          </Link>
                        )}

                        {/* Profil ve Ayarlar - Visitor'lar için gösterilmez */}
                        {!isVisitor && (
                          <>
                            <Link
                              href="/profile"
                              className="flex items-center w-full p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                              onClick={() => setIsOpen(false)}
                            >
                              <User className="w-4 h-4 mr-3" />
                              Profil
                            </Link>

                            {/* Seanslarım - Sadece client'lar için */}
                            {isClient && (
                              <Link
                                href="/seanslarim"
                                className="flex items-center w-full p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                                onClick={() => setIsOpen(false)}
                              >
                                <Calendar className="w-4 h-4 mr-3" />
                                Seanslarım
                              </Link>
                            )}

                            <Link
                              href="/settings"
                              className="flex items-center w-full p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                              onClick={() => setIsOpen(false)}
                            >
                              <Settings className="w-4 h-4 mr-3" />
                              Ayarlar
                            </Link>
                          </>
                        )}

                        <div className="space-y-2">
                          <LogoutButton 
                            className="w-full justify-start rounded-lg"
                            variant="ghost"
                            onLogoutStart={() => setIsOpen(false)}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          handleAuthClick('login')
                          setIsOpen(false)
                        }}
                        disabled={loading}
                      >
                        Giriş Yap
                      </Button>
                      <Button
                        className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                        onClick={() => {
                          handleAuthClick('register')
                          setIsOpen(false)
                        }}
                        disabled={loading}
                      >
                        Kayıt Ol
                      </Button>
                    </>
                  )}


                </div>

                <div className="pt-4 border-t space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>
                      {contactLoading ? (
                        <span className="inline-block w-28 h-4 bg-gray-200 rounded animate-pulse"></span>
                      ) : (
                        formatPhoneNumber(contactInfo.phone)
                      )}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>
                      {contactLoading ? (
                        <span className="inline-block w-36 h-4 bg-gray-200 rounded animate-pulse"></span>
                      ) : (
                        contactInfo.email
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />


    </header>
  )
}

export default Header
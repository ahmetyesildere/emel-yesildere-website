'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User, Session } from '@supabase/supabase-js'
import { logAuthError, logNetworkError, logInfo } from '@/lib/error-logger'

interface Profile {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string | null
  role: 'visitor' | 'client' | 'consultant' | 'admin' | 'staff'
  is_active: boolean
  email_verified: boolean
  created_at: string
  updated_at: string
  // Danışman için ek alanlar
  bio?: string
  specialties?: string[]
  certificates?: string[]
  profile_photo_url?: string
  document_urls?: string[]
  tc_no?: string
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any; data?: any }>
  signUp: (email: string, password: string, userData: { first_name: string, last_name: string }) => Promise<{ error: any; data?: any }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>
  refreshSession: () => Promise<void>
  resendConfirmation: (email: string) => Promise<{ error: any }>
  resetPassword: (email: string) => Promise<{ error: any }>
  isAdmin: boolean
  isConsultant: boolean
  isClient: boolean
  isVisitor: boolean
  isStaff: boolean
  // Yeni özellikler
  isAuthenticated: boolean
  isEmailVerified: boolean
  canAccessAdminPanel: boolean
  canAccessConsultantPanel: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastActivity, setLastActivity] = useState<number>(Date.now())



  // Database odaklı rol kontrolü - sadece profiles tablosundan
  // Geçici admin email listesi (veritabanı erişimi olmadığı için)
  const adminEmails = ['ahmetyesildere@gmail.com']
  const isAdmin = profile?.role === 'admin' || adminEmails.includes(user?.email || '')
  const isConsultant = profile?.role === 'consultant'
  const isClient = profile?.role === 'client'
  const isVisitor = profile?.role === 'visitor'
  const isStaff = profile?.role === 'staff'

  // Yeni computed properties
  const isAuthenticated = !!user && !!session
  const isEmailVerified = true // Email doğrulaması artık zorunlu değil
  const canAccessAdminPanel = isAdmin && isAuthenticated
  const canAccessConsultantPanel = (isConsultant || isAdmin) && isAuthenticated

  // Debug logları
  useEffect(() => {
    console.log('Auth state updated:')
    console.log('User:', user?.email)
    console.log('Profile:', profile)
    console.log('Is Admin:', isAdmin)
    console.log('Is Consultant:', isConsultant)
    console.log('Loading:', loading)
  }, [user, profile, isAdmin, isConsultant, loading])

  useEffect(() => {
    // Check if Supabase is properly configured
    console.log('Environment check:')
    console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing')

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
      console.warn('Supabase is not configured. Auth features will be disabled.')
      setLoading(false)
      return
    }

    // Test Supabase connection
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Testing Supabase connection...')

    // Get initial session with timeout
    const sessionTimeout = setTimeout(() => {
      console.warn('⏰ Session loading timeout, setting loading to false')
      setLoading(false)
    }, 1000) // 1 saniye timeout

    supabase.auth.getSession().then(({ data: { session } }) => {
      clearTimeout(sessionTimeout)
      console.log('📱 Initial session loaded:', !!session)
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        // Tüm kullanıcılar için profile'ı yükle
        fetchProfile(session.user.id, session.user)
      } else {
        setLoading(false)
      }
    }).catch((error) => {
      clearTimeout(sessionTimeout)
      console.error('❌ Error getting session:', error)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state change:', event, session?.user?.email)
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        // Tüm kullanıcılar için profile yükle - loading'i hemen false yapma
        console.log('👤 Profile yükleniyor...', session.user.email)
        
        // Profile'ı hemen yükle, timeout'u kaldır
        try {
          await fetchProfile(session.user.id, session.user)
        } catch (error) {
          console.error('Profile yükleme hatası:', error)
          setLoading(false)
        }
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Basit session tracking
  useEffect(() => {
    if (!session) return

    // Activity tracking - sadece temel events
    const updateActivity = () => {
      setLastActivity(Date.now())
    }

    const events = ['click', 'keypress']
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true)
    })

    // Session durumunu kontrol et ve gerekirse refresh et
    const checkSession = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Session check error:', error)
          return
        }

        if (!currentSession) {
          console.log('Session expired, clearing auth state')
          setUser(null)
          setProfile(null)
          setSession(null)
          return
        }

        // Session expire zamanını kontrol et
        const expiresAt = currentSession.expires_at
        const now = Math.floor(Date.now() / 1000)
        const timeUntilExpiry = expiresAt ? expiresAt - now : 0

        console.log('Session check:', {
          expiresAt: new Date((expiresAt || 0) * 1000).toLocaleString(),
          timeUntilExpiry: `${Math.floor(timeUntilExpiry / 60)} minutes`,
          needsRefresh: timeUntilExpiry < 300 // 5 dakikadan az kaldıysa
        })

        // 5 dakikadan az kaldıysa session'ı refresh et
        if (timeUntilExpiry < 300 && timeUntilExpiry > 0) {
          console.log('Session expiring soon, refreshing...')
          await refreshSession()
        }
      } catch (error) {
        console.error('Session check failed:', error)
      }
    }

    // İlk kontrol
    checkSession()

    // Her 2 dakikada bir session kontrol et
    const sessionCheckInterval = setInterval(checkSession, 2 * 60 * 1000)

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true)
      })
      clearInterval(sessionCheckInterval)
    }
  }, [session])

  // Inactivity timeout - 30 dakika hareketsizlik sonrası uyar
  useEffect(() => {
    if (!session) return

    const checkInactivity = () => {
      const now = Date.now()
      const inactiveTime = now - lastActivity
      const thirtyMinutes = 30 * 60 * 1000

      if (inactiveTime > thirtyMinutes) {
        console.log('User inactive for 30+ minutes, showing warning')
        // Burada bir uyarı modal'ı gösterebiliriz
        // Şimdilik sadece console'da log'layalım
      }
    }

    const inactivityInterval = setInterval(checkInactivity, 5 * 60 * 1000) // Her 5 dakikada kontrol

    return () => clearInterval(inactivityInterval)
  }, [lastActivity, session])

  const fetchProfile = async (userId: string, currentUser?: User) => {
    try {
      console.log(`🔍 Fetching profile for user ID: ${userId}`)
      const userEmail = currentUser?.email || user?.email || ''

      // Önce database'den yüklemeyi dene - FALLBACK YOK
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, email, first_name, last_name, phone, role, is_active, email_verified, created_at, updated_at')
          .eq('id', userId)
          .single()

        if (error) {
          console.log('⚠️ Database profile not found, creating fallback')
          throw error
        } else {
          console.log('✅ Profile loaded from database:', data.email, 'Role:', data.role)
          setProfile(data)
          setLoading(false)
          return
        }
      } catch (dbError) {
        console.log('⚠️ Database error, using email-based fallback')
        
        // Database'den yüklenemezse email'e göre role belirle
        const adminEmails = ['ahmetyesildere@gmail.com']
        let defaultRole: 'visitor' | 'client' | 'consultant' | 'admin' | 'staff' = 'client'
        
        if (adminEmails.includes(userEmail)) {
          defaultRole = 'admin'
        } else if (userEmail.includes('emel') || userEmail === 'emelyesildere@gmail.com') {
          defaultRole = 'consultant'
        } else if (userEmail === 'meyitin633@bizmud.com') {
          defaultRole = 'client'
        }

        const fallbackProfile: Profile = {
          id: userId,
          email: userEmail,
          first_name: '',
          last_name: '',
          phone: null,
          role: defaultRole,
          is_active: true,
          email_verified: currentUser?.email_confirmed_at ? true : false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        console.log('🔧 Using fallback profile with role:', defaultRole)
        setProfile(fallbackProfile)
      }

    } catch (error: any) {
      console.error('💥 Profile fetch exception:', error.message)
      
      // Son çare fallback
      const userEmail = currentUser?.email || user?.email || ''
      const fallbackProfile: Profile = {
        id: userId,
        email: userEmail,
        first_name: '',
        last_name: '',
        phone: null,
        role: 'client',
        is_active: true,
        email_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      console.log('🚨 Using emergency fallback profile')
      setProfile(fallbackProfile)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)

    try {
      console.log('🔐 Starting signin process for:', email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })

      if (error) {
        console.error('❌ Signin error:', error.message)

        // Error'ı logla
        logAuthError(`SignIn failed: ${error.message}`, {
          email: email.trim().toLowerCase(),
          errorCode: error.status,
          errorName: error.name
        }, user?.id)

        // Kullanıcı dostu hata mesajları
        if (error.message.includes('Invalid login credentials') ||
          error.message.includes('Invalid email or password')) {
          return { error: { ...error, message: 'Email veya şifre hatalı' } }
        } else if (error.message.includes('Too many requests')) {
          return { error: { ...error, message: 'Çok fazla deneme. Lütfen bekleyin' } }
        } else if (error.message.includes('Database error')) {
          return { error: { ...error, message: 'Sistem hatası. Lütfen tekrar deneyin' } }
        }
        // Email doğrulama hatası artık göz ardı edilecek

        return { error }
      }

      if (data.user && data.session) {
        console.log('✅ Signin successful:', data.user.id)
        // Profile otomatik yüklenecek via onAuthStateChange
        return { error: null, data }
      }

      return { error: { message: 'Giriş başarısız. Lütfen tekrar deneyin.' } }
    } catch (error: any) {
      console.error('💥 Signin exception:', error)
      return { error: { message: 'Beklenmeyen bir hata oluştu' } }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, userData: { first_name: string, last_name: string, phone?: string }) => {
    setLoading(true)

    try {
      console.log('🚀 Starting signup process for:', email)

      // Email'i temizle ve normalize et
      const cleanEmail = email.trim().toLowerCase()

      // Input validation
      if (!cleanEmail || !password || !userData.first_name || !userData.last_name) {
        return { error: { message: 'Tüm alanlar zorunludur' } }
      }

      if (password.length < 6) {
        return { error: { message: 'Şifre en az 6 karakter olmalı' } }
      }

      // Email format kontrolü
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(cleanEmail)) {
        return { error: { message: 'Geçerli bir email adresi girin' } }
      }

      // Tüm yeni kullanıcılar client olarak başlar (spec'e uygun)
      const role: 'visitor' | 'client' | 'consultant' | 'admin' | 'staff' = 'client'

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            first_name: userData.first_name.trim(),
            last_name: userData.last_name.trim(),
            phone: userData.phone || '',
            role: role
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      console.log('📧 Supabase signup response:', {
        user: data.user?.id,
        session: !!data.session,
        error: error?.message
      })

      if (error) {
        console.error('❌ Auth signup error:', error.message)

        // Error'ı logla
        logAuthError(`SignUp failed: ${error.message}`, {
          email: cleanEmail,
          firstName: userData.first_name,
          lastName: userData.last_name,
          errorCode: error.status,
          errorName: error.name
        })

        // Kullanıcı dostu hata mesajları
        if (error.message.includes('User already registered') || error.message.includes('already registered')) {
          return { error: { ...error, message: 'Bu email adresi zaten kayıtlı. Giriş yapmayı deneyin.' } }
        } else if (error.message.includes('Invalid email')) {
          return { error: { ...error, message: 'Geçersiz email adresi' } }
        } else if (error.message.includes('Password') || error.message.includes('password')) {
          return { error: { ...error, message: 'Şifre gereksinimlerini karşılamıyor (en az 6 karakter)' } }
        } else if (error.message.includes('Database error')) {
          return { error: { ...error, message: 'Veritabanı hatası. Lütfen tekrar deneyin.' } }
        } else if (error.message.includes('Network')) {
          return { error: { ...error, message: 'Bağlantı sorunu. İnternet bağlantınızı kontrol edin.' } }
        }

        return { error }
      }

      if (data.user) {
        console.log('✅ User created successfully:', data.user.id)

        // Email confirmation gerekiyorsa kullanıcıyı bilgilendir
        if (!data.session) {
          console.log('📧 Email confirmation required')
          return {
            error: null,
            data: {
              ...data,
              needsEmailConfirmation: true,
              message: 'Kayıt başarılı! Email adresinizi kontrol edin ve doğrulama linkine tıklayın.'
            }
          }
        }

        // Trigger otomatik profil oluşturacak, manuel oluşturmaya gerek yok
        return { error: null, data }
      }

      return { error: { message: 'Kayıt işlemi tamamlanamadı. Lütfen tekrar deneyin.' } }
    } catch (error: any) {
      console.error('💥 Signup exception:', error)

      // Network hatalarını yakala
      if (error.name === 'NetworkError' || error.message.includes('fetch')) {
        return { error: { message: 'Bağlantı sorunu. İnternet bağlantınızı kontrol edin.' } }
      }

      return { error: { message: 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.' } }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    console.log('🚪 Auth context çıkış yapılıyor...')

    try {
      // Önce UI state'ini temizle
      setUser(null)
      setProfile(null)
      setSession(null)
      setLoading(false)

      // Storage'ı temizle
      if (typeof window !== 'undefined') {
        try {
          localStorage.clear()
          sessionStorage.clear()
        } catch (e) {
          console.warn('Storage temizleme hatası:', e)
        }
      }

      // Supabase'den çıkış yap
      const { error } = await supabase.auth.signOut({ scope: 'global' })
      
      if (error) {
        console.error('❌ Supabase çıkış hatası:', error)
        // Hata olsa bile devam et
      }

      console.log('✅ Auth context çıkış tamamlandı')

      // Ana sayfaya yönlendir
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }

    } catch (error) {
      console.error('❌ Auth context çıkış hatası:', error)
      
      // Hata durumunda da state'i temizle
      setUser(null)
      setProfile(null)
      setSession(null)
      setLoading(false)
      
      // Storage'ı temizle
      if (typeof window !== 'undefined') {
        try {
          localStorage.clear()
          sessionStorage.clear()
        } catch (e) {
          console.warn('Storage temizleme hatası:', e)
        }
      }

      // Hata durumunda da ana sayfaya yönlendir
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)

    if (!error) {
      setProfile(prev => prev ? { ...prev, ...updates } : null)
    }

    return { error }
  }

  const refreshSession = async () => {
    try {
      console.log('🔄 Refreshing session...')
      setLoading(true)

      const { data, error } = await supabase.auth.refreshSession()

      if (error) {
        console.error('❌ Session refresh failed:', error)
        // Session refresh başarısız olursa kullanıcıyı çıkış yaptır
        await signOut()
        return
      }

      if (data.session) {
        console.log('✅ Session refreshed successfully')
        setSession(data.session)
        setUser(data.session.user)
        setLastActivity(Date.now())

        // Profile'ı da yeniden yükle
        if (data.session.user) {
          await fetchProfile(data.session.user.id, data.session.user)
        } else {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    } catch (error) {
      console.error('💥 Session refresh error:', error)
      setLoading(false)
      await signOut()
    }
  }

  const resendConfirmation = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        console.error('❌ Resend confirmation error:', error.message)
        return { error: { message: 'Email gönderimi başarısız' } }
      }

      console.log('✅ Confirmation email resent')
      return { error: null }
    } catch (error: any) {
      console.error('💥 Resend confirmation exception:', error)
      return { error: { message: 'Email gönderimi sırasında hata oluştu' } }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo: `${window.location.origin}/auth/reset-password`
        }
      )

      if (error) {
        console.error('❌ Reset password error:', error.message)
        return { error: { message: 'Şifre sıfırlama emaili gönderilemedi' } }
      }

      console.log('✅ Password reset email sent')
      return { error: null }
    } catch (error: any) {
      console.error('💥 Reset password exception:', error)
      return { error: { message: 'Şifre sıfırlama sırasında hata oluştu' } }
    }
  }

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshSession,
    resendConfirmation,
    resetPassword,
    isAdmin,
    isConsultant,
    isClient,
    isVisitor,
    isStaff,
    isAuthenticated,
    isEmailVerified,
    canAccessAdminPanel,
    canAccessConsultantPanel
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
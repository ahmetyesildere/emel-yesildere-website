import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'

export interface SignUpData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

export interface SignInData {
  email: string
  password: string
}

/**
 * Kullanıcı kaydı oluştur
 */
export async function signUp(data: SignUpData) {
  try {
    // Input validation
    if (!data.email || !data.password || !data.firstName || !data.lastName) {
      return { data: null, error: 'Tüm alanlar zorunludur' }
    }

    if (!isValidEmail(data.email)) {
      return { data: null, error: 'Geçerli bir email adresi girin' }
    }

    if (data.password.length < 6) {
      return { data: null, error: 'Şifre en az 6 karakter olmalı' }
    }

    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email.trim().toLowerCase(),
      password: data.password,
      options: {
        data: {
          first_name: data.firstName.trim(),
          last_name: data.lastName.trim(),
          phone: data.phone || null,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) {
      // Kullanıcı dostu hata mesajları
      if (error.message.includes('User already registered') || error.message.includes('already registered')) {
        return { data: null, error: 'Bu email adresi zaten kayıtlı. Giriş yapmayı deneyin.' }
      } else if (error.message.includes('Invalid email')) {
        return { data: null, error: 'Geçersiz email adresi' }
      } else if (error.message.includes('Password') || error.message.includes('password')) {
        return { data: null, error: 'Şifre gereksinimlerini karşılamıyor (en az 6 karakter)' }
      } else if (error.message.includes('Database error')) {
        return { data: null, error: 'Veritabanı hatası. Lütfen tekrar deneyin.' }
      }
      throw error
    }

    return { data: authData, error: null }
  } catch (error: any) {
    console.error('SignUp error:', error)

    // Network hatalarını yakala
    if (error.name === 'NetworkError' || error.message.includes('fetch')) {
      return { data: null, error: 'Bağlantı sorunu. İnternet bağlantınızı kontrol edin.' }
    }

    return { data: null, error: error.message || 'Kayıt sırasında bir hata oluştu' }
  }
}

/**
 * Kullanıcı girişi
 */
export async function signIn(data: SignInData) {
  try {
    console.log('🔐 Attempting sign in for:', data.email)

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email.trim().toLowerCase(),
      password: data.password,
    })

    if (error) {
      console.error('🚨 SignIn error:', error)

      // Email doğrulama hatasını bypass et
      if (error.message.includes('Email not confirmed')) {
        console.log('⚠️ Email not confirmed - this should be bypassed')
        return {
          data: null,
          error: 'Email doğrulama gerekli. Lütfen Supabase Dashboard\'dan email confirmation\'ı kapatın.'
        }
      }

      // 500 server error
      if (error.status === 500 || error.message.includes('500')) {
        console.error('💥 Server error 500')
        return {
          data: null,
          error: 'Sunucu hatası (500). Lütfen birkaç dakika bekleyip tekrar deneyin.'
        }
      }

      // Diğer kullanıcı dostu hata mesajları
      if (error.message.includes('Invalid login credentials') ||
        error.message.includes('Invalid email or password')) {
        return { data: null, error: 'Email veya şifre hatalı' }
      } else if (error.message.includes('Too many requests')) {
        return { data: null, error: 'Çok fazla deneme. Lütfen bekleyin' }
      }

      // Genel hata
      return { data: null, error: `Giriş hatası: ${error.message}` }
    }

    console.log('✅ SignIn successful for:', authData.user?.email)
    return { data: authData, error: null }

  } catch (error: any) {
    console.error('💥 SignIn exception:', error)
    return { data: null, error: 'Beklenmeyen hata. Lütfen tekrar deneyin.' }
  }
}

/**
 * Kullanıcı çıkışı
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw error
    }
    return { error: null }
  } catch (error: any) {
    console.error('SignOut error:', error)
    return { error: error.message || 'Çıkış sırasında bir hata oluştu' }
  }
}

/**
 * Email doğrulama linkini yeniden gönder
 */
export async function resendConfirmation(email: string) {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) {
      throw error
    }

    return { error: null }
  } catch (error: any) {
    console.error('Resend confirmation error:', error)
    return { error: error.message || 'Email gönderimi sırasında bir hata oluştu' }
  }
}

/**
 * Şifre sıfırlama linki gönder
 */
export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })

    if (error) {
      throw error
    }

    return { error: null }
  } catch (error: any) {
    console.error('Reset password error:', error)
    return { error: error.message || 'Şifre sıfırlama sırasında bir hata oluştu' }
  }
}

/**
 * Mevcut kullanıcı oturumunu al
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      console.error('Get current user error:', error)
      return null
    }

    return user
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

/**
 * Kullanıcı profilini al
 */
export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      throw error
    }

    return { data, error: null }
  } catch (error: any) {
    console.error('Get user profile error:', error)
    return { data: null, error: error.message || 'Profil bilgileri alınamadı' }
  }
}

/**
 * Auth state değişikliklerini dinle
 */
export function onAuthStateChange(callback: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null)
  })
}

/**
 * Email format kontrolü
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Şifre güçlülük kontrolü
 */
export function isStrongPassword(password: string): { isValid: boolean; message: string } {
  if (password.length < 6) {
    return { isValid: false, message: 'Şifre en az 6 karakter olmalı' }
  }

  if (password.length < 8) {
    return { isValid: true, message: 'Şifre kabul edilebilir' }
  }

  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length

  if (strength >= 3) {
    return { isValid: true, message: 'Güçlü şifre' }
  } else if (strength >= 2) {
    return { isValid: true, message: 'Orta güçlükte şifre' }
  } else {
    return { isValid: true, message: 'Zayıf şifre' }
  }
}
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { isStrongPassword } from '@/lib/auth-helpers'
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordValidation, setPasswordValidation] = useState({ isValid: false, message: '' })

  useEffect(() => {
    // URL'den hash parametrelerini kontrol et
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const accessToken = hashParams.get('access_token')
    const type = hashParams.get('type')

    if (type !== 'recovery' || !accessToken) {
      setError('Geçersiz şifre sıfırlama linki')
      setTimeout(() => {
        router.push('/kayit')
      }, 3000)
    }
  }, [router])

  useEffect(() => {
    if (password) {
      const validation = isStrongPassword(password)
      setPasswordValidation(validation)
    }
  }, [password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!password || !confirmPassword) {
      setError('Lütfen tüm alanları doldurun')
      return
    }

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor')
      return
    }

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalı')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        throw error
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/kayit')
      }, 3000)
    } catch (err: any) {
      console.error('Password reset error:', err)
      setError('Şifre güncellenirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="rounded-full h-12 w-12 bg-green-100 mx-auto flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-green-900">
              Şifre Güncellendi!
            </h2>
            <p className="mt-2 text-sm text-green-600">
              Şifreniz başarıyla güncellendi. Giriş sayfasına yönlendiriliyorsunuz...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Yeni Şifre Belirle</h2>
              <p className="text-gray-600">Hesabınız için yeni bir şifre oluşturun</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 mb-4">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-800 text-sm">{error}</span>
              </div>
            )}

            {/* Reset Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yeni Şifre *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="En az 6 karakter"
                    className={`pl-10 pr-10 h-12 border-2 focus:border-purple-400 ${
                      password && passwordValidation.isValid ? 'border-green-300' : ''
                    }`}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {password && (
                  <div className="mt-1">
                    <div className="flex items-center space-x-2">
                      <div className={`h-1 flex-1 rounded ${
                        passwordValidation.message === 'Güçlü şifre' ? 'bg-green-500' :
                        passwordValidation.message === 'Orta güçlükte şifre' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}></div>
                    </div>
                    <p className={`text-sm mt-1 ${
                      passwordValidation.message === 'Güçlü şifre' ? 'text-green-600' :
                      passwordValidation.message === 'Orta güçlükte şifre' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {passwordValidation.message}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şifre Tekrar *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Şifrenizi tekrar girin"
                    className={`pl-10 pr-10 h-12 border-2 focus:border-purple-400 ${
                      confirmPassword && confirmPassword === password ? 'border-green-300' : ''
                    }`}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {confirmPassword && (
                  <p className={`text-sm mt-1 ${
                    confirmPassword === password ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {confirmPassword === password ? 'Şifreler eşleşiyor' : 'Şifreler eşleşmiyor'}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading || !password || !confirmPassword || password !== confirmPassword}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Güncelleniyor...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Şifreyi Güncelle
                  </>
                )}
              </Button>
            </form>

            {/* Back to Login */}
            <div className="text-center pt-4 border-t border-gray-200 mt-6">
              <button
                onClick={() => router.push('/kayit')}
                className="text-gray-600 hover:text-gray-800 text-sm"
              >
                ← Giriş sayfasına dön
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
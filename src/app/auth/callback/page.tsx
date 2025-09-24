'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ErrorBoundary } from '@/components/error/error-boundary'
import { ToastProvider } from '@/components/ui/toast-provider'
import { logAuthError } from '@/lib/error-logger'

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // URL'den hash parametrelerini al
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const type = hashParams.get('type')

        if (type === 'signup' || type === 'email_confirmation') {
          // Email doğrulama işlemi
          const { data, error } = await supabase.auth.getSession()
          
          if (error) {
            console.error('Auth callback error:', error)
            setStatus('error')
            setMessage('Email doğrulama sırasında bir hata oluştu.')
            return
          }

          if (data.session) {
            // Kullanıcı başarıyla doğrulandı
            setStatus('success')
            setMessage('Email adresiniz başarıyla doğrulandı! Yönlendiriliyorsunuz...')
            
            // 2 saniye sonra ana sayfaya yönlendir
            setTimeout(() => {
              router.push('/')
            }, 2000)
          } else {
            setStatus('error')
            setMessage('Doğrulama linki geçersiz veya süresi dolmuş.')
          }
        } else {
          // Diğer auth işlemleri için
          setStatus('success')
          setMessage('İşlem başarılı! Yönlendiriliyorsunuz...')
          setTimeout(() => {
            router.push('/')
          }, 2000)
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        setStatus('error')
        setMessage('Bir hata oluştu. Lütfen tekrar deneyin.')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <ToastProvider>
      <ErrorBoundary>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              {status === 'loading' && (
                <>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                    İşleminiz kontrol ediliyor...
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    Lütfen bekleyin, email doğrulamanız işleniyor.
                  </p>
                </>
              )}
              
              {status === 'success' && (
                <>
                  <div className="rounded-full h-12 w-12 bg-green-100 mx-auto flex items-center justify-center">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h2 className="mt-6 text-3xl font-extrabold text-green-900">
                    Başarılı!
                  </h2>
                  <p className="mt-2 text-sm text-green-600">
                    {message}
                  </p>
                </>
              )}
              
              {status === 'error' && (
                <>
                  <div className="rounded-full h-12 w-12 bg-red-100 mx-auto flex items-center justify-center">
                    <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </div>
                  <h2 className="mt-6 text-3xl font-extrabold text-red-900">
                    Hata Oluştu
                  </h2>
                  <p className="mt-2 text-sm text-red-600">
                    {message}
                  </p>
                  <div className="mt-4">
                    <button
                      onClick={() => router.push('/')}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Ana Sayfaya Dön
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </ErrorBoundary>
    </ToastProvider>
  )
}
import { Metadata } from 'next'
import SimpleLoginForm from '@/components/auth/simple-login-form'

export const metadata: Metadata = {
  title: 'Giriş Yap - Emel Yeşildere',
  description: 'Emel Yeşildere platformuna giriş yapın ve hesabınıza erişin.',
}

import BasicLogin from '@/components/auth/basic-login'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center py-12 px-4">
      <BasicLogin />
    </div>
  )
}
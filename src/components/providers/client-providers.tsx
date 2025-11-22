'use client'

import { AuthProvider } from '@/lib/auth/auth-context'
import { ToastProvider } from '@/components/ui/toast-provider'

interface ClientProvidersProps {
  children: React.ReactNode
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <AuthProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </AuthProvider>
  )
}
import { useToast } from '@/components/ui/toast-provider'

// Safe toast hook that provides fallback if ToastProvider is not available
export function useSafeToast() {
  try {
    return useToast()
  } catch (error) {
    // Fallback implementation when ToastProvider is not available
    return {
      success: (title: string, description?: string) => {
        console.log('✅ Success:', title, description)
        // You could also show a browser alert or custom notification here
      },
      error: (title: string, description?: string) => {
        console.error('❌ Error:', title, description)
        // You could also show a browser alert here
      },
      warning: (title: string, description?: string) => {
        console.warn('⚠️ Warning:', title, description)
      },
      info: (title: string, description?: string) => {
        console.info('ℹ️ Info:', title, description)
      },
      addToast: () => '',
      removeToast: () => {},
      clearToasts: () => {},
      toasts: []
    }
  }
}
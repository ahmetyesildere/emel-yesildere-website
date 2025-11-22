import { useState, useCallback, useRef } from 'react'
import { logNetworkError, logWarning } from '@/lib/error-logger'

export interface RetryOptions {
  maxAttempts?: number
  delay?: number
  backoff?: 'linear' | 'exponential'
  onRetry?: (attempt: number, error: any) => void
  onMaxAttemptsReached?: (error: any) => void
  shouldRetry?: (error: any) => boolean
}

export interface RetryState {
  isRetrying: boolean
  attempt: number
  lastError: any
  canRetry: boolean
}

export function useRetry<T>(
  asyncFunction: () => Promise<T>,
  options: RetryOptions = {}
) {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoff = 'exponential',
    onRetry,
    onMaxAttemptsReached,
    shouldRetry = (error) => {
      // Network hatalarında retry yap
      return error.name === 'NetworkError' || 
             error.message?.includes('fetch') ||
             error.message?.includes('network') ||
             error.code === 'NETWORK_ERROR'
    }
  } = options

  const [state, setState] = useState<RetryState>({
    isRetrying: false,
    attempt: 0,
    lastError: null,
    canRetry: true
  })

  const abortControllerRef = useRef<AbortController | null>(null)

  const calculateDelay = useCallback((attempt: number): number => {
    if (backoff === 'exponential') {
      return delay * Math.pow(2, attempt - 1)
    }
    return delay * attempt
  }, [delay, backoff])

  const execute = useCallback(async (): Promise<T> => {
    // Önceki işlemi iptal et
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()
    
    setState(prev => ({
      ...prev,
      isRetrying: true,
      attempt: 0,
      lastError: null,
      canRetry: true
    }))

    let lastError: any = null

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        setState(prev => ({ ...prev, attempt }))

        // İlk denemede delay yok
        if (attempt > 1) {
          const retryDelay = calculateDelay(attempt - 1)
          
          logWarning('network', `Retrying operation (attempt ${attempt}/${maxAttempts})`, {
            delay: retryDelay,
            previousError: lastError?.message
          })

          await new Promise(resolve => setTimeout(resolve, retryDelay))
          
          // Abort edilmişse dur
          if (abortControllerRef.current?.signal.aborted) {
            throw new Error('Operation aborted')
          }
        }

        // Fonksiyonu çalıştır
        const result = await asyncFunction()
        
        // Başarılı
        setState(prev => ({
          ...prev,
          isRetrying: false,
          lastError: null
        }))

        return result

      } catch (error: any) {
        lastError = error
        
        // Abort edilmişse dur
        if (error.message === 'Operation aborted') {
          setState(prev => ({
            ...prev,
            isRetrying: false,
            canRetry: false
          }))
          throw error
        }

        // Retry yapılabilir mi kontrol et
        if (!shouldRetry(error)) {
          logNetworkError(`Non-retryable error: ${error.message}`, {
            attempt,
            error: error.name
          })
          break
        }

        // Son deneme mi?
        if (attempt === maxAttempts) {
          logNetworkError(`Max retry attempts reached: ${error.message}`, {
            maxAttempts,
            finalError: error.name
          })
          break
        }

        // Retry callback
        if (onRetry) {
          onRetry(attempt, error)
        }
      }
    }

    // Tüm denemeler başarısız
    setState(prev => ({
      ...prev,
      isRetrying: false,
      lastError,
      canRetry: false
    }))

    if (onMaxAttemptsReached) {
      onMaxAttemptsReached(lastError)
    }

    throw lastError
  }, [asyncFunction, maxAttempts, calculateDelay, shouldRetry, onRetry, onMaxAttemptsReached])

  const retry = useCallback(async (): Promise<T> => {
    if (!state.canRetry) {
      throw new Error('Cannot retry: max attempts reached or operation aborted')
    }
    return execute()
  }, [execute, state.canRetry])

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    setState(prev => ({
      ...prev,
      isRetrying: false,
      canRetry: false
    }))
  }, [])

  const reset = useCallback(() => {
    setState({
      isRetrying: false,
      attempt: 0,
      lastError: null,
      canRetry: true
    })
  }, [])

  return {
    execute,
    retry,
    abort,
    reset,
    state
  }
}

// Network işlemleri için özel hook
export function useNetworkRetry<T>(
  asyncFunction: () => Promise<T>,
  options: Omit<RetryOptions, 'shouldRetry'> = {}
) {
  return useRetry(asyncFunction, {
    ...options,
    shouldRetry: (error) => {
      // Network hatalarında retry yap
      const isNetworkError = 
        error.name === 'NetworkError' ||
        error.name === 'TypeError' ||
        error.message?.includes('fetch') ||
        error.message?.includes('network') ||
        error.message?.includes('Failed to fetch') ||
        error.code === 'NETWORK_ERROR' ||
        (error.status >= 500 && error.status < 600) // Server errors

      return isNetworkError
    }
  })
}

// Auth işlemleri için özel hook
export function useAuthRetry<T>(
  asyncFunction: () => Promise<T>,
  options: Omit<RetryOptions, 'shouldRetry' | 'maxAttempts'> = {}
) {
  return useRetry(asyncFunction, {
    maxAttempts: 2, // Auth için daha az deneme
    ...options,
    shouldRetry: (error) => {
      // Sadece network hatalarında retry yap, auth hatalarında değil
      const isRetryableError = 
        error.name === 'NetworkError' ||
        error.message?.includes('fetch') ||
        error.message?.includes('network') ||
        (error.status >= 500 && error.status < 600)

      // Auth spesifik hataları retry yapma
      const isAuthError = 
        error.message?.includes('Invalid login credentials') ||
        error.message?.includes('User already registered') ||
        error.message?.includes('Email not confirmed') ||
        error.message?.includes('Invalid email')

      return isRetryableError && !isAuthError
    }
  })
}
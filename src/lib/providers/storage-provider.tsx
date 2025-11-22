'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface StorageContextType {
  isClient: boolean
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
}

const StorageContext = createContext<StorageContextType | undefined>(undefined)

export const useStorage = () => {
  const context = useContext(StorageContext)
  if (!context) {
    throw new Error('useStorage must be used within a StorageProvider')
  }
  return context
}

export const StorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const getItem = (key: string): string | null => {
    if (!isClient || typeof window === 'undefined') return null
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.error('localStorage getItem error:', error)
      return null
    }
  }

  const setItem = (key: string, value: string): void => {
    if (!isClient || typeof window === 'undefined') return
    try {
      localStorage.setItem(key, value)
    } catch (error) {
      console.error('localStorage setItem error:', error)
    }
  }

  const removeItem = (key: string): void => {
    if (!isClient || typeof window === 'undefined') return
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('localStorage removeItem error:', error)
    }
  }

  const value: StorageContextType = {
    isClient,
    getItem,
    setItem,
    removeItem
  }

  return (
    <StorageContext.Provider value={value}>
      {children}
    </StorageContext.Provider>
  )
}
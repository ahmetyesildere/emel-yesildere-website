'use client'

import { useState, useEffect, useCallback } from 'react'
import { setCookie, getCookie } from '@/lib/cookies'

export interface ContactInfo {
  phone: string
  email: string
  whatsapp: string
  address: string
  mapUrl: string
  workingHours: {
    weekdays: string
    saturday: string
    sunday: string
  }
}

const defaultContactInfo: ContactInfo = {
  phone: '+90 555 123 4567',
  email: 'emel@emelyesildere.com',
  whatsapp: '+90 555 123 4567',
  address: 'Günaydın mah. Terziler cad. No:74 Kat 3 Daire 5 Bandırma-Balıkesir',
  mapUrl: 'https://maps.google.com/maps?q=Günaydın+Mahallesi+Terziler+Caddesi+No:74+Bandırma+Balıkesir&t=&z=16&ie=UTF8&iwloc=&output=embed',
  workingHours: {
    weekdays: '09:00 - 18:00',
    saturday: '10:00 - 16:00',
    sunday: 'Kapalı'
  }
}

const COOKIE_KEY = 'contact_info'

export const useContactInfoCookies = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo)
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  // Client-side kontrolü
  useEffect(() => {
    setIsClient(true)
  }, [])

  // İletişim bilgilerini yükle
  useEffect(() => {
    if (!isClient) return

    const loadContactInfo = () => {
      try {
        const savedData = getCookie(COOKIE_KEY)
        console.log('🍪 Cookie\'den yüklenen:', savedData)
        
        if (savedData && savedData !== 'undefined' && savedData !== 'null') {
          const parsed = JSON.parse(savedData)
          console.log('📋 Parse edilen veri:', parsed)
          
          const mergedData = { ...defaultContactInfo, ...parsed }
          console.log('✅ Yüklenen iletişim bilgileri:', mergedData)
          setContactInfo(mergedData)
        } else {
          console.log('⚠️ Cookie\'de veri yok, default değerler kullanılıyor')
          // Default değerleri kaydet
          setCookie(COOKIE_KEY, JSON.stringify(defaultContactInfo))
        }
      } catch (error) {
        console.error('❌ İletişim bilgileri yüklenirken hata:', error)
        // Hata durumunda default değerleri kaydet
        setCookie(COOKIE_KEY, JSON.stringify(defaultContactInfo))
        setContactInfo(defaultContactInfo)
      } finally {
        setIsLoading(false)
      }
    }

    loadContactInfo()

    // Custom event listener
    const handleContactInfoUpdate = (event: CustomEvent) => {
      console.log('🔄 Custom event ile güncelleme:', event.detail)
      setContactInfo(event.detail)
    }

    window.addEventListener('contactInfoUpdated', handleContactInfoUpdate as EventListener)

    return () => {
      window.removeEventListener('contactInfoUpdated', handleContactInfoUpdate as EventListener)
    }
  }, [isClient])

  // İletişim bilgilerini kaydet
  const updateContactInfo = useCallback((newContactInfo: Partial<ContactInfo>) => {
    if (!isClient || typeof window === 'undefined') {
      console.warn('⚠️ updateContactInfo: Client-side değil, işlem iptal edildi')
      return false
    }

    console.log('💾 updateContactInfo çağrıldı:', newContactInfo)
    
    try {
      // Mevcut bilgilerle birleştir
      const updatedInfo = { ...contactInfo, ...newContactInfo }
      
      // State'i güncelle
      setContactInfo(updatedInfo)
      
      // Cookie'ye kaydet
      setCookie(COOKIE_KEY, JSON.stringify(updatedInfo))
      console.log('✅ Cookie güncellendi:', updatedInfo)
      
      // Custom event dispatch et
      window.dispatchEvent(new CustomEvent('contactInfoUpdated', { 
        detail: updatedInfo 
      }))
      
      return true
    } catch (error) {
      console.error('❌ İletişim bilgileri kaydedilirken hata:', error)
      return false
    }
  }, [contactInfo, isClient])

  // Telefon numarasını formatla
  const formatPhoneNumber = useCallback((phone: string) => {
    const cleaned = phone.replace(/\D/g, '')
    
    // Türkiye formatı: +90 (555) 123 45 67
    if (cleaned.startsWith('90') && cleaned.length === 12) {
      return `+90 (${cleaned.slice(2, 5)}) ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10, 12)}`
    }
    
    // Yerel format: 0555 123 45 67
    if (cleaned.startsWith('0') && cleaned.length === 11) {
      return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 9)} ${cleaned.slice(9, 11)}`
    }
    
    return phone
  }, [])

  return {
    contactInfo,
    updateContactInfo,
    formatPhoneNumber,
    isLoading
  }
}
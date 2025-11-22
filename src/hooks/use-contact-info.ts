'use client'

import { useState, useEffect, useCallback } from 'react'
import { setCookie, getCookie } from '@/lib/cookies'
import { supabase } from '@/lib/supabase'

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
  phone: '+90 266 714 1234',
  email: 'info@emelyesildere.com',
  whatsapp: '+90 532 123 4567',
  address: 'Günaydın mah. Terziler cad. No:74 Kat 3 Daire 5 Bandırma-Balıkesir',
  mapUrl: 'https://maps.google.com/maps?q=Günaydın+Mahallesi+Terziler+Caddesi+No:74+Bandırma+Balıkesir&t=&z=16&ie=UTF8&iwloc=&output=embed',
  workingHours: {
    weekdays: '09:00 - 18:00',
    saturday: '10:00 - 16:00',
    sunday: 'Kapalı'
  }
}

const STORAGE_KEY = 'contact_info'
const COOKIE_KEY = 'contact_info_cookie'

export const useContactInfo = () => {
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

    const loadContactInfo = async () => {
      try {
        if (typeof window === 'undefined') return

        console.log('🔍 İletişim bilgileri yükleniyor...')

        // Önce localStorage'dan dene (daha hızlı ve hatasız)
        let savedData = localStorage.getItem(STORAGE_KEY)
        let source = 'localStorage'
        
        // localStorage başarısız olursa cookie'den dene
        if (!savedData || savedData === 'undefined' || savedData === 'null') {
          savedData = getCookie(COOKIE_KEY)
          source = 'cookie'
        }
        
        // localStorage veya cookie'de veri varsa kullan
        if (savedData && savedData !== 'undefined' && savedData !== 'null') {
          const parsed = JSON.parse(savedData)
          console.log(`📋 ${source}\'dan parse edilen veri:`, parsed)
          
          // Sadece geçerli alanları merge et
          const mergedData: ContactInfo = {
            phone: parsed.phone || defaultContactInfo.phone,
            email: parsed.email || defaultContactInfo.email,
            whatsapp: parsed.whatsapp || defaultContactInfo.whatsapp,
            address: parsed.address || defaultContactInfo.address,
            mapUrl: parsed.mapUrl || defaultContactInfo.mapUrl,
            workingHours: {
              weekdays: parsed.workingHours?.weekdays || defaultContactInfo.workingHours.weekdays,
              saturday: parsed.workingHours?.saturday || defaultContactInfo.workingHours.saturday,
              sunday: parsed.workingHours?.sunday || defaultContactInfo.workingHours.sunday
            }
          }
          
          setContactInfo(mergedData)
          console.log('✅ Yerel cache\'den iletişim bilgileri yüklendi:', mergedData)
        } else {
          console.log('⚠️ Hiçbir yerde veri yok, default değerler kullanılıyor')
          setContactInfo(defaultContactInfo)
          
          // Default değerleri Supabase'e kaydet (sessizce)
          try {
            const { error: insertError } = await supabase
              .from('site_settings')
              .upsert({
                setting_key: 'contact_info',
                setting_value: defaultContactInfo
              })

            if (!insertError) {
              console.log('✅ Default değerler Supabase\'e kaydedildi')
            }
          } catch (insertError) {
            // Supabase hatalarını sessizce handle et
            console.log('⚠️ Supabase\'e yazılamadı, yerel cache kullanılacak')
          }

          // Yerel cache'e de kaydet
          const defaultData = JSON.stringify(defaultContactInfo)
          try {
            localStorage.setItem(STORAGE_KEY, defaultData)
          } catch (e) {
            console.warn('localStorage yazma hatası:', e)
          }
          setCookie(COOKIE_KEY, defaultData, 365)
        }
      } catch (error) {
        console.error('❌ İletişim bilgileri yüklenirken hata:', error)
        // Hata durumunda default değerleri kullan
        setContactInfo(defaultContactInfo)
        const defaultData = JSON.stringify(defaultContactInfo)
        try {
          localStorage.removeItem(STORAGE_KEY)
          localStorage.setItem(STORAGE_KEY, defaultData)
        } catch (e) {
          console.warn('localStorage temizleme hatası:', e)
        }
        setCookie(COOKIE_KEY, defaultData, 365)
      } finally {
        setIsLoading(false)
      }
    }

    loadContactInfo()

    // Storage event listener (farklı tab'lar arası senkronizasyon)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue)
          
          // Sadece geçerli alanları merge et
          const mergedData: ContactInfo = {
            phone: parsed.phone || defaultContactInfo.phone,
            email: parsed.email || defaultContactInfo.email,
            whatsapp: parsed.whatsapp || defaultContactInfo.whatsapp,
            address: parsed.address || defaultContactInfo.address,
            mapUrl: parsed.mapUrl || defaultContactInfo.mapUrl,
            workingHours: {
              weekdays: parsed.workingHours?.weekdays || defaultContactInfo.workingHours.weekdays,
              saturday: parsed.workingHours?.saturday || defaultContactInfo.workingHours.saturday,
              sunday: parsed.workingHours?.sunday || defaultContactInfo.workingHours.sunday
            }
          }
          
          console.log('🔄 Storage event ile güncelleme:', mergedData)
          setContactInfo(mergedData)
        } catch (error) {
          console.error('❌ Storage event parse hatası:', error)
        }
      }
    }

    // Custom event listener
    const handleContactInfoUpdate = (event: CustomEvent) => {
      console.log('🔄 Custom event ile güncelleme:', event.detail)
      setContactInfo(event.detail)
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('contactInfoUpdated', handleContactInfoUpdate as EventListener)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('contactInfoUpdated', handleContactInfoUpdate as EventListener)
    }
  }, [isClient])

  // İletişim bilgilerini kaydet
  const updateContactInfo = useCallback(async (newContactInfo: Partial<ContactInfo>) => {
    if (!isClient || typeof window === 'undefined') {
      console.warn('⚠️ updateContactInfo: Client-side değil, işlem iptal edildi')
      return false
    }

    console.log('💾 updateContactInfo çağrıldı:', newContactInfo)
    
    try {
      // Mevcut bilgilerle birleştir - deep merge için workingHours'u özel olarak ele al
      const updatedInfo: ContactInfo = {
        ...contactInfo,
        ...newContactInfo,
        workingHours: {
          ...contactInfo.workingHours,
          ...(newContactInfo.workingHours || {})
        }
      }
      
      console.log('🔄 Güncellenecek bilgiler:', updatedInfo)
      
      // Önce Supabase'e kaydet (sessizce)
      try {
        const { error: supabaseError } = await supabase
          .from('site_settings')
          .upsert({
            setting_key: 'contact_info',
            setting_value: updatedInfo
          })

        if (!supabaseError) {
          console.log('✅ Supabase güncellendi:', updatedInfo)
        }
      } catch (supabaseError) {
        // Supabase hatalarını sessizce handle et, yerel cache yeterli
        console.log('⚠️ Supabase güncellenemedi, yerel cache kullanılacak')
      }
      
      // State'i güncelle
      setContactInfo(updatedInfo)
      
      // Yerel cache'i de güncelle
      const dataToSave = JSON.stringify(updatedInfo)
      
      try {
        localStorage.setItem(STORAGE_KEY, dataToSave)
        console.log('✅ localStorage güncellendi')
      } catch (e) {
        console.warn('⚠️ localStorage yazma hatası:', e)
      }
      
      setCookie(COOKIE_KEY, dataToSave, 365)
      console.log('✅ Cookie güncellendi')
      
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
'use client'

import { useState, useEffect } from 'react'

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

export const useContactInfo = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo)
  const [isLoading, setIsLoading] = useState(true)

  // İletişim bilgilerini yükle
  useEffect(() => {
    try {
      const savedContactInfo = localStorage.getItem('contact_info')
      if (savedContactInfo) {
        const parsed = JSON.parse(savedContactInfo)
        setContactInfo({ ...defaultContactInfo, ...parsed })
      }
    } catch (error) {
      console.error('İletişim bilgileri yüklenirken hata:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // İletişim bilgilerini kaydet
  const updateContactInfo = (newContactInfo: Partial<ContactInfo>) => {
    const updatedInfo = { ...contactInfo, ...newContactInfo }
    setContactInfo(updatedInfo)
    
    try {
      localStorage.setItem('contact_info', JSON.stringify(updatedInfo))
      
      // Custom event dispatch ederek diğer bileşenleri bilgilendir
      window.dispatchEvent(new CustomEvent('contactInfoUpdated', { 
        detail: updatedInfo 
      }))
      
      return true
    } catch (error) {
      console.error('İletişim bilgileri kaydedilirken hata:', error)
      return false
    }
  }

  // Telefon numarasını formatla
  const formatPhoneNumber = (phone: string) => {
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
  }

  return {
    contactInfo,
    updateContactInfo,
    formatPhoneNumber,
    isLoading
  }
}
'use client'

import { useState, useEffect } from 'react'

export interface WhatsAppConfig {
  phoneNumber: string
  isActive: boolean
  businessName: string
  welcomeMessage: string
  templates: {
    consultation: string
    serviceInquiry: string
    general: string
    appointment: string
  }
  quickReplies: string[]
  workingHours: {
    enabled: boolean
    start: string
    end: string
    timezone: string
    workingDays: number[] // 0-6 (Pazar-Cumartesi)
  }
  autoReply: {
    enabled: boolean
    message: string
    outsideHoursMessage: string
  }
}

const defaultConfig: WhatsAppConfig = {
  phoneNumber: '+905551234567',
  isActive: true,
  businessName: 'Emel Yeşildere',
  welcomeMessage: 'Merhaba! Size nasıl yardımcı olabilirim? 😊',
  templates: {
    consultation: `Merhaba! 🌟

Ücretsiz ön görüşme için iletişime geçtim.

📋 Bilgilerim:
• İsim: 
• Konu: 
• Tercih ettiğim gün/saat: 

Size uygun bir zaman var mı? 😊`,

    serviceInquiry: `Merhaba! 

{serviceName} hakkında bilgi almak istiyorum.

Detayları paylaşabilir misiniz? 🙏`,

    general: `Merhaba! 

Hizmetleriniz hakkında bilgi almak istiyorum.

Müsait olduğunuz bir zamanda konuşabilir miyiz? 😊`,

    appointment: `Merhaba! 

{serviceName} için randevu almak istiyorum.

📅 Uygun tarihlerinizi paylaşabilir misiniz?

Teşekkürler! 🙏`
  },
  quickReplies: [
    'Ücretsiz ön görüşme istiyorum',
    'Hizmet bilgisi almak istiyorum',
    'Randevu almak istiyorum',
    'Fiyat bilgisi istiyorum'
  ],
  workingHours: {
    enabled: true,
    start: '09:00',
    end: '18:00',
    timezone: 'Europe/Istanbul',
    workingDays: [1, 2, 3, 4, 5] // Pazartesi-Cuma
  },
  autoReply: {
    enabled: true,
    message: 'Merhaba! Mesajınızı aldım. En kısa sürede size dönüş yapacağım. 😊',
    outsideHoursMessage: 'Merhaba! Şu anda mesai saatleri dışındayım. Pazartesi-Cuma 09:00-18:00 saatleri arasında size dönüş yapacağım. 🕐'
  }
}

export function useWhatsApp() {
  const [config, setConfig] = useState<WhatsAppConfig>(defaultConfig)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // localStorage'dan WhatsApp config'ini yükle
    const savedConfig = localStorage.getItem('whatsapp_config')
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig)
        setConfig({ ...defaultConfig, ...parsed })
      } catch (error) {
        console.error('WhatsApp config parse error:', error)
        setConfig(defaultConfig)
      }
    } else {
      setConfig(defaultConfig)
    }
  }, [])

  const updateConfig = async (newConfig: Partial<WhatsAppConfig>) => {
    setIsLoading(true)
    try {
      const updatedConfig = { ...config, ...newConfig }
      setConfig(updatedConfig)
      localStorage.setItem('whatsapp_config', JSON.stringify(updatedConfig))
      return { success: true }
    } catch (error) {
      console.error('WhatsApp config update error:', error)
      return { success: false, error: 'Ayarlar güncellenirken hata oluştu' }
    } finally {
      setIsLoading(false)
    }
  }

  const createWhatsAppLink = (templateType: keyof WhatsAppConfig['templates'], customMessage?: string, serviceName?: string) => {
    if (!config.isActive) return '#'

    let message = customMessage || config.templates[templateType]
    
    // Servis adını template'e ekle
    if (serviceName) {
      message = message.replace('{serviceName}', serviceName)
    }

    const phoneNumber = config.phoneNumber.replace(/[^\d]/g, '') // Sadece rakamlar
    const encodedMessage = encodeURIComponent(message)
    
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`
  }

  const isWorkingHours = () => {
    if (!config.workingHours.enabled) return true

    const now = new Date()
    const currentDay = now.getDay() // 0-6 (Pazar-Cumartesi)
    const currentTime = now.toTimeString().slice(0, 5) // HH:MM

    // Çalışma günü kontrolü
    if (!config.workingHours.workingDays.includes(currentDay)) {
      return false
    }

    // Çalışma saati kontrolü
    return currentTime >= config.workingHours.start && currentTime <= config.workingHours.end
  }

  const getStatusMessage = () => {
    if (!config.isActive) return 'WhatsApp desteği şu anda aktif değil'
    if (!isWorkingHours()) return config.autoReply.outsideHoursMessage
    return config.welcomeMessage
  }

  const formatPhoneNumber = (phone: string) => {
    // Türkiye telefon numarası formatı: +90 555 123 45 67
    const cleaned = phone.replace(/\D/g, '')
    
    if (cleaned.startsWith('90')) {
      const number = cleaned.slice(2)
      if (number.length === 10) {
        return `+90 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6, 8)} ${number.slice(8)}`
      }
    }
    
    return phone
  }

  return {
    config,
    updateConfig,
    createWhatsAppLink,
    isWorkingHours,
    getStatusMessage,
    formatPhoneNumber,
    isLoading
  }
}
/**
 * Phone number formatting utilities
 * Türkiye telefon numarası formatı: +90 (xxx) xxx xx xx
 */

/**
 * Telefon numarasını +90 (xxx) xxx xx xx formatına çevirir
 */
export function formatPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return ''
  
  // Sadece rakamları al
  const digits = phone.replace(/\D/g, '')
  
  // Türkiye kodu kontrolü
  let cleanDigits = digits
  if (digits.startsWith('90')) {
    cleanDigits = digits.substring(2)
  } else if (digits.startsWith('0')) {
    cleanDigits = digits.substring(1)
  }
  
  // 10 haneli olmalı (5xx xxx xx xx)
  if (cleanDigits.length !== 10) {
    return phone // Geçersiz format, orijinal değeri döndür
  }
  
  // Format: +90 (5xx) xxx xx xx
  const formatted = `+90 (${cleanDigits.substring(0, 3)}) ${cleanDigits.substring(3, 6)} ${cleanDigits.substring(6, 8)} ${cleanDigits.substring(8, 10)}`
  
  return formatted
}

/**
 * Telefon numarası input'u için maskeleme
 */
export function maskPhoneInput(value: string): string {
  // Sadece rakamları al
  const digits = value.replace(/\D/g, '')
  
  // Maksimum 10 hane (5xx xxx xx xx)
  const limitedDigits = digits.substring(0, 10)
  
  if (limitedDigits.length === 0) return ''
  
  // Aşamalı maskeleme
  if (limitedDigits.length <= 3) {
    return `+90 (${limitedDigits}`
  } else if (limitedDigits.length <= 6) {
    return `+90 (${limitedDigits.substring(0, 3)}) ${limitedDigits.substring(3)}`
  } else if (limitedDigits.length <= 8) {
    return `+90 (${limitedDigits.substring(0, 3)}) ${limitedDigits.substring(3, 6)} ${limitedDigits.substring(6)}`
  } else {
    return `+90 (${limitedDigits.substring(0, 3)}) ${limitedDigits.substring(3, 6)} ${limitedDigits.substring(6, 8)} ${limitedDigits.substring(8)}`
  }
}

/**
 * Telefon numarasını veritabanı formatına çevirir (sadece rakamlar)
 */
export function parsePhoneNumber(formattedPhone: string): string {
  if (!formattedPhone) return ''
  
  // Sadece rakamları al
  const digits = formattedPhone.replace(/\D/g, '')
  
  // Türkiye kodu ekle
  if (digits.length === 10) {
    return `90${digits}`
  } else if (digits.length === 12 && digits.startsWith('90')) {
    return digits
  }
  
  return digits
}

/**
 * Telefon numarası validasyonu
 */
export function isValidPhoneNumber(phone: string): boolean {
  if (!phone) return false
  
  const digits = phone.replace(/\D/g, '')
  
  // Türkiye mobil numarası kontrolü
  // 90 ile başlayıp 12 haneli olmalı veya 0 ile başlayıp 11 haneli olmalı veya direkt 10 haneli olmalı
  if (digits.length === 12 && digits.startsWith('90')) {
    const mobilePrefix = digits.substring(2, 3)
    return mobilePrefix === '5' // Türkiye mobil numaraları 5 ile başlar
  } else if (digits.length === 11 && digits.startsWith('0')) {
    const mobilePrefix = digits.substring(1, 2)
    return mobilePrefix === '5'
  } else if (digits.length === 10) {
    const mobilePrefix = digits.substring(0, 1)
    return mobilePrefix === '5'
  }
  
  return false
}

/**
 * Telefon numarası placeholder'ı
 */
export const PHONE_PLACEHOLDER = '+90 (5xx) xxx xx xx'

/**
 * Telefon numarası örneği
 */
export const PHONE_EXAMPLE = '+90 (555) 123 45 67'
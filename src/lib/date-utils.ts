// Tarih yardımcı fonksiyonları - timezone kayması olmadan

/**
 * Date objesini YYYY-MM-DD formatında string'e çevirir (timezone kayması olmadan)
 */
export function formatDateToString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

/**
 * Bugünün tarihini YYYY-MM-DD formatında döndürür
 */
export function getTodayString(): string {
  return formatDateToString(new Date())
}

/**
 * YYYY-MM-DD formatındaki string'i Türkçe tarih formatında gösterir
 */
export function formatDateForDisplay(dateString: string): string {
  return new Date(dateString + 'T12:00:00').toLocaleDateString('tr-TR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * YYYY-MM-DD formatındaki string'i kısa Türkçe tarih formatında gösterir
 */
export function formatDateForDisplayShort(dateString: string): string {
  return new Date(dateString + 'T12:00:00').toLocaleDateString('tr-TR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  })
}

/**
 * Timestamp'i Türkçe tarih ve saat formatında gösterir
 */
export function formatTimestampForDisplay(timestamp: string): string {
  return new Date(timestamp).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
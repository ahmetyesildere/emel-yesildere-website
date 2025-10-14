// Storage Helper - Dosya yükleme ve organizasyon için yardımcı fonksiyonlar

export type DocumentType = 'consultant' | 'admin' | 'client' | 'system'

export interface UploadConfig {
  bucket: string
  folder: string
  fileName: string
  file: File
}

/**
 * Kullanıcı rolüne göre doğru storage klasörünü belirler
 */
export function getDocumentFolder(userRole: string, documentType?: string): string {
  const roleMapping: Record<string, string> = {
    'admin': 'admin-documents',
    'admin_assistant': 'admin-documents',
    'consultant': 'consultant-documents',
    'client': 'client-documents',
    'visitor': 'client-documents'
  }

  return roleMapping[userRole] || 'client-documents'
}

/**
 * Dosya adını temizler ve güvenli hale getirir
 */
export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase()
}

/**
 * Kullanıcı ve belge bilgilerine göre dosya adı oluşturur
 */
export function generateFileName(
  firstName: string,
  lastName: string,
  specialty?: string,
  documentType?: string,
  originalFileName?: string
): string {
  const timestamp = Date.now()
  const extension = originalFileName?.split('.').pop() || 'pdf'

  let fileName = `${firstName}_${lastName}`

  if (specialty) {
    fileName += `_${sanitizeFileName(specialty)}`
  }

  if (documentType) {
    fileName += `_${sanitizeFileName(documentType)}`
  }

  fileName += `_${timestamp}.${extension}`

  return sanitizeFileName(fileName)
}

/**
 * Storage path'ini oluşturur
 */
export function buildStoragePath(folder: string, fileName: string): string {
  return `${folder}/${fileName}`
}

/**
 * Dosya boyutu kontrolü (MB cinsinden)
 */
export function validateFileSize(file: File, maxSizeMB: number = 10): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}

/**
 * Dosya türü kontrolü
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.some(type => file.type.includes(type) || file.name.toLowerCase().endsWith(type))
}

/**
 * Belge yükleme için izin verilen dosya türleri
 */
export const ALLOWED_DOCUMENT_TYPES = [
  'pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'txt'
]

/**
 * Avatar yükleme için izin verilen dosya türleri  
 */
export const ALLOWED_IMAGE_TYPES = [
  'jpg', 'jpeg', 'png', 'gif', 'webp'
]

/**
 * Storage klasör yapısı
 */
export const STORAGE_FOLDERS = {
  CONSULTANT_DOCUMENTS: 'consultant-documents',
  ADMIN_DOCUMENTS: 'admin-documents',
  CLIENT_DOCUMENTS: 'client-documents',
  SYSTEM_DOCUMENTS: 'system-documents',
  AVATARS: 'avatars',
  TEMP: 'temp'
} as const
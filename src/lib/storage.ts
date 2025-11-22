import { supabase } from './supabase'

export interface UploadOptions {
  bucket: 'documents' | 'images' | 'videos'
  folder?: string
  category?: string
  isPublic?: boolean
  metadata?: Record<string, any>
}

export interface UploadResult {
  success: boolean
  data?: {
    id: string
    path: string
    fullPath: string
    publicUrl?: string
  }
  error?: string
}

// Dosya yükleme fonksiyonu
export async function uploadFile(
  file: File, 
  options: UploadOptions
): Promise<UploadResult> {
  try {
    // Dosya boyutu kontrolü
    const maxSizes = {
      documents: 10 * 1024 * 1024, // 10 MB
      images: 5 * 1024 * 1024,     // 5 MB
      videos: 200 * 1024 * 1024    // 200 MB
    }

    if (file.size > maxSizes[options.bucket]) {
      return {
        success: false,
        error: `Dosya boyutu ${options.bucket} için çok büyük (max: ${Math.round(maxSizes[options.bucket] / 1024 / 1024)}MB)`
      }
    }

    // Dosya türü kontrolü
    const allowedTypes = {
      documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
      images: ['image/jpeg', 'image/jpg', 'image/png'],
      videos: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/quicktime']
    }

    if (!allowedTypes[options.bucket].includes(file.type)) {
      return {
        success: false,
        error: `Bu dosya türü ${options.bucket} bucket'ı için desteklenmiyor`
      }
    }

    // Kullanıcı ID'sini al
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return {
        success: false,
        error: 'Kullanıcı girişi gerekli'
      }
    }

    // Dosya adını oluştur
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const folder = options.folder || user.id
    const filePath = `${folder}/${fileName}`

    // Dosyayı Supabase Storage'a yükle
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(options.bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      return {
        success: false,
        error: uploadError.message
      }
    }

    // Public URL'i al (eğer public bucket ise)
    let publicUrl: string | undefined
    if (options.isPublic !== false) {
      const { data: urlData } = supabase.storage
        .from(options.bucket)
        .getPublicUrl(filePath)
      publicUrl = urlData.publicUrl
    }

    // Veritabanına kayıt ekle
    const { data: dbData, error: dbError } = await supabase
      .from('files')
      .insert({
        user_id: user.id,
        file_name: fileName,
        file_path: filePath,
        file_size: file.size,
        file_type: file.type,
        bucket_name: options.bucket,
        category: options.category || options.bucket.slice(0, -1), // 'images' -> 'image'
        is_public: options.isPublic !== false
      })
      .select()
      .single()

    if (dbError) {
      // Storage'dan dosyayı sil (rollback)
      await supabase.storage.from(options.bucket).remove([filePath])
      return {
        success: false,
        error: dbError.message
      }
    }

    return {
      success: true,
      data: {
        id: dbData.id,
        path: filePath,
        fullPath: `${options.bucket}/${filePath}`,
        publicUrl
      }
    }

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }
  }
}

// Dosya silme fonksiyonu
export async function deleteFile(fileId: string): Promise<UploadResult> {
  try {
    // Dosya bilgilerini al
    const { data: fileData, error: fetchError } = await supabase
      .from('files')
      .select('*')
      .eq('id', fileId)
      .single()

    if (fetchError || !fileData) {
      return {
        success: false,
        error: 'Dosya bulunamadı'
      }
    }

    // Storage'dan sil
    const { error: storageError } = await supabase.storage
      .from(fileData.bucket_name)
      .remove([fileData.file_path])

    if (storageError) {
      return {
        success: false,
        error: storageError.message
      }
    }

    // Veritabanından sil
    const { error: dbError } = await supabase
      .from('files')
      .delete()
      .eq('id', fileId)

    if (dbError) {
      return {
        success: false,
        error: dbError.message
      }
    }

    return {
      success: true
    }

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }
  }
}

// Kullanıcının dosyalarını listeleme
export async function getUserFiles(
  bucket?: 'documents' | 'images' | 'videos',
  category?: string
) {
  try {
    let query = supabase
      .from('files')
      .select('*')
      .order('created_at', { ascending: false })

    if (bucket) {
      query = query.eq('bucket_name', bucket)
    }

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }
  }
}

// Dosya URL'i alma
export function getFileUrl(bucket: string, path: string) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}
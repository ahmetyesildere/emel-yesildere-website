'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface VideoContent {
  id: string
  title: string
  description: string
  videoUrl: string
  thumbnailUrl: string
  isActive: boolean
  uploadDate: string
  fileName?: string
  thumbnailFileName?: string
}

const defaultVideo: VideoContent = {
  id: 'default',
  title: 'Emel Yeşildere ile Tanışın',
  description: 'Duygu temizliği yolculuğunuzu keşfedin',
  videoUrl: '/media/videos/C5881.mp4',
  thumbnailUrl: '/media/images/thumbnail-1762982413119.png',
  fileName: 'C5881.mp4',
  thumbnailFileName: 'thumbnail-1762982413119.png',
  isActive: true,
  uploadDate: new Date().toISOString()
}

export function useVideoContent() {
  // İlk render'da localStorage'dan yükle veya varsayılan kullan
  const [videoContent, setVideoContent] = useState<VideoContent>(() => {
    if (typeof window !== 'undefined') {
      const savedVideo = localStorage.getItem('video_content')
      if (savedVideo) {
        try {
          const parsed = JSON.parse(savedVideo)
          console.log('✅ Video localStorage\'dan yüklendi (initial):', parsed)
          return parsed
        } catch (error) {
          console.error('❌ localStorage parse error:', error)
        }
      }
      // localStorage'da yoksa varsayılan kullan ve kaydet
      console.log('✅ Varsayılan video kullanılıyor (initial)')
      localStorage.setItem('video_content', JSON.stringify(defaultVideo))
    }
    return defaultVideo
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    loadVideoContent()
  }, [])

  const loadVideoContent = async () => {
    try {
      console.log('📥 Video içeriği yükleniyor...')
      
      // Sadece localStorage'dan yükle
      const savedVideo = localStorage.getItem('video_content')
      if (savedVideo) {
        try {
          const parsed = JSON.parse(savedVideo)
          console.log('✅ Video localStorage\'dan yüklendi:', parsed)
          console.log('🖼️ Thumbnail URL:', parsed.thumbnailUrl)
          console.log('🎬 Video URL:', parsed.videoUrl)
          setVideoContent(parsed)
          return
        } catch (parseError) {
          console.error('❌ localStorage parse error:', parseError)
        }
      }

      // localStorage'da veri yoksa varsayılan video kullan
      console.log('✅ Varsayılan video kullanılıyor')
      setVideoContent(defaultVideo)
      localStorage.setItem('video_content', JSON.stringify(defaultVideo))
      
    } catch (error) {
      console.error('❌ Video content load error:', error)
      setVideoContent(defaultVideo)
      localStorage.setItem('video_content', JSON.stringify(defaultVideo))
    }
  }

  const saveVideoContent = async (content: VideoContent) => {
    // Sadece localStorage'a kaydet
    localStorage.setItem('video_content', JSON.stringify(content))
    console.log('💾 localStorage\'a kaydedildi:', content)
    console.log('✅ Video içeriği kaydedildi')
  }

  const updateVideoContent = async (newContent: Partial<VideoContent>) => {
    setIsLoading(true)
    try {
      const updatedContent = {
        ...videoContent,
        ...newContent,
        uploadDate: new Date().toISOString()
      }
      
      setVideoContent(updatedContent)
      await saveVideoContent(updatedContent)
      
      console.log('✅ Video içeriği güncellendi')
      return { success: true }
    } catch (error) {
      console.error('❌ Video content update error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Video içeriği güncellenirken hata oluştu'
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const uploadVideo = async (file: File) => {
    setIsLoading(true)
    setUploadProgress(0)
    
    try {
      // Dosya boyutu kontrolü
      if (file.size > 200 * 1024 * 1024) {
        throw new Error('Video dosyası 200MB\'dan küçük olmalıdır')
      }

      // Dosya türü kontrolü
      if (!file.type.startsWith('video/')) {
        throw new Error('Lütfen geçerli bir video dosyası seçin')
      }

      console.log('🎬 Video yükleniyor:', { 
        name: file.name, 
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`, 
        type: file.type 
      })

      setUploadProgress(20)

      // Dosya adını oluştur (timestamp ile unique yap)
      const fileExt = file.name.split('.').pop()
      const fileName = `video-${Date.now()}.${fileExt}`

      setUploadProgress(40)

      // FormData oluştur
      const formData = new FormData()
      formData.append('file', file)
      formData.append('fileName', fileName)
      formData.append('type', 'video')

      setUploadProgress(60)

      // API endpoint'e yükle
      const response = await fetch('/api/upload-media', {
        method: 'POST',
        body: formData
      })

      setUploadProgress(80)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Video yükleme hatası')
      }

      const result = await response.json()
      console.log('✅ Video yüklendi:', result)

      setUploadProgress(95)

      // Video içeriğini güncelle ve Supabase'e kaydet
      const updatedContent = {
        ...videoContent,
        videoUrl: `/media/videos/${fileName}`,
        fileName: fileName,
        uploadDate: new Date().toISOString()
      }
      
      setVideoContent(updatedContent)
      
      // Supabase'e kaydet - hata olursa kullanıcıya bildir
      await saveVideoContent(updatedContent)
      console.log('✅ Video bilgileri Supabase\'e kaydedildi')
      
      setUploadProgress(100)
      
      return { success: true, url: `/media/videos/${fileName}` }
    } catch (error) {
      console.error('❌ Video upload error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Video yüklenirken hata oluştu'
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
      setUploadProgress(0)
    }
  }

  const uploadThumbnail = async (file: File) => {
    setIsLoading(true)
    try {
      // Dosya boyutu kontrolü
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Thumbnail dosyası 5MB\'dan küçük olmalıdır')
      }

      // Dosya türü kontrolü
      if (!file.type.startsWith('image/')) {
        throw new Error('Lütfen geçerli bir resim dosyası seçin')
      }

      console.log('🖼️ Seçilen thumbnail:', { 
        name: file.name, 
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`, 
        type: file.type 
      })

      // Dosya adını al (kopyalama yapmadan)
      const fileName = file.name
      const newThumbnailUrl = `/media/images/${fileName}`
      
      console.log('📝 Thumbnail yolu:', newThumbnailUrl)
      
      // Thumbnail içeriğini güncelle
      const updatedContent = {
        ...videoContent,
        thumbnailUrl: newThumbnailUrl,
        thumbnailFileName: fileName,
        uploadDate: new Date().toISOString()
      }
      
      console.log('📝 Güncellenecek içerik:', updatedContent)
      
      // State'i güncelle
      setVideoContent(updatedContent)
      
      // localStorage'a kaydet
      await saveVideoContent(updatedContent)
      console.log('✅ Thumbnail yolu kaydedildi:', newThumbnailUrl)
      
      return { success: true, url: newThumbnailUrl }
    } catch (error) {
      console.error('❌ Thumbnail seçim hatası:', error)
      const errorMessage = error instanceof Error ? error.message : 'Thumbnail seçilirken hata oluştu'
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const removeVideo = async () => {
    setIsLoading(true)
    try {
      // Lokal dosyayı sil (eğer custom upload edilmişse)
      if (videoContent.fileName && videoContent.fileName !== 'C5881.mp4') {
        try {
          const response = await fetch('/api/delete-media', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              fileName: videoContent.fileName,
              type: 'video'
            })
          })

          if (response.ok) {
            console.log('🗑️ Video dosyası silindi:', videoContent.fileName)
          }
        } catch (error) {
          console.warn('⚠️ Video dosyası silinemedi:', error)
        }
      }

      const updatedContent = {
        ...videoContent,
        videoUrl: '',
        fileName: undefined,
        uploadDate: new Date().toISOString()
      }
      
      setVideoContent(updatedContent)
      
      // Supabase'e kaydet
      await saveVideoContent(updatedContent)
      console.log('✅ Video kaldırma işlemi Supabase\'e kaydedildi')
      
      return { success: true }
    } catch (error) {
      console.error('❌ Video remove error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Video silinirken hata oluştu'
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const removeThumbnail = async () => {
    setIsLoading(true)
    try {
      // Lokal dosyayı sil (eğer custom upload edilmişse)
      if (videoContent.thumbnailFileName && videoContent.thumbnailFileName !== 'tanıtım video.png') {
        try {
          const response = await fetch('/api/delete-media', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              fileName: videoContent.thumbnailFileName,
              type: 'image'
            })
          })

          if (response.ok) {
            console.log('🗑️ Thumbnail dosyası silindi:', videoContent.thumbnailFileName)
          }
        } catch (error) {
          console.warn('⚠️ Thumbnail dosyası silinemedi:', error)
        }
      }

      const updatedContent = {
        ...videoContent,
        thumbnailUrl: '',
        thumbnailFileName: undefined,
        uploadDate: new Date().toISOString()
      }
      
      setVideoContent(updatedContent)
      
      // Supabase'e kaydet
      await saveVideoContent(updatedContent)
      console.log('✅ Thumbnail kaldırma işlemi Supabase\'e kaydedildi')
      
      return { success: true }
    } catch (error) {
      console.error('❌ Thumbnail remove error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Thumbnail silinirken hata oluştu'
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const syncFromSupabase = async () => {
    // Artık Supabase kullanmıyoruz, localStorage'dan yeniden yükle
    setIsLoading(true)
    try {
      await loadVideoContent()
      console.log('✅ localStorage\'dan yeniden yüklendi')
      return { success: true, data: videoContent }
    } catch (error) {
      console.error('❌ Reload error:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Bilinmeyen hata' }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    videoContent,
    updateVideoContent,
    uploadVideo,
    uploadThumbnail,
    removeVideo,
    removeThumbnail,
    syncFromSupabase,
    isLoading,
    uploadProgress
  }
}
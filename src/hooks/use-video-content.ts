'use client'

import { useState, useEffect } from 'react'

export interface VideoContent {
  id: string
  title: string
  description: string
  videoUrl: string
  thumbnailUrl: string
  isActive: boolean
  uploadDate: string
}

const defaultVideo: VideoContent = {
  id: 'default',
  title: 'Emel Yeşildere ile Tanışın',
  description: 'Duygu temizliği yolculuğunuzu keşfedin',
  videoUrl: '',
  thumbnailUrl: '',
  isActive: true,
  uploadDate: new Date().toISOString()
}

export function useVideoContent() {
  const [videoContent, setVideoContent] = useState<VideoContent>(defaultVideo)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // localStorage'dan video içeriğini yükle
    const savedVideo = localStorage.getItem('video_content')
    if (savedVideo) {
      try {
        const parsed = JSON.parse(savedVideo)
        setVideoContent(parsed)
      } catch (error) {
        console.error('Video content parse error:', error)
        setVideoContent(defaultVideo)
      }
    } else {
      setVideoContent(defaultVideo)
    }
  }, [])

  const updateVideoContent = async (newContent: Partial<VideoContent>) => {
    setIsLoading(true)
    try {
      const updatedContent = {
        ...videoContent,
        ...newContent,
        uploadDate: new Date().toISOString()
      }
      
      setVideoContent(updatedContent)
      localStorage.setItem('video_content', JSON.stringify(updatedContent))
      
      return { success: true }
    } catch (error) {
      console.error('Video content update error:', error)
      return { success: false, error: 'Video içeriği güncellenirken hata oluştu' }
    } finally {
      setIsLoading(false)
    }
  }

  const uploadVideo = async (file: File) => {
    setIsLoading(true)
    try {
      // Base64'e çevir
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      const updatedContent = {
        ...videoContent,
        videoUrl: base64,
        uploadDate: new Date().toISOString()
      }
      
      setVideoContent(updatedContent)
      localStorage.setItem('video_content', JSON.stringify(updatedContent))
      
      return { success: true }
    } catch (error) {
      console.error('Video upload error:', error)
      return { success: false, error: 'Video yüklenirken hata oluştu' }
    } finally {
      setIsLoading(false)
    }
  }

  const uploadThumbnail = async (file: File) => {
    setIsLoading(true)
    try {
      // Base64'e çevir
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      const updatedContent = {
        ...videoContent,
        thumbnailUrl: base64,
        uploadDate: new Date().toISOString()
      }
      
      setVideoContent(updatedContent)
      localStorage.setItem('video_content', JSON.stringify(updatedContent))
      
      return { success: true }
    } catch (error) {
      console.error('Thumbnail upload error:', error)
      return { success: false, error: 'Thumbnail yüklenirken hata oluştu' }
    } finally {
      setIsLoading(false)
    }
  }

  const removeVideo = async () => {
    setIsLoading(true)
    try {
      const updatedContent = {
        ...videoContent,
        videoUrl: '',
        uploadDate: new Date().toISOString()
      }
      
      setVideoContent(updatedContent)
      localStorage.setItem('video_content', JSON.stringify(updatedContent))
      
      return { success: true }
    } catch (error) {
      console.error('Video remove error:', error)
      return { success: false, error: 'Video silinirken hata oluştu' }
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
    isLoading
  }
}
'use client'

import React, { useState, useRef } from 'react'
import { Upload, File, Image, Video, X, Check, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { uploadFile, UploadOptions } from '@/lib/storage'

interface FileUploadProps {
  bucket: 'documents' | 'images' | 'videos'
  category?: string
  onUploadSuccess?: (result: any) => void
  onUploadError?: (error: string) => void
  multiple?: boolean
  className?: string
}

const FileUpload: React.FC<FileUploadProps> = ({
  bucket,
  category,
  onUploadSuccess,
  onUploadError,
  multiple = false,
  className = ''
}) => {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: 'uploading' | 'success' | 'error'}>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getIcon = () => {
    switch (bucket) {
      case 'images': return <Image className="w-8 h-8" />
      case 'videos': return <Video className="w-8 h-8" />
      case 'documents': return <File className="w-8 h-8" />
      default: return <Upload className="w-8 h-8" />
    }
  }

  const getAcceptedTypes = () => {
    switch (bucket) {
      case 'images': return 'image/jpeg,image/jpg,image/png'
      case 'videos': return 'video/mp4,video/avi,video/mov,video/wmv'
      case 'documents': return 'application/pdf,.doc,.docx,.txt'
      default: return '*'
    }
  }

  const getMaxSize = () => {
    switch (bucket) {
      case 'images': return '5MB'
      case 'videos': return '200MB'
      case 'documents': return '10MB'
      default: return '10MB'
    }
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const newProgress: {[key: string]: 'uploading' | 'success' | 'error'} = {}

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileKey = `${file.name}-${i}`
      newProgress[fileKey] = 'uploading'
      setUploadProgress(prev => ({ ...prev, ...newProgress }))

      try {
        const options: UploadOptions = {
          bucket,
          category: category || bucket.slice(0, -1),
          isPublic: bucket === 'images'
        }

        const result = await uploadFile(file, options)

        if (result.success) {
          newProgress[fileKey] = 'success'
          onUploadSuccess?.(result.data)
        } else {
          newProgress[fileKey] = 'error'
          onUploadError?.(result.error || 'Upload failed')
        }
      } catch (error) {
        newProgress[fileKey] = 'error'
        onUploadError?.(error instanceof Error ? error.message : 'Upload failed')
      }

      setUploadProgress(prev => ({ ...prev, [fileKey]: newProgress[fileKey] }))
    }

    setUploading(false)
    
    // Clear progress after 3 seconds
    setTimeout(() => {
      setUploadProgress({})
    }, 3000)

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={getAcceptedTypes()}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />

      <Card 
        className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer"
        onClick={handleClick}
      >
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="text-gray-400">
              {getIcon()}
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {bucket === 'images' && 'Resim Yükle'}
                {bucket === 'videos' && 'Video Yükle'}
                {bucket === 'documents' && 'Belge Yükle'}
              </h3>
              <p className="text-gray-600 text-sm">
                Dosyalarınızı buraya sürükleyin veya tıklayarak seçin
              </p>
              <p className="text-gray-500 text-xs mt-1">
                {bucket === 'images' && 'Desteklenen formatlar: JPG, JPEG, PNG'}
                {bucket === 'videos' && 'Desteklenen formatlar: MP4, AVI, MOV, WMV'}
                {bucket === 'documents' && 'Desteklenen formatlar: PDF, DOC, DOCX, TXT'}
              </p>
              <p className="text-gray-500 text-xs">
                Maksimum dosya boyutu: {getMaxSize()}
              </p>
            </div>

            <Button 
              variant="outline" 
              disabled={uploading}
              className="pointer-events-none"
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? 'Yükleniyor...' : 'Dosya Seç'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="mt-4 space-y-2">
          {Object.entries(uploadProgress).map(([fileKey, status]) => {
            const fileName = fileKey.split('-').slice(0, -1).join('-')
            return (
              <div key={fileKey} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                <div className="flex-1 text-sm text-gray-700 truncate">
                  {fileName}
                </div>
                <div>
                  {status === 'uploading' && (
                    <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full" />
                  )}
                  {status === 'success' && (
                    <Check className="w-4 h-4 text-green-600" />
                  )}
                  {status === 'error' && (
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default FileUpload
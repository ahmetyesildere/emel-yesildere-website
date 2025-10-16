'use client'

import React, { useState } from 'react'
import { 
  Upload, 
  Play, 
  Trash2, 
  Save, 
  Video, 
  Image as ImageIcon,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useVideoContent } from '@/hooks/use-video-content'

const VideoManagement = () => {
  const { 
    videoContent, 
    updateVideoContent, 
    uploadVideo, 
    uploadThumbnail, 
    removeVideo, 
    isLoading 
  } = useVideoContent()

  const [formData, setFormData] = useState({
    title: videoContent.title,
    description: videoContent.description,
    isActive: videoContent.isActive
  })

  const [previewMode, setPreviewMode] = useState(false)

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Video dosyası kontrolü
    if (!file.type.startsWith('video/')) {
      alert('Lütfen geçerli bir video dosyası seçin')
      return
    }

    // Dosya boyutu kontrolü (50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert('Video dosyası 50MB\'dan küçük olmalıdır')
      return
    }

    const result = await uploadVideo(file)
    if (result.success) {
      alert('Video başarıyla yüklendi!')
    } else {
      alert(result.error || 'Video yüklenirken hata oluştu')
    }
  }

  const handleThumbnailUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Resim dosyası kontrolü
    if (!file.type.startsWith('image/')) {
      alert('Lütfen geçerli bir resim dosyası seçin')
      return
    }

    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Resim dosyası 5MB\'dan küçük olmalıdır')
      return
    }

    const result = await uploadThumbnail(file)
    if (result.success) {
      alert('Thumbnail başarıyla yüklendi!')
    } else {
      alert(result.error || 'Thumbnail yüklenirken hata oluştu')
    }
  }

  const handleSave = async () => {
    const result = await updateVideoContent(formData)
    if (result.success) {
      alert('Video bilgileri güncellendi!')
    } else {
      alert(result.error || 'Güncelleme sırasında hata oluştu')
    }
  }

  const handleRemoveVideo = async () => {
    if (confirm('Videoyu silmek istediğinizden emin misiniz?')) {
      const result = await removeVideo()
      if (result.success) {
        alert('Video silindi!')
      } else {
        alert(result.error || 'Video silinirken hata oluştu')
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Ana Sayfa Video Yönetimi</h2>
          <p className="text-gray-600">Ana sayfadaki tanıtım videosunu yönetin</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center space-x-2"
          >
            {previewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{previewMode ? 'Düzenleme' : 'Önizleme'}</span>
          </Button>
          <Badge variant={videoContent.isActive ? 'default' : 'secondary'}>
            {videoContent.isActive ? 'Aktif' : 'Pasif'}
          </Badge>
        </div>
      </div>

      {previewMode ? (
        /* Preview Mode */
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Play className="w-5 h-5" />
              <span>Video Önizleme</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden max-w-2xl mx-auto">
              {videoContent.videoUrl ? (
                <video 
                  controls 
                  className="w-full h-full object-cover"
                  poster={videoContent.thumbnailUrl || undefined}
                >
                  <source src={videoContent.videoUrl} type="video/mp4" />
                  Tarayıcınız video oynatmayı desteklemiyor.
                </video>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Henüz video yüklenmemiş</p>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-lg font-semibold">{videoContent.title}</h3>
              <p className="text-gray-600 mt-2">{videoContent.description}</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Edit Mode */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Video Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Video className="w-5 h-5" />
                <span>Video Yükleme</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {videoContent.videoUrl ? (
                <div className="space-y-4">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <video 
                      controls 
                      className="w-full h-full object-cover"
                      poster={videoContent.thumbnailUrl || undefined}
                    >
                      <source src={videoContent.videoUrl} type="video/mp4" />
                    </video>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('video-upload')?.click()}
                      className="flex-1"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Videoyu Değiştir
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleRemoveVideo}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Sil
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Video dosyası yükleyin</p>
                  <Button
                    onClick={() => document.getElementById('video-upload')?.click()}
                    disabled={isLoading}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {isLoading ? 'Yükleniyor...' : 'Video Seç'}
                  </Button>
                </div>
              )}

              <input
                id="video-upload"
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
              />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Video Yükleme Kuralları:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Maksimum dosya boyutu: 50MB</li>
                      <li>Desteklenen formatlar: MP4, WebM, AVI</li>
                      <li>Önerilen çözünürlük: 1920x1080 (Full HD)</li>
                      <li>Önerilen süre: 30 saniye - 2 dakika</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thumbnail Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ImageIcon className="w-5 h-5" />
                <span>Thumbnail (Kapak Resmi)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {videoContent.thumbnailUrl ? (
                <div className="space-y-4">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src={videoContent.thumbnailUrl} 
                      alt="Video Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('thumbnail-upload')?.click()}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Thumbnail Değiştir
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center aspect-video flex items-center justify-center">
                  <div>
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Kapak resmi yükleyin</p>
                    <Button
                      onClick={() => document.getElementById('thumbnail-upload')?.click()}
                      disabled={isLoading}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {isLoading ? 'Yükleniyor...' : 'Resim Seç'}
                    </Button>
                  </div>
                </div>
              )}

              <input
                id="thumbnail-upload"
                type="file"
                accept="image/*"
                onChange={handleThumbnailUpload}
                className="hidden"
              />

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-green-800">
                    <p className="font-medium mb-1">Thumbnail Kuralları:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Maksimum dosya boyutu: 5MB</li>
                      <li>Desteklenen formatlar: JPG, PNG, WebP</li>
                      <li>Önerilen boyut: 1920x1080 piksel</li>
                      <li>Video içeriğini temsil eden bir kare seçin</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Video Information */}
      {!previewMode && (
        <Card>
          <CardHeader>
            <CardTitle>Video Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video Başlığı
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Örn: Emel Yeşildere ile Tanışın"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video Açıklaması
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Video hakkında kısa bir açıklama yazın..."
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Videoyu ana sayfada göster
              </label>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Info */}
      {videoContent.uploadDate && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-500">
              Son güncelleme: {new Date(videoContent.uploadDate).toLocaleString('tr-TR')}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default VideoManagement
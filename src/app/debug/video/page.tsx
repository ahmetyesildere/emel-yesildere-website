'use client'

import React from 'react'
import { useVideoContent } from '@/hooks/use-video-content'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function VideoDebugPage() {
  const { videoContent, isLoading } = useVideoContent()
  
  React.useEffect(() => {
    console.log('🔍 Video Content:', videoContent)
    console.log('📦 localStorage:', localStorage.getItem('video_content'))
  }, [videoContent])

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Video Debug Sayfası</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mevcut Video İçeriği</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(videoContent, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>LocalStorage İşlemleri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => {
                const current = localStorage.getItem('video_content')
                if (current) {
                  const parsed = JSON.parse(current)
                  alert('LocalStorage İçeriği:\n\n' + 
                    'Thumbnail: ' + parsed.thumbnailUrl + '\n' +
                    'Video: ' + parsed.videoUrl + '\n' +
                    'Thumbnail Dosya: ' + parsed.thumbnailFileName)
                } else {
                  alert('LocalStorage boş')
                }
              }}
              variant="outline"
              className="w-full"
            >
              LocalStorage İçeriğini Göster
            </Button>

            <Button 
              onClick={() => {
                localStorage.removeItem('video_content')
                alert('LocalStorage temizlendi! Sayfa yenilenecek...')
                setTimeout(() => window.location.reload(), 1000)
              }}
              variant="destructive"
              className="w-full"
            >
              LocalStorage Temizle ve Yenile
            </Button>
            
            <Button 
              onClick={() => {
                const newData = {
                  id: 'default',
                  title: 'Emel Yeşildere ile Tanışın',
                  description: 'Duygu temizliği yolculuğunuzu keşfedin',
                  videoUrl: '/media/videos/C5881.mp4',
                  thumbnailUrl: '/media/images/tanıtım video.png',
                  fileName: 'C5881.mp4',
                  thumbnailFileName: 'tanıtım video.png',
                  isActive: true,
                  uploadDate: new Date().toISOString()
                }
                localStorage.setItem('video_content', JSON.stringify(newData))
                alert('Varsayılan değerler yüklendi! Sayfa yenilenecek...')
                setTimeout(() => window.location.reload(), 1000)
              }}
              variant="outline"
              className="w-full"
            >
              Varsayılan Değerleri Yükle
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thumbnail Önizleme</CardTitle>
          </CardHeader>
          <CardContent>
            {videoContent.thumbnailUrl ? (
              <div className="space-y-4">
                <div className="aspect-video bg-gray-100 rounded overflow-hidden">
                  <img 
                    src={videoContent.thumbnailUrl} 
                    alt="Thumbnail"
                    className="w-full h-full object-cover"
                    onLoad={() => console.log('✅ Thumbnail yüklendi')}
                    onError={(e) => console.error('❌ Thumbnail hatası:', e)}
                  />
                </div>
                <div className="text-sm space-y-1">
                  <p><strong>Thumbnail URL:</strong> {videoContent.thumbnailUrl}</p>
                  <p><strong>Thumbnail Dosya:</strong> {videoContent.thumbnailFileName || 'Yok'}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Thumbnail yüklenmemiş</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Video Önizleme</CardTitle>
          </CardHeader>
          <CardContent>
            {videoContent.videoUrl ? (
              <div className="space-y-4">
                <div className="aspect-video bg-gray-100 rounded overflow-hidden">
                  <video 
                    controls 
                    className="w-full h-full"
                    poster={videoContent.thumbnailUrl || undefined}
                  >
                    <source src={videoContent.videoUrl} type="video/mp4" />
                  </video>
                </div>
                <div className="text-sm space-y-1">
                  <p><strong>Video URL:</strong> {videoContent.videoUrl}</p>
                  <p><strong>Video Dosya:</strong> {videoContent.fileName || 'Yok'}</p>
                  <p><strong>Aktif:</strong> {videoContent.isActive ? 'Evet' : 'Hayır'}</p>
                  <p><strong>Başlık:</strong> {videoContent.title}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Video yüklenmemiş</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

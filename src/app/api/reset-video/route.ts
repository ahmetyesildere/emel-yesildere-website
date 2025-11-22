import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    const defaultVideo = {
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

    // Supabase'e kaydet
    const { error } = await supabase
      .from('site_settings')
      .upsert({
        key: 'homepage_video',
        value: JSON.stringify(defaultVideo),
        updated_at: new Date().toISOString()
      })

    if (error) {
      console.error('Supabase update error:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Video ayarları sıfırlandı',
      video: defaultVideo
    })

  } catch (error) {
    console.error('Reset video error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Video sıfırlama hatası' 
    }, { status: 500 })
  }
}

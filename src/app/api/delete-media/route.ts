import { NextRequest, NextResponse } from 'next/server'
import { unlink } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function DELETE(request: NextRequest) {
  try {
    const { fileName, type } = await request.json()

    if (!fileName) {
      return NextResponse.json({ error: 'Dosya adı gerekli' }, { status: 400 })
    }

    if (!type || !['video', 'image'].includes(type)) {
      return NextResponse.json({ error: 'Geçersiz dosya türü' }, { status: 400 })
    }

    // Hedef klasörü belirle
    const targetDir = type === 'video' ? 'videos' : 'images'
    const filePath = join(process.cwd(), 'public', 'media', targetDir, fileName)

    // Dosya var mı kontrol et
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 404 })
    }

    // Güvenlik kontrolü - sadece media klasöründeki dosyaları sil
    if (!filePath.includes(join('public', 'media'))) {
      return NextResponse.json({ error: 'Güvenlik hatası' }, { status: 403 })
    }

    // Dosyayı sil
    await unlink(filePath)

    console.log(`🗑️ ${type} dosyası silindi:`, filePath)

    return NextResponse.json({
      success: true,
      message: 'Dosya başarıyla silindi',
      fileName
    })

  } catch (error) {
    console.error('❌ Delete error:', error)
    return NextResponse.json(
      { error: 'Dosya silinirken hata oluştu' },
      { status: 500 }
    )
  }
}
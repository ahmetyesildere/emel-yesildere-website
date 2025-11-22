import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const fileName = formData.get('fileName') as string
    const type = formData.get('type') as string // 'video' or 'image'

    if (!file) {
      return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 })
    }

    if (!fileName) {
      return NextResponse.json({ error: 'Dosya adı gerekli' }, { status: 400 })
    }

    if (!type || !['video', 'image'].includes(type)) {
      return NextResponse.json({ error: 'Geçersiz dosya türü' }, { status: 400 })
    }

    // Dosya boyutu kontrolü
    const maxSize = type === 'video' ? 200 * 1024 * 1024 : 5 * 1024 * 1024 // 200MB video, 5MB image
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: `Dosya boyutu çok büyük (max: ${maxSize / 1024 / 1024}MB)` 
      }, { status: 400 })
    }

    // Dosya türü kontrolü
    const allowedTypes = {
      video: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/quicktime', 'video/webm'],
      image: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    }

    if (!allowedTypes[type as keyof typeof allowedTypes].includes(file.type)) {
      return NextResponse.json({ 
        error: `Desteklenmeyen dosya türü: ${file.type}` 
      }, { status: 400 })
    }

    // Bytes'ı al
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Hedef klasörü belirle
    const targetDir = type === 'video' ? 'videos' : 'images'
    const publicDir = join(process.cwd(), 'public', 'media', targetDir)

    // Klasör yoksa oluştur
    if (!existsSync(publicDir)) {
      await mkdir(publicDir, { recursive: true })
    }

    // Dosyayı kaydet
    const filePath = join(publicDir, fileName)
    await writeFile(filePath, buffer)

    console.log(`✅ ${type} dosyası kaydedildi:`, filePath)

    return NextResponse.json({
      success: true,
      fileName,
      path: `/media/${targetDir}/${fileName}`,
      size: file.size,
      type: file.type
    })

  } catch (error) {
    console.error('❌ Upload error:', error)
    return NextResponse.json(
      { error: 'Dosya yüklenirken hata oluştu' },
      { status: 500 }
    )
  }
}
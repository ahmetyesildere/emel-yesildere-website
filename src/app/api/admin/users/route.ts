// Admin kullanıcı yönetimi API

import { NextRequest, NextResponse } from 'next/server'
import { adminOperations } from '@/lib/supabase-admin'

// API route'ları için dynamic export
export const dynamic = 'force-dynamic'

// GET - Kullanıcı listesi
export async function GET(request: NextRequest) {
  try {
    // Test parametresi varsa service role'u test et
    const { searchParams } = new URL(request.url)
    if (searchParams.get('test') === 'service-role') {
      const testResult = await adminOperations.testServiceRole()
      return NextResponse.json(testResult)
    }

    const result = await adminOperations.getUsers()

    if (!result.success) {
      return NextResponse.json(
        { error: 'Kullanıcılar alınamadı' },
        { status: 500 }
      )
    }

    return NextResponse.json({ users: result.data })
  } catch (error) {
    console.error('API GET users error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}

// DELETE - Kullanıcı silme
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'Kullanıcı ID gerekli' },
        { status: 400 }
      )
    }

    const result = await adminOperations.deleteUser(userId)

    if (!result.success) {
      console.error('Delete operation failed:', result.error)
      return NextResponse.json(
        {
          error: 'Kullanıcı silinemedi',
          details: result.error?.message || 'Bilinmeyen hata'
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Kullanıcı başarıyla silindi'
    })
  } catch (error) {
    console.error('API DELETE user error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}

// PUT - Kullanıcı güncelleme
export async function PUT(request: NextRequest) {
  try {
    const { userId, updates, specialtyDocuments } = await request.json()

    console.log('🔍 API PUT received:', {
      userId,
      updates: Object.keys(updates),
      specialtyDocuments: specialtyDocuments?.length || 0
    })

    if (!userId || !updates) {
      return NextResponse.json(
        { error: 'Kullanıcı ID ve güncellemeler gerekli' },
        { status: 400 }
      )
    }

    const result = await adminOperations.updateUser(userId, updates)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Kullanıcı güncellenemedi' },
        { status: 500 }
      )
    }

    // Uzmanlık alanları ve belgeleri kaydet
    console.log('🔍 Specialty check:', {
      exists: !!specialtyDocuments,
      length: specialtyDocuments?.length || 0,
      data: specialtyDocuments
    })
    
    if (specialtyDocuments && specialtyDocuments.length > 0) {
      console.log('📄 Saving specialties:', specialtyDocuments)
      try {
        const specialtyResult = await adminOperations.saveUserSpecialties(userId, specialtyDocuments)
        console.log('📋 Specialty result:', specialtyResult)
        if (!specialtyResult.success) {
          console.error('❌ Specialty save error:', specialtyResult.error)
        } else {
          console.log('✅ Specialties saved successfully')
        }
      } catch (specialtyError) {
        console.error('💥 Specialty save exception:', specialtyError)
      }
    } else {
      console.log('⚠️ No specialty documents to save')
    }

    return NextResponse.json({
      message: 'Kullanıcı başarıyla güncellendi',
      user: result.data
    })
  } catch (error) {
    console.error('API PUT user error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}
// Kullanıcı detayları API - GET /api/admin/users/[userId]

import { NextRequest, NextResponse } from 'next/server'
import { adminOperations } from '@/lib/supabase-admin'

// API route'ları için dynamic export
export const dynamic = 'force-dynamic'

// GET - Kullanıcı detayları (specialties ve documents dahil)
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params

    if (!userId) {
      return NextResponse.json(
        { error: 'Kullanıcı ID gerekli' },
        { status: 400 }
      )
    }

    console.log('🔍 Getting user details for:', userId)

    const result = await adminOperations.getUserDetails(userId)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Kullanıcı detayları alınamadı' },
        { status: 500 }
      )
    }

    return NextResponse.json(result.data)
  } catch (error) {
    console.error('API GET user details error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}
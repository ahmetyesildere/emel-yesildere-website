import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { sessionId, reason } = body

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Seans ID gerekli' },
        { status: 400 }
      )
    }

    // 1. Seansı kontrol et
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('*, client_id, consultant_id, session_date, status')
      .eq('id', sessionId)
      .single()

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Seans bulunamadı' },
        { status: 404 }
      )
    }

    // 2. Kullanıcının bu seansı iptal etme yetkisi var mı?
    if (session.client_id !== user.id && session.consultant_id !== user.id) {
      return NextResponse.json(
        { error: 'Bu seansı iptal etme yetkiniz yok' },
        { status: 403 }
      )
    }

    // 3. Seans zaten iptal edilmiş mi?
    if (session.status === 'cancelled') {
      return NextResponse.json(
        { error: 'Bu seans zaten iptal edilmiş' },
        { status: 400 }
      )
    }

    // 4. İptal politikası kontrolü (24 saat kuralı)
    const sessionDate = new Date(session.session_date)
    const now = new Date()
    const hoursUntilSession = (sessionDate.getTime() - now.getTime()) / (1000 * 60 * 60)

    if (hoursUntilSession < 24) {
      return NextResponse.json(
        { 
          error: 'Seansınıza 24 saatten az kaldı. İptal işlemi yapılamaz.',
          canCancel: false,
          hoursRemaining: Math.round(hoursUntilSession)
        },
        { status: 400 }
      )
    }

    // 5. Seansı iptal et
    const { error: updateError } = await supabase
      .from('sessions')
      .update({
        status: 'cancelled',
        cancellation_reason: reason || 'Kullanıcı tarafından iptal edildi',
        cancelled_at: new Date().toISOString(),
        cancelled_by: user.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId)

    if (updateError) {
      console.error('Seans iptal hatası:', updateError)
      return NextResponse.json(
        { error: 'Seans iptal edilirken hata oluştu' },
        { status: 500 }
      )
    }

    // 6. İptal geçmişini kaydet
    await supabase
      .from('session_history')
      .insert({
        session_id: sessionId,
        action_type: 'cancelled',
        action_by: user.id,
        old_session_date: session.session_date,
        reason: reason || 'Kullanıcı tarafından iptal edildi'
      })

    return NextResponse.json({
      success: true,
      message: 'Seans başarıyla iptal edildi',
      refundNote: 'Ücret iadesi yapılmamaktadır'
    })

  } catch (error) {
    console.error('Seans iptal API hatası:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}

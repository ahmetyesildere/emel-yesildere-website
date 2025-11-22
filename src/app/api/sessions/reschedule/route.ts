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
    const { sessionId, newDate, newStartTime, newEndTime, reason } = body

    if (!sessionId || !newDate || !newStartTime) {
      return NextResponse.json(
        { error: 'Eksik bilgi. Seans ID, yeni tarih ve saat gerekli' },
        { status: 400 }
      )
    }

    // 1. Seansı kontrol et
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .single()

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Seans bulunamadı' },
        { status: 404 }
      )
    }

    // 2. Kullanıcının bu seansı erteleme yetkisi var mı?
    if (session.client_id !== user.id && session.consultant_id !== user.id) {
      return NextResponse.json(
        { error: 'Bu seansı erteleme yetkiniz yok' },
        { status: 403 }
      )
    }

    // 3. Seans iptal edilmiş mi?
    if (session.status === 'cancelled') {
      return NextResponse.json(
        { error: 'İptal edilmiş seans ertelenemez' },
        { status: 400 }
      )
    }

    // 4. Erteleme politikası kontrolü (24 saat kuralı)
    const sessionDate = new Date(session.session_date)
    const now = new Date()
    const hoursUntilSession = (sessionDate.getTime() - now.getTime()) / (1000 * 60 * 60)

    if (hoursUntilSession < 24) {
      return NextResponse.json(
        { 
          error: 'Seansınıza 24 saatten az kaldı. Erteleme işlemi yapılamaz.',
          canReschedule: false,
          hoursRemaining: Math.round(hoursUntilSession)
        },
        { status: 400 }
      )
    }

    // 5. Maksimum erteleme sayısı kontrolü (2 kez)
    const rescheduleCount = session.reschedule_count || 0
    if (rescheduleCount >= 2) {
      return NextResponse.json(
        { 
          error: 'Bu seans maksimum erteleme sayısına ulaştı (2 kez)',
          canReschedule: false,
          rescheduleCount
        },
        { status: 400 }
      )
    }

    // 6. Yeni tarih/saat müsait mi kontrol et
    const newSessionDateTime = `${newDate}T${newStartTime}:00`
    
    const { data: conflictingSessions, error: conflictError } = await supabase
      .from('sessions')
      .select('id')
      .eq('consultant_id', session.consultant_id)
      .eq('session_date', newSessionDateTime)
      .in('status', ['pending', 'confirmed'])
      .neq('id', sessionId)

    if (conflictError) {
      console.error('Çakışma kontrolü hatası:', conflictError)
    }

    if (conflictingSessions && conflictingSessions.length > 0) {
      return NextResponse.json(
        { error: 'Seçtiğiniz tarih ve saat müsait değil' },
        { status: 400 }
      )
    }

    // 7. Seansı ertele
    const updateData: any = {
      session_date: newSessionDateTime,
      start_time: newStartTime,
      reschedule_count: rescheduleCount + 1,
      reschedule_reason: reason || 'Kullanıcı tarafından ertelendi',
      rescheduled_at: new Date().toISOString(),
      rescheduled_by: user.id,
      updated_at: new Date().toISOString()
    }

    // İlk erteleme ise orijinal tarihi kaydet
    if (rescheduleCount === 0) {
      updateData.original_session_date = session.session_date
    }

    if (newEndTime) {
      updateData.end_time = newEndTime
    }

    const { error: updateError } = await supabase
      .from('sessions')
      .update(updateData)
      .eq('id', sessionId)

    if (updateError) {
      console.error('Seans erteleme hatası:', updateError)
      return NextResponse.json(
        { error: 'Seans ertelenirken hata oluştu' },
        { status: 500 }
      )
    }

    // 8. Erteleme geçmişini kaydet
    await supabase
      .from('session_history')
      .insert({
        session_id: sessionId,
        action_type: 'rescheduled',
        action_by: user.id,
        old_session_date: session.session_date,
        new_session_date: newSessionDateTime,
        reason: reason || 'Kullanıcı tarafından ertelendi'
      })

    return NextResponse.json({
      success: true,
      message: 'Seansınız başarıyla ertelendi. Ücret iadesi yapılmayacaktır.',
      newDate: newSessionDateTime,
      remainingReschedules: 2 - (rescheduleCount + 1),
      refundNote: 'Seansınız iptal edilmemektedir. Ücret iadesi yapılmayacaktır.'
    })

  } catch (error) {
    console.error('Seans erteleme API hatası:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}

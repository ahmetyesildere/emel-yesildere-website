// Document kaydetme API - sadece consultant_documents tablosu için

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// API route'ları için dynamic export
export const dynamic = 'force-dynamic'

// Environment variables kontrolü
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Sadece environment variables varsa client oluştur
const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null

// POST - Document kaydetme
export async function POST(request: NextRequest) {
  try {
    // Environment variables kontrolü
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase configuration missing' },
        { status: 500 }
      )
    }

    const { documentData } = await request.json()

    console.log('📝 Document kaydetme API:', documentData)
    console.log('🔑 Anon key available:', !!supabaseKey)
    console.log('🔗 Supabase URL:', supabaseUrl)

    if (!documentData) {
      return NextResponse.json(
        { error: 'Document data gerekli' },
        { status: 400 }
      )
    }

    const { data: insertedDoc, error: docError } = await supabase
      .from('consultant_documents')
      .insert(documentData)
      .select()

    if (docError) {
      console.error('❌ Document insert error:', docError)
      return NextResponse.json(
        { error: 'Document kaydedilemedi: ' + docError.message },
        { status: 500 }
      )
    }

    console.log('✅ Document kaydedildi:', insertedDoc)

    return NextResponse.json({
      message: 'Document başarıyla kaydedildi',
      document: insertedDoc
    })
  } catch (error) {
    console.error('API document error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}
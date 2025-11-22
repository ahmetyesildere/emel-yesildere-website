// Service role key test API

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// API route'ları için dynamic export
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    console.log('🧪 Testing service role key...')
    
    // Auth admin API'sini test et
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (authError) {
      console.error('❌ Auth admin test failed:', authError)
      return NextResponse.json({
        success: false,
        error: 'Auth admin API failed',
        details: authError.message
      })
    }

    console.log('✅ Auth admin API working, users count:', authUsers.users.length)

    // Profiles tablosunu test et
    const { data: profiles, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('count(*)')
      .single()

    if (profileError) {
      console.error('❌ Profiles test failed:', profileError)
      return NextResponse.json({
        success: false,
        error: 'Profiles access failed',
        details: profileError.message
      })
    }

    return NextResponse.json({
      success: true,
      authUsersCount: authUsers.users.length,
      profilesCount: profiles.count,
      message: 'Service role key working correctly'
    })

  } catch (error: any) {
    console.error('💥 Test API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      details: error.message
    })
  }
}
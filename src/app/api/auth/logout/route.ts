import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📡 Logout beacon received:', body)
    
    // Burada gerekirse server-side logout işlemleri yapılabilir
    // Örneğin: session invalidation, logging, analytics vb.
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout beacon error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
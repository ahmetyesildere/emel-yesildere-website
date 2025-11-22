import { NextRequest, NextResponse } from 'next/server'
import { createDailyRoom, createMeetingToken } from '@/lib/daily-co'

// API route'ları için dynamic export
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const results = {
      envCheck: { status: 'pending', message: '' },
      roomCreation: { status: 'pending', message: '' },
      tokenCreation: { status: 'pending', message: '' }
    }

    // 1. Environment Variables Test
    const apiKey = process.env.DAILY_API_KEY
    if (apiKey && apiKey !== 'your_daily_api_key_here') {
      results.envCheck = { 
        status: 'success', 
        message: `API Key bulundu: ${apiKey.substring(0, 10)}...` 
      }
    } else {
      results.envCheck = { 
        status: 'error', 
        message: 'Daily.co API Key bulunamadı veya placeholder değer' 
      }
      return NextResponse.json(results)
    }

    // 2. Room Creation Test
    try {
      const room = await createDailyRoom('test-room-' + Date.now())
      results.roomCreation = { 
        status: 'success', 
        message: `Oda oluşturuldu: ${room.name}` 
      }

      // 3. Token Creation Test
      try {
        const token = await createMeetingToken(room.name, 'Test User', true)
        results.tokenCreation = { 
          status: 'success', 
          message: `Token oluşturuldu: ${token.token.substring(0, 20)}...` 
        }
      } catch (error) {
        results.tokenCreation = { 
          status: 'error', 
          message: `Token hatası: ${error}` 
        }
      }

    } catch (error) {
      results.roomCreation = { 
        status: 'error', 
        message: `Oda hatası: ${error}` 
      }
    }

    return NextResponse.json(results)

  } catch (error) {
    console.error('Daily.co test hatası:', error)
    return NextResponse.json(
      { error: 'Test sırasında hata oluştu' },
      { status: 500 }
    )
  }
}
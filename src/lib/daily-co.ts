// Daily.co API utility functions
// Bu dosya Daily.co API entegrasyonu için gerekli fonksiyonları içerir

const DAILY_API_KEY = process.env.DAILY_API_KEY
const DAILY_API_URL = 'https://api.daily.co/v1'

export interface DailyRoom {
  name: string
  url: string
  created_at: string
  config?: {
    max_participants?: number
    enable_chat?: boolean
    enable_screenshare?: boolean
    enable_recording?: boolean
    start_video_off?: boolean
    start_audio_off?: boolean
  }
}

export interface DailyMeetingToken {
  token: string
  room_name: string
  user_name?: string
  is_owner?: boolean
  exp?: number
}

// Daily.co oda oluşturma
export const createDailyRoom = async (sessionId: string, config?: any): Promise<DailyRoom> => {
  try {
    console.log('🏠 Daily.co odası oluşturuluyor:', sessionId)

    if (!DAILY_API_KEY) {
      console.warn('⚠️ Daily.co API key bulunamadı, mock data kullanılıyor')
      return {
        name: `session-${sessionId}`,
        url: `https://emelyesildere.daily.co/session-${sessionId}`,
        created_at: new Date().toISOString(),
        config: {
          max_participants: 2,
          enable_chat: true,
          enable_screenshare: true,
          enable_recording: false,
          start_video_off: false,
          start_audio_off: false
        }
      }
    }

    const roomData = {
      name: `session-${sessionId}`,
      privacy: 'private',
      properties: {
        max_participants: 2,
        enable_chat: true,
        enable_screenshare: true,
        enable_recording: config?.enable_recording || false,
        start_video_off: false,
        start_audio_off: false,
        enable_knocking: true,
        enable_prejoin_ui: true,
        ...config
      }
    }

    const response = await fetch(`${DAILY_API_URL}/rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DAILY_API_KEY}`
      },
      body: JSON.stringify(roomData)
    })

    if (!response.ok) {
      throw new Error(`Daily.co API error: ${response.status}`)
    }

    const room = await response.json()
    console.log('✅ Daily.co odası oluşturuldu:', room.name)

    return {
      name: room.name,
      url: room.url,
      created_at: room.created_at,
      config: room.config
    }

  } catch (error) {
    console.error('💥 Daily.co oda oluşturma hatası:', error)
    
    // Fallback: Mock room data
    return {
      name: `session-${sessionId}`,
      url: `https://emelyesildere.daily.co/session-${sessionId}`,
      created_at: new Date().toISOString(),
      config: {
        max_participants: 2,
        enable_chat: true,
        enable_screenshare: true,
        enable_recording: false
      }
    }
  }
}

// Meeting token oluşturma
export const createMeetingToken = async (
  roomName: string, 
  userName: string, 
  isOwner: boolean = false,
  expiresInMinutes: number = 120
): Promise<DailyMeetingToken> => {
  try {
    console.log('🎫 Meeting token oluşturuluyor:', { roomName, userName, isOwner })

    if (!DAILY_API_KEY) {
      console.warn('⚠️ Daily.co API key bulunamadı, mock token kullanılıyor')
      return {
        token: `mock-token-${Date.now()}`,
        room_name: roomName,
        user_name: userName,
        is_owner: isOwner,
        exp: Math.floor(Date.now() / 1000) + (expiresInMinutes * 60)
      }
    }

    const tokenData = {
      properties: {
        room_name: roomName,
        user_name: userName,
        is_owner: isOwner,
        exp: Math.floor(Date.now() / 1000) + (expiresInMinutes * 60),
        enable_screenshare: true,
        enable_recording: isOwner,
        start_video_off: false,
        start_audio_off: false
      }
    }

    const response = await fetch(`${DAILY_API_URL}/meeting-tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DAILY_API_KEY}`
      },
      body: JSON.stringify(tokenData)
    })

    if (!response.ok) {
      throw new Error(`Daily.co token API error: ${response.status}`)
    }

    const tokenResponse = await response.json()
    console.log('✅ Meeting token oluşturuldu')

    return {
      token: tokenResponse.token,
      room_name: roomName,
      user_name: userName,
      is_owner: isOwner,
      exp: tokenData.properties.exp
    }

  } catch (error) {
    console.error('💥 Meeting token oluşturma hatası:', error)
    
    // Fallback: Mock token
    return {
      token: `mock-token-${Date.now()}`,
      room_name: roomName,
      user_name: userName,
      is_owner: isOwner,
      exp: Math.floor(Date.now() / 1000) + (expiresInMinutes * 60)
    }
  }
}

// Daily.co oda silme
export const deleteDailyRoom = async (roomName: string): Promise<boolean> => {
  try {
    console.log('🗑️ Daily.co odası siliniyor:', roomName)

    if (!DAILY_API_KEY) {
      console.warn('⚠️ Daily.co API key bulunamadı, mock silme işlemi')
      return true
    }

    const response = await fetch(`${DAILY_API_URL}/rooms/${roomName}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${DAILY_API_KEY}`
      }
    })

    if (!response.ok) {
      throw new Error(`Daily.co delete API error: ${response.status}`)
    }

    console.log('✅ Daily.co odası silindi:', roomName)
    return true

  } catch (error) {
    console.error('💥 Daily.co oda silme hatası:', error)
    return false
  }
}

// Oda bilgilerini getirme
export const getDailyRoom = async (roomName: string): Promise<DailyRoom | null> => {
  try {
    if (!DAILY_API_KEY) {
      return null
    }

    const response = await fetch(`${DAILY_API_URL}/rooms/${roomName}`, {
      headers: {
        'Authorization': `Bearer ${DAILY_API_KEY}`
      }
    })

    if (!response.ok) {
      return null
    }

    const room = await response.json()
    return {
      name: room.name,
      url: room.url,
      created_at: room.created_at,
      config: room.config
    }

  } catch (error) {
    console.error('💥 Daily.co oda bilgisi alma hatası:', error)
    return null
  }
}

// Utility: Seans için oda adı oluşturma
export const generateRoomName = (sessionId: string): string => {
  return `session-${sessionId}`
}

// Utility: Token'ın geçerli olup olmadığını kontrol etme
export const isTokenValid = (token: DailyMeetingToken): boolean => {
  const now = Math.floor(Date.now() / 1000)
  return token.exp ? token.exp > now : false
}
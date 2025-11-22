'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export const MessagesDebug: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [testMessage, setTestMessage] = useState('')

  const checkTable = async () => {
    setLoading(true)
    setError(null)
    
    try {
      console.log('🔍 Messages tablosunu kontrol ediliyor...')
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .limit(5)

      if (error) {
        setError(`Tablo erişim hatası: ${error.message}`)
        console.error('💥 Tablo hatası:', error)
        return
      }

      setMessages(data || [])
      console.log('✅ Tablo erişimi başarılı:', data?.length || 0, 'mesaj')
      
    } catch (err) {
      setError(`Genel hata: ${err}`)
      console.error('💥 Genel hata:', err)
    } finally {
      setLoading(false)
    }
  }

  const sendTestMessage = async () => {
    if (!testMessage.trim()) return
    
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          sender_id: 'debug-user',
          receiver_id: 'test-user',
          subject: 'Debug Test Mesajı',
          content: testMessage.trim()
        }])
        .select()

      if (error) {
        setError(`Mesaj gönderme hatası: ${error.message}`)
        return
      }

      console.log('✅ Test mesajı gönderildi:', data)
      setTestMessage('')
      checkTable() // Listeyi yenile
      
    } catch (err) {
      setError(`Mesaj gönderme genel hatası: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkTable()
  }, [])

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Messages Tablo Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={checkTable} disabled={loading}>
            {loading ? 'Kontrol Ediliyor...' : 'Tabloyu Kontrol Et'}
          </Button>
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-300 rounded text-red-700">
            <strong>Hata:</strong> {error}
          </div>
        )}

        <div className="space-y-2">
          <h3 className="font-semibold">Test Mesajı Gönder:</h3>
          <div className="flex gap-2">
            <Input
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              placeholder="Test mesajı yazın..."
              onKeyPress={(e) => e.key === 'Enter' && sendTestMessage()}
            />
            <Button onClick={sendTestMessage} disabled={loading || !testMessage.trim()}>
              Gönder
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Son Mesajlar ({messages.length}):</h3>
          <div className="max-h-60 overflow-y-auto space-y-2">
            {messages.map((msg, index) => (
              <div key={msg.id || index} className="p-2 bg-gray-50 rounded text-sm">
                <div><strong>ID:</strong> {msg.id}</div>
                <div><strong>Gönderen:</strong> {msg.sender_id}</div>
                <div><strong>Konu:</strong> {msg.subject}</div>
                <div><strong>İçerik:</strong> {msg.content}</div>
                <div><strong>Tarih:</strong> {new Date(msg.created_at).toLocaleString('tr-TR')}</div>
              </div>
            ))}
            {messages.length === 0 && !loading && (
              <div className="text-gray-500 text-center py-4">
                Henüz mesaj yok
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
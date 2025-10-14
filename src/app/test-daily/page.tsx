'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'


const TestDailyPage = () => {
  const [tests, setTests] = useState({
    envCheck: { status: 'pending', message: '' },
    roomCreation: { status: 'pending', message: '' },
    tokenCreation: { status: 'pending', message: '' }
  })

  useEffect(() => {
    runTests()
  }, [])

  const runTests = async () => {
    try {
      setTests({
        envCheck: { status: 'pending', message: 'Test ediliyor...' },
        roomCreation: { status: 'pending', message: 'Test ediliyor...' },
        tokenCreation: { status: 'pending', message: 'Test ediliyor...' }
      })

      const response = await fetch('/api/test-daily')
      const results = await response.json()

      if (response.ok) {
        setTests(results)
      } else {
        setTests({
          envCheck: { status: 'error', message: 'API test hatası' },
          roomCreation: { status: 'error', message: 'API test hatası' },
          tokenCreation: { status: 'error', message: 'API test hatası' }
        })
      }
    } catch (error) {
      console.error('Test hatası:', error)
      setTests({
        envCheck: { status: 'error', message: 'Test çalıştırılamadı' },
        roomCreation: { status: 'error', message: 'Test çalıştırılamadı' },
        tokenCreation: { status: 'error', message: 'Test çalıştırılamadı' }
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Başarılı</Badge>
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Hata</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Test Ediliyor</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Bilinmiyor</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Daily.co Entegrasyon Testi</h1>
          <p className="text-gray-600">Daily.co API'sinin doğru çalışıp çalışmadığını test ediyoruz</p>
        </div>

        <div className="grid gap-6">
          {/* Environment Variables Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(tests.envCheck.status)}
                  <span>Environment Variables</span>
                </div>
                {getStatusBadge(tests.envCheck.status)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{tests.envCheck.message}</p>
            </CardContent>
          </Card>

          {/* Room Creation Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(tests.roomCreation.status)}
                  <span>Oda Oluşturma</span>
                </div>
                {getStatusBadge(tests.roomCreation.status)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{tests.roomCreation.message}</p>
            </CardContent>
          </Card>

          {/* Token Creation Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(tests.tokenCreation.status)}
                  <span>Token Oluşturma</span>
                </div>
                {getStatusBadge(tests.tokenCreation.status)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{tests.tokenCreation.message}</p>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>İşlemler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={runTests} className="w-full">
                Testleri Yeniden Çalıştır
              </Button>
              
              <div className="text-sm text-gray-600 space-y-2">
                <p><strong>Sonraki Adımlar:</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Supabase Dashboard'da <code>test-daily-integration.sql</code> dosyasını çalıştır</li>
                  <li>Bir seans oluştur ve video call'u test et</li>
                  <li>Hem danışman hem de danışan olarak test yap</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default TestDailyPage
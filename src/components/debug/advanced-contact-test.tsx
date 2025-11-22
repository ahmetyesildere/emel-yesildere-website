'use client'

import React, { useState } from 'react'
import { useContactInfo } from '@/hooks/use-contact-info'
import { getCookie, setCookie } from '@/lib/cookies'

const AdvancedContactTest = () => {
  const { contactInfo, updateContactInfo, isLoading } = useContactInfo()
  const [testResults, setTestResults] = useState<string[]>([])

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testLocalStorage = () => {
    try {
      const testKey = 'test_storage'
      const testValue = 'test_value_' + Date.now()
      
      localStorage.setItem(testKey, testValue)
      const retrieved = localStorage.getItem(testKey)
      localStorage.removeItem(testKey)
      
      if (retrieved === testValue) {
        addResult('✅ localStorage çalışıyor')
        return true
      } else {
        addResult('❌ localStorage okuma hatası')
        return false
      }
    } catch (error) {
      addResult('❌ localStorage hatası: ' + error)
      return false
    }
  }

  const testCookies = () => {
    try {
      const testKey = 'test_cookie'
      const testValue = 'test_value_' + Date.now()
      
      setCookie(testKey, testValue)
      const retrieved = getCookie(testKey)
      
      if (retrieved === testValue) {
        addResult('✅ Cookies çalışıyor')
        return true
      } else {
        addResult('❌ Cookies okuma hatası')
        return false
      }
    } catch (error) {
      addResult('❌ Cookies hatası: ' + error)
      return false
    }
  }

  const runFullTest = () => {
    setTestResults([])
    addResult('🚀 Test başlatılıyor...')
    
    // 1. Storage testleri
    const localStorageWorks = testLocalStorage()
    const cookiesWork = testCookies()
    
    // 2. Mevcut veri kontrolü
    const currentLocalStorage = localStorage.getItem('contact_info')
    const currentCookie = getCookie('contact_info_cookie')
    
    addResult(`📋 localStorage veri: ${currentLocalStorage ? 'VAR' : 'YOK'}`)
    addResult(`🍪 Cookie veri: ${currentCookie ? 'VAR' : 'YOK'}`)
    
    // 3. Test güncelleme
    const testPhone = '+90 555 TEST ' + Math.floor(Math.random() * 1000)
    addResult(`📞 Test telefonu: ${testPhone}`)
    
    const updateSuccess = updateContactInfo({ phone: testPhone })
    addResult(`💾 Güncelleme sonucu: ${updateSuccess ? 'BAŞARILI' : 'BAŞARISIZ'}`)
    
    // 4. Kayıt kontrolü
    setTimeout(() => {
      const newLocalStorage = localStorage.getItem('contact_info')
      const newCookie = getCookie('contact_info_cookie')
      
      addResult(`📋 Yeni localStorage: ${newLocalStorage ? 'VAR' : 'YOK'}`)
      addResult(`🍪 Yeni Cookie: ${newCookie ? 'VAR' : 'YOK'}`)
      
      if (newLocalStorage) {
        try {
          const parsed = JSON.parse(newLocalStorage)
          addResult(`📞 localStorage telefon: ${parsed.phone}`)
        } catch (e) {
          addResult('❌ localStorage parse hatası')
        }
      }
      
      if (newCookie) {
        try {
          const parsed = JSON.parse(newCookie)
          addResult(`📞 Cookie telefon: ${parsed.phone}`)
        } catch (e) {
          addResult('❌ Cookie parse hatası')
        }
      }
    }, 1000)
  }

  const clearAllData = () => {
    try {
      localStorage.removeItem('contact_info')
      setCookie('contact_info_cookie', '', -1) // Expire cookie
      addResult('🗑️ Tüm veriler temizlendi')
      setTimeout(() => window.location.reload(), 1000)
    } catch (error) {
      addResult('❌ Temizleme hatası: ' + error)
    }
  }

  const forceReload = () => {
    window.location.reload()
  }

  if (isLoading) {
    return <div className="p-4 bg-yellow-100 rounded">Yükleniyor...</div>
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Gelişmiş İletişim Testi</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mevcut Bilgiler */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Mevcut Bilgiler</h3>
          <div className="p-4 bg-gray-50 rounded">
            <p><strong>Telefon:</strong> {contactInfo.phone}</p>
            <p><strong>E-posta:</strong> {contactInfo.email}</p>
            <p><strong>WhatsApp:</strong> {contactInfo.whatsapp}</p>
          </div>

          <div className="space-y-2">
            <button
              onClick={runFullTest}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              🔍 Tam Test Çalıştır
            </button>
            
            <button
              onClick={clearAllData}
              className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              🗑️ Tüm Verileri Temizle
            </button>
            
            <button
              onClick={forceReload}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              🔄 Sayfayı Yenile
            </button>
          </div>
        </div>

        {/* Test Sonuçları */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Test Sonuçları</h3>
          <div className="p-4 bg-gray-900 text-green-400 rounded font-mono text-sm h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <p>Test sonuçları burada görünecek...</p>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="mb-1">{result}</div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Manuel Kontroller */}
      <div className="mt-6 p-4 bg-blue-50 rounded">
        <h4 className="font-semibold mb-2">Manuel Kontroller:</h4>
        <div className="text-sm space-y-1">
          <p><strong>localStorage:</strong> {localStorage.getItem('contact_info') ? '✅ VAR' : '❌ YOK'}</p>
          <p><strong>Cookie:</strong> {getCookie('contact_info_cookie') ? '✅ VAR' : '❌ YOK'}</p>
          <p><strong>Browser:</strong> {typeof Storage !== 'undefined' ? '✅ Destekliyor' : '❌ Desteklemiyor'}</p>
        </div>
      </div>
    </div>
  )
}

export default AdvancedContactTest
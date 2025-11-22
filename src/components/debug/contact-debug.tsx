'use client'

import React, { useState, useEffect } from 'react'
import { useContactInfo } from '@/hooks/use-contact-info'

const ContactDebug = () => {
  const { contactInfo, updateContactInfo, isLoading } = useContactInfo()
  const [localStorageData, setLocalStorageData] = useState<string>('')
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    // localStorage'daki veriyi kontrol et
    const checkLocalStorage = () => {
      try {
        const data = localStorage.getItem('contact_info')
        setLocalStorageData(data || 'Veri bulunamadı')
        
        if (data) {
          const parsed = JSON.parse(data)
          setDebugInfo(parsed)
        }
      } catch (error) {
        setLocalStorageData('Parse hatası: ' + error)
      }
    }

    checkLocalStorage()
    
    // Her 2 saniyede bir kontrol et
    const interval = setInterval(checkLocalStorage, 2000)
    
    return () => clearInterval(interval)
  }, [])

  const clearLocalStorage = () => {
    localStorage.removeItem('contact_info')
    setLocalStorageData('Temizlendi')
    setDebugInfo({})
  }

  const testUpdate = () => {
    const testData = {
      phone: '+90 555 999 8877',
      email: 'test@test.com',
      whatsapp: '+90 555 999 8877',
      address: 'Test Adres',
      mapUrl: 'https://test.com',
      workingHours: {
        weekdays: '09:00 - 18:00',
        saturday: '10:00 - 16:00',
        sunday: 'Kapalı'
      }
    }
    
    updateContactInfo(testData)
  }

  if (isLoading) {
    return <div>Yükleniyor...</div>
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">İletişim Bilgileri Debug</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hook'tan gelen veri */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Hook'tan Gelen Veri:</h3>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(contactInfo, null, 2)}
          </pre>
        </div>

        {/* localStorage'daki veri */}
        <div>
          <h3 className="text-lg font-semibold mb-3">localStorage'daki Veri:</h3>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {localStorageData}
          </pre>
        </div>
      </div>

      {/* Debug bilgileri */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Debug Bilgileri:</h3>
        <div className="bg-yellow-50 p-4 rounded">
          <p><strong>localStorage Key:</strong> contact_info</p>
          <p><strong>Veri Var mı:</strong> {localStorage.getItem('contact_info') ? 'Evet' : 'Hayır'}</p>
          <p><strong>Son Güncelleme:</strong> {debugInfo._lastUpdate ? new Date(debugInfo._lastUpdate).toLocaleString() : 'Bilinmiyor'}</p>
          <p><strong>Hook Loading:</strong> {isLoading ? 'Evet' : 'Hayır'}</p>
        </div>
      </div>

      {/* Test butonları */}
      <div className="mt-6 space-x-4">
        <button
          onClick={testUpdate}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Test Güncelleme
        </button>
        
        <button
          onClick={clearLocalStorage}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          localStorage Temizle
        </button>
        
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Sayfayı Yenile
        </button>
      </div>
    </div>
  )
}

export default ContactDebug
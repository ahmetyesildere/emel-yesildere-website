'use client'

import React from 'react'
import { useContactInfo } from '@/hooks/use-contact-info'

const SimpleContactTest = () => {
  const { contactInfo, updateContactInfo, isLoading } = useContactInfo()

  const handleTestUpdate = () => {
    const testData = {
      phone: '+90 555 999 8877',
      email: 'test@example.com'
    }
    
    const success = updateContactInfo(testData)
    if (success) {
      alert('Test güncelleme başarılı! Sayfayı yenileyin ve kontrol edin.')
    } else {
      alert('Test güncelleme başarısız!')
    }
  }

  const handleReset = () => {
    const defaultData = {
      phone: '+90 555 123 4567',
      email: 'emel@emelyesildere.com',
      whatsapp: '+90 555 123 4567',
      address: 'Günaydın mah. Terziler cad. No:74 Kat 3 Daire 5 Bandırma-Balıkesir',
      mapUrl: 'https://maps.google.com/maps?q=Günaydın+Mahallesi+Terziler+Caddesi+No:74+Bandırma+Balıkesir&t=&z=16&ie=UTF8&iwloc=&output=embed',
      workingHours: {
        weekdays: '09:00 - 18:00',
        saturday: '10:00 - 16:00',
        sunday: 'Kapalı'
      }
    }
    
    const success = updateContactInfo(defaultData)
    if (success) {
      alert('Default değerlere sıfırlandı!')
    }
  }

  const checkLocalStorage = () => {
    const data = localStorage.getItem('contact_info')
    console.log('localStorage contact_info:', data)
    alert('Konsolu kontrol edin')
  }

  if (isLoading) {
    return <div className="p-4 bg-yellow-100 rounded">Yükleniyor...</div>
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Basit İletişim Testi</h2>
      
      <div className="mb-6 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">Mevcut Bilgiler:</h3>
        <p><strong>Telefon:</strong> {contactInfo.phone}</p>
        <p><strong>E-posta:</strong> {contactInfo.email}</p>
        <p><strong>WhatsApp:</strong> {contactInfo.whatsapp}</p>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleTestUpdate}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Test Güncelleme (Telefon: +90 555 999 8877)
        </button>
        
        <button
          onClick={handleReset}
          className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Default Değerlere Sıfırla
        </button>
        
        <button
          onClick={checkLocalStorage}
          className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          localStorage Kontrol Et
        </button>
        
        <button
          onClick={() => window.location.reload()}
          className="w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
        >
          Sayfayı Yenile (Kalıcılık Testi)
        </button>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded text-sm">
        <h4 className="font-semibold mb-2">Test Adımları:</h4>
        <ol className="list-decimal ml-4 space-y-1">
          <li>"Test Güncelleme" butonuna tıklayın</li>
          <li>Telefon numarasının değiştiğini kontrol edin</li>
          <li>"Sayfayı Yenile" butonuna tıklayın</li>
          <li>Sayfa yenilendikten sonra telefon numarasının korunduğunu kontrol edin</li>
          <li>Header ve footer'da da güncellenmiş numarayı görmelisiniz</li>
        </ol>
      </div>
    </div>
  )
}

export default SimpleContactTest
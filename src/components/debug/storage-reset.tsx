'use client'

import React from 'react'

const StorageReset = () => {
  const resetStorage = () => {
    // Tüm contact bilgilerini temizle
    localStorage.removeItem('contact_info')
    
    // Default değerleri yeniden kaydet
    const defaultContactInfo = {
      phone: '+90 555 123 4567',
      email: 'emel@emelyesildere.com',
      whatsapp: '+90 555 123 4567',
      address: 'Günaydın mah. Terziler cad. No:74 Kat 3 Daire 5 Bandırma-Balıkesir',
      mapUrl: 'https://maps.google.com/maps?q=Günaydın+Mahallesi+Terziler+Caddesi+No:74+Bandırma+Balıkesir&t=&z=16&ie=UTF8&iwloc=&output=embed',
      workingHours: {
        weekdays: '09:00 - 18:00',
        saturday: '10:00 - 16:00',
        sunday: 'Kapalı'
      },
      _lastUpdate: Date.now()
    }
    
    localStorage.setItem('contact_info', JSON.stringify(defaultContactInfo))
    
    alert('localStorage temizlendi ve default değerler yüklendi!')
    window.location.reload()
  }

  const checkStorage = () => {
    const data = localStorage.getItem('contact_info')
    console.log('localStorage contact_info:', data)
    alert('Konsolu kontrol edin')
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Storage Reset Tool</h2>
      <div className="space-y-4">
        <button
          onClick={resetStorage}
          className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          localStorage'ı Sıfırla
        </button>
        
        <button
          onClick={checkStorage}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Storage'ı Kontrol Et
        </button>
      </div>
    </div>
  )
}

export default StorageReset
'use client'

import React from 'react'
import { useContactInfo } from '@/hooks/use-contact-info'

export default function TestContactPage() {
  const { contactInfo, isLoading, updateContactInfo } = useContactInfo()

  const handleUpdate = () => {
    const newData = {
      phone: '+90 555 999 8877',
      email: 'updated@test.com'
    }
    updateContactInfo(newData)
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
    updateContactInfo(defaultData)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">İletişim bilgileri yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8">İletişim Bilgileri Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mevcut Bilgiler */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Mevcut İletişim Bilgileri</h2>
            <div className="space-y-3">
              <div>
                <strong>Telefon:</strong> {contactInfo.phone}
              </div>
              <div>
                <strong>E-posta:</strong> {contactInfo.email}
              </div>
              <div>
                <strong>WhatsApp:</strong> {contactInfo.whatsapp}
              </div>
              <div>
                <strong>Adres:</strong> {contactInfo.address}
              </div>
              <div>
                <strong>Çalışma Saatleri:</strong>
                <ul className="ml-4 mt-1">
                  <li>Hafta içi: {contactInfo.workingHours.weekdays}</li>
                  <li>Cumartesi: {contactInfo.workingHours.saturday}</li>
                  <li>Pazar: {contactInfo.workingHours.sunday}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Test Butonları */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Test İşlemleri</h2>
            <div className="space-y-4">
              <button
                onClick={handleUpdate}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Test Güncelleme
              </button>
              
              <button
                onClick={handleReset}
                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Default Değerlere Sıfırla
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Sayfayı Yenile (Test)
              </button>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded">
              <h3 className="font-semibold text-yellow-800 mb-2">Test Adımları:</h3>
              <ol className="text-sm text-yellow-700 space-y-1">
                <li>1. "Test Güncelleme" butonuna tıklayın</li>
                <li>2. Bilgilerin değiştiğini kontrol edin</li>
                <li>3. "Sayfayı Yenile" butonuna tıklayın</li>
                <li>4. Bilgilerin korunduğunu kontrol edin</li>
                <li>5. Başka bir sayfaya gidin ve geri dönün</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Debug Bilgileri */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Debug Bilgileri</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(contactInfo, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
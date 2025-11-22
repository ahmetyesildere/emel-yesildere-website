'use client'

import React, { useState } from 'react'
import { RandevuWidget } from '@/components/sessions/randevu-widget'

export default function TestSessionBookingPage() {
  const [showWidget, setShowWidget] = useState(false)

  const mockConsultant = {
    first_name: 'Emel',
    last_name: 'Yeşildere',
    avatar_url: undefined
  }

  const mockSessionType = {
    name: 'Yaşam Koçluğu Seansı',
    price: 500,
    duration_minutes: 90
  }

  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const selectedDate = tomorrow.toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Seans Rezervasyon Testi
            </h1>
            <p className="text-gray-600 mb-6">
              Yeni seans türü seçimi özelliğini test edin
            </p>
            
            {!showWidget ? (
              <button
                onClick={() => setShowWidget(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Rezervasyon Widget'ını Aç
              </button>
            ) : (
              <button
                onClick={() => setShowWidget(false)}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 mb-6"
              >
                Widget'ı Kapat
              </button>
            )}
          </div>

          {showWidget && (
            <RandevuWidget
              consultantId="test-consultant-id"
              consultant={mockConsultant}
              sessionTypeId="test-session-type-id"
              sessionType={mockSessionType}
              selectedDate={selectedDate}
              onConfirm={(booking) => {
                console.log('Rezervasyon onaylandı:', booking)
                alert('Test rezervasyonu oluşturuldu! Konsolu kontrol edin.')
              }}
              onCancel={() => {
                console.log('Rezervasyon iptal edildi')
                setShowWidget(false)
              }}
            />
          )}

          {/* Özellik Açıklaması */}
          <div className="mt-12 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Yeni Özellikler</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Seans Türü Seçimi</h3>
                  <p className="text-gray-600">Danışanlar artık online veya yüz yüze seans tercihi yapabilir</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Adım Adım Süreç</h3>
                  <p className="text-gray-600">Önce seans türü, sonra saat seçimi ile daha organize rezervasyon</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Admin Panel Entegrasyonu</h3>
                  <p className="text-gray-600">Seans türü bilgisi admin panelinde ve danışman sayfasında görüntülenir</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">4</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Fiyat Farklılaştırması</h3>
                  <p className="text-gray-600">Gelecekte online/yüz yüze seanslar için farklı fiyatlar belirlenebilir</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
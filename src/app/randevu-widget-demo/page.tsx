'use client'

import React, { useState } from 'react'
import { RandevuWidget } from '@/components/sessions/randevu-widget'

const RandevuWidgetDemoPage = () => {
  const [completedBooking, setCompletedBooking] = useState<any>(null)

  // Demo veriler
  const demoConsultant = {
    id: 'b6f317be-d6f0-430a-9da4-42bb0026219b',
    first_name: 'Emel',
    last_name: 'Yeşildere',
    avatar_url: undefined
  }

  const demoSessionType = {
    id: '1',
    name: 'Duygu Temizliği Seansı',
    price: 500,
    duration_minutes: 60
  }

  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const selectedDate = tomorrow.toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Randevu Widget Demo
            </h1>
            <p className="text-gray-600">
              Yeni randevu widget'ı ile hızlı rezervasyon sistemi
            </p>
          </div>

          {/* Widget */}
          {!completedBooking ? (
            <RandevuWidget
              consultantId={demoConsultant.id}
              consultant={demoConsultant}
              sessionTypeId={demoSessionType.id}
              sessionType={demoSessionType}
              selectedDate={selectedDate}
              onConfirm={(booking) => {
                console.log('✅ Demo rezervasyon tamamlandı:', booking)
                setCompletedBooking(booking)
              }}
              onCancel={() => {
                console.log('❌ Demo rezervasyon iptal edildi')
              }}
            />
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Rezervasyon Tamamlandı!
              </h2>
              <p className="text-gray-600 mb-6">
                Randevunuz başarıyla oluşturuldu.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold mb-2">Rezervasyon Detayları:</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Danışman:</strong> {completedBooking.consultant.first_name} {completedBooking.consultant.last_name}</p>
                  <p><strong>Seans:</strong> {completedBooking.sessionType.name}</p>
                  <p><strong>Tarih:</strong> {completedBooking.date}</p>
                  <p><strong>Saat:</strong> {completedBooking.startTime} - {completedBooking.endTime}</p>
                  <p><strong>Ücret:</strong> ₺{completedBooking.price}</p>
                </div>
              </div>

              <button
                onClick={() => setCompletedBooking(null)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Yeni Rezervasyon Yap
              </button>
            </div>
          )}

          {/* Özellikler */}
          <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-semibold mb-6 text-center">Widget Özellikleri</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">⚡</span>
                </div>
                <h4 className="font-medium mb-2">Hızlı Rezervasyon</h4>
                <p className="text-sm text-gray-600">
                  Tek sayfada tüm işlemler, hızlı ve kolay rezervasyon
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🔒</span>
                </div>
                <h4 className="font-medium mb-2">Akıllı Blokaj</h4>
                <p className="text-sm text-gray-600">
                  Seçilen saatten 60 dakika sonrasına kadar otomatik blokaj
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">💾</span>
                </div>
                <h4 className="font-medium mb-2">Veritabanı Entegrasyonu</h4>
                <p className="text-sm text-gray-600">
                  Supabase ile gerçek zamanlı rezervasyon kayıtları
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📱</span>
                </div>
                <h4 className="font-medium mb-2">Mobil Uyumlu</h4>
                <p className="text-sm text-gray-600">
                  Responsive tasarım, tüm cihazlarda mükemmel görünüm
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🎨</span>
                </div>
                <h4 className="font-medium mb-2">Modern UI</h4>
                <p className="text-sm text-gray-600">
                  Tailwind CSS ile modern ve şık arayüz tasarımı
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">✅</span>
                </div>
                <h4 className="font-medium mb-2">Gerçek Zamanlı</h4>
                <p className="text-sm text-gray-600">
                  Anlık müsaitlik kontrolü ve rezervasyon onayı
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RandevuWidgetDemoPage
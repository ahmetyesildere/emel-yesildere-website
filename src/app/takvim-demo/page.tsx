'use client'

import React, { useState } from 'react'
import { AvailabilityCalendar } from '@/components/sessions/availability-calendar'

interface TimeSlot {
  date: string
  start_time: string
  end_time: string
  is_available: boolean
  is_booked: boolean
}

const CalendarDemoPage = () => {
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null)

  // Demo için örnek müsait saatler
  const generateDemoSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = []
    const today = new Date()
    
    // Önümüzdeki 30 gün için örnek saatler oluştur
    for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
      const date = new Date(today)
      date.setDate(date.getDate() + dayOffset)
      const dateString = date.toISOString().split('T')[0]
      
      // Hafta sonu değilse saatler ekle
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        // Yeni sistem: 1.5 saatlik periyotlar
        const fixedTimeSlots = [
          { start: '09:30', end: '11:00' },
          { start: '11:00', end: '12:30' },
          { start: '12:30', end: '14:00' },
          { start: '14:00', end: '15:30' },
          { start: '15:30', end: '17:00' },
          { start: '17:00', end: '18:30' },
          { start: '18:30', end: '20:00' }
        ]
        
        fixedTimeSlots.forEach(timeSlot => {
          // Rastgele bazı saatleri rezerve edilmiş olarak işaretle
          const isBooked = Math.random() < 0.2
          
          slots.push({
            date: dateString,
            start_time: timeSlot.start,
            end_time: timeSlot.end,
            is_available: !isBooked,
            is_booked: isBooked
          })
        })
      }
    }
    
    return slots
  }

  const demoSlots = generateDemoSlots()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Yeni Müsaitlik Takvimi Tasarımı
            </h1>
            <p className="text-gray-600">
              Modern ve kullanıcı dostu takvim arayüzü
            </p>
          </div>

          {/* Takvim Komponenti */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <AvailabilityCalendar
              consultantId="demo-consultant"
              selectedDate={selectedDate}
              selectedTimeSlot={selectedTimeSlot}
              onDateSelect={setSelectedDate}
              onTimeSlotSelect={setSelectedTimeSlot}
              availableSlots={demoSlots}
              isLoading={false}
            />
          </div>

          {/* Seçim Bilgileri */}
          {selectedDate && selectedTimeSlot && (
            <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Seçiminiz</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Tarih</h4>
                  <p className="text-blue-700">
                    {new Date(selectedDate).toLocaleDateString('tr-TR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Saat</h4>
                  <p className="text-green-700">
                    {selectedTimeSlot.start_time} - {selectedTimeSlot.end_time}
                  </p>
                  <p className="text-sm text-green-600 mt-1">60 dakika seans</p>
                </div>
              </div>
            </div>
          )}

          {/* Özellikler */}
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Yeni Tasarımın Özellikleri</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">🎨 Modern Tasarım</h4>
                <p className="text-sm text-gray-600">
                  Gradient renkler ve smooth animasyonlar ile modern görünüm
                </p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">📱 Responsive</h4>
                <p className="text-sm text-gray-600">
                  Mobil ve desktop cihazlarda mükemmel görünüm
                </p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">⚡ Hızlı Seçim</h4>
                <p className="text-sm text-gray-600">
                  Tek tıkla tarih ve saat seçimi
                </p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">🔍 Görsel İpuçları</h4>
                <p className="text-sm text-gray-600">
                  Müsait, rezerve ve seçili durumlar için net göstergeler
                </p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">📅 Akıllı Takvim</h4>
                <p className="text-sm text-gray-600">
                  Pazartesi başlangıçlı, bugün vurgulamalı takvim
                </p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">⏰ Saat Yönetimi</h4>
                <p className="text-sm text-gray-600">
                  60 dakikalık seanslar için otomatik saat hesaplama
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarDemoPage
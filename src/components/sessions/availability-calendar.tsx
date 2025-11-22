'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, Clock, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface TimeSlot {
  date: string
  start_time: string
  end_time: string
  is_available: boolean
  is_booked: boolean
}

interface AvailabilityCalendarProps {
  consultantId: string
  selectedDate: string
  selectedTimeSlot: TimeSlot | null
  onDateSelect: (date: string) => void
  onTimeSlotSelect: (timeSlot: TimeSlot) => void
  availableSlots: TimeSlot[]
  isLoading: boolean
}

export const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  consultantId,
  selectedDate,
  selectedTimeSlot,
  onDateSelect,
  onTimeSlotSelect,
  availableSlots,
  isLoading
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [hoveredDate, setHoveredDate] = useState<string | null>(null)

  // Takvim verilerini oluştur
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    
    // Haftanın pazartesi gününden başla
    const dayOfWeek = firstDay.getDay()
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    startDate.setDate(startDate.getDate() - mondayOffset)

    const days = []
    const currentDate = new Date(startDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // 6 hafta göster (42 gün)
    for (let i = 0; i < 42; i++) {
      const isCurrentMonth = currentDate.getMonth() === month
      const isToday = currentDate.toDateString() === today.toDateString()
      const isPast = currentDate < today
      // Timezone kaymasını önlemek için local tarih kullan
      const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`
      
      // Bu tarihte müsait slot var mı kontrol et
      const hasAvailableSlots = availableSlots.some(slot => 
        slot.date === dateString && slot.is_available && !slot.is_booked
      )
      
      // Eğer o tarih için time_slots verisi varsa ama hiçbiri müsait değilse, gün pasif olsun
      const hasTimeSlotData = availableSlots.some(slot => slot.date === dateString)
      const isDateAvailable = hasTimeSlotData ? hasAvailableSlots : true // Veri yoksa varsayılan müsait

      days.push({
        date: new Date(currentDate),
        dateString,
        day: currentDate.getDate(),
        isCurrentMonth,
        isToday,
        isPast,
        isAvailable: !isPast && isCurrentMonth && isDateAvailable,
        isSelected: selectedDate === dateString
      })

      currentDate.setDate(currentDate.getDate() + 1)
    }

    return days
  }

  // Seçili tarih için müsait saatleri filtrele
  const getAvailableTimeSlotsForDate = (date: string) => {
    return availableSlots.filter(slot => 
      slot.date === date && slot.is_available && !slot.is_booked
    ).sort((a, b) => a.start_time.localeCompare(b.start_time))
  }

  // Ay değiştirme
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth)
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1)
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1)
    }
    setCurrentMonth(newMonth)
  }

  // Saati formatla
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    return `${hours}:${minutes}`
  }

  const calendarDays = generateCalendarDays()
  const selectedDateSlots = selectedDate ? getAvailableTimeSlotsForDate(selectedDate) : []

  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ]

  const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Sol Taraf - Takvim */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* Takvim Başlığı */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('prev')}
                className="text-white hover:bg-white/20 p-2"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <div className="text-center">
                <h3 className="text-lg font-semibold">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <p className="text-sm opacity-90">Müsait tarihleri seçin</p>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('next')}
                className="text-white hover:bg-white/20 p-2"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Haftanın Günleri */}
          <div className="grid grid-cols-7 bg-gray-50 border-b">
            {dayNames.map((day) => (
              <div key={day} className="p-3 text-center text-sm font-medium text-gray-600">
                {day}
              </div>
            ))}
          </div>

          {/* Takvim Günleri */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => (
              <button
                key={index}
                onClick={() => day.isAvailable ? onDateSelect(day.dateString) : null}
                onMouseEnter={() => setHoveredDate(day.dateString)}
                onMouseLeave={() => setHoveredDate(null)}
                disabled={!day.isAvailable}
                className={`
                  relative p-3 text-sm transition-all duration-300 border-r border-b group
                  ${!day.isCurrentMonth 
                    ? 'text-gray-300 bg-gray-50' 
                    : day.isPast 
                      ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                      : day.isAvailable
                        ? day.isSelected
                          ? 'bg-blue-600 text-white font-semibold shadow-lg transform scale-105'
                          : hoveredDate === day.dateString
                            ? 'bg-blue-100 text-blue-700 font-medium shadow-md transform scale-105'
                            : day.isToday
                              ? 'bg-blue-50 text-blue-600 font-medium ring-2 ring-blue-200 hover:bg-blue-100'
                              : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:shadow-sm hover:scale-105'
                        : 'text-gray-400 bg-gray-50 cursor-not-allowed'
                  }
                `}
              >
                <span className="block">{day.day}</span>
                
                {/* Bugün işareti */}
                {day.isToday && !day.isSelected && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                )}
                
                {/* Müsait slot sayısı */}
                {day.isAvailable && day.isCurrentMonth && (
                  <div className="absolute top-1 right-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                )}
                
                {/* Seçili tarih işareti */}
                {day.isSelected && (
                  <CheckCircle className="absolute top-1 right-1 w-3 h-3 text-white" />
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sağ Taraf - Saat Seçimi */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <Clock className="w-5 h-5 text-blue-600 mr-2" />
            <h4 className="font-medium text-gray-900">
              {selectedDate ? 'Müsait Saatler' : 'Önce Tarih Seçin'}
            </h4>
          </div>

          {!selectedDate ? (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Müsait saatleri görmek için önce bir tarih seçin</p>
            </div>
          ) : isLoading ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
              <div className="text-center text-gray-500">
                <p className="text-sm">Müsait saatler yükleniyor...</p>
              </div>
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-16 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : selectedDateSlots.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Bu tarihte müsait saat bulunmuyor</p>
              <p className="text-xs mt-1">Lütfen başka bir tarih seçin</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {selectedDateSlots.map((slot, index) => (
                <button
                  key={index}
                  onClick={() => onTimeSlotSelect(slot)}
                  className={`
                    w-full p-3 rounded-lg border text-left transition-all duration-200
                    ${selectedTimeSlot?.start_time === slot.start_time && selectedTimeSlot?.date === slot.date
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        selectedTimeSlot?.start_time === slot.start_time && selectedTimeSlot?.date === slot.date
                          ? 'bg-blue-500' 
                          : 'bg-green-500'
                      }`}></div>
                      <span className="font-medium">
                        {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                      </span>
                    </div>
                    
                    {selectedTimeSlot?.start_time === slot.start_time && selectedTimeSlot?.date === slot.date && (
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-1 ml-5">
                    60 dakika seans
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Seçili Saat Özeti */}
          {selectedTimeSlot && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg shadow-sm">
              <div className="flex items-center space-x-2 text-green-700 mb-3">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Seçili Randevu</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-600">Tarih:</span>
                  <span className="font-medium text-green-800">
                    {new Date(selectedDate + 'T12:00:00').toLocaleDateString('tr-TR', { 
                      weekday: 'short', 
                      day: 'numeric', 
                      month: 'short'
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-600">Saat:</span>
                  <span className="font-bold text-green-800">
                    {formatTime(selectedTimeSlot.start_time)} - {formatTime(selectedTimeSlot.end_time)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-600">Süre:</span>
                  <span className="text-sm font-medium text-green-700">60 dakika</span>
                </div>
              </div>
            </div>
          )}

          {/* Müsaitlik Durumu Açıklaması */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h5 className="font-medium text-gray-700 mb-3">Durum Açıklaması</h5>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Müsait saat</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Seçili saat</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span className="text-gray-600">Müsait değil</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
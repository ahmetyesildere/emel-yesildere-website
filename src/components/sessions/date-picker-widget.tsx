'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/toast-provider'

interface DatePickerWidgetProps {
  selectedDate: string
  onDateSelect: (date: string) => void
  consultantId: string
  minDate?: string
}

export const DatePickerWidget: React.FC<DatePickerWidgetProps> = ({
  selectedDate,
  onDateSelect,
  consultantId,
  minDate = new Date().toISOString().split('T')[0]
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [unavailableDates, setUnavailableDates] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const { error: showError } = useToast()

  // Danışmanın müsaitlik durumunu yükle
  useEffect(() => {
    loadAvailability()
  }, [consultantId, currentMonth])

  const loadAvailability = async () => {
    setIsLoading(true)
    try {
      const year = currentMonth.getFullYear()
      const month = currentMonth.getMonth()
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)
      
      const startDate = formatDate(firstDay)
      const endDate = formatDate(lastDay)

      console.log('🔍 Müsaitlik kontrol ediliyor:', { consultantId, startDate, endDate })

      // time_slots tablosundan bu ay için verileri çek
      const { data: timeSlots, error } = await supabase
        .from('time_slots')
        .select('date, start_time, is_available')
        .eq('consultant_id', consultantId)
        .gte('date', startDate)
        .lte('date', endDate)

      if (error) {
        console.error('❌ Müsaitlik yükleme hatası:', error)
        return
      }

      // Tarihleri grupla ve tüm saatlerin müsait olup olmadığını kontrol et
      const dateAvailability = new Map<string, { total: number, unavailable: number }>()

      if (timeSlots) {
        timeSlots.forEach(slot => {
          if (!dateAvailability.has(slot.date)) {
            dateAvailability.set(slot.date, { total: 0, unavailable: 0 })
          }
          const stats = dateAvailability.get(slot.date)!
          stats.total++
          if (!slot.is_available) {
            stats.unavailable++
          }
        })
      }

      // Tüm saatleri müsait olmayan tarihleri bul
      const unavailable = new Set<string>()
      dateAvailability.forEach((stats, date) => {
        // Eğer tüm saatler müsait değilse veya hiç müsait saat yoksa
        if (stats.unavailable === stats.total && stats.total > 0) {
          unavailable.add(date)
          console.log('❌ Müsait değil:', date, stats)
        }
      })

      setUnavailableDates(unavailable)
      console.log('✅ Müsaitlik yüklendi:', unavailable.size, 'gün müsait değil')

    } catch (error) {
      console.error('💥 Müsaitlik yükleme hatası:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Ay değiştirme
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  // Takvim günlerini oluştur
  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: (Date | null)[] = []

    // Önceki ayın boş günleri
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Bu ayın günleri
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  // Tarih formatla (YYYY-MM-DD)
  const formatDate = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Günün durumunu kontrol et
  const getDayStatus = (date: Date): 'available' | 'unavailable' | 'past' | 'selected' => {
    const dateStr = formatDate(date)
    
    // Geçmiş tarih
    if (dateStr < minDate) return 'past'
    
    // Seçili tarih
    if (dateStr === selectedDate) return 'selected'
    
    // Pazar günü
    if (date.getDay() === 0) return 'unavailable'
    
    // Danışman müsaitlik durumu - tüm saatler dolu
    if (unavailableDates.has(dateStr)) return 'unavailable'
    
    return 'available'
  }

  // Günün tooltip mesajını al
  const getDayTooltip = (date: Date): string => {
    const dateStr = formatDate(date)
    
    if (dateStr < minDate) return 'Geçmiş tarih'
    if (date.getDay() === 0) return 'Pazar günleri kapalı'
    if (unavailableDates.has(dateStr)) return 'Bu tarihte müsait saat yok'
    return 'Müsait - Tıklayın'
  }

  // Gün stilini al
  const getDayClassName = (status: string): string => {
    const baseClass = 'w-full aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200'
    
    switch (status) {
      case 'selected':
        return `${baseClass} bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105`
      case 'available':
        return `${baseClass} bg-white hover:bg-blue-50 hover:scale-105 cursor-pointer border-2 border-transparent hover:border-blue-300 text-gray-900`
      case 'unavailable':
        return `${baseClass} bg-gray-100 text-gray-400 cursor-not-allowed line-through`
      case 'past':
        return `${baseClass} bg-gray-50 text-gray-300 cursor-not-allowed`
      default:
        return baseClass
    }
  }

  const days = getDaysInMonth()
  const monthName = currentMonth.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })

  return (
    <Card className="max-w-2xl mx-auto shadow-xl border-0 overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30">
      <CardHeader className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white">
        <div className="flex items-center justify-between">
          <Button
            onClick={goToPreviousMonth}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {monthName}
          </CardTitle>
          
          <Button
            onClick={goToNextMonth}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Gün başlıkları */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'].map((day, index) => (
            <div
              key={day}
              className={`text-center text-xs font-semibold py-2 ${
                index === 0 ? 'text-red-600' : 'text-gray-600'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Takvim günleri */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="aspect-square" />
            }

            const status = getDayStatus(date)
            const dateStr = formatDate(date)

            return (
              <button
                key={dateStr}
                onClick={() => {
                  if (status === 'available' || status === 'selected') {
                    onDateSelect(dateStr)
                  } else if (status === 'unavailable') {
                    // Müsait olmayan tarihe tıklandığında toast göster
                    if (date.getDay() === 0) {
                      showError('Pazar günleri seans verilmemektedir.')
                    } else {
                      showError('Bu tarihte müsait saat bulunmamaktadır. Lütfen başka bir tarih seçin.')
                    }
                  }
                }}
                disabled={status === 'past'}
                className={getDayClassName(status)}
                title={getDayTooltip(date)}
              >
                {date.getDate()}
              </button>
            )
          })}
        </div>

        {/* Açıklama */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-blue-600 to-purple-600"></div>
            <span className="text-gray-600">Seçili</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-white border-2 border-blue-300"></div>
            <span className="text-gray-600">Müsait</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-100"></div>
            <span className="text-gray-600">Kapalı</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-50"></div>
            <span className="text-gray-600">Geçmiş</span>
          </div>
        </div>

        {/* Bilgi notu */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>💡 Not:</strong> Pazar günleri kapalıdır. Müsait günleri seçebilirsiniz.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

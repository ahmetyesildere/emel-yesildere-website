'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, Clock, Save, ChevronLeft, ChevronRight, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth/auth-context'
import { supabase } from '@/lib/supabase'
import { useToast, ToastContainer } from '@/components/ui/toast'

interface TimeSlot {
  time: string
  isAvailable: boolean
}

interface DaySchedule {
  date: string
  isWorkingDay: boolean
  timeSlots: TimeSlot[]
}

const SimpleAvailabilityCalendar = () => {
  const { user } = useAuth()
  const { toasts, showSuccess, showError, removeToast } = useToast()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [schedules, setSchedules] = useState<Record<string, DaySchedule>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // 09:30'dan 18:30'a kadar tüm saatler (30 dakika aralıklarla)
  const generateTimeSlots = (): string[] => {
    const slots = []
    let hour = 9
    let minute = 30

    while (hour < 18 || (hour === 18 && minute <= 30)) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      slots.push(timeString)

      minute += 30
      if (minute >= 60) {
        minute = 0
        hour += 1
      }
    }

    return slots
  }

  const TIME_SLOTS = generateTimeSlots()

  // Varsayılan gün programı oluştur
  const createDefaultSchedule = (dateString: string): DaySchedule => {
    // Tarih string'ini parçalayıp manuel oluştur (timezone sorununu önlemek için)
    const [year, month, day] = dateString.split('-').map(Number)
    const date = new Date(year, month - 1, day) // month 0-indexed
    const dayOfWeek = date.getDay()
    const isSunday = dayOfWeek === 0

    return {
      date: dateString,
      isWorkingDay: !isSunday,
      timeSlots: TIME_SLOTS.map(time => ({
        time,
        isAvailable: !isSunday
      }))
    }
  }

  // Takvim verilerini oluştur
  const generateCalendarData = () => {
    const today = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    const months = []

    for (let monthOffset = 0; monthOffset < 2; monthOffset++) {
      const targetDate = new Date(currentYear, currentMonth + monthOffset, 1)
      const year = targetDate.getFullYear()
      const month = targetDate.getMonth()

      const firstDay = new Date(year, month, 1)
      const startDate = new Date(firstDay)
      startDate.setDate(startDate.getDate() - firstDay.getDay())

      const days = []
      const currentDateLoop = new Date(startDate)

      for (let i = 0; i < 42; i++) {
        const isCurrentMonth = currentDateLoop.getMonth() === month
        const isToday = currentDateLoop.toDateString() === today.toDateString()
        const isPast = currentDateLoop < today
        const dateString = currentDateLoop.toISOString().split('T')[0]
        const dayOfWeek = currentDateLoop.getDay()
        const isSunday = dayOfWeek === 0

        // Pazar günleri KESIN olarak pasif, diğer günler aktif
        const isWorkingDay = !isSunday



        // Debug: Eğer database'den veri varsa onu kullan (ama Pazar günleri hariç)
        const schedule = schedules[dateString]
        if (schedule && !isSunday) {
          // Sadece Pazar olmayan günler için database verisini kullan
          // isWorkingDay = schedule.isWorkingDay // Şimdilik kapalı
        }

        days.push({
          date: new Date(currentDateLoop),
          dateString,
          day: currentDateLoop.getDate(),
          isCurrentMonth,
          isToday,
          isPast,
          isSunday,
          isWorkingDay,
          hasCustomSettings: !!schedules[dateString]
        })

        currentDateLoop.setDate(currentDateLoop.getDate() + 1)
      }

      months.push({
        year,
        month,
        monthName: targetDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }),
        days
      })
    }

    return months
  }

  const calendarData = generateCalendarData()

  // Veri yükleme
  useEffect(() => {
    if (user?.id) {
      loadSchedules()
    }
  }, [user?.id, currentDate])

  const loadSchedules = async () => {
    if (!user?.id) return

    setIsLoading(true)
    try {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0)

      // Müsaitlik verilerini yükle
      const { data: availabilityData, error: availabilityError } = await supabase
        .from('consultant_availability')
        .select('*')
        .eq('consultant_id', user.id)
        .gte('date', startOfMonth.toISOString().split('T')[0])
        .lte('date', endOfMonth.toISOString().split('T')[0])

      if (availabilityError) throw availabilityError

      // Saat dilimlerini yükle
      const { data: timeSlotsData, error: timeSlotsError } = await supabase
        .from('consultant_time_slots')
        .select('*')
        .eq('consultant_id', user.id)
        .gte('date', startOfMonth.toISOString().split('T')[0])
        .lte('date', endOfMonth.toISOString().split('T')[0])

      if (timeSlotsError) throw timeSlotsError

      // Verileri organize et - Pazar günü kontrolü ile
      const schedulesMap: Record<string, DaySchedule> = {}

      availabilityData?.forEach(item => {
        // Pazar günü kontrolü
        const [year, month, day] = item.date.split('-').map(Number)
        const date = new Date(year, month - 1, day)
        const isSunday = date.getDay() === 0

        // Pazar günleri KESIN pasif
        schedulesMap[item.date] = {
          date: item.date,
          isWorkingDay: isSunday ? false : item.is_available, // Pazar günü kesin pasif
          timeSlots: TIME_SLOTS.map(time => ({
            time,
            isAvailable: isSunday ? false : item.is_available // Pazar günü kesin pasif
          }))
        }
      })

      // Saat dilimlerini güncelle - Pazar günü kontrolü ile
      timeSlotsData?.forEach(slot => {
        if (schedulesMap[slot.date]) {
          // Pazar günü kontrolü
          const [year, month, day] = slot.date.split('-').map(Number)
          const date = new Date(year, month - 1, day)
          const isSunday = date.getDay() === 0

          const timeSlot = schedulesMap[slot.date].timeSlots.find(ts => ts.time === slot.start_time)
          if (timeSlot) {
            // Pazar günleri KESIN pasif
            timeSlot.isAvailable = isSunday ? false : slot.is_available
          }
        }
      })

      setSchedules(schedulesMap)
    } catch (error) {
      console.error('Veri yükleme hatası:', error)
      showError('Müsaitlik verileri yüklenemedi')
    } finally {
      setIsLoading(false)
    }
  }

  // Tarih seçimi
  const handleDateSelect = (dateString: string) => {
    setSelectedDate(dateString)
  }

  // Gün durumunu değiştir
  const toggleWorkingDay = (dateString: string) => {
    const currentSchedule = schedules[dateString] || createDefaultSchedule(dateString)
    const newIsWorkingDay = !currentSchedule.isWorkingDay

    setSchedules(prev => ({
      ...prev,
      [dateString]: {
        ...currentSchedule,
        isWorkingDay: newIsWorkingDay,
        timeSlots: currentSchedule.timeSlots.map(slot => ({
          ...slot,
          isAvailable: newIsWorkingDay
        }))
      }
    }))
  }

  // Saat durumunu değiştir - basit toggle
  const toggleTimeSlot = (dateString: string, selectedTime: string) => {
    const currentSchedule = schedules[dateString] || createDefaultSchedule(dateString)

    if (!currentSchedule.isWorkingDay) return

    // Sadece seçilen saatin durumunu değiştir
    setSchedules(prev => ({
      ...prev,
      [dateString]: {
        ...currentSchedule,
        timeSlots: currentSchedule.timeSlots.map(slot =>
          slot.time === selectedTime
            ? { ...slot, isAvailable: !slot.isAvailable }
            : slot
        )
      }
    }))
  }

  // Kaydet
  const saveSchedule = async () => {
    if (!user?.id || !selectedDate) {
      showError('Kullanıcı bilgisi veya seçili tarih bulunamadı')
      return
    }

    // Pazar günü kontrolü
    const [year, month, day] = selectedDate.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    const isSunday = date.getDay() === 0

    if (isSunday) {
      showError('Pazar günleri kaydedilemez')
      return
    }

    setIsSaving(true)
    try {
      const schedule = schedules[selectedDate] || createDefaultSchedule(selectedDate)

      // Gün müsaitliğini kaydet
      const { error: availabilityError } = await supabase
        .from('consultant_availability')
        .upsert({
          consultant_id: user.id,
          date: selectedDate,
          is_available: schedule.isWorkingDay
        })

      if (availabilityError) throw availabilityError

      // Mevcut saat dilimlerini sil
      const { error: deleteError } = await supabase
        .from('consultant_time_slots')
        .delete()
        .eq('consultant_id', user.id)
        .eq('date', selectedDate)

      if (deleteError) throw deleteError

      // Yeni saat dilimlerini ekle
      if (schedule.isWorkingDay) {
        const timeSlotsToInsert = schedule.timeSlots.map(slot => {
          const [h, m] = slot.time.split(':').map(Number)
          const endMinutes = h * 60 + m + 30 // 30 dakika ekle (sadece slot süresi)
          const endHour = Math.floor(endMinutes / 60)
          const endMin = endMinutes % 60
          const endTime = `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`

          return {
            consultant_id: user.id,
            date: selectedDate,
            start_time: slot.time,
            end_time: endTime,
            is_available: slot.isAvailable
          }
        })

        const { error: insertError } = await supabase
          .from('consultant_time_slots')
          .insert(timeSlotsToInsert)

        if (insertError) throw insertError
      }

      showSuccess('Müsaitlik bilgileri başarıyla kaydedildi!')

      setTimeout(() => {
        loadSchedules()
      }, 500)

    } catch (error) {
      console.error('Kaydetme hatası:', error)
      showError('Kaydetme sırasında bir hata oluştu')
    } finally {
      setTimeout(() => {
        setIsSaving(false)
      }, 1000)
    }
  }

  const selectedSchedule = selectedDate ? (() => {
    // Pazar günü kontrolü
    const [year, month, day] = selectedDate.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    const isSunday = date.getDay() === 0

    if (isSunday) {
      // Pazar günleri KESIN pasif
      return {
        date: selectedDate,
        isWorkingDay: false,
        timeSlots: TIME_SLOTS.map(time => ({
          time,
          isAvailable: false
        }))
      }
    }

    // Pazar değilse normal hesaplama
    return schedules[selectedDate] || createDefaultSchedule(selectedDate)
  })() : null

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Müsaitlik Takvimi</h3>
            <p className="text-gray-600 mt-1">Çalışma saatlerinizi ve müsait olduğunuz günleri ayarlayın</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Sol Taraf - Takvim */}
          <div>
            <div className="flex items-center mb-4">
              <Calendar className="w-5 h-5 text-blue-600 mr-2" />
              <h4 className="font-medium text-gray-900">Takvim Görünümü</h4>
            </div>

            <div className="space-y-6">
              {calendarData.map((monthData, monthIndex) => (
                <div key={monthIndex} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="text-center mb-4">
                    <h5 className="text-lg font-semibold text-gray-900">{monthData.monthName}</h5>
                  </div>

                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'].map((day) => (
                      <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {monthData.days.map((dayData, dayIndex) => {
                      const isSelected = selectedDate === dayData.dateString
                      const isClickable = dayData.isCurrentMonth && !dayData.isPast

                      return (
                        <button
                          key={dayIndex}
                          onClick={() => isClickable && handleDateSelect(dayData.dateString)}
                          disabled={!isClickable}
                          className={`
                              aspect-square p-2 text-sm rounded-lg transition-all duration-200 relative
                              ${!dayData.isCurrentMonth
                              ? 'text-gray-300 cursor-not-allowed'
                              : dayData.isPast
                                ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                                : isSelected
                                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105'
                                  : dayData.isToday
                                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-300 hover:bg-blue-200'
                                    : dayData.isWorkingDay
                                      ? 'text-gray-700 hover:bg-green-50 hover:text-green-600 border border-transparent hover:border-green-200'
                                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }
                            `}
                        >
                          <span className="relative z-10">{dayData.day}</span>

                          {dayData.isToday && !isSelected && (
                            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></div>
                          )}

                          {dayData.isWorkingDay && dayData.isCurrentMonth && !dayData.isPast && !isSelected && (
                            <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full opacity-60"></div>
                          )}
                        </button>
                      )
                    })}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-600">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-400 rounded-full mr-1"></div>
                      Çalışma Günü
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-gray-400 rounded-full mr-1"></div>
                      Kapalı
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sağ Taraf - Saat Yönetimi */}
          <div>
            <div className="flex items-center mb-4">
              <Clock className="w-5 h-5 text-green-600 mr-2" />
              <h4 className="font-medium text-gray-900">
                {selectedDate ? 'Saat Yönetimi' : 'Tarih Seçin'}
              </h4>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 min-h-[500px]">
              {!selectedDate ? (
                <div className="text-center py-16 text-gray-500">
                  <Calendar className="w-20 h-20 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium mb-2">Tarih Seçin</p>
                  <p className="text-sm">Saat dilimlerini yönetmek için takvimden bir tarih seçin</p>
                </div>
              ) : (
                <div>
                  {/* Seçili Tarih Bilgisi */}
                  <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-semibold text-blue-900 mb-1">Seçili Tarih</h5>
                        <p className="text-blue-700">
                          {(() => {
                            const [year, month, day] = selectedDate.split('-').map(Number)
                            const date = new Date(year, month - 1, day)
                            return date.toLocaleDateString('tr-TR', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })
                          })()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Button
                          size="sm"
                          onClick={saveSchedule}
                          disabled={isSaving}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Save className="w-4 h-4 mr-1" />
                          {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Gün Durumu */}
                  <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h6 className="font-medium text-gray-900">Bu gün çalışıyor musunuz?</h6>
                        <p className="text-sm text-gray-600">
                          {(() => {
                            const [year, month, day] = selectedDate.split('-').map(Number)
                            const date = new Date(year, month - 1, day)
                            return date.toLocaleDateString('tr-TR', { weekday: 'long' })
                          })()} günü
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant={selectedSchedule?.isWorkingDay ? "default" : "outline"}
                        onClick={() => toggleWorkingDay(selectedDate)}
                        className={selectedSchedule?.isWorkingDay ? 'bg-green-600 hover:bg-green-700' : 'border-red-500 text-red-600 hover:bg-red-50'}
                      >
                        {selectedSchedule?.isWorkingDay ? (
                          <><Check className="w-4 h-4 mr-1" />Çalışıyorum</>
                        ) : (
                          <><X className="w-4 h-4 mr-1" />Kapalı</>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Saat Dilimleri */}
                  {selectedSchedule?.isWorkingDay && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h6 className="font-medium text-gray-900">Çalışma Saatleri</h6>
                        <Badge variant="outline" className="text-xs">
                          09:30 - 18:30
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
                        {selectedSchedule.timeSlots.map((slot, index) => (
                          <div
                            key={index}
                            className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${slot.isAvailable
                              ? 'border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm'
                              : 'border-gray-300 bg-gray-50'
                              }`}
                          >
                            {/* Saat Bilgisi */}
                            <div className="text-center">
                              <div className={`font-bold text-lg ${slot.isAvailable ? 'text-green-700' : 'text-gray-500'}`}>
                                {slot.time}
                              </div>

                            </div>

                            {/* Aktif/Pasif Durumu - Sağ üst köşede tik */}
                            <button
                              onClick={() => toggleTimeSlot(selectedDate, slot.time)}
                              className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${slot.isAvailable
                                ? 'bg-green-500 border-green-500 text-white hover:bg-green-600'
                                : 'bg-white border-gray-300 text-gray-400 hover:border-gray-400'
                                }`}
                            >
                              {slot.isAvailable && (
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  )
}

export default SimpleAvailabilityCalendar
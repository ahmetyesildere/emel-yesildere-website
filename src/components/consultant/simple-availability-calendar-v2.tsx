'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, Clock, Save, ChevronLeft, ChevronRight, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth/auth-context'
import { supabase } from '@/lib/supabase'
import { useToast, Toast } from '@/components/ui/toast'

interface TimeSlot {
  time: string
  isAvailable: boolean
}

interface DaySchedule {
  date: string
  isWorkingDay: boolean
  timeSlots: TimeSlot[]
}

const SimpleAvailabilityCalendarV2 = () => {
  const { user } = useAuth()
  const { toast, showToast, hideToast, success, error, info } = useToast()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [schedules, setSchedules] = useState<Record<string, DaySchedule>>({})
  const [isSaving, setIsSaving] = useState(false)

  // Toast helper functions
  const showSuccess = (message: string) => success(message)
  const showError = (message: string) => error(message)

  // 09:30'dan 18:30'a kadar tüm saatler
  const TIME_SLOTS = [
    '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00',
    '16:30', '17:00', '17:30', '18:00', '18:30'
  ]

  // Pazar günü kontrolü
  const isSundayDate = (dateString: string): boolean => {
    const [year, month, day] = dateString.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    return date.getDay() === 0
  }

  // Varsayılan schedule oluştur
  const getDefaultSchedule = (dateString: string): DaySchedule => {
    const isSunday = isSundayDate(dateString)

    return {
      date: dateString,
      isWorkingDay: !isSunday, // Pazar günleri pasif
      timeSlots: TIME_SLOTS.map(time => ({
        time,
        isAvailable: !isSunday // Pazar günleri tüm saatler pasif
      }))
    }
  }

  // İlk loadSchedules fonksiyonu kaldırıldı - ikinci fonksiyon kullanılıyor

  // Component mount olduğunda verileri yükle
  useEffect(() => {
    if (user?.id) {
      loadSchedules()
    }
  }, [user?.id])

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
        // Timezone sorununu önlemek için manuel tarih string oluştur
        const dateYear = currentDateLoop.getFullYear()
        const dateMonth = (currentDateLoop.getMonth() + 1).toString().padStart(2, '0')
        const dateDay = currentDateLoop.getDate().toString().padStart(2, '0')
        const dateString = `${dateYear}-${dateMonth}-${dateDay}`
        const isSunday = currentDateLoop.getDay() === 0

        // Gerçek veritabanı verilerinden çalışma durumunu al
        const scheduleData = schedules[dateString]
        const isWorkingDay = scheduleData ? scheduleData.isWorkingDay : !isSunday // Varsayılan: Pazar hariç çalışma günü

        days.push({
          date: new Date(currentDateLoop),
          dateString,
          day: currentDateLoop.getDate(),
          isCurrentMonth,
          isToday,
          isPast,
          isSunday,
          isWorkingDay
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

    console.log('🔄 Veriler yeniden yükleniyor...')

    try {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0)

      console.log('📅 Tarih aralığı:', {
        start: startOfMonth.toISOString().split('T')[0],
        end: endOfMonth.toISOString().split('T')[0]
      })

      const { data: availabilityData, error: availabilityError } = await supabase
        .from('daily_availability')
        .select('*')
        .eq('consultant_id', user.id)
        .gte('date', startOfMonth.toISOString().split('T')[0])
        .lte('date', endOfMonth.toISOString().split('T')[0])

      console.log('📊 Availability verisi:', { data: availabilityData, error: availabilityError })

      const { data: timeSlotsData, error: timeSlotsError } = await supabase
        .from('time_slots')
        .select('*')
        .eq('consultant_id', user.id)
        .gte('date', startOfMonth.toISOString().split('T')[0])
        .lte('date', endOfMonth.toISOString().split('T')[0])

      console.log('⏰ Time slots verisi:', { data: timeSlotsData, error: timeSlotsError })

      const schedulesMap: Record<string, DaySchedule> = {}

      // Database verilerini işle - ama Pazar günleri için zorla pasif yap
      availabilityData?.forEach(item => {
        const isSunday = isSundayDate(item.date)

        schedulesMap[item.date] = {
          date: item.date,
          isWorkingDay: isSunday ? false : item.is_available, // Pazar günleri zorla pasif
          timeSlots: TIME_SLOTS.map(time => ({
            time,
            isAvailable: isSunday ? false : item.is_available // Pazar günleri zorla pasif
          }))
        }
      })

      // Saat dilimlerini güncelle - ama Pazar günleri için zorla pasif yap
      timeSlotsData?.forEach(slot => {
        if (schedulesMap[slot.date]) {
          const isSunday = isSundayDate(slot.date)
          const timeSlot = schedulesMap[slot.date].timeSlots.find(ts => ts.time === slot.start_time)
          if (timeSlot) {
            timeSlot.isAvailable = isSunday ? false : slot.is_available // Pazar günleri zorla pasif
          }
        }
      })

      console.log('🗂️ Final schedules:', schedulesMap)
      setSchedules(schedulesMap)
      console.log('✅ Veriler başarıyla yüklendi!')
    } catch (error) {
      console.error('💥 Veri yükleme hatası:', error)
    }
  }

  // Tarih seçimi
  const handleDateSelect = (dateString: string) => {
    console.log(`🎯 Tarih seçildi: ${dateString}`)
    setSelectedDate(dateString)

    // Seçilen tarih için veri yükle (şimdilik boş, loadSchedules zaten çalışıyor)
  }

  // Test için manuel veri yükleme
  const testLoadData = async (date: string) => {
    if (!user?.id) return

    console.log('🧪 Test veri yükleme başlıyor...', { userId: user.id, date })

    try {
      const { data: availabilityData, error: availabilityError } = await supabase
        .from('daily_availability')
        .select('*')
        .eq('consultant_id', user.id)
        .eq('date', date)

      console.log('📊 Availability test sonucu:', { data: availabilityData, error: availabilityError })

      const { data: timeSlotsData, error: timeSlotsError } = await supabase
        .from('time_slots')
        .select('*')
        .eq('consultant_id', user.id)
        .eq('date', date)

      console.log('⏰ Time slots test sonucu:', { data: timeSlotsData, error: timeSlotsError })

    } catch (error) {
      console.error('💥 Test veri yükleme hatası:', error)
    }
  }

  // Gün durumunu değiştir
  const toggleWorkingDay = (dateString: string) => {
    if (isSundayDate(dateString)) {
      showError('Pazar günleri çalışma günü olarak ayarlanamaz')
      return
    }

    const currentSchedule = schedules[dateString] || getDefaultSchedule(dateString)
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

  // Saat durumunu değiştir
  const toggleTimeSlot = (dateString: string, selectedTime: string) => {
    if (isSundayDate(dateString)) {
      showError('Pazar günleri saat ayarlanamaz')
      return
    }

    const currentSchedule = schedules[dateString] || getDefaultSchedule(dateString)

    if (!currentSchedule.isWorkingDay) return

    const newSchedule = {
      ...currentSchedule,
      timeSlots: currentSchedule.timeSlots.map(slot =>
        slot.time === selectedTime
          ? { ...slot, isAvailable: !slot.isAvailable }
          : slot
      )
    }

    console.log(`🔄 Saat değiştirildi: ${selectedTime} -> ${!currentSchedule.timeSlots.find(s => s.time === selectedTime)?.isAvailable}`)

    setSchedules(prev => ({
      ...prev,
      [dateString]: newSchedule
    }))
  }

  // Kaydet
  const saveSchedule = async () => {
    console.log('💾 KAYDET butonuna basıldı!', { user: user?.id, selectedDate })

    if (!user?.id || !selectedDate) {
      showError('Kullanıcı bilgisi veya seçili tarih bulunamadı')
      return
    }

    if (isSundayDate(selectedDate)) {
      showError('Pazar günleri kaydedilemez')
      return
    }

    const schedule = schedules[selectedDate] || getDefaultSchedule(selectedDate)
    console.log('📊 Kaydedilecek veri:', schedule)
    console.log('⏰ Saat dilimleri detayı:', schedule.timeSlots.map(slot => `${slot.time}: ${slot.isAvailable ? '✅' : '❌'}`).join(', '))

    setIsSaving(true)
    try {
      // 1. Günlük çalışma durumunu availability tablosuna kaydet
      console.log('📅 Günlük çalışma durumu kaydediliyor...')
      
      const { error: availabilityError } = await supabase
        .from('daily_availability')
        .upsert({
          consultant_id: user.id,
          date: selectedDate,
          is_available: schedule.isWorkingDay
        }, {
          onConflict: 'consultant_id,date'
        })

      if (availabilityError) {
        console.error('❌ Availability kayıt hatası:', availabilityError)
        throw availabilityError
      }

      console.log('✅ Günlük çalışma durumu kaydedildi:', schedule.isWorkingDay)

      // 2. Bu tarih için mevcut saat dilimlerini sil
      console.log('🗑️ Eski saat dilimleri siliniyor...')
      
      const { error: deleteTimeSlotsError } = await supabase
        .from('time_slots')
        .delete()
        .eq('consultant_id', user.id)
        .eq('date', selectedDate)

      if (deleteTimeSlotsError) {
        console.error('❌ Eski saat dilimleri silinirken hata:', deleteTimeSlotsError)
        throw deleteTimeSlotsError
      }

      // 3. Eğer gün aktifse, saat dilimlerini kaydet
      if (schedule.isWorkingDay) {
        console.log('⏰ Saat dilimleri kaydediliyor...')
        
        const timeSlotsToInsert = schedule.timeSlots.map(slot => ({
          consultant_id: user.id,
          date: selectedDate,
          start_time: slot.time,
          is_available: slot.isAvailable
        }))

        const { data: timeSlotsData, error: timeSlotsError } = await supabase
          .from('time_slots')
          .insert(timeSlotsToInsert)
          .select()

        if (timeSlotsError) {
          console.error('❌ Saat dilimleri kayıt hatası:', timeSlotsError)
          throw timeSlotsError
        }

        console.log('✅ Saat dilimleri kaydedildi:', timeSlotsData?.length, 'adet')
      }

      // 4. Haftalık çalışma saatleri şablonunu da güncelle
      console.log('💼 Haftalık çalışma saatleri şablonu güncelleniyor...')
      
      const [year, month, day] = selectedDate.split('-').map(Number)
      const date = new Date(year, month - 1, day)
      const dayOfWeek = date.getDay()

      // Bu gün için mevcut çalışma saatlerini sil
      const { error: deleteWorkingHoursError } = await supabase
        .from('availability')
        .delete()
        .eq('consultant_id', user.id)
        .eq('day_of_week', dayOfWeek)

      if (deleteWorkingHoursError) {
        console.error('❌ Eski çalışma saatleri silinirken hata:', deleteWorkingHoursError)
        // Bu hata kritik değil, devam et
      }

      // Eğer gün aktifse, çalışma saatlerini ekle
      if (schedule.isWorkingDay) {
        const workingHoursToInsert = schedule.timeSlots
          .filter(slot => slot.isAvailable)
          .map(slot => {
            const [h, m] = slot.time.split(':').map(Number)
            const endMinutes = h * 60 + m + 90 // 1.5 saat
            const endHour = Math.floor(endMinutes / 60)
            const endMin = endMinutes % 60
            const endTime = `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`

            return {
              consultant_id: user.id,
              day_of_week: dayOfWeek,
              start_time: slot.time,
              end_time: endTime,
              is_active: true
            }
          })

        if (workingHoursToInsert.length > 0) {
          const { error: insertWorkingHoursError } = await supabase
            .from('availability')
            .insert(workingHoursToInsert)

          if (insertWorkingHoursError) {
            console.error('❌ Çalışma saatleri kayıt hatası:', insertWorkingHoursError)
            // Bu hata kritik değil, devam et
          }
        }
      }

      console.log('✅ Tüm veriler başarıyla kaydedildi!')
      showSuccess('Müsaitlik bilgileri başarıyla kaydedildi!')

      // Verileri yeniden yükle
      setTimeout(() => {
        loadSchedules()
      }, 500)

    } catch (error) {
      console.error('Kaydetme hatası:', error)
      showError('Kaydetme sırasında bir hata oluştu')
    } finally {
      setTimeout(() => setIsSaving(false), 1000)
    }
  }

  // Seçili gün verisi - Pazar günleri için zorla pasif
  const selectedSchedule = selectedDate ? (() => {
    if (isSundayDate(selectedDate)) {
      return {
        date: selectedDate,
        isWorkingDay: false,
        timeSlots: TIME_SLOTS.map(time => ({
          time,
          isAvailable: false
        }))
      }
    }
    return schedules[selectedDate] || getDefaultSchedule(selectedDate)
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
                                    : dayData.isSunday || !dayData.isWorkingDay
                                      ? 'bg-red-100 text-red-700 border border-red-200 hover:bg-red-150'
                                      : 'text-gray-700 hover:bg-green-50 hover:text-green-600 border border-transparent hover:border-green-200'
                            }
                          `}
                        >
                          <span className="relative z-10">{dayData.day}</span>

                          {dayData.isToday && !isSelected && (
                            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></div>
                          )}

                          {dayData.isWorkingDay && dayData.isCurrentMonth && !dayData.isPast && !isSelected && !dayData.isSunday && (
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
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
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
                          disabled={isSaving || isSundayDate(selectedDate)}
                          className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
                        >
                          <Save className="w-4 h-4 mr-1" />
                          {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Pazar Günü Uyarısı */}
                  {isSundayDate(selectedDate) && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center">
                        <X className="w-5 h-5 text-red-600 mr-2" />
                        <div>
                          <h6 className="font-medium text-red-900">Pazar Günü</h6>
                          <p className="text-sm text-red-700">Pazar günleri çalışma günü olarak ayarlanamaz.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Gün Durumu */}
                  {!isSundayDate(selectedDate) && (
                    <>
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
                                    : 'border-red-300 bg-gradient-to-r from-red-50 to-red-100'
                                  }`}
                              >
                                <div className="text-center">
                                  <div className={`font-bold text-lg ${slot.isAvailable ? 'text-green-700' : 'text-red-600'}`}>
                                    {slot.time}
                                  </div>
                                </div>

                                <button
                                  onClick={() => toggleTimeSlot(selectedDate, slot.time)}
                                  className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${slot.isAvailable
                                      ? 'bg-green-500 border-green-500 text-white hover:bg-green-600'
                                      : 'bg-red-100 border-red-400 text-red-500 hover:border-red-500'
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
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {toast.isVisible && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={hideToast}
        />
      )}
    </>
  )
}

export default SimpleAvailabilityCalendarV2
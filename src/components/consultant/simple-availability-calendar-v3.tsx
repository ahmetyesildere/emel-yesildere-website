'use client'

import React, { useState, useEffect, useMemo } from 'react'
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

const SimpleAvailabilityCalendarV3 = () => {
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
      isWorkingDay: !isSunday,
      timeSlots: TIME_SLOTS.map(time => ({
        time,
        isAvailable: !isSunday // Pazar değilse tüm saatler açık
      }))
    }
  }

  // Verileri database'den yükle
  const loadSchedules = async () => {
    if (!user?.id) {
      console.log('❌ User ID yok, veri yükleme iptal edildi')
      return
    }

    try {
      console.log('📊 Veriler yükleniyor...', { userId: user.id })

      // Basit time_slots sorgusu
      console.log('🔍 time_slots sorgusu başlıyor, user.id:', user.id)
      
      let timeSlotsData = null
      let timeSlotsError = null

      try {
        const result = await supabase
          .from('time_slots')
          .select('*')
        
        timeSlotsData = result.data
        timeSlotsError = result.error

        console.log('🔍 TÜM time_slots sonucu:', { 
          data: timeSlotsData, 
          error: timeSlotsError,
          count: timeSlotsData?.length
        })

        // Kullanıcıya ait olanları filtrele
        if (timeSlotsData) {
          timeSlotsData = timeSlotsData.filter(slot => slot.consultant_id === user.id)
          console.log('🔍 Filtrelenmiş time_slots:', { 
            count: timeSlotsData.length,
            data: timeSlotsData
          })
        }

      } catch (error) {
        console.error('🔍 time_slots sorgu hatası:', error)
        timeSlotsError = error
      }

      if (timeSlotsError) {
        console.error('❌ Time slots yükleme hatası:', timeSlotsError)
        return
      }

      // Boş daily_availability verisi
      const dailyData: any[] = []

      console.log('✅ Veriler yüklendi:', { 
        dailyData: dailyData?.length, 
        timeSlotsData: timeSlotsData?.length,
        dailyDataDetails: dailyData,
        timeSlotsDataDetails: timeSlotsData
      })

      // 3. Verileri schedules state'ine dönüştür
      const newSchedules: Record<string, DaySchedule> = {}

      // BASIT MANTIK: Sadece kapalı günleri ve müsait olmayan saatleri yükle
      const processedDates = new Set()

      // 1. Kapalı günleri işle
      dailyData?.forEach(day => {
        const dateString = day.date
        processedDates.add(dateString)

        console.log(`🚫 ${dateString} kapalı gün olarak yükleniyor`)

        newSchedules[dateString] = {
          date: dateString,
          isWorkingDay: false, // Kapalı gün
          timeSlots: TIME_SLOTS.map(time => ({
            time,
            isAvailable: false
          }))
        }
      })

      // 2. Saat dilimlerini işle
      const dateGroups = timeSlotsData?.reduce((acc, slot) => {
        if (!acc[slot.date]) acc[slot.date] = []
        acc[slot.date].push(slot)
        return acc
      }, {} as Record<string, any[]>) || {}

      Object.entries(dateGroups).forEach(([dateString, slots]) => {
        if (processedDates.has(dateString)) return // Zaten kapalı gün olarak işlendi

        console.log(`⏰ ${dateString} için saat verileri:`, slots.map(s => `${s.start_time}:${s.is_available ? '✅' : '❌'}`).join(', '))

        newSchedules[dateString] = {
          date: dateString,
          isWorkingDay: true, // Çalışma günü
          timeSlots: TIME_SLOTS.map(time => {
            // start_time formatını normalize et (09:30:00 -> 09:30)
            const slotData = slots.find(slot => {
              const dbTime = slot.start_time.substring(0, 5) // "09:30:00" -> "09:30"
              return dbTime === time
            })
            
            console.log(`🔍 ${time} için slot arama:`, {
              time,
              found: !!slotData,
              dbTime: slotData?.start_time,
              isAvailable: slotData?.is_available
            })
            
            return {
              time,
              // Eğer time_slots'ta varsa o değeri kullan, yoksa true (varsayılan müsait)
              isAvailable: slotData ? slotData.is_available : true
            }
          })
        }
      })

      setSchedules(newSchedules)
      console.log('✅ Schedules state güncellendi:', Object.keys(newSchedules).length, 'gün')

    } catch (error) {
      console.error('💥 Veri yükleme hatası:', error)
    }
  }

  // Component mount olduğunda verileri yükle
  useEffect(() => {
    if (user?.id) {
      loadSchedules()
    }
  }, [user?.id])

  // schedules değiştiğinde takvimi yeniden render et
  useEffect(() => {
    console.log('📅 Schedules state değişti, takvim yeniden render ediliyor:', Object.keys(schedules).length, 'gün')
  }, [schedules])

  // Tarih seçimi
  const handleDateSelect = (dateString: string) => {
    console.log(`🎯 Tarih seçildi: ${dateString}`)
    setSelectedDate(dateString)
    
    // Eğer bu tarih için veri yoksa, verileri yeniden yükle
    if (!schedules[dateString]) {
      console.log('📊 Bu tarih için veri yok, yeniden yükleniyor...')
      loadSchedules()
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
          // Çalışma günü yapılırsa tüm saatler açık, kapatılırsa tüm saatler kapalı
          isAvailable: newIsWorkingDay ? true : false
        }))
      }
    }))
  }

  // Saat dilimini değiştir
  const toggleTimeSlot = (dateString: string, time: string) => {
    const currentSchedule = schedules[dateString] || getDefaultSchedule(dateString)
    
    if (!currentSchedule.isWorkingDay) {
      showError('Önce bu günü çalışma günü olarak ayarlayın')
      return
    }

    setSchedules(prev => ({
      ...prev,
      [dateString]: {
        ...currentSchedule,
        timeSlots: currentSchedule.timeSlots.map(slot =>
          slot.time === time
            ? { ...slot, isAvailable: !slot.isAvailable }
            : slot
        )
      }
    }))
  }

  // Kaydetme işlemi - BASIT MANTIK
  const saveSchedule = async () => {
    if (!user?.id || !selectedDate) return

    const schedule = schedules[selectedDate] || getDefaultSchedule(selectedDate)
    console.log('📊 Kaydedilecek veri:', schedule)

    setIsSaving(true)
    try {
      // SENARYO 1: "Kapalı" butonu tıklandıysa
      if (!schedule.isWorkingDay) {
        console.log('🚫 Gün kapalı olarak kaydediliyor...')
        
        // Sadece daily_availability tablosuna kaydet
        const { error: availabilityError } = await supabase
          .from('daily_availability')
          .upsert({
            consultant_id: user.id,
            date: selectedDate,
            is_available: false
          }, {
            onConflict: 'consultant_id,date'
          })

        if (availabilityError) throw availabilityError

        // Bu tarih için tüm time_slots kayıtlarını sil
        await supabase
          .from('time_slots')
          .delete()
          .eq('consultant_id', user.id)
          .eq('date', selectedDate)

        console.log('✅ Gün kapalı olarak kaydedildi!')
      } 
      // SENARYO 2: "Çalışıyorum" butonu aktif
      else {
        console.log('✅ Çalışma günü olarak kaydediliyor...')

        // daily_availability'yi sil (çalışma günü varsayılan)
        await supabase
          .from('daily_availability')
          .delete()
          .eq('consultant_id', user.id)
          .eq('date', selectedDate)

        // Sadece tiki KALDIRILMIŞ saatleri kaydet
        const unavailableSlots = schedule.timeSlots.filter(slot => !slot.isAvailable)
        
        console.log('❌ Tiki kaldırılmış saatler:', unavailableSlots.map(slot => slot.time).join(', '))

        // Eski time_slots kayıtlarını sil
        await supabase
          .from('time_slots')
          .delete()
          .eq('consultant_id', user.id)
          .eq('date', selectedDate)

        // Sadece müsait OLMAYAN saatleri kaydet
        if (unavailableSlots.length > 0) {
          const timeSlotsToInsert = unavailableSlots.map(slot => ({
            consultant_id: user.id,
            date: selectedDate,
            start_time: slot.time,
            is_available: false
          }))

          const { error: timeSlotsError } = await supabase
            .from('time_slots')
            .insert(timeSlotsToInsert)

          if (timeSlotsError) throw timeSlotsError

          console.log('✅ Müsait olmayan saatler kaydedildi:', unavailableSlots.length, 'adet')
        } else {
          console.log('✅ Tüm saatler müsait, hiçbir kayıt yapılmadı')
        }
      }

      console.log('✅ Kaydetme tamamlandı!')
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
        const dateYear = currentDateLoop.getFullYear()
        const dateMonth = (currentDateLoop.getMonth() + 1).toString().padStart(2, '0')
        const dateDay = currentDateLoop.getDate().toString().padStart(2, '0')
        const dateString = `${dateYear}-${dateMonth}-${dateDay}`
        const isSunday = currentDateLoop.getDay() === 0

        const scheduleData = schedules[dateString]
        const isWorkingDay = scheduleData ? scheduleData.isWorkingDay : !isSunday

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
        monthName: targetDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }),
        days
      })
    }

    return months
  }

  // schedules state'i değiştiğinde takvim verilerini yeniden oluştur
  const calendarData = useMemo(() => {
    console.log('🔄 Takvim verileri yeniden oluşturuluyor...')
    return generateCalendarData()
  }, [schedules, currentDate])

  // Seçili gün verisi
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
    
    const scheduleData = schedules[selectedDate]
    console.log(`🔍 ${selectedDate} için schedule verisi:`, {
      found: !!scheduleData,
      isWorkingDay: scheduleData?.isWorkingDay,
      timeSlots: scheduleData?.timeSlots?.map(slot => `${slot.time}:${slot.isAvailable ? '✅' : '❌'}`).join(', '),
      allSchedules: Object.keys(schedules)
    })
    
    return scheduleData || getDefaultSchedule(selectedDate)
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

export default SimpleAvailabilityCalendarV3
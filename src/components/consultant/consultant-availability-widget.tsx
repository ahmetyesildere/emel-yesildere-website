'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Calendar, Clock, CheckCircle, User, Save, RotateCcw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth/auth-context'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/toast-provider'

interface ConsultantAvailabilityWidgetProps {
  selectedDate: string
  onDateChange?: (date: string) => void
}

export const ConsultantAvailabilityWidget: React.FC<ConsultantAvailabilityWidgetProps> = ({
  selectedDate,
  onDateChange
}) => {
  const { user } = useAuth()
  const { success: showSuccess, error: showError } = useToast()

  // Yeni sistem: 60 dakikalık periyotlar
  const timeSlots = [
    9 * 60 + 30,  // 09:30 -> 570
    11 * 60,      // 11:00 -> 660
    13 * 60,      // 13:00 -> 780
    14 * 60 + 30, // 14:30 -> 870
    16 * 60,      // 16:00 -> 960
    17 * 60 + 30  // 17:30 -> 1050
  ]

  const [unavailableSlots, setUnavailableSlots] = useState<number[]>([]) // müsait OLMAYAN slotlar
  const [bookedSlots, setBookedSlots] = useState<number[]>([]) // rezerve slotlar
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Slot'ları kullan
  const slots = useMemo(() => timeSlots, [])

  // Dakika -> "HH:MM" formatı
  function formatTime(min: number): string {
    const hh = Math.floor(min / 60)
    const mm = min % 60
    return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
  }

  // Dakika -> "HH:MM:SS" formatı (veritabanı için)
  function formatTimeForDB(min: number): string {
    const hh = Math.floor(min / 60)
    const mm = min % 60
    return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:00`
  }

  // Slot durumunu kontrol et
  function getSlotStatus(slotMin: number): 'available' | 'booked' | 'unavailable' {
    if (bookedSlots.includes(slotMin)) return 'booked'
    if (unavailableSlots.includes(slotMin)) return 'unavailable'
    return 'available' // Varsayılan olarak müsait
  }

  // Müsaitlik verilerini yükle
  useEffect(() => {
    if (!user?.id || !selectedDate) return
    loadAvailability()
  }, [user?.id, selectedDate])

  const loadAvailability = async () => {
    setIsLoading(true)
    try {
      console.log('🔍 Müsaitlik verileri yükleniyor...', { consultantId: user?.id, selectedDate })

      // 1. time_slots tablosundan müsait saatleri al
      const { data: timeSlots, error: timeSlotsError } = await supabase
        .from('time_slots')
        .select('start_time, is_available')
        .eq('consultant_id', user?.id)
        .eq('date', selectedDate)

      // 2. sessions tablosundan rezerve edilmiş seansları al
      const { data: sessions, error: sessionsError } = await supabase
        .from('sessions')
        .select('start_time, duration_minutes')
        .eq('consultant_id', user?.id)
        .eq('session_date', selectedDate)

      const unavailableMinutes: number[] = []
      const bookedMinutes: number[] = []

      // time_slots'tan müsait OLMAYAN saatleri ekle
      if (!timeSlotsError && timeSlots) {
        timeSlots.forEach(slot => {
          const [hours, minutes] = slot.start_time.split(':').map(Number)
          const totalMinutes = hours * 60 + minutes
          
          if (!slot.is_available) { // Müsait OLMAYAN saatleri al
            unavailableMinutes.push(totalMinutes)
          }
        })
      }

      // sessions'tan rezerve edilmiş saatleri ekle
      if (!sessionsError && sessions) {
        sessions.forEach(session => {
          const [hours, minutes] = session.start_time.split(':').map(Number)
          const sessionStartMinutes = hours * 60 + minutes
          
          if (slots.includes(sessionStartMinutes)) {
            bookedMinutes.push(sessionStartMinutes)
          }
        })
      }

      setUnavailableSlots(unavailableMinutes)
      setBookedSlots(bookedMinutes)
      setHasChanges(false)

      console.log('✅ Müsaitlik verileri yüklendi:', { 
        unavailable: unavailableMinutes.length, 
        booked: bookedMinutes.length 
      })

    } catch (error) {
      console.error('💥 Müsaitlik verileri yüklenirken hata:', error)
      showError('Müsaitlik verileri yüklenemedi')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleSlotAvailability = (slotMin: number) => {
    const status = getSlotStatus(slotMin)
    
    if (status === 'booked') {
      // Rezerve edilmiş slotlar değiştirilemez
      showError('Bu saat rezerve edilmiş, değiştirilemez')
      return
    }

    if (status === 'unavailable') {
      // Müsait olmayan'dan çıkar (müsait yap)
      setUnavailableSlots(prev => prev.filter(s => s !== slotMin))
    } else {
      // Müsait olmayan yap
      setUnavailableSlots(prev => [...prev, slotMin])
    }
    
    setHasChanges(true)
  }

  const saveAvailability = async () => {
    if (!user?.id || !hasChanges) return

    setIsSaving(true)
    try {
      console.log('💾 Müsaitlik kaydediliyor...', { selectedDate, unavailableSlots })

      // Önce mevcut time_slots kayıtlarını sil
      await supabase
        .from('time_slots')
        .delete()
        .eq('consultant_id', user.id)
        .eq('date', selectedDate)

      // Yeni müsaitlik verilerini ekle
      const timeSlotData = slots.map(slotMin => ({
        consultant_id: user.id,
        date: selectedDate,
        start_time: formatTimeForDB(slotMin),
        end_time: formatTimeForDB(slotMin + 90), // 90 dakika sonra
        is_available: !unavailableSlots.includes(slotMin) // Unavailable listesinde OLMAYAN müsait
      }))

      const { error } = await supabase
        .from('time_slots')
        .insert(timeSlotData)

      if (error) {
        console.error('❌ Müsaitlik kaydetme hatası:', error)
        throw error
      }

      console.log('✅ Müsaitlik kaydedildi')
      showSuccess('Müsaitlik ayarları kaydedildi!')
      setHasChanges(false)

    } catch (error) {
      console.error('💥 Müsaitlik kaydetme hatası:', error)
      showError('Müsaitlik ayarları kaydedilemedi: ' + (error as any)?.message)
    } finally {
      setIsSaving(false)
    }
  }

  const resetChanges = () => {
    loadAvailability()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Müsaitlik Ayarları</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Varsayılan olarak tüm saatler müsait. Müsait OLMAK İSTEMEDİĞİNİZ saatleri seçin.
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">
              Tarih: <span className="font-medium text-blue-600">
                {formatDate(selectedDate)}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Saat Seçimi */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Müsaitlik verileri yükleniyor...</p>
          </div>
        ) : (
          <div>
            <div className="flex items-center mb-4">
              <Clock className="w-5 h-5 text-blue-600 mr-2" />
              <h4 className="font-medium">Müsait Olmadığınız Saatleri Seçin</h4>
            </div>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {slots.map(s => {
                const status = getSlotStatus(s)
                const isAvailable = status === 'available'
                const isUnavailable = status === 'unavailable'
                const isBooked = status === 'booked'
                
                return (
                  <button
                    key={s}
                    onClick={() => toggleSlotAvailability(s)}
                    disabled={isBooked}
                    className={`
                      py-3 px-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none
                      ${isBooked 
                        ? 'bg-gray-100 border-2 border-gray-400 text-gray-600 cursor-not-allowed' 
                        : isUnavailable
                        ? 'bg-red-50 border-2 border-red-500 text-red-700 shadow-lg'
                        : 'bg-green-50 border-2 border-green-500 text-green-700 hover:shadow-md'
                      }
                    `}
                  >
                    {formatTime(s)}
                    {isAvailable && (
                      <CheckCircle className="w-3 h-3 mx-auto mt-1 text-green-600" />
                    )}
                    {isUnavailable && (
                      <div className="text-xs mt-1">Müsait Değil</div>
                    )}
                    {isBooked && (
                      <div className="text-xs mt-1">Rezerve</div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Açıklama */}
            <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-100 border-2 border-green-500 rounded mr-2"></div>
                  <span>Müsait (Varsayılan)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-100 border-2 border-red-500 rounded mr-2"></div>
                  <span>Müsait Değil (Seçili)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-100 border-2 border-gray-400 rounded mr-2"></div>
                  <span>Rezerve Edilmiş</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Kaydet/İptal Butonları */}
        {hasChanges && (
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={saveAvailability}
              disabled={isSaving}
              className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </Button>

            <Button
              onClick={resetChanges}
              variant="outline"
              className="flex-1"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              İptal Et
            </Button>
          </div>
        )}

        {/* Bilgi Notu */}
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          <p className="font-medium mb-1">Önemli Notlar:</p>
          <ul className="list-disc ml-4 space-y-1">
            <li>Her saat dilimi 90 dakika sürer</li>
            <li>Rezerve edilmiş saatler değiştirilemez</li>
            <li>Değişiklikler kaydedilene kadar geçici olarak saklanır</li>
            <li>Müsaitlik ayarları sadece seçili tarih için geçerlidir</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
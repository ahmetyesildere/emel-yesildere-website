'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Calendar, Clock, CheckCircle, User } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth/auth-context'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/toast-provider'

interface RandevuWidgetProps {
  consultantId: string
  consultant: {
    first_name: string
    last_name: string
    avatar_url?: string
  }
  sessionTypeId: string
  sessionType: {
    name: string
    price: number
    duration_minutes: number
  }
  selectedDate: string
  onConfirm?: (booking: any) => void
  onCancel?: () => void
}

export const RandevuWidget: React.FC<RandevuWidgetProps> = ({
  consultantId,
  consultant,
  sessionTypeId,
  sessionType,
  selectedDate,
  onConfirm,
  onCancel
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

  const [selected, setSelected] = useState<number | null>(null) // seçilen slot (dakika sayısı)
  const [bookedSlots, setBookedSlots] = useState<number[]>([]) // rezerve slotlar (dakika)
  const [isLoading, setIsLoading] = useState(false)
  const [isBooking, setIsBooking] = useState(false)

  // Slot'ları kullan (artık hesaplama yok, sabit liste)
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

  // Disabled slot kontrolü - sadece rezerve edilmiş saatler
  function isDisabled(slotMin: number): boolean {
    // Sadece kalıcı rezervasyonlar disabled olur
    return bookedSlots.includes(slotMin)
  }

  // Rezerve edilmiş slotları yükle
  useEffect(() => {
    if (!consultantId || !selectedDate) return

    loadBookedSlots()
  }, [consultantId, selectedDate])

  const loadBookedSlots = async () => {
    setIsLoading(true)
    try {
      console.log('🔍 Rezerve slotlar yükleniyor...', { consultantId, selectedDate })

      // 1. time_slots tablosundan müsait olmayan saatleri al
      const { data: timeSlots, error: timeSlotsError } = await supabase
        .from('time_slots')
        .select('start_time, is_available')
        .eq('consultant_id', consultantId)
        .eq('date', selectedDate)

      // 2. sessions tablosundan rezerve edilmiş seansları al
      const { data: sessions, error: sessionsError } = await supabase
        .from('sessions')
        .select('start_time, duration_minutes')
        .eq('consultant_id', consultantId)
        .eq('session_date', selectedDate)

      const blockedMinutes: number[] = []

      // time_slots'tan müsait olmayan saatleri ekle
      if (!timeSlotsError && timeSlots) {
        timeSlots.forEach(slot => {
          if (!slot.is_available) {
            const [hours, minutes] = slot.start_time.split(':').map(Number)
            const totalMinutes = hours * 60 + minutes
            blockedMinutes.push(totalMinutes)
            console.log(`🚫 Time slot bloklandı: ${slot.start_time}`)
          }
        })
      }

      // sessions'tan rezerve edilmiş saatleri ekle - sadece o saati blokla
      if (!sessionsError && sessions) {
        sessions.forEach(session => {
          const [hours, minutes] = session.start_time.split(':').map(Number)
          const sessionStartMinutes = hours * 60 + minutes
          
          // Sadece o saati blokla (çakışan slot varsa)
          if (timeSlots.includes(sessionStartMinutes) && !blockedMinutes.includes(sessionStartMinutes)) {
            blockedMinutes.push(sessionStartMinutes)
          }
          console.log(`📝 Seans bloklandı: ${session.start_time}`)
        })
      }

      setBookedSlots(blockedMinutes)
      console.log('✅ Toplam bloklanmış slot:', blockedMinutes.length)

    } catch (error) {
      console.error('💥 Rezerve slotlar yüklenirken hata:', error)
      showError('Müsait saatler yüklenemedi')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelect = (slotMin: number) => {
    if (isDisabled(slotMin)) return
    setSelected(slotMin)
  }

  const confirmBooking = async () => {
    if (selected === null || !user) return

    setIsBooking(true)
    try {
      console.log('🚀 Rezervasyon oluşturuluyor...', {
        selected,
        time: formatTime(selected),
        date: selectedDate
      })

      const startTime = formatTimeForDB(selected)

      // Zorunlu title kolonu da dahil
      const sessionData = {
        client_id: user.id,
        consultant_id: consultantId,
        session_date: selectedDate,
        start_time: startTime,
        duration_minutes: 60,
        title: `${sessionType.name} - ${consultant.first_name} ${consultant.last_name}`
      }

      console.log('📊 Gönderilecek veri:', sessionData)

      const { data, error } = await supabase
        .from('sessions')
        .insert([sessionData])
        .select()

      if (error) {
        console.error('❌ Rezervasyon hatası:', error)
        throw error
      }

      console.log('✅ Rezervasyon başarılı:', data)

      // Başarılı rezervasyon sonrası
      const bookingData = {
        id: data[0].id,
        consultant,
        sessionType,
        date: selectedDate,
        startTime: formatTime(selected),
        endTime: formatTime(selected + 90),
        price: sessionType.price
      }

      // Rezerve edilen slotu kalıcı olarak ekle
      setBookedSlots(prev => [...prev, selected])
      setSelected(null)

      showSuccess('Rezervasyon oluşturuldu! Ödeme sayfasına yönlendiriliyorsunuz...')
      
      // Ödeme sayfasına yönlendir
      setTimeout(() => {
        window.location.href = `/odeme?session=${data[0].id}`
      }, 1500)
      
      if (onConfirm) {
        onConfirm(bookingData)
      }

    } catch (error) {
      console.error('💥 Rezervasyon hatası:', error)
      showError('Rezervasyon oluşturulamadı: ' + (error as any)?.message)
    } finally {
      setIsBooking(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T12:00:00').toLocaleDateString('tr-TR', {
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
            <CardTitle className="text-xl">Randevu Seçimi</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              09:30 - 18:30 arasında 1.5 saatlik periyotlar. Sadece seçilen saat bloklanır.
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">
              Seçili: <span className="font-medium text-blue-600">
                {selected ? formatTime(selected) : '—'}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Rezervasyon Detayları */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              {consultant.avatar_url ? (
                <img
                  src={consultant.avatar_url}
                  alt={`${consultant.first_name} ${consultant.last_name}`}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {consultant.first_name} {consultant.last_name}
              </h3>
              <p className="text-sm text-gray-600">{sessionType.name}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Tarih:</span>
              <p className="font-medium">{formatDate(selectedDate)}</p>
            </div>
            <div>
              <span className="text-gray-600">Ücret:</span>
              <p className="font-bold text-green-600">₺{sessionType.price}</p>
            </div>
          </div>
        </div>

        {/* Saat Seçimi */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Müsait saatler yükleniyor...</p>
          </div>
        ) : (
          <div>
            <div className="flex items-center mb-4">
              <Clock className="w-5 h-5 text-blue-600 mr-2" />
              <h4 className="font-medium">Müsait Saatler</h4>
            </div>
            
            {/* Tüm saatler bloklandıysa uyarı göster */}
            {slots.every(s => isDisabled(s)) ? (
              <div className="text-center py-8 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-red-600 mb-2">
                  <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="font-medium">Bu tarihte müsait saat bulunmuyor</p>
                  <p className="text-sm mt-1">Lütfen başka bir tarih seçin</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {slots.map(s => {
                const disabled = isDisabled(s)
                const isSelected = selected === s
                const isBooked = bookedSlots.includes(s)
                
                return (
                  <button
                    key={s}
                    onClick={() => handleSelect(s)}
                    disabled={disabled}
                    className={`
                      py-3 px-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none
                      ${disabled 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow-md'
                      }
                      ${isSelected 
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg transform scale-105' 
                        : ''
                      }
                      ${isBooked && !isSelected
                        ? 'bg-red-50 border-red-200 text-red-500'
                        : ''
                      }
                    `}
                  >
                    {formatTime(s)}
                    {isSelected && (
                      <CheckCircle className="w-3 h-3 mx-auto mt-1 text-blue-600" />
                    )}
                  </button>
                )
              })}
              </div>
            )}
          </div>
        )}

        {/* Seçim Özeti */}
        {selected && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 text-green-700 mb-2">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium">Seçili Randevu</span>
            </div>
            <div className="text-sm text-green-600">
              <p><strong>{formatDate(selectedDate)}</strong></p>
              <p><strong>{formatTime(selected)} - {formatTime(selected + 90)}</strong> (90 dakika)</p>
              <p>Ücret: <strong>₺{sessionType.price}</strong></p>
            </div>
          </div>
        )}

        {/* Aksiyon Butonları */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={confirmBooking}
            disabled={selected === null || isBooking}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isBooking ? 'Rezervasyon Yapılıyor...' : 'Randevuyu Onayla'}
          </Button>

          {onCancel && (
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1"
            >
              İptal
            </Button>
          )}
        </div>

        {/* Bilgi Notu */}
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          <p className="font-medium mb-1">Önemli Notlar:</p>
          <ul className="list-disc ml-4 space-y-1">
            <li>Seçtiğiniz saatten itibaren 90 dakika boyunca seans devam eder</li>
            <li>Rezervasyon onaylandıktan sonra danışmanınızla iletişime geçilecektir</li>
            <li>İptal işlemleri için en az 24 saat önceden bildirim yapınız</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
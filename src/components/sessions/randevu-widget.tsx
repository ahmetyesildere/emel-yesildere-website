'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Clock, CheckCircle, User, Monitor, Users } from 'lucide-react'
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
    id: string
    name: string
    price: number
    duration_minutes: number
    is_online: boolean
    is_in_person: boolean
    description?: string
  }
  selectedDate: string
  onConfirm?: (booking: any) => void
  onCancel?: () => void
}

type SessionMode = 'online' | 'face_to_face'

interface SessionModeOption {
  id: SessionMode
  name: string
  description: string
  icon: string
  price_modifier: number // Fiyat değişikliği (0 = aynı fiyat, 50 = +50 TL)
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
  const router = useRouter()

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
  const [selectedMode, setSelectedMode] = useState<SessionMode | null>(null) // seçilen seans türü
  const [isLoading, setIsLoading] = useState(false)
  const [isBooking, setIsBooking] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false) // Sorumluluk reddi onayı

  // Fiyat formatlama fonksiyonu
  const formatPrice = (value: number): string => {
    return new Intl.NumberFormat('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  // Seans türü seçenekleri - sessionType'dan dinamik olarak oluştur
  const sessionModes: SessionModeOption[] = useMemo(() => {
    const modes: SessionModeOption[] = []
    
    if (sessionType.is_online) {
      modes.push({
        id: 'online',
        name: 'Online Seans',
        description: 'Video konferans ile evden katılın',
        icon: '💻',
        price_modifier: 0
      })
    }
    
    if (sessionType.is_in_person) {
      modes.push({
        id: 'face_to_face',
        name: 'Yüz Yüze Seans',
        description: 'Ofiste birebir görüşme',
        icon: '👥',
        price_modifier: 0
      })
    }
    
    return modes
  }, [sessionType.is_online, sessionType.is_in_person])

  // Eğer sadece bir mod varsa otomatik seç
  useEffect(() => {
    if (sessionModes.length === 1 && !selectedMode) {
      setSelectedMode(sessionModes[0].id)
    }
  }, [sessionModes, selectedMode])

  // Slot'ları kullan (artık hesaplama yok, sabit liste)
  const slots = useMemo(() => timeSlots || [], [])

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
          if (slots.includes(sessionStartMinutes) && !blockedMinutes.includes(sessionStartMinutes)) {
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
    if (selected === null || !user || !selectedMode) return

    setIsBooking(true)
    try {
      console.log('🚀 Rezervasyon oluşturuluyor...', {
        selected,
        time: formatTime(selected),
        date: selectedDate,
        mode: selectedMode
      })

      const startTime = formatTimeForDB(selected)
      const selectedModeOption = sessionModes.find(m => m.id === selectedMode)
      const finalPrice = sessionType.price + (selectedModeOption?.price_modifier || 0)

      // Session date'i saat ile birleştir
      const sessionDateTime = `${selectedDate}T${startTime}`

      // Zorunlu title kolonu da dahil
      const sessionData = {
        client_id: user.id,
        consultant_id: consultantId,
        title: `${sessionType.name} - ${consultant.first_name} ${consultant.last_name} (${selectedModeOption?.name})`,
        session_date: sessionDateTime,
        duration_minutes: 60,
        session_type: selectedMode, // session_mode yerine session_type
        price: finalPrice,
        status: 'pending_payment', // Ödeme bekliyor - ödeme yapılınca 'pending' olacak
        payment_status: 'pending'
      }

      console.log('📊 Gönderilecek veri:', sessionData)

      const { data, error } = await supabase
        .from('sessions')
        .insert([sessionData])
        .select()

      console.log('📥 Supabase yanıtı:', { data, error, hasError: !!error })

      if (error) {
        console.error('❌ Rezervasyon hatası:', error)
        console.error('❌ Hata detayları:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw error
      }

      if (!data || data.length === 0) {
        console.error('❌ Veri döndürülmedi!')
        throw new Error('Rezervasyon oluşturuldu ama veri döndürülmedi')
      }

      console.log('✅ Rezervasyon başarılı:', data)

      // Başarılı rezervasyon sonrası
      const bookingData = {
        id: data[0].id,
        consultant,
        sessionType,
        sessionMode: selectedMode,
        date: selectedDate,
        startTime: formatTime(selected),
        endTime: formatTime(selected + 60),
        price: finalPrice
      }

      // Rezerve edilen slotu kalıcı olarak ekle
      setBookedSlots(prev => [...prev, selected])
      setSelected(null)
      setSelectedMode(null)

      // onConfirm callback varsa çağır, yoksa direkt yönlendir
      if (onConfirm) {
        showSuccess('Rezervasyon oluşturuldu! Ödeme sayfasına yönlendiriliyorsunuz...')
        // onConfirm'i çağır ama setIsBooking'i çağırma (parent yönlendirme yapacak)
        onConfirm(bookingData)
        // Parent component yönlendirme yapacağı için burada setIsBooking(false) yapma
        return
      } else {
        showSuccess('Rezervasyon oluşturuldu! Ödeme sayfasına yönlendiriliyorsunuz...')
        // Ödeme sayfasına yönlendir - DİKKAT: parametre adı 'session' olmalı
        setTimeout(() => {
          router.push(`/odeme?session=${data[0].id}`)
        }, 1500)
      }

    } catch (error) {
      console.error('💥 Rezervasyon hatası:', error)
      console.error('💥 Hata tipi:', typeof error)
      console.error('💥 Hata içeriği:', JSON.stringify(error, null, 2))
      
      const errorMessage = (error as any)?.message || 'Bilinmeyen hata'
      showError('Rezervasyon oluşturulamadı: ' + errorMessage)
    } finally {
      console.log('🏁 Rezervasyon işlemi tamamlandı, isBooking:', false)
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
    <Card className="max-w-4xl mx-auto shadow-2xl border-0 overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 animate-in slide-in-from-bottom-4 duration-700">
      <CardHeader className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12 animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
                🗓️ Hemen Rezervasyon Yap
                <div className="animate-bounce">⚡</div>
              </CardTitle>
              <p className="text-blue-100 mt-2 text-sm lg:text-base">
                09:00 - 18:30 arasında 60 dakikalık seanslar • Anında onay
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 lg:p-4 border border-white/30">
              <div className="text-center">
                <div className="text-xs lg:text-sm text-blue-100 mb-1">Seçili Saat</div>
                <div className="text-lg lg:text-xl font-bold text-white">
                  {selected ? formatTime(selected) : '⏰ Saat Seçin'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Rezervasyon Detayları */}
        <div className="p-4 lg:p-6 bg-gradient-to-r from-blue-50 via-white to-purple-50 rounded-2xl border-2 border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300 animate-in fade-in-50 delay-300">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                {consultant.avatar_url ? (
                  <img
                    src={consultant.avatar_url}
                    alt={`${consultant.first_name} ${consultant.last_name}`}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                )}
              </div>
              <div>
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 flex items-center gap-2">
                  {consultant.first_name} {consultant.last_name}
                  <span className="text-green-500">✓</span>
                </h3>
                <p className="text-sm lg:text-base text-gray-600 font-medium">{sessionType.name}</p>
              </div>
            </div>
            
            <div className="sm:ml-auto">
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full text-center shadow-lg">
                <div className="text-xs font-medium">Seans Ücreti</div>
                <div className="text-lg lg:text-xl font-bold">₺{sessionType.price}</div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm lg:text-base">
            <div className="bg-white/70 p-3 rounded-xl border border-blue-200/50">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-gray-600 font-medium">Tarih:</span>
              </div>
              <p className="font-bold text-gray-900">{formatDate(selectedDate)}</p>
            </div>
            <div className="bg-white/70 p-3 rounded-xl border border-purple-200/50">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-purple-600" />
                <span className="text-gray-600 font-medium">Süre:</span>
              </div>
              <p className="font-bold text-gray-900">{sessionType.duration_minutes} dakika</p>
            </div>
          </div>
        </div>

        {/* Seans Türü Seçimi */}
        <div className="animate-in slide-in-from-bottom-2 delay-500">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900">🎯 Seans Türünü Seçin</h4>
                <p className="text-sm text-gray-600">Online veya yüz yüze seans tercihinizi belirtin</p>
              </div>
            </div>
            <Badge className="bg-purple-100 text-purple-800">
              Adım 1
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {sessionModes.map((mode) => {
              const isSelected = selectedMode === mode.id
              const finalPrice = sessionType.price + mode.price_modifier
              
              return (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id)}
                  className={`
                    relative p-6 rounded-xl text-left transition-all duration-300 focus:outline-none transform hover:scale-105 border-2
                    ${isSelected 
                      ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-2xl scale-105 ring-4 ring-purple-200/50' 
                      : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-lg'
                    }
                  `}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{mode.icon}</div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{mode.name}</h3>
                        <p className="text-sm text-gray-600">{mode.description}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="flex items-center text-purple-600 animate-bounce">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {mode.id === 'online' ? 'Zoom/Teams ile' : 'Ofiste buluşma'}
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      ₺{finalPrice}
                      {mode.price_modifier !== 0 && (
                        <span className="text-sm text-green-600 ml-1">
                          ({mode.price_modifier > 0 ? '+' : ''}₺{mode.price_modifier})
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Saat Seçimi - Sadece seans türü seçildiyse göster */}
        {selectedMode && (
          <>
            {isLoading ? (
          <div className="text-center py-12 animate-in fade-in-50 delay-500">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600 animate-pulse" />
              </div>
            </div>
            <p className="text-gray-600 font-medium">Müsait saatler yükleniyor...</p>
            <div className="flex justify-center mt-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-in slide-in-from-bottom-2 delay-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">⚡ Müsait Saatler</h4>
                  <p className="text-sm text-gray-600">
                    {selectedMode === 'online' ? 'Online seans' : 'Yüz yüze seans'} için müsait saatler
                  </p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 animate-pulse">
                Adım 2
              </Badge>
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
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
              {slots.map((s, index) => {
                const disabled = isDisabled(s)
                const isSelected = selected === s
                const isBooked = bookedSlots.includes(s)
                
                return (
                  <button
                    key={s}
                    onClick={() => handleSelect(s)}
                    disabled={disabled}
                    className={`
                      relative py-4 px-3 lg:px-4 rounded-xl text-sm lg:text-base font-bold transition-all duration-300 focus:outline-none transform hover:scale-105 animate-in fade-in-50
                      ${disabled 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50' 
                        : 'bg-gradient-to-r from-white to-blue-50 border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl text-gray-800 hover:from-blue-50 hover:to-purple-50'
                      }
                      ${isSelected 
                        ? 'border-green-500 bg-gradient-to-r from-green-50 to-green-100 text-green-800 shadow-2xl scale-105 ring-4 ring-green-200/50' 
                        : ''
                      }
                      ${isBooked && !isSelected
                        ? 'bg-gradient-to-r from-red-50 to-red-100 border-red-300 text-red-600'
                        : ''
                      }
                    `}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex flex-col items-center">
                      <div className="text-lg lg:text-xl font-bold">
                        {formatTime(s)}
                      </div>
                      {isSelected && (
                        <div className="flex items-center mt-1 animate-bounce">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-xs ml-1">Seçildi</span>
                        </div>
                      )}
                      {!disabled && !isSelected && (
                        <div className="text-xs text-gray-500 mt-1">Müsait</div>
                      )}
                      {disabled && (
                        <div className="text-xs text-red-500 mt-1">Dolu</div>
                      )}
                    </div>
                  </button>
                )
              })}
              </div>
            )}
          </div>
        )}
          </>
        )}

        {/* Seçim Özeti */}
        {selected && selectedMode && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 text-green-700 mb-2">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium">Seçili Randevu</span>
            </div>
            <div className="text-sm text-green-600">
              <p><strong>{formatDate(selectedDate)}</strong></p>
              <p><strong>{formatTime(selected)} - {formatTime(selected + 60)}</strong> (60 dakika)</p>
              <p>Seans Türü: <strong>{sessionModes.find(m => m.id === selectedMode)?.name}</strong></p>
              <p>Ücret: <strong>₺{sessionType.price + (sessionModes.find(m => m.id === selectedMode)?.price_modifier || 0)}</strong></p>
            </div>
          </div>
        )}

        {/* Bilgilendirme ve Sorumluluk Reddi */}
        {selected && selectedMode && (
          <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-amber-900 mb-2">
                  📋 Bilgilendirme Metni
                </h4>
                <p className="text-xs text-amber-800 mb-4">
                  Randevunuzu onaylamadan önce lütfen bilgilendirme metnini okuyunuz.
                </p>

                {/* Onay Checkbox */}
                <div 
                  className="flex items-start space-x-3 p-3 bg-white rounded-lg border-2 border-amber-200 hover:border-amber-400 transition-colors cursor-pointer"
                  onClick={() => {
                    console.log('Kutu tıklandı, mevcut durum:', termsAccepted)
                    setTermsAccepted(!termsAccepted)
                  }}
                >
                  <input
                    type="checkbox"
                    id="terms-checkbox"
                    checked={termsAccepted}
                    onChange={(e) => {
                      console.log('Checkbox değişti:', e.target.checked)
                      // onChange boş bırakıldı çünkü parent div onClick ile kontrol ediliyor
                    }}
                    className="mt-1 w-6 h-6 text-blue-600 bg-white border-2 border-amber-400 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer flex-shrink-0 pointer-events-none"
                    readOnly
                  />
                  <div className="text-sm text-amber-900 flex-1">
                    <a
                      href="/Sözleşmeler/duygu_temizligi_sorumluluk_reddi.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-blue-600 hover:text-blue-800 underline"
                      onClick={(e) => {
                        e.stopPropagation()
                        console.log('PDF linki tıklandı')
                      }}
                    >
                      Bilgilendirme Metni
                    </a>
                    <span className="font-semibold">'ni okudum, anladım ve kabul ediyorum.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Debug Bilgisi - Geliştirme için */}
        {selected && selectedMode && (
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            Debug: Saat seçildi ✓ | Mod seçildi ✓ | Onay: {termsAccepted ? '✓ Onaylandı' : '✗ Onaylanmadı'}
          </div>
        )}

        {/* Aksiyon Butonu */}
        <div className="w-full">
          <Button
            onClick={() => {
              console.log('Buton tıklandı - Durum:', { selected, selectedMode, termsAccepted })
              confirmBooking()
            }}
            disabled={selected === null || selectedMode === null || !termsAccepted || isBooking}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed py-4 text-lg font-semibold"
          >
            {isBooking ? '⏳ Rezervasyon Yapılıyor...' : 
             !selectedMode ? 'Önce Seans Türünü Seçin' :
             !selected ? 'Önce Saat Seçin' : 
             !termsAccepted ? 'Lütfen Bilgilendirme Metnini Onaylayın' :
             '✅ Randevuyu Onayla'}
          </Button>
        </div>

        {/* Bilgi Notu */}
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          <p className="font-medium mb-1">Önemli Notlar:</p>
          <ul className="list-disc ml-4 space-y-1">
            <li>Seçtiğiniz saatten itibaren 60 dakika boyunca seans devam eder</li>
            <li>Rezervasyon onaylandıktan sonra danışmanınızla iletişime geçilecektir</li>
            <li>Seansınız iptal edilmemektedir, uygun bir gün ve saate ertelenebilir</li>
            <li>En fazla 2 kez erteleme yapabilirsiniz</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
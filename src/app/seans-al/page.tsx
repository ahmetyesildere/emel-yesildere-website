'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, Clock, User, MapPin, Video, CreditCard, ArrowLeft, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/lib/auth/auth-context'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/toast-provider'
import { useRouter } from 'next/navigation'
import AuthModal from '@/components/auth/auth-modal'
import { LoadingSpinner, LoadingCard, ConsultantCardSkeleton, SessionTypeCardSkeleton } from '@/components/ui/loading-spinner'
import { BookingConfirmation } from '@/components/sessions/booking-confirmation'
import { PaymentModal } from '@/components/sessions/payment-modal'
import { CalendarSync } from '@/components/sessions/calendar-sync'
import { ReminderSettings } from '@/components/sessions/reminder-settings'
import { AvailabilityCalendar } from '@/components/sessions/availability-calendar'
import { RandevuWidget } from '@/components/sessions/randevu-widget'

interface SessionType {
  id: string
  name: string
  description: string
  duration_minutes: number
  price: number
  is_online: boolean
  is_in_person: boolean
}

interface Consultant {
  id: string
  first_name: string
  last_name: string
  email: string
  avatar_url?: string
  bio?: string
  specialties: string[]
}

interface TimeSlot {
  date: string
  start_time: string
  end_time: string
  is_available: boolean
  is_booked: boolean
}

const SessionBookingPage = () => {
  const { user, profile } = useAuth()
  const { success: showSuccess, error: showError } = useToast()
  const router = useRouter()

  // States
  const [step, setStep] = useState(1) // 1: Danışman seç, 2: Seans türü seç, 3: Tarih/saat seç, 4: Detaylar, 5: Onay
  const [sessionTypes, setSessionTypes] = useState<SessionType[]>([])
  const [consultants, setConsultants] = useState<Consultant[]>([])
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null)
  const [selectedSessionType, setSelectedSessionType] = useState<SessionType | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null)
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [sessionMode, setSessionMode] = useState<'online' | 'in_person'>('online')
  const [clientNotes, setClientNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isBooking, setIsBooking] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register')
  
  // Yeni özellikler için state'ler
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false)
  const [completedBooking, setCompletedBooking] = useState<any>(null)
  const [loadingConsultants, setLoadingConsultants] = useState(false)
  const [loadingSessionTypes, setLoadingSessionTypes] = useState(false)

  // Veri yükleme
  useEffect(() => {
    loadSessionTypes()
    loadConsultants()
  }, [])

  // Kullanıcı giriş yapmamışsa auth modal'ını göster
  useEffect(() => {
    if (!user) {
      setShowAuthModal(true)
      setAuthMode('register') // Varsayılan olarak kayıt formu
    } else {
      setShowAuthModal(false)
    }
  }, [user])

  // Danışman seçildiğinde tüm müsait günleri yükle
  useEffect(() => {
    if (selectedConsultant) {
      loadAllAvailableSlots()
    }
  }, [selectedConsultant])

  // Tarih seçildiğinde o tarihe özel saatleri filtrele
  useEffect(() => {
    if (selectedConsultant && selectedDate) {
      // availableSlots zaten yüklü, sadece filtreleme yapılacak
      console.log('📅 Tarih seçildi:', selectedDate)
    }
  }, [selectedDate])

  const loadSessionTypes = async () => {
    setLoadingSessionTypes(true)
    try {
      const { data, error } = await supabase
        .from('session_types')
        .select('*')
        .eq('is_active', true)
        .order('price')

      if (error) {
        console.error('Seans türleri yüklenirken hata:', error)
        
        // Fallback: Hardcoded session types
        const fallbackSessionTypes = [
          {
            id: 'fallback-1',
            name: 'Duygu Temizliği Seansı',
            description: 'Bilinçaltındaki olumsuz duyguların temizlenmesi ve iyileştirilmesi',
            duration_minutes: 60,
            price: 500.00,
            is_online: true,
            is_in_person: true,
            is_active: true
          },
          {
            id: 'fallback-2',
            name: 'Travma İyileştirme',
            description: 'Geçmiş travmaların işlenmesi ve iyileştirilmesi',
            duration_minutes: 120,
            price: 750.00,
            is_online: true,
            is_in_person: true,
            is_active: true
          },
          {
            id: 'fallback-3',
            name: 'Yaşam Koçluğu',
            description: 'Kişisel hedeflere ulaşma ve yaşam kalitesini artırma',
            duration_minutes: 60,
            price: 400.00,
            is_online: true,
            is_in_person: true,
            is_active: true
          },
          {
            id: 'fallback-4',
            name: 'Holistik Koçluk',
            description: 'Bütüncül yaklaşımla kişisel gelişim ve dönüşüm',
            duration_minutes: 60,
            price: 600.00,
            is_online: true,
            is_in_person: true,
            is_active: true
          }
        ]
        
        console.log('🔧 Fallback session types kullanılıyor')
        setSessionTypes(fallbackSessionTypes)
      } else {
        setSessionTypes(data || [])
      }
    } catch (error) {
      console.error('Seans türleri yüklenirken hata:', error)
      showError('Seans türleri yüklenemedi')
    } finally {
      setLoadingSessionTypes(false)
    }
  }

  const loadConsultants = async () => {
    setLoadingConsultants(true)
    console.log('🔍 Danışmanlar yükleniyor...')
    
    try {
      // Önce tüm profilleri kontrol et
      const { data: allProfiles, error: allError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, role, is_active')

      console.log('📊 Tüm profiller:', allProfiles)
      console.log('❌ Tüm profiller hatası:', allError)

      // Danışman profillerini getir (RLS bypass ile)
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name,
          email,
          avatar_url,
          bio
        `)
        .eq('role', 'consultant')

      console.log('👨‍⚕️ Danışman verileri:', data)
      console.log('❌ Danışman hatası:', error)

      if (error) throw error

      if (!data || data.length === 0) {
        console.log('⚠️ Hiç danışman bulunamadı!')
        showError('Henüz aktif danışman bulunmuyor')
        setConsultants([])
        return
      }

      // Her danışman için uzmanlık alanlarını yükle
      const consultantsWithSpecialties = await Promise.all(
        data.map(async (consultant) => {
          console.log(`🔍 ${consultant.first_name} için uzmanlık alanları yükleniyor...`)
          
          const { data: specialties, error: specialtyError } = await supabase
            .from('consultant_specialties')
            .select('specialty_area')
            .eq('consultant_id', consultant.id)

          console.log(`📋 ${consultant.first_name} uzmanlık alanları:`, specialties)
          console.log(`❌ ${consultant.first_name} uzmanlık hatası:`, specialtyError)

          return {
            ...consultant,
            specialties: specialties?.map(s => s.specialty_area) || []
          }
        })
      )

      console.log('✅ Tüm danışmanlar yüklendi:', consultantsWithSpecialties)
      setConsultants(consultantsWithSpecialties)
      
    } catch (error) {
      console.error('💥 Danışmanlar yüklenirken hata:', error)
      showError('Danışmanlar yüklenemedi: ' + error.message)
    } finally {
      setLoadingConsultants(false)
    }
  }

  const loadAllAvailableSlots = async () => {
    if (!selectedConsultant) return

    setIsLoading(true)
    console.log('🔍 Tüm müsait saatler yükleniyor...', { consultant: selectedConsultant.id })
    
    try {
      // Önümüzdeki 30 gün için varsayılan müsait saatler oluştur
      const slots: TimeSlot[] = []
      const today = new Date()
      
      for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
        const date = new Date(today)
        date.setDate(date.getDate() + dayOffset)
        const dateString = date.toISOString().split('T')[0]
        
        // Hafta sonu değilse saatler ekle (Pazartesi-Cuma)
        if (date.getDay() !== 0 && date.getDay() !== 6) {
          // Yeni sistem: 60 dakikalık periyotlar
          const fixedTimeSlots = [
            { start: '09:30', end: '10:30' },
            { start: '11:00', end: '12:00' },
            { start: '13:00', end: '14:00' },
            { start: '14:30', end: '15:30' },
            { start: '16:00', end: '17:00' },
            { start: '17:30', end: '18:30' }
          ]
          
          fixedTimeSlots.forEach(timeSlot => {
            slots.push({
              date: dateString,
              start_time: timeSlot.start,
              end_time: timeSlot.end,
              is_available: true,
              is_booked: false
            })
          })
        }
      }

      // 1. Önce time_slots tablosundan müsait olmayan saatleri kontrol et
      try {
        const endDate = new Date(today)
        endDate.setDate(endDate.getDate() + 30)
        
        const { data: timeSlots, error: timeSlotsError } = await supabase
          .from('time_slots')
          .select('date, start_time, is_available')
          .eq('consultant_id', selectedConsultant.id)
          .gte('date', today.toISOString().split('T')[0])
          .lte('date', endDate.toISOString().split('T')[0])

        if (!timeSlotsError && timeSlots) {
          console.log('🔒 Time slots kontrol ediliyor:', timeSlots.length)
          
          // time_slots tablosundaki is_available = false kayıtlarını işaretle
          timeSlots.forEach(timeSlot => {
            if (!timeSlot.is_available) {
              const slotIndex = slots.findIndex(slot => 
                slot.date === timeSlot.date && 
                slot.start_time === timeSlot.start_time
              )
              if (slotIndex !== -1) {
                slots[slotIndex].is_available = false
                slots[slotIndex].is_booked = true
                console.log(`🚫 Slot bloklandı: ${timeSlot.date} ${timeSlot.start_time}`)
              }
            }
          })
        }
      } catch (error) {
        console.warn('Time slots kontrol edilemedi:', error)
      }

      // 2. Rezerve edilmiş seansları kontrol et ve işaretle
      try {
        const { data: bookedSessions, error: sessionsError } = await supabase
          .from('sessions')
          .select('session_date, start_time, duration_minutes')
          .eq('consultant_id', selectedConsultant.id)
          .in('status', ['confirmed', 'pending'])
          .gte('session_date', today.toISOString().split('T')[0])

        if (!sessionsError && bookedSessions) {
          console.log('📝 Rezerve seanslar:', bookedSessions.length)
          
          // Rezerve edilmiş seansları işaretle - sadece o saati blokla
          bookedSessions.forEach(session => {
            const sessionStartTime = session.start_time
            
            // Sadece aynı başlangıç saatine sahip slotu blokla
            slots.forEach(slot => {
              if (slot.date === session.session_date && slot.start_time === sessionStartTime) {
                slot.is_booked = true
                slot.is_available = false
              }
            })
          })
        }
      } catch (error) {
        console.warn('Rezerve seanslar kontrol edilemedi:', error)
      }

      console.log('✅ Toplam müsait slot:', slots.filter(s => s.is_available).length)
      setAvailableSlots(slots)
      
    } catch (error) {
      console.error('💥 Müsait saatler yüklenirken hata:', error)
      
      // Fallback: Basit varsayılan saatler oluştur
      const fallbackSlots: TimeSlot[] = []
      const today = new Date()
      
      for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const date = new Date(today)
        date.setDate(date.getDate() + dayOffset)
        const dateString = date.toISOString().split('T')[0]
        
        if (date.getDay() !== 0 && date.getDay() !== 6) {
          // Basit fallback saatler
          const simpleTimes = ['10:00', '14:00', '16:00', '18:00']
          simpleTimes.forEach(time => {
            const [hours, minutes] = time.split(':').map(Number)
            const totalMinutes = hours * 60 + minutes + 90
            const endHours = Math.floor(totalMinutes / 60)
            const endMinutes = totalMinutes % 60
            const endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`
            
            fallbackSlots.push({
              date: dateString,
              start_time: time,
              end_time: endTime,
              is_available: true,
              is_booked: false
            })
          })
        }
      }
      
      setAvailableSlots(fallbackSlots)
      showError('Müsait saatler yüklenemedi, varsayılan saatler gösteriliyor')
    } finally {
      setIsLoading(false)
    }
  }



  // Saat çakışma kontrolü - seçilen saatten sonraki 1.5 saat boyunca çakışma var mı?
  const isTimeSlotConflicting = (timeSlot: string, bookedSlots: TimeSlot[]) => {
    const [hours, minutes] = timeSlot.split(':').map(Number)
    const slotStart = hours * 60 + minutes
    const slotEnd = slotStart + 90 // 1.5 saat

    return bookedSlots.some(booked => {
      const [bookedStartHours, bookedStartMinutes] = booked.start_time.split(':').map(Number)
      const [bookedEndHours, bookedEndMinutes] = booked.end_time.split(':').map(Number)
      const bookedStart = bookedStartHours * 60 + bookedStartMinutes
      const bookedEnd = bookedEndHours * 60 + bookedEndMinutes

      // Çakışma kontrolü: yeni seans mevcut seansla çakışıyor mu?
      return (slotStart < bookedEnd && slotEnd > bookedStart)
    })
  }

  const handleBookSession = async () => {
    if (!user || !selectedConsultant || !selectedSessionType || !selectedTimeSlot) {
      showError('Lütfen tüm bilgileri doldurun')
      return
    }

    setIsBooking(true)
    console.log('🚀 Seans oluşturma başlıyor...', {
      user: user.id,
      consultant: selectedConsultant.id,
      sessionType: selectedSessionType.id,
      date: selectedDate,
      timeSlot: selectedTimeSlot
    })

    try {
      const sessionData = {
        client_id: user.id,
        consultant_id: selectedConsultant.id,
        session_type_id: selectedSessionType.id,
        session_date: selectedDate,
        start_time: selectedTimeSlot.start_time,
        end_time: selectedTimeSlot.end_time,
        duration_minutes: 60, // 60 dakikalık seanslar
        type: sessionMode,
        price: selectedSessionType.price,
        client_notes: clientNotes || null,
        status: 'pending'
      }

      console.log('📊 Gönderilecek veri:', sessionData)

      const { data, error } = await supabase
        .from('sessions')
        .insert([sessionData])
        .select()

      console.log('📥 Supabase yanıtı:', { data, error })

      if (error) {
        console.error('❌ Supabase hatası:', error)
        throw error
      }

      console.log('✅ Seans başarıyla oluşturuldu:', data)
      
      // Tamamlanan rezervasyon bilgilerini kaydet
      const bookingData = {
        id: data[0].id,
        consultant: selectedConsultant,
        sessionType: selectedSessionType,
        date: selectedDate,
        startTime: selectedTimeSlot.start_time,
        endTime: selectedTimeSlot.end_time,
        mode: sessionMode,
        clientNotes: clientNotes
      }
      
      setCompletedBooking(bookingData)
      
      // Ödeme modalını göster
      setShowPaymentModal(true)

    } catch (error) {
      console.error('💥 Seans oluşturma hatası:', error)

      // Hata detaylarını göster
      if (error?.message) {
        showError(`Hata: ${error.message}`)
      } else if (error?.details) {
        showError(`Detay: ${error.details}`)
      } else {
        showError('Seans oluşturulurken bir hata oluştu')
      }
    } finally {
      setIsBooking(false)
    }
  }



  // Yeni handler fonksiyonları
  const handlePaymentSuccess = (paymentData: any) => {
    setShowPaymentModal(false)
    setShowBookingConfirmation(true)
    showSuccess('Ödeme başarıyla tamamlandı!')
  }

  const handlePaymentError = (error: string) => {
    setShowPaymentModal(false)
    showError(error)
  }

  const handleSendConfirmation = async (method: 'email' | 'sms' | 'both') => {
    // Email/SMS gönderme simülasyonu
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Gerçek uygulamada burada email/SMS API'leri çağrılacak
    console.log(`Confirmation sent via ${method}`)
  }

  const handleBookingConfirmationClose = () => {
    setShowBookingConfirmation(false)
    router.push('/client')
  }

  // Kullanıcı giriş yapmamışsa loading göster (auth modal açık olacak)
  if (!user) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Seans Rezervasyonu</h2>
              <p className="text-gray-600">Seans almak için giriş yapın veya kayıt olun.</p>
            </CardContent>
          </Card>
        </div>

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => {
            setShowAuthModal(false)
            router.push('/') // Ana sayfaya yönlendir
          }}
          initialMode={authMode}
        />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Seans Rezervasyonu</h1>
            <p className="text-gray-600">Uzman danışmanlarımızdan seans alın</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[
                { step: 1, title: 'Danışman' },
                { step: 2, title: 'Seans Türü' },
                { step: 3, title: 'Tarih & Saat' },
                { step: 4, title: 'Detaylar' },
                { step: 5, title: 'Onay' }
              ].map((item, index) => (
                <div key={item.step} className="flex items-center">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${step >= item.step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}
                  `}>
                    {item.step}
                  </div>
                  <span className={`ml-2 text-sm ${step >= item.step ? 'text-blue-600' : 'text-gray-500'}`}>
                    {item.title}
                  </span>
                  {index < 4 && (
                    <div className={`w-12 h-0.5 mx-4 ${step > item.step ? 'bg-blue-600' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <Card>
            <CardContent className="p-6">
              {/* Step 1: Danışman Seçimi */}
              {step === 1 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Danışman Seçin</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {loadingConsultants ? (
                      // Loading skeletons
                      Array.from({ length: 4 }).map((_, index) => (
                        <ConsultantCardSkeleton key={index} />
                      ))
                    ) : consultants.length > 0 ? (
                      consultants.map((consultant) => (
                      <div
                        key={consultant.id}
                        onClick={() => setSelectedConsultant(consultant)}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedConsultant?.id === consultant.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                          }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            {consultant.avatar_url ? (
                              <img
                                src={consultant.avatar_url}
                                alt={`${consultant.first_name} ${consultant.last_name}`}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <User className="w-6 h-6 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {consultant.first_name} {consultant.last_name}
                            </h4>
                            {consultant.bio && (
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {consultant.bio}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-1 mt-2">
                              {consultant.specialties.slice(0, 3).map((specialty, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {specialty}
                                </Badge>
                              ))}
                              {consultant.specialties.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{consultant.specialties.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                    ) : (
                      <div className="col-span-2 text-center py-8 text-gray-500">
                        <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Henüz danışman bulunmuyor</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Seans Türü Seçimi */}
              {step === 2 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Seans Türü Seçin</h3>
                  <div className="space-y-4">
                    {loadingSessionTypes ? (
                      // Loading skeletons
                      Array.from({ length: 3 }).map((_, index) => (
                        <SessionTypeCardSkeleton key={index} />
                      ))
                    ) : sessionTypes.length > 0 ? (
                      sessionTypes.map((sessionType) => (
                      <div
                        key={sessionType.id}
                        onClick={() => setSelectedSessionType(sessionType)}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedSessionType?.id === sessionType.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{sessionType.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{sessionType.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {sessionType.duration_minutes} dakika
                              </div>
                              <div className="flex items-center space-x-2">
                                {sessionType.is_online && (
                                  <Badge variant="outline" className="text-xs">
                                    <Video className="w-3 h-3 mr-1" />
                                    Online
                                  </Badge>
                                )}
                                {sessionType.is_in_person && (
                                  <Badge variant="outline" className="text-xs">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    Yüz Yüze
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">
                              ₺{sessionType.price}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Henüz seans türü bulunmuyor</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Tarih ve Saat Seçimi */}
              {step === 3 && (
                <div>
                  <h3 className="text-xl font-semibold mb-6">Tarih ve Saat Seçin</h3>
                  
                  {/* Seçenek: Hangi widget kullanılacak */}
                  <div className="mb-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <Button
                        variant={selectedDate ? "outline" : "default"}
                        onClick={() => setSelectedDate('')}
                        size="sm"
                      >
                        📅 Takvim Görünümü
                      </Button>
                      <Button
                        variant={selectedDate ? "default" : "outline"}
                        onClick={() => {
                          const today = new Date()
                          const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
                          setSelectedDate(dateString)
                        }}
                        size="sm"
                      >
                        ⚡ Hızlı Randevu Widget
                      </Button>
                    </div>
                  </div>

                  {/* Takvim Görünümü */}
                  {!selectedDate && (
                    <AvailabilityCalendar
                      consultantId={selectedConsultant?.id || ''}
                      selectedDate={selectedDate}
                      selectedTimeSlot={selectedTimeSlot}
                      onDateSelect={setSelectedDate}
                      onTimeSlotSelect={setSelectedTimeSlot}
                      availableSlots={availableSlots}
                      isLoading={isLoading}
                    />
                  )}

                  {/* Randevu Widget */}
                  {selectedDate && selectedConsultant && selectedSessionType && (
                    <RandevuWidget
                      consultantId={selectedConsultant.id}
                      consultant={selectedConsultant}
                      sessionTypeId={selectedSessionType.id}
                      sessionType={selectedSessionType}
                      selectedDate={selectedDate}
                      onConfirm={(booking) => {
                        console.log('✅ Rezervasyon tamamlandı:', booking)
                        setCompletedBooking(booking)
                        setShowBookingConfirmation(true)
                      }}
                      onCancel={() => setSelectedDate('')}
                    />
                  )}

                  {/* Eski Seçim Özeti (sadece takvim görünümü için) */}
                  {!selectedDate && selectedTimeSlot && (
                    <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 border-2 border-blue-200 rounded-xl shadow-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <Calendar className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h5 className="text-xl font-bold text-gray-900 mb-1">Seçiminiz Onaylandı</h5>
                            <p className="text-blue-700 font-medium">
                              {new Date(selectedDate + 'T12:00:00').toLocaleDateString('tr-TR', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </p>
                            <p className="text-green-700 font-semibold">
                              {selectedTimeSlot.start_time} - {selectedTimeSlot.end_time} (90 dakika)
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-green-600 mb-1">
                            ₺{selectedSessionType?.price}
                          </div>
                          <div className="text-sm text-gray-600">
                            {selectedSessionType?.duration_minutes} dakika
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Detaylar */}
              {step === 4 && selectedSessionType && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Seans Detayları</h3>

                  {/* Seans Modu */}
                  {selectedSessionType.is_online && selectedSessionType.is_in_person && (
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-3">Seans Türü</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => setSessionMode('online')}
                          className={`p-4 border rounded-lg transition-colors ${sessionMode === 'online'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                          <Video className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                          <div className="text-sm font-medium">Online Seans</div>
                          <div className="text-xs text-gray-600">Video görüşme ile</div>
                        </button>
                        <button
                          onClick={() => setSessionMode('in_person')}
                          className={`p-4 border rounded-lg transition-colors ${sessionMode === 'in_person'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                          <MapPin className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                          <div className="text-sm font-medium">Yüz Yüze Seans</div>
                          <div className="text-xs text-gray-600">Ofiste buluşma</div>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Notlar */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Notlarınız (Opsiyonel)</h4>
                    <Textarea
                      value={clientNotes}
                      onChange={(e) => setClientNotes(e.target.value)}
                      placeholder="Danışmanınızla paylaşmak istediğiniz özel notlar, beklentiler veya sorular..."
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {/* Step 5: Onay */}
              {step === 5 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Rezervasyon Özeti</h3>

                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Danışman</h4>
                      <p>{selectedConsultant?.first_name} {selectedConsultant?.last_name}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Seans Türü</h4>
                      <p>{selectedSessionType?.name}</p>
                      <p className="text-sm text-gray-600">{selectedSessionType?.duration_minutes} dakika</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Tarih ve Saat</h4>
                      <p>{selectedDate && new Date(selectedDate + 'T12:00:00').toLocaleDateString('tr-TR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</p>
                      <p>{selectedTimeSlot?.start_time.slice(0, 5)} - {selectedTimeSlot?.end_time.slice(0, 5)}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Seans Türü</h4>
                      <p>{sessionMode === 'online' ? 'Online (Video Görüşme)' : 'Yüz Yüze'}</p>
                    </div>

                    {clientNotes && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Notlarınız</h4>
                        <p className="text-sm text-gray-600">{clientNotes}</p>
                      </div>
                    )}

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">Toplam Ücret</span>
                        <span className="text-2xl font-bold text-blue-600">
                          ₺{selectedSessionType?.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setStep(Math.max(1, step - 1))}
                  disabled={step === 1}
                  className="flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Geri
                </Button>

                {step < 5 ? (
                  <Button
                    onClick={() => {
                      if (step === 1 && !selectedConsultant) {
                        showError('Lütfen bir danışman seçin')
                        return
                      }
                      if (step === 2 && !selectedSessionType) {
                        showError('Lütfen bir seans türü seçin')
                        return
                      }
                      if (step === 3 && (!selectedDate || !selectedTimeSlot)) {
                        showError('Lütfen tarih ve saat seçin')
                        return
                      }
                      setStep(step + 1)
                    }}
                    className="flex items-center"
                  >
                    İleri
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleBookSession}
                    disabled={isBooking}
                    className="bg-green-600 hover:bg-green-700 flex items-center"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {isBooking ? 'Rezervasyon Yapılıyor...' : 'Rezervasyonu Onayla'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>



      {/* Payment Modal */}
      {showPaymentModal && completedBooking && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          booking={completedBooking}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        />
      )}

      {/* Booking Confirmation Modal */}
      {showBookingConfirmation && completedBooking && (
        <BookingConfirmation
          booking={completedBooking}
          onClose={handleBookingConfirmationClose}
          onSendConfirmation={handleSendConfirmation}
        />
      )}

      {/* Auth Modal - Eğer kullanıcı çıkış yaparsa tekrar göster */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false)
          router.push('/') // Ana sayfaya yönlendir
        }}
        initialMode={authMode}
      />
    </div>
  )
}

export default SessionBookingPage
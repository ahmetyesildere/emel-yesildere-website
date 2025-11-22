'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, Clock, User, Phone, Mail, FileText, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/lib/auth/auth-context'
import { supabase } from '@/lib/supabase'
import { useToast, Toast } from '@/components/ui/toast'

interface Consultant {
  id: string
  full_name: string
  email: string
  specialties: string[]
}

interface AvailableSlot {
  time: string
  isAvailable: boolean
}

const SessionCreateForm = () => {
  const { user } = useAuth()
  const { toast, showToast, hideToast, success, error } = useToast()
  
  // Form state
  const [consultants, setConsultants] = useState<Consultant[]>([])
  const [selectedConsultant, setSelectedConsultant] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([])
  
  // Client info
  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  
  // Session details
  const [sessionTitle, setSessionTitle] = useState('')
  const [sessionDescription, setSessionDescription] = useState('')
  const [sessionTypeId, setSessionTypeId] = useState('')
  const [sessionTypes, setSessionTypes] = useState<any[]>([])
  const [selectedSessionType, setSelectedSessionType] = useState<any>(null)
  
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Fiyat formatlama fonksiyonu
  const formatPrice = (value: number): string => {
    return new Intl.NumberFormat('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  // Danışmanları ve seans türlerini yükle
  useEffect(() => {
    loadConsultants()
    loadSessionTypes()
  }, [])

  const loadConsultants = async () => {
    try {
      console.log('🔍 Danışmanlar yükleniyor...')
      
      // Önce basit sorgu ile danışmanları yükle
      const { data: consultantsData, error: consultantsError } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('role', 'consultant')
        .eq('is_active', true)

      console.log('📊 Danışmanlar sorgu sonucu:', { data: consultantsData, error: consultantsError })

      if (consultantsError) throw consultantsError

      // Her danışman için uzmanlık alanlarını ayrı ayrı yükle
      const consultantsWithSpecialties = await Promise.all(
        (consultantsData || []).map(async (consultant) => {
          const { data: specialtiesData } = await supabase
            .from('consultant_specialties')
            .select('specialty_area')
            .eq('consultant_id', consultant.id)

          return {
            id: consultant.id,
            full_name: consultant.full_name || 'İsimsiz Danışman',
            email: consultant.email,
            specialties: specialtiesData?.map(s => s.specialty_area) || []
          }
        })
      )

      console.log('✅ Danışmanlar yüklendi:', consultantsWithSpecialties)
      setConsultants(consultantsWithSpecialties)
    } catch (error) {
      console.error('❌ Danışman yükleme hatası:', error)
      showToast('Danışmanlar yüklenirken hata oluştu', 'error')
    }
  }

  const loadSessionTypes = async () => {
    try {
      console.log('🔍 Seans türleri yükleniyor...')
      
      // Önce display_order ile dene
      let { data: sessionTypesData, error: sessionTypesError } = await supabase
        .from('session_types')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      // Eğer display_order kolonu yoksa, alfabetik sırala
      if (sessionTypesError && sessionTypesError.message.includes('display_order')) {
        console.log('⚠️ display_order kolonu bulunamadı, alfabetik sıralama kullanılıyor')
        
        const fallbackResult = await supabase
          .from('session_types')
          .select('*')
          .eq('is_active', true)
          .order('name', { ascending: true })
        
        sessionTypesData = fallbackResult.data
        sessionTypesError = fallbackResult.error
      }

      console.log('📊 Seans türleri sorgu sonucu:', { data: sessionTypesData, error: sessionTypesError })

      if (sessionTypesError) throw sessionTypesError

      setSessionTypes(sessionTypesData || [])
      console.log('✅ Seans türleri yüklendi:', sessionTypesData)
    } catch (error) {
      console.error('❌ Seans türleri yükleme hatası:', error)
      showToast('Seans türleri yüklenirken hata oluştu', 'error')
    }
  }

  // Danışman seçildiğinde müsait saatleri yükle
  useEffect(() => {
    if (selectedConsultant && selectedDate) {
      loadAvailableSlots()
    }
  }, [selectedConsultant, selectedDate])

  // Seans türü seçildiğinde detayları güncelle
  useEffect(() => {
    if (sessionTypeId) {
      const selectedType = sessionTypes.find(type => type.id === sessionTypeId)
      setSelectedSessionType(selectedType)
    } else {
      setSelectedSessionType(null)
    }
  }, [sessionTypeId, sessionTypes])

  const loadAvailableSlots = async () => {
    if (!selectedConsultant || !selectedDate) return

    setIsLoading(true)
    try {
      // 1. Bu gün kapalı mı kontrol et
      const { data: dailyAvailability } = await supabase
        .from('daily_availability')
        .select('*')
        .eq('consultant_id', selectedConsultant)
        .eq('date', selectedDate)
        .single()

      // Eğer gün kapalıysa
      if (dailyAvailability && !dailyAvailability.is_available) {
        setAvailableSlots([])
        return
      }

      // 2. Müsait olmayan saatleri al
      const { data: timeSlots } = await supabase
        .from('time_slots')
        .select('*')
        .eq('consultant_id', selectedConsultant)
        .eq('date', selectedDate)

      // 3. Mevcut seansları al
      const { data: existingSessions } = await supabase
        .from('sessions')
        .select('session_date')
        .eq('consultant_id', selectedConsultant)
        .gte('session_date', `${selectedDate}T00:00:00`)
        .lt('session_date', `${selectedDate}T23:59:59`)
        .in('status', ['scheduled', 'completed'])

      // 4. Tüm saat dilimlerini oluştur
      const TIME_SLOTS = [
        '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
        '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00',
        '16:30', '17:00', '17:30', '18:00', '18:30'
      ]

      const slots = TIME_SLOTS.map(time => {
        // Müsait olmayan saatleri kontrol et
        const unavailableSlot = timeSlots?.find(slot => 
          slot.start_time.substring(0, 5) === time && !slot.is_available
        )

        // Mevcut seans var mı kontrol et
        const existingSession = existingSessions?.find(session => {
          const sessionTime = new Date(session.session_date).toTimeString().substring(0, 5)
          return sessionTime === time
        })

        return {
          time,
          isAvailable: !unavailableSlot && !existingSession
        }
      })

      setAvailableSlots(slots)
    } catch (error) {
      console.error('Müsait saatler yükleme hatası:', error)
      showToast('Müsait saatler yüklenirken hata oluştu', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedConsultant || !selectedDate || !selectedTime || !clientName) {
      error('Lütfen tüm gerekli alanları doldurun')
      return
    }

    setIsSaving(true)
    try {
      // 1. Müşteri profili oluştur veya bul
      let clientId = null
      
      if (clientEmail) {
        // Email ile müşteri ara
        const { data: existingClient } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', clientEmail)
          .single()

        if (existingClient) {
          clientId = existingClient.id
        } else {
          // Yeni müşteri oluştur
          const { data: newClient, error: clientError } = await supabase
            .from('profiles')
            .insert({
              email: clientEmail,
              full_name: clientName,
              phone: clientPhone,
              role: 'client'
            })
            .select('id')
            .single()

          if (clientError) throw clientError
          clientId = newClient.id
        }
      } else {
        // Email yoksa geçici müşteri oluştur
        const { data: tempClient, error: tempClientError } = await supabase
          .from('profiles')
          .insert({
            email: `temp_${Date.now()}@temp.com`,
            full_name: clientName,
            phone: clientPhone,
            role: 'client'
          })
          .select('id')
          .single()

        if (tempClientError) throw tempClientError
        clientId = tempClient.id
      }

      // 2. Seans oluştur
      const sessionDateTime = `${selectedDate}T${selectedTime}:00`
      
      const { error: sessionError } = await supabase
        .from('sessions')
        .insert({
          client_id: clientId,
          consultant_id: selectedConsultant,
          title: sessionTitle || 'Danışmanlık Seansı',
          description: sessionDescription,
          session_date: sessionDateTime,
          duration_minutes: selectedSessionType?.duration_minutes || 60,
          session_type_id: sessionTypeId,
          status: 'scheduled'
        })

      if (sessionError) throw sessionError

      success('Seans başarıyla oluşturuldu!')
      
      // Form'u temizle
      setSelectedConsultant('')
      setSelectedDate('')
      setSelectedTime('')
      setClientName('')
      setClientPhone('')
      setClientEmail('')
      setSessionTitle('')
      setSessionDescription('')
      setAvailableSlots([])

    } catch (error) {
      console.error('Seans oluşturma hatası:', error)
      showToast('Seans oluşturulurken hata oluştu', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sol Kolon - Danışman ve Tarih/Saat Seçimi */}
          <div className="space-y-6">
            {/* Danışman Seçimi */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Danışman Seçimi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <select
                  value={selectedConsultant}
                  onChange={(e) => setSelectedConsultant(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Danışman seçin...</option>
                  {consultants.map(consultant => (
                    <option key={consultant.id} value={consultant.id}>
                      {consultant.full_name} - {consultant.specialties.join(', ')}
                    </option>
                  ))}
                </select>
              </CardContent>
            </Card>

            {/* Tarih Seçimi */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Tarih Seçimi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </CardContent>
            </Card>

            {/* Saat Seçimi */}
            {selectedConsultant && selectedDate && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Saat Seçimi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Müsait saatler yükleniyor...</p>
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      <p>Bu tarih için müsait saat bulunmuyor</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {availableSlots.map(slot => (
                        <button
                          key={slot.time}
                          type="button"
                          onClick={() => slot.isAvailable && setSelectedTime(slot.time)}
                          disabled={!slot.isAvailable}
                          className={`p-2 rounded-lg border text-sm font-medium transition-colors ${
                            selectedTime === slot.time
                              ? 'bg-blue-600 text-white border-blue-600'
                              : slot.isAvailable
                                ? 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300'
                                : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sağ Kolon - Müşteri Bilgileri ve Seans Detayları */}
          <div className="space-y-6">
            {/* Müşteri Bilgileri */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Müşteri Bilgileri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Müşteri adı soyadı"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0555 123 45 67"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Mail className="w-4 h-4 inline mr-1" />
                    E-posta
                  </label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ornek@email.com"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Seans Detayları */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Seans Detayları
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Seans Başlığı
                  </label>
                  <input
                    type="text"
                    value={sessionTitle}
                    onChange={(e) => setSessionTitle(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Danışmanlık Seansı"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Açıklama
                  </label>
                  <textarea
                    value={sessionDescription}
                    onChange={(e) => setSessionDescription(e.target.value)}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Seans hakkında notlar..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Seans Türü *
                    </label>
                    <select
                      value={sessionTypeId}
                      onChange={(e) => setSessionTypeId(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Seans türü seçin</option>
                      {sessionTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name} - {type.duration_minutes} dk - {formatPrice(type.price)} ₺
                        </option>
                      ))}
                    </select>
                    {selectedSessionType && (
                      <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-700">
                        <div className="flex items-center justify-between">
                          <span>Süre: {selectedSessionType.duration_minutes} dakika</span>
                          <span>Fiyat: {formatPrice(selectedSessionType.price)} ₺</span>
                        </div>
                        {selectedSessionType.description && (
                          <p className="mt-1 text-xs">{selectedSessionType.description}</p>
                        )}
                        <div className="flex space-x-2 mt-1">
                          {selectedSessionType.is_online && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800">
                              Online
                            </span>
                          )}
                          {selectedSessionType.is_in_person && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-purple-100 text-purple-800">
                              Yüz Yüze
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Seans Modu
                    </label>
                    <select
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={!selectedSessionType}
                    >
                      <option value="">
                        {selectedSessionType ? 'Seans modu seçin' : 'Önce seans türü seçin'}
                      </option>
                      {selectedSessionType?.is_online && (
                        <option value="online">Online Seans</option>
                      )}
                      {selectedSessionType?.is_in_person && (
                        <option value="in_person">Yüz Yüze Seans</option>
                      )}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Kaydet Butonu */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSaving || !selectedConsultant || !selectedDate || !selectedTime || !clientName || !sessionTypeId}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 px-8 py-3"
          >
            <Save className="w-5 h-5 mr-2" />
            {isSaving ? 'Kaydediliyor...' : 'Seans Oluştur'}
          </Button>
        </div>
      </form>

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

export default SessionCreateForm
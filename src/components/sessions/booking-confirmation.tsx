'use client'

import React, { useState } from 'react'
import { CheckCircle, Mail, MessageSquare, Calendar, Clock, User, MapPin, Video } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface BookingConfirmationProps {
  booking: {
    id: string
    consultant: {
      first_name: string
      last_name: string
      email: string
    }
    sessionType: {
      name: string
      duration_minutes: number
      price: number
    }
    date: string
    startTime: string
    endTime: string
    mode: 'online' | 'in_person'
    clientNotes?: string
  }
  onClose: () => void
  onSendConfirmation: (method: 'email' | 'sms' | 'both') => Promise<void>
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  booking,
  onClose,
  onSendConfirmation
}) => {
  const [sendingConfirmation, setSendingConfirmation] = useState(false)
  const [confirmationSent, setConfirmationSent] = useState(false)

  const handleSendConfirmation = async (method: 'email' | 'sms' | 'both') => {
    setSendingConfirmation(true)
    try {
      await onSendConfirmation(method)
      setConfirmationSent(true)
    } catch (error) {
      console.error('Onay gönderilirken hata:', error)
    } finally {
      setSendingConfirmation(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T12:00:00').toLocaleDateString('tr-TR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center bg-gradient-to-r from-green-50 to-blue-50">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-green-700">
            Rezervasyon Başarılı!
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Seans rezervasyonunuz başarıyla oluşturuldu.
          </p>
        </CardHeader>

        <CardContent className="p-6">
          {/* Rezervasyon Detayları */}
          <div className="space-y-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <User className="w-5 h-5 text-blue-600 mr-2" />
                <h4 className="font-medium text-gray-900">Danışman</h4>
              </div>
              <p className="text-gray-700">
                {booking.consultant.first_name} {booking.consultant.last_name}
              </p>
              <p className="text-sm text-gray-600">{booking.consultant.email}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Calendar className="w-5 h-5 text-green-600 mr-2" />
                <h4 className="font-medium text-gray-900">Seans Bilgileri</h4>
              </div>
              <p className="text-gray-700 font-medium">{booking.sessionType.name}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {booking.sessionType.duration_minutes} dakika
                </div>
                <div className="flex items-center">
                  {booking.mode === 'online' ? (
                    <>
                      <Video className="w-4 h-4 mr-1" />
                      Online
                    </>
                  ) : (
                    <>
                      <MapPin className="w-4 h-4 mr-1" />
                      Yüz Yüze
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Clock className="w-5 h-5 text-purple-600 mr-2" />
                <h4 className="font-medium text-gray-900">Tarih ve Saat</h4>
              </div>
              <p className="text-gray-700 font-medium">{formatDate(booking.date)}</p>
              <p className="text-gray-600">
                {booking.startTime.slice(0, 5)} - {booking.endTime.slice(0, 5)}
              </p>
            </div>

            {booking.clientNotes && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Notlarınız</h4>
                <p className="text-sm text-gray-600">{booking.clientNotes}</p>
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">Toplam Ücret</span>
                <span className="text-2xl font-bold text-blue-600">
                  ₺{booking.sessionType.price}
                </span>
              </div>
            </div>
          </div>

          {/* Onay Gönderme */}
          {!confirmationSent ? (
            <div className="border-t pt-6">
              <h4 className="font-medium text-gray-900 mb-4">Onay Bildirimi Gönder</h4>
              <p className="text-sm text-gray-600 mb-4">
                Rezervasyon onayınızı nasıl almak istiyorsunuz?
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                <Button
                  onClick={() => handleSendConfirmation('email')}
                  disabled={sendingConfirmation}
                  variant="outline"
                  className="flex items-center justify-center"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
                
                <Button
                  onClick={() => handleSendConfirmation('sms')}
                  disabled={sendingConfirmation}
                  variant="outline"
                  className="flex items-center justify-center"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  SMS
                </Button>
                
                <Button
                  onClick={() => handleSendConfirmation('both')}
                  disabled={sendingConfirmation}
                  className="flex items-center justify-center bg-blue-600 hover:bg-blue-700"
                >
                  <Mail className="w-4 h-4 mr-1" />
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Her İkisi
                </Button>
              </div>

              {sendingConfirmation && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Onay bildirimi gönderiliyor...</p>
                </div>
              )}
            </div>
          ) : (
            <div className="border-t pt-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-medium text-green-700 mb-2">Onay Bildirimi Gönderildi!</h4>
              <p className="text-sm text-gray-600 mb-4">
                Rezervasyon onayınız başarıyla gönderildi. Kısa süre içinde bildirim alacaksınız.
              </p>
            </div>
          )}

          {/* Alt Butonlar */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 mr-3"
            >
              Kapat
            </Button>
            
            <Button
              onClick={() => window.location.href = '/client'}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Panelime Git
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
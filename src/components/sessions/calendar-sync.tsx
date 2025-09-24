'use client'

import React, { useState } from 'react'
import { Calendar, ExternalLink, Download, Share2, Clock, MapPin, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface CalendarSyncProps {
  booking: {
    id: string
    sessionType: {
      name: string
      duration_minutes: number
    }
    consultant: {
      first_name: string
      last_name: string
      email: string
    }
    date: string
    startTime: string
    endTime: string
    mode: 'online' | 'in_person'
    meetingLink?: string
    location?: string
    clientNotes?: string
  }
}

export const CalendarSync: React.FC<CalendarSyncProps> = ({ booking }) => {
  const [isGenerating, setIsGenerating] = useState(false)

  // Google Calendar URL oluştur
  const generateGoogleCalendarUrl = () => {
    const startDateTime = new Date(`${booking.date}T${booking.startTime}`)
    const endDateTime = new Date(`${booking.date}T${booking.endTime}`)
    
    const formatDateTime = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: `${booking.sessionType.name} - ${booking.consultant.first_name} ${booking.consultant.last_name}`,
      dates: `${formatDateTime(startDateTime)}/${formatDateTime(endDateTime)}`,
      details: `
Seans Türü: ${booking.sessionType.name}
Danışman: ${booking.consultant.first_name} ${booking.consultant.last_name}
Süre: ${booking.sessionType.duration_minutes} dakika
Tür: ${booking.mode === 'online' ? 'Online Seans' : 'Yüz Yüze Seans'}

${booking.mode === 'online' && booking.meetingLink ? `Toplantı Linki: ${booking.meetingLink}` : ''}
${booking.mode === 'in_person' && booking.location ? `Konum: ${booking.location}` : ''}

${booking.clientNotes ? `Notlar: ${booking.clientNotes}` : ''}

Rezervasyon ID: ${booking.id}
      `.trim(),
      location: booking.mode === 'online' ? 'Online' : (booking.location || 'Ofis'),
      sprop: 'website:emelyesildere.com'
    })

    return `https://calendar.google.com/calendar/render?${params.toString()}`
  }

  // Outlook Calendar URL oluştur
  const generateOutlookCalendarUrl = () => {
    const startDateTime = new Date(`${booking.date}T${booking.startTime}`)
    const endDateTime = new Date(`${booking.date}T${booking.endTime}`)

    const params = new URLSearchParams({
      path: '/calendar/action/compose',
      rru: 'addevent',
      subject: `${booking.sessionType.name} - ${booking.consultant.first_name} ${booking.consultant.last_name}`,
      startdt: startDateTime.toISOString(),
      enddt: endDateTime.toISOString(),
      body: `
Seans Türü: ${booking.sessionType.name}
Danışman: ${booking.consultant.first_name} ${booking.consultant.last_name}
Süre: ${booking.sessionType.duration_minutes} dakika
Tür: ${booking.mode === 'online' ? 'Online Seans' : 'Yüz Yüze Seans'}

${booking.mode === 'online' && booking.meetingLink ? `Toplantı Linki: ${booking.meetingLink}` : ''}
${booking.mode === 'in_person' && booking.location ? `Konum: ${booking.location}` : ''}

${booking.clientNotes ? `Notlar: ${booking.clientNotes}` : ''}

Rezervasyon ID: ${booking.id}
      `.trim(),
      location: booking.mode === 'online' ? 'Online' : (booking.location || 'Ofis')
    })

    return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`
  }

  // ICS dosyası oluştur ve indir
  const generateICSFile = () => {
    setIsGenerating(true)
    
    const startDateTime = new Date(`${booking.date}T${booking.startTime}`)
    const endDateTime = new Date(`${booking.date}T${booking.endTime}`)
    
    const formatICSDateTime = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Emel Yeşildere//Seans Rezervasyonu//TR
BEGIN:VEVENT
UID:${booking.id}@emelyesildere.com
DTSTAMP:${formatICSDateTime(new Date())}
DTSTART:${formatICSDateTime(startDateTime)}
DTEND:${formatICSDateTime(endDateTime)}
SUMMARY:${booking.sessionType.name} - ${booking.consultant.first_name} ${booking.consultant.last_name}
DESCRIPTION:Seans Türü: ${booking.sessionType.name}\\nDanışman: ${booking.consultant.first_name} ${booking.consultant.last_name}\\nSüre: ${booking.sessionType.duration_minutes} dakika\\nTür: ${booking.mode === 'online' ? 'Online Seans' : 'Yüz Yüze Seans'}\\n\\n${booking.mode === 'online' && booking.meetingLink ? `Toplantı Linki: ${booking.meetingLink}\\n` : ''}${booking.mode === 'in_person' && booking.location ? `Konum: ${booking.location}\\n` : ''}\\n${booking.clientNotes ? `Notlar: ${booking.clientNotes}\\n` : ''}\\nRezervasyon ID: ${booking.id}
LOCATION:${booking.mode === 'online' ? 'Online' : (booking.location || 'Ofis')}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `seans-${booking.id}.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    setTimeout(() => setIsGenerating(false), 1000)
  }

  // Paylaşım URL'si oluştur
  const generateShareUrl = () => {
    const shareText = `${booking.sessionType.name} seansım ${new Date(booking.date + 'T12:00:00').toLocaleDateString('tr-TR')} tarihinde ${booking.startTime.slice(0, 5)}'da başlayacak.`
    
    if (navigator.share) {
      navigator.share({
        title: 'Seans Rezervasyonu',
        text: shareText,
        url: window.location.origin + '/seans-al'
      })
    } else {
      // Fallback: clipboard'a kopyala
      navigator.clipboard.writeText(shareText)
      alert('Seans bilgisi panoya kopyalandı!')
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
    <Card className="mt-6">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Calendar className="w-5 h-5 text-blue-600 mr-2" />
          <h4 className="font-medium text-gray-900">Takvime Ekle</h4>
        </div>

        {/* Seans Özeti */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h5 className="font-semibold text-gray-900 mb-2">
                {booking.sessionType.name}
              </h5>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(booking.date)}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {booking.startTime.slice(0, 5)} - {booking.endTime.slice(0, 5)} ({booking.sessionType.duration_minutes} dk)
                </div>
                <div className="flex items-center">
                  {booking.mode === 'online' ? (
                    <>
                      <Video className="w-4 h-4 mr-2" />
                      Online Seans
                    </>
                  ) : (
                    <>
                      <MapPin className="w-4 h-4 mr-2" />
                      Yüz Yüze Seans
                    </>
                  )}
                </div>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800">
              Onaylandı
            </Badge>
          </div>
        </div>

        {/* Takvim Seçenekleri */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <Button
            onClick={() => window.open(generateGoogleCalendarUrl(), '_blank')}
            variant="outline"
            className="flex items-center justify-center"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Google Calendar
            <ExternalLink className="w-3 h-3 ml-2" />
          </Button>

          <Button
            onClick={() => window.open(generateOutlookCalendarUrl(), '_blank')}
            variant="outline"
            className="flex items-center justify-center"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Outlook Calendar
            <ExternalLink className="w-3 h-3 ml-2" />
          </Button>

          <Button
            onClick={generateICSFile}
            disabled={isGenerating}
            variant="outline"
            className="flex items-center justify-center"
          >
            <Download className="w-4 h-4 mr-2" />
            {isGenerating ? 'Oluşturuluyor...' : 'ICS Dosyası İndir'}
          </Button>

          <Button
            onClick={generateShareUrl}
            variant="outline"
            className="flex items-center justify-center"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Paylaş
          </Button>
        </div>

        {/* Bilgi Notu */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-700">
            <strong>İpucu:</strong> Seansınızı takviminize ekleyerek hatırlatma alabilir ve 
            toplantı linkine kolayca erişebilirsiniz.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
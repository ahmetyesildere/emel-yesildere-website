'use client'

import React, { useState } from 'react'
import { Calendar, X, AlertCircle, Clock, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/toast-provider'

interface SessionActionsProps {
  session: {
    id: string
    session_date: string
    start_time: string
    end_time?: string
    status: string
    reschedule_count?: number
    consultant_id: string
  }
  onSuccess?: () => void
}

export const SessionActions: React.FC<SessionActionsProps> = ({ session, onSuccess }) => {
  const { success: showSuccess, error: showError } = useToast()
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const [rescheduleReason, setRescheduleReason] = useState('')
  const [newDate, setNewDate] = useState('')
  const [newStartTime, setNewStartTime] = useState('')
  const [newEndTime, setNewEndTime] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  // Seansın ertelenip ertelenemeyeceğini kontrol et
  const canReschedule = () => {
    if (session.status === 'cancelled' || session.status === 'completed') {
      return { can: false, reason: 'Bu seans ertelenemez' }
    }

    const rescheduleCount = session.reschedule_count || 0
    if (rescheduleCount >= 2) {
      return { 
        can: false, 
        reason: 'Bu seans maksimum erteleme sayısına ulaştı (2 kez)' 
      }
    }

    const sessionDate = new Date(session.session_date)
    const now = new Date()
    const hoursUntilSession = (sessionDate.getTime() - now.getTime()) / (1000 * 60 * 60)

    if (hoursUntilSession < 24) {
      return { 
        can: false, 
        reason: `Seansınıza ${Math.round(hoursUntilSession)} saat kaldı. En az 24 saat önceden ertelenmelidir.` 
      }
    }

    return { 
      can: true, 
      reason: '',
      remainingReschedules: 2 - rescheduleCount
    }
  }

  const handleReschedule = async () => {
    if (!newDate || !newStartTime) {
      showError('Lütfen yeni tarih ve saat seçin')
      return
    }

    if (!rescheduleReason.trim()) {
      showError('Lütfen erteleme nedenini belirtin')
      return
    }

    setIsProcessing(true)
    try {
      const response = await fetch('/api/sessions/reschedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          newDate,
          newStartTime,
          newEndTime: newEndTime || undefined,
          reason: rescheduleReason
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erteleme işlemi başarısız')
      }

      showSuccess(`Seansınız başarıyla ertelendi. Kalan erteleme hakkınız: ${data.remainingReschedules} kez. Ücret iadesi yapılmayacaktır.`)
      setShowRescheduleModal(false)
      setRescheduleReason('')
      setNewDate('')
      setNewStartTime('')
      setNewEndTime('')
      onSuccess?.()
    } catch (error: any) {
      showError(error.message || 'Erteleme işlemi sırasında hata oluştu')
    } finally {
      setIsProcessing(false)
    }
  }

  const rescheduleCheck = canReschedule()

  return (
    <div className="space-y-4">
      {/* Önemli Bilgilendirme */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-blue-800 font-medium mb-2">
          ℹ️ Önemli Bilgilendirme
        </p>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>Seansınız iptal edilmemektedir</li>
          <li>Ücret iadesi yapılmayacaktır</li>
          <li>Seansınız uygun bir gün ve saate ertelenebilir</li>
          <li>En fazla 2 kez erteleme yapabilirsiniz</li>
        </ul>
      </div>

      {/* Action Button */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={() => setShowRescheduleModal(true)}
          disabled={!rescheduleCheck.can}
          className="flex items-center"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Seansı Ertele
        </Button>
      </div>

      {/* Info Messages */}
      {!rescheduleCheck.can && (
        <div className="flex items-start space-x-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{rescheduleCheck.reason}</span>
        </div>
      )}

      {rescheduleCheck.can && rescheduleCheck.remainingReschedules !== undefined && (
        <div className="flex items-start space-x-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>Kalan erteleme hakkınız: {rescheduleCheck.remainingReschedules} kez</span>
        </div>
      )}



      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Seansı Ertele
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 font-medium mb-2">
                  ℹ️ Önemli Bilgilendirme
                </p>
                <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                  <li>Seansınız iptal edilmemektedir</li>
                  <li>Ücret iadesi yapılmayacaktır</li>
                  <li>Seansınız uygun bir gün ve saate ertelenebilir</li>
                  <li>En fazla 2 kez erteleme yapabilirsiniz</li>
                  <li>Kalan erteleme hakkınız: {rescheduleCheck.remainingReschedules} kez</li>
                </ul>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yeni Tarih *
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Başlangıç Saati *
                  </label>
                  <input
                    type="time"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bitiş Saati
                  </label>
                  <input
                    type="time"
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Erteleme Nedeni *
                </label>
                <Textarea
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  placeholder="Lütfen erteleme nedeninizi belirtin..."
                  rows={3}
                  className="w-full"
                />
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRescheduleModal(false)
                    setRescheduleReason('')
                    setNewDate('')
                    setNewStartTime('')
                    setNewEndTime('')
                  }}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  Vazgeç
                </Button>
                <Button
                  onClick={handleReschedule}
                  disabled={isProcessing || !newDate || !newStartTime || !rescheduleReason.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {isProcessing ? 'Erteleniyor...' : 'Seansı Ertele'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

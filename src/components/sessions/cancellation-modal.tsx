'use client'

import React, { useState } from 'react'
import { X, AlertTriangle, Calendar, Clock, User, RefreshCw, Ban } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/toast-provider'

interface CancellationModalProps {
  isOpen: boolean
  onClose: () => void
  session: {
    id: string
    sessionType: {
      name: string
      price: number
    }
    consultant: {
      first_name: string
      last_name: string
    }
    date: string
    startTime: string
    endTime: string
    status: string
  }
  onCancellationSuccess: () => void
}

interface CancellationPolicy {
  timeframe: number // hours before session
  refundPercentage: number
  description: string
}

export const CancellationModal: React.FC<CancellationModalProps> = ({
  isOpen,
  onClose,
  session,
  onCancellationSuccess
}) => {
  const { success: showSuccess, error: showError } = useToast()
  const [cancellationReason, setCancellationReason] = useState('')
  const [selectedReason, setSelectedReason] = useState('')
  const [isCancelling, setIsCancelling] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const cancellationReasons = [
    'Kişisel nedenler',
    'Sağlık sorunu',
    'İş/okul çakışması',
    'Acil durum',
    'Finansal nedenler',
    'Danışman değişikliği talebi',
    'Diğer'
  ]

  const cancellationPolicies: CancellationPolicy[] = [
    {
      timeframe: 48,
      refundPercentage: 100,
      description: '48 saat öncesine kadar tam iade'
    },
    {
      timeframe: 24,
      refundPercentage: 75,
      description: '24-48 saat arası %75 iade'
    },
    {
      timeframe: 2,
      refundPercentage: 50,
      description: '2-24 saat arası %50 iade'
    },
    {
      timeframe: 0,
      refundPercentage: 0,
      description: '2 saatten az kala iade yok'
    }
  ]

  // Seansa kalan süreyi hesapla
  const getTimeUntilSession = () => {
    const sessionDateTime = new Date(`${session.date}T${session.startTime}`)
    const now = new Date()
    const diffInHours = (sessionDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)
    return Math.max(0, diffInHours)
  }

  // Geçerli iptal politikasını bul
  const getCurrentPolicy = () => {
    const hoursUntilSession = getTimeUntilSession()
    return cancellationPolicies.find(policy => hoursUntilSession >= policy.timeframe) || 
           cancellationPolicies[cancellationPolicies.length - 1]
  }

  // İade tutarını hesapla
  const calculateRefund = () => {
    const policy = getCurrentPolicy()
    return (session.sessionType.price * policy.refundPercentage) / 100
  }

  const handleCancellation = async () => {
    if (!selectedReason) {
      showError('Lütfen iptal nedenini seçin')
      return
    }

    setIsCancelling(true)
    try {
      const policy = getCurrentPolicy()
      const refundAmount = calculateRefund()

      // Seansı iptal et
      const { error: sessionError } = await supabase
        .from('sessions')
        .update({
          status: 'cancelled',
          cancellation_reason: selectedReason,
          cancellation_notes: cancellationReason,
          cancelled_at: new Date().toISOString(),
          refund_amount: refundAmount,
          refund_percentage: policy.refundPercentage
        })
        .eq('id', session.id)

      if (sessionError) throw sessionError

      // İptal kaydı oluştur
      const { error: logError } = await supabase
        .from('session_cancellations')
        .insert({
          session_id: session.id,
          reason: selectedReason,
          notes: cancellationReason,
          refund_amount: refundAmount,
          refund_percentage: policy.refundPercentage,
          cancelled_at: new Date().toISOString()
        })

      if (logError) throw logError

      // İade işlemi başlat (eğer iade tutarı varsa)
      if (refundAmount > 0) {
        const { error: refundError } = await supabase
          .from('refund_requests')
          .insert({
            session_id: session.id,
            amount: refundAmount,
            status: 'pending',
            requested_at: new Date().toISOString()
          })

        if (refundError) throw refundError
      }

      showSuccess('Seans başarıyla iptal edildi')
      onCancellationSuccess()
      onClose()

    } catch (error) {
      console.error('Seans iptal edilirken hata:', error)
      showError('Seans iptal edilirken bir hata oluştu')
    } finally {
      setIsCancelling(false)
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

  const hoursUntilSession = getTimeUntilSession()
  const currentPolicy = getCurrentPolicy()
  const refundAmount = calculateRefund()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between bg-red-50">
          <div className="flex items-center">
            <AlertTriangle className="w-6 h-6 text-red-600 mr-2" />
            <div>
              <CardTitle className="text-red-700">Seans İptali</CardTitle>
              <p className="text-sm text-red-600 mt-1">
                Bu işlem geri alınamaz
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="p-6">
          {!showConfirmation ? (
            <>
              {/* Seans Bilgileri */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="font-medium text-gray-900 mb-3">İptal Edilecek Seans</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-gray-500 mr-2" />
                    <span>{session.consultant.first_name} {session.consultant.last_name}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                    <span>{formatDate(session.date)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-gray-500 mr-2" />
                    <span>{session.startTime.slice(0, 5)} - {session.endTime.slice(0, 5)}</span>
                  </div>
                </div>
              </div>

              {/* İptal Politikası */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-yellow-800 mb-3">İptal Politikası</h4>
                <div className="space-y-2">
                  {cancellationPolicies.map((policy, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between text-sm p-2 rounded ${
                        policy === currentPolicy 
                          ? 'bg-yellow-100 border border-yellow-300' 
                          : 'text-yellow-700'
                      }`}
                    >
                      <span>{policy.description}</span>
                      {policy === currentPolicy && (
                        <Badge className="bg-yellow-600 text-white">Geçerli</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Mevcut Durum */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-blue-800 mb-2">Mevcut Durum</h4>
                <div className="space-y-1 text-sm text-blue-700">
                  <p>Seansa kalan süre: <strong>{Math.floor(hoursUntilSession)} saat</strong></p>
                  <p>İade oranı: <strong>%{currentPolicy.refundPercentage}</strong></p>
                  <p>İade tutarı: <strong>₺{refundAmount}</strong></p>
                </div>
              </div>

              {/* İptal Nedeni */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">İptal Nedeni</h4>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {cancellationReasons.map((reason) => (
                    <button
                      key={reason}
                      onClick={() => setSelectedReason(reason)}
                      className={`p-3 text-sm border rounded-lg transition-colors ${
                        selectedReason === reason
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>

                {selectedReason && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ek Açıklama (Opsiyonel)
                    </label>
                    <Textarea
                      value={cancellationReason}
                      onChange={(e) => setCancellationReason(e.target.value)}
                      placeholder="İptal nedeniniz hakkında daha detaylı bilgi verebilirsiniz..."
                      rows={3}
                    />
                  </div>
                )}
              </div>

              {/* Uyarı */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-red-800">Dikkat!</p>
                    <ul className="text-red-700 mt-1 space-y-1">
                      <li>• Bu işlem geri alınamaz</li>
                      <li>• İade işlemi 3-5 iş günü sürebilir</li>
                      <li>• Danışmanınız bilgilendirilecek</li>
                      {refundAmount === 0 && (
                        <li>• Bu iptal için iade yapılmayacak</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Butonlar */}
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Vazgeç
                </Button>
                <Button
                  onClick={() => setShowConfirmation(true)}
                  disabled={!selectedReason}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  İptal Et
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Onay Ekranı */}
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Ban className="w-8 h-8 text-red-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  Seansı İptal Etmek İstediğinizden Emin misiniz?
                </h4>
                <p className="text-gray-600 mb-6">
                  Bu işlem geri alınamaz ve danışmanınız bilgilendirilecek.
                </p>

                <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>İptal nedeni:</span>
                      <span className="font-medium">{selectedReason}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>İade tutarı:</span>
                      <span className="font-medium text-green-600">₺{refundAmount}</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirmation(false)}
                    className="flex-1"
                  >
                    Geri Dön
                  </Button>
                  <Button
                    onClick={handleCancellation}
                    disabled={isCancelling}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    {isCancelling ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        İptal Ediliyor...
                      </>
                    ) : (
                      'Evet, İptal Et'
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
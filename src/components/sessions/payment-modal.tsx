'use client'

import React, { useState } from 'react'
import { CreditCard, Lock, AlertCircle, CheckCircle, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  booking: {
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
  }
  onPaymentSuccess: (paymentData: any) => void
  onPaymentError: (error: string) => void
}

interface PaymentMethod {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  fee?: number
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  booking,
  onPaymentSuccess,
  onPaymentError
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('credit_card')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStep, setPaymentStep] = useState<'method' | 'details' | 'processing' | 'success'>('method')
  
  // Form states
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [cardName, setCardName] = useState('')

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'credit_card',
      name: 'Kredi Kartı',
      icon: <CreditCard className="w-5 h-5" />,
      description: 'Visa, Mastercard, American Express'
    },
    {
      id: 'bank_transfer',
      name: 'Banka Havalesi',
      icon: <div className="w-5 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center">₺</div>,
      description: 'Havale/EFT ile ödeme',
      fee: 0
    },
    {
      id: 'installment',
      name: 'Taksitli Ödeme',
      icon: <CreditCard className="w-5 h-5" />,
      description: '2-12 taksit seçenekleri'
    }
  ]

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    if (formatted.length <= 19) {
      setCardNumber(formatted)
    }
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value)
    if (formatted.length <= 5) {
      setExpiryDate(formatted)
    }
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    setPaymentStep('processing')

    try {
      // Simulated payment processing
      await new Promise(resolve => setTimeout(resolve, 3000))

      const paymentData = {
        method: selectedMethod,
        amount: booking.sessionType.price,
        cardLast4: cardNumber.slice(-4),
        transactionId: `TXN_${Date.now()}`,
        status: 'completed'
      }

      setPaymentStep('success')
      setTimeout(() => {
        onPaymentSuccess(paymentData)
      }, 2000)

    } catch (error) {
      onPaymentError('Ödeme işlemi sırasında bir hata oluştu')
      setPaymentStep('details')
    } finally {
      setIsProcessing(false)
    }
  }

  const calculateTotal = () => {
    const basePrice = booking.sessionType.price
    const selectedMethodData = paymentMethods.find(m => m.id === selectedMethod)
    const fee = selectedMethodData?.fee || 0
    return basePrice + fee
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Lock className="w-5 h-5 mr-2 text-green-600" />
              Güvenli Ödeme
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              SSL ile şifrelenmiş güvenli ödeme
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="p-6">
          {/* Rezervasyon Özeti */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h4 className="font-medium text-gray-900 mb-2">Rezervasyon Özeti</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Seans:</span>
                <span>{booking.sessionType.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Danışman:</span>
                <span>{booking.consultant.first_name} {booking.consultant.last_name}</span>
              </div>
              <div className="flex justify-between">
                <span>Tarih:</span>
                <span>{new Date(booking.date + 'T12:00:00').toLocaleDateString('tr-TR')}</span>
              </div>
              <div className="flex justify-between">
                <span>Saat:</span>
                <span>{booking.startTime.slice(0, 5)}</span>
              </div>
            </div>
          </div>

          {/* Payment Steps */}
          {paymentStep === 'method' && (
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Ödeme Yöntemi Seçin</h4>
              <div className="space-y-3 mb-6">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedMethod === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {method.icon}
                        <div>
                          <div className="font-medium text-gray-900">{method.name}</div>
                          <div className="text-sm text-gray-600">{method.description}</div>
                        </div>
                      </div>
                      {method.fee !== undefined && (
                        <Badge variant="outline" className="text-xs">
                          {method.fee === 0 ? 'Ücretsiz' : `+₺${method.fee}`}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Toplam:</span>
                <span className="text-2xl font-bold text-blue-600">₺{calculateTotal()}</span>
              </div>

              <Button
                onClick={() => setPaymentStep('details')}
                className="w-full"
                disabled={!selectedMethod}
              >
                Devam Et
              </Button>
            </div>
          )}

          {paymentStep === 'details' && selectedMethod === 'credit_card' && (
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Kart Bilgileri</h4>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kart Numarası
                  </label>
                  <Input
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    className="font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Son Kullanma
                    </label>
                    <Input
                      type="text"
                      value={expiryDate}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      className="font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <Input
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="123"
                      className="font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kart Üzerindeki İsim
                  </label>
                  <Input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                    placeholder="JOHN DOE"
                  />
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800">Güvenlik Bilgisi</p>
                    <p className="text-yellow-700 mt-1">
                      Kart bilgileriniz SSL ile şifrelenir ve güvenli olarak işlenir.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setPaymentStep('method')}
                  className="flex-1"
                >
                  Geri
                </Button>
                <Button
                  onClick={handlePayment}
                  disabled={!cardNumber || !expiryDate || !cvv || !cardName}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  ₺{calculateTotal()} Öde
                </Button>
              </div>
            </div>
          )}

          {paymentStep === 'processing' && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h4 className="font-medium text-gray-900 mb-2">Ödeme İşleniyor</h4>
              <p className="text-sm text-gray-600">
                Lütfen bekleyin, ödemeniz işleniyor...
              </p>
            </div>
          )}

          {paymentStep === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-medium text-green-700 mb-2">Ödeme Başarılı!</h4>
              <p className="text-sm text-gray-600">
                Ödemeniz başarıyla tamamlandı. Rezervasyonunuz onaylandı.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
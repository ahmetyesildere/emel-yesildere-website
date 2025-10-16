'use client'

import React, { useState } from 'react'
import { Star, Send, User, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useTestimonials } from '@/hooks/use-testimonials'
import { toast } from 'sonner'

interface FeedbackFormProps {
  sessionId?: string
  clientName?: string
  service?: string
  onClose?: () => void
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ 
  sessionId, 
  clientName = '', 
  service = '', 
  onClose 
}) => {
  const { addTestimonial, isLoading } = useTestimonials()
  const [formData, setFormData] = useState({
    clientName: clientName,
    rating: 5,
    content: '',
    service: service
  })

  const services = [
    'Yaşam Koçluğu',
    'Holistik Koçluk', 
    'Nefes Koçluğu',
    'Bilinçaltı Temizliği'
  ]

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.clientName.trim()) {
      toast.error('Lütfen adınızı giriniz')
      return
    }
    
    if (!formData.content.trim()) {
      toast.error('Lütfen yorumunuzu yazınız')
      return
    }

    if (!formData.service) {
      toast.error('Lütfen aldığınız hizmeti seçiniz')
      return
    }

    const result = await addTestimonial({
      clientName: formData.clientName,
      rating: formData.rating,
      content: formData.content,
      service: formData.service,
      date: new Date().toISOString(),
      avatar: '👤', // Varsayılan avatar
      sessionId
    })

    if (result.success) {
      toast.success('Yorumunuz başarıyla gönderildi! Admin onayından sonra yayınlanacaktır.')
      setFormData({
        clientName: '',
        rating: 5,
        content: '',
        service: ''
      })
      onClose?.()
    } else {
      toast.error('Yorum gönderilirken hata oluştu')
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="w-6 h-6 text-purple-600" />
          <span>Deneyiminizi Paylaşın</span>
        </CardTitle>
        <p className="text-gray-600">
          Aldığınız hizmet hakkındaki görüşleriniz bizim için çok değerli
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* İsim */}
          <div>
            <Label htmlFor="clientName">Adınız Soyadınız</Label>
            <Input
              id="clientName"
              value={formData.clientName}
              onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
              placeholder="Örn: Ayşe Kaya"
              className="mt-1"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              * Gizlilik için sadece adınız ve soyadınızın ilk harfi gösterilecektir
            </p>
          </div>

          {/* Hizmet Seçimi */}
          <div>
            <Label>Aldığınız Hizmet</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {services.map((serviceOption) => (
                <Button
                  key={serviceOption}
                  type="button"
                  variant={formData.service === serviceOption ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => setFormData(prev => ({ ...prev, service: serviceOption }))}
                >
                  {serviceOption}
                </Button>
              ))}
            </div>
          </div>

          {/* Puan */}
          <div>
            <Label>Memnuniyet Puanınız</Label>
            <div className="flex items-center space-x-2 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className="focus:outline-none"
                >
                  <Star 
                    className={`w-8 h-8 transition-colors ${
                      star <= formData.rating 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                ({formData.rating}/5)
              </span>
            </div>
          </div>

          {/* Yorum */}
          <div>
            <Label htmlFor="content">Yorumunuz</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Aldığınız hizmet hakkındaki deneyiminizi paylaşın..."
              rows={4}
              className="mt-1"
              required
            />
          </div>

          {/* Gizlilik Bildirimi */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <User className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Gizlilik Garantisi</p>
                <p>
                  Yorumunuz admin onayından sonra yayınlanacaktır. 
                  Kişisel bilgileriniz gizli tutulacak ve sadece adınızın ilk harfi gösterilecektir.
                </p>
              </div>
            </div>
          </div>

          {/* Butonlar */}
          <div className="flex space-x-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Send className="w-4 h-4 mr-2" />
              {isLoading ? 'Gönderiliyor...' : 'Yorumu Gönder'}
            </Button>
            
            {onClose && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="px-6"
              >
                İptal
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default FeedbackForm
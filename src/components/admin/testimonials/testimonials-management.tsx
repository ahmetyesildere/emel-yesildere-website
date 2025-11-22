'use client'

import React, { useState } from 'react'
import { Star, Check, X, Eye, Trash2, MessageSquare, Clock, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useTestimonials } from '@/hooks/use-testimonials'
import { toast } from 'sonner'

const TestimonialsManagement = () => {
  const { 
    testimonials, 
    getPendingTestimonials, 
    getApprovedTestimonials,
    updateTestimonialStatus, 
    deleteTestimonial, 
    isLoading 
  } = useTestimonials()

  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'all'>('pending')
  const [selectedTestimonial, setSelectedTestimonial] = useState<string | null>(null)

  const pendingTestimonials = getPendingTestimonials()
  const approvedTestimonials = getApprovedTestimonials()

  const getFilteredTestimonials = () => {
    switch (activeTab) {
      case 'pending':
        return pendingTestimonials
      case 'approved':
        return approvedTestimonials
      case 'all':
        return testimonials
      default:
        return testimonials
    }
  }

  const handleApprove = async (id: string) => {
    const result = await updateTestimonialStatus(id, 'approved')
    if (result.success) {
      toast.success('Yorum onaylandı!')
    } else {
      toast.error('Onaylama işlemi başarısız')
    }
  }

  const handleReject = async (id: string) => {
    const result = await updateTestimonialStatus(id, 'rejected')
    if (result.success) {
      toast.success('Yorum reddedildi!')
    } else {
      toast.error('Reddetme işlemi başarısız')
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Bu yorumu kalıcı olarak silmek istediğinizden emin misiniz?')) {
      const result = await deleteTestimonial(id)
      if (result.success) {
        toast.success('Yorum silindi!')
      } else {
        toast.error('Silme işlemi başarısız')
      }
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Beklemede</Badge>
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Onaylandı</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Reddedildi</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Müşteri Yorumları</h2>
          <p className="text-gray-600">Müşteri yorumlarını yönetin ve onaylayın</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge className="bg-yellow-100 text-yellow-800">
            {pendingTestimonials.length} Beklemede
          </Badge>
          <Badge className="bg-green-100 text-green-800">
            {approvedTestimonials.length} Onaylandı
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <Button
          variant={activeTab === 'pending' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('pending')}
          className="flex-1"
        >
          <Clock className="w-4 h-4 mr-2" />
          Beklemede ({pendingTestimonials.length})
        </Button>
        <Button
          variant={activeTab === 'approved' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('approved')}
          className="flex-1"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Onaylandı ({approvedTestimonials.length})
        </Button>
        <Button
          variant={activeTab === 'all' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('all')}
          className="flex-1"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Tümü ({testimonials.length})
        </Button>
      </div>

      {/* Testimonials List */}
      <div className="grid grid-cols-1 gap-4">
        {getFilteredTestimonials().map((testimonial) => (
          <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{testimonial.displayName}</h3>
                    <p className="text-sm text-gray-600">{testimonial.service}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {getStatusBadge(testimonial.status)}
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${
                          i < testimonial.rating 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <blockquote className="text-gray-700 italic mb-4 leading-relaxed">
                "{testimonial.content}"
              </blockquote>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {new Date(testimonial.date).toLocaleDateString('tr-TR')}
                  {testimonial.sessionId && (
                    <span className="ml-2">• Seans ID: {testimonial.sessionId}</span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {testimonial.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(testimonial.id)}
                        disabled={isLoading}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Onayla
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(testimonial.id)}
                        disabled={isLoading}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reddet
                      </Button>
                    </>
                  )}
                  
                  {testimonial.status === 'approved' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(testimonial.id)}
                      disabled={isLoading}
                      className="border-yellow-300 text-yellow-600 hover:bg-yellow-50"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Gizle
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(testimonial.id)}
                    disabled={isLoading}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {getFilteredTestimonials().length === 0 && (
        <Card className="p-12 text-center">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {activeTab === 'pending' && 'Bekleyen yorum yok'}
            {activeTab === 'approved' && 'Onaylanmış yorum yok'}
            {activeTab === 'all' && 'Henüz yorum yok'}
          </h3>
          <p className="text-gray-600">
            {activeTab === 'pending' && 'Yeni müşteri yorumları burada görünecek'}
            {activeTab === 'approved' && 'Onayladığınız yorumlar burada listelenecek'}
            {activeTab === 'all' && 'Müşterilerden gelen yorumlar burada görünecek'}
          </p>
        </Card>
      )}
    </div>
  )
}

export default TestimonialsManagement
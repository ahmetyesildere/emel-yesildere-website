'use client'

import React, { useState } from 'react'
import { 
  Calendar, Clock, User, MapPin, Video, Phone, Mail, 
  Plus, Edit, Trash2, Eye, Filter, Search, CheckCircle, 
  XCircle, AlertCircle, DollarSign, MessageSquare
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const SessionsManagement = () => {
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')

  const sessions = [
    {
      id: 1,
      clientName: 'Ayşe Kaya',
      clientEmail: 'ayse@example.com',
      serviceType: 'Duygu Temizliği',
      date: '2024-07-25',
      time: '14:00',
      duration: 90,
      type: 'online',
      status: 'scheduled',
      price: 500,
      notes: 'İlk seans, travma geçmişi var',
      meetingLink: 'https://zoom.us/j/123456789'
    },
    {
      id: 2,
      clientName: 'Mehmet Demir',
      clientEmail: 'mehmet@example.com',
      serviceType: 'Yaşam Koçluğu',
      date: '2024-07-26',
      time: '10:00',
      duration: 60,
      type: 'in_person',
      status: 'completed',
      price: 400,
      notes: 'Kariyer değişimi konusu',
      rating: 5,
      feedback: 'Çok faydalı bir seans oldu'
    },
    {
      id: 3,
      clientName: 'Fatma Özkan',
      clientEmail: 'fatma@example.com',
      serviceType: 'Travma İyileştirme',
      date: '2024-07-27',
      time: '16:00',
      duration: 60,
      type: 'online',
      status: 'cancelled',
      price: 750,
      notes: 'Acil durum nedeniyle iptal',
      cancelReason: 'Sağlık problemi'
    },
    {
      id: 4,
      clientName: 'Ali Yılmaz',
      clientEmail: 'ali@example.com',
      serviceType: 'Holistik Koçluk',
      date: '2024-07-28',
      time: '11:30',
      duration: 90,
      type: 'in_person',
      status: 'no_show',
      price: 600,
      notes: 'Gelmedi, aranmadı'
    }
  ]

  const serviceTypes = [
    { name: 'Duygu Temizliği', duration: 60, price: 500 },
    { name: 'Travma İyileştirme', duration: 60, price: 750 },
    { name: 'Yaşam Koçluğu', duration: 60, price: 400 },
    { name: 'Holistik Koçluk', duration: 60, price: 600 },
    { name: 'Grup Seansı', duration: 60, price: 200 }
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { label: 'Planlandı', color: 'bg-blue-100 text-blue-800' },
      completed: { label: 'Tamamlandı', color: 'bg-green-100 text-green-800' },
      cancelled: { label: 'İptal Edildi', color: 'bg-red-100 text-red-800' },
      no_show: { label: 'Gelmedi', color: 'bg-orange-100 text-orange-800' }
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const getStatusIcon = (status: string) => {
    const icons = {
      scheduled: <Clock className="w-4 h-4 text-blue-600" />,
      completed: <CheckCircle className="w-4 h-4 text-green-600" />,
      cancelled: <XCircle className="w-4 h-4 text-red-600" />,
      no_show: <AlertCircle className="w-4 h-4 text-orange-600" />
    }
    return icons[status as keyof typeof icons]
  }

  const filteredSessions = sessions.filter(session => {
    if (filterStatus !== 'all' && session.status !== filterStatus) return false
    if (filterType !== 'all' && session.type !== filterType) return false
    return true
  })

  const sessionStats = {
    total: sessions.length,
    scheduled: sessions.filter(s => s.status === 'scheduled').length,
    completed: sessions.filter(s => s.status === 'completed').length,
    cancelled: sessions.filter(s => s.status === 'cancelled').length,
    revenue: sessions.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.price, 0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Seans Yönetimi</h2>
          <p className="text-gray-600">Tüm seansları görüntüleyin ve yönetin</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Yeni Seans
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Toplam</p>
                <p className="text-2xl font-bold text-gray-900">{sessionStats.total}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Planlandı</p>
                <p className="text-2xl font-bold text-blue-600">{sessionStats.scheduled}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tamamlandı</p>
                <p className="text-2xl font-bold text-green-600">{sessionStats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">İptal</p>
                <p className="text-2xl font-bold text-red-600">{sessionStats.cancelled}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Gelir</p>
                <p className="text-2xl font-bold text-emerald-600">₺{sessionStats.revenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input placeholder="Müşteri adı veya e-posta ara..." />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Durum filtrele" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Durumlar</SelectItem>
                <SelectItem value="scheduled">Planlandı</SelectItem>
                <SelectItem value="completed">Tamamlandı</SelectItem>
                <SelectItem value="cancelled">İptal Edildi</SelectItem>
                <SelectItem value="no_show">Gelmedi</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tür filtrele" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Türler</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="in_person">Yüz Yüze</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sessions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Seanslar ({filteredSessions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Müşteri</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Hizmet</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Tarih & Saat</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Tür</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Durum</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Ücret</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.map((session) => (
                  <tr key={session.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{session.clientName}</div>
                          <div className="text-sm text-gray-600">{session.clientEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{session.serviceType}</div>
                        <div className="text-sm text-gray-600">{session.duration} dakika</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{session.date}</div>
                        <div className="text-sm text-gray-600">{session.time}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        {session.type === 'online' ? (
                          <Video className="w-4 h-4 text-blue-600" />
                        ) : (
                          <MapPin className="w-4 h-4 text-green-600" />
                        )}
                        <span className="text-sm">
                          {session.type === 'online' ? 'Online' : 'Yüz Yüze'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(session.status)}
                        {getStatusBadge(session.status)}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900">₺{session.price}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" title="Görüntüle">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" title="Düzenle">
                          <Edit className="w-4 h-4" />
                        </Button>
                        {session.type === 'online' && session.meetingLink && (
                          <Button variant="outline" size="sm" title="Toplantı Linki">
                            <Video className="w-4 h-4" />
                          </Button>
                        )}
                        <Button variant="outline" size="sm" title="Mesaj Gönder">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" title="Sil">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Service Types */}
      <Card>
        <CardHeader>
          <CardTitle>Hizmet Türleri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {serviceTypes.map((service, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{service.name}</h4>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Süre:</span>
                    <span>{service.duration} dakika</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Ücret:</span>
                    <span className="font-medium">₺{service.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SessionsManagement
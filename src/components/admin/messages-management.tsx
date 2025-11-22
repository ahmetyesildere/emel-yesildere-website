'use client'

import React, { useState } from 'react'
import { 
  MessageSquare, Mail, Phone, User, Clock, CheckCircle, 
  XCircle, AlertCircle, Reply, Archive, Trash2, Filter,
  Search, Star, Flag, Calendar, Tag, Send, Eye
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const MessagesManagement = () => {
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterSubject, setFilterSubject] = useState('all')
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null)

  const messages = [
    {
      id: 1,
      name: 'Ayşe Kaya',
      email: 'ayse@example.com',
      phone: '+90 (555) 123 45 67',
      landline: '',
      subject: 'Randevu Talebi',
      service: 'Duygu Temizliği',
      message: 'Merhaba, duygu temizliği seansı için randevu almak istiyorum. Müsait olduğunuz zamanları öğrenebilir miyim?',
      status: 'unread',
      priority: 'normal',
      createdAt: '2024-07-25 14:30',
      preferredContact: 'whatsapp',
      urgency: 'normal',
      replied: false,
      starred: false
    },
    {
      id: 2,
      name: 'Mehmet Demir',
      email: 'mehmet@example.com',
      phone: '+90 (555) 987 65 43',
      landline: '+90 (212) 456 78 90',
      subject: 'Hizmet Bilgisi',
      service: 'Yaşam Koçluğu',
      message: 'Yaşam koçluğu hizmetiniz hakkında detaylı bilgi alabilir miyim? Fiyatlar ve seans süreleri nelerdir?',
      status: 'read',
      priority: 'normal',
      createdAt: '2024-07-25 10:15',
      preferredContact: 'email',
      urgency: 'normal',
      replied: true,
      repliedAt: '2024-07-25 11:00',
      replyMessage: 'Merhaba Mehmet Bey, yaşam koçluğu hizmetimiz hakkında detaylı bilgiyi e-posta ile gönderdim.',
      starred: true
    },
    {
      id: 3,
      name: 'Fatma Özkan',
      email: 'fatma@example.com',
      phone: '+90 (555) 456 78 90',
      landline: '',
      subject: 'Acil Durum',
      service: 'Travma İyileştirme',
      message: 'Acil olarak travma iyileştirme desteğine ihtiyacım var. En kısa sürede görüşebilir miyiz?',
      status: 'read',
      priority: 'urgent',
      createdAt: '2024-07-25 08:45',
      preferredContact: 'phone',
      urgency: 'urgent',
      replied: true,
      repliedAt: '2024-07-25 09:00',
      replyMessage: 'Fatma Hanım, acil durumunuz için bugün 16:00\'da randevu ayarladım. WhatsApp\'tan detayları gönderdim.',
      starred: false
    },
    {
      id: 4,
      name: 'Ali Yılmaz',
      email: 'ali@example.com',
      phone: '+90 (555) 321 65 47',
      landline: '+90 (216) 789 12 34',
      subject: 'Şikayet/Öneri',
      service: 'Genel',
      message: 'Web sitenizde randevu alma konusunda teknik sorun yaşıyorum. Yardımcı olabilir misiniz?',
      status: 'unread',
      priority: 'high',
      createdAt: '2024-07-24 16:20',
      preferredContact: 'email',
      urgency: 'high',
      replied: false,
      starred: false
    },
    {
      id: 5,
      name: 'Zeynep Kara',
      email: 'zeynep@example.com',
      phone: '+90 (555) 789 12 34',
      landline: '',
      subject: 'Fiyat Bilgisi',
      service: 'Holistik Koçluk',
      message: 'Holistik koçluk seanslarınızın fiyatları nedir? Paket indirimi var mı?',
      status: 'read',
      priority: 'normal',
      createdAt: '2024-07-24 12:10',
      preferredContact: 'whatsapp',
      urgency: 'normal',
      replied: false,
      starred: false
    }
  ]

  const subjects = [
    'Randevu Talebi',
    'Hizmet Bilgisi',
    'Fiyat Bilgisi',
    'Genel Soru',
    'Teknik Destek',
    'Şikayet/Öneri',
    'Acil Durum'
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      unread: { label: 'Okunmadı', color: 'bg-blue-100 text-blue-800', icon: Mail },
      read: { label: 'Okundu', color: 'bg-gray-100 text-gray-800', icon: CheckCircle },
      replied: { label: 'Yanıtlandı', color: 'bg-green-100 text-green-800', icon: Reply },
      archived: { label: 'Arşivlendi', color: 'bg-yellow-100 text-yellow-800', icon: Archive }
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    const IconComponent = config.icon
    return (
      <div className="flex items-center space-x-1">
        <IconComponent className="w-3 h-3" />
        <Badge className={config.color}>{config.label}</Badge>
      </div>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { label: 'Düşük', color: 'bg-gray-100 text-gray-800' },
      normal: { label: 'Normal', color: 'bg-blue-100 text-blue-800' },
      high: { label: 'Yüksek', color: 'bg-orange-100 text-orange-800' },
      urgent: { label: 'Acil', color: 'bg-red-100 text-red-800' }
    }
    const config = priorityConfig[priority as keyof typeof priorityConfig]
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const filteredMessages = messages.filter(message => {
    if (filterStatus !== 'all' && message.status !== filterStatus) return false
    if (filterSubject !== 'all' && message.subject !== filterSubject) return false
    return true
  })

  const messageStats = {
    total: messages.length,
    unread: messages.filter(m => m.status === 'unread').length,
    replied: messages.filter(m => m.replied).length,
    urgent: messages.filter(m => m.priority === 'urgent').length,
    starred: messages.filter(m => m.starred).length
  }

  const selectedMsg = selectedMessage ? messages.find(m => m.id === selectedMessage) : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mesaj Yönetimi</h2>
          <p className="text-gray-600">İletişim mesajlarını görüntüleyin ve yanıtlayın</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Archive className="w-4 h-4 mr-2" />
            Arşivle
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <Reply className="w-4 h-4 mr-2" />
            Toplu Yanıt
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Toplam</p>
                <p className="text-2xl font-bold text-gray-900">{messageStats.total}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Okunmadı</p>
                <p className="text-2xl font-bold text-blue-600">{messageStats.unread}</p>
              </div>
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Yanıtlandı</p>
                <p className="text-2xl font-bold text-green-600">{messageStats.replied}</p>
              </div>
              <Reply className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Acil</p>
                <p className="text-2xl font-bold text-red-600">{messageStats.urgent}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Yıldızlı</p>
                <p className="text-2xl font-bold text-yellow-600">{messageStats.starred}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Input placeholder="Mesajlarda ara..." />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Durum filtrele" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Durumlar</SelectItem>
                    <SelectItem value="unread">Okunmadı</SelectItem>
                    <SelectItem value="read">Okundu</SelectItem>
                    <SelectItem value="replied">Yanıtlandı</SelectItem>
                    <SelectItem value="archived">Arşivlendi</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterSubject} onValueChange={setFilterSubject}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Konu filtrele" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Konular</SelectItem>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Messages */}
          <Card>
            <CardHeader>
              <CardTitle>Mesajlar ({filteredMessages.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedMessage === message.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    } ${message.status === 'unread' ? 'bg-blue-50/30' : ''}`}
                    onClick={() => setSelectedMessage(message.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className={`font-medium ${message.status === 'unread' ? 'text-gray-900 font-semibold' : 'text-gray-900'}`}>
                              {message.name}
                            </h4>
                            {message.starred && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                            {getPriorityBadge(message.priority)}
                          </div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline" className="text-xs">{message.subject}</Badge>
                            {message.service !== 'Genel' && (
                              <Badge variant="outline" className="text-xs">{message.service}</Badge>
                            )}
                          </div>
                          <p className={`text-sm line-clamp-2 ${message.status === 'unread' ? 'text-gray-900' : 'text-gray-600'}`}>
                            {message.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{message.createdAt}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                {message.preferredContact === 'whatsapp' && <MessageSquare className="w-3 h-3" />}
                                {message.preferredContact === 'email' && <Mail className="w-3 h-3" />}
                                {message.preferredContact === 'phone' && <Phone className="w-3 h-3" />}
                                <span className="capitalize">{message.preferredContact}</span>
                              </div>
                            </div>
                            {getStatusBadge(message.status)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Message Detail */}
        <div>
          {selectedMsg ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Mesaj Detayı</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Star className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Archive className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Sender Info */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{selectedMsg.name}</h4>
                      <p className="text-sm text-gray-600">{selectedMsg.email}</p>
                      {selectedMsg.phone && (
                        <p className="text-sm text-gray-600">Cep: {selectedMsg.phone}</p>
                      )}
                      {selectedMsg.landline && (
                        <p className="text-sm text-gray-600">Sabit: {selectedMsg.landline}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Konu:</span>
                      <p className="font-medium">{selectedMsg.subject}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Hizmet:</span>
                      <p className="font-medium">{selectedMsg.service}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Öncelik:</span>
                      <div className="mt-1">{getPriorityBadge(selectedMsg.priority)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">İletişim:</span>
                      <p className="font-medium capitalize">{selectedMsg.preferredContact}</p>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Mesaj:</h5>
                  <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <p className="text-gray-700 leading-relaxed">{selectedMsg.message}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{selectedMsg.createdAt}</p>
                </div>

                {/* Reply if exists */}
                {selectedMsg.replied && selectedMsg.replyMessage && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Yanıt:</h5>
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-gray-700 leading-relaxed">{selectedMsg.replyMessage}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Yanıtlandı: {selectedMsg.repliedAt}</p>
                  </div>
                )}

                {/* Reply Form */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Yanıt Gönder:</h5>
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Yanıtınızı yazın..."
                      rows={4}
                      className="resize-none"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Select defaultValue={selectedMsg.preferredContact}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">E-posta</SelectItem>
                            <SelectItem value="whatsapp">WhatsApp</SelectItem>
                            <SelectItem value="phone">Telefon</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button className="bg-green-600 hover:bg-green-700">
                        <Send className="w-4 h-4 mr-2" />
                        Gönder
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Mesaj Seçin</h3>
                <p className="text-gray-600">Detaylarını görmek için bir mesaj seçin</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default MessagesManagement
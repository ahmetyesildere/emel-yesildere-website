'use client'

import React, { useState, useEffect } from 'react'
import { 
  Mail, Phone, Calendar, Trash2, MessageSquare, 
  CheckCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

import { useSafeToast } from '@/hooks/use-safe-toast'

interface ContactMessage {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: 'new' | 'read' | 'replied' | 'archived'
  priority: 'low' | 'medium' | 'high'
  created_at: string
  updated_at: string
  admin_notes?: string
}

const ContactManagement = () => {
  const toast = useSafeToast()
  
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [adminNotes, setAdminNotes] = useState('')

  useEffect(() => {
    loadMessages()
  }, [])

  const loadMessages = async () => {
    try {
      // Test aşaması için localStorage kullan
      const localMessages = JSON.parse(localStorage.getItem('contact_messages') || '[]')
      
      // Eğer mesaj yoksa örnek mesajlar ekle
      if (localMessages.length === 0) {
        const sampleMessages: ContactMessage[] = [
          {
            id: '1',
            name: 'Ayşe Yılmaz',
            email: 'ayse@example.com',
            phone: '+90 555 123 4567',
            subject: 'Randevu Talebi',
            message: 'Merhaba, online seans için randevu almak istiyorum. Müsait olduğunuz zamanları öğrenebilir miyim?',
            status: 'new',
            priority: 'high',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Mehmet Kaya',
            email: 'mehmet@example.com',
            subject: 'Hizmetler Hakkında Bilgi',
            message: 'Yaşam koçluğu hizmetleriniz hakkında detaylı bilgi alabilir miyim? Fiyatlar nedir?',
            status: 'read',
            priority: 'medium',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            updated_at: new Date(Date.now() - 86400000).toISOString(),
            admin_notes: 'Fiyat listesi gönderildi'
          }
        ]
        localStorage.setItem('contact_messages', JSON.stringify(sampleMessages))
        setMessages(sampleMessages)
      } else {
        setMessages(localMessages)
      }
    } catch (error) {
      console.error('Mesajlar yüklenirken hata:', error)
      toast.error('Mesajlar yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const updateMessageStatus = async (messageId: string, newStatus: ContactMessage['status']) => {
    try {
      const existingMessages = JSON.parse(localStorage.getItem('contact_messages') || '[]')
      const updatedMessages = existingMessages.map((msg: ContactMessage) =>
        msg.id === messageId 
          ? { ...msg, status: newStatus, updated_at: new Date().toISOString() }
          : msg
      )
      
      localStorage.setItem('contact_messages', JSON.stringify(updatedMessages))
      setMessages(updatedMessages)
      
      const statusLabels = {
        new: 'yeni',
        read: 'okundu',
        replied: 'yanıtlandı',
        archived: 'arşivlendi'
      }
      
      toast.success(`Mesaj ${statusLabels[newStatus]} olarak işaretlendi`)
    } catch (error) {
      console.error('Mesaj durumu güncellenirken hata:', error)
      toast.error('Durum güncellenemedi')
    }
  }

  const deleteMessage = async (messageId: string) => {
    if (!confirm('Bu mesajı silmek istediğinizden emin misiniz?')) return

    try {
      const existingMessages = JSON.parse(localStorage.getItem('contact_messages') || '[]')
      const filteredMessages = existingMessages.filter((msg: ContactMessage) => msg.id !== messageId)
      
      localStorage.setItem('contact_messages', JSON.stringify(filteredMessages))
      setMessages(filteredMessages)
      toast.success('Mesaj silindi')
      
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null)
      }
    } catch (error) {
      console.error('Mesaj silinirken hata:', error)
      toast.error('Mesaj silinemedi')
    }
  }

  const getStatusBadge = (status: ContactMessage['status']) => {
    const statusConfig = {
      new: { label: 'Yeni', color: 'bg-blue-100 text-blue-800' },
      read: { label: 'Okundu', color: 'bg-yellow-100 text-yellow-800' },
      replied: { label: 'Yanıtlandı', color: 'bg-green-100 text-green-800' },
      archived: { label: 'Arşiv', color: 'bg-gray-100 text-gray-800' }
    }
    const config = statusConfig[status]
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getMessageStats = () => {
    return {
      total: messages.length,
      new: messages.filter(m => m.status === 'new').length,
      read: messages.filter(m => m.status === 'read').length,
      replied: messages.filter(m => m.status === 'replied').length,
      archived: messages.filter(m => m.status === 'archived').length
    }
  }

  const stats = getMessageStats()

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-2">Mesajlar yükleniyor...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">İletişim Mesajları</h2>
          <p className="text-gray-600">Web sitesinden gelen iletişim formlarını yönetin</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Toplam</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
            <div className="text-sm text-gray-600">Yeni</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.read}</div>
            <div className="text-sm text-gray-600">Okundu</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.replied}</div>
            <div className="text-sm text-gray-600">Yanıtlandı</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.archived}</div>
            <div className="text-sm text-gray-600">Arşiv</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Mesajlarda ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tüm Durumlar</option>
          <option value="new">Yeni</option>
          <option value="read">Okundu</option>
          <option value="replied">Yanıtlandı</option>
          <option value="archived">Arşiv</option>
        </select>
      </div>

      {/* Messages List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages */}
        <div className="space-y-4">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((message) => (
              <Card 
                key={message.id} 
                className={`cursor-pointer transition-all ${
                  selectedMessage?.id === message.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
                }`}
                onClick={() => {
                  setSelectedMessage(message)
                  setAdminNotes(message.admin_notes || '')
                  if (message.status === 'new') {
                    updateMessageStatus(message.id, 'read')
                  }
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-gray-900">{message.name}</h3>
                      {getStatusBadge(message.status)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(message.created_at).toLocaleDateString('tr-TR')}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      {message.email}
                    </div>
                    {message.phone && (
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {message.phone}
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <div className="font-medium text-gray-900 mb-1">{message.subject}</div>
                    <p className="text-gray-600 text-sm line-clamp-2">{message.message}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || statusFilter !== 'all' ? 'Sonuç bulunamadı' : 'Henüz mesaj yok'}
              </h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Arama kriterlerinizi değiştirmeyi deneyin'
                  : 'İletişim formundan gelen mesajlar burada görünecek'
                }
              </p>
            </div>
          )}
        </div>

        {/* Message Details */}
        <div>
          {selectedMessage ? (
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Mesaj Detayları</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateMessageStatus(selectedMessage.id, 'replied')}
                      disabled={selectedMessage.status === 'replied'}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Yanıtlandı
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteMessage(selectedMessage.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-lg font-semibold">{selectedMessage.name}</h3>
                    {getStatusBadge(selectedMessage.status)}
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      <a href={`mailto:${selectedMessage.email}`} className="hover:text-blue-600">
                        {selectedMessage.email}
                      </a>
                    </div>
                    {selectedMessage.phone && (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        <a href={`tel:${selectedMessage.phone}`} className="hover:text-blue-600">
                          {selectedMessage.phone}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(selectedMessage.created_at).toLocaleString('tr-TR')}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Konu</h4>
                  <p className="text-gray-700">{selectedMessage.subject}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Mesaj</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={() => window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                    className="flex-1"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    E-posta Gönder
                  </Button>
                  {selectedMessage.phone && (
                    <Button
                      variant="outline"
                      onClick={() => window.location.href = `tel:${selectedMessage.phone}`}
                      className="flex-1"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Ara
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Mesaj Seçin</h3>
                <p className="text-gray-600">
                  Detaylarını görmek için sol taraftan bir mesaj seçin
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default ContactManagement
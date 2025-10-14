'use client'

import React, { useState, useEffect } from 'react'
import {
  MessageSquare, Send, Mail, MailOpen, User, Clock, Search, Filter, 
  Download, Eye, Trash2, Reply, Forward, Archive, Star, AlertCircle,
  Plus, Edit, Settings, X
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/lib/auth/auth-context'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/toast-provider'
import UserSelector from './user-selector'

interface Message {
  id: string
  sender_id: string
  receiver_id: string
  subject?: string
  content: string
  is_read: boolean
  created_at: string
  updated_at: string
  // Relations
  sender?: {
    id: string
    first_name: string
    last_name: string
    email: string
    avatar_url?: string
    role?: string
  }
  receiver?: {
    id: string
    first_name: string
    last_name: string
    email: string
    avatar_url?: string
    role?: string
  }
}

interface MessageStats {
  totalMessages: number
  unreadMessages: number
  todayMessages: number
  weeklyMessages: number
  clientMessages: number
  consultantMessages: number
  adminMessages: number
}

const MessagesManagement = () => {
  const { user } = useAuth()
  const { success: showSuccess, error: showError } = useToast()

  const [messages, setMessages] = useState<Message[]>([])
  const [stats, setStats] = useState<MessageStats>({
    totalMessages: 0,
    unreadMessages: 0,
    todayMessages: 0,
    weeklyMessages: 0,
    clientMessages: 0,
    consultantMessages: 0,
    adminMessages: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [showComposeModal, setShowComposeModal] = useState(false)
  const [composeData, setComposeData] = useState({
    receiver_id: '',
    subject: '',
    content: ''
  })

  useEffect(() => {
    loadMessages()
    loadMessageStats()
  }, [])

  const loadMessages = async () => {
    setIsLoading(true)
    try {
      console.log('🔍 Admin - Tüm mesajlar yükleniyor...')

      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })

      if (messagesError) {
        console.error('❌ Messages yükleme hatası:', messagesError)
        throw messagesError
      }

      console.log('✅ Messages yüklendi:', { count: messagesData?.length })

      // Sender ve Receiver bilgilerini ayrı çek
      if (messagesData && messagesData.length > 0) {
        const userIds = [...new Set([
          ...messagesData.map(msg => msg.sender_id),
          ...messagesData.map(msg => msg.receiver_id)
        ].filter(Boolean))]
        
        // User bilgilerini çek
        let usersData = []
        if (userIds.length > 0) {
          const { data: users, error: usersError } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, email, avatar_url, role')
            .in('id', userIds)

          if (!usersError && users) {
            usersData = users
          }
        }
        
        // Messages'lara user bilgilerini ekle
        const messagesWithUsers = messagesData.map(message => ({
          ...message,
          sender: usersData.find(user => user.id === message.sender_id),
          receiver: usersData.find(user => user.id === message.receiver_id)
        }))
        
        setMessages(messagesWithUsers)
      } else {
        setMessages([])
      }

    } catch (error) {
      console.error('💥 Mesajlar yüklenirken hata:', error)
      showError('Mesajlar yüklenemedi')
    } finally {
      setIsLoading(false)
    }
  }

  const loadMessageStats = async () => {
    try {
      console.log('📊 Mesaj istatistikleri yükleniyor...')

      const { data: messagesData, error } = await supabase
        .from('messages')
        .select('is_read, created_at, sender_id, receiver_id')

      if (error) throw error

      // Profiles'dan role bilgilerini al
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, role')

      const profilesMap = new Map(profilesData?.map(p => [p.id, p.role]) || [])

      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

      const stats = messagesData.reduce((acc, message) => {
        const messageDate = new Date(message.created_at)
        const senderRole = profilesMap.get(message.sender_id)
        const receiverRole = profilesMap.get(message.receiver_id)

        acc.totalMessages += 1

        // Okunmamış mesajlar
        if (!message.is_read) {
          acc.unreadMessages += 1
        }

        // Bugünkü mesajlar
        if (messageDate >= today) {
          acc.todayMessages += 1
        }

        // Haftalık mesajlar
        if (messageDate >= oneWeekAgo) {
          acc.weeklyMessages += 1
        }

        // Role bazlı istatistikler
        if (senderRole === 'client' || receiverRole === 'client') {
          acc.clientMessages += 1
        }
        if (senderRole === 'consultant' || receiverRole === 'consultant') {
          acc.consultantMessages += 1
        }
        if (senderRole === 'admin' || receiverRole === 'admin') {
          acc.adminMessages += 1
        }

        return acc
      }, {
        totalMessages: 0,
        unreadMessages: 0,
        todayMessages: 0,
        weeklyMessages: 0,
        clientMessages: 0,
        consultantMessages: 0,
        adminMessages: 0
      })

      setStats(stats)
      console.log('✅ Mesaj istatistikleri yüklendi:', stats)

    } catch (error) {
      console.error('💥 İstatistikler yüklenirken hata:', error)
    }
  }

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId)

      if (error) throw error

      // Local state'i güncelle
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, is_read: true } : msg
        )
      )

      // Stats'ı güncelle
      setStats(prev => ({
        ...prev,
        unreadMessages: Math.max(0, prev.unreadMessages - 1)
      }))

    } catch (error) {
      console.error('💥 Mesaj okundu olarak işaretlenirken hata:', error)
    }
  }

  const deleteMessage = async (messageId: string) => {
    if (!confirm('Bu mesajı silmek istediğinizden emin misiniz?')) return

    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId)

      if (error) throw error

      showSuccess('Mesaj silindi')
      loadMessages()
      loadMessageStats()
      setSelectedMessage(null)

    } catch (error) {
      console.error('💥 Mesaj silinirken hata:', error)
      showError('Mesaj silinemedi')
    }
  }

  const sendMessage = async () => {
    if (!composeData.receiver_id || !composeData.content.trim()) {
      showError('Alıcı ve mesaj içeriği gerekli')
      return
    }

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user?.id,
          receiver_id: composeData.receiver_id,
          subject: composeData.subject || 'Admin Mesajı',
          content: composeData.content.trim()
        })

      if (error) throw error

      showSuccess('Mesaj başarıyla gönderildi')
      setShowComposeModal(false)
      setComposeData({ receiver_id: '', subject: '', content: '' })
      loadMessages()
      loadMessageStats()

    } catch (error) {
      console.error('💥 Mesaj gönderilirken hata:', error)
      showError('Mesaj gönderilemedi')
    }
  }

  const getMessagesByTab = (tab: string) => {
    switch (tab) {
      case 'unread':
        return messages.filter(msg => !msg.is_read)
      case 'client':
        return messages.filter(msg => 
          msg.sender?.role === 'client' || msg.receiver?.role === 'client'
        )
      case 'consultant':
        return messages.filter(msg => 
          msg.sender?.role === 'consultant' || msg.receiver?.role === 'consultant'
        )
      case 'admin':
        return messages.filter(msg => 
          msg.sender?.role === 'admin' || msg.receiver?.role === 'admin'
        )
      default:
        return messages
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString('tr-TR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString('tr-TR', { 
        weekday: 'short',
        hour: '2-digit', 
        minute: '2-digit' 
      })
    } else {
      return date.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-100 text-purple-800">Admin</Badge>
      case 'consultant':
        return <Badge className="bg-blue-100 text-blue-800">Danışman</Badge>
      case 'client':
        return <Badge className="bg-green-100 text-green-800">Danışan</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Kullanıcı</Badge>
    }
  }

  const filteredMessages = getMessagesByTab(activeTab).filter(message => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      message.sender?.first_name?.toLowerCase().includes(searchLower) ||
      message.sender?.last_name?.toLowerCase().includes(searchLower) ||
      message.sender?.email?.toLowerCase().includes(searchLower) ||
      message.receiver?.first_name?.toLowerCase().includes(searchLower) ||
      message.receiver?.last_name?.toLowerCase().includes(searchLower) ||
      message.receiver?.email?.toLowerCase().includes(searchLower) ||
      message.subject?.toLowerCase().includes(searchLower) ||
      message.content?.toLowerCase().includes(searchLower)
    )
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Mesajlar</h2>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Mesajlar yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mesajlar</h2>
          <p className="text-gray-600">Tüm kullanıcı mesajlarını görüntüle ve yönet</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Rapor İndir
          </Button>
          <Button 
            size="sm" 
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => setShowComposeModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Yeni Mesaj
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MessageSquare className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalMessages}
                </p>
                <p className="text-sm text-gray-600">Toplam Mesaj</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertCircle className="w-8 h-8 text-red-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.unreadMessages}
                </p>
                <p className="text-sm text-gray-600">Okunmamış Mesaj</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.todayMessages}
                </p>
                <p className="text-sm text-gray-600">Bugünkü Mesajlar</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Send className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.weeklyMessages}
                </p>
                <p className="text-sm text-gray-600">Haftalık Mesajlar</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Gönderen, alıcı, konu veya içerik ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filtrele
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol Panel - Mesaj Listesi */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="border-b border-gray-200">
                  <TabsList className="grid w-full grid-cols-5 h-auto p-1">
                    <TabsTrigger value="all" className="py-3">
                      Tümü ({messages.length})
                    </TabsTrigger>
                    <TabsTrigger value="unread" className="py-3">
                      Okunmamış ({getMessagesByTab('unread').length})
                    </TabsTrigger>
                    <TabsTrigger value="client" className="py-3">
                      Danışan ({getMessagesByTab('client').length})
                    </TabsTrigger>
                    <TabsTrigger value="consultant" className="py-3">
                      Danışman ({getMessagesByTab('consultant').length})
                    </TabsTrigger>
                    <TabsTrigger value="admin" className="py-3">
                      Admin ({getMessagesByTab('admin').length})
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Message Lists */}
                {['all', 'unread', 'client', 'consultant', 'admin'].map((tabValue) => (
                  <TabsContent key={tabValue} value={tabValue} className="p-0">
                    <div className="max-h-[600px] overflow-y-auto">
                      {filteredMessages.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                          <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>Bu kategoride mesaj bulunmuyor</p>
                        </div>
                      ) : (
                        <div className="divide-y">
                          {filteredMessages.map((message) => (
                            <div
                              key={message.id}
                              onClick={() => {
                                setSelectedMessage(message)
                                if (!message.is_read) {
                                  markAsRead(message.id)
                                }
                              }}
                              className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                                selectedMessage?.id === message.id ? 'bg-purple-50 border-r-2 border-purple-500' : ''
                              } ${!message.is_read ? 'bg-blue-25' : ''}`}
                            >
                              <div className="flex items-start space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                  <User className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <h4 className={`text-sm font-medium text-gray-900 ${
                                        !message.is_read ? 'font-semibold' : ''
                                      }`}>
                                        {message.sender?.first_name} {message.sender?.last_name}
                                      </h4>
                                      {message.sender?.role && getRoleBadge(message.sender.role)}
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      {!message.is_read && (
                                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                                      )}
                                      <span className="text-xs text-gray-500">
                                        {formatDate(message.created_at)}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <span className="text-xs text-gray-500">→</span>
                                    <span className="text-xs text-gray-600">
                                      {message.receiver?.first_name} {message.receiver?.last_name}
                                    </span>
                                    {message.receiver?.role && (
                                      <span className="text-xs">
                                        {getRoleBadge(message.receiver.role)}
                                      </span>
                                    )}
                                  </div>
                                  <p className={`text-sm text-gray-600 truncate mt-1 ${
                                    !message.is_read ? 'font-medium' : ''
                                  }`}>
                                    {message.subject || 'Konu yok'}
                                  </p>
                                  <p className="text-xs text-gray-500 truncate mt-1">
                                    {message.content}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sağ Panel - Mesaj Detayı */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-0">
              {selectedMessage ? (
                <div className="h-[600px] flex flex-col">
                  {/* Mesaj Header */}
                  <div className="p-4 border-b">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">
                            {selectedMessage.sender?.first_name} {selectedMessage.sender?.last_name}
                          </h3>
                          <p className="text-xs text-gray-600">{selectedMessage.sender?.email}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            {selectedMessage.sender?.role && getRoleBadge(selectedMessage.sender.role)}
                            <span className="text-xs text-gray-500">
                              {formatDate(selectedMessage.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => deleteMessage(selectedMessage.id)}>
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-3 p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2 text-xs text-gray-600">
                        <span>Alıcı:</span>
                        <span className="font-medium">
                          {selectedMessage.receiver?.first_name} {selectedMessage.receiver?.last_name}
                        </span>
                        {selectedMessage.receiver?.role && getRoleBadge(selectedMessage.receiver.role)}
                      </div>
                    </div>

                    {selectedMessage.subject && (
                      <h4 className="text-sm font-medium text-gray-900 mt-3">
                        {selectedMessage.subject}
                      </h4>
                    )}
                  </div>

                  {/* Mesaj İçeriği */}
                  <div className="flex-1 p-4 overflow-y-auto">
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 whitespace-pre-wrap text-sm">
                        {selectedMessage.content}
                      </p>
                    </div>
                  </div>

                  {/* Aksiyon Butonları */}
                  <div className="border-t p-4">
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Reply className="w-4 h-4 mr-1" />
                        Cevapla
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Forward className="w-4 h-4 mr-1" />
                        İlet
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-[600px] flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Bir mesaj seçin</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Compose Modal */}
      {showComposeModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4" style={{ zIndex: 2147483649 }}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Yeni Mesaj</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowComposeModal(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alıcı
                </label>
                <UserSelector
                  selectedUserId={composeData.receiver_id}
                  onUserSelect={(userId) => setComposeData({...composeData, receiver_id: userId})}
                  placeholder="Mesaj gönderilecek kullanıcıyı seçin..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Konu
                </label>
                <Input
                  value={composeData.subject}
                  onChange={(e) => setComposeData({...composeData, subject: e.target.value})}
                  placeholder="Mesaj konusu"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mesaj
                </label>
                <Textarea
                  value={composeData.content}
                  onChange={(e) => setComposeData({...composeData, content: e.target.value})}
                  placeholder="Mesajınızı yazın..."
                  rows={6}
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t">
              <Button
                variant="outline"
                onClick={() => setShowComposeModal(false)}
              >
                İptal
              </Button>
              <Button
                onClick={sendMessage}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Send className="w-4 h-4 mr-2" />
                Gönder
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MessagesManagement
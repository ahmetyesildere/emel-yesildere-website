'use client'

import React, { useState, useEffect } from 'react'
import { X, Send, MessageSquare, User, Clock, Mail, MailOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth/auth-context'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/toast'

interface Message {
  id: string
  sender_id: string
  receiver_id: string
  subject?: string
  content: string
  is_read: boolean
  created_at: string
  sender: {
    first_name: string
    last_name: string
    email: string
    avatar_url?: string
  }
  receiver: {
    first_name: string
    last_name: string
    email: string
    avatar_url?: string
  }
}

interface MessagesModalProps {
  isOpen: boolean
  onClose: () => void
}

const MessagesModal: React.FC<MessagesModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth()
  const { showSuccess, showError } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent'>('inbox')
  const [replyContent, setReplyContent] = useState('')
  const [replySubject, setReplySubject] = useState('')
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    if (isOpen && user?.id) {
      loadMessages()
    }
  }, [isOpen, user?.id, activeTab])

  const loadMessages = async () => {
    if (!user?.id) return

    setIsLoading(true)
    try {
      const query = supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(
            first_name,
            last_name,
            email,
            avatar_url
          ),
          receiver:profiles!messages_receiver_id_fkey(
            first_name,
            last_name,
            email,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })

      if (activeTab === 'inbox') {
        query.eq('receiver_id', user.id)
      } else {
        query.eq('sender_id', user.id)
      }

      const { data, error } = await query

      if (error) throw error

      setMessages(data || [])
    } catch (error) {
      console.error('Mesajlar yüklenirken hata:', error)
      showError('Mesajlar yüklenemedi')
    } finally {
      setIsLoading(false)
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
    } catch (error) {
      console.error('Mesaj okundu olarak işaretlenirken hata:', error)
    }
  }

  const sendReply = async () => {
    if (!selectedMessage || !replyContent.trim() || !user?.id) return

    setIsSending(true)
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: selectedMessage.sender_id,
          subject: replySubject || `Re: ${selectedMessage.subject || 'Mesaj'}`,
          content: replyContent.trim()
        })

      if (error) throw error

      showSuccess('Mesaj başarıyla gönderildi')
      setReplyContent('')
      setReplySubject('')
      setSelectedMessage(null)
      loadMessages()
    } catch (error) {
      console.error('Mesaj gönderilirken hata:', error)
      showError('Mesaj gönderilemedi')
    } finally {
      setIsSending(false)
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

  const getUnreadCount = () => {
    return messages.filter(msg => !msg.is_read && activeTab === 'inbox').length
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4" style={{ zIndex: 2147483649 }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Mesajlar
            </h2>
            {getUnreadCount() > 0 && (
              <Badge className="bg-red-100 text-red-800">
                {getUnreadCount()} okunmamış
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sol Panel - Mesaj Listesi */}
          <div className="w-1/2 border-r flex flex-col">
            {/* Tab Buttons */}
            <div className="flex border-b">
              <button
                onClick={() => {
                  setActiveTab('inbox')
                  setSelectedMessage(null)
                }}
                className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'inbox'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Gelen Kutusu</span>
                  {messages.filter(msg => !msg.is_read && activeTab === 'inbox').length > 0 && (
                    <Badge className="bg-red-100 text-red-800 text-xs">
                      {messages.filter(msg => !msg.is_read).length}
                    </Badge>
                  )}
                </div>
              </button>
              <button
                onClick={() => {
                  setActiveTab('sent')
                  setSelectedMessage(null)
                }}
                className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'sent'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Send className="w-4 h-4" />
                  <span>Gönderilen</span>
                </div>
              </button>
            </div>

            {/* Mesaj Listesi */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : messages.length > 0 ? (
                <div className="divide-y">
                  {messages.map((message) => {
                    const contact = activeTab === 'inbox' ? message.sender : message.receiver
                    const isSelected = selectedMessage?.id === message.id
                    const isUnread = !message.is_read && activeTab === 'inbox'

                    return (
                      <div
                        key={message.id}
                        onClick={() => {
                          setSelectedMessage(message)
                          if (isUnread) {
                            markAsRead(message.id)
                          }
                        }}
                        className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                          isSelected ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                        } ${isUnread ? 'bg-blue-25' : ''}`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                            {contact?.avatar_url ? (
                              <img
                                src={contact.avatar_url}
                                alt={`${contact.first_name} ${contact.last_name}`}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <User className="w-5 h-5 text-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className={`text-sm font-medium text-gray-900 truncate ${
                                isUnread ? 'font-semibold' : ''
                              }`}>
                                {contact?.first_name} {contact?.last_name}
                              </h4>
                              <div className="flex items-center space-x-1">
                                {isUnread && (
                                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                )}
                                <span className="text-xs text-gray-500">
                                  {formatDate(message.created_at)}
                                </span>
                              </div>
                            </div>
                            <p className={`text-sm text-gray-600 truncate mt-1 ${
                              isUnread ? 'font-medium' : ''
                            }`}>
                              {message.subject || 'Konu yok'}
                            </p>
                            <p className="text-xs text-gray-500 truncate mt-1">
                              {message.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                  <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm">
                    {activeTab === 'inbox' ? 'Henüz mesaj almadınız' : 'Henüz mesaj göndermediniz'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sağ Panel - Mesaj Detayı */}
          <div className="w-1/2 flex flex-col">
            {selectedMessage ? (
              <>
                {/* Mesaj Header */}
                <div className="p-6 border-b">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      {(activeTab === 'inbox' ? selectedMessage.sender : selectedMessage.receiver)?.avatar_url ? (
                        <img
                          src={(activeTab === 'inbox' ? selectedMessage.sender : selectedMessage.receiver)?.avatar_url}
                          alt="Avatar"
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {(activeTab === 'inbox' ? selectedMessage.sender : selectedMessage.receiver)?.first_name}{' '}
                        {(activeTab === 'inbox' ? selectedMessage.sender : selectedMessage.receiver)?.last_name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {(activeTab === 'inbox' ? selectedMessage.sender : selectedMessage.receiver)?.email}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {formatDate(selectedMessage.created_at)}
                        </span>
                        {!selectedMessage.is_read && activeTab === 'inbox' && (
                          <Badge className="bg-blue-100 text-blue-800 text-xs">Yeni</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  {selectedMessage.subject && (
                    <h4 className="text-md font-medium text-gray-900 mt-4">
                      {selectedMessage.subject}
                    </h4>
                  )}
                </div>

                {/* Mesaj İçeriği */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {selectedMessage.content}
                    </p>
                  </div>
                </div>

                {/* Cevap Formu (sadece gelen mesajlar için) */}
                {activeTab === 'inbox' && (
                  <div className="border-t p-6">
                    <h5 className="text-sm font-medium text-gray-900 mb-3">Cevap Gönder</h5>
                    <div className="space-y-3">
                      <Input
                        placeholder="Konu (opsiyonel)"
                        value={replySubject}
                        onChange={(e) => setReplySubject(e.target.value)}
                        className="text-sm"
                      />
                      <Textarea
                        placeholder="Mesajınızı yazın..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        rows={4}
                        className="text-sm"
                      />
                      <div className="flex justify-end">
                        <Button
                          onClick={sendReply}
                          disabled={!replyContent.trim() || isSending}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          {isSending ? 'Gönderiliyor...' : 'Gönder'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Bir mesaj seçin</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessagesModal
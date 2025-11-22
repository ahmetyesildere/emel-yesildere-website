'use client'

import React, { useState } from 'react'
import {
  Users, Calendar, MessageSquare, FileText, Settings, BarChart3,
  DollarSign, Plus, Download
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useContactInfo } from '@/hooks/use-contact-info'

// Import modular components
import DashboardOverview from './dashboard/dashboard-overview'
import UsersManagement from './users/users-management'
import SessionsManagement from './sessions/sessions-management'
import SessionTypesManagement from './sessions/session-types-management'
import PaymentsManagement from './payments/payments-management'

import BlogManagement from './blog/blog-management'
import AboutManagement from './about/about-management'
import TestimonialsManagement from './testimonials/testimonials-management'
import VideoManagement from './video/video-management'
import WhatsAppManagement from './whatsapp/whatsapp-management'




// Inline ContactMessages component
const ContactMessages = () => {
  const [messages, setMessages] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [showContactInfoModal, setShowContactInfoModal] = React.useState(false)
  const { contactInfo, updateContactInfo } = useContactInfo()
  const [tempContactInfo, setTempContactInfo] = React.useState(contactInfo)

  // Telefon numarasını formatla
  const formatPhoneInput = (value: string) => {
    // Sadece rakamları al
    const cleaned = value.replace(/\D/g, '')
    
    // Türkiye formatı: +90 555 123 4567
    if (cleaned.length <= 12) {
      if (cleaned.startsWith('90')) {
        const formatted = cleaned.slice(2)
        if (formatted.length <= 3) return `+90 ${formatted}`
        if (formatted.length <= 6) return `+90 ${formatted.slice(0, 3)} ${formatted.slice(3)}`
        if (formatted.length <= 8) return `+90 ${formatted.slice(0, 3)} ${formatted.slice(3, 6)} ${formatted.slice(6)}`
        return `+90 ${formatted.slice(0, 3)} ${formatted.slice(3, 6)} ${formatted.slice(6, 8)} ${formatted.slice(8)}`
      }
      
      // 0 ile başlayan yerel format
      if (cleaned.startsWith('0')) {
        if (cleaned.length <= 4) return cleaned
        if (cleaned.length <= 7) return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`
        if (cleaned.length <= 9) return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`
        return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 9)} ${cleaned.slice(9)}`
      }
      
      // Diğer durumlar için +90 ekle
      if (cleaned.length > 0) {
        if (cleaned.length <= 3) return `+90 ${cleaned}`
        if (cleaned.length <= 6) return `+90 ${cleaned.slice(0, 3)} ${cleaned.slice(3)}`
        if (cleaned.length <= 8) return `+90 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
        return `+90 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8)}`
      }
    }
    
    return value
  }

  React.useEffect(() => {
    const loadMessages = () => {
      try {
        const localMessages = JSON.parse(localStorage.getItem('contact_messages') || '[]')
        setMessages(localMessages)
        

      } catch (error) {
        console.error('Mesajlar yüklenirken hata:', error)
      } finally {
        setLoading(false)
      }
    }
    loadMessages()
  }, [])

  // Modal açıldığında mevcut bilgileri temp state'e kopyala
  React.useEffect(() => {
    if (showContactInfoModal) {
      setTempContactInfo(contactInfo)
    }
  }, [showContactInfoModal, contactInfo])

  const saveContactInfo = async () => {
    console.log('İletişim bilgileri kaydediliyor:', tempContactInfo)
    const success = await updateContactInfo(tempContactInfo)
    if (success) {
      setShowContactInfoModal(false)
      console.log('İletişim bilgileri başarıyla güncellendi')
      alert('İletişim bilgileri güncellendi! Sayfa yenilenmeden header ve footer güncellenecek.')
    } else {
      alert('Kaydetme sırasında hata oluştu!')
    }
  }

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
      {/* Header with Contact Info Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">İletişim Yönetimi</h2>
          <p className="text-gray-600">Mesajları yönetin ve iletişim bilgilerini güncelleyin</p>
        </div>
        <button
          onClick={() => setShowContactInfoModal(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2"
        >
          <Settings className="w-4 h-4" />
          <span>İletişim Bilgilerini Düzenle</span>
        </button>
      </div>

      {/* Contact Info Modal */}
      {showContactInfoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">İletişim Bilgilerini Düzenle</h3>
                <button
                  onClick={() => setShowContactInfoModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={tempContactInfo.phone}
                    onChange={(e) => {
                      const formatted = formatPhoneInput(e.target.value)
                      setTempContactInfo({...tempContactInfo, phone: formatted})
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+90 555 123 45 67"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta
                  </label>
                  <input
                    type="email"
                    value={tempContactInfo.email}
                    onChange={(e) => setTempContactInfo({...tempContactInfo, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="emel@emelyesildere.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={tempContactInfo.whatsapp}
                    onChange={(e) => {
                      const formatted = formatPhoneInput(e.target.value)
                      setTempContactInfo({...tempContactInfo, whatsapp: formatted})
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+90 555 123 45 67"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adres
                  </label>
                  <input
                    type="text"
                    value={tempContactInfo.address}
                    onChange={(e) => setTempContactInfo({...tempContactInfo, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="İstanbul, Türkiye"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Google Maps Embed URL
                  </label>
                  <textarea
                    value={tempContactInfo.mapUrl}
                    onChange={(e) => setTempContactInfo({...tempContactInfo, mapUrl: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Google Maps embed URL'sini buraya yapıştırın"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Google Maps'te konumunuzu bulun → Paylaş → Haritayı yerleştir → HTML kodunu kopyalayın
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hafta İçi
                    </label>
                    <input
                      type="text"
                      value={tempContactInfo.workingHours.weekdays}
                      onChange={(e) => setTempContactInfo({
                        ...tempContactInfo, 
                        workingHours: {...tempContactInfo.workingHours, weekdays: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="09:00 - 18:00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cumartesi
                    </label>
                    <input
                      type="text"
                      value={tempContactInfo.workingHours.saturday}
                      onChange={(e) => setTempContactInfo({
                        ...tempContactInfo, 
                        workingHours: {...tempContactInfo.workingHours, saturday: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="10:00 - 16:00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pazar
                    </label>
                    <input
                      type="text"
                      value={tempContactInfo.workingHours.sunday}
                      onChange={(e) => setTempContactInfo({
                        ...tempContactInfo, 
                        workingHours: {...tempContactInfo.workingHours, sunday: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Kapalı"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowContactInfoModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    İptal
                  </button>
                  <button
                    onClick={saveContactInfo}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Kaydet
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Gelen Mesajlar</h3>
        
        {messages.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {messages.map((message: any) => (
              <div key={message.id} className="bg-white p-6 rounded-lg shadow border">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{message.name}</h3>
                    <p className="text-gray-600">{message.email}</p>
                    {message.phone && <p className="text-gray-600">{message.phone}</p>}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(message.created_at).toLocaleDateString('tr-TR')}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">{message.subject}</h4>
                  <p className="text-gray-700">{message.message}</p>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => window.location.href = `mailto:${message.email}?subject=Re: ${message.subject}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    E-posta Gönder
                  </button>
                  {message.phone && (
                    <button
                      onClick={() => window.location.href = `tel:${message.phone}`}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Ara
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz mesaj yok</h3>
            <p className="text-gray-600 mb-4">İletişim formundan gelen mesajlar burada görünecek.</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-blue-800 text-sm">
                💡 İletişim sayfasından mesaj gönderdiğinizde burada görünecek.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard')

  // Debug için tab değişikliklerini logla
  const handleTabChange = (newTab: string) => {
    console.log('🔄 Admin tab değişiyor:', activeTab, '->', newTab)
    setActiveTab(newTab)
  }

  const navigationTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Kullanıcılar', icon: Users },
    { id: 'sessions', label: 'Seanslar', icon: Calendar },
    { id: 'session-types', label: 'Seans Türleri', icon: Settings },
    { id: 'testimonials', label: 'Yorumlar', icon: MessageSquare },
    { id: 'video', label: 'Video', icon: FileText },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
    { id: 'blog', label: 'Blog', icon: FileText },
    { id: 'about', label: 'Hakkımda', icon: Users },
    { id: 'contact', label: 'İletişim', icon: MessageSquare },
    { id: 'payments', label: 'Ödemeler', icon: DollarSign },
    { id: 'content', label: 'İçerik', icon: FileText },
    { id: 'settings', label: 'Ayarlar', icon: Settings }
  ]

  const PlaceholderTab = ({ tabId }: { tabId: string }) => {
    const tab = navigationTabs.find(t => t.id === tabId)
    const IconComponent = tab?.icon || FileText

    return (
      <div className="px-6 pb-6">
        <div className="text-center py-12">
          <IconComponent className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {tab?.label}
          </h3>
          <p className="text-gray-600">Bu özellik geliştiriliyor.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600">Emel Yeşildere - Yönetim Paneli</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Rapor İndir
              </Button>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Yeni Ekle
              </Button>
              

            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6">
          <div className="flex space-x-1 overflow-x-auto">
            {navigationTabs.map((tab) => {
              const IconComponent = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${isActive
                    ? 'bg-purple-50 text-purple-700 border-purple-600'
                    : 'text-gray-600 hover:text-gray-900 border-transparent hover:border-gray-300'
                    }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === 'dashboard' && <DashboardOverview />}

        {activeTab === 'users' && (
          <div className="px-6 pb-6">
            <UsersManagement key="users-management" activeTab={activeTab} />
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="px-6 pb-6">
            <SessionsManagement />
          </div>
        )}

        {activeTab === 'session-types' && (
          <div className="px-6 pb-6">
            <SessionTypesManagement />
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="px-6 pb-6">
            <PaymentsManagement />
          </div>
        )}

        {activeTab === 'blog' && (
          <div className="px-6 pb-6">
            <BlogManagement />
          </div>
        )}

        {activeTab === 'video' && (
          <div className="px-6 pb-6">
            <VideoManagement />
          </div>
        )}

        {activeTab === 'whatsapp' && (
          <div className="px-6 pb-6">
            <WhatsAppManagement />
          </div>
        )}

        {activeTab === 'about' && (
          <div className="px-6 pb-6">
            <AboutManagement />
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="px-6 pb-6">
            <ContactMessages />
          </div>
        )}

        {activeTab === 'testimonials' && (
          <div className="px-6 pb-6">
            <TestimonialsManagement />
          </div>
        )}

        {['content', 'settings'].includes(activeTab) && (
          <PlaceholderTab tabId={activeTab} />
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
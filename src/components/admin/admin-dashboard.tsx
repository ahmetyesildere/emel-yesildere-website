'use client'

import React, { useState } from 'react'
import {
  Users, Calendar, MessageSquare, FileText, Settings, BarChart3,
  DollarSign, Plus, Download
} from 'lucide-react'
import { Button } from '@/components/ui/button'

// Import modular components
import DashboardOverview from './dashboard/dashboard-overview'
import UsersManagement from './users/users-management'
import SessionsManagement from './sessions/sessions-management'
import PaymentsManagement from './payments/payments-management'
import MessagesManagement from './messages/messages-management'

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
    { id: 'blog', label: 'Blog', icon: FileText },
    { id: 'messages', label: 'Mesajlar', icon: MessageSquare },
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

        {activeTab === 'payments' && (
          <div className="px-6 pb-6">
            <PaymentsManagement />
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="px-6 pb-6">
            <MessagesManagement />
          </div>
        )}

        {['blog', 'content', 'settings'].includes(activeTab) && (
          <PlaceholderTab tabId={activeTab} />
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
'use client'

import React, { useState } from 'react'
import { Users, Calendar, MessageSquare, FileText, Settings, BarChart3 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard')

  const dashboardStats = [
    {
      title: 'Toplam Kullanıcı',
      value: '1,247',
      change: '+12%',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Bu Ay Seanslar',
      value: '89',
      change: '+8%',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Blog Yazıları',
      value: '156',
      change: '+5%',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ]

  const navigationTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Kullanıcılar', icon: Users },
    { id: 'sessions', label: 'Seanslar', icon: Calendar },
    { id: 'blog', label: 'Blog', icon: FileText },
    { id: 'messages', label: 'Mesajlar', icon: MessageSquare },
    { id: 'settings', label: 'Ayarlar', icon: Settings }
  ]

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
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6 bg-transparent">
              {navigationTabs.map((tab) => {
                const IconComponent = tab.icon
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex items-center space-x-2"
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {/* Dashboard Content */}
            <TabsContent value="dashboard" className="mt-6">
              <div className="px-6 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {dashboardStats.map((stat, index) => {
                    const IconComponent = stat.icon
                    return (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                              <p className="text-sm text-green-600">{stat.change}</p>
                            </div>
                            <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                              <IconComponent className={`w-6 h-6 ${stat.color}`} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="mt-6">
              <div className="px-6 pb-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Kullanıcı Yönetimi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Kullanıcı Yönetimi</h3>
                      <p className="text-gray-600">Kullanıcı yönetimi sistemi geliştiriliyor.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Other Tabs */}
            {['sessions', 'blog', 'messages', 'settings'].map((tabId) => (
              <TabsContent key={tabId} value={tabId} className="mt-6">
                <div className="px-6 pb-6">
                  <Card>
                    <CardContent className="p-8 text-center">
                      <div className="text-gray-400 mb-4">
                        {navigationTabs.find(t => t.id === tabId)?.icon && 
                          React.createElement(navigationTabs.find(t => t.id === tabId)!.icon, { className: "w-16 h-16 mx-auto" })
                        }
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {navigationTabs.find(t => t.id === tabId)?.label}
                      </h3>
                      <p className="text-gray-600">Bu özellik geliştiriliyor.</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
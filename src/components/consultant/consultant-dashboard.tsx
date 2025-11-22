'use client'

import React, { useState } from 'react'
import { useAuth } from '@/lib/auth/auth-context'
import { 
  Calendar, Users, MessageSquare, BarChart3, Clock, 
  DollarSign, Star, TrendingUp, Plus, Eye, Edit,
  Phone, Video, MapPin, CheckCircle, AlertCircle,
  User, Mail, Bell, Settings, FileText, Heart
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const ConsultantDashboard = () => {
  const { profile } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data - gerçek uygulamada API'den gelecek
  const dashboardStats = [
    {
      title: 'Bu Ay Seanslar',
      value: '24',
      change: '+12%',
      trend: 'up',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Aktif Müşteriler',
      value: '18',
      change: '+8%',
      trend: 'up',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Aylık Gelir',
      value: '₺12,500',
      change: '+15%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    },
    {
      title: 'Ortalama Puan',
      value: '4.8',
      change: '+0.2',
      trend: 'up',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ]

  const upcomingSessions = [
    {
      id: 1,
      client: 'Ayşe Kaya',
      service: 'Duygu Temizliği',
      date: '2024-07-28',
      time: '14:00',
      type: 'online',
      status: 'confirmed',
      duration: 90
    },
    {
      id: 2,
      client: 'Mehmet Demir',
      service: 'Travma İyileştirme',
      date: '2024-07-28',
      time: '16:30',
      type: 'in_person',
      status: 'confirmed',
      duration: 60
    },
    {
      id: 3,
      client: 'Fatma Özkan',
      service: 'Yaşam Koçluğu',
      date: '2024-07-29',
      time: '10:00',
      type: 'online',
      status: 'pending',
      duration: 60
    }
  ]

  const recentMessages = [
    {
      id: 1,
      client: 'Ayşe Kaya',
      message: 'Yarınki seansımız için hazırlanmam gereken bir şey var mı?',
      time: '2 saat önce',
      unread: true
    },
    {
      id: 2,
      client: 'Mehmet Demir',
      message: 'Teşekkür ederim, çok faydalı bir seans oldu.',
      time: '5 saat önce',
      unread: false
    },
    {
      id: 3,
      client: 'Fatma Özkan',
      message: 'Randevu saatimi değiştirebilir miyiz?',
      time: '1 gün önce',
      unread: true
    }
  ]

  const getSessionTypeIcon = (type: string) => {
    return type === 'online' ? Video : MapPin
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: { label: 'Onaylandı', color: 'bg-green-100 text-green-800' },
      pending: { label: 'Beklemede', color: 'bg-yellow-100 text-yellow-800' },
      cancelled: { label: 'İptal', color: 'bg-red-100 text-red-800' }
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return <Badge className={config.color}>{config.label}</Badge>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Hoş Geldiniz, {profile?.first_name}
              </h1>
              <p className="text-gray-600 mt-1">Danışman Paneli - Bugün {new Date().toLocaleDateString('tr-TR')}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Bildirimler
              </Button>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Yeni Seans
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <div className="flex items-center mt-1">
                        <TrendingUp className={`w-4 h-4 mr-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
                        <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.change}
                        </span>
                      </div>
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

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
            <TabsTrigger value="sessions">Seanslar</TabsTrigger>
            <TabsTrigger value="clients">Müşteriler</TabsTrigger>
            <TabsTrigger value="reports">Raporlar</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Upcoming Sessions */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                      Yaklaşan Seanslar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingSessions.map((session) => {
                        const TypeIcon = getSessionTypeIcon(session.type)
                        return (
                          <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{session.client}</h4>
                                <p className="text-sm text-gray-600">{session.service}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <TypeIcon className="w-4 h-4 text-gray-500" />
                                  <span className="text-xs text-gray-500">
                                    {session.date} - {session.time} ({session.duration} dk)
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getStatusBadge(session.status)}
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Messages */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2 text-green-600" />
                      Son Mesajlar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentMessages.map((message) => (
                        <div key={message.id} className={`p-3 rounded-lg ${message.unread ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-gray-900">{message.client}</h5>
                            {message.unread && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">{message.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{message.time}</p>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      Tüm Mesajları Gör
                    </Button>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="w-5 h-5 mr-2 text-purple-600" />
                      Hızlı İşlemler
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700">
                        <Calendar className="w-4 h-4 mr-2" />
                        Yeni Randevu Oluştur
                      </Button>
                      <Button className="w-full justify-start bg-green-600 hover:bg-green-700">
                        <FileText className="w-4 h-4 mr-2" />
                        Seans Notları
                      </Button>
                      <Button className="w-full justify-start bg-purple-600 hover:bg-purple-700">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Performans Raporu
                      </Button>
                      <Button className="w-full justify-start bg-orange-600 hover:bg-orange-700">
                        <Heart className="w-4 h-4 mr-2" />
                        Müşteri Geri Bildirimleri
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Sessions Tab */}
          <TabsContent value="sessions">
            <Card>
              <CardHeader>
                <CardTitle>Seans Yönetimi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Seans yönetimi bileşeni burada olacak...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients">
            <Card>
              <CardHeader>
                <CardTitle>Müşteri Yönetimi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Müşteri yönetimi bileşeni burada olacak...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Raporlar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Raporlar bileşeni burada olacak...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default ConsultantDashboard
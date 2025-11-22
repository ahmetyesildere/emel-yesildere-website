'use client'

import React, { useState, useEffect } from 'react'
import { 
  Users, Calendar, MessageSquare, FileText, Settings, BarChart3, 
  Heart, TrendingUp, DollarSign, UserCheck, AlertCircle, CheckCircle,
  Plus, Edit, Trash2, Eye, Filter, Download
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { supabase } from '@/lib/supabase'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard')

  // Dashboard Stats
  const dashboardStats = [
    {
      title: 'Toplam Kullanıcı',
      value: '1,247',
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Bu Ay Seanslar',
      value: '89',
      change: '+8%',
      trend: 'up',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Blog Yazıları',
      value: '156',
      change: '+5%',
      trend: 'up',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Aylık Gelir',
      value: '₺45,600',
      change: '+15%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    },
    {
      title: 'Bekleyen Mesajlar',
      value: '23',
      change: '-3%',
      trend: 'down',
      icon: MessageSquare,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Aktif Seanslar',
      value: '12',
      change: '+2%',
      trend: 'up',
      icon: UserCheck,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100'
    }
  ]

  const navigationTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Kullanıcılar', icon: Users },
    { id: 'sessions', label: 'Seanslar', icon: Calendar },
    { id: 'blog', label: 'Blog', icon: FileText },
    { id: 'messages', label: 'Mesajlar', icon: MessageSquare },
    { id: 'payments', label: 'Ödemeler', icon: DollarSign },
    { id: 'content', label: 'İçerik', icon: Edit },
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
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-8 bg-transparent">
              {navigationTabs.map((tab) => {
                const IconComponent = tab.icon
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex items-center space-x-2 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 data-[state=active]:border-b-2 data-[state=active]:border-purple-600"
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
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
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

                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Dashboard Aktif</h3>
                  <p className="text-gray-600">
                    Admin paneli başarıyla yüklendi. Diğer sekmeleri kullanabilirsiniz.
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="mt-6">
              <div className="px-6 pb-6">
                <UsersManagement />
              </div>
            </TabsContent>

            {/* Other Tabs */}
            {['sessions', 'blog', 'messages', 'payments', 'content', 'settings'].map((tabId) => (
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

// Users Management Component
const UsersManagement = () => {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [activeUserTab, setActiveUserTab] = useState('all')

  // Kullanıcıları yükle
  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading users:', error)
        setUsers([])
      } else {
        // Null değerleri filtrele ve eksik alanları varsayılan değerlerle doldur
        const cleanedUsers = (data || [])
          .filter(user => user && user.id && user.email)
          .map(user => ({
            ...user,
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            email: user.email || '',
            phone: user.phone || '',
            role: user.role || 'visitor',
            is_active: user.is_active !== false,
            created_at: user.created_at || new Date().toISOString()
          }))
        
        setUsers(cleanedUsers)
      }
    } catch (error) {
      console.error('Error loading users:', error)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { label: 'Admin', color: 'bg-red-100 text-red-800' },
      consultant: { label: 'Danışman', color: 'bg-purple-100 text-purple-800' },
      client: { label: 'Müşteri', color: 'bg-blue-100 text-blue-800' },
      visitor: { label: 'Ziyaretçi', color: 'bg-gray-100 text-gray-800' }
    }
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.visitor
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const getUsersByRole = (role: string) => {
    if (role === 'all') return users
    return users.filter(user => user.role === role)
  }

  const getRoleStats = () => {
    return {
      all: users.length,
      consultant: users.filter(u => u.role === 'consultant').length,
      client: users.filter(u => u.role === 'client').length,
      visitor: users.filter(u => u.role === 'visitor').length
    }
  }

  const userTabs = [
    { id: 'all', label: 'Tüm Kullanıcılar', icon: Users },
    { id: 'consultant', label: 'Danışmanlar', icon: UserCheck },
    { id: 'client', label: 'Danışanlar', icon: Heart },
    { id: 'visitor', label: 'Ziyaretçiler', icon: Eye }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  const roleStats = getRoleStats()
  const filteredUsers = getUsersByRole(activeUserTab)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Kullanıcı Yönetimi</h2>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Yeni Kullanıcı
        </Button>
      </div>

      {/* Role Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Kullanıcı</p>
                <p className="text-2xl font-bold text-gray-900">{roleStats.all}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Danışmanlar</p>
                <p className="text-2xl font-bold text-purple-600">{roleStats.consultant}</p>
              </div>
              <UserCheck className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Danışanlar</p>
                <p className="text-2xl font-bold text-blue-600">{roleStats.client}</p>
              </div>
              <Heart className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ziyaretçiler</p>
                <p className="text-2xl font-bold text-gray-600">{roleStats.visitor}</p>
              </div>
              <Eye className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Role Tabs */}
      <Tabs value={activeUserTab} onValueChange={setActiveUserTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-4">
          {userTabs.map((tab) => {
            const IconComponent = tab.icon
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center space-x-2"
              >
                <IconComponent className="w-4 h-4" />
                <span>{tab.label}</span>
                <Badge variant="secondary" className="ml-2">
                  {tab.id === 'all' ? roleStats.all : roleStats[tab.id as keyof typeof roleStats]}
                </Badge>
              </TabsTrigger>
            )
          })}
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {activeUserTab === 'all' ? 'Tüm Kullanıcılar' : 
               activeUserTab === 'consultant' ? 'Danışmanlar' :
               activeUserTab === 'client' ? 'Danışanlar' : 'Ziyaretçiler'}
              <Badge variant="secondary" className="ml-2">
                {filteredUsers.length}
              </Badge>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Input placeholder="Kullanıcı ara..." className="w-64" />
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Kullanıcı</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Rol</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Durum</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Kayıt Tarihi</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-sm text-gray-600">{user.email}</div>
                          {user.phone && (
                            <div className="text-xs text-gray-500">+90 {user.phone}</div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={user.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {user.is_active ? 'Aktif' : 'Pasif'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(user.created_at).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setEditingUser(user)
                              setShowRoleModal(true)
                            }}
                            title="Düzenle"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" title="Görüntüle">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" title="Sil">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      Kullanıcı bulunamadı
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Simple Role Change Modal */}
      {showRoleModal && editingUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4" style={{ zIndex: 2147483647 }}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" style={{ zIndex: 2147483648 }}>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Kullanıcı Düzenle
              </h3>
              
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-2">Kullanıcı:</div>
                <div className="font-medium text-gray-900">
                  {editingUser.first_name} {editingUser.last_name}
                </div>
                <div className="text-sm text-gray-600">{editingUser.email}</div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-2">Mevcut Rol:</div>
                {getRoleBadge(editingUser.role)}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yeni Rol Seçin:
                </label>
                <Select 
                  defaultValue={editingUser.role}
                  onValueChange={(value) => {
                    setEditingUser({...editingUser, newRole: value})
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Rol seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visitor">Ziyaretçi</SelectItem>
                    <SelectItem value="client">Müşteri</SelectItem>
                    <SelectItem value="consultant">Danışman</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRoleModal(false)
                    setEditingUser(null)
                  }}
                  className="flex-1"
                >
                  İptal
                </Button>
                <Button
                  onClick={() => {
                    alert('Rol güncelleme özelliği geliştiriliyor.')
                    setShowRoleModal(false)
                    setEditingUser(null)
                  }}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  Rolü Güncelle
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
'use client'

import React, { useState, useEffect } from 'react'
import {
  Users, Calendar, MessageSquare, FileText, Settings, BarChart3,
  Heart, Brain, Target, Sparkles, Mail, Phone, MapPin, Clock,
  TrendingUp, DollarSign, UserCheck, AlertCircle, CheckCircle,
  Plus, Edit, Trash2, Eye, Filter, Search, Download, Upload,
  User, Camera, Award, BookOpen, X
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { supabase } from '@/lib/supabase'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [mountedTabs, setMountedTabs] = useState<Set<string>>(new Set(['dashboard']))
  const [isComponentReady, setIsComponentReady] = useState(false)

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    setMountedTabs(prev => new Set([...prev, tabId]))
  }

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

  // Recent Activities
  const recentActivities = [
    {
      type: 'session',
      title: 'Yeni seans rezervasyonu',
      description: 'Ayşe Kaya - Duygu Temizliği',
      time: '5 dakika önce',
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      type: 'message',
      title: 'Yeni iletişim mesajı',
      description: 'Mehmet Demir - Randevu talebi',
      time: '15 dakika önce',
      icon: MessageSquare,
      color: 'text-green-600'
    },
    {
      type: 'blog',
      title: 'Blog yazısı yayınlandı',
      description: 'Stres Yönetimi Teknikleri',
      time: '2 saat önce',
      icon: FileText,
      color: 'text-purple-600'
    },
    {
      type: 'payment',
      title: 'Ödeme alındı',
      description: '₺500 - Online seans',
      time: '3 saat önce',
      icon: DollarSign,
      color: 'text-emerald-600'
    },
    {
      type: 'user',
      title: 'Yeni kullanıcı kaydı',
      description: 'Fatma Özkan',
      time: '5 saat önce',
      icon: Users,
      color: 'text-orange-600'
    }
  ]

  // Quick Actions
  const quickActions = [
    {
      title: 'Yeni Blog Yazısı',
      description: 'Blog yazısı oluştur',
      icon: Plus,
      color: 'bg-blue-600 hover:bg-blue-700',
      action: 'create-blog'
    },
    {
      title: 'Seans Planla',
      description: 'Yeni seans ekle',
      icon: Calendar,
      color: 'bg-green-600 hover:bg-green-700',
      action: 'create-session'
    },
    {
      title: 'Mesajları Gör',
      description: 'İletişim mesajları',
      icon: MessageSquare,
      color: 'bg-purple-600 hover:bg-purple-700',
      action: 'view-messages'
    },
    {
      title: 'Raporlar',
      description: 'Analitik raporlar',
      icon: BarChart3,
      color: 'bg-orange-600 hover:bg-orange-700',
      action: 'view-reports'
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
          <Tabs value={activeTab} onValueChange={handleTabChange}>
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

                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Recent Activities */}
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Clock className="w-5 h-5 mr-2 text-blue-600" />
                          Son Aktiviteler
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {recentActivities.map((activity, index) => {
                            const IconComponent = activity.icon
                            return (
                              <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                                <div className={`w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm`}>
                                  <IconComponent className={`w-5 h-5 ${activity.color}`} />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900">{activity.title}</h4>
                                  <p className="text-sm text-gray-600">{activity.description}</p>
                                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                          Hızlı İşlemler
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {quickActions.map((action, index) => {
                            const IconComponent = action.icon
                            return (
                              <Button
                                key={index}
                                className={`w-full justify-start ${action.color} text-white`}
                                size="lg"
                              >
                                <IconComponent className="w-5 h-5 mr-3" />
                                <div className="text-left">
                                  <div className="font-medium">{action.title}</div>
                                  <div className="text-xs opacity-90">{action.description}</div>
                                </div>
                              </Button>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>

                    {/* System Status */}
                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                          Sistem Durumu
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Website</span>
                            <Badge className="bg-green-100 text-green-800">Aktif</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Veritabanı</span>
                            <Badge className="bg-green-100 text-green-800">Aktif</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">E-posta</span>
                            <Badge className="bg-green-100 text-green-800">Aktif</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Yedekleme</span>
                            <Badge className="bg-yellow-100 text-yellow-800">Beklemede</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="mt-6">
              <div className="px-6 pb-6">
                {activeTab === 'users' && <UsersManagement key="users-management" />}
              </div>
            </TabsContent>

            {/* Sessions Tab */}
            <TabsContent value="sessions" className="mt-6">
              <div className="px-6 pb-6">
                {mountedTabs.has('sessions') && <SessionsManagement key="sessions-management" />}
              </div>
            </TabsContent>

            {/* Blog Tab */}
            <TabsContent value="blog" className="mt-6">
              <div className="px-6 pb-6">
                {mountedTabs.has('blog') && <BlogManagement key="blog-management" />}
              </div>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages" className="mt-6">
              <div className="px-6 pb-6">
                {mountedTabs.has('messages') && <MessagesManagement key="messages-management" />}
              </div>
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments" className="mt-6">
              <div className="px-6 pb-6">
                {mountedTabs.has('payments') && <PaymentsManagement key="payments-management" />}
              </div>
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content" className="mt-6">
              <div className="px-6 pb-6">
                {mountedTabs.has('content') && <ContentManagement key="content-management" />}
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="mt-6">
              <div className="px-6 pb-6">
                {mountedTabs.has('settings') && <SystemSettings key="settings-management" />}
              </div>
            </TabsContent>
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
  const [initialized, setInitialized] = useState(false)
  const [activeUserTab, setActiveUserTab] = useState('all')
  const [consultantForm, setConsultantForm] = useState({
    tc_no: '',
    first_name: '',
    last_name: '',
    phone: '',
    bio: '',
    profile_photo: null as File | null,
    profile_photo_preview: '' as string,
    specialties: [] as string[],
    certificates: [] as { file: File; area: string; type: string; preview?: string }[]
  })
  const [selectedArea, setSelectedArea] = useState('')
  const [selectedDocType, setSelectedDocType] = useState('')
  const [previewDocument, setPreviewDocument] = useState<{ file: File; preview: string } | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  // Uzmanlık alanları ve belge türleri
  const specialtyAreas = [
    { value: 'duygu-temizligi', label: 'Duygu Temizliği', color: 'text-blue-600' },
    { value: 'travma-iyilestirme', label: 'Travma İyileştirme', color: 'text-red-600' },
    { value: 'yasam-koclugu', label: 'Yaşam Koçluğu', color: 'text-green-600' },
    { value: 'holistik-kocluk', label: 'Holistik Koçluk', color: 'text-purple-600' },
    { value: 'stres-yonetimi', label: 'Stres Yönetimi', color: 'text-orange-600' },
    { value: 'iliski-danismanligi', label: 'İlişki Danışmanlığı', color: 'text-pink-600' },
    { value: 'kariyer-koclugu', label: 'Kariyer Koçluğu', color: 'text-indigo-600' },
    { value: 'aile-danismanligi', label: 'Aile Danışmanlığı', color: 'text-teal-600' }
  ]

  const documentTypes = [
    { value: 'sertifika', label: 'Sertifika', icon: Award },
    { value: 'diploma', label: 'Diploma', icon: BookOpen },
    { value: 'kimlik', label: 'Kimlik Kartı', icon: User },
    { value: 'cv', label: 'CV/Özgeçmiş', icon: FileText },
    { value: 'lisans', label: 'Meslek Lisansı', icon: CheckCircle },
    { value: 'referans', label: 'Referans Mektubu', icon: Mail }
  ]

  // Belge yükleme fonksiyonu
  const handleDocumentUpload = (file: File) => {
    if (!selectedArea || !selectedDocType) {
      alert('Lütfen önce alan ve belge türü seçin!')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const preview = event.target?.result as string
      const newDocument = {
        file,
        area: selectedArea,
        type: selectedDocType,
        preview
      }

      setConsultantForm(prev => ({
        ...prev,
        certificates: [...prev.certificates, newDocument]
      }))

      // Seçimleri sıfırla
      setSelectedArea('')
      setSelectedDocType('')
    }
    reader.readAsDataURL(file)
  }

  // Belge önizleme fonksiyonu
  const handleDocumentPreview = (document: { file: File; preview?: string }) => {
    if (document.preview) {
      setPreviewDocument({
        file: document.file,
        preview: document.preview
      })
    }
  }

  // Belge silme fonksiyonu
  const removeDocument = (index: number) => {
    setConsultantForm(prev => ({
      ...prev,
      certificates: prev.certificates.filter((_, i) => i !== index)
    }))
  }

  // Kullanıcıları yükle
  useEffect(() => {
    if (!initialized) {
      loadUsers()
      setInitialized(true)
    }
  }, [initialized])

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading users:', error)
      } else {
        // Null değerleri filtrele ve eksik alanları varsayılan değerlerle doldur
        const cleanedUsers = (data || [])
          .filter(user => user && user.id) // Null kullanıcıları filtrele
          .map(user => ({
            ...user,
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            email: user.email || '',
            phone: user.phone || '',
            role: user.role || 'visitor',
            is_active: user.is_active !== false, // Default true
            created_at: user.created_at || new Date().toISOString(),
            tc_no: user.tc_no || '',
            bio: user.bio || '',
            specialties: user.specialties || [],
            certificates: user.certificates || [],
            profile_photo_url: user.profile_photo_url || ''
          }))

        console.log('Loaded users:', cleanedUsers)
        setUsers(cleanedUsers)
      }
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateUserRole = async (userId: string, newRole: string) => {
    setIsUpdating(true)
    try {
      console.log('🚀 Starting user update:', { userId, newRole, consultantForm })

      // Profil fotoğrafını yükle (eğer varsa)
      let profilePhotoUrl = null
      if (consultantForm.profile_photo) {
        console.log('📸 Uploading profile photo...')
        const fileExt = consultantForm.profile_photo.name.split('.').pop()
        const fileName = `${userId}-${Date.now()}.${fileExt}`

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('profile-photos')
          .upload(fileName, consultantForm.profile_photo)

        if (uploadError) {
          console.error('❌ Profile photo upload error:', uploadError)
          alert(`Profil fotoğrafı yüklenirken hata: ${uploadError.message}`)
          return
        } else {
          console.log('✅ Profile photo uploaded:', uploadData)
          const { data: { publicUrl } } = supabase.storage
            .from('profile-photos')
            .getPublicUrl(fileName)
          profilePhotoUrl = publicUrl
          console.log('📸 Profile photo URL:', profilePhotoUrl)
        }
      }

      // Belgeleri yükle (eğer varsa)
      const uploadedCertificates = []
      if (consultantForm.certificates.length > 0) {
        console.log('📄 Processing certificates...')
        for (const cert of consultantForm.certificates) {
          if (cert.file) {
            // Yeni yüklenen belgeler
            const fileExt = cert.file.name.split('.').pop()
            const fileName = `${userId}-${cert.area}-${cert.type}-${Date.now()}.${fileExt}`

            console.log(`📄 Uploading new certificate: ${fileName}`)
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('certificates')
              .upload(fileName, cert.file)

            if (uploadError) {
              console.error('❌ Certificate upload error:', uploadError)
              alert(`Belge yüklenirken hata: ${uploadError.message}`)
              return
            } else {
              console.log('✅ Certificate uploaded:', uploadData)
              const { data: { publicUrl } } = supabase.storage
                .from('certificates')
                .getPublicUrl(fileName)

              uploadedCertificates.push({
                area: cert.area,
                type: cert.type,
                url: publicUrl,
                filename: cert.file.name
              })
            }
          } else if (cert.url) {
            // Mevcut belgeler - sadece metadata'yı koru
            uploadedCertificates.push({
              area: cert.area,
              type: cert.type,
              url: cert.url,
              filename: cert.filename
            })
          }
        }
        console.log('📄 All certificates processed:', uploadedCertificates)
      }

      // Kullanıcı profilini güncelle
      const updateData: any = {
        role: newRole,
        first_name: consultantForm.first_name || null,
        last_name: consultantForm.last_name || null,
        phone: consultantForm.phone ? consultantForm.phone.replace(/\D/g, '') : null,
        updated_at: new Date().toISOString()
      }

      // Opsiyonel alanları ekle
      if (consultantForm.tc_no) {
        updateData.tc_no = consultantForm.tc_no
      }

      if (consultantForm.bio) {
        updateData.bio = consultantForm.bio
      }

      if (consultantForm.specialties.length > 0) {
        updateData.specialties = consultantForm.specialties
      }

      if (uploadedCertificates.length > 0) {
        updateData.certificates = uploadedCertificates
      }

      if (profilePhotoUrl) {
        updateData.profile_photo_url = profilePhotoUrl
      }

      console.log('💾 Updating database with:', updateData)

      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId)
        .select()

      console.log('💾 Database update response:', { data, error })

      if (error) {
        console.error('❌ Database update error:', error)
        alert(`❌ Veritabanı Hatası!\n\n${error.message}\n\nDetay: ${error.details || 'Bilinmeyen hata'}`)
      } else {
        console.log('✅ User updated successfully:', data)
        alert(`✅ Başarılı!\n\nKullanıcı bilgileri başarıyla güncellendi!\n\n• Profil bilgileri kaydedildi\n${consultantForm.profile_photo ? '• Profil fotoğrafı yüklendi\n' : ''}${uploadedCertificates.length > 0 ? `• ${uploadedCertificates.length} belge yüklendi\n` : ''}• Rol güncellendi: ${newRole === 'consultant' ? 'Danışman' : newRole}`)

        loadUsers() // Listeyi yenile
        setShowRoleModal(false)
        setEditingUser(null)
        setShowConfirmDialog(false)
        // Form'u temizle
        setConsultantForm({
          tc_no: '',
          first_name: '',
          last_name: '',
          phone: '',
          bio: '',
          profile_photo: null,
          profile_photo_preview: '',
          specialties: [],
          certificates: []
        })
      }
    } catch (error) {
      console.error('❌ Unexpected error:', error)
      alert(`❌ Beklenmeyen Hata!\n\n${error instanceof Error ? error.message : 'Bilinmeyen hata'}\n\nLütfen console'u kontrol edin.`)
    } finally {
      setIsUpdating(false)
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
      visitor: users.filter(u => u.role === 'visitor').length,
      admin: users.filter(u => u.role === 'admin').length
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
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Seanslar</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers
                  .filter(user => user && user.id && user.email)
                  .map((user) => {
                    // Güvenli değer kontrolü
                    const firstName = user?.first_name || ''
                    const lastName = user?.last_name || ''
                    const email = user?.email || 'E-posta yok'
                    const phone = user?.phone || ''
                    const role = user?.role || 'visitor'
                    const isActive = user?.is_active !== false
                    const createdAt = user?.created_at || new Date().toISOString()

                    return (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium text-gray-900">
                              {firstName} {lastName}
                            </div>
                            <div className="text-sm text-gray-600">{email}</div>
                            {phone && (
                              <div className="text-xs text-gray-500">+90 {phone}</div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {getRoleBadge(role)}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {isActive ? 'Aktif' : 'Pasif'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {new Date(createdAt).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="py-3 px-4 text-gray-600">-</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingUser(user)
                                // Form state'ini kullanıcı bilgileri ile başlat
                                setConsultantForm({
                                  tc_no: user.tc_no || '',
                                  first_name: user.first_name || '',
                                  last_name: user.last_name || '',
                                  phone: user.phone ? (user.phone.startsWith('+90') ? user.phone : `+90 (${user.phone.slice(0, 3)}) ${user.phone.slice(3, 6)} ${user.phone.slice(6, 8)} ${user.phone.slice(8, 10)}`) : '',
                                  bio: user.bio || '',
                                  profile_photo: null,
                                  profile_photo_preview: user.profile_photo_url || '',
                                  specialties: user.specialties || [],
                                  certificates: (user.certificates || []).map((cert: any) => ({
                                    file: null, // Mevcut belgeler için file objesi yok
                                    area: cert.area,
                                    type: cert.type,
                                    preview: cert.url,
                                    filename: cert.filename,
                                    url: cert.url
                                  }))
                                })
                                setShowRoleModal(true)
                              }}
                              title="Rol Değiştir"
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
                    )
                  })}
                <tr>
                  <td className="py-3 px-4 text-gray-600">-</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingUser(user)
                          // Form state'ini kullanıcı bilgileri ile başlat
                          setConsultantForm({
                            tc_no: user.tc_no || '',
                            first_name: user.first_name || '',
                            last_name: user.last_name || '',
                            phone: user.phone ? (user.phone.startsWith('+90') ? user.phone : `+90 (${user.phone.slice(0, 3)}) ${user.phone.slice(3, 6)} ${user.phone.slice(6, 8)} ${user.phone.slice(8, 10)}`) : '',
                            bio: user.bio || '',
                            profile_photo: null,
                            profile_photo_preview: user.profile_photo_url || '',
                            specialties: user.specialties || [],
                            certificates: (user.certificates || []).map((cert: any) => ({
                              file: null, // Mevcut belgeler için file objesi yok
                              area: cert.area,
                              type: cert.type,
                              preview: cert.url,
                              filename: cert.filename,
                              url: cert.url
                            }))
                          })
                          setShowRoleModal(true)
                        }}
                        title="Rol Değiştir"
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
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced User Edit Modal */}
      {showRoleModal && editingUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4" style={{ zIndex: 2147483647 }}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" style={{ zIndex: 2147483648 }}>
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Kullanıcı Bilgilerini Düzenle
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowRoleModal(false)
                    setEditingUser(null)
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column - Basic Info */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Basic Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <User className="w-5 h-5 mr-2 text-blue-600" />
                        Temel Bilgiler
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            TC Kimlik No
                          </label>
                          <Input
                            type="text"
                            maxLength={11}
                            value={consultantForm.tc_no}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '')
                              setConsultantForm(prev => ({ ...prev, tc_no: value }))
                            }}
                            placeholder="12345678901"
                            className="font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Telefon
                          </label>
                          <Input
                            type="tel"
                            value={consultantForm.phone}
                            onChange={(e) => {
                              let value = e.target.value.replace(/\D/g, '')
                              if (value.length > 0) {
                                if (value.startsWith('90')) {
                                  value = value.substring(2)
                                }
                                if (value.startsWith('0')) {
                                  value = value.substring(1)
                                }
                                if (value.length <= 10) {
                                  const formatted = value.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '+90 ($1) $2 $3 $4')
                                  setConsultantForm(prev => ({ ...prev, phone: formatted }))
                                }
                              } else {
                                setConsultantForm(prev => ({ ...prev, phone: '' }))
                              }
                            }}
                            placeholder="+90 (555) 123 45 67"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ad
                          </label>
                          <Input
                            type="text"
                            value={consultantForm.first_name}
                            onChange={(e) => setConsultantForm(prev => ({ ...prev, first_name: e.target.value }))}
                            placeholder="Ad"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Soyad
                          </label>
                          <Input
                            type="text"
                            value={consultantForm.last_name}
                            onChange={(e) => setConsultantForm(prev => ({ ...prev, last_name: e.target.value }))}
                            placeholder="Soyad"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Özgeçmiş
                        </label>
                        <Textarea
                          value={consultantForm.bio}
                          onChange={(e) => setConsultantForm(prev => ({ ...prev, bio: e.target.value }))}
                          placeholder="Danışmanın özgeçmişi, deneyimleri ve yaklaşımı hakkında bilgi..."
                          rows={4}
                          className="resize-none"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Specialties */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Award className="w-5 h-5 mr-2 text-purple-600" />
                        Uzmanlık Alanları
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          'Duygu Temizliği',
                          'Travma İyileştirme',
                          'Yaşam Koçluğu',
                          'Holistik Koçluk',
                          'Stres Yönetimi',
                          'İlişki Danışmanlığı',
                          'Kariyer Koçluğu',
                          'Aile Danışmanlığı'
                        ].map((specialty) => (
                          <label key={specialty} className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={consultantForm.specialties.includes(specialty)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setConsultantForm(prev => ({
                                    ...prev,
                                    specialties: [...prev.specialties, specialty]
                                  }))
                                } else {
                                  setConsultantForm(prev => ({
                                    ...prev,
                                    specialties: prev.specialties.filter(s => s !== specialty)
                                  }))
                                }
                              }}
                              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            />
                            <span className="text-sm text-gray-700">{specialty}</span>
                          </label>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Certificates */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BookOpen className="w-5 h-5 mr-2 text-green-600" />
                        Sertifikalar ve Belgeler
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Alan ve Belge Türü Seçimi */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Uzmanlık Alanı Seçin
                            </label>
                            <select
                              value={selectedArea}
                              onChange={(e) => setSelectedArea(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            >
                              <option value="">Alan seçin</option>
                              {specialtyAreas.map((area) => (
                                <option key={area.value} value={area.value}>
                                  {area.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Belge Türü Seçin
                            </label>
                            <select
                              value={selectedDocType}
                              onChange={(e) => setSelectedDocType(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            >
                              <option value="">Belge türü seçin</option>
                              {documentTypes.map((docType) => (
                                <option key={docType.value} value={docType.value}>
                                  {docType.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Seçilen Alan ve Belge Türü Gösterimi */}
                        {(selectedArea || selectedDocType) && (
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center space-x-2 text-sm">
                              {selectedArea && (
                                <Badge className={`${specialtyAreas.find(a => a.value === selectedArea)?.color} bg-white`}>
                                  {specialtyAreas.find(a => a.value === selectedArea)?.label}
                                </Badge>
                              )}
                              {selectedDocType && (
                                <Badge variant="secondary">
                                  {documentTypes.find(d => d.value === selectedDocType)?.label}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Dosya Yükleme Alanı */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 mb-2">
                            {selectedArea && selectedDocType
                              ? `${specialtyAreas.find(a => a.value === selectedArea)?.label} - ${documentTypes.find(d => d.value === selectedDocType)?.label} belgesi yükleyin`
                              : 'Önce alan ve belge türü seçin'
                            }
                          </p>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                handleDocumentUpload(file)
                              }
                            }}
                            className="hidden"
                            id="certificates-upload"
                            disabled={!selectedArea || !selectedDocType}
                          />
                          <label
                            htmlFor="certificates-upload"
                            className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${selectedArea && selectedDocType
                                ? 'text-gray-700 bg-white hover:bg-gray-50 cursor-pointer'
                                : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                              }`}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Dosya Seç
                          </label>
                        </div>

                        {/* Yüklenen Belgeler */}
                        {consultantForm.certificates.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="text-sm font-medium text-gray-700">Yüklenen Belgeler:</h4>
                            <div className="space-y-2">
                              {consultantForm.certificates.map((document, index) => {
                                const area = specialtyAreas.find(a => a.value === document.area)
                                const docType = documentTypes.find(d => d.value === document.type)
                                const DocIcon = docType?.icon || FileText

                                return (
                                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                                    <div className="flex items-center space-x-3">
                                      <DocIcon className="w-5 h-5 text-gray-600" />
                                      <div>
                                        <div className="flex items-center space-x-2">
                                          <Badge className={`${area?.color} bg-white text-xs`}>
                                            {area?.label}
                                          </Badge>
                                          <Badge variant="secondary" className="text-xs">
                                            {docType?.label}
                                          </Badge>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{document.file.name}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDocumentPreview(document)}
                                        title="Önizleme"
                                      >
                                        <Eye className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => removeDocument(index)}
                                        className="text-red-600 hover:text-red-700"
                                        title="Sil"
                                      >
                                        <X className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Profile & Role */}
                <div className="space-y-6">
                  {/* Profile Photo */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Camera className="w-5 h-5 mr-2 text-indigo-600" />
                        Profil Fotoğrafı
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="w-32 h-40 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                          {consultantForm.profile_photo_preview ? (
                            <img
                              src={consultantForm.profile_photo_preview}
                              alt="Profile"
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="text-center">
                              <User className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                              <p className="text-xs text-gray-500">Fotoğraf Yok</p>
                            </div>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            console.log('Selected file:', file)
                            if (file) {
                              // Base64 formatına çevir
                              const reader = new FileReader()
                              reader.onload = (event) => {
                                const base64String = event.target?.result as string
                                setConsultantForm(prev => ({
                                  ...prev,
                                  profile_photo: file,
                                  profile_photo_preview: base64String
                                }))
                                console.log('Profile photo updated with base64 preview')
                              }
                              reader.readAsDataURL(file)
                            }
                          }}
                          className="hidden"
                          id="profile-photo-upload"
                        />
                        <label
                          htmlFor="profile-photo-upload"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Fotoğraf Seç
                        </label>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Current User Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Mevcut Kullanıcı</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-gray-600">Ad Soyad:</div>
                          <div className="font-medium text-gray-900">
                            {editingUser.first_name} {editingUser.last_name}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">E-posta:</div>
                          <div className="text-sm text-gray-900">{editingUser.email}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Mevcut Rol:</div>
                          <div className="mt-1">{getRoleBadge(editingUser.role)}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Role Selection */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Rol Değiştir</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Yeni Rol Seçin:
                        </label>
                        <Select
                          defaultValue={editingUser.role}
                          onValueChange={(value) => {
                            setEditingUser({ ...editingUser, newRole: value })
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Rol seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="visitor">
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                                <span>Ziyaretçi</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="client">
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span>Müşteri</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="consultant">
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                <span>Danışman</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="admin">
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <span>Admin</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRoleModal(false)
                    setEditingUser(null)
                    setConsultantForm({
                      tc_no: '',
                      first_name: '',
                      last_name: '',
                      phone: '',
                      bio: '',
                      profile_photo: null,
                      profile_photo_preview: '',
                      specialties: [],
                      certificates: []
                    })
                  }}
                >
                  İptal
                </Button>
                <Button
                  onClick={() => setShowConfirmDialog(true)}
                  disabled={isUpdating}
                  className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                >
                  {isUpdating ? (
                    <>
                      <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                      Kaydediliyor...
                    </>
                  ) : (
                    'Değişiklikleri Kaydet'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4" style={{ zIndex: 2147483651 }}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" style={{ zIndex: 2147483652 }}>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Değişiklikleri Kaydet</h3>
                  <p className="text-sm text-gray-600">Bu işlemi onaylıyor musunuz?</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6 max-h-64 overflow-y-auto">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Kaydedilecek Değişiklikler:</h4>
                <div className="space-y-3 text-sm text-gray-600">

                  {/* Temel Bilgiler */}
                  <div>
                    <h5 className="font-medium text-gray-800 mb-1">📋 Temel Bilgiler:</h5>
                    <ul className="ml-4 space-y-1">
                      {consultantForm.tc_no && <li>• TC No: {consultantForm.tc_no}</li>}
                      {consultantForm.first_name && <li>• Ad: {consultantForm.first_name}</li>}
                      {consultantForm.last_name && <li>• Soyad: {consultantForm.last_name}</li>}
                      {consultantForm.phone && <li>• Telefon: {consultantForm.phone}</li>}
                    </ul>
                  </div>

                  {/* Özgeçmiş */}
                  {consultantForm.bio && (
                    <div>
                      <h5 className="font-medium text-gray-800 mb-1">📝 Özgeçmiş:</h5>
                      <p className="ml-4 text-xs bg-white p-2 rounded border max-h-16 overflow-y-auto">
                        {consultantForm.bio.length > 100
                          ? `${consultantForm.bio.substring(0, 100)}...`
                          : consultantForm.bio
                        }
                      </p>
                    </div>
                  )}

                  {/* Profil Fotoğrafı */}
                  {consultantForm.profile_photo && (
                    <div>
                      <h5 className="font-medium text-gray-800 mb-1">📸 Profil Fotoğrafı:</h5>
                      <div className="ml-4 flex items-center space-x-2">
                        <div className="w-8 h-10 bg-gray-200 rounded border overflow-hidden">
                          <img
                            src={consultantForm.profile_photo_preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-xs">{consultantForm.profile_photo.name}</span>
                      </div>
                    </div>
                  )}

                  {/* Uzmanlık Alanları */}
                  {consultantForm.specialties.length > 0 && (
                    <div>
                      <h5 className="font-medium text-gray-800 mb-1">🎯 Uzmanlık Alanları ({consultantForm.specialties.length}):</h5>
                      <ul className="ml-4 space-y-1">
                        {consultantForm.specialties.map((specialty, index) => (
                          <li key={index} className="text-xs">
                            • {specialty}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Belgeler */}
                  {consultantForm.certificates.length > 0 && (
                    <div>
                      <h5 className="font-medium text-gray-800 mb-1">📄 Belgeler ({consultantForm.certificates.length}):</h5>
                      <ul className="ml-4 space-y-1">
                        {consultantForm.certificates.map((cert, index) => {
                          const area = specialtyAreas.find(a => a.value === cert.area)
                          const docType = documentTypes.find(d => d.value === cert.type)
                          return (
                            <li key={index} className="text-xs">
                              • <span className="font-medium">{area?.label}</span> - {docType?.label}
                              <br />
                              <span className="text-gray-500 ml-2">📎 {cert.file?.name || cert.filename || 'Belge dosyası'}</span>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )}

                  {/* Rol Değişikliği */}
                  <div>
                    <h5 className="font-medium text-gray-800 mb-1">👤 Kullanıcı Rolü:</h5>
                    <div className="ml-4 flex items-center space-x-2">
                      <span className="text-xs">
                        {editingUser.role === 'consultant' ? 'Danışman' :
                          editingUser.role === 'client' ? 'Müşteri' :
                            editingUser.role === 'admin' ? 'Admin' : 'Ziyaretçi'} → {
                          (editingUser.newRole || editingUser.role) === 'consultant' ? 'Danışman' :
                            (editingUser.newRole || editingUser.role) === 'client' ? 'Müşteri' :
                              (editingUser.newRole || editingUser.role) === 'admin' ? 'Admin' : 'Ziyaretçi'
                        }
                      </span>
                      {editingUser.newRole && editingUser.newRole !== editingUser.role && (
                        <Badge className="text-xs bg-green-100 text-green-800">Değiştirilecek</Badge>
                      )}
                    </div>
                  </div>

                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmDialog(false)}
                  className="flex-1"
                  disabled={isUpdating}
                >
                  İptal
                </Button>
                <Button
                  onClick={() => {
                    const newRole = editingUser.newRole || editingUser.role
                    updateUserRole(editingUser.id, newRole)
                  }}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 h-12 text-lg font-semibold"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <div className="animate-spin w-5 h-5 mr-3 border-2 border-white border-t-transparent rounded-full" />
                      Kaydediliyor...
                    </>
                  ) : (
                    '✅ Evet, Kaydet'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {previewDocument && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4" style={{ zIndex: 2147483649 }}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden" style={{ zIndex: 2147483650 }}>
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Belge Önizleme - {previewDocument.file.name}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewDocument(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-4 flex items-center justify-center bg-gray-50" style={{ height: 'calc(90vh - 120px)' }}>
              {previewDocument.file.type.startsWith('image/') ? (
                <img
                  src={previewDocument.preview}
                  alt="Document preview"
                  className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                />
              ) : previewDocument.file.type === 'application/pdf' ? (
                <div className="text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">PDF dosyası önizlemesi desteklenmiyor</p>
                  <Button
                    onClick={() => {
                      const url = URL.createObjectURL(previewDocument.file)
                      window.open(url, '_blank')
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    PDF'i Aç
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Bu dosya türü önizlenemiyor</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Import separate components
import SessionsManagement from './sessions-management'
import BlogManagement from './blog-management'
import MessagesManagement from './messages-management'
import PaymentsManagement from './payments-management'
import ContentManagement from './content-management'
import SystemSettings from './system-settings'

export default AdminDashboard
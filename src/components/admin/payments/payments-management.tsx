'use client'

import React, { useState, useEffect } from 'react'
import {
  DollarSign, CreditCard, TrendingUp, TrendingDown, Calendar, Clock, User, 
  CheckCircle, XCircle, AlertCircle, Eye, Filter, Search, Download, 
  Settings, Edit, Plus, BarChart3
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/lib/auth/auth-context'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/toast-provider'
import PaymentSettings from './payment-settings'

interface PaymentData {
  id: string
  session_id: string
  amount: number
  payment_status: 'pending' | 'payment_submitted' | 'confirmed' | 'cancelled'
  payment_method: string
  payment_notes?: string
  created_at: string
  updated_at: string
  // Relations
  session?: {
    id: string
    session_date: string
    start_time: string
    title: string
    client_id: string
    consultant_id: string
    client?: {
      first_name: string
      last_name: string
      email: string
    }
    consultant?: {
      first_name: string
      last_name: string
      email: string
    }
  }
}

interface PaymentStats {
  totalRevenue: number
  pendingPayments: number
  confirmedPayments: number
  cancelledPayments: number
  monthlyRevenue: number
  weeklyRevenue: number
  totalSessions: number
}

const PaymentsManagement = () => {
  const { user } = useAuth()
  const { success: showSuccess, error: showError } = useToast()

  const [payments, setPayments] = useState<PaymentData[]>([])
  const [stats, setStats] = useState<PaymentStats>({
    totalRevenue: 0,
    pendingPayments: 0,
    confirmedPayments: 0,
    cancelledPayments: 0,
    monthlyRevenue: 0,
    weeklyRevenue: 0,
    totalSessions: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDateRange, setSelectedDateRange] = useState('all')
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    loadPayments()
    loadPaymentStats()
  }, [])

  const loadPayments = async () => {
    setIsLoading(true)
    try {
      console.log('🔍 Admin - Ödemeler yükleniyor...')

      // Sessions tablosundan ödeme bilgilerini al
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('sessions')
        .select('*')
        .order('created_at', { ascending: false })

      if (sessionsError) {
        console.error('❌ Sessions yükleme hatası:', sessionsError)
        throw sessionsError
      }

      console.log('✅ Sessions yüklendi:', { count: sessionsData?.length })

      // Client ve Consultant bilgilerini ayrı çek
      if (sessionsData && sessionsData.length > 0) {
        const clientIds = [...new Set(sessionsData.map(session => session.client_id).filter(Boolean))]
        const consultantIds = [...new Set(sessionsData.map(session => session.consultant_id).filter(Boolean))]
        
        // Client bilgilerini çek
        let clientsData = []
        if (clientIds.length > 0) {
          const { data: clients, error: clientsError } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, email')
            .in('id', clientIds)

          if (!clientsError && clients) {
            clientsData = clients
          }
        }

        // Consultant bilgilerini çek
        let consultantsData = []
        if (consultantIds.length > 0) {
          const { data: consultants, error: consultantsError } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, email')
            .in('id', consultantIds)

          if (!consultantsError && consultants) {
            consultantsData = consultants
          }
        }
        
        // Payment data formatını oluştur
        const paymentsWithDetails = sessionsData.map(session => ({
          id: session.id,
          session_id: session.id,
          amount: session.price || 0,
          payment_status: session.payment_status || 'pending',
          payment_method: 'iban',
          payment_notes: session.session_notes,
          created_at: session.created_at,
          updated_at: session.updated_at,
          session: {
            ...session,
            client: clientsData.find(client => client.id === session.client_id),
            consultant: consultantsData.find(consultant => consultant.id === session.consultant_id)
          }
        }))
        
        setPayments(paymentsWithDetails)
      } else {
        setPayments([])
      }

    } catch (error) {
      console.error('💥 Ödemeler yüklenirken hata:', error)
      showError('Ödemeler yüklenemedi')
    } finally {
      setIsLoading(false)
    }
  }

  const loadPaymentStats = async () => {
    try {
      console.log('📊 Ödeme istatistikleri yükleniyor...')

      const { data: sessionsData, error } = await supabase
        .from('sessions')
        .select('price, payment_status, created_at')

      if (error) throw error

      const now = new Date()
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

      const stats = sessionsData.reduce((acc, session) => {
        const sessionDate = new Date(session.created_at)
        const amount = session.price || 0

        // Toplam gelir (onaylanan ödemeler)
        if (session.payment_status === 'confirmed') {
          acc.totalRevenue += amount
          acc.confirmedPayments += 1
        }

        // Bekleyen ödemeler
        if (session.payment_status === 'pending' || session.payment_status === 'payment_submitted') {
          acc.pendingPayments += 1
        }

        // İptal edilen ödemeler
        if (session.payment_status === 'cancelled') {
          acc.cancelledPayments += 1
        }

        // Aylık gelir
        if (sessionDate >= oneMonthAgo && session.payment_status === 'confirmed') {
          acc.monthlyRevenue += amount
        }

        // Haftalık gelir
        if (sessionDate >= oneWeekAgo && session.payment_status === 'confirmed') {
          acc.weeklyRevenue += amount
        }

        acc.totalSessions += 1
        return acc
      }, {
        totalRevenue: 0,
        pendingPayments: 0,
        confirmedPayments: 0,
        cancelledPayments: 0,
        monthlyRevenue: 0,
        weeklyRevenue: 0,
        totalSessions: 0
      })

      setStats(stats)
      console.log('✅ İstatistikler yüklendi:', stats)

    } catch (error) {
      console.error('💥 İstatistikler yüklenirken hata:', error)
    }
  }

  const updatePaymentStatus = async (paymentId: string, newStatus: string) => {
    try {
      console.log('🔄 Ödeme durumu güncelleniyor:', { paymentId, newStatus })

      const { data, error } = await supabase
        .from('sessions')
        .update({
          payment_status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentId)
        .select()

      if (error) throw error

      console.log('✅ Ödeme durumu güncellendi:', data)

      const statusMessages = {
        confirmed: 'onaylandı',
        cancelled: 'iptal edildi',
        pending: 'beklemeye alındı'
      }

      showSuccess(`Ödeme ${statusMessages[newStatus as keyof typeof statusMessages] || 'güncellendi'}`)
      loadPayments()
      loadPaymentStats()
    } catch (error) {
      console.error('💥 Ödeme durumu güncellenirken hata:', error)
      showError('Ödeme durumu güncellenemedi')
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Onaylandı</Badge>
      case 'payment_submitted':
        return <Badge className="bg-yellow-100 text-yellow-800">Ödeme Bildirimi</Badge>
      case 'pending':
        return <Badge className="bg-gray-100 text-gray-800">Bekliyor</Badge>
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">İptal Edildi</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Bilinmiyor</Badge>
    }
  }

  const getPaymentsByStatus = (status: string) => {
    if (status === 'all') return payments
    if (status === 'pending') {
      return payments.filter(payment => 
        payment.payment_status === 'pending' || payment.payment_status === 'payment_submitted'
      )
    }
    return payments.filter(payment => payment.payment_status === status)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatTime = (time: string) => {
    if (!time) return '--:--'
    return time.substring(0, 5)
  }

  const filteredPayments = getPaymentsByStatus(activeTab).filter(payment => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      payment.session?.client?.first_name?.toLowerCase().includes(searchLower) ||
      payment.session?.client?.last_name?.toLowerCase().includes(searchLower) ||
      payment.session?.client?.email?.toLowerCase().includes(searchLower) ||
      payment.session?.consultant?.first_name?.toLowerCase().includes(searchLower) ||
      payment.session?.consultant?.last_name?.toLowerCase().includes(searchLower) ||
      payment.amount.toString().includes(searchLower)
    )
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Ödemeler</h2>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Ödemeler yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Ödemeler</h2>
          <p className="text-gray-600">Tüm ödemeleri görüntüle ve yönet</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Rapor İndir
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Ödeme Ayarları
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalRevenue)}
                </p>
                <p className="text-sm text-gray-600">Toplam Gelir</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertCircle className="w-8 h-8 text-yellow-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pendingPayments}
                </p>
                <p className="text-sm text-gray-600">Bekleyen Ödemeler</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.monthlyRevenue)}
                </p>
                <p className="text-sm text-gray-600">Aylık Gelir</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.weeklyRevenue)}
                </p>
                <p className="text-sm text-gray-600">Haftalık Gelir</p>
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
            placeholder="Danışan, danışman veya tutar ara..."
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

      {/* Ödeme Ayarları */}
      {showSettings && (
        <PaymentSettings />
      )}

      {/* Tabs */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b border-gray-200">
              <TabsList className="grid w-full grid-cols-5 h-auto p-1">
                <TabsTrigger value="overview" className="py-3">
                  Genel Bakış
                </TabsTrigger>
                <TabsTrigger value="all" className="py-3">
                  Tümü ({payments.length})
                </TabsTrigger>
                <TabsTrigger value="pending" className="py-3">
                  Bekleyen ({getPaymentsByStatus('pending').length})
                </TabsTrigger>
                <TabsTrigger value="confirmed" className="py-3">
                  Onaylanan ({getPaymentsByStatus('confirmed').length})
                </TabsTrigger>
                <TabsTrigger value="cancelled" className="py-3">
                  İptal Edilen ({getPaymentsByStatus('cancelled').length})
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Ödeme Durumu Dağılımı</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-sm">Onaylanan</span>
                        </div>
                        <span className="font-medium">{stats.confirmedPayments}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                          <span className="text-sm">Bekleyen</span>
                        </div>
                        <span className="font-medium">{stats.pendingPayments}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                          <span className="text-sm">İptal Edilen</span>
                        </div>
                        <span className="font-medium">{stats.cancelledPayments}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Gelir Özeti</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Toplam Seans</span>
                        <span className="font-medium">{stats.totalSessions}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Ortalama Seans Ücreti</span>
                        <span className="font-medium">
                          {stats.confirmedPayments > 0 
                            ? formatCurrency(stats.totalRevenue / stats.confirmedPayments)
                            : formatCurrency(0)
                          }
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Onay Oranı</span>
                        <span className="font-medium">
                          {stats.totalSessions > 0 
                            ? `${Math.round((stats.confirmedPayments / stats.totalSessions) * 100)}%`
                            : '0%'
                          }
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Payment Lists */}
            {['all', 'pending', 'confirmed', 'cancelled'].map((tabValue) => (
              <TabsContent key={tabValue} value={tabValue} className="p-6">
                <div className="space-y-4">
                  {filteredPayments.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Bu kategoride ödeme bulunmuyor</p>
                    </div>
                  ) : (
                    filteredPayments.map((payment) => (
                      <Card key={payment.id} className="border-l-4 border-l-green-500">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {formatCurrency(payment.amount)}
                                </h3>
                                {getPaymentStatusBadge(payment.payment_status)}
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <User className="w-4 h-4 mr-2" />
                                  <div>
                                    <p className="font-medium">Danışan:</p>
                                    <p>{payment.session?.client?.first_name} {payment.session?.client?.last_name}</p>
                                    <p className="text-xs text-gray-500">{payment.session?.client?.email}</p>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <User className="w-4 h-4 mr-2" />
                                  <div>
                                    <p className="font-medium">Danışman:</p>
                                    <p>{payment.session?.consultant?.first_name} {payment.session?.consultant?.last_name}</p>
                                    <p className="text-xs text-gray-500">{payment.session?.consultant?.email}</p>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-2" />
                                  <div>
                                    <p className="font-medium">Seans Tarihi:</p>
                                    <p>{payment.session?.session_date ? formatDate(payment.session.session_date.split('T')[0]) : 'Belirtilmemiş'}</p>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 mr-2" />
                                  <div>
                                    <p className="font-medium">Seans Saati:</p>
                                    <p>{formatTime(payment.session?.start_time || '')}</p>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <CreditCard className="w-4 h-4 mr-2" />
                                  <div>
                                    <p className="font-medium">Ödeme Yöntemi:</p>
                                    <p>Banka Havalesi</p>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-2" />
                                  <div>
                                    <p className="font-medium">Oluşturma:</p>
                                    <p>{formatDate(payment.created_at)}</p>
                                  </div>
                                </div>
                              </div>

                              {payment.payment_notes && (
                                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                  <p className="text-sm font-medium text-gray-700">Ödeme Notu:</p>
                                  <p className="text-sm text-gray-600">{payment.payment_notes}</p>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col space-y-2 ml-4">
                              {/* Bekleyen ödemeler */}
                              {(payment.payment_status === 'pending' || payment.payment_status === 'payment_submitted') && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => updatePaymentStatus(payment.id, 'confirmed')}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Onayla
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updatePaymentStatus(payment.id, 'cancelled')}
                                    className="text-red-600 border-red-600 hover:bg-red-50"
                                  >
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Reddet
                                  </Button>
                                </>
                              )}

                              {/* Detay görüntüleme butonu */}
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-purple-600 border-purple-600 hover:bg-purple-50"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Detay
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default PaymentsManagement
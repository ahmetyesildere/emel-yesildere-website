'use client'

import React, { useState } from 'react'
import { 
  DollarSign, CreditCard, Calendar, User, CheckCircle, 
  XCircle, Clock, AlertCircle, TrendingUp, Download,
  Filter, Search, Eye, RefreshCw, Plus, BarChart3
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const PaymentsManagement = () => {
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterMethod, setFilterMethod] = useState('all')
  const [dateRange, setDateRange] = useState('this_month')

  const payments = [
    {
      id: 1,
      sessionId: 'SES-001',
      clientName: 'Ayşe Kaya',
      clientEmail: 'ayse@example.com',
      serviceType: 'Duygu Temizliği',
      amount: 500,
      currency: 'TRY',
      status: 'completed',
      method: 'credit_card',
      transactionId: 'TXN-123456789',
      paidAt: '2024-07-25 14:30',
      createdAt: '2024-07-25 14:25',
      stripePaymentId: 'pi_1234567890'
    },
    {
      id: 2,
      sessionId: 'SES-002',
      clientName: 'Mehmet Demir',
      clientEmail: 'mehmet@example.com',
      serviceType: 'Yaşam Koçluğu',
      amount: 400,
      currency: 'TRY',
      status: 'pending',
      method: 'bank_transfer',
      transactionId: 'TXN-123456790',
      paidAt: null,
      createdAt: '2024-07-25 10:15',
      notes: 'Banka havalesi bekleniyor'
    },
    {
      id: 3,
      sessionId: 'SES-003',
      clientName: 'Fatma Özkan',
      clientEmail: 'fatma@example.com',
      serviceType: 'Travma İyileştirme',
      amount: 750,
      currency: 'TRY',
      status: 'failed',
      method: 'credit_card',
      transactionId: 'TXN-123456791',
      paidAt: null,
      createdAt: '2024-07-24 16:20',
      failureReason: 'Yetersiz bakiye'
    },
    {
      id: 4,
      sessionId: 'SES-004',
      clientName: 'Ali Yılmaz',
      clientEmail: 'ali@example.com',
      serviceType: 'Holistik Koçluk',
      amount: 600,
      currency: 'TRY',
      status: 'refunded',
      method: 'credit_card',
      transactionId: 'TXN-123456792',
      paidAt: '2024-07-24 11:00',
      refundedAt: '2024-07-24 15:30',
      refundAmount: 600,
      createdAt: '2024-07-24 10:45',
      refundReason: 'Müşteri talebi'
    },
    {
      id: 5,
      sessionId: 'SES-005',
      clientName: 'Zeynep Kara',
      clientEmail: 'zeynep@example.com',
      serviceType: 'Grup Seansı',
      amount: 200,
      currency: 'TRY',
      status: 'completed',
      method: 'cash',
      transactionId: 'TXN-123456793',
      paidAt: '2024-07-23 14:00',
      createdAt: '2024-07-23 14:00',
      notes: 'Nakit ödeme - yüz yüze seans'
    }
  ]

  const paymentMethods = [
    { value: 'credit_card', label: 'Kredi Kartı', icon: CreditCard },
    { value: 'bank_transfer', label: 'Banka Havalesi', icon: DollarSign },
    { value: 'cash', label: 'Nakit', icon: DollarSign }
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: 'Tamamlandı', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      pending: { label: 'Beklemede', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      failed: { label: 'Başarısız', color: 'bg-red-100 text-red-800', icon: XCircle },
      refunded: { label: 'İade Edildi', color: 'bg-blue-100 text-blue-800', icon: RefreshCw }
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    const IconComponent = config.icon
    return (
      <div className="flex items-center space-x-1">
        <IconComponent className="w-3 h-3" />
        <Badge className={config.color}>{config.label}</Badge>
      </div>
    )
  }

  const getMethodBadge = (method: string) => {
    const methodConfig = {
      credit_card: { label: 'Kredi Kartı', color: 'bg-purple-100 text-purple-800' },
      bank_transfer: { label: 'Banka Havalesi', color: 'bg-blue-100 text-blue-800' },
      cash: { label: 'Nakit', color: 'bg-green-100 text-green-800' }
    }
    const config = methodConfig[method as keyof typeof methodConfig]
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const filteredPayments = payments.filter(payment => {
    if (filterStatus !== 'all' && payment.status !== filterStatus) return false
    if (filterMethod !== 'all' && payment.method !== filterMethod) return false
    return true
  })

  const paymentStats = {
    total: payments.length,
    completed: payments.filter(p => p.status === 'completed').length,
    pending: payments.filter(p => p.status === 'pending').length,
    failed: payments.filter(p => p.status === 'failed').length,
    totalRevenue: payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
    pendingAmount: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    refundedAmount: payments.filter(p => p.status === 'refunded').reduce((sum, p) => sum + (p.refundAmount || 0), 0)
  }

  const monthlyRevenue = [
    { month: 'Ocak', revenue: 12500, sessions: 25 },
    { month: 'Şubat', revenue: 15800, sessions: 32 },
    { month: 'Mart', revenue: 18200, sessions: 38 },
    { month: 'Nisan', revenue: 21600, sessions: 45 },
    { month: 'Mayıs', revenue: 19400, sessions: 41 },
    { month: 'Haziran', revenue: 23800, sessions: 52 },
    { month: 'Temmuz', revenue: 25600, sessions: 56 }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Ödeme Yönetimi</h2>
          <p className="text-gray-600">Ödemeleri görüntüleyin, takip edin ve yönetin</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Rapor İndir
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Manuel Ödeme
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Toplam</p>
                <p className="text-2xl font-bold text-gray-900">{paymentStats.total}</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tamamlandı</p>
                <p className="text-2xl font-bold text-green-600">{paymentStats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Beklemede</p>
                <p className="text-2xl font-bold text-yellow-600">{paymentStats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Başarısız</p>
                <p className="text-2xl font-bold text-red-600">{paymentStats.failed}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Toplam Gelir</p>
                <p className="text-2xl font-bold text-emerald-600">₺{paymentStats.totalRevenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bekleyen</p>
                <p className="text-2xl font-bold text-orange-600">₺{paymentStats.pendingAmount.toLocaleString()}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">İade</p>
                <p className="text-2xl font-bold text-blue-600">₺{paymentStats.refundedAmount.toLocaleString()}</p>
              </div>
              <RefreshCw className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
            Aylık Gelir Trendi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-4">
            {monthlyRevenue.map((month, index) => (
              <div key={index} className="text-center">
                <div className="mb-2">
                  <div 
                    className="bg-gradient-to-t from-purple-600 to-blue-600 rounded-t-lg mx-auto"
                    style={{ 
                      height: `${(month.revenue / Math.max(...monthlyRevenue.map(m => m.revenue))) * 100}px`,
                      width: '40px'
                    }}
                  />
                  <div className="h-2 bg-gray-200 rounded-b-lg mx-auto" style={{ width: '40px' }} />
                </div>
                <div className="text-xs font-medium text-gray-900">{month.month}</div>
                <div className="text-xs text-gray-600">₺{(month.revenue / 1000).toFixed(1)}K</div>
                <div className="text-xs text-gray-500">{month.sessions} seans</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input placeholder="Müşteri adı, e-posta veya işlem ID ara..." />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Durum filtrele" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Durumlar</SelectItem>
                <SelectItem value="completed">Tamamlandı</SelectItem>
                <SelectItem value="pending">Beklemede</SelectItem>
                <SelectItem value="failed">Başarısız</SelectItem>
                <SelectItem value="refunded">İade Edildi</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterMethod} onValueChange={setFilterMethod}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Ödeme yöntemi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Yöntemler</SelectItem>
                <SelectItem value="credit_card">Kredi Kartı</SelectItem>
                <SelectItem value="bank_transfer">Banka Havalesi</SelectItem>
                <SelectItem value="cash">Nakit</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tarih aralığı" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Bugün</SelectItem>
                <SelectItem value="this_week">Bu Hafta</SelectItem>
                <SelectItem value="this_month">Bu Ay</SelectItem>
                <SelectItem value="last_month">Geçen Ay</SelectItem>
                <SelectItem value="this_year">Bu Yıl</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Ödemeler ({filteredPayments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Müşteri</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Hizmet</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Tutar</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Yöntem</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Durum</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Tarih</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{payment.clientName}</div>
                          <div className="text-sm text-gray-600">{payment.clientEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{payment.serviceType}</div>
                        <div className="text-sm text-gray-600">Seans: {payment.sessionId}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-gray-900">
                        ₺{payment.amount.toLocaleString()} {payment.currency}
                      </div>
                      {payment.refundAmount && (
                        <div className="text-sm text-red-600">
                          İade: ₺{payment.refundAmount.toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {getMethodBadge(payment.method)}
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        {payment.paidAt ? (
                          <>
                            <div className="font-medium text-gray-900">{payment.paidAt.split(' ')[0]}</div>
                            <div className="text-sm text-gray-600">{payment.paidAt.split(' ')[1]}</div>
                          </>
                        ) : (
                          <>
                            <div className="font-medium text-gray-900">{payment.createdAt.split(' ')[0]}</div>
                            <div className="text-sm text-gray-600">Oluşturuldu</div>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" title="Detayları Gör">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {payment.status === 'pending' && (
                          <Button variant="outline" size="sm" title="Onayla" className="text-green-600">
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                        {payment.status === 'completed' && (
                          <Button variant="outline" size="sm" title="İade Et" className="text-blue-600">
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        )}
                        <Button variant="outline" size="sm" title="Fatura İndir">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {paymentMethods.map((method, index) => {
          const methodPayments = payments.filter(p => p.method === method.value && p.status === 'completed')
          const methodRevenue = methodPayments.reduce((sum, p) => sum + p.amount, 0)
          const IconComponent = method.icon
          
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{method.label}</h4>
                      <p className="text-sm text-gray-600">{methodPayments.length} işlem</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Toplam Gelir:</span>
                    <span className="font-semibold text-gray-900">₺{methodRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Ortalama:</span>
                    <span className="font-medium text-gray-700">
                      ₺{methodPayments.length > 0 ? Math.round(methodRevenue / methodPayments.length).toLocaleString() : '0'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${(methodRevenue / paymentStats.totalRevenue) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 text-center">
                    {((methodRevenue / paymentStats.totalRevenue) * 100).toFixed(1)}% toplam gelirden
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default PaymentsManagement
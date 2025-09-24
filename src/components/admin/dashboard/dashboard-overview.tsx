'use client'

import React from 'react'
import { 
  Users, Calendar, FileText, DollarSign, MessageSquare, UserCheck,
  TrendingUp, CheckCircle
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const DashboardOverview = () => {
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

  return (
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

      {/* Dashboard Status */}
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Dashboard Aktif</h3>
        <p className="text-gray-600">
          Admin paneli başarıyla yüklendi. Diğer sekmeleri kullanabilirsiniz.
        </p>
      </div>
    </div>
  )
}

export default DashboardOverview
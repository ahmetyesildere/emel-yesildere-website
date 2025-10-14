'use client'

import React from 'react'
import { Users, UserCheck, Heart, Eye } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface UserStatsCardsProps {
  roleStats: {
    all: number
    consultant: number
    client: number
    visitor: number
  }
}

const UserStatsCards: React.FC<UserStatsCardsProps> = ({ roleStats }) => {
  const statsCards = [
    {
      title: 'Toplam Kullanıcı',
      value: roleStats.all,
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Danışmanlar',
      value: roleStats.consultant,
      icon: UserCheck,
      color: 'text-purple-600'
    },
    {
      title: 'Danışanlar',
      value: roleStats.client,
      icon: Heart,
      color: 'text-blue-600'
    },
    {
      title: 'Ziyaretçiler',
      value: roleStats.visitor,
      icon: Eye,
      color: 'text-gray-600'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {statsCards.map((stat, index) => {
        const IconComponent = stat.icon
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <IconComponent className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default UserStatsCards
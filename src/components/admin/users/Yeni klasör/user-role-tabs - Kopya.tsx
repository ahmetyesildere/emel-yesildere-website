'use client'

import React from 'react'
import { Users, UserCheck, Heart, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface UserRoleTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  roleStats: {
    all: number
    consultant: number
    client: number
    visitor: number
  }
}

const UserRoleTabs: React.FC<UserRoleTabsProps> = ({ 
  activeTab, 
  onTabChange, 
  roleStats 
}) => {
  const userTabs = [
    { id: 'all', label: 'Tüm Kullanıcılar', icon: Users },
    { id: 'consultant', label: 'Danışmanlar', icon: UserCheck },
    { id: 'client', label: 'Danışanlar', icon: Heart },
    { id: 'visitor', label: 'Ziyaretçiler', icon: Eye }
  ]

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="mb-6">
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
  )
}

export default UserRoleTabs
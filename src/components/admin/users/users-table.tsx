'use client'

import React from 'react'
import { Edit, Eye, Trash2, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface UsersTableProps {
  users: any[]
  activeTab: string
  onEditUser: (user: any) => void
  onViewUser: (user: any) => void
  onDeleteUser: (user: any) => void
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  activeTab,
  onEditUser,
  onViewUser,
  onDeleteUser
}) => {
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

  const getTabTitle = () => {
    switch (activeTab) {
      case 'all': return 'Tüm Kullanıcılar'
      case 'consultant': return 'Danışmanlar'
      case 'client': return 'Danışanlar'
      case 'visitor': return 'Ziyaretçiler'
      default: return 'Kullanıcılar'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {getTabTitle()}
            <Badge variant="secondary" className="ml-2">
              {users.length}
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
              {users.length > 0 ? (
                users.map((user) => (
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
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            console.log('🖱️ Edit butonu tıklandı:', user.id)
                            onEditUser(user)
                          }}
                          title="Düzenle"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            console.log('🖱️ View butonu tıklandı:', user.id)
                            onViewUser(user)
                          }}
                          title="Görüntüle"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => onDeleteUser(user)}
                          className="text-red-600 hover:text-red-700" 
                          title="Sil"
                        >
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
  )
}

export default UsersTable
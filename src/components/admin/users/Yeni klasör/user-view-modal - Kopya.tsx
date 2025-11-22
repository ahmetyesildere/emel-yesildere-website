'use client'

import React from 'react'
import { X, User, Edit, Mail, Phone } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface UserViewModalProps {
  isOpen: boolean
  user: any
  onClose: () => void
  onEdit: (user: any) => void
}

const UserViewModal: React.FC<UserViewModalProps> = ({
  isOpen,
  user,
  onClose,
  onEdit
}) => {
  if (!isOpen || !user) return null

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

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4" style={{ zIndex: 2147483647 }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" style={{ zIndex: 2147483648 }}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Kullanıcı Detayları
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Profile Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Profil Bilgileri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
                    <p className="text-gray-900 bg-gray-50 p-2 rounded">{user.first_name || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Soyad</label>
                    <p className="text-gray-900 bg-gray-50 p-2 rounded">{user.last_name || '-'}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded">{user.email}</p>
                </div>

                {user.phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                    <p className="text-gray-900 bg-gray-50 p-2 rounded">+90 {user.phone}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                    <div>{getRoleBadge(user.role)}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                    <Badge className={user.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {user.is_active ? 'Aktif' : 'Pasif'}
                    </Badge>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kayıt Tarihi</label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded text-sm">
                    {new Date(user.created_at).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Hızlı İşlemler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    onClick={() => {
                      onClose()
                      onEdit(user)
                    }}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Düzenle
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(user.email)
                      alert('E-posta adresi kopyalandı!')
                    }}
                    className="w-full"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    E-posta Kopyala
                  </Button>
                  {user.phone && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(user.phone)
                        alert('Telefon numarası kopyalandı!')
                      }}
                      className="w-full"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Telefon Kopyala
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
            <Button variant="outline" onClick={onClose}>
              Kapat
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserViewModal
'use client'

import React, { useState, useEffect } from 'react'
import { Search, User, Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'

interface UserProfile {
  id: string
  first_name: string
  last_name: string
  email: string
  role: string
  avatar_url?: string
}

interface UserSelectorProps {
  selectedUserId: string
  onUserSelect: (userId: string) => void
  placeholder?: string
}

const UserSelector: React.FC<UserSelectorProps> = ({
  selectedUserId,
  onUserSelect,
  placeholder = "Kullanıcı seçin..."
}) => {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, role, avatar_url')
        .order('first_name')

      if (error) throw error

      setUsers(data || [])
    } catch (error) {
      console.error('Kullanıcılar yüklenirken hata:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-100 text-purple-800 text-xs">Admin</Badge>
      case 'consultant':
        return <Badge className="bg-blue-100 text-blue-800 text-xs">Danışman</Badge>
      case 'client':
        return <Badge className="bg-green-100 text-green-800 text-xs">Danışan</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 text-xs">Kullanıcı</Badge>
    }
  }

  const filteredUsers = users.filter(user => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      user.first_name?.toLowerCase().includes(searchLower) ||
      user.last_name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower)
    )
  })

  const selectedUser = users.find(user => user.id === selectedUserId)

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2 border border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      >
        {selectedUser ? (
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <User className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-medium">
              {selectedUser.first_name} {selectedUser.last_name}
            </span>
            <span className="text-xs text-gray-500">({selectedUser.email})</span>
            {getRoleBadge(selectedUser.role)}
          </div>
        ) : (
          <span className="text-gray-500 text-sm">{placeholder}</span>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-64 overflow-hidden">
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Kullanıcı ara..."
                className="pl-8 text-sm"
              />
            </div>
          </div>
          
          <div className="max-h-48 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-2 text-xs">Yükleniyor...</p>
              </div>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => {
                    onUserSelect(user.id)
                    setIsOpen(false)
                    setSearchTerm('')
                  }}
                  className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedUserId === user.id ? 'bg-purple-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <User className="w-3 h-3 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {user.first_name} {user.last_name}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      {getRoleBadge(user.role)}
                    </div>
                    {selectedUserId === user.id && (
                      <Check className="w-4 h-4 text-purple-600" />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                <p className="text-sm">Kullanıcı bulunamadı</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default UserSelector
'use client'

import React, { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

// Import modular components
import UserStatsCards from './user-stats-cards'
import UserRoleTabs from './user-role-tabs'
import UsersTable from './users-table'
import UserEditModal from './user-edit-modal'
import UserViewModal from './user-view-modal'

const UsersManagement = () => {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeUserTab, setActiveUserTab] = useState('all')
  const [editingUser, setEditingUser] = useState<any>(null)
  const [viewingUser, setViewingUser] = useState<any>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)

  // Load users
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
        // Clean and filter users
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
            created_at: user.created_at || new Date().toISOString(),
            tc_no: user.tc_no || '',
            bio: user.bio || '',
            specialties: user.specialties || [],
            certificates: user.certificates || [],
            profile_photo_url: user.profile_photo_url || ''
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

  const handleEditUser = (user: any) => {
    setEditingUser(user)
    setShowEditModal(true)
  }

  const handleViewUser = (user: any) => {
    setViewingUser(user)
    setShowViewModal(true)
  }

  const handleCloseModals = () => {
    setShowEditModal(false)
    setShowViewModal(false)
    setEditingUser(null)
    setViewingUser(null)
    // Verileri yeniden yükle
    loadUsers()
  }

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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Kullanıcı Yönetimi</h2>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Yeni Kullanıcı
        </Button>
      </div>

      {/* Stats Cards */}
      <UserStatsCards roleStats={roleStats} />

      {/* Role Tabs */}
      <UserRoleTabs 
        activeTab={activeUserTab}
        onTabChange={setActiveUserTab}
        roleStats={roleStats}
      />

      {/* Users Table */}
      <UsersTable
        users={filteredUsers}
        activeTab={activeUserTab}
        onEditUser={handleEditUser}
        onViewUser={handleViewUser}
        onDeleteUser={(user) => console.log('Delete user:', user)}
      />

      {/* Modals */}
      <UserEditModal
        isOpen={showEditModal}
        user={editingUser}
        onClose={handleCloseModals}
        onSave={() => {
          loadUsers()
          handleCloseModals()
        }}
      />

      <UserViewModal
        isOpen={showViewModal}
        user={viewingUser}
        onClose={handleCloseModals}
        onEdit={handleEditUser}
      />
    </div>
  )
}

export default UsersManagement
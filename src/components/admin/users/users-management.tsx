'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Plus, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth/auth-context'
import { Toast, useToast } from '@/components/ui/toast'

// Import modular components
import UserStatsCards from './user-stats-cards'
import UserRoleTabs from './user-role-tabs'
import UsersTable from './users-table'
import UserEditModal from './user-edit-modal'
import UserViewModal from './user-view-modal'

interface UsersManagementProps {
  activeTab?: string
}

const UsersManagement = React.memo(({ activeTab }: UsersManagementProps) => {
  const { refreshSession, session } = useAuth()
  const { toast, showToast, hideToast, success, error, info } = useToast()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false) // Başlangıçta false
  const [refreshing, setRefreshing] = useState(false)
  const [activeUserTab, setActiveUserTab] = useState('all')
  const [editingUser, setEditingUser] = useState<any>(null)
  const [viewingUser, setViewingUser] = useState<any>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)

  // Debug için state değişikliklerini logla
  useEffect(() => {
    console.log('📊 Modal states:', {
      showEditModal,
      showViewModal,
      editingUser: editingUser ? editingUser.id : null,
      viewingUser: viewingUser ? viewingUser.id : null
    })
  }, [showEditModal, showViewModal, editingUser, viewingUser])

  // Component mount durumunu logla
  useEffect(() => {
    console.log('🚀 UsersManagement component mounted')
    return () => {
      console.log('💀 UsersManagement component unmounted')
    }
  }, [])

  const loadUsers = useCallback(async () => {
    try {
      console.log('📥 Loading users via API...')
      console.log('🔍 Session status:', !!session, session?.user?.email)

      // Admin API'sini kullan
      const response = await fetch('/api/admin/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const result = await response.json()

      if (result.users) {
        const cleanedUsers = result.users
          .filter((user: any) => user && user.id && user.email)
          .map((user: any) => ({
            id: user.id,
            email: user.email || '',
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            phone: user.phone || '',
            tc_no: user.tc_no || '',
            bio: user.bio || '',
            role: user.role || 'client',
            is_active: user.is_active !== false,
            email_verified: user.email_verified || false,
            avatar_url: user.avatar_url || user.profile_photo_url || null,
            created_at: user.created_at || new Date().toISOString(),
            updated_at: user.updated_at || new Date().toISOString()
          }))

        console.log('✅ Loaded users via API:', cleanedUsers.length)
        setUsers(cleanedUsers)
      } else {
        console.log('⚠️ No users data in API response')
        setUsers([])
      }

    } catch (error) {
      console.error('💥 Error loading users via API:', error)

      // Fallback: Direct database access
      try {
        console.log('🔄 Fallback: Direct database access...')
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select(`
            id,
            email,
            first_name,
            last_name,
            phone,
            tc_no,
            bio,
            role,
            is_active,
            email_verified,
            avatar_url,
            created_at,
            updated_at
          `)
          .order('created_at', { ascending: false })

        if (profilesError) {
          console.error('💥 Fallback also failed:', profilesError)
          setUsers([])
        } else {
          const cleanedUsers = (profilesData || [])
            .filter(user => user && user.id && user.email)
            .map(user => ({
              id: user.id,
              email: user.email || '',
              first_name: user.first_name || '',
              last_name: user.last_name || '',
              phone: user.phone || '',
              tc_no: user.tc_no || '',
              bio: user.bio || '',
              role: user.role || 'client',
              is_active: user.is_active !== false,
              email_verified: user.email_verified || false,
              avatar_url: user.avatar_url || null,
              created_at: user.created_at || new Date().toISOString(),
              updated_at: user.updated_at || new Date().toISOString()
            }))

          console.log('✅ Fallback successful:', cleanedUsers.length)
          setUsers(cleanedUsers)
        }
      } catch (fallbackError) {
        console.error('💥 Fallback error:', fallbackError)
        setUsers([])
      }
    } finally {
      setLoading(false)
    }
  }, [session])

  // Load users on mount
  useEffect(() => {
    console.log('🚀 UsersManagement mounted, loading users...')
    loadUsers()
  }, [loadUsers])

  // Reload users when tab becomes active
  useEffect(() => {
    if (activeTab === 'users') {
      console.log('🔄 Users tab activated, reloading data...')
      setLoading(true)
      loadUsers()
    }
  }, [activeTab, loadUsers])

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

  const handleEditUser = useCallback((user: any) => {
    console.log('🔄 Edit modal açılıyor:', user.id)
    // Önce diğer modal'ları kapat
    setShowViewModal(false)
    setViewingUser(null)

    // Edit modal'ı aç
    setEditingUser(user)
    setShowEditModal(true)
  }, [])

  const handleViewUser = useCallback((user: any) => {
    console.log('🔄 View modal açılıyor:', user.id)
    // Önce diğer modal'ları kapat
    setShowEditModal(false)
    setEditingUser(null)

    // View modal'ı aç
    setViewingUser(user)
    setShowViewModal(true)
  }, [])

  const handleCloseModals = useCallback(() => {
    console.log('🔄 Modal kapatılıyor')
    setShowEditModal(false)
    setShowViewModal(false)
    setEditingUser(null)
    setViewingUser(null)
    // Verileri yeniden yükle
    loadUsers()
  }, [])

  const handleSaveUser = useCallback(() => {
    console.log('💾 Kullanıcı kaydedildi')
    loadUsers()
    handleCloseModals()
  }, [])

  const handleRefreshUsers = useCallback(async () => {
    setRefreshing(true)
    console.log('🔄 Manually refreshing users...')
    await loadUsers()
    setRefreshing(false)
  }, [])

  const handleDeleteUser = async (user: any) => {
    const confirmMessage = `${user.email} kullanıcısını silmek istediğinizden emin misiniz?\n\nBu işlem geri alınamaz!`

    if (!confirm(confirmMessage)) {
      return
    }

    try {
      console.log('🗑️ Deleting user via API:', user.email)

      // API üzerinden kullanıcıyı sil (auth + profiles)
      const response = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id })
      })

      const result = await response.json()

      if (!response.ok) {
        console.error('API Error:', result)
        throw new Error(result.details || result.error || 'Silme işlemi başarısız')
      }

      console.log('✅ User deleted successfully')

      if (result.warning) {
        alert(`Kullanıcı profili silindi!\n\nUyarı: ${result.warning}`)
      } else {
        alert('Kullanıcı başarıyla silindi!')
      }

      // Kullanıcı listesini yenile
      await loadUsers()

    } catch (error: any) {
      console.error('💥 User delete exception:', error)
      alert('Kullanıcı silinirken hata oluştu: ' + error.message)
    }
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

  console.log('📊 UsersManagement render:', {
    loading,
    usersCount: users.length,
    filteredUsersCount: filteredUsers.length,
    activeUserTab
  })

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Kullanıcı Yönetimi</h2>
          {session?.expires_at && (
            <p className="text-sm text-gray-500">
              Oturum süresi: {new Date(session.expires_at * 1000).toLocaleString('tr-TR')}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handleRefreshUsers}
            disabled={refreshing}
            className="flex items-center"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Yenileniyor...' : 'Yenile'}
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Yeni Kullanıcı
          </Button>
        </div>
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
        onDeleteUser={handleDeleteUser}
      />

      {/* Modals */}
      {editingUser && (
        <UserEditModal
          key={`edit-${editingUser.id}`}
          isOpen={showEditModal}
          user={editingUser}
          onClose={handleCloseModals}
          onSave={handleSaveUser}
          toastFunctions={{ success, error, info }}
        />
      )}

      {viewingUser && (
        <UserViewModal
          key={`view-${viewingUser.id}`}
          isOpen={showViewModal}
          user={viewingUser}
          onClose={handleCloseModals}
          onEdit={handleEditUser}
        />
      )}

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  )
})

UsersManagement.displayName = 'UsersManagement'

export default UsersManagement
import { Metadata } from 'next'
import AdminDashboard from '@/components/admin/admin-dashboard'
import AdminGuard from '@/components/auth/admin-guard'

export const metadata: Metadata = {
  title: 'Admin Panel - Emel Yeşildere',
  description: 'Yönetim paneli - İçerik yönetimi, kullanıcı yönetimi ve sistem ayarları',
}

 export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminDashboard />
    </AdminGuard>
  )
}
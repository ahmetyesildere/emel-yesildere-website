// Admin işlemler için service role key ile Supabase client

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Build sırasında environment variables yoksa null client oluştur
let supabaseAdmin: any = null

if (supabaseUrl && supabaseServiceKey) {
  // Admin client - sadece server-side veya güvenli admin işlemler için
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
} else {
  console.warn('⚠️ Supabase admin client not initialized - missing environment variables')
}

export { supabaseAdmin }

// Admin işlemler için yardımcı fonksiyonlar
export const adminOperations = {
  // Service role test
  async testServiceRole() {
    try {
      if (!supabaseAdmin) {
        return { success: false, error: 'Supabase admin client not initialized' }
      }

      console.log('🧪 Testing service role...')
      console.log('🔑 Service key exists:', !!supabaseServiceKey)
      console.log('🔑 Service key starts with:', supabaseServiceKey?.substring(0, 20) + '...')
      
      // Admin API'yi test et
      const { data, error } = await supabaseAdmin.auth.admin.listUsers()
      
      if (error) {
        console.error('❌ Service role test failed:', error)
        return { success: false, error }
      }
      
      console.log('✅ Service role working, found users:', data.users?.length || 0)
      return { success: true, userCount: data.users?.length || 0 }
    } catch (error) {
      console.error('💥 Service role test error:', error)
      return { success: false, error }
    }
  },
  // Kullanıcı silme (auth + profiles)
  async deleteUser(userId: string) {
    try {
      if (!supabaseAdmin) {
        return { success: false, error: 'Supabase admin client not initialized' }
      }

      console.log('🔍 Deleting user with ID:', userId)
      console.log('🔑 Service key available:', !!supabaseServiceKey)

      // Sadece profiles tablosundan sil (auth admin API çalışmıyor)
      console.log('🗑️ Deleting from profiles...')
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .delete()
        .eq('id', userId)

      if (profileError) {
        console.error('❌ Profile delete error:', profileError)
        throw profileError
      } else {
        console.log('✅ Profile deleted successfully')
      }

      return {
        success: true,
        message: 'Kullanıcı profili silindi (auth kaydı manuel silinmeli)'
      }
    } catch (error) {
      console.error('💥 Delete user error:', error)
      return { success: false, error }
    }
  },

  // Kullanıcı listesi çekme
  async getUsers() {
    try {
      if (!supabaseAdmin) {
        return { success: false, error: 'Supabase admin client not initialized' }
      }

      console.log('🔍 Getting users with service role...')
      console.log('🔑 Service key available:', !!supabaseServiceKey)
      console.log('🔑 Service key length:', supabaseServiceKey?.length || 0)

      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Get users error:', error)
        console.error('❌ Error details:', JSON.stringify(error, null, 2))
        throw error
      }

      console.log('✅ Users retrieved successfully:', data?.length || 0, 'users')
      return { success: true, data }
    } catch (error) {
      console.error('💥 Get users error:', error)
      return { success: false, error }
    }
  },

  // Kullanıcı güncelleme (hem profiles hem auth.users)
  async updateUser(userId: string, updates: any) {
    try {
      if (!supabaseAdmin) {
        return { success: false, error: 'Supabase admin client not initialized' }
      }

      console.log('🔄 Updating user:', userId, updates)

      // 1. Profiles tablosunu güncelle
      const updateData: any = {
        first_name: updates.first_name,
        last_name: updates.last_name,
        email: updates.email,
        phone: updates.phone,
        role: updates.role,
        updated_at: new Date().toISOString()
      }

      // Avatar URL varsa ekle
      if (updates.avatar_url !== undefined) {
        updateData.avatar_url = updates.avatar_url
      }

      const { data: profileData, error: profileError } = await supabaseAdmin
        .from('profiles')
        .update(updateData)
        .eq('id', userId)
        .select()

      if (profileError) {
        console.error('❌ Profile update error:', profileError)
        throw profileError
      }

      console.log('✅ Profile updated successfully')

      // 2. Auth.users tablosunu güncelle
      try {
        console.log('📧 Attempting to update auth user...')
        console.log('🔑 Service key length:', supabaseServiceKey?.length || 0)
        console.log('🆔 User ID:', userId)
        console.log('📝 Updates:', {
          email: updates.email,
          first_name: updates.first_name,
          last_name: updates.last_name
        })

        // Önce mevcut auth user'ı kontrol et
        const { data: existingUser, error: getUserError } = await supabaseAdmin.auth.admin.getUserById(userId)
        
        if (getUserError) {
          console.error('❌ Cannot get existing auth user:', getUserError)
          throw getUserError
        }

        console.log('👤 Existing auth user found:', {
          id: existingUser.user?.id,
          email: existingUser.user?.email,
          created_at: existingUser.user?.created_at
        })

        // Email değişikliği varsa kontrol et
        const emailChanged = existingUser.user?.email !== updates.email
        console.log('📧 Email changed:', emailChanged, 'from', existingUser.user?.email, 'to', updates.email)

        // Auth user'ı güncelle
        const updateData: any = {
          user_metadata: {
            first_name: updates.first_name,
            last_name: updates.last_name,
            full_name: `${updates.first_name} ${updates.last_name}`
          }
        }

        // Email değişikliği varsa ekle
        if (emailChanged && updates.email) {
          updateData.email = updates.email
        }

        console.log('📝 Auth update data:', updateData)

        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.updateUserById(
          userId,
          updateData
        )

        if (authError) {
          console.error('❌ Auth update error:', authError)
          console.error('❌ Auth error details:', JSON.stringify(authError, null, 2))
          throw authError
        } else {
          console.log('✅ Auth user updated successfully:', {
            id: authData.user?.id,
            email: authData.user?.email,
            metadata: authData.user?.user_metadata
          })
        }
      } catch (authError: any) {
        console.error('💥 Auth update failed:', authError)
        console.error('💥 Auth error message:', authError?.message)
        console.error('💥 Auth error code:', authError?.code)
        // Auth güncellemesi başarısız olsa bile devam et
      }

      return { 
        success: true, 
        data: profileData,
        message: 'Kullanıcı başarıyla güncellendi'
      }
    } catch (error) {
      console.error('💥 Update user error:', error)
      return { success: false, error }
    }
  },

  // Kullanıcı uzmanlık alanları ve belgeleri kaydetme
  async saveUserSpecialties(userId: string, specialtyDocuments: any[]) {
    try {
      if (!supabaseAdmin) {
        return { success: false, error: 'Supabase admin client not initialized' }
      }

      console.log('🔄 Saving user specialties:', userId, specialtyDocuments.length)

      // Mevcut kayıtları sil
      await supabaseAdmin.from('consultant_specialties').delete().eq('consultant_id', userId)
      await supabaseAdmin.from('consultant_documents').delete().eq('consultant_id', userId)

      // Direkt specialtyDocuments array'ini kullan

      // Uzmanlık alanlarını kaydet - Basit yaklaşım
      console.log('📋 Processing specialties for user:', userId)
      console.log('📋 Specialty documents received:', specialtyDocuments)

      for (const doc of specialtyDocuments) {
        const insertData = {
          consultant_id: userId,
          specialty_area: doc.specialty,
          experience_years: doc.experienceYears || 1,
          experience_months: doc.experienceMonths || 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        
        console.log('📝 Inserting specialty:', insertData)
        
        const { error: specialtyError } = await supabaseAdmin
          .from('consultant_specialties')
          .insert(insertData)

        if (specialtyError) {
          console.error('❌ Specialty save error:', specialtyError)
          console.error('❌ Error details:', JSON.stringify(specialtyError, null, 2))
          console.error('❌ Failed data:', insertData)
          throw new Error(`Uzmanlık alanı kaydedilemedi: ${specialtyError.message}`)
        } else {
          console.log('✅ Specialty saved successfully:', doc.specialty)
        }

        // Belge kaydetme - Eğer documentUrl varsa (client-side'da yüklenmiş)
        if (doc.documentUrl && doc.documentType) {
          console.log('📄 Saving document record for specialty:', doc.specialty)
          
          const documentData = {
            consultant_id: userId,
            specialty_area: doc.specialty,
            document_type: doc.documentType,
            document_url: doc.documentUrl,
            file_name: doc.fileName || doc.documentType
          }

          const { error: docError } = await supabaseAdmin
            .from('consultant_documents')
            .insert(documentData)

          if (docError) {
            console.error('❌ Document record save error:', docError)
            throw new Error(`Belge kaydedilemedi: ${docError.message}`)
          } else {
            console.log('✅ Document record saved successfully')
          }
        }
      }

      return { success: true }
    } catch (error) {
      console.error('💥 Save specialties error:', error)
      return { success: false, error }
    }
  },

  // Kullanıcı detayları getirme (specialties ve documents dahil)
  async getUserDetails(userId: string) {
    try {
      if (!supabaseAdmin) {
        return { success: false, error: 'Supabase admin client not initialized' }
      }

      console.log('🔍 Getting user details:', userId)

      // 1. Kullanıcı bilgileri
      const { data: user, error: userError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (userError) {
        console.error('❌ User fetch error:', userError)
        throw userError
      }

      // 2. Uzmanlık alanları
      const { data: specialties, error: specialtiesError } = await supabaseAdmin
        .from('consultant_specialties')
        .select('*')
        .eq('consultant_id', userId)
        .order('created_at', { ascending: false })

      if (specialtiesError) {
        console.log('⚠️ No specialties found:', specialtiesError.message)
      }

      // 3. Belgeler
      const { data: documents, error: documentsError } = await supabaseAdmin
        .from('consultant_documents')
        .select('*')
        .eq('consultant_id', userId)
        .order('created_at', { ascending: false })

      if (documentsError) {
        console.log('⚠️ No documents found:', documentsError.message)
      }

      console.log('✅ User details fetched:', {
        user: !!user,
        specialties: specialties?.length || 0,
        documents: documents?.length || 0
      })

      return {
        success: true,
        data: {
          user,
          specialties: specialties || [],
          documents: documents || []
        }
      }
    } catch (error) {
      console.error('💥 Get user details error:', error)
      return { success: false, error }
    }
  },

  // Kullanıcı listesi getirme (duplicate function - will be removed)
  async getUsersList() {
    try {
      if (!supabaseAdmin) {
        return { success: false, error: 'Supabase admin client not initialized' }
      }

      console.log('📥 Getting users from database...')
      
      const { data: users, error } = await supabaseAdmin
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

      if (error) {
        console.error('❌ Get users error:', error)
        return { success: false, error }
      }

      console.log('✅ Users fetched successfully:', users?.length || 0)
      return { success: true, data: users || [] }
    } catch (error) {
      console.error('💥 Get users exception:', error)
      return { success: false, error }
    }
  }
}
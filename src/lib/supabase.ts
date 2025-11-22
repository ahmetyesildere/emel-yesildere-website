import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Browser client for client-side operations
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
    autoRefreshToken: true,
    persistSession: true, // Session'ı sakla ama sessionStorage'da (tarayıcı kapatılınca silinir)
    detectSessionInUrl: true,
    storageKey: 'sb-auth-token',
    storage: typeof window !== 'undefined' ? {
      getItem: (key: string) => {
        // sessionStorage kullan (tarayıcı kapatıldığında otomatik temizlenir)
        return sessionStorage.getItem(key)
      },
      setItem: (key: string, value: string) => {
        sessionStorage.setItem(key, value)
      },
      removeItem: (key: string) => {
        sessionStorage.removeItem(key)
      }
    } : undefined
  }
})

// Admin client for server-side operations (use with caution)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Database types - Updated for new clean schema
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          role: 'visitor' | 'client' | 'consultant' | 'admin' | 'staff'
          avatar_url: string | null
          is_active: boolean
          email_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name: string
          last_name: string
          role?: 'visitor' | 'client' | 'consultant' | 'admin' | 'staff'
          avatar_url?: string | null
          is_active?: boolean
          email_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          role?: 'visitor' | 'client' | 'consultant' | 'admin' | 'staff'
          avatar_url?: string | null
          is_active?: boolean
          email_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      role_history: {
        Row: {
          id: string
          user_id: string
          old_role: string | null
          new_role: string | null
          changed_by: string | null
          reason: string | null
          created_at: string
        }
      }
      sessions: {
        Row: {
          id: string
          client_id: string
          consultant_id: string
          session_type_id: string | null
          session_date: string
          start_time: string
          end_time: string
          duration_minutes: number
          type: 'online' | 'in_person'
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
          location: string | null
          meeting_link: string | null
          price: number
          notes: string | null
          client_notes: string | null
          consultant_notes: string | null
          created_at: string
          updated_at: string
        }
      }
      session_types: {
        Row: {
          id: string
          name: string
          description: string | null
          duration_minutes: number
          price: number
          is_online: boolean
          is_in_person: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
      }
      payments: {
        Row: {
          id: string
          session_id: string | null
          user_id: string
          amount: number
          status: 'pending' | 'completed' | 'failed' | 'refunded'
          payment_method: string | null
          transaction_id: string | null
          payment_date: string | null
          created_at: string
          updated_at: string
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string
          subject: string | null
          content: string
          attachment_url: string | null
          is_read: boolean
          created_at: string
          updated_at: string
        }
      }
      notifications: {
        Row: {
          id: string
          sender_id: string | null
          receiver_id: string | null
          title: string
          content: string
          type: 'announcement' | 'reminder' | 'system' | 'message'
          is_read: boolean
          created_at: string
          updated_at: string
        }
      }
      availability: {
        Row: {
          id: string
          consultant_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
      }
      ai_conversations: {
        Row: {
          id: string
          user_id: string
          message: string
          response: string
          model: string | null
          tokens_used: number | null
          created_at: string
        }
      }
      files: {
        Row: {
          id: string
          user_id: string
          file_name: string
          file_path: string
          file_type: string | null
          file_size: number | null
          bucket_name: 'avatars' | 'certificates' | 'documents' | 'images' | 'videos' | null
          category: 'profile' | 'certificate' | 'document' | 'blog' | 'attachment' | null
          is_public: boolean
          created_at: string
          updated_at: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          author_id: string
          title: string
          slug: string
          content: string
          excerpt: string | null
          featured_image_url: string | null
          status: 'draft' | 'published' | 'archived'
          published_at: string | null
          created_at: string
          updated_at: string
        }
      }
      site_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: any
          created_at: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          id?: string
          setting_key: string
          setting_value: any
          created_at?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          id?: string
          setting_key?: string
          setting_value?: any
          created_at?: string
          updated_at?: string
          updated_by?: string | null
        }
      }
    }
  }
}
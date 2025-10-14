import { supabase } from '@/lib/supabase'

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  featured_image: string | null
  author_id: string | null
  category_id: string | null
  tags: string[] | null
  is_published: boolean
  is_featured: boolean
  view_count: number
  reading_time: number | null
  seo_title: string | null
  seo_description: string | null
  published_at: string | null
  created_at: string
  updated_at: string
  category?: BlogCategory
  author?: {
    first_name: string | null
    last_name: string | null
    avatar_url: string | null
  }
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description: string | null
  color: string
  is_active: boolean
  created_at: string
}

// Blog yazılarını getir
export async function getBlogPosts(options?: {
  limit?: number
  offset?: number
  categoryId?: string
  featured?: boolean
  published?: boolean
}) {
  const {
    limit = 10,
    offset = 0,
    categoryId,
    featured,
    published = true
  } = options || {}

  let query = supabase
    .from('blog_posts')
    .select(`
      *,
      category:blog_categories(*),
      author:profiles(first_name, last_name, avatar_url)
    `)
    .eq('is_published', published)
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }

  if (featured !== undefined) {
    query = query.eq('is_featured', featured)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }

  return data as BlogPost[]
}

// Tek blog yazısını getir
export async function getBlogPost(slug: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      category:blog_categories(*),
      author:profiles(first_name, last_name, avatar_url)
    `)
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error) {
    console.error('Error fetching blog post:', error)
    return null
  }

  // Görüntülenme sayısını artır
  await supabase
    .from('blog_posts')
    .update({ view_count: data.view_count + 1 })
    .eq('id', data.id)

  return data as BlogPost
}

// Blog kategorilerini getir
export async function getBlogCategories() {
  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .eq('is_active', true)
    .order('name')

  if (error) {
    console.error('Error fetching blog categories:', error)
    return []
  }

  return data as BlogCategory[]
}

// Öne çıkan blog yazılarını getir
export async function getFeaturedPosts(limit = 3) {
  return getBlogPosts({ limit, featured: true })
}

// Son blog yazılarını getir
export async function getRecentPosts(limit = 6) {
  return getBlogPosts({ limit })
}

// Kategoriye göre blog yazılarını getir
export async function getPostsByCategory(categorySlug: string, limit = 10) {
  // Önce kategoriyi bul
  const { data: category } = await supabase
    .from('blog_categories')
    .select('id')
    .eq('slug', categorySlug)
    .single()

  if (!category) return []

  return getBlogPosts({ categoryId: category.id, limit })
}

// Blog yazısı ara
export async function searchBlogPosts(query: string, limit = 10) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      category:blog_categories(*),
      author:profiles(first_name, last_name, avatar_url)
    `)
    .eq('is_published', true)
    .or(`title.ilike.%${query}%, content.ilike.%${query}%, excerpt.ilike.%${query}%`)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error searching blog posts:', error)
    return []
  }

  return data as BlogPost[]
}

// Blog istatistikleri
export async function getBlogStats() {
  const [postsResult, categoriesResult] = await Promise.all([
    supabase
      .from('blog_posts')
      .select('id', { count: 'exact' })
      .eq('is_published', true),
    supabase
      .from('blog_categories')
      .select('id', { count: 'exact' })
      .eq('is_active', true)
  ])

  return {
    totalPosts: postsResult.count || 0,
    totalCategories: categoriesResult.count || 0
  }
}
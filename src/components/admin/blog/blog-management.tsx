'use client'

import React, { useState, useEffect } from 'react'
import { 
  Plus, Edit, Trash2, Eye, EyeOff, Calendar, User, Tag,
  Search, Filter, MoreHorizontal, FileText, Save, X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth/auth-context'
import { useSafeToast } from '@/hooks/use-safe-toast'

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  status: 'draft' | 'published' | 'archived'
  published_at: string | null
  created_at: string
  updated_at: string
  author_id: string
  view_count: number
  tags: string[]
  author?: {
    first_name: string
    last_name: string
  }
}

interface BlogCategory {
  id: string
  name: string
  slug: string
  description: string
}

const BlogManagement = () => {
  const { user } = useAuth()
  const toast = useSafeToast()
  
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [showEditor, setShowEditor] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    tags: '',
    status: 'draft' as 'draft' | 'published' | 'archived'
  })

  useEffect(() => {
    loadBlogPosts()
    loadCategories()
  }, [])

  const loadBlogPosts = async () => {
    try {
      // Test aşaması için local storage kullan
      const localPosts = JSON.parse(localStorage.getItem('blog_posts') || '[]')
      
      // Eğer local storage boşsa örnek veri ekle
      if (localPosts.length === 0) {
        const samplePosts = [
          {
            id: '1',
            title: 'Stres Yönetimi Teknikleri',
            slug: 'stres-yonetimi-teknikleri',
            content: 'Günlük hayatta karşılaştığımız stresle başa çıkmanın etkili yolları...\n\nStres, modern yaşamın kaçınılmaz bir parçasıdır. Ancak doğru tekniklerle stresi yönetmek ve hayat kalitenizi artırmak mümkündür.\n\n1. Nefes Egzersizleri\nDerin nefes almak, sinir sistemini sakinleştirir ve stresi azaltır.\n\n2. Meditasyon\nGünde 10-15 dakika meditasyon yapmak, zihinsel berraklığı artırır.\n\n3. Fiziksel Aktivite\nDüzenli egzersiz, endorfin salınımını artırarak doğal bir stres gidericidir.',
            excerpt: 'Günlük hayatta karşılaştığımız stresle başa çıkmanın etkili yolları ve pratik teknikleri.',
            status: 'published',
            published_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            author_id: user?.id || 'test',
            view_count: 45,
            tags: ['stres', 'psikoloji', 'yaşam koçluğu'],
            author: {
              first_name: 'Emel',
              last_name: 'Yeşildere'
            }
          },
          {
            id: '2',
            title: 'İletişimde Empati Kurmanın Önemi',
            slug: 'iletisimde-empati-kurmanin-onemi',
            content: 'Empati, başkalarının duygularını anlama ve hissetme yeteneğidir...\n\nİyi bir iletişimin temelinde empati yatar. Empati kurmak, ilişkilerimizi güçlendirir ve çatışmaları azaltır.\n\nEmpati Kurmanın Faydaları:\n- Daha güçlü ilişkiler\n- Azalan çatışmalar\n- Artmış güven\n- Daha iyi problem çözme\n\nEmpati geliştirmek için:\n1. Aktif dinleme yapın\n2. Yargılamadan yaklaşın\n3. Karşınızdakinin perspektifini anlamaya çalışın',
            excerpt: 'Empati kurmanın ilişkilerimize olan olumlu etkilerini ve empati geliştirme yöntemlerini keşfedin.',
            status: 'published',
            published_at: new Date(Date.now() - 86400000).toISOString(),
            created_at: new Date(Date.now() - 86400000).toISOString(),
            updated_at: new Date(Date.now() - 86400000).toISOString(),
            author_id: user?.id || 'test',
            view_count: 32,
            tags: ['empati', 'iletişim', 'ilişkiler'],
            author: {
              first_name: 'Emel',
              last_name: 'Yeşildere'
            }
          }
        ]
        localStorage.setItem('blog_posts', JSON.stringify(samplePosts))
        setPosts(samplePosts)
      } else {
        setPosts(localPosts)
      }
    } catch (error) {
      console.error('Blog yazıları yüklenirken hata:', error)
      toast.error('Blog yazıları yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleSavePost = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Başlık ve içerik zorunludur')
      return
    }

    try {
      const slug = generateSlug(formData.title)
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      
      const postData = {
        title: formData.title.trim(),
        slug,
        content: formData.content.trim(),
        excerpt: formData.excerpt.trim() || formData.content.substring(0, 200) + '...',
        status: formData.status,
        author_id: user?.id,
        tags: tagsArray,
        published_at: formData.status === 'published' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      }

      // Test aşaması için local storage kullan
      const existingPosts = JSON.parse(localStorage.getItem('blog_posts') || '[]')
      
      if (editingPost) {
        // Güncelleme
        const updatedPosts = existingPosts.map((post: any) => 
          post.id === editingPost.id ? { ...post, ...postData } : post
        )
        localStorage.setItem('blog_posts', JSON.stringify(updatedPosts))
        toast.success('Blog yazısı güncellendi (Test Modu)')
      } else {
        // Yeni oluşturma
        const newPost = {
          id: Date.now().toString(),
          ...postData,
          created_at: new Date().toISOString(),
          view_count: 0,
          author: {
            first_name: 'Test',
            last_name: 'Kullanıcı'
          }
        }
        existingPosts.unshift(newPost)
        localStorage.setItem('blog_posts', JSON.stringify(existingPosts))
        toast.success('Blog yazısı oluşturuldu (Test Modu)')
      }

      setShowEditor(false)
      setEditingPost(null)
      setFormData({ title: '', content: '', excerpt: '', tags: '', status: 'draft' })
      loadBlogPosts()
    } catch (error) {
      console.error('Blog yazısı kaydedilirken hata:', error)
      toast.error('Blog yazısı kaydedilemedi')
    }
  }

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      tags: post.tags?.join(', ') || '',
      status: post.status
    })
    setShowEditor(true)
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) return

    try {
      // Test aşaması için local storage kullan
      const existingPosts = JSON.parse(localStorage.getItem('blog_posts') || '[]')
      const filteredPosts = existingPosts.filter((post: any) => post.id !== postId)
      localStorage.setItem('blog_posts', JSON.stringify(filteredPosts))
      
      toast.success('Blog yazısı silindi (Test Modu)')
      loadBlogPosts()
    } catch (error) {
      console.error('Blog yazısı silinirken hata:', error)
      toast.error('Blog yazısı silinemedi')
    }
  }

  const handleStatusChange = async (postId: string, newStatus: 'draft' | 'published' | 'archived') => {
    try {
      // Test aşaması için local storage kullan
      const existingPosts = JSON.parse(localStorage.getItem('blog_posts') || '[]')
      const updatedPosts = existingPosts.map((post: any) => {
        if (post.id === postId) {
          return {
            ...post,
            status: newStatus,
            updated_at: new Date().toISOString(),
            published_at: newStatus === 'published' ? new Date().toISOString() : post.published_at
          }
        }
        return post
      })
      
      localStorage.setItem('blog_posts', JSON.stringify(updatedPosts))
      toast.success(`Blog yazısı ${newStatus === 'published' ? 'yayınlandı' : 'durumu güncellendi'} (Test Modu)`)
      loadBlogPosts()
    } catch (error) {
      console.error('Blog yazısı durumu güncellenirken hata:', error)
      toast.error('Durum güncellenemedi')
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'Taslak', color: 'bg-gray-100 text-gray-800' },
      published: { label: 'Yayında', color: 'bg-green-100 text-green-800' },
      archived: { label: 'Arşiv', color: 'bg-red-100 text-red-800' }
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-2">Blog yazıları yükleniyor...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Blog Yönetimi</h2>
          <p className="text-gray-600">Blog yazılarını oluşturun ve yönetin</p>
        </div>
        <Button 
          onClick={() => {
            setEditingPost(null)
            setFormData({ title: '', content: '', excerpt: '', tags: '', status: 'draft' })
            setShowEditor(true)
          }}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Blog Yazısı
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Blog yazılarında ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tüm Durumlar</option>
          <option value="draft">Taslak</option>
          <option value="published">Yayında</option>
          <option value="archived">Arşiv</option>
        </select>
      </div>

      {/* Blog Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">
                  {editingPost ? 'Blog Yazısını Düzenle' : 'Yeni Blog Yazısı'}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEditor(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Başlık *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Blog yazısı başlığı"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Özet
                  </label>
                  <Textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Blog yazısının kısa özeti (boş bırakılırsa otomatik oluşturulur)"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İçerik *
                  </label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Blog yazısının içeriği"
                    rows={12}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Etiketler
                  </label>
                  <Input
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="Etiketleri virgülle ayırın (örn: psikoloji, yaşam koçluğu)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durum
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">Taslak</option>
                    <option value="published">Yayınla</option>
                    <option value="archived">Arşiv</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowEditor(false)}
                  >
                    İptal
                  </Button>
                  <Button
                    onClick={handleSavePost}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingPost ? 'Güncelle' : 'Kaydet'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blog Posts List */}
      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {post.title}
                      </h3>
                      {getStatusBadge(post.status)}
                    </div>

                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {post.author?.first_name} {post.author?.last_name}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(post.created_at).toLocaleDateString('tr-TR')}
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {post.view_count} görüntüleme
                      </div>
                    </div>

                    {post.tags && post.tags.length > 0 && (
                      <div className="flex items-center space-x-2 mt-3">
                        <Tag className="w-4 h-4 text-gray-400" />
                        <div className="flex flex-wrap gap-1">
                          {post.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditPost(post)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    
                    {post.status === 'draft' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(post.id, 'published')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                    
                    {post.status === 'published' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(post.id, 'draft')}
                      >
                        <EyeOff className="w-4 h-4" />
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeletePost(post.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'all' ? 'Sonuç bulunamadı' : 'Henüz blog yazısı yok'}
            </h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' 
                ? 'Arama kriterlerinizi değiştirmeyi deneyin'
                : 'İlk blog yazınızı oluşturmak için "Yeni Blog Yazısı" butonuna tıklayın'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogManagement
'use client'

import React, { useState } from 'react'
import { 
  FileText, Plus, Edit, Trash2, Eye, Search, Filter, 
  Calendar, User, Tag, TrendingUp, Heart, MessageCircle,
  CheckCircle, XCircle, Clock, Star, BarChart3
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const BlogManagement = () => {
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')

  const blogPosts = [
    {
      id: 1,
      title: 'Duygu Temizliği ile İç Huzura Ulaşmanın 5 Adımı',
      slug: 'duygu-temizligi-ic-huzur-5-adim',
      excerpt: 'Bilinçaltımızda biriken olumsuz duyguları temizleyerek iç huzurumuzu nasıl bulabiliriz?',
      category: 'Duygu Temizliği',
      author: 'Emel Yeşildere',
      status: 'published',
      publishedAt: '2024-07-20',
      viewCount: 2450,
      likes: 89,
      comments: 23,
      readingTime: 8,
      featured: true,
      tags: ['duygu temizliği', 'iç huzur', 'bilinçaltı']
    },
    {
      id: 2,
      title: 'Travma Sonrası Büyüme: Zorluklardan Güç Çıkarmak',
      slug: 'travma-sonrasi-buyume-zorluklar',
      excerpt: 'Travmatik deneyimler nasıl kişisel büyüme fırsatına dönüştürülebilir?',
      category: 'Travma İyileştirme',
      author: 'Emel Yeşildere',
      status: 'published',
      publishedAt: '2024-07-18',
      viewCount: 1890,
      likes: 67,
      comments: 18,
      readingTime: 12,
      featured: false,
      tags: ['travma', 'büyüme', 'iyileşme']
    },
    {
      id: 3,
      title: '2024 Hedeflerinizi Gerçekleştirmenin Bilimsel Yolları',
      slug: '2024-hedefler-bilimsel-yollar',
      excerpt: 'Hedef belirleme ve gerçekleştirme konusunda bilimsel araştırmalara dayalı etkili stratejiler.',
      category: 'Yaşam Koçluğu',
      author: 'Emel Yeşildere',
      status: 'draft',
      publishedAt: null,
      viewCount: 0,
      likes: 0,
      comments: 0,
      readingTime: 10,
      featured: false,
      tags: ['hedefler', 'motivasyon', 'başarı']
    },
    {
      id: 4,
      title: 'Chakra Dengeleme: Enerji Merkezlerinizi Uyumlaştırın',
      slug: 'chakra-dengeleme-enerji-merkezleri',
      excerpt: 'Chakra sistemi nedir ve enerji merkezlerimizi nasıl dengeleyebiliriz?',
      category: 'Holistik Yaklaşım',
      author: 'Emel Yeşildere',
      status: 'review',
      publishedAt: null,
      viewCount: 0,
      likes: 0,
      comments: 0,
      readingTime: 15,
      featured: false,
      tags: ['chakra', 'enerji', 'denge']
    }
  ]

  const categories = [
    { name: 'Duygu Temizliği', count: 12, color: 'bg-red-100 text-red-800' },
    { name: 'Travma İyileştirme', count: 8, color: 'bg-purple-100 text-purple-800' },
    { name: 'Yaşam Koçluğu', count: 15, color: 'bg-blue-100 text-blue-800' },
    { name: 'Holistik Yaklaşım', count: 6, color: 'bg-emerald-100 text-emerald-800' },
    { name: 'Kişisel Gelişim', count: 18, color: 'bg-orange-100 text-orange-800' }
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: { label: 'Yayınlandı', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      draft: { label: 'Taslak', color: 'bg-gray-100 text-gray-800', icon: Edit },
      review: { label: 'İncelemede', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      archived: { label: 'Arşivlendi', color: 'bg-red-100 text-red-800', icon: XCircle }
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    const IconComponent = config.icon
    return (
      <div className="flex items-center space-x-1">
        <IconComponent className="w-3 h-3" />
        <Badge className={config.color}>{config.label}</Badge>
      </div>
    )
  }

  const filteredPosts = blogPosts.filter(post => {
    if (filterStatus !== 'all' && post.status !== filterStatus) return false
    if (filterCategory !== 'all' && post.category !== filterCategory) return false
    return true
  })

  const blogStats = {
    total: blogPosts.length,
    published: blogPosts.filter(p => p.status === 'published').length,
    draft: blogPosts.filter(p => p.status === 'draft').length,
    totalViews: blogPosts.reduce((sum, p) => sum + p.viewCount, 0),
    totalLikes: blogPosts.reduce((sum, p) => sum + p.likes, 0),
    totalComments: blogPosts.reduce((sum, p) => sum + p.comments, 0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Blog Yönetimi</h2>
          <p className="text-gray-600">Blog yazılarını oluşturun, düzenleyin ve yönetin</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Yeni Yazı
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Toplam</p>
                <p className="text-2xl font-bold text-gray-900">{blogStats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Yayınlandı</p>
                <p className="text-2xl font-bold text-green-600">{blogStats.published}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taslak</p>
                <p className="text-2xl font-bold text-gray-600">{blogStats.draft}</p>
              </div>
              <Edit className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Görüntülenme</p>
                <p className="text-2xl font-bold text-blue-600">{blogStats.totalViews.toLocaleString()}</p>
              </div>
              <Eye className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Beğeni</p>
                <p className="text-2xl font-bold text-red-600">{blogStats.totalLikes}</p>
              </div>
              <Heart className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Yorum</p>
                <p className="text-2xl font-bold text-orange-600">{blogStats.totalComments}</p>
              </div>
              <MessageCircle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input placeholder="Yazı başlığı veya içerik ara..." />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Durum filtrele" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Durumlar</SelectItem>
                <SelectItem value="published">Yayınlandı</SelectItem>
                <SelectItem value="draft">Taslak</SelectItem>
                <SelectItem value="review">İncelemede</SelectItem>
                <SelectItem value="archived">Arşivlendi</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Kategori filtrele" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Kategoriler</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.name} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Blog Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Blog Yazıları ({filteredPosts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Yazı</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Kategori</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Durum</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Tarih</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">İstatistikler</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900 line-clamp-1">{post.title}</h4>
                            {post.featured && (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                <Star className="w-3 h-3 mr-1" />
                                Öne Çıkan
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2 mt-1">{post.excerpt}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            {post.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={categories.find(c => c.name === post.category)?.color}>
                        {post.category}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(post.status)}
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        {post.publishedAt ? (
                          <>
                            <div className="font-medium text-gray-900">{post.publishedAt}</div>
                            <div className="text-sm text-gray-600">Yayınlandı</div>
                          </>
                        ) : (
                          <div className="text-sm text-gray-600">Henüz yayınlanmadı</div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4 text-blue-600" />
                            <span>{post.viewCount.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4 text-red-600" />
                            <span>{post.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4 text-green-600" />
                            <span>{post.comments}</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {post.readingTime} dakika okuma
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" title="Görüntüle">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" title="Düzenle">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" title="İstatistikler">
                          <BarChart3 className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" title="Sil">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Kategoriler</CardTitle>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Yeni Kategori
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{category.name}</h4>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge className={category.color}>{category.count} yazı</Badge>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>Popüler</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default BlogManagement
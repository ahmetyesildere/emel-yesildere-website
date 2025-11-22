'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, User, Eye, Tag, Search, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  published_at: string
  view_count: number
  tags: string[]
  author: {
    first_name: string
    last_name: string
  }
}

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('')

  useEffect(() => {
    loadBlogPosts()
  }, [])

  const loadBlogPosts = async () => {
    try {
      // Test aşaması için local storage kullan
      const localPosts = JSON.parse(localStorage.getItem('blog_posts') || '[]')
      const publishedPosts = localPosts
        .filter((post: any) => post.status === 'published')
        .sort((a: any, b: any) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
      
      setPosts(publishedPosts)
    } catch (error) {
      console.error('Blog yazıları yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  // Tüm etiketleri topla
  const allTags = Array.from(
    new Set(posts.flatMap(post => post.tags || []))
  ).sort()

  // Filtrelenmiş yazılar
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTag = !selectedTag || (post.tags && post.tags.includes(selectedTag))
    return matchesSearch && matchesTag
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Blog yazıları yükleniyor...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Psikoloji, yaşam koçluğu ve kişisel gelişim üzerine yazılarım
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Blog yazılarında ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>
            
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedTag === '' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTag('')}
                >
                  Tümü
                </Button>
                {allTags.map(tag => (
                  <Button
                    key={tag}
                    variant={selectedTag === tag ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Blog Posts */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-gray-600 line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {post.author.first_name} {post.author.last_name}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(post.published_at)}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {post.view_count}
                      </div>
                    </div>

                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{post.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    <Link href={`/blog/${post.slug}`}>
                      <Button className="w-full group">
                        Devamını Oku
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || selectedTag ? 'Sonuç bulunamadı' : 'Henüz blog yazısı yok'}
            </h3>
            <p className="text-gray-600">
              {searchTerm || selectedTag 
                ? 'Arama kriterlerinizi değiştirmeyi deneyin'
                : 'Yakında ilginç yazılarla burada olacağım!'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogPage
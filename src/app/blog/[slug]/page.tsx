'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, User, Eye, Tag, ArrowLeft, Share2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  published_at: string
  view_count: number
  tags: string[]
  meta_title?: string
  meta_description?: string
  author: {
    first_name: string
    last_name: string
  }
}

const BlogPostPage = () => {
  const params = useParams()
  const slug = params.slug as string

  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    if (slug) {
      loadBlogPost()
    }
  }, [slug])

  const loadBlogPost = async () => {
    try {
      // Test aşaması için local storage kullan
      const localPosts = JSON.parse(localStorage.getItem('blog_posts') || '[]')
      const postData = localPosts.find((post: any) => post.slug === slug && post.status === 'published')

      if (!postData) {
        setPost(null)
        setLoading(false)
        return
      }

      setPost(postData)

      // Görüntüleme sayısını artır (local storage'da)
      const updatedPosts = localPosts.map((post: any) =>
        post.id === postData.id
          ? { ...post, view_count: (post.view_count || 0) + 1 }
          : post
      )
      localStorage.setItem('blog_posts', JSON.stringify(updatedPosts))

      // İlgili yazıları yükle (aynı etiketlere sahip)
      if (postData.tags && postData.tags.length > 0) {
        const relatedData = localPosts
          .filter((post: any) =>
            post.status === 'published' &&
            post.id !== postData.id &&
            post.tags?.some((tag: string) => postData.tags.includes(tag))
          )
          .slice(0, 3)

        setRelatedPosts(relatedData)
      }

    } catch (error) {
      console.error('Blog yazısı yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href
        })
      } catch (error) {
        // Paylaşım iptal edildi veya desteklenmiyor
        copyToClipboard()
      }
    } else {
      copyToClipboard()
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    // Toast mesajı gösterilebilir
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Blog yazısı yükleniyor...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog yazısı bulunamadı</h1>
            <p className="text-gray-600 mb-8">Aradığınız blog yazısı mevcut değil veya yayından kaldırılmış.</p>
            <Link href="/blog">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Blog'a Dön
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/blog">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Blog'a Dön
            </Button>
          </Link>
        </div>

        {/* Article */}
        <article className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            {/* Header */}
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-6 text-gray-600">
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    {post.author.first_name} {post.author.last_name}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    {formatDate(post.published_at)}
                  </div>
                  <div className="flex items-center">
                    <Eye className="w-5 h-5 mr-2" />
                    {post.view_count} görüntüleme
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Paylaş
                </Button>
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </header>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                {post.content}
              </div>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">İlgili Yazılar</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(relatedPost.published_at)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  )
}

export default BlogPostPage
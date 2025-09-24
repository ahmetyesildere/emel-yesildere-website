'use client'

import React, { useState } from 'react'
import { Clock, User, Eye, Heart, MessageCircle, Share2, BookOpen, Calendar, Tag, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const BlogGrid = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('latest')

  const blogPosts = [
    {
      id: 1,
      title: 'Duygu Temizliği ile İç Huzura Ulaşmanın 5 Adımı',
      excerpt: 'Bilinçaltımızda biriken olumsuz duyguları temizleyerek iç huzurumuzu nasıl bulabiliriz? Bu yazıda pratik adımları keşfedin.',
      author: 'Emel Yeşildere',
      date: '2024-07-20',
      readTime: '8 dakika',
      category: 'Duygu Temizliği',
      tags: ['duygu temizliği', 'iç huzur', 'bilinçaltı'],
      views: 2450,
      likes: 89,
      comments: 23,
      featured: true,
      image: '/api/placeholder/400/250'
    },
    {
      id: 2,
      title: 'Travma Sonrası Büyüme: Zorluklardan Güç Çıkarmak',
      excerpt: 'Travmatik deneyimler nasıl kişisel büyüme fırsatına dönüştürülebilir? Travma sonrası büyüme sürecini anlayın.',
      author: 'Emel Yeşildere',
      date: '2024-07-18',
      readTime: '12 dakika',
      category: 'Travma İyileştirme',
      tags: ['travma', 'büyüme', 'iyileşme'],
      views: 1890,
      likes: 67,
      comments: 18,
      featured: false,
      image: '/api/placeholder/400/250'
    },
    {
      id: 3,
      title: '2024 Hedeflerinizi Gerçekleştirmenin Bilimsel Yolları',
      excerpt: 'Hedef belirleme ve gerçekleştirme konusunda bilimsel araştırmalara dayalı etkili stratejiler.',
      author: 'Emel Yeşildere',
      date: '2024-07-15',
      readTime: '10 dakika',
      category: 'Yaşam Koçluğu',
      tags: ['hedefler', 'motivasyon', 'başarı'],
      views: 3120,
      likes: 124,
      comments: 31,
      featured: false,
      image: '/api/placeholder/400/250'
    },
    {
      id: 4,
      title: 'Chakra Dengeleme: Enerji Merkezlerinizi Uyumlaştırın',
      excerpt: 'Chakra sistemi nedir ve enerji merkezlerimizi nasıl dengeleyebiliriz? Holistik iyileşme rehberi.',
      author: 'Emel Yeşildere',
      date: '2024-07-12',
      readTime: '15 dakika',
      category: 'Holistik Yaklaşım',
      tags: ['chakra', 'enerji', 'denge'],
      views: 1650,
      likes: 78,
      comments: 15,
      featured: false,
      image: '/api/placeholder/400/250'
    },
    {
      id: 5,
      title: 'Günlük Mindfulness Pratiği: 10 Dakikada İç Huzur',
      excerpt: 'Yoğun yaşam temposunda mindfulness pratiği nasıl yapılır? Günlük rutininize entegre edebileceğiniz basit teknikler.',
      author: 'Emel Yeşildere',
      date: '2024-07-10',
      readTime: '6 dakika',
      category: 'Kişisel Gelişim',
      tags: ['mindfulness', 'meditasyon', 'huzur'],
      views: 2890,
      likes: 156,
      comments: 42,
      featured: false,
      image: '/api/placeholder/400/250'
    },
    {
      id: 6,
      title: 'Stres Yönetimi: Modern Yaşamın Zorluklarıyla Başa Çıkma',
      excerpt: 'Stresle sağlıklı şekilde başa çıkmanın yolları ve stres yönetimi teknikleri.',
      author: 'Emel Yeşildere',
      date: '2024-07-08',
      readTime: '9 dakika',
      category: 'Kişisel Gelişim',
      tags: ['stres', 'yönetim', 'sağlık'],
      views: 2100,
      likes: 92,
      comments: 28,
      featured: false,
      image: '/api/placeholder/400/250'
    },
    {
      id: 7,
      title: 'İlişkilerde Duygusal Zeka: Empati ve İletişim',
      excerpt: 'İlişkilerimizde duygusal zekayı nasıl kullanabiliriz? Empati ve etkili iletişim teknikleri.',
      author: 'Emel Yeşildere',
      date: '2024-07-05',
      readTime: '11 dakika',
      category: 'Kişisel Gelişim',
      tags: ['ilişkiler', 'empati', 'iletişim'],
      views: 1750,
      likes: 83,
      comments: 19,
      featured: false,
      image: '/api/placeholder/400/250'
    },
    {
      id: 8,
      title: 'Enerji Temizliği: Negatif Enerjilerden Arınma Yolları',
      excerpt: 'Çevremizden aldığımız negatif enerjilerden nasıl arınabiliriz? Enerji temizliği teknikleri.',
      author: 'Emel Yeşildere',
      date: '2024-07-03',
      readTime: '7 dakika',
      category: 'Holistik Yaklaşım',
      tags: ['enerji', 'temizlik', 'koruma'],
      views: 1420,
      likes: 65,
      comments: 12,
      featured: false,
      image: '/api/placeholder/400/250'
    },
    {
      id: 9,
      title: 'Özgüven Geliştirme: Kendinize İnanmanın Gücü',
      excerpt: 'Özgüven nasıl geliştirilir? Kendinize inanmanın hayatınıza getireceği pozitif değişimler.',
      author: 'Emel Yeşildere',
      date: '2024-07-01',
      readTime: '8 dakika',
      category: 'Kişisel Gelişim',
      tags: ['özgüven', 'inanç', 'gelişim'],
      views: 2650,
      likes: 118,
      comments: 35,
      featured: false,
      image: '/api/placeholder/400/250'
    }
  ]

  const postsPerPage = 6
  const totalPages = Math.ceil(blogPosts.length / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const currentPosts = blogPosts.slice(startIndex, startIndex + postsPerPage)

  const getCategoryColor = (category: string) => {
    const colors = {
      'Duygu Temizliği': 'bg-red-100 text-red-800',
      'Travma İyileştirme': 'bg-purple-100 text-purple-800',
      'Yaşam Koçluğu': 'bg-blue-100 text-blue-800',
      'Holistik Yaklaşım': 'bg-emerald-100 text-emerald-800',
      'Kişisel Gelişim': 'bg-orange-100 text-orange-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Son Yazılar</h2>
            <p className="text-gray-600">Kişisel gelişim yolculuğunuzda size rehberlik edecek güncel içerikler</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
            >
              <option value="latest">En Yeni</option>
              <option value="popular">En Popüler</option>
              <option value="mostRead">En Çok Okunan</option>
              <option value="mostLiked">En Çok Beğenilen</option>
            </select>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {currentPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-200">
              {/* Image */}
              <div className="aspect-video bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-purple-400/30" />
                <BookOpen className="w-16 h-16 text-white opacity-80 relative z-10" />
                
                {post.featured && (
                  <Badge className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white">
                    Öne Çıkan
                  </Badge>
                )}
                
                <Badge className={`absolute top-3 right-3 ${getCategoryColor(post.category)}`}>
                  {post.category}
                </Badge>
              </div>

              <CardContent className="p-6">
                {/* Meta Info */}
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(post.date).toLocaleDateString('tr-TR')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight hover:text-purple-600 cursor-pointer transition-colors">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{post.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="p-1 hover:bg-gray-100">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Author & CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{post.author}</span>
                  </div>
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    Oku
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2"
          >
            Önceki
          </Button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 ${
                currentPage === page 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                  : ''
              }`}
            >
              {page}
            </Button>
          ))}
          
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2"
          >
            Sonraki
          </Button>
        </div>

        {/* Load More Alternative */}
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">
            Sayfa {currentPage} / {totalPages} - Toplam {blogPosts.length} yazı
          </p>
          <Button 
            variant="outline" 
            size="lg"
            className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 px-8 py-3"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Tüm Yazıları Gör
          </Button>
        </div>
      </div>
    </section>
  )
}

export default BlogGrid
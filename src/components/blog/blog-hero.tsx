'use client'

import React, { useState } from 'react'
import { Search, BookOpen, TrendingUp, Clock, User, Tag } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const BlogHero = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const featuredPost = {
    id: 1,
    title: 'Duygu Temizliği ile İç Huzura Ulaşmanın 5 Adımı',
    excerpt: 'Bilinçaltımızda biriken olumsuz duyguları temizleyerek iç huzurumuzu nasıl bulabiliriz? Bu yazıda pratik adımları keşfedin.',
    author: 'Emel Yeşildere',
    date: '2024-07-20',
    readTime: '8 dakika',
    category: 'Duygu Temizliği',
    image: '/api/placeholder/800/400',
    tags: ['duygu temizliği', 'iç huzur', 'bilinçaltı', 'iyileşme'],
    featured: true
  }

  const quickStats = [
    { number: '150+', label: 'Blog Yazısı', icon: BookOpen },
    { number: '25K+', label: 'Okuyucu', icon: User },
    { number: '100+', label: 'Yorum', icon: TrendingUp },
    { number: '12', label: 'Kategori', icon: Tag }
  ]

  const popularTags = [
    'Duygu Temizliği',
    'Travma İyileştirme',
    'Yaşam Koçluğu',
    'Holistik Koçluk',
    'Kişisel Gelişim',
    'Mindfulness',
    'İç Huzur',
    'Motivasyon'
  ]

  return (
    <section className="relative py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            Blog
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
              İlham Verici
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              İçerikler
            </span>
          </h1>

          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8">
            Duygu temizliği, travma iyileştirme ve kişisel gelişim yolculuğunuzda 
            size rehberlik edecek uzman yazıları ve pratik ipuçları keşfedin.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Blog yazılarında ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-base border-2 focus:border-purple-400 bg-white/80 backdrop-blur-sm"
              />
              <Button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 px-4 bg-gradient-to-r from-blue-600 to-purple-600"
              >
                Ara
              </Button>
            </div>
          </div>

          {/* Popular Tags */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {popularTags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="cursor-pointer hover:bg-purple-50 border-purple-300 text-purple-700"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {quickStats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <Card key={index} className="p-6 text-center bg-white/80 backdrop-blur-sm border border-purple-200 hover:shadow-lg transition-shadow">
                <IconComponent className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </Card>
            )
          })}
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Öne Çıkan Yazı</h2>
            <p className="text-gray-600">Bu haftanın en çok okunan ve beğenilen yazısı</p>
          </div>

          <Card className="overflow-hidden shadow-2xl bg-white/90 backdrop-blur-sm border-2 border-purple-200 hover:shadow-3xl transition-all duration-300">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Image */}
              <div className="aspect-video lg:aspect-square bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-purple-400/30" />
                <div className="relative z-10 text-center text-white">
                  <BookOpen className="w-20 h-20 mx-auto mb-4 opacity-80" />
                  <p className="text-lg font-semibold">Öne Çıkan Yazı</p>
                </div>
                <Badge className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white">
                  Öne Çıkan
                </Badge>
              </div>

              {/* Content */}
              <CardContent className="p-8 flex flex-col justify-center">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <Badge className="bg-purple-100 text-purple-800">
                      {featuredPost.category}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{featuredPost.readTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{featuredPost.author}</span>
                    </div>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                    {featuredPost.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {featuredPost.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <span className="text-sm text-gray-500">
                      {new Date(featuredPost.date).toLocaleDateString('tr-TR')}
                    </span>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                      Yazıyı Oku
                    </Button>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="p-8 bg-gradient-to-r from-white/80 to-purple-50/80 backdrop-blur-sm border-2 border-white/50">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Kişisel Gelişim Yolculuğunuza Başlayın
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Blog yazılarımızdan ilham alın, pratik ipuçlarını uygulayın ve 
              kişisel dönüşümünüzü hızlandırmak için profesyonel destek alın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4"
              >
                Ücretsiz Danışma Al
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 px-8 py-4"
              >
                Tüm Yazıları Gör
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default BlogHero
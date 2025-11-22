'use client'

import React, { useState } from 'react'
import { Heart, Brain, Compass, Sparkles, User, TrendingUp, BookOpen, Filter } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const BlogCategories = () => {
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = [
    {
      id: 'all',
      name: 'Tüm Yazılar',
      icon: BookOpen,
      count: 150,
      color: 'from-gray-500 to-gray-600',
      description: 'Tüm blog yazılarını görüntüle'
    },
    {
      id: 'duygu-temizligi',
      name: 'Duygu Temizliği',
      icon: Heart,
      count: 45,
      color: 'from-red-500 to-pink-500',
      description: 'Bilinçaltı temizliği ve duygu işleme teknikleri'
    },
    {
      id: 'travma-iyilestirme',
      name: 'Travma İyileştirme',
      icon: Brain,
      count: 32,
      color: 'from-purple-500 to-indigo-500',
      description: 'Travma iyileştirme süreçleri ve teknikler'
    },
    {
      id: 'yasam-koclugu',
      name: 'Yaşam Koçluğu',
      icon: Compass,
      count: 38,
      color: 'from-blue-500 to-cyan-500',
      description: 'Hedef belirleme ve yaşam dengesi'
    },
    {
      id: 'holistik-yaklasim',
      name: 'Holistik Yaklaşım',
      icon: Sparkles,
      count: 25,
      color: 'from-emerald-500 to-teal-500',
      description: 'Bütüncül sağlık ve iyileşme yöntemleri'
    },
    {
      id: 'kisisel-gelisim',
      name: 'Kişisel Gelişim',
      icon: User,
      count: 42,
      color: 'from-orange-500 to-red-500',
      description: 'Kişisel gelişim ve motivasyon'
    }
  ]

  const popularTopics = [
    { name: 'Mindfulness', count: 28 },
    { name: 'İç Huzur', count: 35 },
    { name: 'Stres Yönetimi', count: 22 },
    { name: 'Özgüven', count: 31 },
    { name: 'İlişkiler', count: 19 },
    { name: 'Motivasyon', count: 26 },
    { name: 'Meditasyon', count: 18 },
    { name: 'Enerji Temizliği', count: 15 }
  ]

  const trendingPosts = [
    {
      title: 'Günlük Duygu Temizliği Rutini',
      category: 'Duygu Temizliği',
      views: '2.5K',
      trend: '+15%'
    },
    {
      title: 'Travma Sonrası Büyüme',
      category: 'Travma İyileştirme',
      views: '1.8K',
      trend: '+22%'
    },
    {
      title: '2024 Hedeflerinizi Belirleyin',
      category: 'Yaşam Koçluğu',
      views: '3.1K',
      trend: '+8%'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            Kategoriler
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
              İlgi Alanınızı Seçin
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Size en uygun içerikleri bulmak için kategorileri keşfedin. 
            Her kategori uzman görüşleri ve pratik ipuçları içerir.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {categories.map((category) => {
            const IconComponent = category.icon
            const isActive = activeCategory === category.id
            
            return (
              <Card 
                key={category.id} 
                className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
                  isActive 
                    ? 'ring-2 ring-purple-400 shadow-lg scale-105' 
                    : 'hover:shadow-lg border border-gray-200'
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center justify-center space-x-2">
                    <Badge 
                      className={`${
                        isActive 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {category.count} yazı
                    </Badge>
                  </div>
                  
                  {isActive && (
                    <div className="mt-4">
                      <Button 
                        size="sm" 
                        className={`bg-gradient-to-r ${category.color} hover:opacity-90 text-white`}
                      >
                        Yazıları Gör
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Popular Topics & Trending */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Popular Topics */}
          <Card className="p-8 bg-white shadow-lg border border-gray-200">
            <div className="flex items-center mb-6">
              <TrendingUp className="w-8 h-8 text-blue-600 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">Popüler Konular</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {popularTopics.map((topic, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-colors"
                >
                  <span className="font-medium text-gray-900">{topic.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {topic.count}
                  </Badge>
                </div>
              ))}
            </div>
            
            <Button 
              variant="outline" 
              className="w-full mt-6 border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              <Filter className="w-4 h-4 mr-2" />
              Tüm Konuları Gör
            </Button>
          </Card>

          {/* Trending Posts */}
          <Card className="p-8 bg-white shadow-lg border border-gray-200">
            <div className="flex items-center mb-6">
              <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">Trend Yazılar</h3>
            </div>
            
            <div className="space-y-4">
              {trendingPosts.map((post, index) => (
                <div 
                  key={index} 
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-300 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 flex-1 pr-2">
                      {post.title}
                    </h4>
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      {post.trend}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {post.category}
                    </Badge>
                    <span className="text-sm text-gray-600">{post.views} görüntülenme</span>
                  </div>
                </div>
              ))}
            </div>
            
            <Button 
              variant="outline" 
              className="w-full mt-6 border-green-300 text-green-700 hover:bg-green-50"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Trend Yazıları Gör
            </Button>
          </Card>
        </div>

        {/* Filter Summary */}
        {activeCategory !== 'all' && (
          <div className="mt-12 text-center">
            <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 inline-block">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-gray-900">Aktif Filtre:</span>
                </div>
                <Badge className="bg-purple-100 text-purple-800">
                  {categories.find(c => c.id === activeCategory)?.name}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setActiveCategory('all')}
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-100"
                >
                  Filtreyi Kaldır
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </section>
  )
}

export default BlogCategories
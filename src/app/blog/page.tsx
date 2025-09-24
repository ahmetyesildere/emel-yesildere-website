import { Metadata } from 'next'
import BlogHero from '@/components/blog/blog-hero'
import BlogGrid from '@/components/blog/blog-grid'
import BlogCategories from '@/components/blog/blog-categories'
import BlogNewsletter from '@/components/blog/blog-newsletter'

export const metadata: Metadata = {
  title: 'Blog - Emel Yeşildere | Duygu Temizliği & Holistik Koçluk',
  description: 'Duygu temizliği, travma iyileştirme, yaşam koçluğu ve kişisel gelişim hakkında faydalı yazılar. Uzman görüşleri ve pratik ipuçları.',
  keywords: 'blog, duygu temizliği, travma iyileştirme, yaşam koçluğu, kişisel gelişim, holistik koçluk, yazılar',
}

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      <BlogHero />
      <BlogCategories />
      <BlogGrid />
      <BlogNewsletter />
    </div>
  )
}
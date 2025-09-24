import { Metadata } from 'next'
import AboutHero from '@/components/about/about-hero'
import AboutStory from '@/components/about/about-story'
import AboutExperience from '@/components/about/about-experience'
import AboutCertifications from '@/components/about/about-certifications'
import AboutApproach from '@/components/about/about-approach'
import AboutCTA from '@/components/about/about-cta'

export const metadata: Metadata = {
  title: 'Hakkımda - Emel Yeşildere | Duygu Temizliği Uzmanı',
  description: 'Duygu temizliği ve travma iyileştirme konusunda 8+ yıl deneyimli uzman Emel Yeşildere hakkında bilgi alın.',
  keywords: 'emel yeşildere, duygu temizliği uzmanı, travma iyileştirme, holistik koç, yaşam koçu',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <AboutHero />
      <AboutStory />
      <AboutExperience />
      <AboutApproach />
      <AboutCertifications />
      <AboutCTA />
    </div>
  )
}
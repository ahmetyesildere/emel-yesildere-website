import { Metadata } from 'next'
import ServicesHero from '@/components/services/services-hero'

import ServiceDetails from '@/components/services/service-details'
import ServiceProcess from '@/components/services/service-process'




export const metadata: Metadata = {
  title: 'Hizmetlerimiz - Emel Yeşildere | Duygu Temizliği & Holistik Koçluk',
  description: 'Duygu temizliği, travma iyileştirme, yaşam koçluğu ve holistik koçluk hizmetleri. Online ve yüz yüze seanslar.',
  keywords: 'duygu temizliği, travma iyileştirme, yaşam koçluğu, holistik koçluk, online seans, terapi',
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <ServicesHero />

      <ServiceDetails />
      <ServiceProcess />



    </div>
  )
}
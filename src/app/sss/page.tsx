import { Metadata } from 'next'
import ServicesFAQ from '@/components/services/services-faq'

export const metadata: Metadata = {
  title: 'Sık Sorulan Sorular - Emel Yeşildere | SSS',
  description: 'Hizmetlerimiz, seanslar ve süreçler hakkında sık sorulan sorular ve yanıtları.',
  keywords: 'sss, sık sorulan sorular, duygu temizliği, yaşam koçluğu, holistik koçluk, nefes koçluğu',
}

export default function SSSPage() {
  return (
    <div className="min-h-screen">
      <ServicesFAQ />
    </div>
  )
}
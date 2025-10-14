import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Hakkımda - Emel Yeşildere | Duygu Temizliği Uzmanı',
  description: 'Yaşam koçluğu ve holistik koçluk konusunda 3+ yıl deneyimli uzman Emel Yeşildere hakkında bilgi alın.',
  keywords: 'emel yeşildere, yaşam koçu, holistik koç, nefes koçu, bilinçaltı temizliği uzmanı',
  openGraph: {
    title: 'Hakkımda - Emel Yeşildere | Duygu Temizliği Uzmanı',
    description: 'Yaşam koçluğu ve holistik koçluk konusunda 3+ yıl deneyimli uzman Emel Yeşildere hakkında bilgi alın.',
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
import { Metadata } from 'next'

export const siteConfig = {
  name: 'Emel Yeşildere - Duygu Temizliği ve Yaşam Koçluğu',
  description: 'Duygu temizliği, yaşam koçluğu ve kişisel gelişim hizmetleri. Online ve yüz yüze seanslar. Bandırma, Balıkesir.',
  url: 'https://emelyesildere.com',
  ogImage: '/og-image.jpg',
  keywords: [
    'duygu temizliği',
    'yaşam koçluğu',
    'kişisel gelişim',
    'psikolojik danışmanlık',
    'online terapi',
    'Bandırma psikolog',
    'Balıkesir yaşam koçu',
    'travma iyileştirme',
    'stres yönetimi',
    'ilişki koçluğu',
    'kariyer koçluğu',
    'Emel Yeşildere'
  ],
  authors: [
    {
      name: 'Emel Yeşildere',
      url: 'https://emelyesildere.com'
    }
  ],
  creator: 'Emel Yeşildere',
  publisher: 'Emel Yeşildere',
  locale: 'tr_TR',
  type: 'website'
}

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  publisher: siteConfig.publisher,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@emelyesildere'
  },
  alternates: {
    canonical: siteConfig.url
  },
  verification: {
    google: 'google-site-verification-code', // Google Search Console'dan alacaksınız
    yandex: 'yandex-verification-code' // Yandex Webmaster'dan alacaksınız
  }
}

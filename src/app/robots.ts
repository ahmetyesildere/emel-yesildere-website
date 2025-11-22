import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/consultant/',
          '/client/',
          '/settings/',
          '/profile/',
          '/debug/',
          '/test-*'
        ],
      },
    ],
    sitemap: 'https://emelyesildere.com/sitemap.xml',
  }
}

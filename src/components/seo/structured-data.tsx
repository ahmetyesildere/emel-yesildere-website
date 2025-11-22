'use client'

export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://emelyesildere.com",
    "name": "Emel Yeşildere - Duygu Temizliği & Yaşam Koçluğu",
    "image": "https://emelyesildere.com/og-image.jpg",
    "description": "Duygu temizliği ve travma iyileştirme uzmanı. Online ve yüz yüze seanslar.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Günaydın Mahallesi",
      "addressLocality": "Bandırma",
      "addressRegion": "Balıkesir",
      "postalCode": "10200",
      "addressCountry": "TR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 40.3520,
      "longitude": 27.9770
    },
    "url": "https://emelyesildere.com",
    "telephone": "+90-266-714-1234",
    "email": "info@emelyesildere.com",
    "priceRange": "₺₺",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "10:00",
        "closes": "16:00"
      }
    ],
    "sameAs": [
      "https://www.instagram.com/emelyesildere",
      "https://www.facebook.com/emelyesildere",
      "https://www.linkedin.com/in/emelyesildere"
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function PersonSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Emel Yeşildere",
    "url": "https://emelyesildere.com",
    "image": "https://emelyesildere.com/emel-yesildere.jpg",
    "jobTitle": "Duygu Temizliği Uzmanı & Yaşam Koçu",
    "worksFor": {
      "@type": "Organization",
      "name": "Emel Yeşildere Danışmanlık"
    },
    "sameAs": [
      "https://www.instagram.com/emelyesildere",
      "https://www.facebook.com/emelyesildere",
      "https://www.linkedin.com/in/emelyesildere"
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Emel Yeşildere",
    "url": "https://emelyesildere.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://emelyesildere.com/blog?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

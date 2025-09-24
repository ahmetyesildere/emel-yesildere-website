import { Metadata } from 'next'
import ContactHero from '@/components/contact/contact-hero'
import ContactForm from '@/components/contact/contact-form'
import ContactInfo from '@/components/contact/contact-info'
import ContactMap from '@/components/contact/contact-map'
import ContactFAQ from '@/components/contact/contact-faq'

export const metadata: Metadata = {
  title: 'İletişim - Emel Yeşildere | Duygu Temizliği & Holistik Koçluk',
  description: 'Emel Yeşildere ile iletişime geçin. Randevu almak, sorularınızı sormak için bize ulaşın. Online ve yüz yüze seanslar.',
  keywords: 'iletişim, randevu, emel yeşildere, duygu temizliği, holistik koçluk, istanbul',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <ContactHero />
      <ContactForm />
      <ContactInfo />
      <ContactMap />
      <ContactFAQ />
    </div>
  )
}
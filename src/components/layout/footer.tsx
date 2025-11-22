'use client'

import React from 'react'
import Link from 'next/link'
import { Facebook, Instagram, Mail, Phone, MapPin, Heart } from 'lucide-react'
import Logo from '@/components/ui/logo'
import { useContactInfo } from '@/hooks/use-contact-info'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const { contactInfo, formatPhoneNumber, isLoading: contactLoading } = useContactInfo()

  const quickLinks = [
    { name: 'Ana Sayfa', href: '/' },
    { name: 'Hakkımda', href: '/hakkimda' },
    { name: 'Hizmetlerimiz', href: '/hizmetlerimiz' },
    { name: 'Blog', href: '/blog' },
    { name: 'İletişim', href: '/iletisim' },
    { name: 'SSS', href: '/sss' },
  ]

  const services = [
    { name: 'Yaşam Koçluğu', href: '/hizmetlerimiz#yasam-koclugu' },
    { name: 'Holistik Koçluk', href: '/hizmetlerimiz#holistik-kocluk' },
    { name: 'Nefes Koçluğu', href: '/hizmetlerimiz#nefes-koclugu' },
    { name: 'Bilinçaltı Temizliği', href: '/hizmetlerimiz#bilincalti-temizligi' },
    { name: 'Tüm Hizmetler', href: '/hizmetlerimiz' },
  ]

  const legalLinks = [
    { name: 'Gizlilik Politikası', href: '/gizlilik-politikasi' },
    { name: 'Kullanım Şartları', href: '/kullanim-sartlari' },
    { name: 'Çerez Politikası', href: '/cerez-politikasi' },
    { name: 'KVKK', href: '/kvkk' },
  ]

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Logo size="sm" className="filter brightness-0 invert" />
            </div>
            <p className="text-gray-300 mb-4 text-sm leading-relaxed">
              Duygu temizliği ve holistik koçluk hizmetleri ile kişisel dönüşüm yolculuğunuzda yanınızdayım.
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-3">
              <a
                href="https://instagram.com/emelyesildere"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com/emelyesildere"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${contactInfo.email}`}
                className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-white">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-white">Hizmetlerimiz</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    href={service.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-white">İletişim</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <p className="text-gray-300 text-sm">{formatPhoneNumber(contactInfo.phone)}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-green-400 flex-shrink-0" />
                <p className="text-gray-300 text-sm">{contactInfo.email}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-red-400 flex-shrink-0" />
                <p className="text-gray-300 text-sm">Bandırma, Balıkesir</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-4 text-xs text-gray-400">
              <p>© {currentYear} Emel Yeşildere. Tüm hakları saklıdır.</p>
              <div className="flex items-center space-x-1">
                <span>Made with</span>
                <Heart className="h-3 w-3 text-red-500 fill-current" />
                <span>by Ahmet Yeşildere</span>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-end space-x-4 text-xs">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
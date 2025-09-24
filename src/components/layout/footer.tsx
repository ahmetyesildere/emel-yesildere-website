'use client'

import React from 'react'
import Link from 'next/link'
import { Facebook, Instagram, Mail, Phone, MapPin, Heart } from 'lucide-react'
import Logo from '@/components/ui/logo'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: 'Ana Sayfa', href: '/' },
    { name: 'Hakkımda', href: '/hakkimda' },
    { name: 'Hizmetlerimiz', href: '/hizmetlerimiz' },
    { name: 'Blog', href: '/blog' },
    { name: 'İletişim', href: '/iletisim' },
    { name: 'SSS', href: '/sss' },
  ]

  const services = [
    { name: 'Duygu Temizliği', href: '/hizmetlerimiz/duygu-temizligi' },
    { name: 'Travma İyileştirme', href: '/hizmetlerimiz/travma-iyilestirme' },
    { name: 'Yaşam Koçluğu', href: '/hizmetlerimiz/yasam-koclugu' },
    { name: 'Holistik Koçluk', href: '/hizmetlerimiz/holistik-kocluk' },
    { name: 'Online Seanslar', href: '/hizmetlerimiz/online-seanslar' },
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
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <Logo size="md" className="filter brightness-0 invert" />
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Duygu temizliği ve travma iyileştirme konusunda uzman. 
              Holistik yaklaşımla kişisel dönüşüm ve iyileşme yolculuğunuzda yanınızdayım.
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-4">
              <a
                href="https://instagram.com/emelyesildere"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com/emelyesildere"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="mailto:emel@emelyesildere.com"
                className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Hızlı Bağlantılar</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 transform duration-200 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Hizmetlerimiz</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    href={service.href}
                    className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 transform duration-200 inline-block"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">İletişim</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">+90 555 123 4567</p>
                  <p className="text-sm text-gray-400">Pazartesi - Cuma: 09:00 - 18:00</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">emel@emelyesildere.com</p>
                  <p className="text-sm text-gray-400">24 saat içinde yanıt</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-red-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">İstanbul, Türkiye</p>
                  <p className="text-sm text-gray-400">Online ve yüz yüze seanslar</p>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-8">
              <h4 className="text-md font-medium mb-3 text-white">Bülten Aboneliği</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="E-posta adresiniz"
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-l-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-r-md hover:from-blue-700 hover:to-purple-700 transition-colors">
                  Abone Ol
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Yeni yazılar ve özel içeriklerden haberdar olun.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-400">
              <p className="flex items-center">
                © {currentYear} Emel Yeşildere. Tüm hakları saklıdır.
              </p>
              <div className="flex items-center space-x-1">
                <span>Made with</span>
                <Heart className="h-4 w-4 text-red-500 fill-current" />
                <span>by Ahmet Yeşildere</span>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
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
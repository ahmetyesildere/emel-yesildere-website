'use client'

import React from 'react'
import { MapPin, Navigation, Car, Train, Bus, Clock, Phone, Calendar } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const ContactMap = () => {
  const transportOptions = [
    {
      icon: Train,
      type: 'Metro',
      details: 'M2 Vezneciler İstasyonu',
      walkTime: '5 dakika yürüyüş',
      color: 'text-blue-600'
    },
    {
      icon: Bus,
      type: 'Otobüs',
      details: 'Eminönü - Beyazıt durağı',
      walkTime: '3 dakika yürüyüş',
      color: 'text-green-600'
    },
    {
      icon: Car,
      type: 'Araç',
      details: 'Yakın otopark mevcut',
      walkTime: 'Ücretli park alanları',
      color: 'text-purple-600'
    }
  ]

  const nearbyLandmarks = [
    { name: 'Kapalıçarşı', distance: '200m', icon: '🏛️' },
    { name: 'Beyazıt Camii', distance: '150m', icon: '🕌' },
    { name: 'İstanbul Üniversitesi', distance: '300m', icon: '🎓' },
    { name: 'Eminönü', distance: '500m', icon: '⛵' }
  ]

  const officeFeatures = [
    { feature: 'Klimalı Ortam', icon: '❄️' },
    { feature: 'Sessiz Odalar', icon: '🔇' },
    { feature: 'Rahat Oturma', icon: '🪑' },
    { feature: 'Çay/Kahve', icon: '☕' },
    { feature: 'WiFi', icon: '📶' },
    { feature: 'Engelsiz Erişim', icon: '♿' }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            Lokasyon
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
              Bizi Nasıl Bulursunuz?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Yüz yüze seanslar için merkezi lokasyondaki ofisimize kolayca ulaşabilirsiniz. 
            Detaylı yol tarifi ve ulaşım seçenekleri aşağıda.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Map Section */}
          <div>
            <Card className="overflow-hidden shadow-xl border-2 border-gray-200">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative">
                {/* Mock Map */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
                  <div className="absolute inset-4 bg-white/80 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Emel Yeşildere Ofis</h3>
                      <p className="text-gray-600 mb-4">İstanbul, Türkiye</p>
                      <p className="text-sm text-gray-500 mb-4">
                        Detaylı adres randevu alırken paylaşılacaktır
                      </p>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Navigation className="w-4 h-4 mr-2" />
                        Yol Tarifi Al
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Address Info */}
            <Card className="mt-6 p-6 bg-white shadow-lg border border-gray-200">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ofis Adresi</h3>
                  <p className="text-gray-600 mb-2">
                    Merkezi lokasyon, İstanbul
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Güvenlik nedeniyle tam adres randevu alırken SMS ile gönderilir
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-green-600">
                    <Clock className="w-4 h-4" />
                    <span>Randevu saatinden 15 dakika önce adres bilgisi gönderilir</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Location Details */}
          <div className="space-y-6">
            {/* Transportation */}
            <Card className="p-6 bg-white shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Navigation className="w-6 h-6 mr-3 text-blue-600" />
                Ulaşım Seçenekleri
              </h3>
              
              <div className="space-y-4">
                {transportOptions.map((transport, index) => {
                  const IconComponent = transport.icon
                  return (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <IconComponent className={`w-8 h-8 ${transport.color}`} />
                      <div>
                        <h4 className="font-semibold text-gray-900">{transport.type}</h4>
                        <p className="text-gray-600 text-sm">{transport.details}</p>
                        <p className="text-gray-500 text-xs">{transport.walkTime}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* Nearby Landmarks */}
            <Card className="p-6 bg-white shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Yakın Yerler</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {nearbyLandmarks.map((landmark, index) => (
                  <div key={index} className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-2xl mb-2">{landmark.icon}</div>
                    <h4 className="font-medium text-gray-900 text-sm">{landmark.name}</h4>
                    <p className="text-blue-600 text-xs font-semibold">{landmark.distance}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Office Features */}
            <Card className="p-6 bg-white shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Ofis Özellikleri</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {officeFeatures.map((feature, index) => (
                  <div key={index} className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-xl mb-2">{feature.icon}</div>
                    <p className="text-gray-700 text-sm font-medium">{feature.feature}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Contact for Directions */}
            <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
              <div className="text-center">
                <Phone className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Yol Tarifi İçin Arayın
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Ofisimizi bulmakta zorlanırsanız bizi arayın, 
                  size yol tarifi verelim.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <Phone className="w-4 h-4 mr-2" />
                    Hemen Ara
                  </Button>
                  <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
                    <Calendar className="w-4 h-4 mr-2" />
                    Randevu Al
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Online Alternative */}
        <div className="mt-20">
          <Card className="p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
            <h3 className="text-3xl font-bold mb-4">
              Ofise Gelemiyorsanız?
            </h3>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Tüm hizmetlerimiz online olarak da sunulmaktadır. 
              Evinizin rahatlığında, aynı kalitede hizmet alabilirsiniz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
              >
                💻 Online Seans Al
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold"
              >
                📹 Video Konferans Bilgisi
              </Button>
            </div>
            
            <div className="mt-8 text-white/80 text-sm">
              <p>Online seanslar için sadece internet bağlantısı ve kamera gereklidir</p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default ContactMap
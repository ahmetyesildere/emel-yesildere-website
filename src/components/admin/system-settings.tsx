'use client'

import React, { useState } from 'react'
import { 
  Settings, Shield, Mail, Phone, MapPin, Clock, 
  Globe, Database, Key, Bell, Palette, Monitor,
  Save, RefreshCw, Download, Upload, AlertTriangle,
  CheckCircle, XCircle, Info, Zap, Lock
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const SystemSettings = () => {
  const [activeSettingsTab, setActiveSettingsTab] = useState('general')

  const settingsTabs = [
    { id: 'general', label: 'Genel', icon: Settings },
    { id: 'contact', label: 'İletişim', icon: Phone },
    { id: 'notifications', label: 'Bildirimler', icon: Bell },
    { id: 'security', label: 'Güvenlik', icon: Shield },
    { id: 'integrations', label: 'Entegrasyonlar', icon: Zap },
    { id: 'backup', label: 'Yedekleme', icon: Database }
  ]

  const systemStatus = [
    { service: 'Website', status: 'active', uptime: '99.9%', lastCheck: '2 dakika önce' },
    { service: 'Veritabanı', status: 'active', uptime: '99.8%', lastCheck: '1 dakika önce' },
    { service: 'E-posta Servisi', status: 'active', uptime: '99.7%', lastCheck: '3 dakika önce' },
    { service: 'Yedekleme', status: 'warning', uptime: '98.5%', lastCheck: '1 saat önce' },
    { service: 'SSL Sertifikası', status: 'active', uptime: '100%', lastCheck: '5 dakika önce' }
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Aktif', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      warning: { label: 'Uyarı', color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle },
      error: { label: 'Hata', color: 'bg-red-100 text-red-800', icon: XCircle },
      maintenance: { label: 'Bakım', color: 'bg-blue-100 text-blue-800', icon: Settings }
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    const IconComponent = config.icon
    return (
      <div className="flex items-center space-x-1">
        <IconComponent className="w-3 h-3" />
        <Badge className={config.color}>{config.label}</Badge>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sistem Ayarları</h2>
          <p className="text-gray-600">Sistem yapılandırması ve güvenlik ayarları</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Yenile
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" />
            Ayarları Kaydet
          </Button>
        </div>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Monitor className="w-5 h-5 mr-2 text-blue-600" />
            Sistem Durumu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {systemStatus.map((service, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 text-sm">{service.service}</h4>
                  {getStatusBadge(service.status)}
                </div>
                <div className="space-y-1 text-xs text-gray-600">
                  <p>Uptime: {service.uptime}</p>
                  <p>Son kontrol: {service.lastCheck}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Settings Tabs */}
      <Tabs value={activeSettingsTab} onValueChange={setActiveSettingsTab}>
        <TabsList className="grid w-full grid-cols-6">
          {settingsTabs.map((tab) => {
            const IconComponent = tab.icon
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center space-x-2"
              >
                <IconComponent className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Genel Ayarlar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site Adı</label>
                  <Input defaultValue="Emel Yeşildere" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site URL</label>
                  <Input defaultValue="https://emelyesildere.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site Açıklaması</label>
                <Textarea 
                  defaultValue="Duygu temizliği ve holistik koçluk uzmanı. İç huzurunuzu bulun, yaşamınızı dönüştürün."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dil</label>
                  <Select defaultValue="tr">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tr">Türkçe</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Zaman Dilimi</label>
                  <Select defaultValue="europe/istanbul">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="europe/istanbul">Europe/Istanbul</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Para Birimi</label>
                  <Select defaultValue="TRY">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TRY">Türk Lirası (₺)</SelectItem>
                      <SelectItem value="USD">US Dollar ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tarih Formatı</label>
                  <Select defaultValue="dd/mm/yyyy">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bakım Modu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Bakım Modu</h4>
                    <p className="text-sm text-yellow-700">Site ziyaretçilere kapalı, sadece admin erişimi</p>
                  </div>
                </div>
                <Button variant="outline" className="border-yellow-300 text-yellow-700">
                  Etkinleştir
                </Button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bakım Mesajı</label>
                <Textarea 
                  defaultValue="Site şu anda bakım modunda. Lütfen daha sonra tekrar deneyin."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Settings */}
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>İletişim Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cep Telefonu</label>
                  <Input defaultValue="+90 (555) 123 45 67" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sabit Telefon</label>
                  <Input defaultValue="+90 (212) 456 78 90" placeholder="+90 (xxx) xxx xx xx" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                  <Input defaultValue="+90 (555) 123 45 67" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Acil Durum Telefonu</label>
                  <Input placeholder="+90 (xxx) xxx xx xx" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                  <Input defaultValue="emel@emelyesildere.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Randevu E-postası</label>
                  <Input defaultValue="randevu@emelyesildere.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adres</label>
                <Textarea 
                  defaultValue="Bandırma, Balıkesir"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Çalışma Saatleri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'].map((day, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 items-center">
                  <div className="font-medium text-gray-900">{day}</div>
                  <Input defaultValue={index < 5 ? "09:00" : index === 5 ? "10:00" : ""} placeholder="Başlangıç" />
                  <Input defaultValue={index < 5 ? "18:00" : index === 5 ? "16:00" : ""} placeholder="Bitiş" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sosyal Medya</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                  <Input defaultValue="https://instagram.com/emelyesildere" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                  <Input defaultValue="https://facebook.com/emelyesildere" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                  <Input defaultValue="https://linkedin.com/in/emelyesildere" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">YouTube</label>
                  <Input placeholder="YouTube kanalı URL" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>E-posta Bildirimleri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Yeni randevu talebi', description: 'Yeni randevu talepleri için bildirim al' },
                { label: 'İletişim mesajları', description: 'Yeni iletişim mesajları için bildirim al' },
                { label: 'Ödeme bildirimleri', description: 'Ödeme işlemleri için bildirim al' },
                { label: 'Blog yorumları', description: 'Yeni blog yorumları için bildirim al' },
                { label: 'Sistem uyarıları', description: 'Sistem hataları ve uyarıları için bildirim al' }
              ].map((notification, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{notification.label}</h4>
                    <p className="text-sm text-gray-600">{notification.description}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Aktif
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>WhatsApp Bildirimleri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <Phone className="w-6 h-6 text-green-600" />
                  <div>
                    <h4 className="font-medium text-green-800">WhatsApp Entegrasyonu</h4>
                    <p className="text-sm text-green-700">WhatsApp Business API ile bildirim gönder</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Input placeholder="WhatsApp Business API Token" />
                  <Button className="bg-green-600 hover:bg-green-700">
                    Bağlantıyı Test Et
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Güvenlik Ayarları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <Lock className="w-6 h-6 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-blue-800">İki Faktörlü Kimlik Doğrulama</h4>
                    <p className="text-sm text-blue-700">Hesap güvenliği için 2FA etkinleştir</p>
                  </div>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  2FA Etkinleştir
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Oturum Süresi (dakika)</label>
                  <Input defaultValue="60" type="number" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maksimum Giriş Denemesi</label>
                  <Input defaultValue="5" type="number" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">IP Kısıtlaması</label>
                <Textarea 
                  placeholder="İzin verilen IP adresleri (her satırda bir tane)"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SSL Sertifikası</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <h4 className="font-medium text-green-800">SSL Aktif</h4>
                    <p className="text-sm text-green-700">Sertifika geçerli, son kullanma: 15.12.2024</p>
                  </div>
                </div>
                <Button variant="outline" className="border-green-300 text-green-700">
                  Yenile
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Settings */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ödeme Entegrasyonları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">Stripe</h4>
                    <p className="text-sm text-gray-600">Kredi kartı ödemeleri</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Aktif</Badge>
                </div>
                <div className="space-y-2">
                  <Input placeholder="Stripe Publishable Key" />
                  <Input placeholder="Stripe Secret Key" type="password" />
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">PayPal</h4>
                    <p className="text-sm text-gray-600">PayPal ödemeleri</p>
                  </div>
                  <Badge className="bg-gray-100 text-gray-800">Pasif</Badge>
                </div>
                <div className="space-y-2">
                  <Input placeholder="PayPal Client ID" />
                  <Input placeholder="PayPal Client Secret" type="password" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>E-posta Servisi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Sunucu</label>
                  <Input defaultValue="smtp.gmail.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Port</label>
                  <Input defaultValue="587" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kullanıcı Adı</label>
                  <Input defaultValue="emel@emelyesildere.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Şifre</label>
                  <Input type="password" />
                </div>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Bağlantıyı Test Et
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup Settings */}
        <TabsContent value="backup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Otomatik Yedekleme</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Yedekleme Sıklığı</label>
                  <Select defaultValue="daily">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Saatlik</SelectItem>
                      <SelectItem value="daily">Günlük</SelectItem>
                      <SelectItem value="weekly">Haftalık</SelectItem>
                      <SelectItem value="monthly">Aylık</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Yedek Saklama Süresi</label>
                  <Select defaultValue="30">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 Gün</SelectItem>
                      <SelectItem value="30">30 Gün</SelectItem>
                      <SelectItem value="90">90 Gün</SelectItem>
                      <SelectItem value="365">1 Yıl</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Download className="w-4 h-4 mr-2" />
                  Manuel Yedek Al
                </Button>
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Yedek Geri Yükle
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Son Yedekler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { date: '2024-07-25 03:00', size: '45.2 MB', type: 'Otomatik', status: 'success' },
                  { date: '2024-07-24 03:00', size: '44.8 MB', type: 'Otomatik', status: 'success' },
                  { date: '2024-07-23 15:30', size: '44.5 MB', type: 'Manuel', status: 'success' },
                  { date: '2024-07-23 03:00', size: '44.1 MB', type: 'Otomatik', status: 'success' },
                  { date: '2024-07-22 03:00', size: '43.9 MB', type: 'Otomatik', status: 'failed' }
                ].map((backup, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Database className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium text-gray-900">{backup.date}</div>
                        <div className="text-sm text-gray-600">{backup.size} - {backup.type}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(backup.status === 'success' ? 'active' : 'error')}
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SystemSettings
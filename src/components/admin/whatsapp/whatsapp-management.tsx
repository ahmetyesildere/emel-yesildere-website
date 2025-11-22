'use client'

import React, { useState } from 'react'
import { 
  MessageCircle, 
  Save, 
  Phone, 
  Clock, 
  Settings, 
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Copy,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useWhatsApp } from '@/hooks/use-whatsapp'

const WhatsAppManagement = () => {
  const { config, updateConfig, createWhatsAppLink, isWorkingHours, formatPhoneNumber, isLoading } = useWhatsApp()
  
  const [formData, setFormData] = useState({
    phoneNumber: config.phoneNumber,
    isActive: config.isActive,
    businessName: config.businessName,
    welcomeMessage: config.welcomeMessage,
    templates: { ...config.templates },
    workingHours: { ...config.workingHours },
    autoReply: { ...config.autoReply }
  })

  const [previewMode, setPreviewMode] = useState(false)

  const handleSave = async () => {
    const result = await updateConfig(formData)
    if (result.success) {
      alert('WhatsApp ayarları güncellendi!')
    } else {
      alert(result.error || 'Güncelleme sırasında hata oluştu')
    }
  }

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value)
    setFormData({ ...formData, phoneNumber: formatted })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Panoya kopyalandı!')
  }

  const testWhatsAppLink = (templateType: keyof typeof config.templates) => {
    const link = createWhatsAppLink(templateType)
    if (link !== '#') {
      window.open(link, '_blank')
    }
  }

  const workingDayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">WhatsApp Yönetimi</h2>
          <p className="text-gray-600">WhatsApp iletişim ayarlarını yönetin</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center space-x-2"
          >
            {previewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{previewMode ? 'Düzenleme' : 'Önizleme'}</span>
          </Button>
          <Badge variant={config.isActive ? 'default' : 'secondary'}>
            {config.isActive ? 'Aktif' : 'Pasif'}
          </Badge>
          <Badge variant={isWorkingHours() ? 'default' : 'secondary'}>
            {isWorkingHours() ? 'Online' : 'Offline'}
          </Badge>
        </div>
      </div>

      {previewMode ? (
        /* Preview Mode */
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp Önizleme</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Test Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(config.templates).map(([key, template]) => (
                <Card key={key} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium capitalize">{key}</h4>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => testWhatsAppLink(key as keyof typeof config.templates)}
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Test Et
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{template}</p>
                </Card>
              ))}
            </div>

            {/* Current Status */}
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">Mevcut Durum</span>
              </div>
              <div className="space-y-1 text-sm text-green-700">
                <p>Telefon: {config.phoneNumber}</p>
                <p>Durum: {config.isActive ? 'Aktif' : 'Pasif'}</p>
                <p>Çalışma Saatleri: {config.workingHours.enabled ? `${config.workingHours.start} - ${config.workingHours.end}` : 'Devre Dışı'}</p>
                <p>Şu Anda: {isWorkingHours() ? 'Online' : 'Offline'}</p>
              </div>
            </Card>
          </CardContent>
        </Card>
      ) : (
        /* Edit Mode */
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">Genel</TabsTrigger>
            <TabsTrigger value="templates">Şablonlar</TabsTrigger>
            <TabsTrigger value="hours">Çalışma Saatleri</TabsTrigger>
            <TabsTrigger value="auto-reply">Otomatik Yanıt</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Genel Ayarlar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp Telefon Numarası
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="+90 555 123 45 67"
                    />
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(formData.phoneNumber)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İşletme Adı
                  </label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Emel Yeşildere"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Karşılama Mesajı
                  </label>
                  <textarea
                    value={formData.welcomeMessage}
                    onChange={(e) => setFormData({...formData, welcomeMessage: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Merhaba! Size nasıl yardımcı olabilirim? 😊"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    WhatsApp desteğini aktif et
                  </label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mesaj Şablonları</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(formData.templates).map(([key, template]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {key === 'consultation' && 'Ön Görüşme Şablonu'}
                      {key === 'serviceInquiry' && 'Hizmet Bilgisi Şablonu'}
                      {key === 'general' && 'Genel Mesaj Şablonu'}
                      {key === 'appointment' && 'Randevu Şablonu'}
                    </label>
                    <textarea
                      value={template}
                      onChange={(e) => setFormData({
                        ...formData,
                        templates: { ...formData.templates, [key]: e.target.value }
                      })}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {key === 'serviceInquiry' || key === 'appointment' ? '{serviceName} kullanarak hizmet adını ekleyebilirsiniz' : ''}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hours" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Çalışma Saatleri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="workingHoursEnabled"
                    checked={formData.workingHours.enabled}
                    onChange={(e) => setFormData({
                      ...formData,
                      workingHours: { ...formData.workingHours, enabled: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor="workingHoursEnabled" className="text-sm font-medium text-gray-700">
                    Çalışma saatleri kontrolünü aktif et
                  </label>
                </div>

                {formData.workingHours.enabled && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Başlangıç Saati
                        </label>
                        <input
                          type="time"
                          value={formData.workingHours.start}
                          onChange={(e) => setFormData({
                            ...formData,
                            workingHours: { ...formData.workingHours, start: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bitiş Saati
                        </label>
                        <input
                          type="time"
                          value={formData.workingHours.end}
                          onChange={(e) => setFormData({
                            ...formData,
                            workingHours: { ...formData.workingHours, end: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Çalışma Günleri
                      </label>
                      <div className="grid grid-cols-7 gap-2">
                        {workingDayNames.map((day, index) => (
                          <label key={index} className="flex items-center space-x-1 text-sm">
                            <input
                              type="checkbox"
                              checked={formData.workingHours.workingDays.includes(index)}
                              onChange={(e) => {
                                const days = [...formData.workingHours.workingDays]
                                if (e.target.checked) {
                                  days.push(index)
                                } else {
                                  const dayIndex = days.indexOf(index)
                                  if (dayIndex > -1) days.splice(dayIndex, 1)
                                }
                                setFormData({
                                  ...formData,
                                  workingHours: { ...formData.workingHours, workingDays: days }
                                })
                              }}
                              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                            />
                            <span>{day.slice(0, 3)}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="auto-reply" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Otomatik Yanıt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="autoReplyEnabled"
                    checked={formData.autoReply.enabled}
                    onChange={(e) => setFormData({
                      ...formData,
                      autoReply: { ...formData.autoReply, enabled: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor="autoReplyEnabled" className="text-sm font-medium text-gray-700">
                    Otomatik yanıtı aktif et
                  </label>
                </div>

                {formData.autoReply.enabled && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Çalışma Saatleri İçi Mesajı
                      </label>
                      <textarea
                        value={formData.autoReply.message}
                        onChange={(e) => setFormData({
                          ...formData,
                          autoReply: { ...formData.autoReply, message: e.target.value }
                        })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Çalışma Saatleri Dışı Mesajı
                      </label>
                      <textarea
                        value={formData.autoReply.outsideHoursMessage}
                        onChange={(e) => setFormData({
                          ...formData,
                          autoReply: { ...formData.autoReply, outsideHoursMessage: e.target.value }
                        })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Save Button */}
      {!previewMode && (
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
          </Button>
        </div>
      )}

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">WhatsApp Entegrasyonu Hakkında:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Telefon numaranızın WhatsApp Business hesabı olması önerilir</li>
                <li>Mesaj şablonları müşterilerin WhatsApp'ta göreceği ön yazılı mesajlardır</li>
                <li>Çalışma saatleri widget'ta online/offline durumunu belirler</li>
                <li>Otomatik yanıt özelliği sadece bilgilendirme amaçlıdır</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default WhatsAppManagement
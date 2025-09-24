'use client'

import React, { useState, useEffect } from 'react'
import {
  Settings, CreditCard, Save, Edit, Plus, Trash2, Eye, EyeOff
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/lib/auth/auth-context'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/toast-provider'

interface PaymentSetting {
  id: string
  method: string
  is_active: boolean
  settings: {
    recipient_name?: string
    bank_name?: string
    iban?: string
    description_template?: string
    commission_rate?: number
    min_amount?: number
    max_amount?: number
  }
  created_at: string
  updated_at: string
}

const PaymentSettings = () => {
  const { user } = useAuth()
  const { success: showSuccess, error: showError } = useToast()

  const [paymentSettings, setPaymentSettings] = useState<PaymentSetting[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showIban, setShowIban] = useState(false)
  const [formData, setFormData] = useState({
    method: 'iban',
    is_active: true,
    recipient_name: '',
    bank_name: '',
    iban: '',
    description_template: 'Danışmanlık Hizmeti - {session_date} {session_time}',
    commission_rate: 0,
    min_amount: 0,
    max_amount: 10000
  })

  useEffect(() => {
    loadPaymentSettings()
  }, [])

  const loadPaymentSettings = async () => {
    setIsLoading(true)
    try {
      console.log('🔍 Ödeme ayarları yükleniyor...')

      const { data, error } = await supabase
        .from('payment_settings')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Payment settings yükleme hatası:', error)
        // Hata durumunda varsayılan ayarları oluştur
        await createDefaultPaymentSettings()
        return
      }

      console.log('✅ Payment settings yüklendi:', data)
      setPaymentSettings(data || [])

      // Eğer hiç ayar yoksa varsayılan oluştur
      if (!data || data.length === 0) {
        await createDefaultPaymentSettings()
      }

    } catch (error) {
      console.error('💥 Ödeme ayarları yüklenirken hata:', error)
      showError('Ödeme ayarları yüklenemedi')
    } finally {
      setIsLoading(false)
    }
  }

  const createDefaultPaymentSettings = async () => {
    try {
      const defaultSettings = {
        method: 'iban',
        is_active: true,
        settings: {
          recipient_name: "Emel Yeşildere",
          bank_name: "Enpara",
          iban: "TR02 0006 0000 2545 4587 02",
          description_template: "Danışmanlık Hizmeti - {session_date} {session_time}",
          commission_rate: 0,
          min_amount: 100,
          max_amount: 10000
        }
      }

      const { data, error } = await supabase
        .from('payment_settings')
        .insert([defaultSettings])
        .select()

      if (error) throw error

      console.log('✅ Varsayılan ödeme ayarları oluşturuldu:', data)
      setPaymentSettings(data || [])
      showSuccess('Varsayılan ödeme ayarları oluşturuldu')

    } catch (error) {
      console.error('💥 Varsayılan ayarlar oluşturulurken hata:', error)
    }
  }

  const savePaymentSettings = async () => {
    try {
      console.log('💾 Ödeme ayarları kaydediliyor...', formData)

      const settingsData = {
        method: formData.method,
        is_active: formData.is_active,
        settings: {
          recipient_name: formData.recipient_name,
          bank_name: formData.bank_name,
          iban: formData.iban,
          description_template: formData.description_template,
          commission_rate: formData.commission_rate,
          min_amount: formData.min_amount,
          max_amount: formData.max_amount
        }
      }

      let result
      if (editingId) {
        // Güncelleme
        result = await supabase
          .from('payment_settings')
          .update(settingsData)
          .eq('id', editingId)
          .select()
      } else {
        // Yeni ekleme
        result = await supabase
          .from('payment_settings')
          .insert([settingsData])
          .select()
      }

      if (result.error) throw result.error

      console.log('✅ Ödeme ayarları kaydedildi:', result.data)
      showSuccess(editingId ? 'Ayarlar güncellendi' : 'Yeni ayar eklendi')
      
      setEditingId(null)
      resetForm()
      loadPaymentSettings()

    } catch (error) {
      console.error('💥 Ödeme ayarları kaydedilirken hata:', error)
      showError('Ayarlar kaydedilemedi')
    }
  }

  const editPaymentSetting = (setting: PaymentSetting) => {
    setEditingId(setting.id)
    setFormData({
      method: setting.method,
      is_active: setting.is_active,
      recipient_name: setting.settings.recipient_name || '',
      bank_name: setting.settings.bank_name || '',
      iban: setting.settings.iban || '',
      description_template: setting.settings.description_template || '',
      commission_rate: setting.settings.commission_rate || 0,
      min_amount: setting.settings.min_amount || 0,
      max_amount: setting.settings.max_amount || 10000
    })
  }

  const deletePaymentSetting = async (id: string) => {
    if (!confirm('Bu ödeme ayarını silmek istediğinizden emin misiniz?')) return

    try {
      const { error } = await supabase
        .from('payment_settings')
        .delete()
        .eq('id', id)

      if (error) throw error

      showSuccess('Ödeme ayarı silindi')
      loadPaymentSettings()

    } catch (error) {
      console.error('💥 Ödeme ayarı silinirken hata:', error)
      showError('Ayar silinemedi')
    }
  }

  const toggleSettingStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('payment_settings')
        .update({ is_active: !currentStatus })
        .eq('id', id)

      if (error) throw error

      showSuccess(`Ayar ${!currentStatus ? 'aktif' : 'pasif'} edildi`)
      loadPaymentSettings()

    } catch (error) {
      console.error('💥 Ayar durumu güncellenirken hata:', error)
      showError('Durum güncellenemedi')
    }
  }

  const resetForm = () => {
    setFormData({
      method: 'iban',
      is_active: true,
      recipient_name: '',
      bank_name: '',
      iban: '',
      description_template: 'Danışmanlık Hizmeti - {session_date} {session_time}',
      commission_rate: 0,
      min_amount: 0,
      max_amount: 10000
    })
  }

  const maskIban = (iban: string) => {
    if (!iban || iban.length < 8) return iban
    return iban.substring(0, 4) + ' **** **** **** ' + iban.substring(iban.length - 4)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Ödeme ayarları yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Ödeme Ayarları</h3>
          <p className="text-gray-600">Ödeme yöntemlerini ve ayarlarını yönetin</p>
        </div>
        <Button onClick={() => setEditingId('new')} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Yeni Ayar
        </Button>
      </div>

      {/* Mevcut Ayarlar */}
      <div className="grid grid-cols-1 gap-6">
        {paymentSettings.map((setting) => (
          <Card key={setting.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-purple-600" />
                  {setting.method.toUpperCase()} Ödeme Ayarları
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge className={setting.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {setting.is_active ? 'Aktif' : 'Pasif'}
                  </Badge>
                  <Switch
                    checked={setting.is_active}
                    onCheckedChange={() => toggleSettingStatus(setting.id, setting.is_active)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700">Alıcı Adı:</p>
                  <p className="text-gray-600">{setting.settings.recipient_name}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Banka:</p>
                  <p className="text-gray-600">{setting.settings.bank_name}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">IBAN:</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-gray-600 font-mono">
                      {showIban ? setting.settings.iban : maskIban(setting.settings.iban || '')}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowIban(!showIban)}
                    >
                      {showIban ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Komisyon Oranı:</p>
                  <p className="text-gray-600">%{setting.settings.commission_rate}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="font-medium text-gray-700">Açıklama Şablonu:</p>
                  <p className="text-gray-600">{setting.settings.description_template}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 mt-4 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => editPaymentSetting(setting)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Düzenle
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deletePaymentSetting(setting.id)}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Sil
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Düzenleme/Ekleme Formu */}
      {editingId && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId === 'new' ? 'Yeni Ödeme Ayarı' : 'Ödeme Ayarını Düzenle'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alıcı Adı Soyadı
                </label>
                <Input
                  value={formData.recipient_name}
                  onChange={(e) => setFormData({...formData, recipient_name: e.target.value})}
                  placeholder="Emel Yeşildere"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Banka Adı
                </label>
                <Input
                  value={formData.bank_name}
                  onChange={(e) => setFormData({...formData, bank_name: e.target.value})}
                  placeholder="Enpara"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IBAN
                </label>
                <Input
                  value={formData.iban}
                  onChange={(e) => setFormData({...formData, iban: e.target.value})}
                  placeholder="TR02 0006 0000 2545 4587 02"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Komisyon Oranı (%)
                </label>
                <Input
                  type="number"
                  value={formData.commission_rate}
                  onChange={(e) => setFormData({...formData, commission_rate: parseFloat(e.target.value) || 0})}
                  placeholder="0"
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                />
                <label className="text-sm font-medium text-gray-700">
                  Aktif
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Açıklama Şablonu
                </label>
                <Textarea
                  value={formData.description_template}
                  onChange={(e) => setFormData({...formData, description_template: e.target.value})}
                  placeholder="Danışmanlık Hizmeti - {session_date} {session_time}"
                  rows={2}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Kullanılabilir değişkenler: {'{session_date}'}, {'{session_time}'}, {'{client_name}'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 mt-6 pt-4 border-t">
              <Button onClick={savePaymentSettings} className="bg-purple-600 hover:bg-purple-700">
                <Save className="w-4 h-4 mr-2" />
                {editingId === 'new' ? 'Kaydet' : 'Güncelle'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditingId(null)
                  resetForm()
                }}
              >
                İptal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default PaymentSettings
'use client'

import React, { useState, useEffect } from 'react'
import { 
  Plus, Edit, Trash2, Save, X, Clock, DollarSign, 
  Monitor, Users, Settings, ChevronUp, ChevronDown
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { useSafeToast } from '@/hooks/use-safe-toast'

interface SessionType {
  id: string
  name: string
  description: string | null
  duration_minutes: number
  price: number
  is_online: boolean
  is_in_person: boolean
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

const SessionTypesManagement = () => {
  const toast = useSafeToast()
  
  const [sessionTypes, setSessionTypes] = useState<SessionType[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [hasDisplayOrder, setHasDisplayOrder] = useState(true) // display_order kolonu var mı?
  
  // Uzmanlık alanları için state
  const [specialtyAreas, setSpecialtyAreas] = useState<string[]>([])
  const [showCustomNameInput, setShowCustomNameInput] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration_minutes: 60,
    price: 0,
    is_online: true,
    is_in_person: true,
    is_active: true
  })

  // Fiyat formatı için state
  const [priceDisplay, setPriceDisplay] = useState('0,00')

  useEffect(() => {
    loadSessionTypes()
    loadSpecialtyAreas()
  }, [])

  const loadSpecialtyAreas = () => {
    try {
      // localStorage'dan sadece özel eklenen seans türü adlarını yükle
      const savedAreas = localStorage.getItem('session_type_names')
      const areas = savedAreas ? JSON.parse(savedAreas) : []
      
      setSpecialtyAreas(areas)
      console.log('📚 Kayıtlı seans türü adları yüklendi:', areas)
    } catch (error) {
      console.error('Seans türü adları yüklenirken hata:', error)
      setSpecialtyAreas([])
    }
  }

  const saveSpecialtyArea = (name: string) => {
    try {
      const trimmedName = name.trim()
      if (!trimmedName) return

      // Mevcut alanları yükle
      const savedAreas = localStorage.getItem('session_type_names')
      const areas = savedAreas ? JSON.parse(savedAreas) : []
      
      // Yeni adı ekle (eğer yoksa)
      if (!areas.includes(trimmedName)) {
        areas.push(trimmedName)
        localStorage.setItem('session_type_names', JSON.stringify(areas))
        setSpecialtyAreas(areas)
        console.log('✅ Yeni seans türü adı kaydedildi:', trimmedName)
        toast.success(`"${trimmedName}" uzmanlık alanı kaydedildi`)
      }
    } catch (error) {
      console.error('Seans türü adı kaydedilirken hata:', error)
    }
  }

  const loadSessionTypes = async () => {
    try {
      // Önce display_order ile dene
      let { data, error } = await supabase
        .from('session_types')
        .select('*')
        .order('display_order', { ascending: true })

      // Eğer display_order kolonu yoksa, alfabetik sırala
      if (error && error.message.includes('display_order')) {
        console.log('⚠️ display_order kolonu bulunamadı, alfabetik sıralama kullanılıyor')
        setHasDisplayOrder(false)
        
        const fallbackResult = await supabase
          .from('session_types')
          .select('*')
          .order('name', { ascending: true })
        
        data = fallbackResult.data
        error = fallbackResult.error
      }

      if (error) {
        console.error('Session types yükleme hatası:', error)
        throw new Error(error.message)
      }

      setSessionTypes(data || [])
    } catch (error: any) {
      console.error('Session types yükleme hatası:', error)
      toast.error(error.message || 'Seans türleri yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  // Fiyat formatlama fonksiyonları
  const formatPrice = (value: number): string => {
    return new Intl.NumberFormat('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  const parsePrice = (value: string): number => {
    // Türkçe formatı parse et (1.234,56 -> 1234.56)
    const cleaned = value.replace(/\./g, '').replace(',', '.')
    const parsed = parseFloat(cleaned)
    return isNaN(parsed) ? 0 : parsed
  }

  const handlePriceChange = (value: string) => {
    // Sadece rakam, nokta ve virgül kabul et
    let cleaned = value.replace(/[^\d.,]/g, '')
    
    // Virgül sayısını kontrol et (sadece bir tane olabilir)
    const commaCount = (cleaned.match(/,/g) || []).length
    if (commaCount > 1) return
    
    // Eğer virgül varsa, ondan sonra maksimum 2 rakam
    if (cleaned.includes(',')) {
      const parts = cleaned.split(',')
      if (parts[1] && parts[1].length > 2) return
      
      // Tam kısmı formatla
      const integerPart = parts[0].replace(/\./g, '')
      const decimalPart = parts[1] || ''
      
      // Binlik ayraç ekle
      const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      cleaned = formattedInteger + (decimalPart ? ',' + decimalPart : ',')
    } else {
      // Sadece tam sayı kısmı varsa binlik ayraç ekle
      const integerOnly = cleaned.replace(/\./g, '')
      if (integerOnly) {
        cleaned = integerOnly.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      }
    }
    
    setPriceDisplay(cleaned)
    
    // Gerçek değeri güncelle
    const numericValue = parsePrice(cleaned)
    setFormData(prev => ({ ...prev, price: numericValue }))
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      duration_minutes: 60,
      price: 0,
      is_online: true,
      is_in_person: true,
      is_active: true
    })
    setPriceDisplay('0,00')
    setEditingId(null)
    setShowAddForm(false)
    setShowCustomNameInput(false)
  }

  const handleEdit = (sessionType: SessionType) => {
    setFormData({
      name: sessionType.name,
      description: sessionType.description || '',
      duration_minutes: sessionType.duration_minutes,
      price: sessionType.price,
      is_online: sessionType.is_online,
      is_in_person: sessionType.is_in_person,
      is_active: sessionType.is_active
    })
    setPriceDisplay(formatPrice(sessionType.price))
    
    // Eğer mevcut ad uzmanlık alanlarında yoksa custom input'u aç
    const isSpecialtyArea = specialtyAreas.includes(sessionType.name)
    setShowCustomNameInput(!isSpecialtyArea)
    
    setEditingId(sessionType.id)
    setShowAddForm(false)
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Seans türü adı zorunludur')
      return
    }

    if (formData.duration_minutes <= 0) {
      toast.error('Süre 0\'dan büyük olmalıdır')
      return
    }

    if (formData.price < 0) {
      toast.error('Fiyat negatif olamaz')
      return
    }

    try {
      const dataToSave = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        duration_minutes: formData.duration_minutes,
        price: formData.price,
        is_online: formData.is_online,
        is_in_person: formData.is_in_person,
        is_active: formData.is_active
      }

      if (editingId) {
        // Güncelleme - Direkt Supabase
        const { error } = await supabase
          .from('session_types')
          .update(dataToSave)
          .eq('id', editingId)

        if (error) {
          console.error('Update error:', error)
          throw new Error(error.message)
        }
        
        toast.success('Seans türü başarıyla güncellendi')
      } else {
        let dataToInsert: any = dataToSave
        
        // Eğer display_order kolonu varsa, sıra numarası ekle
        if (hasDisplayOrder) {
          const maxOrder = sessionTypes.length > 0 
            ? Math.max(...sessionTypes.map(t => t.display_order || 0))
            : -1
          
          dataToInsert = {
            ...dataToSave,
            display_order: maxOrder + 1
          }
        }

        // Direkt Supabase
        const { error } = await supabase
          .from('session_types')
          .insert(dataToInsert)

        if (error) {
          console.error('Insert error:', error)
          throw new Error(error.message)
        }
        
        // Yeni eklenen adı localStorage'a kaydet
        saveSpecialtyArea(formData.name.trim())
        
        toast.success('Yeni seans türü başarıyla eklendi')
      }

      resetForm()
      loadSessionTypes()
    } catch (error: any) {
      console.error('Save error:', error)
      const errorMessage = error?.message || error?.details || 'Kaydetme sırasında hata oluştu'
      toast.error(errorMessage)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`"${name}" seans türünü silmek istediğinizden emin misiniz?`)) {
      return
    }

    try {
      // Direkt Supabase
      const { error } = await supabase
        .from('session_types')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Delete error:', error)
        throw new Error(error.message)
      }

      toast.success('Seans türü başarıyla silindi')
      loadSessionTypes()
    } catch (error: any) {
      console.error('Delete error:', error)
      const errorMessage = error?.message || 'Silme sırasında hata oluştu'
      toast.error(errorMessage)
    }
  }

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      // Direkt Supabase
      const { error } = await supabase
        .from('session_types')
        .update({ is_active: !currentStatus })
        .eq('id', id)

      if (error) {
        console.error('Toggle active error:', error)
        throw new Error(error.message)
      }

      toast.success(`Seans türü ${!currentStatus ? 'aktif' : 'pasif'} hale getirildi`)
      loadSessionTypes()
    } catch (error: any) {
      console.error('Toggle active error:', error)
      const errorMessage = error?.message || 'Durum değiştirme sırasında hata oluştu'
      toast.error(errorMessage)
    }
  }

  const moveSessionType = async (index: number, direction: 'up' | 'down') => {
    if (!hasDisplayOrder) {
      toast.error('Sıralama özelliği için veritabanı güncellemesi gerekiyor')
      return
    }
    
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === sessionTypes.length - 1) return

    const newIndex = direction === 'up' ? index - 1 : index + 1
    const newTypes = [...sessionTypes]
    
    // Swap items
    const temp = newTypes[index]
    newTypes[index] = newTypes[newIndex]
    newTypes[newIndex] = temp

    // Update display_order for both items
    try {
      const updates = [
        {
          id: newTypes[index].id,
          display_order: index
        },
        {
          id: newTypes[newIndex].id,
          display_order: newIndex
        }
      ]

      for (const update of updates) {
        const { error } = await supabase
          .from('session_types')
          .update({ display_order: update.display_order })
          .eq('id', update.id)

        if (error) throw error
      }

      // Update local state
      setSessionTypes(newTypes)
      toast.success('Sıralama güncellendi')
    } catch (error: any) {
      console.error('Move error:', error)
      toast.error('Sıralama güncellenirken hata oluştu')
      loadSessionTypes() // Reload on error
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-2">Seans türleri yükleniyor...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Seans Türleri Yönetimi</h2>
          <p className="text-gray-600">Rezervasyon sisteminde kullanılacak seans türlerini yönetin</p>
        </div>
        <Button
          onClick={() => {
            resetForm()
            setShowAddForm(true)
          }}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Seans Türü
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{sessionTypes.length}</div>
            <div className="text-sm text-gray-600">Toplam Tür</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {sessionTypes.filter(t => t.is_active).length}
            </div>
            <div className="text-sm text-gray-600">Aktif</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {sessionTypes.filter(t => t.is_online).length}
            </div>
            <div className="text-sm text-gray-600">Online</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {sessionTypes.filter(t => t.is_in_person).length}
            </div>
            <div className="text-sm text-gray-600">Yüz Yüze</div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingId) && (
        <Card className="border-2 border-dashed border-blue-300 bg-blue-50/30">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-800">
              {editingId ? <Edit className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
              {editingId ? 'Seans Türünü Düzenle' : 'Yeni Seans Türü Ekle'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seans Türü Adı *
                </label>
                <div className="space-y-2">
                  {specialtyAreas.length > 0 && !showCustomNameInput ? (
                    <>
                      <select
                        value={formData.name}
                        onChange={(e) => {
                          if (e.target.value === 'custom') {
                            setShowCustomNameInput(true)
                            setFormData(prev => ({ ...prev, name: '' }))
                          } else {
                            setFormData(prev => ({ ...prev, name: e.target.value }))
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Kayıtlı uzmanlık alanından seçin</option>
                        {specialtyAreas.map(area => (
                          <option key={area} value={area}>{area}</option>
                        ))}
                        <option value="custom">🖊️ Yeni uzmanlık alanı ekle</option>
                      </select>
                      
                      {formData.name && (
                        <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded">
                          <span className="text-green-800 text-sm">✓ Seçilen: {formData.name}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, name: '' }))
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="space-y-2">
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Yeni uzmanlık alanı adı girin (örn: Kariyer Koçluğu, Yaşam Koçluğu)"
                        className="w-full"
                      />
                      {specialtyAreas.length > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setShowCustomNameInput(false)
                            setFormData(prev => ({ ...prev, name: '' }))
                          }}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          Kayıtlı alanlardan seç
                        </Button>
                      )}
                      <p className="text-xs text-gray-500">
                        💡 Girdiğiniz uzmanlık alanı kaydedilecek ve sonraki seanslar için seçim listesinde görünecektir.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama
                </label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Seans türü hakkında kısa açıklama"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Süre (dakika) *
                </label>
                <Input
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration_minutes: Number(e.target.value) }))}
                  min="1"
                  max="480"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fiyat (TL) *
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    value={priceDisplay}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    onBlur={() => {
                      // Input'tan çıkıldığında düzgün formatla
                      if (formData.price > 0) {
                        setPriceDisplay(formatPrice(formData.price))
                      } else {
                        setPriceDisplay('0,00')
                      }
                    }}
                    placeholder="0,00"
                    className="pr-12"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-500 text-sm">₺</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Örnek: 1.250,50 (binlik ayraç için nokta, ondalık için virgül)
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_online}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_online: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Online seans olarak sunulabilir</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_in_person}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_in_person: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Yüz yüze seans olarak sunulabilir</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Aktif</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={resetForm}
              >
                <X className="w-4 h-4 mr-2" />
                İptal
              </Button>
              <Button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingId ? 'Güncelle' : 'Kaydet'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Session Types List */}
      <Card>
        <CardHeader>
          <CardTitle>Mevcut Seans Türleri</CardTitle>
        </CardHeader>
        <CardContent>
          {sessionTypes.length > 0 ? (
            <div className="space-y-4">
              {sessionTypes.map((sessionType, index) => (
                <div
                  key={sessionType.id}
                  className={`p-4 rounded-lg border ${
                    sessionType.is_active ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {/* Sıralama Butonları - sadece display_order kolonu varsa göster */}
                    {hasDisplayOrder && (
                      <div className="flex flex-col space-y-1 mr-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveSessionType(index, 'up')}
                          disabled={index === 0}
                          className="h-6 w-8 p-0 text-gray-600 hover:text-gray-900 disabled:opacity-30"
                          title="Yukarı taşı"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveSessionType(index, 'down')}
                          disabled={index === sessionTypes.length - 1}
                          className="h-6 w-8 p-0 text-gray-600 hover:text-gray-900 disabled:opacity-30"
                          title="Aşağı taşı"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </div>
                    )}

                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className={`text-lg font-semibold ${
                          sessionType.is_active ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {sessionType.name}
                        </h3>
                        
                        <div className="flex space-x-2">
                          {sessionType.is_active ? (
                            <Badge className="bg-green-100 text-green-800">Aktif</Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-600">Pasif</Badge>
                          )}
                          
                          {sessionType.is_online && (
                            <Badge className="bg-blue-100 text-blue-800">
                              <Monitor className="w-3 h-3 mr-1" />
                              Online
                            </Badge>
                          )}
                          
                          {sessionType.is_in_person && (
                            <Badge className="bg-purple-100 text-purple-800">
                              <Users className="w-3 h-3 mr-1" />
                              Yüz Yüze
                            </Badge>
                          )}
                        </div>
                      </div>

                      {sessionType.description && (
                        <p className="text-gray-600 text-sm mb-2">{sessionType.description}</p>
                      )}

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {sessionType.duration_minutes} dakika
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {formatPrice(sessionType.price)} ₺
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleActive(sessionType.id, sessionType.is_active)}
                        className={sessionType.is_active ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'}
                      >
                        {sessionType.is_active ? 'Pasif Yap' : 'Aktif Yap'}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(sessionType)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(sessionType.id, sessionType.name)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Settings className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <h4 className="text-lg font-medium mb-2">Henüz seans türü yok</h4>
              <p className="text-sm mb-4">Rezervasyon sistemi için seans türleri ekleyin</p>
              <Button
                onClick={() => {
                  resetForm()
                  setShowAddForm(true)
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                İlk Seans Türünü Ekle
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default SessionTypesManagement
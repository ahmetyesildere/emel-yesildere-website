# Seans Sistemi Hata Giderme Rehberi

## 🔧 Yapılan Düzeltmeler

### 1. Session Types Management - Save Error (400)

**Sorun:** Admin panelinde seans türü kaydederken 400 hatası alınıyordu.

**Neden:** 
- `created_at` ve `updated_at` alanları manuel olarak ayarlanıyordu
- Veritabanında bu alanlar zaten `DEFAULT NOW()` ile otomatik ayarlanıyor
- Manuel değer gönderilmesi çakışmaya neden oluyordu

**Çözüm:**
```typescript
// ❌ Önceki (Hatalı)
const dataToSave = {
  name: formData.name.trim(),
  // ... diğer alanlar
  updated_at: new Date().toISOString()  // Manuel ayarlama
}

// ✅ Yeni (Doğru)
const dataToSave = {
  name: formData.name.trim(),
  // ... diğer alanlar
  // updated_at otomatik ayarlanacak
}
```

**Etkilenen Fonksiyonlar:**
- `handleSave()` - Seans türü ekleme/güncelleme
- `toggleActive()` - Aktif/pasif yapma
- `handleDelete()` - Silme

### 2. Hata Mesajları İyileştirildi

**Önceki Durum:**
```typescript
catch (error) {
  console.error('Save error:', error)
  toast.error('Kaydetme sırasında hata oluştu')
}
```

**Yeni Durum:**
```typescript
catch (error: any) {
  console.error('Save error:', error)
  const errorMessage = error?.message || error?.details || 'Kaydetme sırasında hata oluştu'
  toast.error(errorMessage)
}
```

**Faydaları:**
- Daha detaylı hata mesajları
- Kullanıcı için daha anlaşılır
- Debug için daha faydalı console logları

## 🐛 Sık Karşılaşılan Hatalar ve Çözümleri

### 1. "Permission Denied for Table" (403) Hatası ⚠️ YENİ

**Belirtiler:**
- Admin panelinde seans türü kaydetme başarısız
- Console'da 403 status kodu
- "permission denied for table session_types" mesajı
- Error code: 42501

**Neden:**
- RLS (Row Level Security) politikaları eksik veya yanlış yapılandırılmış
- Kullanıcı admin rolüne sahip değil

**Hızlı Çözüm:**
1. ✅ `supabase-session-types-rls.sql` dosyasını Supabase SQL Editor'de çalıştırın
2. ✅ Kendinizi admin yapın: `UPDATE profiles SET role = 'admin' WHERE email = 'YOUR_EMAIL'`
3. ✅ Tarayıcıdan çıkış yapıp tekrar giriş yapın
4. ✅ Tekrar deneyin

**Detaylı Çözüm:**
- `RLS_POLITIKALARI_KURULUM.md` dosyasına bakın
- `HIZLI_COZUM_RLS.md` dosyasına bakın

### 2. "Failed to load resource: 400" Hatası

**Belirtiler:**
- Admin panelinde seans türü kaydetme başarısız
- Console'da 400 status kodu
- "Save error: Object" mesajı

**Çözümler:**
1. ✅ `created_at` ve `updated_at` alanlarını manuel olarak göndermeyin
2. ✅ Veritabanı şemasını kontrol edin
3. ✅ RLS politikalarını kontrol edin
4. ✅ Supabase bağlantısını test edin

### 2. "Seans türleri yüklenirken hata oluştu"

**Belirtiler:**
- Seans rezervasyon sayfasında seans türleri görünmüyor
- Hata mesajı gösteriliyor

**Çözümler:**
1. ✅ Admin panelinden en az bir aktif seans türü ekleyin
2. ✅ Veritabanı bağlantısını kontrol edin
3. ✅ `session_types` tablosunun var olduğundan emin olun
4. ✅ RLS politikalarını kontrol edin

### 3. "Henüz aktif seans türü bulunmuyor"

**Belirtiler:**
- Seans türleri listesi boş
- Kullanıcı seans alamıyor

**Çözümler:**
1. ✅ Admin paneline gidin
2. ✅ "Seans Türleri" sekmesine tıklayın
3. ✅ "Yeni Seans Türü" butonuna tıklayın
4. ✅ En az bir seans türü ekleyin ve aktif yapın

### 4. "Seansınıza 24 saatten az kaldı"

**Belirtiler:**
- Kullanıcı seansı iptal/ertele edemiyor
- 24 saat kuralı uyarısı

**Çözümler:**
- Bu normal bir durumdur
- 24 saat kuralı sistem politikasıdır
- Kullanıcı daha erken iptal/erteleme yapmalıdır
- Admin müdahalesi gerekiyorsa veritabanından manuel düzenleme yapılabilir

### 5. "Bu seans maksimum erteleme sayısına ulaştı"

**Belirtiler:**
- Kullanıcı seansı ertele edemiyor
- Maksimum 2 kez erteleme uyarısı

**Çözümler:**
- Bu normal bir durumdur
- Kullanıcı seansı iptal edip yeni seans oluşturmalıdır
- Admin müdahalesi gerekiyorsa `reschedule_count` sıfırlanabilir

## 🔍 Debug Adımları

### 1. Console Loglarını Kontrol Edin

**Seans Türleri Yükleme:**
```javascript
// Başarılı yükleme
✅ Seans türleri yüklendi: [...]

// Hata durumu
❌ Seans türleri yüklenirken hata: {...}
```

**Seans Kaydetme:**
```javascript
// Başarılı kaydetme
✅ Seans başarıyla oluşturuldu: {...}

// Hata durumu
💥 Seans oluşturma hatası: {...}
```

### 2. Network Sekmesini Kontrol Edin

**Kontrol Edilecekler:**
- Request URL doğru mu?
- Request Method (POST, GET, etc.) doğru mu?
- Request Body doğru formatta mı?
- Response Status Code nedir?
- Response Body'de hata mesajı var mı?

### 3. Supabase Dashboard'u Kontrol Edin

**Kontrol Edilecekler:**
- Tablo var mı? (`session_types`, `sessions`, `session_history`)
- RLS politikaları aktif mi?
- Kullanıcı yetkisi var mı?
- Veritabanı bağlantısı çalışıyor mu?

### 4. Browser Console'da Test Edin

```javascript
// Supabase bağlantısını test et
const { data, error } = await supabase
  .from('session_types')
  .select('*')
  .limit(1)

console.log('Data:', data)
console.log('Error:', error)
```

## 🛠️ Veritabanı Kontrolleri

### Session Types Tablosu Kontrolü

```sql
-- Tablo var mı?
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'session_types'
);

-- Aktif seans türleri var mı?
SELECT * FROM session_types WHERE is_active = true;

-- Tüm seans türleri
SELECT * FROM session_types ORDER BY created_at DESC;
```

### Sessions Tablosu Kontrolü

```sql
-- İptal/erteleme alanları var mı?
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'sessions' 
AND column_name IN (
  'cancellation_reason', 
  'cancelled_at', 
  'reschedule_count',
  'original_session_date'
);

-- Kullanıcının seansları
SELECT * FROM sessions 
WHERE client_id = 'USER_ID' 
ORDER BY session_date DESC;
```

### RLS Politikaları Kontrolü

```sql
-- Session types RLS politikaları
SELECT * FROM pg_policies 
WHERE tablename = 'session_types';

-- Sessions RLS politikaları
SELECT * FROM pg_policies 
WHERE tablename = 'sessions';
```

## 📋 Kurulum Kontrol Listesi

### İlk Kurulum
- [ ] `database-schema.sql` çalıştırıldı mı?
- [ ] `supabase-session-cancellation.sql` çalıştırıldı mı?
- [ ] En az bir admin kullanıcı var mı?
- [ ] En az bir danışman var mı?
- [ ] En az bir aktif seans türü var mı?

### Seans İptal/Erteleme Sistemi
- [ ] `session_history` tablosu oluşturuldu mu?
- [ ] Yeni alanlar `sessions` tablosuna eklendi mi?
- [ ] Trigger fonksiyonları çalışıyor mu?
- [ ] API endpoint'leri çalışıyor mu?

### Admin Paneli
- [ ] Seans türleri sekmesi görünüyor mu?
- [ ] Seans türü ekleme çalışıyor mu?
- [ ] Seans türü düzenleme çalışıyor mu?
- [ ] Seans türü silme çalışıyor mu?
- [ ] Aktif/pasif yapma çalışıyor mu?

## 🚨 Acil Durum Çözümleri

### Tüm Seans Türleri Silindi

```sql
-- Örnek seans türü ekle
INSERT INTO session_types (
  name, 
  description, 
  duration_minutes, 
  price, 
  is_online, 
  is_in_person, 
  is_active
) VALUES (
  'Genel Danışmanlık',
  'Genel psikolojik danışmanlık seansı',
  60,
  500.00,
  true,
  true,
  true
);
```

### Kullanıcı Seansı İptal Edemiyor (24 saat kuralı)

```sql
-- Manuel iptal (sadece acil durumlar için)
UPDATE sessions 
SET 
  status = 'cancelled',
  cancellation_reason = 'Admin tarafından iptal edildi',
  cancelled_at = NOW(),
  cancelled_by = 'ADMIN_USER_ID'
WHERE id = 'SESSION_ID';
```

### Erteleme Sayısı Sıfırlama

```sql
-- Erteleme sayısını sıfırla
UPDATE sessions 
SET reschedule_count = 0
WHERE id = 'SESSION_ID';
```

## 📞 Destek

Sorun devam ediyorsa:

1. **Console loglarını** kaydedin
2. **Network sekmesini** kaydedin
3. **Hata mesajlarını** not edin
4. **Adım adım** ne yaptığınızı açıklayın
5. **Supabase dashboard** ekran görüntüsü alın

## 🔄 Güncellemeler

### v1.0.0 (Mevcut)
- ✅ Seans iptal/erteleme sistemi
- ✅ Seans türleri yönetimi
- ✅ Hata yönetimi iyileştirmeleri
- ✅ 400 hatası düzeltildi

### Gelecek Güncellemeler
- [ ] Email/SMS bildirimleri
- [ ] Otomatik ücret iadesi
- [ ] Danışman onay sistemi
- [ ] Gelişmiş raporlama

## ✅ Test Checklist

### Seans Türleri
- [ ] Yeni seans türü eklenebiliyor mu?
- [ ] Seans türü düzenlenebiliyor mu?
- [ ] Seans türü silinebiliyor mu?
- [ ] Aktif/pasif yapılabiliyor mu?
- [ ] Fiyat formatı doğru mu?

### Seans Rezervasyonu
- [ ] Danışman seçilebiliyor mu?
- [ ] Seans türü seçilebiliyor mu?
- [ ] Tarih/saat seçilebiliyor mu?
- [ ] Rezervasyon oluşturuluyor mu?

### Seans İptal/Erteleme
- [ ] Seanslarım sayfası açılıyor mu?
- [ ] İptal butonu çalışıyor mu?
- [ ] Erteleme butonu çalışıyor mu?
- [ ] 24 saat kuralı kontrol ediliyor mu?
- [ ] Maksimum erteleme sayısı kontrol ediliyor mu?

## 📚 İlgili Dosyalar

- `src/components/admin/sessions/session-types-management.tsx`
- `src/app/seans-al/page.tsx`
- `src/app/seanslarim/page.tsx`
- `src/components/sessions/session-actions.tsx`
- `src/app/api/sessions/cancel/route.ts`
- `src/app/api/sessions/reschedule/route.ts`
- `supabase-session-cancellation.sql`
- `database-schema.sql`

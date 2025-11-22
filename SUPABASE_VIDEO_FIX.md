# Video ve Thumbnail Supabase Kayıt Sorunu - Çözüm

## Sorun
Admin panelde video ve thumbnail yükleniyordu ancak kullanıcı çıkış yaptığında kayboluyordu. Bunun nedeni Supabase'e kayıt yapılmamasıydı.

## Kök Neden
İki farklı tablo yapısı kullanılıyordu:
- **SQL Dosyası**: `key` ve `value` kolonları
- **Supabase Type**: `setting_key` ve `setting_value` kolonları

Bu uyumsuzluk nedeniyle veriler Supabase'e kaydedilmiyordu.

## Yapılan Düzeltmeler

### 1. Hook Güncellemesi (`src/hooks/use-video-content.ts`)
- `key` → `setting_key` 
- `value` → `setting_value`
- Hata yönetimi iyileştirildi (try-catch kaldırıldı, hatalar yukarı fırlatılıyor)
- Detaylı console logları eklendi

### 2. API Endpoint'leri
- `/api/sync-video/route.ts` - Kolon adları güncellendi
- `/api/check-video-data/route.ts` - Kolon adları güncellendi

### 3. SQL Dosyası (`supabase-site-settings-create.sql`)
- Mevcut tablo yapısına uygun hale getirildi
- `setting_key` ve `setting_value` kullanımı

### 4. Supabase Type Uyumu
Artık kod Supabase type tanımına uygun:
```typescript
site_settings: {
  Row: {
    id: string
    setting_key: string
    setting_value: any
    created_at: string
    updated_at: string
    updated_by: string | null
  }
}
```

## Test Adımları

1. **Supabase'de Kontrol**
   ```sql
   SELECT * FROM site_settings WHERE setting_key = 'homepage_video';
   ```

2. **Debug Sayfası**
   - `/debug/video` sayfasını açın
   - "Supabase Durumunu Kontrol Et" butonuna tıklayın
   - Thumbnail ve video URL'lerini kontrol edin

3. **Admin Panelde Test**
   - Admin panelde yeni bir thumbnail yükleyin
   - Console'da şu logları görmelisiniz:
     - `💾 localStorage'a kaydedildi`
     - `✅ Video içeriği Supabase'e kaydedildi`
   - Çıkış yapın ve tekrar giriş yapın
   - Thumbnail hala görünüyor olmalı

4. **Ana Sayfada Test**
   - Ana sayfayı yenileyin
   - Thumbnail ve video doğru yüklenmeli
   - Console'da şu logları görmelisiniz:
     - `✅ Video Supabase'den yüklendi`
     - `🖼️ Thumbnail URL: /media/images/...`

## Önemli Notlar

- **localStorage**: Yedek olarak kullanılıyor, asıl kaynak Supabase
- **Fallback**: Thumbnail veya video yoksa varsayılan dosyalar kullanılıyor
- **Hata Yönetimi**: Supabase hatası olursa kullanıcıya gösteriliyor
- **JSONB**: `setting_value` JSONB tipinde, otomatik parse ediliyor

## Sorun Devam Ederse

1. Supabase'de `site_settings` tablosunun var olduğundan emin olun
2. RLS (Row Level Security) politikalarını kontrol edin
3. Console'da hata loglarını kontrol edin
4. `/api/check-video-data` endpoint'ini çağırıp yanıtı kontrol edin

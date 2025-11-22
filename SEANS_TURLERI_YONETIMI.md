# Seans Türleri Yönetim Sistemi

## 📋 Genel Bakış

Seans türleri artık tamamen admin panelinden yönetilmektedir. Hardcoded fallback seans türleri kaldırılmıştır ve tüm seans türleri veritabanından yüklenmektedir.

## ✅ Yapılan Değişiklikler

### 1. Fallback Seans Türleri Kaldırıldı
**Dosya:** `src/app/seans-al/page.tsx`

**Önceki Durum:**
- Veritabanından yükleme başarısız olduğunda hardcoded fallback seans türleri gösteriliyordu
- 4 adet varsayılan seans türü vardı (Duygu Temizliği, Travma İyileştirme, vb.)

**Yeni Durum:**
- Fallback seans türleri tamamen kaldırıldı
- Veritabanından yükleme başarısız olursa kullanıcıya bilgilendirici hata mesajı gösteriliyor
- Boş liste durumunda admin ile iletişime geçmesi öneriliyor

### 2. Hata Yönetimi İyileştirildi
```typescript
// Yeni hata yönetimi
if (error) {
  console.error('Seans türleri yüklenirken hata:', error)
  showError('Seans türleri yüklenirken hata oluştu. Lütfen daha sonra tekrar deneyin.')
  setSessionTypes([])
} else {
  setSessionTypes(data || [])
  
  if (!data || data.length === 0) {
    console.warn('⚠️ Aktif seans türü bulunamadı')
    showError('Henüz aktif seans türü bulunmuyor. Lütfen admin ile iletişime geçin.')
  }
}
```

## 🎯 Admin Paneli Seans Türleri Yönetimi

### Erişim
1. Admin olarak giriş yapın
2. Admin Dashboard'a gidin (`/admin`)
3. "Seans Türleri" sekmesine tıklayın

### Özellikler

#### ✨ Seans Türü Ekleme
- **Ad:** Uzmanlık alanlarından seçim veya özel ad girişi
- **Açıklama:** Seans türü hakkında kısa bilgi
- **Süre:** Dakika cinsinden (1-480 dakika arası)
- **Fiyat:** TL cinsinden (Türkçe format: 1.250,50)
- **Online:** Online seans olarak sunulabilir mi?
- **Yüz Yüze:** Yüz yüze seans olarak sunulabilir mi?
- **Aktif:** Rezervasyon sisteminde görünsün mü?

#### 📝 Seans Türü Düzenleme
- Mevcut seans türlerini düzenleyebilirsiniz
- Tüm alanlar güncellenebilir
- Değişiklikler anında yansır

#### 🗑️ Seans Türü Silme
- Seans türlerini tamamen silebilirsiniz
- Onay mesajı gösterilir
- Silinen seans türleri geri getirilemez

#### 🔄 Aktif/Pasif Yapma
- Seans türlerini silmeden pasif yapabilirsiniz
- Pasif seans türleri rezervasyon sisteminde görünmez
- İstediğiniz zaman tekrar aktif yapabilirsiniz

### İstatistikler
Admin panelinde şu istatistikler gösterilir:
- **Toplam Tür:** Tüm seans türleri sayısı
- **Aktif:** Aktif seans türleri sayısı
- **Online:** Online olarak sunulan türler
- **Yüz Yüze:** Yüz yüze olarak sunulan türler

## 🔧 Teknik Detaylar

### Veritabanı Tablosu
```sql
CREATE TABLE session_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  price DECIMAL(10,2) NOT NULL,
  is_online BOOLEAN DEFAULT true,
  is_in_person BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### API Kullanımı
```typescript
// Seans türlerini yükleme
const { data, error } = await supabase
  .from('session_types')
  .select('*')
  .eq('is_active', true)
  .order('price')
```

### Fiyat Formatı
- **Giriş:** Türkçe format (1.250,50)
- **Veritabanı:** Decimal (1250.50)
- **Gösterim:** Türkçe format (1.250,50 ₺)

## 📱 Kullanıcı Deneyimi

### Seans Rezervasyonu Akışı
1. Kullanıcı `/seans-al` sayfasına gider
2. Danışman seçer
3. **Seans türü seçer** (sadece aktif türler gösterilir)
4. Tarih ve saat seçer
5. Rezervasyonu tamamlar

### Boş Liste Durumu
Eğer hiç aktif seans türü yoksa:
- Kullanıcıya bilgilendirici mesaj gösterilir
- "Henüz aktif seans türü bulunmuyor" uyarısı
- Admin ile iletişime geçmesi önerilir

### Hata Durumu
Veritabanı hatası durumunda:
- Kullanıcıya hata mesajı gösterilir
- "Lütfen daha sonra tekrar deneyin" önerisi
- Boş liste gösterilir (fallback yok)

## 🎨 Uzmanlık Alanları

Admin panelinde seans türü adı için önceden tanımlı uzmanlık alanları:
- Psikoloji
- Psikiyatri
- Aile Danışmanlığı
- Çift Terapisi
- Çocuk Psikolojisi
- Ergen Psikolojisi
- Travma Terapisi
- Bağımlılık Danışmanlığı
- Kariyer Danışmanlığı
- Eğitim Danışmanlığı

**Not:** Özel ad girişi de mümkündür.

## 🔒 Güvenlik

### RLS (Row Level Security)
- Sadece admin kullanıcılar seans türlerini yönetebilir
- Tüm kullanıcılar aktif seans türlerini görüntüleyebilir
- Pasif seans türleri sadece admin'e görünür

### Validasyonlar
- ✅ Ad zorunludur
- ✅ Süre 0'dan büyük olmalıdır
- ✅ Fiyat negatif olamaz
- ✅ En az bir sunum şekli seçilmelidir (online veya yüz yüze)

## 📊 Örnek Kullanım

### Yeni Seans Türü Ekleme
```
Ad: Duygu Temizliği Seansı
Açıklama: Bilinçaltındaki olumsuz duyguların temizlenmesi
Süre: 60 dakika
Fiyat: 1.250,00 ₺
Online: ✓
Yüz Yüze: ✓
Aktif: ✓
```

### Mevcut Türü Düzenleme
1. Listeden düzenlemek istediğiniz türü bulun
2. "Düzenle" butonuna tıklayın
3. Değişiklikleri yapın
4. "Güncelle" butonuna tıklayın

### Türü Pasif Yapma
1. Listeden türü bulun
2. "Pasif Yap" butonuna tıklayın
3. Tür artık rezervasyon sisteminde görünmez

## 🚀 Gelecek İyileştirmeler

### Planlanan Özellikler
- [ ] Seans türü kategorileri
- [ ] Toplu işlemler (çoklu aktif/pasif)
- [ ] Seans türü şablonları
- [ ] İndirim ve kampanya yönetimi
- [ ] Seans türü istatistikleri
- [ ] Popüler seans türleri raporu

### Teknik İyileştirmeler
- [ ] Seans türü önbellekleme
- [ ] Gerçek zamanlı güncelleme
- [ ] Seans türü arama ve filtreleme
- [ ] Toplu içe/dışa aktarma
- [ ] Seans türü versiyonlama

## 📝 Notlar

### Önemli
- **Fallback seans türleri kaldırıldı** - Tüm seans türleri admin tarafından yönetilmelidir
- İlk kurulumda en az bir aktif seans türü eklenmesi önerilir
- Pasif yapılan seans türleri mevcut rezervasyonları etkilemez

### Best Practices
1. Her zaman en az bir aktif seans türü bulundurun
2. Fiyat değişikliklerini dikkatli yapın
3. Açıklama alanını kullanıcılar için bilgilendirici yazın
4. Süreleri gerçekçi belirleyin
5. Pasif yapmadan önce mevcut rezervasyonları kontrol edin

## 🆘 Sorun Giderme

### "Henüz aktif seans türü bulunmuyor" Hatası
**Çözüm:** Admin panelinden en az bir aktif seans türü ekleyin

### "Seans türleri yüklenirken hata oluştu" Hatası
**Çözüm:** 
1. Veritabanı bağlantısını kontrol edin
2. RLS politikalarını kontrol edin
3. Supabase servisinin çalıştığından emin olun

### Seans Türü Görünmüyor
**Çözüm:**
1. Seans türünün aktif olduğundan emin olun
2. `is_active` alanının `true` olduğunu kontrol edin
3. Sayfayı yenileyin

## 📚 İlgili Dosyalar

- `src/app/seans-al/page.tsx` - Seans rezervasyon sayfası
- `src/components/admin/sessions/session-types-management.tsx` - Admin yönetim bileşeni
- `src/components/admin/admin-dashboard.tsx` - Admin dashboard
- `database-schema.sql` - Veritabanı şeması

## ✨ Sonuç

Seans türleri yönetim sistemi artık tamamen admin panelinden kontrol edilmektedir. Hardcoded fallback değerler kaldırılmış ve sistem daha esnek ve yönetilebilir hale getirilmiştir.

**Önemli:** İlk kurulumda admin panelinden en az bir aktif seans türü eklemeyi unutmayın!

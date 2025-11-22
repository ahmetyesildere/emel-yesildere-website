# Seans İptal ve Erteleme Sistemi

## Genel Bakış

Kullanıcılar oluşturdukları seansları iptal edebilir veya erteleyebilir. Bu sistem, hem kullanıcı deneyimini iyileştirmek hem de danışmanların zamanlarını daha iyi yönetmelerini sağlamak için tasarlanmıştır.

## Özellikler

### 1. Seans İptali
- ✅ Kullanıcılar seanslarını iptal edebilir
- ✅ İptal nedeni zorunludur
- ✅ 24 saat kuralı: Seansa en az 24 saat kala iptal edilmelidir
- ⚠️ **Ücret iadesi yapılmaz**
- ✅ İptal geçmişi kaydedilir
- ✅ Danışmana bildirim gönderilir (planlanan)

### 2. Seans Erteleme
- ✅ Kullanıcılar seanslarını erteleyebilir
- ✅ Maksimum 2 kez erteleme hakkı
- ✅ Erteleme nedeni zorunludur
- ✅ 24 saat kuralı: Seansa en az 24 saat kala ertelenmelidir
- ✅ Yeni tarih ve saat müsait olmalıdır
- ⚠️ **Ücret iadesi yapılmaz**
- ✅ Erteleme geçmişi kaydedilir
- ✅ Orijinal seans tarihi saklanır

### 3. Seans Geçmişi
- ✅ Tüm değişiklikler `session_history` tablosunda saklanır
- ✅ İptal, erteleme, tamamlanma gibi tüm aksiyonlar kaydedilir
- ✅ Kullanıcılar kendi seans geçmişlerini görüntüleyebilir

## Veritabanı Değişiklikleri

### Yeni Alanlar (sessions tablosu)
```sql
- cancellation_reason: TEXT
- cancelled_at: TIMESTAMPTZ
- cancelled_by: UUID
- reschedule_count: INTEGER (default: 0)
- original_session_date: TIMESTAMPTZ
- reschedule_reason: TEXT
- rescheduled_at: TIMESTAMPTZ
- rescheduled_by: UUID
```

### Yeni Tablo (session_history)
```sql
CREATE TABLE session_history (
  id UUID PRIMARY KEY,
  session_id UUID REFERENCES sessions(id),
  action_type VARCHAR(50), -- 'created', 'rescheduled', 'cancelled', 'completed', 'no_show'
  action_by UUID REFERENCES profiles(id),
  old_session_date TIMESTAMPTZ,
  new_session_date TIMESTAMPTZ,
  reason TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ
)
```

### Yardımcı Fonksiyonlar
- `can_cancel_session(session_id)`: Seansın iptal edilip edilemeyeceğini kontrol eder
- `can_reschedule_session(session_id)`: Seansın ertelenip ertelenemeyeceğini kontrol eder
- `log_session_changes()`: Seans değişikliklerini otomatik olarak kaydeder (trigger)

## API Endpoints

### 1. Seans İptali
**POST** `/api/sessions/cancel`

**Request Body:**
```json
{
  "sessionId": "uuid",
  "reason": "İptal nedeni"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Seans başarıyla iptal edildi",
  "refundNote": "Ücret iadesi yapılmamaktadır"
}
```

**Response (Error):**
```json
{
  "error": "Seansınıza 24 saatten az kaldı. İptal işlemi yapılamaz.",
  "canCancel": false,
  "hoursRemaining": 12
}
```

### 2. Seans Erteleme
**POST** `/api/sessions/reschedule`

**Request Body:**
```json
{
  "sessionId": "uuid",
  "newDate": "2024-12-25",
  "newStartTime": "14:00",
  "newEndTime": "15:00",
  "reason": "Erteleme nedeni"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Seans başarıyla ertelendi",
  "newDate": "2024-12-25T14:00:00",
  "remainingReschedules": 1,
  "refundNote": "Ücret iadesi yapılmamaktadır"
}
```

**Response (Error):**
```json
{
  "error": "Bu seans maksimum erteleme sayısına ulaştı (2 kez)",
  "canReschedule": false,
  "rescheduleCount": 2
}
```

## Kullanıcı Arayüzü

### 1. Seanslarım Sayfası (`/seanslarim`)
- Tüm seansları listeler
- Filtreler: Yaklaşan, Geçmiş, İptal Edilenler, Tümü
- Her seans için detaylı bilgi gösterir
- İptal ve erteleme butonları (uygun seanslar için)

### 2. SessionActions Bileşeni
- İptal ve erteleme modalları
- Kural kontrolleri ve uyarılar
- Kullanıcı dostu hata mesajları
- Erteleme hakkı göstergesi

### 3. Header Menüsü
- "Seanslarım" linki eklendi (sadece client'lar için)
- Hem desktop hem mobil menüde mevcut

## Kurallar ve Kısıtlamalar

### İptal Kuralları
1. ✅ Seansa en az 24 saat kala iptal edilmelidir
2. ✅ İptal nedeni belirtilmelidir
3. ❌ İptal edilmiş seans tekrar aktif edilemez
4. ❌ Ücret iadesi yapılmaz
5. ✅ Sadece `pending` veya `confirmed` durumundaki seanslar iptal edilebilir

### Erteleme Kuralları
1. ✅ Seansa en az 24 saat kala ertelenmelidir
2. ✅ Maksimum 2 kez ertelenebilir
3. ✅ Erteleme nedeni belirtilmelidir
4. ✅ Yeni tarih ve saat müsait olmalıdır
5. ❌ Ücret iadesi yapılmaz
6. ✅ Orijinal seans tarihi saklanır
7. ✅ Sadece `pending` veya `confirmed` durumundaki seanslar ertelen ebilir

## Kurulum

### 1. Veritabanı Güncellemesi
```bash
# Supabase SQL Editor'de çalıştırın
psql -f supabase-session-cancellation.sql
```

### 2. Bağımlılıklar
Tüm gerekli bağımlılıklar mevcut projede zaten yüklü.

### 3. Yeni Dosyalar
- `src/app/api/sessions/cancel/route.ts` - İptal API
- `src/app/api/sessions/reschedule/route.ts` - Erteleme API
- `src/components/sessions/session-actions.tsx` - İptal/Erteleme UI
- `src/app/seanslarim/page.tsx` - Seanslarım sayfası
- `supabase-session-cancellation.sql` - Veritabanı şeması

## Güvenlik

### RLS (Row Level Security) Politikaları
- ✅ Kullanıcılar sadece kendi seanslarını görebilir
- ✅ Kullanıcılar sadece kendi seanslarını iptal/erteleyebilir
- ✅ Danışmanlar kendi seanslarını görebilir
- ✅ Session history sadece ilgili kullanıcılara açık

### Validasyonlar
- ✅ 24 saat kuralı hem frontend hem backend'de kontrol edilir
- ✅ Maksimum erteleme sayısı kontrol edilir
- ✅ Yeni tarih müsaitlik kontrolü yapılır
- ✅ Kullanıcı yetkilendirmesi her istekte kontrol edilir

## Gelecek İyileştirmeler

### Planlanan Özellikler
- [ ] Email/SMS bildirimleri
- [ ] Danışman onay sistemi (opsiyonel)
- [ ] İptal politikası özelleştirme (admin paneli)
- [ ] Otomatik ücret iadesi entegrasyonu
- [ ] Seans değişiklik bildirimleri
- [ ] Takvim entegrasyonu (Google Calendar, Outlook)
- [ ] Toplu seans yönetimi
- [ ] İstatistikler ve raporlar

### Teknik İyileştirmeler
- [ ] Webhook sistemi (seans değişikliklerinde)
- [ ] Real-time bildirimler (WebSocket)
- [ ] Önbellek optimizasyonu
- [ ] Performans iyileştirmeleri
- [ ] Test coverage artırma

## Kullanım Örnekleri

### Kullanıcı Akışı - İptal
1. Kullanıcı `/seanslarim` sayfasına gider
2. İptal etmek istediği seansı bulur
3. "Seansı İptal Et" butonuna tıklar
4. İptal nedenini yazar
5. Uyarıları okur (ücret iadesi yok)
6. "Seansı İptal Et" butonuna tıklar
7. Seans iptal edilir ve bildirim gösterilir

### Kullanıcı Akışı - Erteleme
1. Kullanıcı `/seanslarim` sayfasına gider
2. Ertelemek istediği seansı bulur
3. "Seansı Ertele" butonuna tıklar
4. Yeni tarih ve saat seçer
5. Erteleme nedenini yazar
6. Kalan erteleme hakkını görür
7. "Seansı Ertele" butonuna tıklar
8. Seans ertelenir ve bildirim gösterilir

## Sorun Giderme

### Sık Karşılaşılan Hatalar

**1. "Seansınıza 24 saatten az kaldı"**
- Çözüm: Seansı en az 24 saat önceden iptal/erteleyin

**2. "Bu seans maksimum erteleme sayısına ulaştı"**
- Çözüm: Seans 2 kez ertelenmiş, iptal edip yeni seans oluşturun

**3. "Seçtiğiniz tarih ve saat müsait değil"**
- Çözüm: Başka bir tarih/saat seçin

**4. "Bu seansı iptal etme yetkiniz yok"**
- Çözüm: Sadece kendi seanslarınızı iptal edebilirsiniz

## Destek

Herhangi bir sorun veya soru için:
- GitHub Issues: [Proje Repository]
- Email: support@example.com
- Dokümantasyon: [Wiki Link]

## Lisans

Bu özellik ana projenin lisansı altındadır.

# RLS Politikaları Kurulum Rehberi

## 🚨 Sorun: Permission Denied (403)

**Hata Mesajı:**
```
POST https://djsxvpwbpqmqefvksnlg.supabase.co/rest/v1/session_types 403 (Forbidden)
Insert error details: {
  code: '42501',
  details: null,
  hint: null,
  message: 'permission denied for table session_types'
}
```

**Neden:**
`session_types` tablosu için RLS (Row Level Security) politikaları eksik veya yanlış yapılandırılmış.

## ✅ Çözüm

### Adım 1: Supabase Dashboard'a Giriş Yapın
1. https://supabase.com adresine gidin
2. Projenize giriş yapın
3. Sol menüden **SQL Editor**'ü seçin

### Adım 2: RLS Politikalarını Ekleyin
`supabase-session-types-rls.sql` dosyasının içeriğini SQL Editor'e yapıştırın ve **RUN** butonuna tıklayın.

### Adım 3: Kontrol Edin
Aşağıdaki sorguyu çalıştırarak politikaların eklendiğini doğrulayın:

```sql
SELECT 
  policyname,
  cmd,
  permissive
FROM pg_policies
WHERE tablename = 'session_types'
ORDER BY policyname;
```

**Beklenen Sonuç:**
```
policyname                              | cmd    | permissive
----------------------------------------|--------|------------
Admins can delete session types         | DELETE | PERMISSIVE
Admins can insert session types         | INSERT | PERMISSIVE
Admins can update session types         | UPDATE | PERMISSIVE
Admins can view all session types       | SELECT | PERMISSIVE
Anyone can view active session types    | SELECT | PERMISSIVE
```

### Adım 4: Admin Kullanıcısını Kontrol Edin
Admin rolüne sahip bir kullanıcınız olduğundan emin olun:

```sql
SELECT id, email, role FROM profiles WHERE role = 'admin';
```

Eğer admin kullanıcı yoksa, bir kullanıcıyı admin yapın:

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'admin@example.com';
```

## 📋 RLS Politikaları Açıklaması

### 1. Anyone can view active session types
```sql
FOR SELECT USING (is_active = true)
```
- **Amaç:** Herkes aktif seans türlerini görebilir
- **Kullanım:** Seans rezervasyon sayfası
- **Kısıtlama:** Sadece `is_active = true` olanlar

### 2. Admins can view all session types
```sql
FOR SELECT USING (role = 'admin')
```
- **Amaç:** Admin'ler tüm seans türlerini görebilir
- **Kullanım:** Admin paneli
- **Kısıtlama:** Sadece admin rolündeki kullanıcılar

### 3. Admins can insert session types
```sql
FOR INSERT WITH CHECK (role = 'admin')
```
- **Amaç:** Admin'ler yeni seans türü ekleyebilir
- **Kullanım:** Admin paneli - Yeni seans türü ekleme
- **Kısıtlama:** Sadece admin rolündeki kullanıcılar

### 4. Admins can update session types
```sql
FOR UPDATE USING (role = 'admin')
```
- **Amaç:** Admin'ler seans türlerini güncelleyebilir
- **Kullanım:** Admin paneli - Seans türü düzenleme
- **Kısıtlama:** Sadece admin rolündeki kullanıcılar

### 5. Admins can delete session types
```sql
FOR DELETE USING (role = 'admin')
```
- **Amaç:** Admin'ler seans türlerini silebilir
- **Kullanım:** Admin paneli - Seans türü silme
- **Kısıtlama:** Sadece admin rolündeki kullanıcılar

## 🔍 Sorun Giderme

### Hala "Permission Denied" Hatası Alıyorum

**1. Kullanıcı Rolünü Kontrol Edin**
```sql
SELECT id, email, role 
FROM profiles 
WHERE id = auth.uid();
```

Eğer `role` değeri `admin` değilse:
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE id = auth.uid();
```

**2. RLS Politikalarını Kontrol Edin**
```sql
SELECT * FROM pg_policies 
WHERE tablename = 'session_types';
```

Eğer politikalar yoksa, `supabase-session-types-rls.sql` dosyasını tekrar çalıştırın.

**3. Auth Token'ı Yenileyin**
- Tarayıcıdan çıkış yapın
- Tekrar giriş yapın
- Sayfayı yenileyin (Ctrl+F5)

**4. Supabase Client'ı Kontrol Edin**
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### "Role" Kolonu Bulunamıyor

Eğer `profiles` tablosunda `role` kolonu yoksa:

```sql
-- Role kolonu ekle
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'client';

-- Role enum'u oluştur (eğer yoksa)
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('visitor', 'client', 'consultant', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Role kolonunu enum'a çevir
ALTER TABLE profiles 
ALTER COLUMN role TYPE user_role 
USING role::user_role;
```

### RLS Tamamen Devre Dışı Bırakma (Sadece Test İçin!)

⚠️ **UYARI:** Bu sadece test amaçlıdır, production'da kullanmayın!

```sql
-- RLS'i devre dışı bırak (TEHLİKELİ!)
ALTER TABLE session_types DISABLE ROW LEVEL SECURITY;
```

Test tamamlandıktan sonra mutlaka tekrar aktif edin:

```sql
-- RLS'i tekrar aktif et
ALTER TABLE session_types ENABLE ROW LEVEL SECURITY;
```

## 🎯 Diğer Tablolar İçin RLS

Aynı sorun diğer tablolarda da yaşanabilir. İşte tüm tabloların RLS durumu:

### Kontrol Sorgusu
```sql
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN (
  'profiles',
  'sessions',
  'session_types',
  'session_history',
  'time_slots',
  'daily_availability'
)
ORDER BY tablename;
```

### Eksik RLS Politikaları

Eğer diğer tablolarda da sorun yaşıyorsanız, benzer politikalar ekleyin:

**Sessions Tablosu:**
```sql
-- Admin'ler tüm seansları görebilir
CREATE POLICY "Admins can view all sessions" ON sessions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admin'ler tüm seansları yönetebilir
CREATE POLICY "Admins can manage all sessions" ON sessions
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
```

## 📚 Kaynaklar

- [Supabase RLS Dokümantasyonu](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Supabase Auth](https://supabase.com/docs/guides/auth)

## ✅ Kurulum Sonrası Kontrol

### 1. Admin Panelinde Test Edin
1. Admin olarak giriş yapın
2. Admin Dashboard > Seans Türleri sekmesine gidin
3. "Yeni Seans Türü" butonuna tıklayın
4. Formu doldurun ve kaydedin
5. Hata almadan kaydedilmeli ✅

### 2. Seans Rezervasyonunda Test Edin
1. Normal kullanıcı olarak giriş yapın
2. `/seans-al` sayfasına gidin
3. Seans türleri listesi görünmeli ✅
4. Sadece aktif seans türleri görünmeli ✅

### 3. Console'da Test Edin
```javascript
// Admin olarak test
const { data, error } = await supabase
  .from('session_types')
  .insert({
    name: 'Test Seans',
    description: 'Test',
    duration_minutes: 60,
    price: 100,
    is_online: true,
    is_in_person: true,
    is_active: true
  })

console.log('Data:', data)
console.log('Error:', error) // null olmalı
```

## 🎉 Başarılı Kurulum

Eğer yukarıdaki testler başarılı olduysa, RLS politikaları doğru şekilde yapılandırılmıştır!

**Sonraki Adımlar:**
1. ✅ Diğer admin kullanıcıları ekleyin
2. ✅ Seans türlerini ekleyin
3. ✅ Danışmanları ekleyin
4. ✅ Sistemi kullanmaya başlayın

## 📞 Destek

Sorun devam ediyorsa:
1. Console loglarını kontrol edin
2. Network sekmesini kontrol edin
3. Supabase Dashboard'da RLS politikalarını kontrol edin
4. Admin rolünü kontrol edin
5. Auth token'ı yenileyin

---

**Not:** Bu dosya `supabase-session-types-rls.sql` dosyası ile birlikte kullanılmalıdır.

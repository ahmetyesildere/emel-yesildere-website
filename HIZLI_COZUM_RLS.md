# 🚨 Hızlı Çözüm: Permission Denied (403)

## Sorun
```
permission denied for table session_types
```

## ⚡ Hızlı Çözüm (3 Adım)

### 1️⃣ Supabase SQL Editor'ü Açın
https://supabase.com → Projeniz → SQL Editor

### 2️⃣ Bu Kodu Çalıştırın
```sql
-- RLS'i aktif et
ALTER TABLE session_types ENABLE ROW LEVEL SECURITY;

-- Herkes aktif seans türlerini görebilir
CREATE POLICY "Anyone can view active session types" ON session_types
  FOR SELECT USING (is_active = true);

-- Admin'ler her şeyi yapabilir
CREATE POLICY "Admins can manage session types" ON session_types
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
```

### 3️⃣ Kendinizi Admin Yapın
```sql
-- Email'inizi yazın
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'SIZIN_EMAIL@example.com';
```

## ✅ Test Edin
1. Tarayıcıdan çıkış yapın
2. Tekrar giriş yapın
3. Admin panelinde seans türü eklemeyi deneyin
4. Çalışmalı! 🎉

## 📄 Detaylı Bilgi
Daha fazla bilgi için: `RLS_POLITIKALARI_KURULUM.md`

## 🔧 Alternatif: Tam Kurulum
Tüm politikalar için `supabase-session-types-rls.sql` dosyasını çalıştırın.

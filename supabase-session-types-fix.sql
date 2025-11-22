-- =============================================
-- SESSION TYPES TABLO DÜZELTMESİ VE RLS
-- =============================================

-- 1. Önce tabloyu kontrol et
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'session_types'
ORDER BY ordinal_position;

-- 2. Eksik kolonları ekle (eğer yoksa)
ALTER TABLE session_types 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE session_types 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 3. Mevcut kayıtlar için tarihleri güncelle (eğer NULL ise)
UPDATE session_types 
SET created_at = NOW() 
WHERE created_at IS NULL;

UPDATE session_types 
SET updated_at = NOW() 
WHERE updated_at IS NULL;

-- 4. RLS'i aktif et
ALTER TABLE session_types ENABLE ROW LEVEL SECURITY;

-- 5. Mevcut politikaları temizle (varsa)
DROP POLICY IF EXISTS "Anyone can view active session types" ON session_types;
DROP POLICY IF EXISTS "Admins can view all session types" ON session_types;
DROP POLICY IF EXISTS "Admins can insert session types" ON session_types;
DROP POLICY IF EXISTS "Admins can update session types" ON session_types;
DROP POLICY IF EXISTS "Admins can delete session types" ON session_types;
DROP POLICY IF EXISTS "Admins can manage session types" ON session_types;

-- 6. Herkes aktif seans türlerini görebilir (rezervasyon için)
CREATE POLICY "Anyone can view active session types" ON session_types
  FOR SELECT
  USING (is_active = true);

-- 7. Admin'ler tüm seans türlerini görebilir
CREATE POLICY "Admins can view all session types" ON session_types
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 8. Admin'ler yeni seans türü ekleyebilir
CREATE POLICY "Admins can insert session types" ON session_types
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 9. Admin'ler seans türlerini güncelleyebilir
CREATE POLICY "Admins can update session types" ON session_types
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 10. Admin'ler seans türlerini silebilir
CREATE POLICY "Admins can delete session types" ON session_types
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 11. Politikaları kontrol et
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd
FROM pg_policies
WHERE tablename = 'session_types'
ORDER BY policyname;

-- 12. Tablo yapısını kontrol et
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'session_types'
ORDER BY ordinal_position;

-- 13. Admin kullanıcıları kontrol et
SELECT id, email, role, first_name, last_name 
FROM profiles 
WHERE role = 'admin';

-- 14. Mevcut seans türlerini kontrol et (eğer varsa)
SELECT id, name, price, is_active, created_at 
FROM session_types 
ORDER BY name;

-- 15. Başarı mesajı
DO $$
BEGIN
  RAISE NOTICE '✅ Session types tablosu düzeltildi ve RLS politikaları eklendi!';
  RAISE NOTICE '📋 Şimdi yapmanız gerekenler:';
  RAISE NOTICE '1. Yukarıdaki sonuçları kontrol edin';
  RAISE NOTICE '2. Admin kullanıcı olduğunuzdan emin olun';
  RAISE NOTICE '3. Tarayıcıdan çıkış yapıp tekrar giriş yapın';
  RAISE NOTICE '4. Admin panelinde seans türü eklemeyi deneyin';
END $$;

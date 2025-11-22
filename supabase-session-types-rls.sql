-- =============================================
-- SESSION TYPES RLS POLİTİKALARI
-- =============================================

-- 1. RLS'i aktif et
ALTER TABLE session_types ENABLE ROW LEVEL SECURITY;

-- 2. Mevcut politikaları temizle (varsa)
DROP POLICY IF EXISTS "Anyone can view active session types" ON session_types;
DROP POLICY IF EXISTS "Admins can view all session types" ON session_types;
DROP POLICY IF EXISTS "Admins can insert session types" ON session_types;
DROP POLICY IF EXISTS "Admins can update session types" ON session_types;
DROP POLICY IF EXISTS "Admins can delete session types" ON session_types;

-- 3. Herkes aktif seans türlerini görebilir (rezervasyon için)
CREATE POLICY "Anyone can view active session types" ON session_types
  FOR SELECT
  USING (is_active = true);

-- 4. Admin'ler tüm seans türlerini görebilir
CREATE POLICY "Admins can view all session types" ON session_types
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 5. Admin'ler yeni seans türü ekleyebilir
CREATE POLICY "Admins can insert session types" ON session_types
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 6. Admin'ler seans türlerini güncelleyebilir
CREATE POLICY "Admins can update session types" ON session_types
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 7. Admin'ler seans türlerini silebilir
CREATE POLICY "Admins can delete session types" ON session_types
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 8. Politikaları kontrol et
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'session_types'
ORDER BY policyname;

-- 9. Test sorguları
-- Admin kullanıcı ID'sini kontrol et
SELECT id, email, role FROM profiles WHERE role = 'admin';

-- Mevcut seans türlerini kontrol et
SELECT * FROM session_types ORDER BY created_at DESC;

-- Yorum ekle
COMMENT ON TABLE session_types IS 'Seans türleri tablosu - RLS politikaları ile korunmaktadır';
COMMENT ON POLICY "Anyone can view active session types" ON session_types IS 'Herkes aktif seans türlerini görebilir';
COMMENT ON POLICY "Admins can view all session types" ON session_types IS 'Admin kullanıcılar tüm seans türlerini görebilir';
COMMENT ON POLICY "Admins can insert session types" ON session_types IS 'Admin kullanıcılar yeni seans türü ekleyebilir';
COMMENT ON POLICY "Admins can update session types" ON session_types IS 'Admin kullanıcılar seans türlerini güncelleyebilir';
COMMENT ON POLICY "Admins can delete session types" ON session_types IS 'Admin kullanıcılar seans türlerini silebilir';

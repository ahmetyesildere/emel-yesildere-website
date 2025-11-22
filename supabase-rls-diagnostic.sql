-- =============================================
-- RLS DİAGNOSTİK VE DÜZELTME
-- =============================================

-- 1. Auth kullanıcısını kontrol et
SELECT 
  'Auth User' as test,
  auth.uid() as user_id,
  auth.email() as user_email;

-- 2. Profiles tablosunda bu kullanıcıyı bul
SELECT 
  'Profile Data' as test,
  id,
  email,
  role,
  first_name,
  last_name
FROM profiles
WHERE id = auth.uid();

-- 3. RLS politikalarını kontrol et
SELECT 
  'RLS Policies' as test,
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'session_types';

-- 4. Manuel test - Admin kontrolü
SELECT 
  'Admin Check' as test,
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  ) as is_admin;

-- 5. Session types tablosunu kontrol et
SELECT 
  'Table Check' as test,
  COUNT(*) as total_rows,
  COUNT(*) FILTER (WHERE is_active = true) as active_rows
FROM session_types;

-- 6. RLS'i geçici olarak devre dışı bırak ve test et
ALTER TABLE session_types DISABLE ROW LEVEL SECURITY;

-- Test sorgusu
SELECT 
  'Without RLS' as test,
  COUNT(*) as can_read
FROM session_types;

-- RLS'i tekrar aktif et
ALTER TABLE session_types ENABLE ROW LEVEL SECURITY;

-- 7. Politikaları yeniden oluştur (daha basit versiyonlar)
DROP POLICY IF EXISTS "Public read active" ON session_types;
DROP POLICY IF EXISTS "Admin full access" ON session_types;

-- Basit okuma politikası - herkes aktif olanları görebilir
CREATE POLICY "Public read active" ON session_types
  FOR SELECT
  USING (is_active = true);

-- Basit admin politikası - admin her şeyi yapabilir
CREATE POLICY "Admin full access" ON session_types
  FOR ALL
  TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  )
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- 8. Test sorguları
-- Okuma testi
SELECT 
  'Read Test' as test,
  COUNT(*) as readable_rows
FROM session_types;

-- Yazma testi için geçici kayıt
INSERT INTO session_types (
  name,
  description,
  duration_minutes,
  price,
  is_online,
  is_in_person,
  is_active
) VALUES (
  'RLS Test',
  'Bu bir test kaydıdır',
  60,
  1.00,
  true,
  false,
  false
) RETURNING id, name;

-- Test kaydını sil
DELETE FROM session_types WHERE name = 'RLS Test';

-- 9. Sonuç özeti
DO $$
DECLARE
  v_user_id uuid;
  v_user_email text;
  v_user_role text;
  v_policy_count int;
BEGIN
  -- Kullanıcı bilgileri
  SELECT auth.uid() INTO v_user_id;
  SELECT email, role INTO v_user_email, v_user_role
  FROM profiles WHERE id = v_user_id;
  
  -- Politika sayısı
  SELECT COUNT(*) INTO v_policy_count
  FROM pg_policies WHERE tablename = 'session_types';
  
  RAISE NOTICE '========================================';
  RAISE NOTICE 'RLS DİAGNOSTİK SONUÇLARI';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Kullanıcı ID: %', v_user_id;
  RAISE NOTICE 'Email: %', v_user_email;
  RAISE NOTICE 'Role: %', v_user_role;
  RAISE NOTICE 'Politika Sayısı: %', v_policy_count;
  RAISE NOTICE '========================================';
  
  IF v_user_role = 'admin' THEN
    RAISE NOTICE '✅ Kullanıcı admin rolüne sahip';
  ELSE
    RAISE NOTICE '❌ Kullanıcı admin değil: %', v_user_role;
  END IF;
  
  IF v_policy_count > 0 THEN
    RAISE NOTICE '✅ RLS politikaları mevcut';
  ELSE
    RAISE NOTICE '❌ RLS politikası bulunamadı';
  END IF;
  
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Şimdi tarayıcıdan çıkış yapıp tekrar giriş yapın!';
  RAISE NOTICE '========================================';
END $$;

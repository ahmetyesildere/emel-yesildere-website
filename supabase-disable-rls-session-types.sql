-- =============================================
-- SESSION TYPES RLS'İ KAPAT VE API ÜZERİNDEN YÖNET
-- =============================================

-- 1. Tüm RLS politikalarını kaldır
DROP POLICY IF EXISTS "Anyone can view active session types" ON session_types;
DROP POLICY IF EXISTS "Admins can view all session types" ON session_types;
DROP POLICY IF EXISTS "Admins can insert session types" ON session_types;
DROP POLICY IF EXISTS "Admins can update session types" ON session_types;
DROP POLICY IF EXISTS "Admins can delete session types" ON session_types;
DROP POLICY IF EXISTS "Admins can manage session types" ON session_types;
DROP POLICY IF EXISTS "Public read active" ON session_types;
DROP POLICY IF EXISTS "Admin full access" ON session_types;
DROP POLICY IF EXISTS "Allow all for authenticated" ON session_types;

-- 2. RLS'i tamamen kapat
ALTER TABLE session_types DISABLE ROW LEVEL SECURITY;

-- 3. Kontrol et
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'session_types';

-- 4. Test sorgusu
SELECT COUNT(*) as total_session_types FROM session_types;

-- 5. Başarı mesajı
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ Session types RLS devre dışı bırakıldı';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Artık session types tablosuna erişebilirsiniz.';
  RAISE NOTICE 'Güvenlik backend API üzerinden sağlanacak.';
  RAISE NOTICE '========================================';
END $$;

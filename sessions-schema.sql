-- Sessions tablosuna session_mode kolonu ekle
ALTER TABLE sessions 
ADD COLUMN IF NOT EXISTS session_mode VARCHAR(20) CHECK (session_mode IN ('online', 'face_to_face'));

-- Mevcut sessions için default değer ata
UPDATE sessions 
SET session_mode = CASE 
  WHEN type = 'online' THEN 'online'
  ELSE 'face_to_face'
END 
WHERE session_mode IS NULL;

-- İndeks ekle
CREATE INDEX IF NOT EXISTS idx_sessions_mode ON sessions(session_mode);

-- Yorum ekle
COMMENT ON COLUMN sessions.session_mode IS 'Seans türü: online (video konferans) veya face_to_face (yüz yüze)';
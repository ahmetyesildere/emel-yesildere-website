-- =============================================
-- SEANS İPTAL VE ERTELEME SİSTEMİ
-- =============================================

-- 1. Sessions tablosuna yeni alanlar ekle
ALTER TABLE sessions 
ADD COLUMN IF NOT EXISTS cancellation_reason TEXT,
ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS cancelled_by UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS reschedule_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS original_session_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS reschedule_reason TEXT,
ADD COLUMN IF NOT EXISTS rescheduled_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS rescheduled_by UUID REFERENCES profiles(id);

-- 2. Session History tablosu - tüm değişiklikleri takip et
CREATE TABLE IF NOT EXISTS session_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  action_type VARCHAR(50) NOT NULL CHECK (action_type IN ('created', 'rescheduled', 'cancelled', 'completed', 'no_show')),
  action_by UUID NOT NULL REFERENCES profiles(id),
  old_session_date TIMESTAMPTZ,
  new_session_date TIMESTAMPTZ,
  reason TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. İndeksler
CREATE INDEX IF NOT EXISTS idx_sessions_cancelled_at ON sessions(cancelled_at);
CREATE INDEX IF NOT EXISTS idx_sessions_cancelled_by ON sessions(cancelled_by);
CREATE INDEX IF NOT EXISTS idx_session_history_session_id ON session_history(session_id);
CREATE INDEX IF NOT EXISTS idx_session_history_action_type ON session_history(action_type);
CREATE INDEX IF NOT EXISTS idx_session_history_created_at ON session_history(created_at);

-- 4. RLS Politikaları
ALTER TABLE session_history ENABLE ROW LEVEL SECURITY;

-- Session history görüntüleme - sadece ilgili kullanıcılar
CREATE POLICY "Users can view session history they are part of" ON session_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM sessions 
      WHERE sessions.id = session_history.session_id 
      AND (sessions.client_id = auth.uid() OR sessions.consultant_id = auth.uid())
    )
  );

-- Session history oluşturma - sadece ilgili kullanıcılar
CREATE POLICY "Users can create session history for their sessions" ON session_history
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM sessions 
      WHERE sessions.id = session_history.session_id 
      AND (sessions.client_id = auth.uid() OR sessions.consultant_id = auth.uid())
    )
  );

-- 5. Trigger: Session değişikliklerini otomatik kaydet
CREATE OR REPLACE FUNCTION log_session_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Eğer status değişmişse
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO session_history (
      session_id,
      action_type,
      action_by,
      old_session_date,
      new_session_date,
      reason,
      notes
    ) VALUES (
      NEW.id,
      NEW.status,
      COALESCE(NEW.cancelled_by, NEW.rescheduled_by, auth.uid()),
      OLD.session_date,
      NEW.session_date,
      COALESCE(NEW.cancellation_reason, NEW.reschedule_reason),
      COALESCE(NEW.consultant_notes, NEW.client_notes)
    );
  END IF;
  
  -- Eğer tarih değişmişse (erteleme)
  IF OLD.session_date IS DISTINCT FROM NEW.session_date THEN
    INSERT INTO session_history (
      session_id,
      action_type,
      action_by,
      old_session_date,
      new_session_date,
      reason
    ) VALUES (
      NEW.id,
      'rescheduled',
      COALESCE(NEW.rescheduled_by, auth.uid()),
      OLD.session_date,
      NEW.session_date,
      NEW.reschedule_reason
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger'ı sessions tablosuna ekle
DROP TRIGGER IF EXISTS session_changes_trigger ON sessions;
CREATE TRIGGER session_changes_trigger
  AFTER UPDATE ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION log_session_changes();

-- 6. İptal politikası kontrolü için fonksiyon
CREATE OR REPLACE FUNCTION can_cancel_session(session_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  session_date TIMESTAMPTZ;
  hours_until_session INTEGER;
BEGIN
  -- Seans tarihini al
  SELECT s.session_date INTO session_date
  FROM sessions s
  WHERE s.id = session_id;
  
  -- Seansa kaç saat kaldığını hesapla
  hours_until_session := EXTRACT(EPOCH FROM (session_date - NOW())) / 3600;
  
  -- En az 24 saat önceden iptal edilebilir
  RETURN hours_until_session >= 24;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Erteleme politikası kontrolü için fonksiyon
CREATE OR REPLACE FUNCTION can_reschedule_session(session_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  session_date TIMESTAMPTZ;
  reschedule_count INTEGER;
  hours_until_session INTEGER;
BEGIN
  -- Seans bilgilerini al
  SELECT s.session_date, s.reschedule_count 
  INTO session_date, reschedule_count
  FROM sessions s
  WHERE s.id = session_id;
  
  -- Seansa kaç saat kaldığını hesapla
  hours_until_session := EXTRACT(EPOCH FROM (session_date - NOW())) / 3600;
  
  -- Maksimum 2 kez ertelenebilir ve en az 24 saat önceden
  RETURN reschedule_count < 2 AND hours_until_session >= 24;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Yorum ekle
COMMENT ON TABLE session_history IS 'Seans değişiklik geçmişi - iptal, erteleme, tamamlanma vb.';
COMMENT ON FUNCTION can_cancel_session IS 'Seansın iptal edilip edilemeyeceğini kontrol eder (24 saat kuralı)';
COMMENT ON FUNCTION can_reschedule_session IS 'Seansın ertelenip ertelenemeyeceğini kontrol eder (max 2 kez, 24 saat kuralı)';

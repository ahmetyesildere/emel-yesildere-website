-- Seans türleri için sıralama kolonu ekle
ALTER TABLE session_types 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Mevcut kayıtlara sıra numarası ata (alfabetik sıraya göre)
WITH ordered_types AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY name) as row_num
  FROM session_types
)
UPDATE session_types
SET display_order = ordered_types.row_num
FROM ordered_types
WHERE session_types.id = ordered_types.id;

-- Index ekle (performans için)
CREATE INDEX IF NOT EXISTS idx_session_types_display_order 
ON session_types(display_order);

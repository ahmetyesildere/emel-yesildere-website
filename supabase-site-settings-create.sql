-- Site Settings tablosu zaten var, sadece video ayarını ekle/güncelle
-- Eğer tablo yoksa, lütfen önce ana schema'yı çalıştırın

-- Varsayılan video ayarını ekle/güncelle
INSERT INTO site_settings (setting_key, setting_value)
VALUES (
  'homepage_video',
  '{"id":"default","title":"Emel Yeşildere ile Tanışın","description":"Duygu temizliği yolculuğunuzu keşfedin","videoUrl":"/media/videos/C5881.mp4","thumbnailUrl":"/media/images/tanıtım video.png","fileName":"C5881.mp4","thumbnailFileName":"tanıtım video.png","isActive":true,"uploadDate":"2024-01-15T10:00:00.000Z"}'::jsonb
)
ON CONFLICT (setting_key) DO UPDATE 
SET setting_value = EXCLUDED.setting_value, updated_at = NOW();

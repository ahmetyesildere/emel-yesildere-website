-- Site ayarları tablosu
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- İletişim bilgileri için varsayılan kayıt
INSERT INTO site_settings (setting_key, setting_value) VALUES 
('contact_info', '{
  "phone": "+90 266 714 1234",
  "email": "info@emelyesildere.com", 
  "whatsapp": "+90 532 123 4567",
  "address": "Günaydın mah. Terziler cad. No:74 Kat 3 Daire 5 Bandırma-Balıkesir",
  "mapUrl": "https://maps.google.com/maps?q=Günaydın+Mahallesi+Terziler+Caddesi+No:74+Bandırma+Balıkesir&t=&z=16&ie=UTF8&iwloc=&output=embed",
  "workingHours": {
    "weekdays": "09:00 - 18:00",
    "saturday": "10:00 - 16:00", 
    "sunday": "Kapalı"
  }
}')
ON CONFLICT (setting_key) DO NOTHING;

-- RLS politikaları
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir
CREATE POLICY "Anyone can read site settings" ON site_settings
  FOR SELECT USING (true);

-- Sadece admin güncelleyebilir (profiles tablosunda role='admin' olanlar)
CREATE POLICY "Only admins can update site settings" ON site_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Updated_at otomatik güncelleme
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_site_settings_updated_at 
  BEFORE UPDATE ON site_settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
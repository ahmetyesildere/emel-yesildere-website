-- Blog posts tablosu
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  meta_title VARCHAR(255),
  meta_description TEXT,
  tags TEXT[],
  view_count INTEGER DEFAULT 0
);

-- Blog kategorileri tablosu
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog post kategorileri ilişki tablosu
CREATE TABLE IF NOT EXISTS blog_post_categories (
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES blog_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);

-- RLS politikaları
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_categories ENABLE ROW LEVEL SECURITY;

-- Herkes yayınlanmış blog yazılarını okuyabilir
CREATE POLICY "Anyone can read published blog posts" ON blog_posts
  FOR SELECT USING (status = 'published');

-- Sadece admin ve yazarlar blog yazılarını yönetebilir
CREATE POLICY "Admins and authors can manage blog posts" ON blog_posts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND (profiles.role = 'admin' OR profiles.id = blog_posts.author_id)
    )
  );

-- Herkes kategorileri okuyabilir
CREATE POLICY "Anyone can read categories" ON blog_categories
  FOR SELECT USING (true);

-- Sadece adminler kategorileri yönetebilir
CREATE POLICY "Only admins can manage categories" ON blog_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Blog post kategorileri için politikalar
CREATE POLICY "Anyone can read post categories" ON blog_post_categories
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage post categories" ON blog_post_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Varsayılan kategoriler
INSERT INTO blog_categories (name, slug, description) VALUES
  ('Genel', 'genel', 'Genel blog yazıları'),
  ('Psikoloji', 'psikoloji', 'Psikoloji ile ilgili yazılar'),
  ('Yaşam Koçluğu', 'yasam-koclugu', 'Yaşam koçluğu ve kişisel gelişim'),
  ('İlişkiler', 'iliskiler', 'İnsan ilişkileri ve iletişim'),
  ('Stres Yönetimi', 'stres-yonetimi', 'Stres ve kaygı yönetimi')
ON CONFLICT (slug) DO NOTHING;
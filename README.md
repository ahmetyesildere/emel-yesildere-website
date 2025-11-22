# Emel Yeşildere - Danışmanlık Platformu

Modern ve kullanıcı dostu bir online danışmanlık platformu. Next.js, React ve Supabase teknolojileri kullanılarak geliştirilmiştir.

🚀 **Vercel Deploy Ready** - Runtime hatası düzeltildi!

## 🚀 Özellikler

- **Kullanıcı Yönetimi**: Güvenli kayıt ve giriş sistemi
- **Randevu Sistemi**: Online randevu alma ve yönetimi
- **Video Görüşme**: Daily.co entegrasyonu ile video konferans
- **Profil Yönetimi**: Kullanıcı ve danışman profil yönetimi
- **Mesajlaşma**: Gerçek zamanlı mesajlaşma sistemi
- **Ödeme Sistemi**: Güvenli ödeme işlemleri
- **Responsive Tasarım**: Tüm cihazlarda uyumlu arayüz

## 🛠️ Teknolojiler

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Video**: Daily.co API
- **UI Components**: Radix UI, Headless UI
- **Deployment**: Render.com

## 📦 Kurulum

1. **Repository'yi klonlayın:**
```bash
git clone https://github.com/[kullanıcı-adınız]/emel-yesildere-website.git
cd emel-yesildere-website
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Çevre değişkenlerini ayarlayın:**
`.env.local` dosyası oluşturun ve gerekli değişkenleri ekleyin:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_DAILY_API_KEY=your_daily_api_key
```

4. **Geliştirme sunucusunu başlatın:**
```bash
npm run dev
```

5. **Tarayıcınızda açın:**
[http://localhost:3000](http://localhost:3000)

## 🗄️ Veritabanı

Proje Supabase PostgreSQL veritabanı kullanmaktadır. Veritabanı şeması `database-schema.sql` dosyasında bulunmaktadır.

## 🚀 Deployment

### Render.com
Proje Render.com üzerinde deploy edilmek üzere yapılandırılmıştır. `render.yaml` dosyası deployment ayarlarını içerir.

### Vercel
Alternatif olarak Vercel üzerinde de deploy edilebilir:
```bash
npm run build
```

## 📝 Lisans

Bu proje özel bir projedir ve telif hakları saklıdır.

## 📞 İletişim

Sorularınız için: [email@example.com]

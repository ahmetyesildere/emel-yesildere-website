import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gizlilik Politikası - Emel Yeşildere',
  description: 'Kişisel verilerinizin korunması ve gizlilik politikamız hakkında detaylı bilgiler.',
}

export default function GizlilikPolitikasiPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Gizlilik Politikası</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Genel Bilgiler</h2>
              <p className="text-gray-700 leading-relaxed">
                Bu gizlilik politikası, Emel Yeşildere tarafından sunulan hizmetler kapsamında 
                toplanan kişisel verilerin işlenmesi, korunması ve kullanılması hakkında bilgi vermektedir.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Toplanan Bilgiler</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>İletişim bilgileri (ad, soyad, e-posta, telefon)</li>
                <li>Randevu ve seans bilgileri</li>
                <li>Sağlık ve terapi geçmişi (gönüllü olarak paylaşılan)</li>
                <li>Website kullanım verileri</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Verilerin Kullanımı</h2>
              <p className="text-gray-700 leading-relaxed">
                Toplanan veriler yalnızca hizmet kalitesini artırmak, randevu yönetimi, 
                iletişim kurma ve yasal yükümlülükleri yerine getirmek amacıyla kullanılır.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Veri Güvenliği</h2>
              <p className="text-gray-700 leading-relaxed">
                Kişisel verileriniz en yüksek güvenlik standartlarıyla korunmaktadır. 
                Veriler şifrelenerek saklanır ve yetkisiz erişime karşı korunur.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. İletişim</h2>
              <p className="text-gray-700 leading-relaxed">
                Gizlilik politikası hakkında sorularınız için: 
                <a href="mailto:info@emelyesildere.com" className="text-blue-600 hover:underline ml-1">
                  info@emelyesildere.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
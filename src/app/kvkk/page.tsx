import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'KVKK Aydınlatma Metni - Emel Yeşildere',
  description: 'Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metni ve veri işleme politikalarımız.',
}

export default function KVKKPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">KVKK Aydınlatma Metni</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metni
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Veri Sorumlusu</h2>
              <p className="text-gray-700 leading-relaxed">
                Kişisel verilerinizin işlenmesinden sorumlu olan Emel Yeşildere, 
                6698 sayılı KVKK hükümlerine uygun olarak hareket etmektedir.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. İşlenen Kişisel Veriler</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Kimlik bilgileri (ad, soyad, doğum tarihi)</li>
                <li>İletişim bilgileri (telefon, e-posta, adres)</li>
                <li>Sağlık verileri (gönüllü olarak paylaşılan)</li>
                <li>Finansal veriler (ödeme bilgileri)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. İşleme Amaçları</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Hizmet sunumu ve randevu yönetimi</li>
                <li>Müşteri memnuniyeti ve kalite artırma</li>
                <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                <li>İletişim ve bilgilendirme</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Haklarınız</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                KVKK kapsamında aşağıdaki haklara sahipsiniz:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                <li>İşlenen verileriniz hakkında bilgi talep etme</li>
                <li>Verilerin düzeltilmesini veya silinmesini isteme</li>
                <li>İşlemeye itiraz etme</li>
                <li>Zararın giderilmesini talep etme</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. İletişim</h2>
              <p className="text-gray-700 leading-relaxed">
                KVKK haklarınızı kullanmak için: 
                <a href="mailto:kvkk@emelyesildere.com" className="text-blue-600 hover:underline ml-1">
                  kvkk@emelyesildere.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Çerez Politikası - Emel Yeşildere',
  description: 'Website\'mizde kullanılan çerezler ve veri toplama yöntemleri hakkında bilgiler.',
}

export default function CerezPolitikasiPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Çerez Politikası</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Çerez Nedir?</h2>
              <p className="text-gray-700 leading-relaxed">
                Çerezler, web sitelerinin kullanıcı deneyimini iyileştirmek için 
                tarayıcınızda saklanan küçük metin dosyalarıdır.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Kullandığımız Çerez Türleri</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Zorunlu Çerezler</h3>
                  <p className="text-gray-700">Website'nin temel işlevlerini yerine getirmesi için gereklidir.</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Analitik Çerezler</h3>
                  <p className="text-gray-700">Website kullanımını analiz etmek ve iyileştirmeler yapmak için kullanılır.</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Tercih Çerezleri</h3>
                  <p className="text-gray-700">Kullanıcı tercihlerini hatırlamak için kullanılır.</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Çerez Yönetimi</h2>
              <p className="text-gray-700 leading-relaxed">
                Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilir veya silebilirsiniz. 
                Ancak bu durumda website'nin bazı özellikleri düzgün çalışmayabilir.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Üçüncü Taraf Çerezleri</h2>
              <p className="text-gray-700 leading-relaxed">
                Google Analytics gibi üçüncü taraf hizmetleri kendi çerez politikalarına tabidir.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
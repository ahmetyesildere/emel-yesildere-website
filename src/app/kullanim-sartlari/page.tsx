import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kullanım Şartları - Emel Yeşildere',
  description: 'Website ve hizmetlerimizin kullanım şartları ve koşulları.',
}

export default function KullanimSartlariPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Kullanım Şartları</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Genel Koşullar</h2>
              <p className="text-gray-700 leading-relaxed">
                Bu website ve sunulan hizmetleri kullanarak aşağıdaki şartları kabul etmiş sayılırsınız.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Hizmet Kapsamı</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Yaşam koçluğu ve kişisel gelişim danışmanlığı</li>
                <li>Holistik koçluk ve enerji çalışmaları</li>
                <li>Duygu temizliği ve travma iyileştirme</li>
                <li>Online ve yüz yüze seanslar</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Kullanıcı Sorumlulukları</h2>
              <p className="text-gray-700 leading-relaxed">
                Kullanıcılar doğru bilgi vermek, randevulara zamanında katılmak ve 
                hizmet sürecine aktif olarak katılmakla yükümlüdür.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Erteleme Politikası</h2>
              <p className="text-gray-700 leading-relaxed">
                Seanslar iptal edilmemektedir. Ücret iadesi yapılmaz ancak seansınız uygun bir gün ve saate ertelenebilir. 
                En fazla 2 kez erteleme yapabilirsiniz. Erteleme için en az 24 saat önceden bildirim yapılmalıdır.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Sorumluluk Reddi</h2>
              <p className="text-gray-700 leading-relaxed">
                Sunulan hizmetler tıbbi tedavi yerine geçmez. Ciddi sağlık sorunları için 
                mutlaka uzman doktor görüşü alınmalıdır.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
import AdvancedContactTest from '@/components/debug/advanced-contact-test'

export default function AdvancedContactTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Gelişmiş İletişim Bilgileri Testi
          </h1>
          <p className="text-gray-600">
            localStorage ve Cookie sistemlerini detaylı test edin
          </p>
        </div>
        <AdvancedContactTest />
      </div>
    </div>
  )
}
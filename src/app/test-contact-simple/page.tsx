import SimpleContactTest from '@/components/debug/simple-contact-test'

export default function SimpleContactTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Basit İletişim Bilgileri Testi
          </h1>
          <p className="text-gray-600">
            İletişim bilgilerinin kalıcılığını test edin
          </p>
        </div>
        <SimpleContactTest />
      </div>
    </div>
  )
}
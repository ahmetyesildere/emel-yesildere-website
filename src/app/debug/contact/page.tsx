import ContactDebug from '@/components/debug/contact-debug'
import ContactDisplay from '@/components/debug/contact-display'

export default function ContactDebugPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 space-y-8">
        <ContactDisplay />
        <ContactDebug />
      </div>
    </div>
  )
}
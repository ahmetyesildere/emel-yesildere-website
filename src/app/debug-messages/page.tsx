import { MessagesDebug } from '@/components/debug/messages-debug'

export default function DebugMessagesPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Messages Tablo Debug</h1>
      <MessagesDebug />
    </div>
  )
}
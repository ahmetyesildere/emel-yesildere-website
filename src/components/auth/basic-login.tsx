'use client'

import { useState } from 'react'
import { login } from '@/lib/simple-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function BasicLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const result = await login(email, password)
    
    if (result.success) {
      setMessage('Giriş başarılı!')
      window.location.href = '/'
    } else {
      setMessage(`Hata: ${result.error}`)
    }
    
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Giriş Yap</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <Input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
        </Button>
      </form>
      
      {message && (
        <p className={`mt-4 text-sm ${message.includes('Hata') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </div>
  )
}
'use client'

import { useState } from 'react'
import { register } from '@/lib/simple-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function BasicRegister() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const result = await register(email, password, firstName, lastName)
    
    if (result.success) {
      setMessage('Kayıt başarılı!')
      // Form temizle
      setEmail('')
      setPassword('')
      setFirstName('')
      setLastName('')
    } else {
      setMessage(`Hata: ${result.error}`)
    }
    
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Kayıt Ol</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Ad"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        
        <Input
          type="text"
          placeholder="Soyad"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        
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
          {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
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
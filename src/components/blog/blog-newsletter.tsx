'use client'

import React, { useState } from 'react'
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const BlogNewsletter = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setStatus('error')
      setMessage('Lütfen geçerli bir e-posta adresi girin.')
      return
    }

    setStatus('loading')
    
    // Simulated API call
    setTimeout(() => {
      setStatus('success')
      setMessage('Başarıyla abone oldunuz! Teşekkür ederiz.')
      setEmail('')
    }, 1500)
  }

  return (
    <section className="py-20 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
            <CardContent className="p-12 text-center">
              {/* Icon */}
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <Mail className="w-10 h-10 text-white" />
              </div>

              {/* Heading */}
              <h2 className="text-4xl font-bold text-white mb-4">
                Yeni Yazılardan Haberdar Olun
              </h2>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Kişisel gelişim, duygu temizliği ve holistik koçluk alanındaki en güncel yazılarımızı 
                e-posta kutunuzda bulun. Haftada sadece bir e-posta, spam yok.
              </p>

              {/* Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Özel İçerikler</h3>
                  <p className="text-white/80 text-sm">Sadece abone olanlara özel yazılar ve ipuçları</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Haftalık Özet</h3>
                  <p className="text-white/80 text-sm">Haftanın en önemli yazıları tek e-postada</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Ücretsiz</h3>
                  <p className="text-white/80 text-sm">Tamamen ücretsiz, istediğiniz zaman ayrılabilirsiniz</p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    type="email"
                    placeholder="E-posta adresiniz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30 focus:border-white/50"
                    disabled={status === 'loading'}
                  />
                  <Button
                    type="submit"
                    disabled={status === 'loading'}
                    className="bg-white text-purple-600 hover:bg-white/90 font-semibold px-8 py-3 whitespace-nowrap"
                  >
                    {status === 'loading' ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                        <span>Gönderiliyor...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Send className="w-4 h-4" />
                        <span>Abone Ol</span>
                      </div>
                    )}
                  </Button>
                </div>

                {/* Status Message */}
                {message && (
                  <div className={`mt-4 p-3 rounded-lg flex items-center justify-center space-x-2 ${
                    status === 'success' 
                      ? 'bg-green-500/20 text-green-100' 
                      : 'bg-red-500/20 text-red-100'
                  }`}>
                    {status === 'success' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <AlertCircle className="w-5 h-5" />
                    )}
                    <span>{message}</span>
                  </div>
                )}
              </form>

              {/* Privacy Note */}
              <p className="text-white/70 text-sm mt-6">
                E-posta adresinizi kimseyle paylaşmayız. 
                <br />
                <a href="#" className="underline hover:text-white transition-colors">
                  Gizlilik Politikası
                </a>
                'mızı okuyabilirsiniz.
              </p>

              {/* Stats */}
              <div className="flex items-center justify-center space-x-8 mt-8 pt-8 border-t border-white/20">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">2,500+</div>
                  <div className="text-white/80 text-sm">Mutlu Abone</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">50+</div>
                  <div className="text-white/80 text-sm">Yazı Yayınlandı</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">4.9/5</div>
                  <div className="text-white/80 text-sm">Memnuniyet Oranı</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default BlogNewsletter
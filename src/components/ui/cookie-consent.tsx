'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Cookie, Settings, ChevronUp, ChevronDown, Shield, BarChart3, Heart, Megaphone } from 'lucide-react'

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  preferences: boolean
}

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false
  })

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) {
      setTimeout(() => setShowConsent(true), 2000)
    }
  }, [])

  const acceptAll = () => {
    const allAccepted = { necessary: true, analytics: true, marketing: true, preferences: true }
    localStorage.setItem('cookie_consent', 'accepted')
    localStorage.setItem('cookie_preferences', JSON.stringify(allAccepted))
    setShowConsent(false)
  }

  const rejectAll = () => {
    const onlyNecessary = { necessary: true, analytics: false, marketing: false, preferences: false }
    localStorage.setItem('cookie_consent', 'rejected')
    localStorage.setItem('cookie_preferences', JSON.stringify(onlyNecessary))
    setShowConsent(false)
  }

  const savePreferences = () => {
    localStorage.setItem('cookie_consent', 'custom')
    localStorage.setItem('cookie_preferences', JSON.stringify(preferences))
    setShowConsent(false)
  }

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }))
  }

  if (!showConsent) return null

  const cookieTypes = [
    { key: 'necessary' as keyof CookiePreferences, icon: Shield, label: 'Zorunlu', color: 'text-green-600', required: true },
    { key: 'analytics' as keyof CookiePreferences, icon: BarChart3, label: 'Analitik', color: 'text-blue-600', required: false },
    { key: 'preferences' as keyof CookiePreferences, icon: Heart, label: 'Tercihler', color: 'text-purple-600', required: false },
    { key: 'marketing' as keyof CookiePreferences, icon: Megaphone, label: 'Pazarlama', color: 'text-orange-600', required: false }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-2xl border-t-4 border-blue-500 animate-in slide-in-from-bottom-2 duration-500">
      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {cookieTypes.map((type) => {
                const IconComponent = type.icon
                const isEnabled = preferences[type.key]
                
                return (
                  <div key={type.key} className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/15 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${
                        type.key === 'necessary' ? 'from-green-500 to-green-600' :
                        type.key === 'analytics' ? 'from-blue-500 to-blue-600' :
                        type.key === 'preferences' ? 'from-purple-500 to-purple-600' :
                        'from-orange-500 to-orange-600'
                      } flex items-center justify-center`}>
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-white">{type.label}</span>
                        {type.required && (
                          <div className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full mt-1 inline-block">
                            Zorunlu
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => togglePreference(type.key)}
                      disabled={type.required}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shadow-lg ${
                        isEnabled 
                          ? 'bg-gradient-to-r from-green-500 to-green-600' 
                          : type.required 
                            ? 'bg-gray-600 cursor-not-allowed' 
                            : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${
                          isEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Cookie Bar */}
      <div className="container mx-auto px-6 py-5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left Content */}
          <div className="flex items-start space-x-4 flex-1">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <Cookie className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center">
                🍪 Bu Site Çerezler Kullanır
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Web sitemizde en iyi deneyimi yaşamanız için çerezler kullanıyoruz. 
                Siteyi kullanmaya devam ederek çerez kullanımını kabul etmiş olursunuz.{' '}
                <a href="/cerez-politikasi" className="text-blue-400 hover:text-blue-300 underline font-medium">
                  Detaylı bilgi →
                </a>
              </p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-center space-x-2 px-5 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 border border-gray-600 hover:border-gray-500"
            >
              <Settings className="w-4 h-4" />
              <span>Tercihleri Yönet</span>
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>

            {isExpanded && (
              <Button
                onClick={savePreferences}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg"
                size="sm"
              >
                💾 Kaydet
              </Button>
            )}

            <Button
              onClick={rejectAll}
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-red-600/20 font-medium px-5 py-3 rounded-xl border border-gray-600 hover:border-red-500"
            >
              ❌ Reddet
            </Button>

            <Button
              onClick={acceptAll}
              size="sm"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              ✅ Tümünü Kabul Et
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CookieConsent
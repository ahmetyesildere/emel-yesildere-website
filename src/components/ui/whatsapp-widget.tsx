'use client'

import React, { useState } from 'react'
import { MessageCircle, X, Clock, CheckCircle, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useWhatsApp } from '@/hooks/use-whatsapp'

const WhatsAppWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { config, createWhatsAppLink, isWorkingHours, getStatusMessage } = useWhatsApp()

  if (!config.isActive) return null

  const quickActions = [
    {
      id: 'general',
      title: 'Genel Sorular',
      description: 'Diğer konular hakkında',
      icon: '💬',
      templateType: 'general' as const
    }
  ]

  const handleQuickAction = (templateType: 'consultation' | 'serviceInquiry' | 'general' | 'appointment') => {
    const link = createWhatsAppLink(templateType)
    if (link !== '#') {
      window.open(link, '_blank')
      setIsOpen(false)
    }
  }

  const handleDirectMessage = () => {
    const link = createWhatsAppLink('general', config.welcomeMessage)
    if (link !== '#') {
      window.open(link, '_blank')
      setIsOpen(false)
    }
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        {isOpen && (
          <Card className="mb-4 w-80 shadow-2xl border-0 overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
            <CardHeader className="bg-green-500 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">{config.businessName}</CardTitle>
                    <div className="flex items-center space-x-1 text-sm">
                      {isWorkingHours() ? (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          <span>Online</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3" />
                          <span>Offline</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {/* Status Message */}
              <div className="p-4 bg-gray-50 border-b">
                <p className="text-sm text-gray-600">{getStatusMessage()}</p>
              </div>

              {/* Quick Actions */}
              <div className="p-4 space-y-2">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Hızlı İşlemler:</h4>
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action.templateType)}
                    className="w-full p-3 text-left rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{action.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 group-hover:text-green-700">
                          {action.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {action.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Direct Message */}
              <div className="p-4 border-t bg-gray-50">
                <Button
                  onClick={handleDirectMessage}
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Direkt Mesaj Gönder
                </Button>
              </div>

              {/* Working Hours */}
              {config.workingHours.enabled && (
                <div className="p-3 bg-gray-100 text-center">
                  <p className="text-xs text-gray-600">
                    Çalışma Saatleri: {config.workingHours.start} - {config.workingHours.end}
                  </p>
                  <p className="text-xs text-gray-500">Pazartesi - Cuma</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Chat Bubble */}
        {!isOpen && (
          <div className="absolute bottom-16 right-0 mb-2 mr-2">
            <div className="relative bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-xl p-4 max-w-xs">
              <div className="text-sm text-white font-bold tracking-wide">
                YARDIM İSTER MİSİNİZ?
              </div>
              {/* Speech bubble tail */}
              <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-3 h-3 bg-green-500"></div>
            </div>
          </div>
        )}

        {/* Floating Button */}
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 relative animate-pulse hover:animate-none"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
          
          {/* Online Status Indicator */}
          {!isOpen && isWorkingHours() && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-ping" />
          )}
        </Button>
      </div>
    </>
  )
}

export default WhatsAppWidget
'use client'

import React from 'react'
import { MessageCircle, Clock, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useWhatsApp } from '@/hooks/use-whatsapp'

interface WhatsAppButtonProps {
  templateType: 'consultation' | 'serviceInquiry' | 'general' | 'appointment'
  serviceName?: string
  customMessage?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'default' | 'lg'
  className?: string
  children?: React.ReactNode
  showStatus?: boolean
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  templateType,
  serviceName,
  customMessage,
  variant = 'default',
  size = 'default',
  className = '',
  children,
  showStatus = false
}) => {
  const { config, createWhatsAppLink, isWorkingHours, getStatusMessage } = useWhatsApp()

  const handleClick = () => {
    const link = createWhatsAppLink(templateType, customMessage, serviceName)
    if (link !== '#') {
      window.open(link, '_blank')
    }
  }

  const getButtonText = () => {
    if (children) return children

    switch (templateType) {
      case 'consultation':
        return '🎯 Ücretsiz Ön Görüşme'
      case 'serviceInquiry':
        return '💬 Bilgi Al'
      case 'appointment':
        return '📅 Randevu Al'
      default:
        return '💬 Mesaj Gönder'
    }
  }

  const getButtonStyle = () => {
    const baseStyle = 'transition-all duration-300 hover:scale-105 font-semibold shadow-lg hover:shadow-xl'
    
    if (variant === 'default') {
      return `${baseStyle} bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0`
    }
    
    return baseStyle
  }

  if (!config.isActive) {
    return (
      <Button
        variant="outline"
        size={size}
        disabled
        className={`${className} opacity-50 cursor-not-allowed`}
      >
        <svg 
          className="w-4 h-4 mr-2" 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3.04 1.05 4.36L2 22l5.64-1.05C9.96 21.64 11.46 22 13 22h-1c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.4 0-2.76-.3-4-.84L6.5 19.5l.34-1.5C6.3 16.76 6 15.4 6 14c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z"/>
          <circle cx="8.5" cy="12" r="1.5"/>
          <circle cx="12" cy="12" r="1.5"/>
          <circle cx="15.5" cy="12" r="1.5"/>
        </svg>
        Mesaj Devre Dışı
      </Button>
    )
  }

  return (
    <div className="relative">
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        className={`${getButtonStyle()} ${className} flex items-center justify-center`}
      >
        {children || (
          <>
            <svg 
              className="w-4 h-4 mr-2" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3.04 1.05 4.36L2 22l5.64-1.05C9.96 21.64 11.46 22 13 22h-1c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.4 0-2.76-.3-4-.84L6.5 19.5l.34-1.5C6.3 16.76 6 15.4 6 14c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z"/>
              <circle cx="8.5" cy="12" r="1.5"/>
              <circle cx="12" cy="12" r="1.5"/>
              <circle cx="15.5" cy="12" r="1.5"/>
            </svg>
            <span>{getButtonText()}</span>
          </>
        )}
      </Button>

      {showStatus && (
        <div className="absolute -top-2 -right-2">
          {isWorkingHours() ? (
            <Badge className="bg-green-500 text-white text-xs px-1 py-0.5">
              <CheckCircle className="w-3 h-3 mr-1" />
              Online
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-xs px-1 py-0.5">
              <Clock className="w-3 h-3 mr-1" />
              Offline
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}

export default WhatsAppButton
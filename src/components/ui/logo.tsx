'use client'

import React from 'react'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'full' | 'icon' | 'text'
}

const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md', 
  variant = 'full' 
}) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-24'
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-5xl'
  }

  if (variant === 'icon') {
    return (
      <div className={`${sizeClasses[size]} ${className} flex items-center`}>
        <svg
          viewBox="0 0 40 40"
          className="h-full w-auto"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6B73FF" />
              <stop offset="100%" stopColor="#9B59B6" />
            </linearGradient>
          </defs>
          <circle cx="20" cy="20" r="18" fill="url(#iconGradient)" />
          <text
            x="20"
            y="26"
            textAnchor="middle"
            className="fill-white font-bold text-lg"
            style={{ fontFamily: 'system-ui, sans-serif' }}
          >
            EY
          </text>
        </svg>
      </div>
    )
  }

  if (variant === 'text') {
    return (
      <div className={`${className} flex items-center space-x-1`}>
        <span className={`${textSizes[size]} font-bold bg-gradient-to-r from-[#6B73FF] to-[#9B59B6] bg-clip-text text-transparent`}>
          EMEL
        </span>
        <span className={`${textSizes[size]} font-light text-gray-600`}>
          YEŞİLDERE
        </span>
      </div>
    )
  }

  return (
    <div className={`${className} flex items-center space-x-3`}>
      {/* Icon */}
      <div className={`${sizeClasses[size]} flex items-center`}>
        <svg
          viewBox="0 0 40 40"
          className="h-full w-auto"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#74B9FF" />
              <stop offset="50%" stopColor="#6B73FF" />
              <stop offset="100%" stopColor="#9B59B6" />
            </linearGradient>
          </defs>
          <circle cx="20" cy="20" r="16" fill="url(#logoGradient)" opacity="0.1" />
          <circle cx="15" cy="20" r="3" fill="#74B9FF" />
          <circle cx="25" cy="20" r="3" fill="#9B59B6" />
          <path
            d="M12 15 C16 12, 24 12, 28 15"
            stroke="url(#logoGradient)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M12 25 C16 28, 24 28, 28 25"
            stroke="url(#logoGradient)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Text */}
      <div className="flex flex-col">
        <div className="flex items-center space-x-1">
          <span className={`${textSizes[size]} font-bold bg-gradient-to-r from-[#6B73FF] to-[#9B59B6] bg-clip-text text-transparent tracking-wide`}>
            EMEL
          </span>
          <span className={`${textSizes[size]} font-light text-gray-600 tracking-wide`}>
            YEŞİLDERE
          </span>
        </div>
        {size !== 'sm' && (
          <div className="text-xs text-gray-500 font-medium tracking-wider uppercase">
            Duygu Temizliği & Holistik Koçluk
          </div>
        )}
      </div>
    </div>
  )
}

export default Logo
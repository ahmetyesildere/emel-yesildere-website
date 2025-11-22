'use client'

import React from 'react'
import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2 className={`animate-spin text-blue-600 ${sizeClasses[size]}`} />
      {text && (
        <p className="text-sm text-gray-600 mt-2">{text}</p>
      )}
    </div>
  )
}

interface LoadingCardProps {
  title: string
  description?: string
  className?: string
}

export const LoadingCard: React.FC<LoadingCardProps> = ({ 
  title, 
  description,
  className = '' 
}) => {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      <div className="flex items-center space-x-3">
        <LoadingSpinner size="md" />
        <div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  )
}

interface SkeletonProps {
  className?: string
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
  )
}

export const ConsultantCardSkeleton: React.FC = () => {
  return (
    <div className="p-4 border border-gray-200 rounded-lg">
      <div className="flex items-start space-x-3">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
          <div className="flex space-x-2 mt-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export const SessionTypeCardSkeleton: React.FC = () => {
  return (
    <div className="p-4 border border-gray-200 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <div className="flex items-center space-x-4 mt-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  )
}
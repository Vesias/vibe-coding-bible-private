'use client'

import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

export function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className={cn('flex flex-col items-center justify-center space-y-2', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-gray-300 border-t-primary',
          sizeClasses[size]
        )}
      />
      {text && (
        <p className="text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  )
}

export function LoadingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoadingSpinner size="lg" text="Loading..." />
    </div>
  )
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse rounded-md bg-muted', className)} />
  )
}

export function LoadingCard() {
  return (
    <div className="space-y-3 p-4">
      <LoadingSkeleton className="h-4 w-3/4" />
      <LoadingSkeleton className="h-4 w-1/2" />
      <LoadingSkeleton className="h-20 w-full" />
      <div className="flex space-x-2">
        <LoadingSkeleton className="h-8 w-16" />
        <LoadingSkeleton className="h-8 w-16" />
      </div>
    </div>
  )
}
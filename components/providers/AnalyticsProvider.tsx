'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void
  }
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
      
      window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID!, {
        page_path: url,
      })
    }
  }, [pathname, searchParams])

  return <>{children}</>
}
import { Suspense } from 'react'
import { HeroSection } from '@/components/landing/HeroSection'
import { CommandmentsPreview } from '@/components/landing/CommandmentsPreview'
import { InteractiveFeatures } from '@/components/landing/InteractiveFeatures'
import { TestimonialsSection } from '@/components/landing/TestimonialsSection'
import { PricingSection } from '@/components/landing/PricingSection'
import { CTASection } from '@/components/landing/CTASection'
import { Footer } from '@/components/layout/Footer'
import { Navigation } from '@/components/layout/Navigation'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      
      <Suspense fallback={<LoadingSpinner />}>
        <HeroSection />
      </Suspense>

      <Suspense fallback={<div className="h-32 loading-pulse" />}>
        <CommandmentsPreview />
      </Suspense>

      <Suspense fallback={<div className="h-32 loading-pulse" />}>
        <InteractiveFeatures />
      </Suspense>

      <Suspense fallback={<div className="h-32 loading-pulse" />}>
        <TestimonialsSection />
      </Suspense>

      <Suspense fallback={<div className="h-32 loading-pulse" />}>
        <PricingSection />
      </Suspense>

      <Suspense fallback={<div className="h-32 loading-pulse" />}>
        <CTASection />
      </Suspense>

      <Footer />
    </main>
  )
}
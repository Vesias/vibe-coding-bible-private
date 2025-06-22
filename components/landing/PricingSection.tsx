'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Star, Crown, Zap } from 'lucide-react'
import { useAuth } from '@/lib/auth/AuthProvider'
import { getStripe } from '@/lib/stripe/client'
import { useToast } from '@/hooks/use-toast'
import { formatPrice, pricingPlans } from '@/lib/stripe/server'

export function PricingSection() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null)

  const handleSubscribe = async (planId: string, priceId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to subscribe to a plan.",
        variant: "destructive",
      })
      return
    }

    if (planId === 'free') {
      // Redirect to free tier signup
      window.location.href = '/workshop'
      return
    }

    setLoadingPlanId(planId)

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId: user.id,
          userEmail: user.email,
        }),
      })

      const { sessionId, url } = await response.json()

      if (url) {
        window.location.href = url
      } else {
        const stripe = await getStripe()
        const { error } = await stripe!.redirectToCheckout({ sessionId })

        if (error) {
          console.error('Stripe checkout error:', error)
          toast({
            title: "Payment Error",
            description: "Failed to redirect to checkout. Please try again.",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error('Subscription error:', error)
      toast({
        title: "Subscription Error",
        description: "Failed to start subscription process. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingPlanId(null)
    }
  }

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free':
        return <Zap className="w-6 h-6" />
      case 'basic':
        return <Star className="w-6 h-6" />
      case 'pro':
        return <Crown className="w-6 h-6" />
      case 'divine':
        return <Crown className="w-6 h-6 text-sacred-gold" />
      default:
        return <Zap className="w-6 h-6" />
    }
  }

  const getPlanGradient = (planId: string) => {
    switch (planId) {
      case 'free':
        return 'from-gray-500 to-gray-600'
      case 'basic':
        return 'from-blue-500 to-cyan-500'
      case 'pro':
        return 'from-purple-500 to-pink-500'
      case 'divine':
        return 'from-yellow-500 to-orange-500'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <section className="py-24 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Choose Your <span className="sacred-text font-sacred">Divine Path</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From novice seeker to divine architect - select the tier that matches your ambition.
            All plans include lifetime access to purchased content.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-4 max-w-7xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative ${plan.popular ? 'lg:scale-105' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-vibe-primary to-vibe-secondary text-white px-4 py-2 text-sm font-semibold">
                    Most Popular
                  </Badge>
                </div>
              )}

              <Card className={`h-full prophet-card ${plan.popular ? 'ring-2 ring-vibe-primary' : ''}`}>
                <CardHeader className="text-center pb-6">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${getPlanGradient(plan.id)} flex items-center justify-center text-white mb-4`}>
                    {getPlanIcon(plan.id)}
                  </div>
                  
                  <CardTitle className="text-2xl font-bold">
                    {plan.name}
                  </CardTitle>
                  
                  <div className="text-4xl font-bold text-foreground">
                    {plan.price === 0 ? 'Free' : formatPrice(plan.price)}
                    {plan.price > 0 && (
                      <span className="text-base font-normal text-muted-foreground">
                        /month
                      </span>
                    )}
                  </div>
                  
                  <CardDescription className="text-sm">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.maxUsers && (
                    <div className="pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        Up to <span className="font-semibold text-foreground">{plan.maxUsers} team members</span>
                      </p>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="pt-6">
                  <Button
                    className="w-full"
                    variant={plan.popular ? "sacred" : plan.id === 'divine' ? "prophet" : "default"}
                    size="lg"
                    onClick={() => handleSubscribe(plan.id, plan.priceId)}
                    disabled={loadingPlanId === plan.id}
                  >
                    {loadingPlanId === plan.id ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      plan.buttonText
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16 space-y-4"
        >
          <p className="text-muted-foreground">
            All plans include a 30-day money-back guarantee. No questions asked.
          </p>
          
          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              Lifetime Access
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              Regular Updates
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              Community Support
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              Mobile Access
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
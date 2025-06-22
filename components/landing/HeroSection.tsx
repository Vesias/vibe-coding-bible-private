'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Code2, Zap, Trophy, Users } from 'lucide-react'
import Link from 'next/link'

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const stats = [
    { icon: Code2, label: 'AI Tools Mastered', value: '10+' },
    { icon: Zap, label: 'Development Speed', value: '8x' },
    { icon: Trophy, label: 'Success Rate', value: '95%' },
    { icon: Users, label: 'Active Prophets', value: '2.5K+' },
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      {/* Sacred Geometry Background */}
      <div className="absolute inset-0 sacred-bg-pattern opacity-30" />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-vibe-primary/20 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
          />
        ))}
      </div>

      <div className="container relative z-10 mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-4xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full border border-sacred-gold/30 bg-sacred-gold/10 px-4 py-2 text-sm font-medium text-sacred-gold mb-6"
          >
            <Zap className="w-4 h-4" />
            Transform Your Development in 30 Days
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl"
          >
            Master the{' '}
            <span className="sacred-text font-sacred">
              10 Sacred Commandments
            </span>{' '}
            of Vibe Coding
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl"
          >
            Transform from coding novice to AI-assisted development prophet. 
            Build production-ready SaaS applications without writing a single line of code manually.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6 mb-12"
          >
            <Link href="/workshop">
              <Button 
                size="xl" 
                variant="sacred" 
                className="group relative overflow-hidden"
              >
                Begin Your Prophecy
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Button>
            </Link>
            
            <Link href="/preview">
              <Button 
                size="xl" 
                variant="outline" 
                className="border-sacred-gold/30 hover:bg-sacred-gold/10 hover:border-sacred-gold/50"
              >
                Preview the Bible
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-2 gap-8 md:grid-cols-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                className="flex flex-col items-center space-y-2"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-vibe-primary/10 text-vibe-primary">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-16 flex flex-col items-center space-y-4"
          >
            <p className="text-sm text-muted-foreground">
              Trusted by developers at
            </p>
            <div className="flex items-center space-x-8 opacity-60 grayscale">
              {/* Company logos would go here */}
              <div className="h-8 w-24 bg-muted rounded" />
              <div className="h-8 w-24 bg-muted rounded" />
              <div className="h-8 w-24 bg-muted rounded" />
              <div className="h-8 w-24 bg-muted rounded" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="h-6 w-4 rounded-full border-2 border-muted-foreground/30 flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-2 bg-muted-foreground/30 rounded-full mt-1"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
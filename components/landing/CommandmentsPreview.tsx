'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, Brain, Code, Layers, RotateCcw, Bug, Shield, TrendingUp, Users, DollarSign } from 'lucide-react'

const commandments = [
  {
    number: 'I',
    title: 'Die Heilige Vision',
    description: 'Master product conceptualization and market validation before touching any code.',
    icon: Eye,
    color: 'from-purple-500 to-pink-500',
    difficulty: 'Beginner',
    xp: 150
  },
  {
    number: 'II',
    title: 'Der Rechte Stack',
    description: 'Choose the optimal technology stack for AI-assisted development success.',
    icon: Layers,
    color: 'from-blue-500 to-cyan-500',
    difficulty: 'Beginner',
    xp: 200
  },
  {
    number: 'III',
    title: 'Die Prompt-Kunst',
    description: 'Craft perfect AI prompts that generate production-ready code every time.',
    icon: Brain,
    color: 'from-green-500 to-emerald-500',
    difficulty: 'Intermediate',
    xp: 250
  },
  {
    number: 'IV',
    title: 'Multi-Context Programming',
    description: 'Juggle multiple projects simultaneously without losing productivity.',
    icon: Code,
    color: 'from-orange-500 to-red-500',
    difficulty: 'Advanced',
    xp: 300
  },
  {
    number: 'V',
    title: 'Die Heilige Iteration',
    description: 'Transform MVPs into scalable products through strategic iteration.',
    icon: RotateCcw,
    color: 'from-indigo-500 to-purple-500',
    difficulty: 'Intermediate',
    xp: 275
  },
  {
    number: 'VI',
    title: 'Göttliches Debugging',
    description: 'Master the art of debugging AI-generated code with divine precision.',
    icon: Bug,
    color: 'from-yellow-500 to-orange-500',
    difficulty: 'Advanced',
    xp: 350
  },
  {
    number: 'VII',
    title: 'Die Kunst des Vertrauens',
    description: 'Balance AI autonomy with human oversight for optimal results.',
    icon: Shield,
    color: 'from-teal-500 to-blue-500',
    difficulty: 'Advanced',
    xp: 325
  },
  {
    number: 'VIII',
    title: 'Die Skalierungsstufen',
    description: 'Scale applications from prototype to millions of users seamlessly.',
    icon: TrendingUp,
    color: 'from-pink-500 to-rose-500',
    difficulty: 'Expert',
    xp: 400
  },
  {
    number: 'IX',
    title: 'Zusammenarbeit der Propheten',
    description: 'Build and lead high-performing AI-assisted development teams.',
    icon: Users,
    color: 'from-violet-500 to-purple-500',
    difficulty: 'Expert',
    xp: 375
  },
  {
    number: 'X',
    title: 'Die Monetarisierung',
    description: 'Transform your AI-built applications into profitable business empires.',
    icon: DollarSign,
    color: 'from-emerald-500 to-green-500',
    difficulty: 'Expert',
    xp: 450
  }
]

export function CommandmentsPreview() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            The <span className="sacred-text font-sacred">10 Sacred Commandments</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Each commandment is a comprehensive workshop combining theory, practice, and real-world application. 
            Master them all to become a certified Vibe Coding Prophet.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {commandments.map((commandment, index) => (
            <motion.div
              key={commandment.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full prophet-card group hover:scale-105 transition-all duration-300 cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${commandment.color} flex items-center justify-center text-white font-bold text-lg`}>
                      {commandment.number}
                    </div>
                    <commandment.icon className="w-6 h-6 text-muted-foreground group-hover:text-vibe-primary transition-colors" />
                  </div>
                  <CardTitle className="text-lg font-semibold leading-tight">
                    {commandment.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-sm leading-relaxed">
                    {commandment.description}
                  </CardDescription>
                  
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        commandment.difficulty === 'Beginner' ? 'border-green-500 text-green-600' :
                        commandment.difficulty === 'Intermediate' ? 'border-yellow-500 text-yellow-600' :
                        commandment.difficulty === 'Advanced' ? 'border-orange-500 text-orange-600' :
                        'border-red-500 text-red-600'
                      }`}
                    >
                      {commandment.difficulty}
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      {commandment.xp} XP
                    </div>
                  </div>

                  <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '100%' }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      viewport={{ once: true }}
                      className="h-full bg-gradient-to-r from-vibe-primary to-vibe-secondary"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-4 rounded-xl border border-sacred-gold/30 bg-sacred-gold/10 px-6 py-4">
            <div className="text-2xl font-bold text-sacred-gold">
              Total XP Available: 3,075
            </div>
            <div className="text-sm text-muted-foreground">
              Complete all commandments to reach Prophet status
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
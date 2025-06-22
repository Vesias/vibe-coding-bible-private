'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  Users, 
  Bot, 
  Award, 
  Video, 
  Code2, 
  Sparkles,
  Lock,
  Crown,
  Zap,
  Target,
  Play
} from 'lucide-react'

interface QuickActionsProps {
  workshopAccess: any
  aiAccess: any
  collaborationAccess: any
  tier: string
}

export function QuickActions({ 
  workshopAccess, 
  aiAccess, 
  collaborationAccess, 
  tier 
}: QuickActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleAction = async (action: string, path: string) => {
    setLoading(action)
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 500))
    router.push(path)
    setLoading(null)
  }

  const actions = [
    {
      id: 'workshops',
      title: 'Continue Learning',
      description: 'Resume your divine coding journey',
      icon: BookOpen,
      color: 'bg-blue-500',
      path: '/workshops',
      hasAccess: workshopAccess.hasAccess,
      isLimited: workshopAccess.isAtLimit,
      usage: `${workshopAccess.currentUsage}/${workshopAccess.limit === -1 ? '∞' : workshopAccess.limit}`,
      featured: true
    },
    {
      id: 'ai-mentor',
      title: 'AI Code Mentor',
      description: 'Get divine guidance from AI prophets',
      icon: Bot,
      color: 'bg-purple-500',
      path: '/ai-mentor',
      hasAccess: aiAccess.hasAccess,
      isLimited: aiAccess.isAtLimit,
      usage: `${aiAccess.currentUsage}/${aiAccess.limit === -1 ? '∞' : aiAccess.limit}`,
      requiresPro: false
    },
    {
      id: 'collaboration',
      title: 'Join Session',
      description: 'Collaborate with fellow seekers',
      icon: Users,
      color: 'bg-green-500',
      path: '/collaboration',
      hasAccess: collaborationAccess.hasAccess,
      isLimited: collaborationAccess.isAtLimit,
      usage: `${collaborationAccess.currentUsage}/${collaborationAccess.limit === -1 ? '∞' : collaborationAccess.limit}`,
      requiresPro: tier === 'free'
    },
    {
      id: 'create-session',
      title: 'Host Session',
      description: 'Lead a divine coding session',
      icon: Video,
      color: 'bg-orange-500',
      path: '/collaboration/create',
      hasAccess: collaborationAccess.canCreateSession(),
      isLimited: false,
      requiresPro: tier === 'free' || tier === 'basic'
    },
    {
      id: 'playground',
      title: 'Code Playground',
      description: 'Practice in the sacred sandbox',
      icon: Code2,
      color: 'bg-indigo-500',
      path: '/playground',
      hasAccess: true,
      isLimited: false
    },
    {
      id: 'achievements',
      title: 'Achievements',
      description: 'View your divine accomplishments',
      icon: Award,
      color: 'bg-yellow-500',
      path: '/achievements',
      hasAccess: true,
      isLimited: false
    }
  ]

  const featuredActions = actions.filter(action => action.featured)
  const regularActions = actions.filter(action => !action.featured)

  const ActionCard = ({ action, size = 'normal' }: { action: any, size?: 'normal' | 'large' }) => {
    const Icon = action.icon
    const isDisabled = !action.hasAccess || action.isLimited

    return (
      <Card 
        className={`
          group relative overflow-hidden transition-all duration-300 hover:shadow-lg
          ${size === 'large' ? 'md:col-span-2' : ''}
          ${isDisabled ? 'opacity-60' : 'hover:scale-105 cursor-pointer'}
          ${action.requiresPro ? 'ring-2 ring-yellow-200 dark:ring-yellow-800' : ''}
        `}
        onClick={() => !isDisabled && handleAction(action.id, action.path)}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className={`absolute inset-0 ${action.color} transform -skew-y-6 scale-110`}></div>
        </div>

        <CardHeader className={`relative ${size === 'large' ? 'pb-4' : 'pb-2'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-lg ${action.color} text-white`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className={`flex items-center gap-2 ${size === 'large' ? 'text-xl' : 'text-lg'}`}>
                  {action.title}
                  {action.requiresPro && (
                    <Crown className="h-4 w-4 text-yellow-500" />
                  )}
                </CardTitle>
                <CardDescription className="text-sm">
                  {action.description}
                </CardDescription>
              </div>
            </div>

            {!action.hasAccess && (
              <Lock className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </CardHeader>

        <CardContent className="relative space-y-4">
          {/* Usage Indicator */}
          {action.usage && action.hasAccess && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Usage:</span>
              <Badge variant={action.isLimited ? "destructive" : "secondary"}>
                {action.usage}
              </Badge>
            </div>
          )}

          {/* Access Status */}
          {!action.hasAccess && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {action.requiresPro ? (
                <>
                  <Crown className="h-4 w-4" />
                  <span>Requires {tier === 'free' ? 'Apostle' : 'Prophet'} tier</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  <span>Access restricted</span>
                </>
              )}
            </div>
          )}

          {action.isLimited && (
            <div className="flex items-center gap-2 text-sm text-amber-600">
              <Zap className="h-4 w-4" />
              <span>Monthly limit reached</span>
            </div>
          )}

          {/* Action Button */}
          <Button 
            className="w-full group-hover:bg-primary/90 transition-colors"
            disabled={isDisabled || loading === action.id}
            variant={isDisabled ? "outline" : "default"}
          >
            {loading === action.id ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            {!action.hasAccess ? 'Upgrade to Access' : 
             action.isLimited ? 'Limit Reached' : 
             'Start Now'}
          </Button>
        </CardContent>

        {/* Premium Badge */}
        {action.requiresPro && (
          <div className="absolute top-3 right-3">
            <Badge variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-800">
              <Crown className="h-3 w-3 mr-1" />
              PRO
            </Badge>
          </div>
        )}
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Quick Actions
          </h2>
          <p className="text-muted-foreground">
            Continue your divine coding journey
          </p>
        </div>
      </div>

      {/* Featured Actions */}
      {featuredActions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredActions.map(action => (
            <ActionCard key={action.id} action={action} size="large" />
          ))}
        </div>
      )}

      {/* Regular Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {regularActions.map(action => (
          <ActionCard key={action.id} action={action} />
        ))}
      </div>

      {/* Tier Upgrade Prompt */}
      {tier === 'free' && (
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Unlock Divine Features</h3>
                  <p className="text-sm text-muted-foreground">
                    Upgrade to Apostle tier for unlimited workshops, AI mentoring, and collaboration
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => router.push('/pricing')}
                className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
              >
                <Crown className="h-4 w-4 mr-2" />
                Upgrade Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
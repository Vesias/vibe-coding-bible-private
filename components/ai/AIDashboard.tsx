'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { AIMentorChat } from './AIMentorChat'
import { CodeReviewPanel } from './CodeReviewPanel'
import { LearningRecommendations } from './LearningRecommendations'
import { 
  Brain, 
  MessageCircle, 
  Target, 
  TrendingUp,
  Zap,
  BarChart3,
  Clock,
  DollarSign,
  Crown,
  Award,
  Loader2,
  RefreshCw,
  Sparkles,
  Star,
  Activity
} from 'lucide-react'

interface AIDashboardProps {
  currentCode?: string
  language?: string
  workshopContext?: {
    workshopId: string
    stepId: string
    objectives: string[]
  }
  onCodeSuggestion?: (code: string) => void
  className?: string
}

interface AIUsageStats {
  totalInteractions: number
  totalTokens: number
  totalCost: number
  byType: Record<string, { count: number; tokens: number; cost: number }>
  byModel: Record<string, { count: number; tokens: number; cost: number }>
  byDay: Array<{ date: string; interactions: number; tokens: number; cost: number }>
  monthlyLimits: {
    limits: Record<string, number>
    usage: Record<string, number>
    tier: string
  }
  insights: {
    mostUsedFeature: string
    mostUsedModel: string
    averageCostPerInteraction: number
    averageTokensPerInteraction: number
  }
}

export function AIDashboard({
  currentCode = '',
  language = 'javascript',
  workshopContext,
  onCodeSuggestion,
  className = ''
}: AIDashboardProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('chat')
  const [usageStats, setUsageStats] = useState<AIUsageStats | null>(null)
  const [loadingStats, setLoadingStats] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    loadUsageStats()
  }, [refreshTrigger])

  const loadUsageStats = async () => {
    setLoadingStats(true)
    
    try {
      const response = await fetch('/api/ai/usage?period=30')
      if (!response.ok) throw new Error('Failed to load usage stats')
      
      const data = await response.json()
      setUsageStats(data.userStats)
      
    } catch (error) {
      console.error('Error loading usage stats:', error)
      toast({
        title: 'Error',
        description: 'Failed to load AI usage statistics',
        variant: 'destructive'
      })
    } finally {
      setLoadingStats(false)
    }
  }

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  const getUsagePercentage = (feature: string) => {
    if (!usageStats) return 0
    const limit = usageStats.monthlyLimits.limits[feature]
    const usage = usageStats.monthlyLimits.usage[feature] || 0
    if (limit === -1) return 0 // Unlimited
    return Math.min((usage / limit) * 100, 100)
  }

  const isFeatureLimited = (feature: string) => {
    if (!usageStats) return false
    const limit = usageStats.monthlyLimits.limits[feature]
    const usage = usageStats.monthlyLimits.usage[feature] || 0
    return limit !== -1 && usage >= limit
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'free': return 'text-gray-600 bg-gray-100'
      case 'apostle': return 'text-blue-600 bg-blue-100'
      case 'prophet': return 'text-purple-600 bg-purple-100'
      case 'divine': return 'text-gold-600 bg-gold-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className={className}>
      {/* Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-primary" />
                AI Command Center
              </CardTitle>
              <CardDescription>
                Harness the power of divine AI mentors and coding assistants
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-3">
              {usageStats && (
                <Badge className={getTierColor(usageStats.monthlyLimits.tier)}>
                  <Crown className="h-3 w-3 mr-1" />
                  {usageStats.monthlyLimits.tier} tier
                </Badge>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={refreshData}
                disabled={loadingStats}
              >
                {loadingStats ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-1" />
                )}
                Refresh
              </Button>
            </div>
          </div>

          {/* Usage Overview */}
          {usageStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <Card>
                <CardContent className="p-3 text-center">
                  <MessageCircle className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                  <div className="text-sm font-semibold">
                    {usageStats.monthlyLimits.usage.chat || 0}
                    {usageStats.monthlyLimits.limits.chat !== -1 && `/${usageStats.monthlyLimits.limits.chat}`}
                  </div>
                  <div className="text-xs text-muted-foreground">Chat Sessions</div>
                  {usageStats.monthlyLimits.limits.chat !== -1 && (
                    <Progress value={getUsagePercentage('chat')} className="h-1 mt-1" />
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-3 text-center">
                  <Target className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                  <div className="text-sm font-semibold">
                    {usageStats.monthlyLimits.usage.review || 0}
                    {usageStats.monthlyLimits.limits.review !== -1 && `/${usageStats.monthlyLimits.limits.review}`}
                  </div>
                  <div className="text-xs text-muted-foreground">Code Reviews</div>
                  {usageStats.monthlyLimits.limits.review !== -1 && (
                    <Progress value={getUsagePercentage('review')} className="h-1 mt-1" />
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-3 text-center">
                  <Zap className="h-6 w-6 text-yellow-600 mx-auto mb-1" />
                  <div className="text-sm font-semibold">
                    {usageStats.totalTokens.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">Tokens Used</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-3 text-center">
                  <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-1" />
                  <div className="text-sm font-semibold">
                    ${usageStats.totalCost.toFixed(3)}
                  </div>
                  <div className="text-xs text-muted-foreground">Total Cost</div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardHeader>
      </CardContent>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            AI Mentor
            {isFeatureLimited('chat') && <Badge variant="destructive" className="text-xs">Limited</Badge>}
          </TabsTrigger>
          <TabsTrigger value="review" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Code Review
            {isFeatureLimited('review') && <Badge variant="destructive" className="text-xs">Limited</Badge>}
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Learn Path
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="mt-6">
          {isFeatureLimited('chat') ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Crown className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Monthly Chat Limit Reached</h3>
                <p className="text-muted-foreground mb-4">
                  Upgrade your tier to continue chatting with AI mentors
                </p>
                <Button className="bg-gradient-to-r from-purple-500 to-blue-600">
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade Now
                </Button>
              </CardContent>
            </Card>
          ) : (
            <AIMentorChat
              onCodeSuggestion={onCodeSuggestion}
              initialContext={{
                ...workshopContext,
                currentCode,
                language
              }}
            />
          )}
        </TabsContent>

        <TabsContent value="review" className="mt-6">
          {isFeatureLimited('review') ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Monthly Review Limit Reached</h3>
                <p className="text-muted-foreground mb-4">
                  Upgrade your tier to get more AI code reviews
                </p>
                <Button className="bg-gradient-to-r from-purple-500 to-blue-600">
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade Now
                </Button>
              </CardContent>
            </Card>
          ) : (
            <CodeReviewPanel
              code={currentCode}
              language={language}
              workshopContext={workshopContext}
              onReviewComplete={(review) => {
                toast({
                  title: 'Review Complete! 📖',
                  description: `Your code scored ${review.overall.score}%`,
                  variant: 'default'
                })
              }}
            />
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="mt-6">
          <LearningRecommendations
            refreshTrigger={refreshTrigger}
            onRecommendationSelect={(recommendation) => {
              toast({
                title: 'Recommendation Selected! ✨',
                description: `Starting: ${recommendation.title}`,
                variant: 'default'
              })
            }}
          />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="space-y-6">
            {loadingStats ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
                  <p className="text-muted-foreground">Loading analytics...</p>
                </CardContent>
              </Card>
            ) : usageStats ? (
              <>
                {/* Usage Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Usage Summary (Last 30 Days)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary">{usageStats.totalInteractions}</div>
                        <div className="text-sm text-muted-foreground">Total Interactions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">{usageStats.totalTokens.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Tokens Processed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">${usageStats.totalCost.toFixed(3)}</div>
                        <div className="text-sm text-muted-foreground">Total Cost</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Feature Usage Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Feature Usage Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(usageStats.byType).map(([type, stats]) => (
                        <div key={type} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="capitalize">
                                {type.replace('_', ' ')}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {stats.count} interactions
                              </span>
                            </div>
                            <div className="text-sm font-medium">
                              {stats.tokens.toLocaleString()} tokens
                            </div>
                          </div>
                          <Progress 
                            value={(stats.count / usageStats.totalInteractions) * 100} 
                            className="h-2"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* AI Insights */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      AI Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="h-4 w-4 text-yellow-600" />
                          <span className="font-medium">Most Used Feature</span>
                        </div>
                        <p className="text-sm text-muted-foreground capitalize">
                          {usageStats.insights.mostUsedFeature.replace('_', ' ')}
                        </p>
                      </div>
                      
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="h-4 w-4 text-purple-600" />
                          <span className="font-medium">Preferred AI Model</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {usageStats.insights.mostUsedModel}
                        </p>
                      </div>
                      
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">Avg. Tokens per Session</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {Math.round(usageStats.insights.averageTokensPerInteraction).toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-medium">Avg. Cost per Session</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          ${usageStats.insights.averageCostPerInteraction.toFixed(4)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tier Limits */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="h-5 w-5" />
                      Monthly Limits & Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(usageStats.monthlyLimits.limits).map(([feature, limit]) => {
                        const usage = usageStats.monthlyLimits.usage[feature] || 0
                        const percentage = limit === -1 ? 0 : (usage / limit) * 100
                        
                        return (
                          <div key={feature} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium capitalize">
                                {feature.replace('_', ' ')}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {usage}{limit !== -1 ? `/${limit}` : ' (unlimited)'}
                              </span>
                            </div>
                            {limit !== -1 && (
                              <Progress 
                                value={percentage} 
                                className={`h-2 ${percentage >= 100 ? 'bg-red-100' : ''}`}
                              />
                            )}
                          </div>
                        )
                      })}
                    </div>
                    
                    {usageStats.monthlyLimits.tier === 'free' && (
                      <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                        <div className="flex items-center gap-3">
                          <Crown className="h-6 w-6 text-purple-600" />
                          <div className="flex-1">
                            <h4 className="font-semibold">Unlock Unlimited AI Power</h4>
                            <p className="text-sm text-muted-foreground">
                              Upgrade to get unlimited AI interactions and advanced features
                            </p>
                          </div>
                          <Button className="bg-gradient-to-r from-purple-500 to-blue-600">
                            Upgrade
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No Analytics Data</h3>
                  <p className="text-muted-foreground">
                    Start using AI features to see your usage analytics
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
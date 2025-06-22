'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  BookOpen, 
  Code, 
  Users, 
  Award, 
  TrendingUp,
  Lightbulb,
  Target,
  Clock,
  Star,
  ArrowRight,
  Sparkles
} from 'lucide-react'

interface Recommendation {
  type: 'workshop' | 'skill' | 'collaboration' | 'challenge' | 'mentor'
  title: string
  reason: string
  confidence: number
  estimatedTime?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  xpReward?: number
  path?: string
}

interface AIRecommendationsProps {
  recommendations: Recommendation[]
  tier: string
  userPreferences?: any
}

export function AIRecommendations({ 
  recommendations, 
  tier, 
  userPreferences 
}: AIRecommendationsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'workshop': return BookOpen
      case 'skill': return Code
      case 'collaboration': return Users
      case 'challenge': return Target
      case 'mentor': return Brain
      default: return Lightbulb
    }
  }

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'workshop': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20'
      case 'skill': return 'text-green-600 bg-green-100 dark:bg-green-900/20'
      case 'collaboration': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20'
      case 'challenge': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20'
      case 'mentor': return 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/20'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const handleRecommendationClick = async (recommendation: Recommendation) => {
    if (!recommendation.path) return
    
    setLoading(recommendation.title)
    await new Promise(resolve => setTimeout(resolve, 500))
    router.push(recommendation.path)
    setLoading(null)
  }

  const refreshRecommendations = async () => {
    setRefreshing(true)
    // Simulate AI recommendation refresh
    await new Promise(resolve => setTimeout(resolve, 2000))
    setRefreshing(false)
  }

  // Enhanced recommendations with more variety
  const enhancedRecommendations: Recommendation[] = [
    ...recommendations,
    {
      type: 'workshop',
      title: 'Advanced React Patterns',
      reason: 'Perfect next step after completing React basics',
      confidence: 92,
      estimatedTime: '3-4 hours',
      difficulty: 'intermediate',
      xpReward: 450,
      path: '/workshops/advanced-react-patterns'
    },
    {
      type: 'skill',
      title: 'TypeScript Fundamentals',
      reason: 'Strengthen your JavaScript foundation',
      confidence: 87,
      estimatedTime: '2-3 hours',
      difficulty: 'beginner',
      xpReward: 300,
      path: '/workshops/typescript-fundamentals'
    },
    {
      type: 'collaboration',
      title: 'Join React Study Group',
      reason: 'Learn with peers at your level',
      confidence: 78,
      estimatedTime: '1 hour',
      path: '/collaboration/sessions/react-study'
    },
    {
      type: 'challenge',
      title: 'Build a Todo App',
      reason: 'Apply your React knowledge',
      confidence: 85,
      estimatedTime: '4-6 hours',
      difficulty: 'intermediate',
      xpReward: 600,
      path: '/challenges/todo-app'
    }
  ]

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Recommendations</CardTitle>
              <CardDescription>
                Personalized guidance for your journey
              </CardDescription>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={refreshRecommendations}
            disabled={refreshing}
          >
            {refreshing ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* AI Insights Summary */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-lg border border-blue-200/50 dark:border-blue-700/50">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-sm">Learning Insights</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Based on your progress, you're ready for intermediate React concepts. 
            Consider focusing on TypeScript to enhance your development skills.
          </p>
          {userPreferences?.interests && (
            <div className="flex flex-wrap gap-1 mt-2">
              {userPreferences.interests.slice(0, 3).map((interest: string) => (
                <Badge key={interest} variant="outline" className="text-xs">
                  {interest}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Recommendations List */}
        <div className="space-y-3">
          {enhancedRecommendations.slice(0, 4).map((recommendation, index) => {
            const Icon = getRecommendationIcon(recommendation.type)
            const isLoading = loading === recommendation.title
            
            return (
              <div
                key={index}
                className={`
                  p-4 rounded-lg border transition-all duration-200 cursor-pointer
                  hover:shadow-md hover:border-primary/30 group
                  ${isLoading ? 'opacity-50' : ''}
                `}
                onClick={() => handleRecommendationClick(recommendation)}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${getRecommendationColor(recommendation.type)}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                        {recommendation.title}
                      </h4>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs text-muted-foreground">
                          {recommendation.confidence}%
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-2">
                      {recommendation.reason}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {recommendation.difficulty && (
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getDifficultyColor(recommendation.difficulty)}`}
                          >
                            {recommendation.difficulty}
                          </Badge>
                        )}
                        
                        {recommendation.estimatedTime && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {recommendation.estimatedTime}
                          </div>
                        )}
                        
                        {recommendation.xpReward && (
                          <div className="flex items-center gap-1 text-xs text-green-600">
                            <Award className="h-3 w-3" />
                            {recommendation.xpReward} XP
                          </div>
                        )}
                      </div>
                      
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Tier-based Features */}
        {tier === 'free' && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-700">
            <div className="flex items-center gap-2 text-sm text-yellow-800 dark:text-yellow-200">
              <Lightbulb className="h-4 w-4" />
              <span className="font-medium">Upgrade for Advanced AI</span>
            </div>
            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
              Get personalized learning paths, skill gap analysis, and career guidance
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 text-yellow-700 border-yellow-300 hover:bg-yellow-100"
              onClick={() => router.push('/pricing')}
            >
              Upgrade to Apostle
            </Button>
          </div>
        )}

        {/* Advanced AI Features for Pro+ */}
        {(tier === 'pro' || tier === 'divine') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Advanced Insights</span>
              <Badge variant="outline" className="text-xs">PRO</Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-green-50 dark:bg-green-900/10 rounded border border-green-200 dark:border-green-700">
                <div className="font-medium text-green-800 dark:text-green-200">Learning Velocity</div>
                <div className="text-green-600 dark:text-green-400">+15% this week</div>
              </div>
              <div className="p-2 bg-blue-50 dark:bg-blue-900/10 rounded border border-blue-200 dark:border-blue-700">
                <div className="font-medium text-blue-800 dark:text-blue-200">Skill Gaps</div>
                <div className="text-blue-600 dark:text-blue-400">2 identified</div>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => router.push('/ai-mentor')}
        >
          <Brain className="h-4 w-4 mr-2" />
          Chat with AI Mentor
        </Button>
      </CardContent>
    </Card>
  )
}
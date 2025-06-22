'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import { LearningRecommendation } from '@/lib/ai/provider'
import { 
  BookOpen, 
  Code, 
  Target, 
  FileText,
  Clock,
  TrendingUp,
  Star,
  ExternalLink,
  Lightbulb,
  Award,
  Zap,
  Crown,
  RefreshCw,
  Loader2,
  ArrowRight,
  Calendar,
  CheckCircle
} from 'lucide-react'

interface LearningRecommendationsProps {
  refreshTrigger?: number
  onRecommendationSelect?: (recommendation: LearningRecommendation) => void
  className?: string
}

export function LearningRecommendations({ 
  refreshTrigger = 0,
  onRecommendationSelect,
  className = '' 
}: LearningRecommendationsProps) {
  const { toast } = useToast()
  const [recommendations, setRecommendations] = useState<LearningRecommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    loadRecommendations()
  }, [refreshTrigger])

  const loadRecommendations = async () => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/ai/recommendations')
      if (!response.ok) throw new Error('Failed to load recommendations')
      
      const data: LearningRecommendation[] = await response.json()
      setRecommendations(data.sort((a, b) => b.priority - a.priority))
      setLastUpdated(new Date())
      
      toast({
        title: 'Recommendations Updated! ✨',
        description: `Found ${data.length} personalized learning suggestions`,
        variant: 'default'
      })
      
    } catch (error) {
      console.error('Error loading recommendations:', error)
      toast({
        title: 'Error',
        description: 'Failed to load learning recommendations',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'workshop': return <Code className="h-4 w-4" />
      case 'concept': return <Lightbulb className="h-4 w-4" />
      case 'practice': return <Target className="h-4 w-4" />
      case 'reading': return <BookOpen className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'workshop': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'concept': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'practice': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'reading': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getPriorityIcon = (priority: number) => {
    if (priority >= 9) return <Crown className="h-4 w-4 text-purple-600" />
    if (priority >= 7) return <Star className="h-4 w-4 text-yellow-600" />
    if (priority >= 5) return <Award className="h-4 w-4 text-blue-600" />
    return <Zap className="h-4 w-4 text-gray-600" />
  }

  const formatEstimatedTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const handleRecommendationClick = (recommendation: LearningRecommendation) => {
    onRecommendationSelect?.(recommendation)
    
    // Track interaction
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'learning_recommendation_selected',
        properties: {
          type: recommendation.type,
          difficulty: recommendation.difficulty,
          priority: recommendation.priority
        }
      })
    }).catch(console.error)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              AI Learning Recommendations
            </CardTitle>
            <CardDescription>
              Personalized suggestions to accelerate your coding journey
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <div className="text-xs text-muted-foreground">
                Updated {lastUpdated.toLocaleDateString()}
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={loadRecommendations}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-1" />
              )}
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {loading && recommendations.length === 0 && (
          <div className="text-center py-12">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">David the Code Warrior is analyzing your progress...</p>
            <p className="text-xs text-muted-foreground mt-1">Crafting personalized recommendations</p>
          </div>
        )}

        {!loading && recommendations.length === 0 && (
          <div className="text-center py-12">
            <TrendingUp className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Recommendations Yet</h3>
            <p className="text-muted-foreground mb-4">
              Complete more workshops to get personalized learning suggestions
            </p>
            <Button onClick={loadRecommendations}>
              <Lightbulb className="h-4 w-4 mr-2" />
              Generate Recommendations
            </Button>
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="space-y-4">
            {/* Top Recommendation Highlight */}
            {recommendations[0] && (
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                      {getTypeIcon(recommendations[0].type)}
                      <span className="text-white text-xs block mt-1">TOP PICK</span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{recommendations[0].title}</h3>
                        {getPriorityIcon(recommendations[0].priority)}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {recommendations[0].description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className={getTypeColor(recommendations[0].type)}>
                          {recommendations[0].type}
                        </Badge>
                        <Badge className={getDifficultyColor(recommendations[0].difficulty)}>
                          {recommendations[0].difficulty}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatEstimatedTime(recommendations[0].estimatedTime)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Priority {recommendations[0].priority}/10
                        </Badge>
                      </div>
                      
                      <div className="bg-white/50 dark:bg-black/20 p-3 rounded-lg mb-3">
                        <p className="text-sm">
                          <strong>Why this helps:</strong> {recommendations[0].reasoning}
                        </p>
                      </div>
                      
                      <Button 
                        onClick={() => handleRecommendationClick(recommendations[0])}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Start Learning
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Other Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.slice(1).map((recommendation, index) => (
                <Card 
                  key={index}
                  className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => handleRecommendationClick(recommendation)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${getTypeColor(recommendation.type)}`}>
                        {getTypeIcon(recommendation.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">
                            {recommendation.title}
                          </h4>
                          {getPriorityIcon(recommendation.priority)}
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                          {recommendation.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          <Badge variant="outline" className="text-xs">
                            {recommendation.difficulty}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatEstimatedTime(recommendation.estimatedTime)}
                          </Badge>
                        </div>
                        
                        {recommendation.resources && recommendation.resources.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-xs font-medium">Resources:</p>
                            {recommendation.resources.slice(0, 2).map((resource, resourceIndex) => (
                              <div key={resourceIndex} className="text-xs text-muted-foreground">
                                <ExternalLink className="h-3 w-3 inline mr-1" />
                                {resource.title}
                              </div>
                            ))}
                            {recommendation.resources.length > 2 && (
                              <div className="text-xs text-muted-foreground">
                                +{recommendation.resources.length - 2} more resources
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                          Priority: {recommendation.priority}/10
                        </div>
                        <Progress 
                          value={recommendation.priority * 10} 
                          className="w-16 h-1"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recommendation Summary */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">AI Learning Insights</h4>
                    <p className="text-xs text-muted-foreground">
                      Based on your progress and learning patterns, focusing on these recommendations 
                      will maximize your skill development efficiency.
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Total Time</div>
                    <div className="font-semibold">
                      {formatEstimatedTime(
                        recommendations.reduce((total, rec) => total + rec.estimatedTime, 0)
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
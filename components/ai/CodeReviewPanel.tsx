'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { CodeReviewRequest, CodeReviewResponse } from '@/lib/ai/provider'
import { 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle,
  Info,
  Target,
  TrendingUp,
  Award,
  Lightbulb,
  Crown,
  Zap,
  Code,
  Eye,
  ThumbsUp,
  ArrowRight,
  Scroll,
  Loader2,
  RefreshCw
} from 'lucide-react'

interface CodeReviewPanelProps {
  code: string
  language: string
  context?: string
  workshopContext?: {
    workshopId: string
    stepId: string
    objectives: string[]
  }
  userLevel?: 'beginner' | 'intermediate' | 'advanced'
  focusAreas?: ('bugs' | 'performance' | 'readability' | 'security' | 'best-practices')[]
  onReviewComplete?: (review: CodeReviewResponse) => void
  className?: string
}

export function CodeReviewPanel({
  code,
  language,
  context,
  workshopContext,
  userLevel = 'intermediate',
  focusAreas = ['bugs', 'performance', 'readability'],
  onReviewComplete,
  className = ''
}: CodeReviewPanelProps) {
  const { toast } = useToast()
  const [review, setReview] = useState<CodeReviewResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [autoReview, setAutoReview] = useState(false)

  // Auto-review when code changes (with debounce)
  useEffect(() => {
    if (autoReview && code.trim().length > 50) {
      const timeoutId = setTimeout(() => {
        performReview()
      }, 2000)
      return () => clearTimeout(timeoutId)
    }
  }, [code, autoReview])

  const performReview = async () => {
    if (!code.trim()) {
      toast({
        title: 'No Code to Review',
        description: 'Please write some code first.',
        variant: 'default'
      })
      return
    }

    setLoading(true)
    setReview(null)

    try {
      const reviewRequest: CodeReviewRequest = {
        code,
        language,
        context,
        userLevel,
        focusAreas,
        workshopContext
      }

      const response = await fetch('/api/ai/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewRequest)
      })

      if (!response.ok) {
        throw new Error('Failed to get code review')
      }

      const reviewData: CodeReviewResponse = await response.json()
      setReview(reviewData)
      onReviewComplete?.(reviewData)

      toast({
        title: 'Code Review Complete! 📖',
        description: `Score: ${reviewData.overall.score}% - ${reviewData.overall.summary}`,
        variant: 'default'
      })

    } catch (error) {
      console.error('Error performing code review:', error)
      toast({
        title: 'Review Failed',
        description: 'Failed to get AI code review. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100 dark:bg-green-900/20'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
    return 'text-red-600 bg-red-100 dark:bg-red-900/20'
  }

  const getIssueSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case 'medium': return <Info className="h-4 w-4 text-yellow-600" />
      case 'low': return <Info className="h-4 w-4 text-blue-600" />
      default: return <Info className="h-4 w-4 text-gray-600" />
    }
  }

  const getIssueTypeIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'suggestion': return <Lightbulb className="h-4 w-4 text-blue-600" />
      case 'style': return <Eye className="h-4 w-4 text-purple-600" />
      default: return <Info className="h-4 w-4 text-gray-600" />
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'prophet': return <Crown className="h-4 w-4 text-purple-600" />
      case 'architect': return <Award className="h-4 w-4 text-gold-600" />
      case 'practitioner': return <Target className="h-4 w-4 text-blue-600" />
      case 'apprentice': return <Code className="h-4 w-4 text-green-600" />
      case 'novice': return <Zap className="h-4 w-4 text-gray-600" />
      default: return <Code className="h-4 w-4 text-gray-600" />
    }
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'performance': return <Zap className="h-4 w-4 text-yellow-600" />
      case 'readability': return <Eye className="h-4 w-4 text-blue-600" />
      case 'maintainability': return <Target className="h-4 w-4 text-green-600" />
      case 'security': return <AlertTriangle className="h-4 w-4 text-red-600" />
      default: return <Code className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Divine Code Review
            </CardTitle>
            <CardDescription>
              AI-powered code analysis with sacred wisdom
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoReview(!autoReview)}
              className={autoReview ? 'bg-primary/10' : ''}
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${autoReview ? 'text-primary' : ''}`} />
              Auto Review
            </Button>
            
            <Button
              onClick={performReview}
              disabled={loading || !code.trim()}
              size="sm"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Eye className="h-4 w-4 mr-1" />
              )}
              {loading ? 'Reviewing...' : 'Review Code'}
            </Button>
          </div>
        </div>

        {/* Focus Areas */}
        <div className="flex flex-wrap gap-2 mt-2">
          {focusAreas.map(area => (
            <Badge key={area} variant="outline" className="text-xs">
              {area.replace('-', ' ')}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">King Solomon is analyzing your code...</p>
            <p className="text-xs text-muted-foreground mt-1">This may take a moment for complex code</p>
          </div>
        )}

        {!loading && !review && (
          <div className="text-center py-12">
            <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Ready for Divine Review</h3>
            <p className="text-muted-foreground mb-4">
              Submit your code for AI-powered analysis and feedback
            </p>
            <Button onClick={performReview} disabled={!code.trim()}>
              <Eye className="h-4 w-4 mr-2" />
              Start Code Review
            </Button>
          </div>
        )}

        {review && (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="issues">Issues</TabsTrigger>
              <TabsTrigger value="improvements">Improvements</TabsTrigger>
              <TabsTrigger value="positives">Positives</TabsTrigger>
              <TabsTrigger value="wisdom">Wisdom</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Overall Score */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${getScoreColor(review.overall.score)}`}>
                        {getLevelIcon(review.overall.level)}
                      </div>
                      <div>
                        <h3 className="font-semibold">Overall Assessment</h3>
                        <p className="text-sm text-muted-foreground">{review.overall.summary}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-3xl font-bold">{review.overall.score}%</div>
                      <Badge variant="outline" className="mt-1">
                        {review.overall.level}
                      </Badge>
                    </div>
                  </div>
                  
                  <Progress value={review.overall.score} className="h-2" />
                </CardContent>
              </Card>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{review.issues.length}</div>
                    <div className="text-sm text-muted-foreground">Issues Found</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{review.improvements.length}</div>
                    <div className="text-sm text-muted-foreground">Improvements</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <ThumbsUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{review.positives.length}</div>
                    <div className="text-sm text-muted-foreground">Positives</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{review.nextSteps.length}</div>
                    <div className="text-sm text-muted-foreground">Next Steps</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="issues" className="space-y-4">
              {review.issues.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-600 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No Issues Found!</h3>
                  <p className="text-muted-foreground">Your code looks clean and well-written.</p>
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {review.issues.map((issue, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              {getIssueTypeIcon(issue.type)}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-xs">
                                  {issue.type}
                                </Badge>
                                <Badge 
                                  variant={issue.severity === 'critical' ? 'destructive' : 'secondary'}
                                  className="text-xs"
                                >
                                  {issue.severity}
                                </Badge>
                                {issue.line && (
                                  <Badge variant="outline" className="text-xs">
                                    Line {issue.line}
                                  </Badge>
                                )}
                              </div>
                              
                              <p className="text-sm mb-2">{issue.message}</p>
                              
                              {issue.suggestion && (
                                <div className="bg-muted/50 p-3 rounded-lg">
                                  <p className="text-xs text-muted-foreground mb-1">💡 Suggestion:</p>
                                  <p className="text-sm">{issue.suggestion}</p>
                                </div>
                              )}
                              
                              {issue.codeExample && (
                                <div className="mt-2">
                                  <p className="text-xs text-muted-foreground mb-1">✨ Better approach:</p>
                                  <pre className="bg-background p-2 rounded border text-xs font-mono overflow-x-auto">
                                    {issue.codeExample}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>

            <TabsContent value="improvements" className="space-y-4">
              {review.improvements.length === 0 ? (
                <div className="text-center py-8">
                  <Award className="h-16 w-16 mx-auto mb-4 text-gold-600 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Code is Optimal!</h3>
                  <p className="text-muted-foreground">No immediate improvements suggested.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {review.improvements.map((improvement, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {getImpactIcon(improvement.impact)}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{improvement.title}</h4>
                              <Badge variant="outline" className="text-xs">
                                {improvement.impact}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-3">
                              {improvement.description}
                            </p>
                            
                            {improvement.before && improvement.after && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs text-muted-foreground mb-2">❌ Before:</p>
                                  <pre className="bg-red-50 dark:bg-red-900/10 p-3 rounded border text-xs font-mono overflow-x-auto">
                                    {improvement.before}
                                  </pre>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground mb-2">✅ After:</p>
                                  <pre className="bg-green-50 dark:bg-green-900/10 p-3 rounded border text-xs font-mono overflow-x-auto">
                                    {improvement.after}
                                  </pre>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="positives" className="space-y-4">
              <div className="space-y-3">
                {review.positives.map((positive, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <ThumbsUp className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <p className="text-sm">{positive}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {review.nextSteps.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    Recommended Next Steps
                  </h4>
                  <div className="space-y-2">
                    {review.nextSteps.map((step, index) => (
                      <Card key={index}>
                        <CardContent className="p-3">
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="text-xs mt-0.5">
                              {index + 1}
                            </Badge>
                            <p className="text-sm">{step}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="wisdom" className="space-y-4">
              <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-700">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
                      <Scroll className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2 text-purple-800 dark:text-purple-200">
                        Divine Coding Wisdom
                      </h3>
                      <p className="text-purple-700 dark:text-purple-300 leading-relaxed">
                        {review.divineWisdom}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}
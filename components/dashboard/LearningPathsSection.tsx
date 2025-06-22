'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  BookOpen, 
  Clock, 
  Award, 
  Play, 
  CheckCircle, 
  Circle, 
  Lock,
  Flame,
  Star,
  TrendingUp,
  MapPin,
  ArrowRight,
  Calendar
} from 'lucide-react'

interface Workshop {
  id: string
  title: string
  progress: number
  lastAccessed: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime?: string
  xpReward?: number
}

interface LearningPath {
  id: string
  name: string
  description: string
  totalWorkshops: number
  completedWorkshops: number
  progress: number
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedWeeks: number
  skills: string[]
  isRecommended?: boolean
  isPopular?: boolean
}

interface LearningPathsSectionProps {
  recentWorkshops: Workshop[]
  userLevel: number
  userInterests: string[]
  tier: string
}

export function LearningPathsSection({ 
  recentWorkshops, 
  userLevel, 
  userInterests,
  tier 
}: LearningPathsSectionProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'recent' | 'paths' | 'recommended'>('recent')
  const [loading, setLoading] = useState<string | null>(null)

  // Mock learning paths data
  const learningPaths: LearningPath[] = [
    {
      id: '1',
      name: 'Divine React Mastery',
      description: 'Master the sacred art of React development from fundamentals to advanced patterns',
      totalWorkshops: 12,
      completedWorkshops: 3,
      progress: 25,
      category: 'Frontend',
      difficulty: 'intermediate',
      estimatedWeeks: 8,
      skills: ['React', 'JavaScript', 'Hooks', 'Context API'],
      isRecommended: true,
      isPopular: true
    },
    {
      id: '2',
      name: 'Full Stack Prophet',
      description: 'Complete journey from frontend to backend mastery',
      totalWorkshops: 20,
      completedWorkshops: 0,
      progress: 0,
      category: 'Full Stack',
      difficulty: 'advanced',
      estimatedWeeks: 16,
      skills: ['React', 'Node.js', 'MongoDB', 'Express'],
      isPopular: true
    },
    {
      id: '3',
      name: 'TypeScript Enlightenment',
      description: 'Achieve type safety and code clarity with TypeScript',
      totalWorkshops: 8,
      completedWorkshops: 1,
      progress: 12,
      category: 'Language',
      difficulty: 'intermediate',
      estimatedWeeks: 4,
      skills: ['TypeScript', 'JavaScript', 'Types', 'Interfaces'],
      isRecommended: userInterests.includes('TypeScript')
    },
    {
      id: '4',
      name: 'AI/ML Divine Path',
      description: 'Journey into artificial intelligence and machine learning',
      totalWorkshops: 15,
      completedWorkshops: 0,
      progress: 0,
      category: 'AI/ML',
      difficulty: 'advanced',
      estimatedWeeks: 12,
      skills: ['Python', 'TensorFlow', 'Neural Networks', 'Data Science'],
      isRecommended: userInterests.includes('AI/Machine Learning')
    }
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const formatLastAccessed = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  const handleWorkshopClick = async (workshopId: string) => {
    setLoading(workshopId)
    await new Promise(resolve => setTimeout(resolve, 500))
    router.push(`/workshops/${workshopId}`)
    setLoading(null)
  }

  const handlePathClick = async (pathId: string) => {
    setLoading(pathId)
    await new Promise(resolve => setTimeout(resolve, 500))
    router.push(`/learning-paths/${pathId}`)
    setLoading(null)
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Learning Journey</CardTitle>
              <CardDescription>
                Your personalized path to coding mastery
              </CardDescription>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          {[
            { id: 'recent', label: 'Recent', icon: Clock },
            { id: 'paths', label: 'Paths', icon: MapPin },
            { id: 'recommended', label: 'For You', icon: Star }
          ].map(tab => {
            const Icon = tab.icon
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab(tab.id as any)}
                className="flex-1"
              >
                <Icon className="h-4 w-4 mr-1" />
                {tab.label}
              </Button>
            )
          })}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Recent Workshops */}
        {activeTab === 'recent' && (
          <div className="space-y-3">
            {recentWorkshops.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No recent workshops</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => router.push('/workshops')}
                >
                  Browse Workshops
                </Button>
              </div>
            ) : (
              recentWorkshops.map(workshop => (
                <div
                  key={workshop.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer group"
                  onClick={() => handleWorkshopClick(workshop.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium group-hover:text-primary transition-colors">
                      {workshop.title}
                    </h4>
                    <Badge 
                      variant="outline" 
                      className={getDifficultyColor(workshop.difficulty)}
                    >
                      {workshop.difficulty}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{workshop.progress}%</span>
                    </div>
                    <Progress value={workshop.progress} className="h-2" />
                  </div>
                  
                  <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatLastAccessed(workshop.lastAccessed)}
                    </div>
                    <div className="flex items-center gap-1">
                      {workshop.progress === 100 ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <Play className="h-3 w-3" />
                      )}
                      {workshop.progress === 100 ? 'Completed' : 'Continue'}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Learning Paths */}
        {activeTab === 'paths' && (
          <div className="space-y-3">
            {learningPaths.map(path => (
              <div
                key={path.id}
                className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer group"
                onClick={() => handlePathClick(path.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium group-hover:text-primary transition-colors">
                        {path.name}
                      </h4>
                      {path.isPopular && (
                        <Badge variant="outline" className="text-xs">
                          <Flame className="h-3 w-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {path.description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    {path.totalWorkshops} workshops
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {path.estimatedWeeks} weeks
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${getDifficultyColor(path.difficulty)} text-xs`}
                  >
                    {path.difficulty}
                  </Badge>
                </div>
                
                {path.progress > 0 && (
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {path.completedWorkshops}/{path.totalWorkshops} completed
                      </span>
                    </div>
                    <Progress value={path.progress} className="h-2" />
                  </div>
                )}
                
                <div className="flex flex-wrap gap-1">
                  {path.skills.slice(0, 4).map(skill => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {path.skills.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{path.skills.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recommended Paths */}
        {activeTab === 'recommended' && (
          <div className="space-y-3">
            {learningPaths.filter(path => path.isRecommended).map(path => (
              <div
                key={path.id}
                className="p-4 border-2 border-primary/20 rounded-lg hover:shadow-md transition-all cursor-pointer group bg-gradient-to-r from-primary/5 to-transparent"
                onClick={() => handlePathClick(path.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <h4 className="font-medium group-hover:text-primary transition-colors">
                        {path.name}
                      </h4>
                      <Badge className="text-xs bg-primary/10 text-primary border-primary/20">
                        Recommended
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {path.description}
                    </p>
                  </div>
                </div>
                
                <div className="bg-white/50 dark:bg-black/20 p-3 rounded border mb-3">
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Why recommended for you:</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Based on your interests in {userInterests.slice(0, 2).join(' and ')}, 
                    this path will enhance your skills and prepare you for advanced concepts.
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      {path.totalWorkshops} workshops
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {path.estimatedWeeks} weeks
                    </div>
                  </div>
                  
                  <Button size="sm" className="ml-auto">
                    Start Journey
                  </Button>
                </div>
              </div>
            ))}
            
            {learningPaths.filter(path => path.isRecommended).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Star className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Complete more workshops to get personalized recommendations</p>
              </div>
            )}
          </div>
        )}

        {/* Browse All Button */}
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => router.push('/workshops')}
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Browse All Workshops
        </Button>
      </CardContent>
    </Card>
  )
}
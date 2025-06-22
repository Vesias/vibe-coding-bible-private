'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { AuthGuard } from '@/lib/auth/guards'
import { useAdvancedAuth } from '@/lib/auth/hooks'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { SacredGeometry } from '@/components/illustrations/SacredGeometry'
import { 
  BookOpen, 
  Play, 
  Clock, 
  Award, 
  Target, 
  Users,
  Search,
  Filter,
  Star,
  CheckCircle,
  Lock,
  Crown,
  Zap,
  Code,
  Flame,
  TrendingUp,
  Calendar,
  ArrowRight,
  Globe,
  Heart
} from 'lucide-react'

interface Workshop {
  id: string
  title: string
  slug: string
  description: string
  commandment_number: number
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  estimated_duration: number
  xp_reward: number
  prerequisites: string[]
  learning_objectives: string[]
  tools_required: string[]
  is_published: boolean
  featured_image?: string
  progress?: {
    status: 'not_started' | 'in_progress' | 'completed' | 'mastered'
    progress_percentage: number
    xp_earned: number
  }
}

export default function WorkshopsPage() {
  const { user, workshopAccess, tier, loading } = useAdvancedAuth()
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()
  
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loadingWorkshops, setLoadingWorkshops] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'not_started' | 'in_progress' | 'completed'>('all')
  const [sortBy, setSortBy] = useState<'commandment' | 'difficulty' | 'duration' | 'progress'>('commandment')

  useEffect(() => {
    if (user) {
      loadWorkshops()
    }
  }, [user])

  const loadWorkshops = async () => {
    setLoadingWorkshops(true)
    
    try {
      // Load workshops
      const { data: workshopsData, error: workshopsError } = await supabase
        .from('workshops')
        .select('*')
        .eq('is_published', true)
        .order('commandment_number')

      if (workshopsError) throw workshopsError

      // Load user progress for these workshops
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user?.id)
        .in('workshop_id', workshopsData?.map(w => w.id) || [])

      if (progressError && progressError.code !== 'PGRST116') {
        throw progressError
      }

      // Combine workshop data with progress
      const workshopsWithProgress = workshopsData?.map(workshop => ({
        ...workshop,
        progress: progressData?.find(p => p.workshop_id === workshop.id) || {
          status: 'not_started' as const,
          progress_percentage: 0,
          xp_earned: 0
        }
      })) || []

      setWorkshops(workshopsWithProgress)
      
    } catch (error) {
      console.error('Error loading workshops:', error)
      toast({
        title: "Error",
        description: "Failed to load workshops",
        variant: "destructive"
      })
    } finally {
      setLoadingWorkshops(false)
    }
  }

  const handleStartWorkshop = (workshop: Workshop) => {
    if (!workshopAccess.canAccessWorkshop(workshop.id)) {
      router.push('/pricing')
      return
    }

    router.push(`/workshops/${workshop.slug}`)
  }

  const filteredWorkshops = workshops
    .filter(workshop => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (
          !workshop.title.toLowerCase().includes(query) &&
          !workshop.description.toLowerCase().includes(query) &&
          !workshop.learning_objectives.some(obj => obj.toLowerCase().includes(query))
        ) {
          return false
        }
      }

      // Difficulty filter
      if (difficultyFilter !== 'all' && workshop.difficulty_level !== difficultyFilter) {
        return false
      }

      // Status filter
      if (statusFilter !== 'all' && workshop.progress?.status !== statusFilter) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'commandment':
          return a.commandment_number - b.commandment_number
        case 'difficulty':
          const diffOrder = { beginner: 1, intermediate: 2, advanced: 3 }
          return diffOrder[a.difficulty_level] - diffOrder[b.difficulty_level]
        case 'duration':
          return a.estimated_duration - b.estimated_duration
        case 'progress':
          return (b.progress?.progress_percentage || 0) - (a.progress?.progress_percentage || 0)
        default:
          return 0
      }
    })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'mastered': return <Crown className="h-4 w-4 text-yellow-600" />
      case 'in_progress': return <Play className="h-4 w-4 text-blue-600" />
      default: return <BookOpen className="h-4 w-4 text-gray-600" />
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const calculateOverallProgress = () => {
    const totalWorkshops = workshops.length
    const completedWorkshops = workshops.filter(w => w.progress?.status === 'completed' || w.progress?.status === 'mastered').length
    return totalWorkshops > 0 ? Math.round((completedWorkshops / totalWorkshops) * 100) : 0
  }

  const getTotalXPEarned = () => {
    return workshops.reduce((total, workshop) => total + (workshop.progress?.xp_earned || 0), 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
        {/* Sacred Geometry Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <SacredGeometry 
            type="sri_yantra" 
            className="absolute top-1/4 right-1/4 opacity-5 scale-150" 
          />
          <SacredGeometry 
            type="metatrons_cube" 
            className="absolute bottom-1/4 left-1/4 opacity-5 scale-75" 
          />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b">
            <div className="container mx-auto px-4 py-8">
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
                  <BookOpen className="h-10 w-10 text-primary" />
                  Sacred Workshops
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Embark on divine coding commandments and master the sacred arts of programming
                </p>

                {/* Progress Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mt-8">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{calculateOverallProgress()}%</div>
                      <div className="text-sm text-muted-foreground">Overall Progress</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Zap className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{getTotalXPEarned().toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">XP Earned</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Crown className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold">
                        {workshops.filter(w => w.progress?.status === 'mastered').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Mastered</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="container mx-auto px-4 py-8">
            <Card className="mb-8">
              <CardHeader>
                <div className="flex flex-col lg:flex-row gap-4 justify-between">
                  {/* Search */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search divine knowledge..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Filters */}
                  <div className="flex gap-2 flex-wrap">
                    {/* Difficulty Filter */}
                    <select
                      value={difficultyFilter}
                      onChange={(e) => setDifficultyFilter(e.target.value as any)}
                      className="px-3 py-2 border rounded-md text-sm"
                    >
                      <option value="all">All Difficulties</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>

                    {/* Status Filter */}
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="px-3 py-2 border rounded-md text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="not_started">Not Started</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>

                    {/* Sort */}
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="px-3 py-2 border rounded-md text-sm"
                    >
                      <option value="commandment">By Commandment</option>
                      <option value="difficulty">By Difficulty</option>
                      <option value="duration">By Duration</option>
                      <option value="progress">By Progress</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Workshops Grid */}
            {loadingWorkshops ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading divine workshops...</p>
              </div>
            ) : filteredWorkshops.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No Workshops Found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWorkshops.map(workshop => (
                  <Card 
                    key={workshop.id} 
                    className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden"
                    onClick={() => handleStartWorkshop(workshop)}
                  >
                    {/* Featured Image or Commandment Badge */}
                    <div className="relative h-48 bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="text-4xl font-bold mb-2">
                          {workshop.commandment_number}
                        </div>
                        <div className="text-sm opacity-90">
                          Commandment
                        </div>
                      </div>
                      
                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        {getStatusIcon(workshop.progress?.status || 'not_started')}
                      </div>

                      {/* Lock indicator for restricted access */}
                      {!workshopAccess.canAccessWorkshop(workshop.id) && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="text-center text-white">
                            <Lock className="h-8 w-8 mx-auto mb-2" />
                            <div className="text-sm">Upgrade Required</div>
                          </div>
                        </div>
                      )}
                    </div>

                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                            {workshop.title}
                          </CardTitle>
                          <CardDescription className="line-clamp-2 mt-1">
                            {workshop.description}
                          </CardDescription>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {workshop.progress?.progress_percentage > 0 && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Progress</span>
                            <span>{workshop.progress.progress_percentage}%</span>
                          </div>
                          <Progress value={workshop.progress.progress_percentage} className="h-2" />
                        </div>
                      )}
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Badges */}
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getDifficultyColor(workshop.difficulty_level)}>
                          {workshop.difficulty_level}
                        </Badge>
                        
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDuration(workshop.estimated_duration)}
                        </Badge>
                        
                        <Badge variant="outline" className="text-xs">
                          <Award className="h-3 w-3 mr-1" />
                          {workshop.xp_reward} XP
                        </Badge>
                      </div>

                      {/* Learning Objectives */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">You will learn:</h4>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {workshop.learning_objectives.slice(0, 3).map((objective, index) => (
                            <li key={index} className="flex items-start gap-1">
                              <Target className="h-3 w-3 mt-0.5 flex-shrink-0" />
                              <span className="line-clamp-1">{objective}</span>
                            </li>
                          ))}
                          {workshop.learning_objectives.length > 3 && (
                            <li className="text-xs text-muted-foreground">
                              +{workshop.learning_objectives.length - 3} more objectives
                            </li>
                          )}
                        </ul>
                      </div>

                      {/* Prerequisites */}
                      {workshop.prerequisites.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Prerequisites:</h4>
                          <div className="flex flex-wrap gap-1">
                            {workshop.prerequisites.slice(0, 2).map((prereq, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {prereq}
                              </Badge>
                            ))}
                            {workshop.prerequisites.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{workshop.prerequisites.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Button */}
                      <Button 
                        className="w-full group-hover:bg-primary/90 transition-colors"
                        disabled={!workshopAccess.canAccessWorkshop(workshop.id)}
                      >
                        {!workshopAccess.canAccessWorkshop(workshop.id) ? (
                          <>
                            <Crown className="h-4 w-4 mr-2" />
                            Upgrade to Access
                          </>
                        ) : workshop.progress?.status === 'completed' ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Review Workshop
                          </>
                        ) : workshop.progress?.status === 'in_progress' ? (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Continue Learning
                          </>
                        ) : (
                          <>
                            <BookOpen className="h-4 w-4 mr-2" />
                            Begin Journey
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Tier Upgrade Prompt */}
            {workshopAccess.isAtLimit && (
              <Card className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
                        <Crown className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Unlock Divine Knowledge</h3>
                        <p className="text-sm text-muted-foreground">
                          You've reached your monthly workshop limit. Upgrade to access unlimited divine coding wisdom.
                        </p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => router.push('/pricing')}
                      className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade to {tier === 'free' ? 'Apostle' : 'Prophet'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
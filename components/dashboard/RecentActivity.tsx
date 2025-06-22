'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Activity, 
  BookOpen, 
  Award, 
  Users, 
  Zap, 
  Clock, 
  Calendar,
  CheckCircle,
  Star,
  TrendingUp,
  Code,
  MessageSquare,
  Share2
} from 'lucide-react'

interface Workshop {
  id: string
  title: string
  progress: number
  lastAccessed: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

interface XPGain {
  amount: number
  source: string
  timestamp: string
}

interface RecentActivityProps {
  recentWorkshops: Workshop[]
  xpGains: XPGain[]
  user: any
}

interface ActivityItem {
  id: string
  type: 'workshop' | 'xp' | 'achievement' | 'collaboration' | 'streak' | 'milestone'
  title: string
  description: string
  timestamp: string
  icon: any
  color: string
  value?: number
  badge?: string
}

export function RecentActivity({ 
  recentWorkshops, 
  xpGains = [], 
  user 
}: RecentActivityProps) {
  const [filter, setFilter] = useState<'all' | 'workshops' | 'achievements' | 'social'>('all')

  // Generate comprehensive activity feed
  const generateActivities = (): ActivityItem[] => {
    const activities: ActivityItem[] = []

    // Add workshop activities
    recentWorkshops.forEach(workshop => {
      if (workshop.progress === 100) {
        activities.push({
          id: `workshop-completed-${workshop.id}`,
          type: 'workshop',
          title: 'Workshop Completed',
          description: `Mastered "${workshop.title}"`,
          timestamp: workshop.lastAccessed,
          icon: CheckCircle,
          color: 'text-green-600 bg-green-100 dark:bg-green-900/20',
          badge: workshop.difficulty
        })
      } else if (workshop.progress > 0) {
        activities.push({
          id: `workshop-progress-${workshop.id}`,
          type: 'workshop',
          title: 'Workshop Progress',
          description: `Continued "${workshop.title}" (${workshop.progress}%)`,
          timestamp: workshop.lastAccessed,
          icon: BookOpen,
          color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20',
          value: workshop.progress
        })
      }
    })

    // Add XP gain activities
    xpGains.forEach((gain, index) => {
      activities.push({
        id: `xp-${index}`,
        type: 'xp',
        title: 'XP Gained',
        description: `Earned ${gain.amount} XP from ${gain.source}`,
        timestamp: gain.timestamp,
        icon: Zap,
        color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20',
        value: gain.amount
      })
    })

    // Add mock achievements and milestones
    activities.push(
      {
        id: 'achievement-first-workshop',
        type: 'achievement',
        title: 'Achievement Unlocked',
        description: 'First Steps - Completed your first workshop',
        timestamp: '2024-01-19T10:00:00Z',
        icon: Award,
        color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20',
        badge: 'Common'
      },
      {
        id: 'streak-milestone',
        type: 'streak',
        title: 'Streak Milestone',
        description: '5-day learning streak achieved!',
        timestamp: '2024-01-18T20:00:00Z',
        icon: Star,
        color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/20',
        value: 5
      },
      {
        id: 'collaboration-joined',
        type: 'collaboration',
        title: 'Joined Session',
        description: 'Collaborated on React patterns workshop',
        timestamp: '2024-01-17T14:30:00Z',
        icon: Users,
        color: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/20'
      },
      {
        id: 'milestone-level-up',
        type: 'milestone',
        title: 'Level Up!',
        description: `Reached Level ${user?.current_level || 2}`,
        timestamp: '2024-01-16T16:45:00Z',
        icon: TrendingUp,
        color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20',
        value: user?.current_level || 2
      }
    )

    // Sort by timestamp (newest first)
    return activities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  }

  const activities = generateActivities()

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true
    if (filter === 'workshops') return activity.type === 'workshop'
    if (filter === 'achievements') return ['achievement', 'milestone', 'streak'].includes(activity.type)
    if (filter === 'social') return ['collaboration'].includes(activity.type)
    return true
  })

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  const getFilterCount = (filterType: string) => {
    return activities.filter(activity => {
      if (filterType === 'workshops') return activity.type === 'workshop'
      if (filterType === 'achievements') return ['achievement', 'milestone', 'streak'].includes(activity.type)
      if (filterType === 'social') return ['collaboration'].includes(activity.type)
      return true
    }).length
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>
                Your latest coding adventures
              </CardDescription>
            </div>
          </div>
        </div>

        {/* Activity Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: 'all', label: 'All', count: activities.length },
            { id: 'workshops', label: 'Workshops', count: getFilterCount('workshops') },
            { id: 'achievements', label: 'Achievements', count: getFilterCount('achievements') },
            { id: 'social', label: 'Social', count: getFilterCount('social') }
          ].map(filterOption => (
            <Button
              key={filterOption.id}
              variant={filter === filterOption.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(filterOption.id as any)}
              className="flex-shrink-0"
            >
              {filterOption.label}
              {filterOption.count > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {filterOption.count}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Activity Feed */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No recent activity</p>
              <p className="text-sm">Start a workshop to see your progress here!</p>
            </div>
          ) : (
            filteredActivities.map((activity, index) => {
              const Icon = activity.icon
              
              return (
                <div key={activity.id} className="flex items-start space-x-3 group">
                  {/* Activity Icon */}
                  <div className={`flex-shrink-0 p-2 rounded-lg ${activity.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  
                  {/* Activity Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm group-hover:text-primary transition-colors">
                        {activity.title}
                      </p>
                      <div className="flex items-center gap-2">
                        {activity.value && (
                          <Badge variant="outline" className="text-xs">
                            {activity.type === 'xp' && '+'}
                            {activity.value}
                            {activity.type === 'xp' && ' XP'}
                            {activity.type === 'streak' && ' days'}
                            {activity.type === 'workshop' && '%'}
                          </Badge>
                        )}
                        {activity.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {activity.badge}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-1">
                      {activity.description}
                    </p>
                    
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimestamp(activity.timestamp)}
                      </div>
                      
                      {/* Share Button for Achievements */}
                      {activity.type === 'achievement' && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-auto p-0 text-xs hover:text-primary"
                        >
                          <Share2 className="h-3 w-3 mr-1" />
                          Share
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Activity Summary */}
        {activities.length > 0 && (
          <div className="border-t pt-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-blue-600">
                  {activities.filter(a => a.type === 'workshop').length}
                </div>
                <div className="text-xs text-muted-foreground">Workshops</div>
              </div>
              <div>
                <div className="text-lg font-bold text-yellow-600">
                  {activities.filter(a => a.type === 'xp').reduce((sum, a) => sum + (a.value || 0), 0)}
                </div>
                <div className="text-xs text-muted-foreground">XP Gained</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-600">
                  {activities.filter(a => ['achievement', 'milestone', 'streak'].includes(a.type)).length}
                </div>
                <div className="text-xs text-muted-foreground">Achievements</div>
              </div>
            </div>
          </div>
        )}

        {/* Weekly Goal Progress */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 p-4 rounded-lg border border-blue-200/50 dark:border-blue-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-sm">This Week's Progress</span>
            <Calendar className="h-4 w-4 text-blue-600" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Daily Activity Goal</span>
              <span className="font-medium">5/7 days</span>
            </div>
            <div className="flex space-x-1">
              {Array.from({ length: 7 }, (_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-2 rounded-full ${
                    i < 5 
                      ? 'bg-blue-500' 
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              2 more days to complete weekly goal
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
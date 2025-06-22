'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Award, 
  Trophy, 
  Star, 
  Crown, 
  Zap, 
  Target, 
  Lock,
  Unlock,
  Gift,
  Medal,
  Shield,
  Gem,
  Flame,
  Heart,
  TrendingUp,
  Calendar,
  Users,
  Code,
  BookOpen
} from 'lucide-react'

interface Achievement {
  id: string
  name: string
  description: string
  earned: boolean
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'divine'
  progress?: number
  maxProgress?: number
  reward?: string
  unlockedAt?: string
  category: 'learning' | 'social' | 'streak' | 'mastery' | 'special'
}

interface AchievementsPanelProps {
  achievements: Achievement[]
  userXP: number
  userRank: string
  tier: string
}

export function AchievementsPanel({ 
  achievements, 
  userXP, 
  userRank, 
  tier 
}: AchievementsPanelProps) {
  const router = useRouter()
  const [filter, setFilter] = useState<'all' | 'earned' | 'locked' | 'near'>('all')
  const [category, setCategory] = useState<'all' | Achievement['category']>('all')

  // Comprehensive achievements system
  const allAchievements: Achievement[] = [
    // Learning achievements
    {
      id: 'first-workshop',
      name: 'First Steps',
      description: 'Complete your first workshop',
      earned: true,
      rarity: 'common',
      category: 'learning',
      reward: '100 XP',
      unlockedAt: '2024-01-18T10:00:00Z'
    },
    {
      id: 'workshop-master',
      name: 'Workshop Apprentice',
      description: 'Complete 10 workshops',
      earned: false,
      rarity: 'rare',
      category: 'learning',
      progress: 3,
      maxProgress: 10,
      reward: '500 XP + Special Badge'
    },
    {
      id: 'xp-milestone-1k',
      name: 'Knowledge Seeker',
      description: 'Earn 1,000 total XP',
      earned: userXP >= 1000,
      rarity: 'common',
      category: 'learning',
      progress: Math.min(userXP, 1000),
      maxProgress: 1000,
      reward: '200 XP + Title'
    },
    {
      id: 'xp-milestone-5k',
      name: 'Wisdom Gatherer',
      description: 'Earn 5,000 total XP',
      earned: userXP >= 5000,
      rarity: 'rare',
      category: 'learning',
      progress: Math.min(userXP, 5000),
      maxProgress: 5000,
      reward: '1000 XP + Divine Badge'
    },
    {
      id: 'perfect-score',
      name: 'Code Perfectionist',
      description: 'Score 100% on 5 challenges',
      earned: false,
      rarity: 'epic',
      category: 'mastery',
      progress: 2,
      maxProgress: 5,
      reward: 'Golden Code Badge'
    },

    // Streak achievements
    {
      id: 'streak-7',
      name: 'Week Warrior',
      description: 'Maintain 7-day learning streak',
      earned: true,
      rarity: 'common',
      category: 'streak',
      reward: '300 XP',
      unlockedAt: '2024-01-15T20:00:00Z'
    },
    {
      id: 'streak-30',
      name: 'Monthly Master',
      description: 'Maintain 30-day learning streak',
      earned: false,
      rarity: 'epic',
      category: 'streak',
      progress: 5,
      maxProgress: 30,
      reward: 'Fire Badge + 1500 XP'
    },
    {
      id: 'streak-100',
      name: 'Legendary Dedication',
      description: 'Maintain 100-day learning streak',
      earned: false,
      rarity: 'legendary',
      category: 'streak',
      progress: 5,
      maxProgress: 100,
      reward: 'Legendary Title + Divine Rewards'
    },

    // Social achievements
    {
      id: 'first-collaboration',
      name: 'Team Player',
      description: 'Join your first collaboration session',
      earned: false,
      rarity: 'common',
      category: 'social',
      reward: '200 XP'
    },
    {
      id: 'mentor-helper',
      name: 'Helpful Mentor',
      description: 'Help 10 fellow coders',
      earned: false,
      rarity: 'rare',
      category: 'social',
      progress: 0,
      maxProgress: 10,
      reward: 'Mentor Badge + 750 XP'
    },
    {
      id: 'community-star',
      name: 'Community Star',
      description: 'Receive 100 likes on contributions',
      earned: false,
      rarity: 'epic',
      category: 'social',
      progress: 23,
      maxProgress: 100,
      reward: 'Star Badge + Special Title'
    },

    // Mastery achievements
    {
      id: 'react-master',
      name: 'React Prophet',
      description: 'Master all React workshops',
      earned: false,
      rarity: 'legendary',
      category: 'mastery',
      progress: 3,
      maxProgress: 12,
      reward: 'React Prophet Title + NFT Badge'
    },
    {
      id: 'fullstack-master',
      name: 'Full Stack Divine',
      description: 'Complete the Full Stack Prophet path',
      earned: false,
      rarity: 'divine',
      category: 'mastery',
      progress: 0,
      maxProgress: 20,
      reward: 'Divine Title + Exclusive NFT'
    },

    // Special achievements
    {
      id: 'early-adopter',
      name: 'Divine Pioneer',
      description: 'Joined during beta launch',
      earned: true,
      rarity: 'legendary',
      category: 'special',
      reward: 'Pioneer Badge + Lifetime Perks',
      unlockedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'prophet-rank',
      name: 'Code Prophet',
      description: 'Reach Prophet rank',
      earned: userRank === 'prophet',
      rarity: 'divine',
      category: 'mastery',
      reward: 'Prophet Crown + Divine Privileges'
    }
  ]

  const getRarityConfig = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common':
        return { 
          color: 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400',
          icon: Medal,
          glow: 'shadow-gray-200 dark:shadow-gray-800'
        }
      case 'rare':
        return { 
          color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400',
          icon: Award,
          glow: 'shadow-blue-200 dark:shadow-blue-800'
        }
      case 'epic':
        return { 
          color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400',
          icon: Star,
          glow: 'shadow-purple-200 dark:shadow-purple-800'
        }
      case 'legendary':
        return { 
          color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400',
          icon: Crown,
          glow: 'shadow-yellow-200 dark:shadow-yellow-800'
        }
      case 'divine':
        return { 
          color: 'text-pink-600 bg-pink-100 dark:bg-pink-900/20 dark:text-pink-400',
          icon: Gem,
          glow: 'shadow-pink-200 dark:shadow-pink-800'
        }
    }
  }

  const getCategoryIcon = (category: Achievement['category']) => {
    switch (category) {
      case 'learning': return BookOpen
      case 'social': return Users
      case 'streak': return Flame
      case 'mastery': return Target
      case 'special': return Gift
      default: return Award
    }
  }

  const filteredAchievements = allAchievements.filter(achievement => {
    if (category !== 'all' && achievement.category !== category) return false
    
    switch (filter) {
      case 'earned': return achievement.earned
      case 'locked': return !achievement.earned
      case 'near': 
        return !achievement.earned && 
               achievement.progress !== undefined && 
               achievement.maxProgress !== undefined &&
               (achievement.progress / achievement.maxProgress) >= 0.5
      default: return true
    }
  })

  const stats = {
    total: allAchievements.length,
    earned: allAchievements.filter(a => a.earned).length,
    commonEarned: allAchievements.filter(a => a.earned && a.rarity === 'common').length,
    rareEarned: allAchievements.filter(a => a.earned && a.rarity === 'rare').length,
    epicEarned: allAchievements.filter(a => a.earned && a.rarity === 'epic').length,
    legendaryEarned: allAchievements.filter(a => a.earned && a.rarity === 'legendary').length,
    divineEarned: allAchievements.filter(a => a.earned && a.rarity === 'divine').length
  }

  const completionPercentage = Math.round((stats.earned / stats.total) * 100)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Divine Achievements</CardTitle>
              <CardDescription>
                Your legendary accomplishments ({stats.earned}/{stats.total})
              </CardDescription>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/achievements')}
          >
            View All
          </Button>
        </div>

        {/* Progress Overview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span>Completion Progress</span>
            <span className="font-medium">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-3" />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          {[
            { id: 'all', label: 'All', count: allAchievements.length },
            { id: 'earned', label: 'Earned', count: stats.earned },
            { id: 'near', label: 'Close', count: allAchievements.filter(a => 
              !a.earned && a.progress !== undefined && a.maxProgress !== undefined &&
              (a.progress / a.maxProgress) >= 0.5
            ).length },
            { id: 'locked', label: 'Locked', count: allAchievements.length - stats.earned }
          ].map(filterOption => (
            <Button
              key={filterOption.id}
              variant={filter === filterOption.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(filterOption.id as any)}
              className="flex-shrink-0"
            >
              {filterOption.label}
              <Badge variant="secondary" className="ml-1 text-xs">
                {filterOption.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto">
          {[
            { id: 'all', label: 'All Categories', icon: Award },
            { id: 'learning', label: 'Learning', icon: BookOpen },
            { id: 'streak', label: 'Streaks', icon: Flame },
            { id: 'social', label: 'Social', icon: Users },
            { id: 'mastery', label: 'Mastery', icon: Target },
            { id: 'special', label: 'Special', icon: Gift }
          ].map(cat => {
            const Icon = cat.icon
            return (
              <Button
                key={cat.id}
                variant={category === cat.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCategory(cat.id as any)}
                className="flex-shrink-0"
              >
                <Icon className="h-3 w-3 mr-1" />
                {cat.label}
              </Button>
            )
          })}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Achievement Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {filteredAchievements.map(achievement => {
            const rarityConfig = getRarityConfig(achievement.rarity)
            const Icon = rarityConfig.icon
            const CategoryIcon = getCategoryIcon(achievement.category)
            
            return (
              <div
                key={achievement.id}
                className={`
                  relative p-4 border rounded-lg transition-all hover:shadow-lg group
                  ${achievement.earned 
                    ? `${rarityConfig.glow} bg-gradient-to-br from-background to-background/50` 
                    : 'opacity-60'
                  }
                `}
              >
                {/* Rarity Indicator */}
                <div className="absolute top-2 right-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${rarityConfig.color} border-current`}
                  >
                    {achievement.rarity}
                  </Badge>
                </div>

                {/* Achievement Icon */}
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${rarityConfig.color}`}>
                    {achievement.earned ? (
                      <Icon className="h-6 w-6" />
                    ) : (
                      <Lock className="h-6 w-6" />
                    )}
                  </div>
                  <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                </div>

                {/* Achievement Info */}
                <div className="space-y-2">
                  <h4 className={`font-semibold ${achievement.earned ? '' : 'text-muted-foreground'}`}>
                    {achievement.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {achievement.description}
                  </p>

                  {/* Progress Bar */}
                  {achievement.progress !== undefined && achievement.maxProgress !== undefined && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Progress</span>
                        <span>{achievement.progress}/{achievement.maxProgress}</span>
                      </div>
                      <Progress 
                        value={(achievement.progress / achievement.maxProgress) * 100} 
                        className="h-2"
                      />
                    </div>
                  )}

                  {/* Reward */}
                  {achievement.reward && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Gift className="h-3 w-3" />
                      <span>{achievement.reward}</span>
                    </div>
                  )}

                  {/* Unlock Date */}
                  {achievement.earned && achievement.unlockedAt && (
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <Unlock className="h-3 w-3" />
                      <span>
                        Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Earned Badge */}
                {achievement.earned && (
                  <div className="absolute top-2 left-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Unlock className="h-3 w-3 text-white" />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No achievements found</p>
            <p className="text-sm">Keep coding to unlock divine rewards!</p>
          </div>
        )}

        {/* Rarity Breakdown */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Collection Progress
          </h4>
          
          <div className="grid grid-cols-5 gap-2 text-center">
            {[
              { rarity: 'common', count: stats.commonEarned, total: allAchievements.filter(a => a.rarity === 'common').length, color: 'text-gray-600' },
              { rarity: 'rare', count: stats.rareEarned, total: allAchievements.filter(a => a.rarity === 'rare').length, color: 'text-blue-600' },
              { rarity: 'epic', count: stats.epicEarned, total: allAchievements.filter(a => a.rarity === 'epic').length, color: 'text-purple-600' },
              { rarity: 'legendary', count: stats.legendaryEarned, total: allAchievements.filter(a => a.rarity === 'legendary').length, color: 'text-yellow-600' },
              { rarity: 'divine', count: stats.divineEarned, total: allAchievements.filter(a => a.rarity === 'divine').length, color: 'text-pink-600' }
            ].map(({ rarity, count, total, color }) => (
              <div key={rarity} className="space-y-1">
                <div className={`text-sm font-bold ${color}`}>
                  {count}/{total}
                </div>
                <div className="text-xs text-muted-foreground capitalize">
                  {rarity}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        {tier === 'free' && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="h-6 w-6 text-yellow-600" />
                <div>
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">
                    Unlock Premium Achievements
                  </h4>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">
                    Upgrade to access exclusive divine achievements and rewards
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => router.push('/pricing')}
                className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
              >
                <Crown className="h-4 w-4 mr-2" />
                Upgrade
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
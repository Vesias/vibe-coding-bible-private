'use client'

import { useEffect, useState } from 'react'
import { AuthGuard } from '@/lib/auth/guards'
import { useAdvancedAuth } from '@/lib/auth/hooks'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { LearningPathsSection } from '@/components/dashboard/LearningPathsSection'
import { ProgressVisualization } from '@/components/dashboard/ProgressVisualization'
import { AIRecommendations } from '@/components/dashboard/AIRecommendations'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { AchievementsPanel } from '@/components/dashboard/AchievementsPanel'
import { CollaborationHub } from '@/components/dashboard/CollaborationHub'
import { SacredGeometry } from '@/components/illustrations/SacredGeometry'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function DashboardPage() {
  const {
    user,
    profile,
    tier,
    tierInfo,
    rank,
    rankInfo,
    nextRank,
    rankProgress,
    xpProgression,
    workshopAccess,
    aiAccess,
    collaborationAccess,
    loading
  } = useAdvancedAuth()

  const [dashboardData, setDashboardData] = useState({
    recentWorkshops: [],
    recommendations: [],
    achievements: [],
    collaborationSessions: [],
    weeklyProgress: {},
    learningStreak: 0
  })
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (user && profile) {
      loadDashboardData()
    }
  }, [user, profile])

  const loadDashboardData = async () => {
    setDataLoading(true)
    try {
      // Simulate loading dashboard data
      // In real implementation, this would fetch from Supabase
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setDashboardData({
        recentWorkshops: [
          {
            id: '1',
            title: 'The Holy Vision',
            progress: 85,
            lastAccessed: '2024-01-20',
            difficulty: 'beginner'
          },
          {
            id: '2',
            title: 'The Right Stack',
            progress: 45,
            lastAccessed: '2024-01-19',
            difficulty: 'intermediate'
          }
        ],
        recommendations: [
          {
            type: 'workshop',
            title: 'Advanced Prompt Engineering',
            reason: 'Based on your progress in AI workshops',
            confidence: 95
          },
          {
            type: 'skill',
            title: 'TypeScript Mastery',
            reason: 'Complement your JavaScript knowledge',
            confidence: 88
          }
        ],
        achievements: [
          {
            id: '1',
            name: 'First Steps',
            description: 'Completed your first workshop',
            earned: true,
            rarity: 'common'
          },
          {
            id: '2',
            name: 'Code Prophet',
            description: 'Reach Prophet rank',
            earned: false,
            rarity: 'legendary',
            progress: rankProgress.progress
          }
        ],
        collaborationSessions: [
          {
            id: '1',
            name: 'JavaScript Mastery Session',
            participants: 3,
            status: 'active',
            startTime: '2024-01-20T10:00:00Z'
          }
        ],
        weeklyProgress: {
          workshopsCompleted: 2,
          xpEarned: 850,
          timeSpent: 12,
          streakDays: 5
        },
        learningStreak: 5
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setDataLoading(false)
    }
  }

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground">Loading your divine dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
        {/* Sacred Geometry Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <SacredGeometry 
            type="fibonacci_spiral" 
            className="absolute top-1/4 right-1/4 opacity-5 scale-150" 
          />
          <SacredGeometry 
            type="flower_of_life" 
            className="absolute bottom-1/4 left-1/4 opacity-5 scale-75" 
          />
        </div>

        <div className="relative z-10">
          {/* Dashboard Header */}
          <DashboardHeader
            user={profile}
            tier={tier}
            tierInfo={tierInfo}
            rank={rank}
            rankInfo={rankInfo}
            nextRank={nextRank}
            rankProgress={rankProgress}
            weeklyProgress={dashboardData.weeklyProgress}
          />

          {/* Main Dashboard Grid */}
          <div className="container mx-auto px-4 py-8 space-y-8">
            {/* Top Row - Quick Actions and AI Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <QuickActions 
                  workshopAccess={workshopAccess}
                  aiAccess={aiAccess}
                  collaborationAccess={collaborationAccess}
                  tier={tier}
                />
              </div>
              <div>
                <AIRecommendations 
                  recommendations={dashboardData.recommendations}
                  tier={tier}
                  userPreferences={profile?.learning_preferences}
                />
              </div>
            </div>

            {/* Second Row - Learning Paths and Progress */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <LearningPathsSection
                recentWorkshops={dashboardData.recentWorkshops}
                userLevel={profile?.current_level || 1}
                userInterests={profile?.learning_preferences?.interests || []}
                tier={tier}
              />
              <ProgressVisualization
                xp={profile?.total_xp || 0}
                level={profile?.current_level || 1}
                rank={rank}
                rankProgress={rankProgress}
                weeklyProgress={dashboardData.weeklyProgress}
                learningStreak={dashboardData.learningStreak}
              />
            </div>

            {/* Third Row - Activity and Collaboration */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <RecentActivity
                recentWorkshops={dashboardData.recentWorkshops}
                xpGains={xpProgression.recentXPGains}
                user={profile}
              />
              <CollaborationHub
                activeSessions={dashboardData.collaborationSessions}
                collaborationAccess={collaborationAccess}
                tier={tier}
              />
            </div>

            {/* Bottom Row - Achievements */}
            <AchievementsPanel
              achievements={dashboardData.achievements}
              userXP={profile?.total_xp || 0}
              userRank={rank}
              tier={tier}
            />
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
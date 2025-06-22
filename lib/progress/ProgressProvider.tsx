'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/database.types'

type UserProgress = Database['public']['Tables']['user_progress']['Row']
type Workshop = Database['public']['Tables']['workshops']['Row']

interface ProgressContextType {
  workshops: Workshop[]
  userProgress: UserProgress[]
  loading: boolean
  refreshProgress: () => Promise<void>
  updateProgress: (workshopId: string, data: Partial<UserProgress>) => Promise<void>
  getWorkshopProgress: (workshopId: string) => UserProgress | null
  getOverallProgress: () => { completed: number; total: number; percentage: number }
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [userProgress, setUserProgress] = useState<UserProgress[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchWorkshops = async () => {
    const { data, error } = await supabase
      .from('workshops')
      .select('*')
      .eq('is_published', true)
      .order('commandment_number')

    if (error) {
      console.error('Error fetching workshops:', error)
      return []
    }

    return data || []
  }

  const fetchUserProgress = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      console.error('Error fetching user progress:', error)
      return []
    }

    return data || []
  }

  const refreshProgress = async () => {
    if (!user) return

    setLoading(true)
    try {
      const [workshopsData, progressData] = await Promise.all([
        fetchWorkshops(),
        fetchUserProgress(user.id)
      ])

      setWorkshops(workshopsData)
      setUserProgress(progressData)
    } catch (error) {
      console.error('Error refreshing progress:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateProgress = async (workshopId: string, data: Partial<UserProgress>) => {
    if (!user) return

    try {
      const existingProgress = userProgress.find(p => p.workshop_id === workshopId)

      if (existingProgress) {
        const { error } = await supabase
          .from('user_progress')
          .update({
            ...data,
            last_accessed: new Date().toISOString()
          })
          .eq('id', existingProgress.id)

        if (error) throw error

        setUserProgress(prev => 
          prev.map(p => 
            p.id === existingProgress.id 
              ? { ...p, ...data, last_accessed: new Date().toISOString() }
              : p
          )
        )
      } else {
        const { data: newProgress, error } = await supabase
          .from('user_progress')
          .insert({
            user_id: user.id,
            workshop_id: workshopId,
            ...data,
            last_accessed: new Date().toISOString()
          })
          .select()
          .single()

        if (error) throw error

        if (newProgress) {
          setUserProgress(prev => [...prev, newProgress])
        }
      }
    } catch (error) {
      console.error('Error updating progress:', error)
      throw error
    }
  }

  const getWorkshopProgress = (workshopId: string): UserProgress | null => {
    return userProgress.find(p => p.workshop_id === workshopId) || null
  }

  const getOverallProgress = () => {
    const total = workshops.length
    const completed = userProgress.filter(p => p.status === 'completed' || p.status === 'mastered').length
    const percentage = total > 0 ? (completed / total) * 100 : 0

    return { completed, total, percentage }
  }

  useEffect(() => {
    if (user) {
      refreshProgress()
    } else {
      setWorkshops([])
      setUserProgress([])
      setLoading(false)
    }
  }, [user])

  return (
    <ProgressContext.Provider value={{
      workshops,
      userProgress,
      loading,
      refreshProgress,
      updateProgress,
      getWorkshopProgress,
      getOverallProgress
    }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const context = useContext(ProgressContext)
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider')
  }
  return context
}
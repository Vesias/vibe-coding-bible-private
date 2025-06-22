import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const targetDate = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days > 1 ? 's' : ''} ago`
  } else {
    return formatDate(date)
  }
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`
  } else {
    return `${remainingSeconds}s`
  }
}

export function formatXP(xp: number): string {
  if (xp < 1000) {
    return xp.toString()
  } else if (xp < 1000000) {
    return `${(xp / 1000).toFixed(1)}K`
  } else {
    return `${(xp / 1000000).toFixed(1)}M`
  }
}

export function calculateLevel(xp: number): number {
  // Level progression: Level = floor(sqrt(XP / 100))
  return Math.floor(Math.sqrt(xp / 100))
}

export function getXPForLevel(level: number): number {
  return level * level * 100
}

export function getXPProgressToNextLevel(xp: number): { current: number; next: number; progress: number } {
  const currentLevel = calculateLevel(xp)
  const currentLevelXP = getXPForLevel(currentLevel)
  const nextLevelXP = getXPForLevel(currentLevel + 1)
  const progress = (xp - currentLevelXP) / (nextLevelXP - currentLevelXP)

  return {
    current: currentLevel,
    next: currentLevel + 1,
    progress: Math.min(progress, 1)
  }
}

export function getProphetRank(level: number): string {
  if (level < 5) return 'novice'
  if (level < 15) return 'apprentice'
  if (level < 30) return 'practitioner'
  if (level < 50) return 'architect'
  return 'prophet'
}

export function getRankColor(rank: string): string {
  switch (rank) {
    case 'novice': return 'text-gray-500'
    case 'apprentice': return 'text-blue-500'
    case 'practitioner': return 'text-green-500'
    case 'architect': return 'text-purple-500'
    case 'prophet': return 'text-sacred-gold'
    default: return 'text-gray-500'
  }
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...'
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text)
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    
    return new Promise((resolve, reject) => {
      if (document.execCommand('copy')) {
        resolve()
      } else {
        reject(new Error('Copy failed'))
      }
      document.body.removeChild(textArea)
    })
  }
}

export function parseMarkdown(markdown: string): string {
  // Simple markdown parser for basic formatting
  return markdown
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>')
}

export function getAchievementRarityColor(rarity: string): string {
  switch (rarity) {
    case 'common': return 'text-gray-500 border-gray-500'
    case 'rare': return 'text-blue-500 border-blue-500'
    case 'epic': return 'text-purple-500 border-purple-500'
    case 'legendary': return 'text-orange-500 border-orange-500'
    case 'divine': return 'text-sacred-gold border-sacred-gold'
    default: return 'text-gray-500 border-gray-500'
  }
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount / 100) // Stripe amounts are in cents
}

export function getSubscriptionFeatures(plan: string): string[] {
  switch (plan) {
    case 'basic':
      return [
        'Access to first 5 commandments',
        'Basic coding challenges',
        'Community forum access',
        'Progress tracking',
        'Email support'
      ]
    case 'pro':
      return [
        'All 10 commandments',
        'Advanced challenges',
        'Monaco Editor playground',
        'Real-time collaboration',
        'Priority support',
        'AI-powered hints',
        'Certificate of completion'
      ]
    case 'divine':
      return [
        'Everything in Pro',
        'One-on-one mentorship',
        'Custom project reviews',
        'Early access to new content',
        'Exclusive prophet community',
        'White-label license',
        'Revenue sharing program'
      ]
    default:
      return [
        'Limited preview access',
        'Community forum (read-only)',
        'Basic progress tracking'
      ]
  }
}
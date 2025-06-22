'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/lib/auth/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import { 
  Plus, 
  Users, 
  Settings, 
  Copy, 
  ExternalLink, 
  Play, 
  Calendar, 
  Clock, 
  Globe, 
  Lock,
  Mic,
  Video,
  Monitor,
  Bot,
  Crown,
  Code,
  BookOpen,
  Target,
  Zap,
  Share2
} from 'lucide-react'

interface SessionSettings {
  name: string
  description: string
  workshopId?: string
  language: string
  maxParticipants: number
  isPublic: boolean
  requiresApproval: boolean
  voiceChatEnabled: boolean
  videoChatEnabled: boolean
  screenSharingEnabled: boolean
  aiMentorEnabled: boolean
  scheduledStart?: string
  estimatedDuration?: number
  tags: string[]
}

interface SessionManagerProps {
  mode: 'create' | 'manage'
  sessionId?: string
  onSessionCreated?: (sessionId: string) => void
}

export function SessionManager({ 
  mode = 'create', 
  sessionId, 
  onSessionCreated 
}: SessionManagerProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState<SessionSettings>({
    name: '',
    description: '',
    language: 'javascript',
    maxParticipants: 8,
    isPublic: true,
    requiresApproval: false,
    voiceChatEnabled: true,
    videoChatEnabled: true,
    screenSharingEnabled: true,
    aiMentorEnabled: true,
    tags: []
  })
  
  const [existingSession, setExistingSession] = useState<any>(null)
  const [participants, setParticipants] = useState<any[]>([])
  const [inviteLink, setInviteLink] = useState('')
  const [step, setStep] = useState<'settings' | 'invite' | 'launch'>('settings')

  // Load existing session data if in manage mode
  useEffect(() => {
    if (mode === 'manage' && sessionId) {
      loadSessionData()
    }
  }, [mode, sessionId])

  const loadSessionData = async () => {
    if (!sessionId) return
    
    try {
      const { data: session, error } = await supabase
        .from('collaboration_sessions')
        .select('*')
        .eq('id', sessionId)
        .single()
      
      if (error) throw error
      
      setExistingSession(session)
      setSettings({
        name: session.name,
        description: session.description || '',
        language: 'javascript', // Default for now
        maxParticipants: session.max_participants,
        isPublic: true, // Determine from session data
        requiresApproval: false,
        voiceChatEnabled: session.voice_chat_enabled,
        videoChatEnabled: true, // From session settings
        screenSharingEnabled: session.screen_sharing_enabled,
        aiMentorEnabled: session.ai_mentor_enabled,
        tags: []
      })
      
      // Load participants
      const { data: participantsData } = await supabase
        .from('collaboration_participants')
        .select(`
          *,
          users (
            full_name,
            avatar_url,
            prophet_rank
          )
        `)
        .eq('session_id', sessionId)
      
      setParticipants(participantsData || [])
      
    } catch (error) {
      console.error('Error loading session:', error)
      toast({
        title: "Error",
        description: "Failed to load session data",
        variant: "destructive"
      })
    }
  }

  const handleCreateSession = async () => {
    if (!user) return
    
    setLoading(true)
    
    try {
      // Create session in database
      const sessionData = {
        host_user_id: user.id,
        name: settings.name,
        description: settings.description,
        status: settings.scheduledStart ? 'scheduled' : 'active',
        max_participants: settings.maxParticipants,
        voice_chat_enabled: settings.voiceChatEnabled,
        screen_sharing_enabled: settings.screenSharingEnabled,
        ai_mentor_enabled: settings.aiMentorEnabled,
        code_snapshot: '',
        shared_cursor_positions: {},
        current_participants: 0
      }
      
      const { data: session, error } = await supabase
        .from('collaboration_sessions')
        .insert(sessionData)
        .select()
        .single()
      
      if (error) throw error
      
      // Add host as participant
      await supabase
        .from('collaboration_participants')
        .insert({
          session_id: session.id,
          user_id: user.id,
          role: 'host',
          voice_enabled: settings.voiceChatEnabled,
          video_enabled: settings.videoChatEnabled,
          cursor_position: {}
        })
      
      // Generate invite link
      const inviteUrl = `${window.location.origin}/collaboration/join/${session.id}`
      setInviteLink(inviteUrl)
      
      toast({
        title: "Session Created!",
        description: "Your collaboration session is ready"
      })
      
      setStep('invite')
      onSessionCreated?.(session.id)
      
    } catch (error) {
      console.error('Error creating session:', error)
      toast({
        title: "Error",
        description: "Failed to create session",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLaunchSession = () => {
    if (existingSession) {
      router.push(`/collaboration/session/${existingSession.id}`)
    }
  }

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink)
    toast({
      title: "Copied!",
      description: "Invite link copied to clipboard"
    })
  }

  const handleShareSession = async () => {
    if (navigator.share && inviteLink) {
      try {
        await navigator.share({
          title: `Join "${settings.name}" - Collaboration Session`,
          text: `Join me for a collaborative coding session: ${settings.description}`,
          url: inviteLink
        })
      } catch (error) {
        // Fallback to copy
        handleCopyInviteLink()
      }
    } else {
      handleCopyInviteLink()
    }
  }

  const languages = [
    { value: 'javascript', label: 'JavaScript', icon: '🟨' },
    { value: 'typescript', label: 'TypeScript', icon: '🔷' },
    { value: 'python', label: 'Python', icon: '🐍' },
    { value: 'react', label: 'React', icon: '⚛️' },
    { value: 'vue', label: 'Vue.js', icon: '💚' },
    { value: 'html', label: 'HTML/CSS', icon: '🌐' },
    { value: 'nodejs', label: 'Node.js', icon: '💚' },
    { value: 'php', label: 'PHP', icon: '🐘' }
  ]

  const workshopTemplates = [
    { id: '1', name: 'React Fundamentals', difficulty: 'beginner' },
    { id: '2', name: 'Advanced JavaScript', difficulty: 'intermediate' },
    { id: '3', name: 'Full Stack Development', difficulty: 'advanced' },
    { id: '4', name: 'TypeScript Mastery', difficulty: 'intermediate' }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Users className="h-8 w-8 text-primary" />
          {mode === 'create' ? 'Create Collaboration Session' : 'Manage Session'}
        </h1>
        <p className="text-muted-foreground">
          {mode === 'create' 
            ? 'Set up a new divine coding collaboration session'
            : 'Manage your active collaboration session'
          }
        </p>
      </div>

      {/* Progress Steps */}
      {mode === 'create' && (
        <div className="flex items-center justify-center space-x-4">
          {[
            { id: 'settings', label: 'Settings', icon: Settings },
            { id: 'invite', label: 'Invite', icon: Users },
            { id: 'launch', label: 'Launch', icon: Play }
          ].map((stepItem, index) => {
            const Icon = stepItem.icon
            const isActive = step === stepItem.id
            const isCompleted = ['settings', 'invite'].indexOf(step) > ['settings', 'invite'].indexOf(stepItem.id)
            
            return (
              <div key={stepItem.id} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                  ${isActive ? 'border-primary bg-primary text-primary-foreground' : 
                    isCompleted ? 'border-green-500 bg-green-500 text-white' : 
                    'border-muted text-muted-foreground'}
                `}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`ml-2 ${isActive ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                  {stepItem.label}
                </span>
                {index < 2 && (
                  <div className={`w-8 h-0.5 mx-4 ${isCompleted ? 'bg-green-500' : 'bg-muted'}`} />
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Settings Step */}
      {(mode === 'manage' || step === 'settings') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Session Configuration
            </CardTitle>
            <CardDescription>
              Configure your collaborative coding environment
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Session Name</Label>
                <Input
                  id="name"
                  value={settings.name}
                  onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="React Workshop Session"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language">Programming Language</Label>
                <Select 
                  value={settings.language} 
                  onValueChange={(value) => setSettings(prev => ({ ...prev, language: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang.value} value={lang.value}>
                        <span className="flex items-center gap-2">
                          <span>{lang.icon}</span>
                          {lang.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={settings.description}
                onChange={(e) => setSettings(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what you'll be working on together..."
                rows={3}
              />
            </div>

            {/* Workshop Template */}
            <div className="space-y-2">
              <Label htmlFor="workshop">Workshop Template (Optional)</Label>
              <Select 
                value={settings.workshopId || ''} 
                onValueChange={(value) => setSettings(prev => ({ ...prev, workshopId: value || undefined }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a workshop template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No template</SelectItem>
                  {workshopTemplates.map(workshop => (
                    <SelectItem key={workshop.id} value={workshop.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{workshop.name}</span>
                        <Badge variant="outline" className="ml-2">
                          {workshop.difficulty}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Session Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxParticipants">Max Participants</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  min="2"
                  max="20"
                  value={settings.maxParticipants}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    maxParticipants: parseInt(e.target.value) || 8 
                  }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="estimatedDuration">Estimated Duration (minutes)</Label>
                <Input
                  id="estimatedDuration"
                  type="number"
                  min="15"
                  max="480"
                  value={settings.estimatedDuration || ''}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    estimatedDuration: parseInt(e.target.value) || undefined 
                  }))}
                  placeholder="60"
                />
              </div>
            </div>

            {/* Feature Toggles */}
            <div className="space-y-4">
              <h4 className="font-medium">Features & Permissions</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Mic className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Voice Chat</span>
                  </div>
                  <Switch
                    checked={settings.voiceChatEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ 
                      ...prev, 
                      voiceChatEnabled: checked 
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Video Chat</span>
                  </div>
                  <Switch
                    checked={settings.videoChatEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ 
                      ...prev, 
                      videoChatEnabled: checked 
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Screen Sharing</span>
                  </div>
                  <Switch
                    checked={settings.screenSharingEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ 
                      ...prev, 
                      screenSharingEnabled: checked 
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">AI Mentor</span>
                  </div>
                  <Switch
                    checked={settings.aiMentorEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ 
                      ...prev, 
                      aiMentorEnabled: checked 
                    }))}
                  />
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="space-y-4">
              <h4 className="font-medium">Privacy & Access</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="font-medium">Public Session</span>
                      <p className="text-sm text-muted-foreground">Anyone can discover and join</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.isPublic}
                    onCheckedChange={(checked) => setSettings(prev => ({ 
                      ...prev, 
                      isPublic: checked 
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="font-medium">Require Approval</span>
                      <p className="text-sm text-muted-foreground">Participants need host approval</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.requiresApproval}
                    onCheckedChange={(checked) => setSettings(prev => ({ 
                      ...prev, 
                      requiresApproval: checked 
                    }))}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-4 border-t">
              {mode === 'create' ? (
                <div className="flex gap-2">
                  <Button
                    onClick={handleCreateSession}
                    disabled={!settings.name || loading}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    Create Session
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button onClick={handleLaunchSession}>
                    <Play className="h-4 w-4 mr-2" />
                    Launch Session
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invite Step */}
      {step === 'invite' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Invite Collaborators
            </CardTitle>
            <CardDescription>
              Share your session with fellow divine coders
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Invite Link */}
            <div className="space-y-2">
              <Label>Session Invite Link</Label>
              <div className="flex gap-2">
                <Input
                  value={inviteLink}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button onClick={handleCopyInviteLink} variant="outline">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button onClick={handleShareSession} variant="outline">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Session Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <Code className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <div className="font-medium">{settings.language}</div>
                <div className="text-sm text-muted-foreground">Language</div>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <Users className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <div className="font-medium">{settings.maxParticipants}</div>
                <div className="text-sm text-muted-foreground">Max Participants</div>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <Clock className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                <div className="font-medium">{settings.estimatedDuration || '∞'}</div>
                <div className="text-sm text-muted-foreground">Duration (min)</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex justify-between pt-4 border-t">
              <Button variant="outline" onClick={() => setStep('settings')}>
                Back to Settings
              </Button>
              <Button onClick={() => setStep('launch')}>
                <Play className="h-4 w-4 mr-2" />
                Launch Session
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Launch Step */}
      {step === 'launch' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Ready to Launch
            </CardTitle>
            <CardDescription>
              Your collaboration session is ready to begin
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <Play className="h-8 w-8 text-white" />
              </div>
              
              <div>
                <h3 className="text-xl font-bold">{settings.name}</h3>
                <p className="text-muted-foreground">{settings.description}</p>
              </div>
              
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>0/{settings.maxParticipants} joined</span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  <span>{settings.isPublic ? 'Public' : 'Private'}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Button 
                onClick={handleLaunchSession}
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                <Play className="h-5 w-5 mr-2" />
                Launch Session
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setStep('invite')}
              >
                <ExternalLink className="h-5 w-5 mr-2" />
                Share Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
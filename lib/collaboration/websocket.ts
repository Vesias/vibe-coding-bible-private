'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface CollaborationEvent {
  type: 'user_joined' | 'user_left' | 'code_change' | 'cursor_move' | 'chat_message' | 'voice_toggle' | 'video_toggle' | 'screen_share'
  userId: string
  sessionId: string
  timestamp: string
  data: any
}

export interface Participant {
  id: string
  name: string
  avatar?: string
  cursor?: {
    line: number
    column: number
    file?: string
  }
  isTyping: boolean
  voiceEnabled: boolean
  videoEnabled: boolean
  screenSharing: boolean
  role: 'host' | 'mentor' | 'participant' | 'observer'
  color: string
}

export interface CollaborationSession {
  id: string
  name: string
  description?: string
  hostId: string
  status: 'active' | 'paused' | 'ended'
  participants: Map<string, Participant>
  code: string
  language: string
  maxParticipants: number
  voiceChatEnabled: boolean
  screenSharingEnabled: boolean
  aiMentorEnabled: boolean
  createdAt: string
  lastActivity: string
}

class CollaborationWebSocket {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectInterval = 1000
  private heartbeatInterval: NodeJS.Timeout | null = null
  private messageQueue: CollaborationEvent[] = []
  private isConnected = false
  
  private eventListeners: Map<string, ((event: CollaborationEvent) => void)[]> = new Map()
  private sessionData: CollaborationSession | null = null
  
  constructor(private sessionId: string, private userId: string) {}

  async connect(): Promise<void> {
    try {
      // Get session token from Supabase
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('User not authenticated')
      }

      const wsUrl = process.env.NODE_ENV === 'production' 
        ? `wss://api.vibecodingbible.agentland.saarland/collaboration/${this.sessionId}`
        : `ws://localhost:3001/collaboration/${this.sessionId}`

      this.ws = new WebSocket(`${wsUrl}?token=${session.access_token}&userId=${this.userId}`)
      
      this.ws.onopen = this.handleOpen.bind(this)
      this.ws.onmessage = this.handleMessage.bind(this)
      this.ws.onclose = this.handleClose.bind(this)
      this.ws.onerror = this.handleError.bind(this)
      
    } catch (error) {
      console.error('Failed to connect to collaboration session:', error)
      this.handleReconnect()
    }
  }

  private handleOpen() {
    console.log('Connected to collaboration session:', this.sessionId)
    this.isConnected = true
    this.reconnectAttempts = 0
    
    // Send join event
    this.sendEvent({
      type: 'user_joined',
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      data: {}
    })
    
    // Start heartbeat
    this.startHeartbeat()
    
    // Send queued messages
    this.flushMessageQueue()
  }

  private handleMessage(event: MessageEvent) {
    try {
      const collaborationEvent: CollaborationEvent = JSON.parse(event.data)
      this.emitEvent(collaborationEvent)
    } catch (error) {
      console.error('Failed to parse collaboration event:', error)
    }
  }

  private handleClose(event: CloseEvent) {
    console.log('Collaboration session disconnected:', event.code, event.reason)
    this.isConnected = false
    
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
    
    // Attempt to reconnect if not intentionally closed
    if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
      this.handleReconnect()
    }
  }

  private handleError(error: Event) {
    console.error('Collaboration WebSocket error:', error)
    this.handleReconnect()
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached')
      return
    }
    
    this.reconnectAttempts++
    const delay = this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1)
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`)
    
    setTimeout(() => {
      this.connect()
    }, delay)
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }))
      }
    }, 30000) // 30 seconds
  }

  private flushMessageQueue() {
    while (this.messageQueue.length > 0) {
      const event = this.messageQueue.shift()
      if (event) {
        this.sendEvent(event)
      }
    }
  }

  sendEvent(event: CollaborationEvent) {
    if (!this.isConnected || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
      // Queue the message for later
      this.messageQueue.push(event)
      return
    }
    
    try {
      this.ws.send(JSON.stringify(event))
    } catch (error) {
      console.error('Failed to send collaboration event:', error)
      this.messageQueue.push(event)
    }
  }

  // Code synchronization methods
  sendCodeChange(changes: {
    range: { start: { line: number, character: number }, end: { line: number, character: number } }
    text: string
    file?: string
  }) {
    this.sendEvent({
      type: 'code_change',
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      data: changes
    })
  }

  sendCursorMove(cursor: { line: number, column: number, file?: string }) {
    this.sendEvent({
      type: 'cursor_move',
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      data: cursor
    })
  }

  sendChatMessage(message: string) {
    this.sendEvent({
      type: 'chat_message',
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      data: { message }
    })
  }

  toggleVoice(enabled: boolean) {
    this.sendEvent({
      type: 'voice_toggle',
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      data: { enabled }
    })
  }

  toggleVideo(enabled: boolean) {
    this.sendEvent({
      type: 'video_toggle',
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      data: { enabled }
    })
  }

  toggleScreenShare(enabled: boolean) {
    this.sendEvent({
      type: 'screen_share',
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      data: { enabled }
    })
  }

  // Event listener management
  on(eventType: string, callback: (event: CollaborationEvent) => void) {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, [])
    }
    this.eventListeners.get(eventType)!.push(callback)
  }

  off(eventType: string, callback: (event: CollaborationEvent) => void) {
    const listeners = this.eventListeners.get(eventType)
    if (listeners) {
      const index = listeners.indexOf(callback)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }

  private emitEvent(event: CollaborationEvent) {
    const listeners = this.eventListeners.get(event.type)
    if (listeners) {
      listeners.forEach(callback => callback(event))
    }
    
    // Also emit to 'all' listeners
    const allListeners = this.eventListeners.get('all')
    if (allListeners) {
      allListeners.forEach(callback => callback(event))
    }
  }

  disconnect() {
    if (this.ws) {
      // Send leave event
      this.sendEvent({
        type: 'user_left',
        userId: this.userId,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
        data: {}
      })
      
      this.ws.close(1000, 'User disconnected')
      this.ws = null
    }
    
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
    
    this.isConnected = false
    this.eventListeners.clear()
  }

  getConnectionStatus(): 'connecting' | 'connected' | 'disconnected' | 'reconnecting' {
    if (!this.ws) return 'disconnected'
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING: return 'connecting'
      case WebSocket.OPEN: return 'connected'
      case WebSocket.CLOSING:
      case WebSocket.CLOSED:
        return this.reconnectAttempts > 0 ? 'reconnecting' : 'disconnected'
      default: return 'disconnected'
    }
  }
}

// Hook for using collaboration WebSocket in React components
export function useCollaborationWebSocket(sessionId: string, userId: string) {
  const [ws, setWs] = useState<CollaborationWebSocket | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'reconnecting'>('disconnected')
  const [participants, setParticipants] = useState<Map<string, Participant>>(new Map())
  const [code, setCode] = useState('')
  const [chatMessages, setChatMessages] = useState<Array<{ userId: string, message: string, timestamp: string }>>([])

  useEffect(() => {
    const websocket = new CollaborationWebSocket(sessionId, userId)
    setWs(websocket)

    // Status monitoring
    const statusInterval = setInterval(() => {
      setConnectionStatus(websocket.getConnectionStatus())
    }, 1000)

    // Event listeners
    websocket.on('user_joined', handleUserJoined)
    websocket.on('user_left', handleUserLeft)
    websocket.on('code_change', handleCodeChange)
    websocket.on('cursor_move', handleCursorMove)
    websocket.on('chat_message', handleChatMessage)
    websocket.on('voice_toggle', handleVoiceToggle)
    websocket.on('video_toggle', handleVideoToggle)

    // Connect
    websocket.connect()

    return () => {
      clearInterval(statusInterval)
      websocket.disconnect()
    }
  }, [sessionId, userId])

  const handleUserJoined = (event: CollaborationEvent) => {
    // Update participants list
    setParticipants(prev => {
      const newParticipants = new Map(prev)
      newParticipants.set(event.userId, {
        id: event.userId,
        name: event.data.name || 'Anonymous',
        avatar: event.data.avatar,
        cursor: undefined,
        isTyping: false,
        voiceEnabled: false,
        videoEnabled: false,
        screenSharing: false,
        role: event.data.role || 'participant',
        color: event.data.color || generateUserColor(event.userId)
      })
      return newParticipants
    })
  }

  const handleUserLeft = (event: CollaborationEvent) => {
    setParticipants(prev => {
      const newParticipants = new Map(prev)
      newParticipants.delete(event.userId)
      return newParticipants
    })
  }

  const handleCodeChange = (event: CollaborationEvent) => {
    // Apply code changes using operational transformation
    const { range, text } = event.data
    setCode(prevCode => {
      return applyCodeChange(prevCode, range, text)
    })
  }

  const handleCursorMove = (event: CollaborationEvent) => {
    setParticipants(prev => {
      const newParticipants = new Map(prev)
      const participant = newParticipants.get(event.userId)
      if (participant) {
        participant.cursor = event.data
        newParticipants.set(event.userId, participant)
      }
      return newParticipants
    })
  }

  const handleChatMessage = (event: CollaborationEvent) => {
    setChatMessages(prev => [
      ...prev,
      {
        userId: event.userId,
        message: event.data.message,
        timestamp: event.timestamp
      }
    ])
  }

  const handleVoiceToggle = (event: CollaborationEvent) => {
    setParticipants(prev => {
      const newParticipants = new Map(prev)
      const participant = newParticipants.get(event.userId)
      if (participant) {
        participant.voiceEnabled = event.data.enabled
        newParticipants.set(event.userId, participant)
      }
      return newParticipants
    })
  }

  const handleVideoToggle = (event: CollaborationEvent) => {
    setParticipants(prev => {
      const newParticipants = new Map(prev)
      const participant = newParticipants.get(event.userId)
      if (participant) {
        participant.videoEnabled = event.data.enabled
        newParticipants.set(event.userId, participant)
      }
      return newParticipants
    })
  }

  return {
    ws,
    connectionStatus,
    participants,
    code,
    chatMessages,
    sendCodeChange: ws?.sendCodeChange.bind(ws),
    sendCursorMove: ws?.sendCursorMove.bind(ws),
    sendChatMessage: ws?.sendChatMessage.bind(ws),
    toggleVoice: ws?.toggleVoice.bind(ws),
    toggleVideo: ws?.toggleVideo.bind(ws),
    toggleScreenShare: ws?.toggleScreenShare.bind(ws)
  }
}

// Utility functions
function generateUserColor(userId: string): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ]
  const hash = userId.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

function applyCodeChange(code: string, range: any, text: string): string {
  // Simple implementation - in production, use proper operational transformation
  const lines = code.split('\n')
  const startLine = range.start.line
  const endLine = range.end.line
  const startChar = range.start.character
  const endChar = range.end.character
  
  if (startLine === endLine) {
    // Single line change
    const line = lines[startLine] || ''
    const newLine = line.substring(0, startChar) + text + line.substring(endChar)
    lines[startLine] = newLine
  } else {
    // Multi-line change
    const firstLine = lines[startLine] || ''
    const lastLine = lines[endLine] || ''
    const newFirstLine = firstLine.substring(0, startChar) + text + lastLine.substring(endChar)
    
    lines.splice(startLine, endLine - startLine + 1, newFirstLine)
  }
  
  return lines.join('\n')
}

export default CollaborationWebSocket
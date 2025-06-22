'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useCollaborationWebSocket, Participant } from '@/lib/collaboration/websocket'
import { 
  Play, 
  Square, 
  Save, 
  Download, 
  Users, 
  MessageSquare,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  MonitorOff,
  Settings,
  Maximize2,
  Minimize2,
  WifiOff,
  Wifi,
  AlertCircle,
  Code2,
  FileText,
  Terminal
} from 'lucide-react'

interface CollaborativeEditorProps {
  sessionId: string
  userId: string
  initialCode?: string
  language?: string
  theme?: 'light' | 'dark'
  readOnly?: boolean
  className?: string
}

export function CollaborativeEditor({
  sessionId,
  userId,
  initialCode = '',
  language = 'javascript',
  theme = 'dark',
  readOnly = false,
  className = ''
}: CollaborativeEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'terminal'>('editor')
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState('')
  const [chatOpen, setChatOpen] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [videoEnabled, setVideoEnabled] = useState(false)
  const [screenSharing, setScreenSharing] = useState(false)
  
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const cursorTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  const {
    ws,
    connectionStatus,
    participants,
    code,
    chatMessages,
    sendCodeChange,
    sendCursorMove,
    sendChatMessage,
    toggleVoice,
    toggleVideo,
    toggleScreenShare
  } = useCollaborationWebSocket(sessionId, userId)

  // Initialize code if provided
  useEffect(() => {
    if (initialCode && !code) {
      // Set initial code without triggering change event
      if (editorRef.current) {
        editorRef.current.value = initialCode
      }
    }
  }, [initialCode, code])

  // Handle code changes
  const handleCodeChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (readOnly || !sendCodeChange) return
    
    const newCode = event.target.value
    const { selectionStart, selectionEnd } = event.target
    
    // Calculate the change range
    const lines = code.split('\n')
    const newLines = newCode.split('\n')
    
    // Find the start and end positions
    let startLine = 0
    let startChar = 0
    let endLine = 0
    let endChar = 0
    
    // Simple diff implementation
    for (let i = 0; i < Math.min(lines.length, newLines.length); i++) {
      if (lines[i] !== newLines[i]) {
        startLine = i
        break
      }
    }
    
    // For now, send the entire change
    sendCodeChange({
      range: {
        start: { line: 0, character: 0 },
        end: { line: lines.length - 1, character: (lines[lines.length - 1] || '').length }
      },
      text: newCode
    })
  }, [code, sendCodeChange, readOnly])

  // Handle cursor movement
  const handleCursorMove = useCallback(() => {
    if (!sendCursorMove || !editorRef.current) return
    
    const { selectionStart } = editorRef.current
    const lines = code.split('\n')
    
    let line = 0
    let character = selectionStart
    
    for (let i = 0; i < lines.length; i++) {
      if (character <= lines[i].length) {
        line = i
        break
      }
      character -= lines[i].length + 1 // +1 for newline
    }
    
    // Debounce cursor updates
    if (cursorTimeoutRef.current) {
      clearTimeout(cursorTimeoutRef.current)
    }
    
    cursorTimeoutRef.current = setTimeout(() => {
      sendCursorMove({ line, column: character })
    }, 100)
  }, [code, sendCursorMove])

  // Handle running code
  const handleRunCode = async () => {
    setIsRunning(true)
    setActiveTab('terminal')
    
    try {
      // Simulate code execution - in production, this would be a sandboxed environment
      setOutput('Running code...\n')
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (language === 'javascript') {
        try {
          // Simple evaluation for demo purposes
          const result = eval(code)
          setOutput(prev => prev + `Output: ${result}\n`)
        } catch (error) {
          setOutput(prev => prev + `Error: ${error}\n`)
        }
      } else {
        setOutput(prev => prev + `Code execution completed for ${language}\n`)
      }
    } catch (error) {
      setOutput(prev => prev + `Execution error: ${error}\n`)
    } finally {
      setIsRunning(false)
    }
  }

  // Handle voice toggle
  const handleVoiceToggle = () => {
    const newState = !voiceEnabled
    setVoiceEnabled(newState)
    toggleVoice?.(newState)
  }

  // Handle video toggle
  const handleVideoToggle = () => {
    const newState = !videoEnabled
    setVideoEnabled(newState)
    toggleVideo?.(newState)
  }

  // Handle screen share toggle
  const handleScreenShareToggle = () => {
    const newState = !screenSharing
    setScreenSharing(newState)
    toggleScreenShare?.(newState)
  }

  // Render participant cursors
  const renderParticipantCursors = () => {
    return Array.from(participants.values()).map(participant => {
      if (!participant.cursor || participant.id === userId) return null
      
      return (
        <div
          key={participant.id}
          className="absolute pointer-events-none z-10"
          style={{
            // This would need proper positioning calculation based on line/column
            top: `${participant.cursor.line * 20}px`,
            left: `${participant.cursor.column * 8}px`,
            borderLeft: `2px solid ${participant.color}`,
            height: '20px'
          }}
        >
          <div 
            className="text-xs text-white px-1 rounded"
            style={{ backgroundColor: participant.color }}
          >
            {participant.name}
          </div>
        </div>
      )
    })
  }

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-600'
      case 'connecting': 
      case 'reconnecting': return 'text-yellow-600'
      case 'disconnected': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <Wifi className="h-4 w-4" />
      case 'connecting':
      case 'reconnecting': return <AlertCircle className="h-4 w-4 animate-pulse" />
      case 'disconnected': return <WifiOff className="h-4 w-4" />
      default: return <WifiOff className="h-4 w-4" />
    }
  }

  return (
    <Card className={`${className} ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Code2 className="h-5 w-5" />
              Collaborative Editor
            </CardTitle>
            
            {/* Connection Status */}
            <div className={`flex items-center gap-1 text-sm ${getConnectionStatusColor()}`}>
              {getConnectionStatusIcon()}
              <span className="capitalize">{connectionStatus}</span>
            </div>
          </div>

          {/* Participants */}
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {Array.from(participants.values()).slice(0, 4).map(participant => (
                <Avatar key={participant.id} className="h-8 w-8 border-2 border-background">
                  <AvatarImage src={participant.avatar} alt={participant.name} />
                  <AvatarFallback 
                    className="text-xs"
                    style={{ backgroundColor: participant.color + '20', color: participant.color }}
                  >
                    {participant.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              ))}
              {participants.size > 4 && (
                <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                  +{participants.size - 4}
                </div>
              )}
            </div>
            
            <Badge variant="outline" className="text-xs">
              <Users className="h-3 w-3 mr-1" />
              {participants.size}
            </Badge>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Tab Navigation */}
            <div className="flex gap-1 bg-muted p-1 rounded-lg">
              {[
                { id: 'editor', label: 'Editor', icon: Code2 },
                { id: 'preview', label: 'Preview', icon: FileText },
                { id: 'terminal', label: 'Terminal', icon: Terminal }
              ].map(tab => {
                const Icon = tab.icon
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab(tab.id as any)}
                  >
                    <Icon className="h-4 w-4 mr-1" />
                    {tab.label}
                  </Button>
                )
              })}
            </div>

            {/* Execution Controls */}
            <Button
              size="sm"
              onClick={handleRunCode}
              disabled={isRunning || readOnly}
              className="bg-green-600 hover:bg-green-700"
            >
              {isRunning ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              {isRunning ? 'Running...' : 'Run'}
            </Button>

            <Button variant="outline" size="sm" disabled={isRunning}>
              <Square className="h-4 w-4 mr-2" />
              Stop
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {/* Communication Controls */}
            <Button
              variant={voiceEnabled ? 'default' : 'outline'}
              size="sm"
              onClick={handleVoiceToggle}
            >
              {voiceEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </Button>

            <Button
              variant={videoEnabled ? 'default' : 'outline'}
              size="sm"
              onClick={handleVideoToggle}
            >
              {videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            </Button>

            <Button
              variant={screenSharing ? 'default' : 'outline'}
              size="sm"
              onClick={handleScreenShareToggle}
            >
              {screenSharing ? <Monitor className="h-4 w-4" /> : <MonitorOff className="h-4 w-4" />}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setChatOpen(!chatOpen)}
            >
              <MessageSquare className="h-4 w-4" />
              {chatMessages.length > 0 && (
                <Badge variant="destructive" className="ml-1 h-4 w-4 p-0 text-xs">
                  {chatMessages.length}
                </Badge>
              )}
            </Button>

            {/* File Controls */}
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>

            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>

            {/* Fullscreen Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>

            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="flex h-96">
          {/* Main Editor Area */}
          <div className="flex-1 relative">
            {activeTab === 'editor' && (
              <div className="relative h-full">
                {/* Participant Cursors */}
                {renderParticipantCursors()}
                
                {/* Code Editor */}
                <textarea
                  ref={editorRef}
                  value={code}
                  onChange={handleCodeChange}
                  onSelect={handleCursorMove}
                  onKeyUp={handleCursorMove}
                  onClick={handleCursorMove}
                  readOnly={readOnly}
                  className={`
                    w-full h-full p-4 font-mono text-sm resize-none border-none outline-none
                    ${theme === 'dark' 
                      ? 'bg-slate-900 text-slate-100' 
                      : 'bg-white text-slate-900'
                    }
                  `}
                  placeholder="Start coding together..."
                  style={{
                    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                    lineHeight: '1.5',
                    tabSize: 2
                  }}
                />
              </div>
            )}

            {activeTab === 'preview' && (
              <div className="h-full p-4 bg-white">
                <iframe
                  srcDoc={`
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <style>
                          body { font-family: Arial, sans-serif; margin: 20px; }
                        </style>
                      </head>
                      <body>
                        <script>${code}</script>
                      </body>
                    </html>
                  `}
                  className="w-full h-full border rounded"
                  sandbox="allow-scripts"
                />
              </div>
            )}

            {activeTab === 'terminal' && (
              <div className="h-full p-4 bg-black text-green-400 font-mono text-sm overflow-y-auto">
                <pre className="whitespace-pre-wrap">{output || 'Terminal ready...'}</pre>
                {isRunning && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400"></div>
                    <span>Executing...</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Chat Sidebar */}
          {chatOpen && (
            <div className="w-80 border-l bg-muted/50 flex flex-col">
              <div className="p-3 border-b">
                <h3 className="font-medium">Session Chat</h3>
              </div>
              
              <div className="flex-1 p-3 overflow-y-auto space-y-2">
                {chatMessages.map((message, index) => {
                  const participant = participants.get(message.userId)
                  return (
                    <div key={index} className="flex gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {participant?.name.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-muted-foreground">
                          {participant?.name || 'Unknown'}
                        </div>
                        <div className="text-sm">{message.message}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              <div className="p-3 border-t">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="w-full px-3 py-2 text-sm border rounded"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && sendChatMessage) {
                      sendChatMessage(e.currentTarget.value)
                      e.currentTarget.value = ''
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
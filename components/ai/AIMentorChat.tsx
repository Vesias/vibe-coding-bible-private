'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/hooks/use-toast'
import { AIMessage, AIResponse, AIPersonality } from '@/lib/ai/provider'
import { 
  Send, 
  Loader2, 
  MessageCircle, 
  Crown,
  Sparkles,
  Lightbulb,
  Code,
  Target,
  Scroll,
  Zap,
  Heart,
  Star,
  RefreshCw
} from 'lucide-react'

interface AIMentorChatProps {
  onCodeSuggestion?: (code: string) => void
  initialContext?: {
    workshopId?: string
    currentCode?: string
    language?: string
  }
  className?: string
}

interface ChatMessage extends AIMessage {
  id: string
  personality?: string
  codeSnippets?: Array<{
    language: string
    code: string
    explanation: string
    title?: string
  }>
  suggestions?: string[]
  loading?: boolean
}

export function AIMentorChat({ onCodeSuggestion, initialContext, className = '' }: AIMentorChatProps) {
  const { toast } = useToast()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedPersonality, setSelectedPersonality] = useState<AIPersonality | null>(null)
  const [personalities, setPersonalities] = useState<AIPersonality[]>([])
  const [loadingPersonalities, setLoadingPersonalities] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Load available AI personalities
  useEffect(() => {
    loadPersonalities()
  }, [])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Add welcome message
  useEffect(() => {
    if (personalities.length > 0 && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        role: 'assistant',
        content: '🙏 **Welcome to Divine Coding Guidance**\n\nChoose a sacred mentor to guide your coding journey. Each brings unique wisdom and teaching style to help you master the art of programming.',
        timestamp: new Date().toISOString()
      }
      setMessages([welcomeMessage])
    }
  }, [personalities, messages.length])

  const loadPersonalities = async () => {
    try {
      const response = await fetch('/api/ai/personalities')
      if (!response.ok) throw new Error('Failed to load personalities')
      
      const data = await response.json()
      setPersonalities(data.available)
      
      // Auto-select first available personality
      if (data.available.length > 0) {
        setSelectedPersonality(data.available[0])
      }
    } catch (error) {
      console.error('Error loading personalities:', error)
      toast({
        title: 'Error',
        description: 'Failed to load AI mentors',
        variant: 'destructive'
      })
    } finally {
      setLoadingPersonalities(false)
    }
  }

  const sendMessage = async () => {
    if (!currentMessage.trim() || loading || !selectedPersonality) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage,
      timestamp: new Date().toISOString()
    }

    const loadingMessage: ChatMessage = {
      id: Date.now().toString() + '_loading',
      role: 'assistant',
      content: `${selectedPersonality.name} is contemplating your question...`,
      loading: true,
      personality: selectedPersonality.name,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage, loadingMessage])
    setCurrentMessage('')
    setLoading(true)

    try {
      const chatMessages: AIMessage[] = [
        ...messages.filter(m => !m.loading).map(m => ({
          role: m.role,
          content: m.content,
          timestamp: m.timestamp
        })),
        userMessage
      ]

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatMessages,
          personality: selectedPersonality.name,
          model: selectedPersonality.preferredModel,
          context: initialContext
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const aiResponse: AIResponse = await response.json()

      const assistantMessage: ChatMessage = {
        id: Date.now().toString() + '_response',
        role: 'assistant',
        content: aiResponse.content,
        personality: selectedPersonality.name,
        codeSnippets: aiResponse.codeSnippets,
        suggestions: aiResponse.suggestions,
        timestamp: new Date().toISOString()
      }

      setMessages(prev => prev.filter(m => m.id !== loadingMessage.id).concat(assistantMessage))

    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: 'Error',
        description: 'Failed to get response from AI mentor',
        variant: 'destructive'
      })
      
      setMessages(prev => prev.filter(m => m.id !== loadingMessage.id))
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getPersonalityIcon = (personality: AIPersonality) => {
    switch (personality.role) {
      case 'mentor': return <Lightbulb className="h-4 w-4" />
      case 'reviewer': return <Target className="h-4 w-4" />
      case 'guide': return <Code className="h-4 w-4" />
      case 'prophet': return <Crown className="h-4 w-4" />
      default: return <MessageCircle className="h-4 w-4" />
    }
  }

  const clearChat = () => {
    setMessages([])
    setTimeout(() => {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        role: 'assistant',
        content: '🙏 **Welcome to Divine Coding Guidance**\n\nChoose a sacred mentor to guide your coding journey. Each brings unique wisdom and teaching style to help you master the art of programming.',
        timestamp: new Date().toISOString()
      }
      setMessages([welcomeMessage])
    }, 100)
  }

  if (loadingPersonalities) {
    return (
      <Card className={`h-[600px] ${className}`}>
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading divine mentors...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`h-[600px] flex flex-col ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              AI Divine Mentors
            </CardTitle>
            <CardDescription>
              Get guidance from sacred coding masters
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={clearChat}>
              <RefreshCw className="h-3 w-3 mr-1" />
              Clear
            </Button>
          </div>
        </div>

        {/* Personality Selector */}
        <div className="flex flex-wrap gap-2 mt-3">
          {personalities.map(personality => (
            <Button
              key={personality.name}
              variant={selectedPersonality?.name === personality.name ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPersonality(personality)}
              className="text-xs"
            >
              {getPersonalityIcon(personality)}
              <span className="ml-1">{personality.name.split(' ')[0]}</span>
              {personality.role === 'prophet' && <Crown className="h-3 w-3 ml-1" />}
            </Button>
          ))}
        </div>

        {selectedPersonality && (
          <div className="mt-2 p-2 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium">{selectedPersonality.name}</span>
              <Badge variant="outline" className="text-xs">
                {selectedPersonality.role}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{selectedPersonality.description}</p>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">{message.content}</span>
                    </div>
                  ) : (
                    <>
                      {message.personality && (
                        <div className="flex items-center gap-1 mb-2 text-xs opacity-70">
                          <Star className="h-3 w-3" />
                          {message.personality}
                        </div>
                      )}
                      
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: message.content.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          }}
                        />
                      </div>

                      {message.codeSnippets && message.codeSnippets.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {message.codeSnippets.map((snippet, index) => (
                            <div key={index} className="bg-background rounded p-3 border">
                              <div className="flex items-center justify-between mb-2">
                                <Badge variant="outline" className="text-xs">
                                  {snippet.language}
                                </Badge>
                                {onCodeSuggestion && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => onCodeSuggestion(snippet.code)}
                                    className="text-xs"
                                  >
                                    <Code className="h-3 w-3 mr-1" />
                                    Use Code
                                  </Button>
                                )}
                              </div>
                              <pre className="text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                                {snippet.code}
                              </pre>
                              {snippet.explanation && (
                                <p className="text-xs text-muted-foreground mt-2">
                                  {snippet.explanation}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-medium mb-2">💡 Quick suggestions:</p>
                          <div className="flex flex-wrap gap-1">
                            {message.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className="text-xs h-auto py-1"
                                onClick={() => setCurrentMessage(suggestion)}
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Textarea
              ref={textareaRef}
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={selectedPersonality ? `Ask ${selectedPersonality.name} for guidance...` : 'Select a mentor first...'}
              className="min-h-[60px] max-h-[120px]"
              disabled={loading || !selectedPersonality}
            />
            <Button
              onClick={sendMessage}
              disabled={loading || !currentMessage.trim() || !selectedPersonality}
              size="icon"
              className="shrink-0 h-[60px] w-[60px]"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
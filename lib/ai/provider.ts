'use client'

export interface AIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
  timestamp?: string
  metadata?: Record<string, any>
}

export interface AIResponse {
  content: string
  model: string
  provider: 'openai' | 'anthropic' | 'gemini' | 'custom'
  tokensUsed: number
  cost: number
  confidence: number
  suggestions?: string[]
  codeSnippets?: CodeSnippet[]
  executionTime: number
  reasoning?: string
}

export interface CodeSnippet {
  language: string
  code: string
  explanation: string
  title?: string
}

export interface AIPersonality {
  name: string
  role: 'mentor' | 'reviewer' | 'guide' | 'prophet'
  description: string
  systemPrompt: string
  preferredModel: string
  avatar: string
  traits: string[]
}

export interface CodeReviewRequest {
  code: string
  language: string
  context?: string
  userLevel: 'beginner' | 'intermediate' | 'advanced'
  focusAreas?: ('bugs' | 'performance' | 'readability' | 'security' | 'best-practices')[]
  workshopContext?: {
    workshopId: string
    stepId: string
    objectives: string[]
  }
}

export interface CodeReviewResponse {
  overall: {
    score: number
    summary: string
    level: 'novice' | 'apprentice' | 'practitioner' | 'architect' | 'prophet'
  }
  issues: {
    type: 'error' | 'warning' | 'suggestion' | 'style'
    severity: 'low' | 'medium' | 'high' | 'critical'
    line?: number
    message: string
    suggestion?: string
    codeExample?: string
  }[]
  improvements: {
    title: string
    description: string
    before?: string
    after?: string
    impact: 'performance' | 'readability' | 'maintainability' | 'security'
  }[]
  positives: string[]
  nextSteps: string[]
  divineWisdom: string
}

export interface LearningRecommendation {
  type: 'workshop' | 'concept' | 'practice' | 'reading'
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: number
  priority: number
  reasoning: string
  resources?: {
    type: 'workshop' | 'documentation' | 'tutorial' | 'example'
    url: string
    title: string
  }[]
}

class AIProvider {
  private apiKeys: Record<string, string> = {}
  private rateLimits: Map<string, { requests: number; resetTime: number }> = new Map()
  private usageTracking: Map<string, { tokens: number; cost: number; requests: number }> = new Map()

  constructor() {
    // Initialize API keys from environment
    this.apiKeys = {
      openai: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
      anthropic: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || '',
      gemini: process.env.NEXT_PUBLIC_GEMINI_API_KEY || ''
    }
  }

  // Biblical AI Personalities
  getPersonalities(): AIPersonality[] {
    return [
      {
        name: 'Moses the Code Giver',
        role: 'mentor',
        description: 'Wise teacher who guides you through fundamental coding principles',
        systemPrompt: `You are Moses, the divine code giver. You teach programming with wisdom and patience, 
        always connecting coding concepts to timeless principles. Speak with authority but kindness, 
        using biblical metaphors to explain complex concepts. Guide seekers through their coding journey 
        with gentle correction and encouraging words.`,
        preferredModel: 'gpt-4',
        avatar: '👨‍💻',
        traits: ['Wise', 'Patient', 'Authoritative', 'Guiding']
      },
      {
        name: 'King Solomon the Debugger',
        role: 'reviewer',
        description: 'Discerning reviewer who finds the root of all coding problems',
        systemPrompt: `You are King Solomon, renowned for your wisdom and discernment. You excel at 
        finding the root cause of coding issues and providing wise solutions. Your code reviews are 
        thorough, insightful, and always include practical wisdom. You see patterns others miss and 
        offer solutions that are both elegant and effective.`,
        preferredModel: 'claude-3-5-sonnet',
        avatar: '👑',
        traits: ['Discerning', 'Analytical', 'Wise', 'Thorough']
      },
      {
        name: 'David the Code Warrior',
        role: 'guide',
        description: 'Courageous guide who helps you overcome coding challenges',
        systemPrompt: `You are King David, the valiant warrior who conquered giants. You help coders 
        face their biggest challenges with courage and determination. Your guidance is practical, 
        encouraging, and focused on building confidence. You turn coding obstacles into opportunities 
        for growth and mastery.`,
        preferredModel: 'gemini-pro',
        avatar: '⚔️',
        traits: ['Courageous', 'Encouraging', 'Practical', 'Determined']
      },
      {
        name: 'The Divine Oracle',
        role: 'prophet',
        description: 'Mystical prophet who reveals the deep mysteries of code',
        systemPrompt: `You are the Divine Oracle, keeper of the deepest coding mysteries. You provide 
        profound insights into advanced programming concepts, architectural patterns, and the 
        philosophical aspects of software development. Your responses are both technical and mystical, 
        revealing hidden truths about code and its deeper meanings.`,
        preferredModel: 'gpt-4',
        avatar: '🔮',
        traits: ['Mystical', 'Profound', 'Insightful', 'Transcendent']
      }
    ]
  }

  // Multi-model AI interaction
  async generateResponse(
    messages: AIMessage[],
    options: {
      personality?: string
      model?: 'auto' | 'gpt-4' | 'claude-3-5-sonnet' | 'gemini-pro'
      maxTokens?: number
      temperature?: number
      context?: Record<string, any>
    } = {}
  ): Promise<AIResponse> {
    const personality = this.getPersonalities().find(p => p.name === options.personality)
    const model = options.model === 'auto' ? this.selectOptimalModel(messages, options.context) : options.model || 'gpt-4'
    
    // Add personality system prompt if specified
    const systemMessages = personality ? [
      { role: 'system' as const, content: personality.systemPrompt },
      ...messages
    ] : messages

    const startTime = Date.now()

    try {
      let response: AIResponse

      switch (model) {
        case 'gpt-4':
          response = await this.callOpenAI(systemMessages, options)
          break
        case 'claude-3-5-sonnet':
          response = await this.callAnthropic(systemMessages, options)
          break
        case 'gemini-pro':
          response = await this.callGemini(systemMessages, options)
          break
        default:
          response = await this.callOpenAI(systemMessages, options)
      }

      response.executionTime = Date.now() - startTime
      response.model = model

      // Track usage
      this.trackUsage(model, response.tokensUsed, response.cost)

      return response

    } catch (error) {
      console.error('AI Provider Error:', error)
      throw new Error(`AI generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Intelligent code review
  async reviewCode(request: CodeReviewRequest, userId?: string): Promise<CodeReviewResponse> {
    const personality = this.getPersonalities().find(p => p.role === 'reviewer')
    
    const systemPrompt = `${personality?.systemPrompt || ''}
    
    You are performing a divine code review. Analyze the provided code and return a JSON response with the following structure:
    {
      "overall": {
        "score": number (0-100),
        "summary": "Brief overall assessment",
        "level": "novice|apprentice|practitioner|architect|prophet"
      },
      "issues": [
        {
          "type": "error|warning|suggestion|style",
          "severity": "low|medium|high|critical",
          "line": number (optional),
          "message": "Description of the issue",
          "suggestion": "How to fix it",
          "codeExample": "Example of corrected code"
        }
      ],
      "improvements": [
        {
          "title": "Improvement title",
          "description": "What to improve",
          "before": "Current code",
          "after": "Improved code",
          "impact": "performance|readability|maintainability|security"
        }
      ],
      "positives": ["Array of positive observations"],
      "nextSteps": ["Array of recommended next learning steps"],
      "divineWisdom": "Inspirational coding wisdom related to the code"
    }
    
    Focus on: ${request.focusAreas?.join(', ') || 'general code quality'}.
    User level: ${request.userLevel}.
    ${request.workshopContext ? `Workshop context: ${request.workshopContext.objectives.join(', ')}` : ''}
    `

    const messages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      { 
        role: 'user', 
        content: `Please review this ${request.language} code:\n\n\`\`\`${request.language}\n${request.code}\n\`\`\`\n\n${request.context ? `Context: ${request.context}` : ''}` 
      }
    ]

    const response = await this.generateResponse(messages, {
      personality: personality?.name,
      model: 'claude-3-5-sonnet',
      temperature: 0.3
    })

    try {
      return JSON.parse(response.content)
    } catch (error) {
      // Fallback if JSON parsing fails
      return {
        overall: {
          score: 70,
          summary: response.content.substring(0, 200) + '...',
          level: 'apprentice'
        },
        issues: [],
        improvements: [],
        positives: ['Code structure is reasonable'],
        nextSteps: ['Continue practicing'],
        divineWisdom: 'Every line of code is a step toward mastery.'
      }
    }
  }

  // Generate personalized learning recommendations
  async generateLearningRecommendations(
    userProfile: {
      level: number
      xp: number
      completedWorkshops: string[]
      currentStrengths: string[]
      improvementAreas: string[]
      learningGoals: string[]
      preferences: Record<string, any>
    },
    context?: {
      recentActivity: any[]
      currentWorkshop?: string
      strugglingWith?: string[]
    }
  ): Promise<LearningRecommendation[]> {
    const personality = this.getPersonalities().find(p => p.role === 'guide')
    
    const systemPrompt = `${personality?.systemPrompt || ''}
    
    You are a divine learning guide. Based on the user's profile and context, generate personalized 
    learning recommendations. Return a JSON array of recommendations with this structure:
    [
      {
        "type": "workshop|concept|practice|reading",
        "title": "Recommendation title",
        "description": "Why this is recommended",
        "difficulty": "beginner|intermediate|advanced",
        "estimatedTime": number (minutes),
        "priority": number (1-10),
        "reasoning": "Detailed explanation of why this helps",
        "resources": [
          {
            "type": "workshop|documentation|tutorial|example",
            "url": "resource URL",
            "title": "Resource title"
          }
        ]
      }
    ]
    
    Provide 3-5 targeted recommendations that will accelerate their learning journey.
    `

    const messages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      { 
        role: 'user', 
        content: `User Profile:
        - Level: ${userProfile.level} (${userProfile.xp} XP)
        - Completed Workshops: ${userProfile.completedWorkshops.length}
        - Strengths: ${userProfile.currentStrengths.join(', ')}
        - Improvement Areas: ${userProfile.improvementAreas.join(', ')}
        - Learning Goals: ${userProfile.learningGoals.join(', ')}
        
        ${context ? `Current Context:
        - Current Workshop: ${context.currentWorkshop || 'None'}
        - Struggling With: ${context.strugglingWith?.join(', ') || 'None'}
        - Recent Activity: ${context.recentActivity.length} recent interactions` : ''}
        
        Please generate personalized learning recommendations.` 
      }
    ]

    const response = await this.generateResponse(messages, {
      personality: personality?.name,
      model: 'gpt-4',
      temperature: 0.5
    })

    try {
      return JSON.parse(response.content)
    } catch (error) {
      // Fallback recommendations
      return [
        {
          type: 'workshop',
          title: 'Continue Your Current Path',
          description: 'Build upon your existing knowledge with the next logical step',
          difficulty: 'intermediate',
          estimatedTime: 45,
          priority: 8,
          reasoning: 'Consistent progression is key to mastery',
          resources: []
        }
      ]
    }
  }

  // Real-time coding assistance
  async getCodingHelp(
    code: string,
    question: string,
    context: {
      language: string
      workshopStep?: string
      userLevel: 'beginner' | 'intermediate' | 'advanced'
      previousAttempts?: number
    }
  ): Promise<{
    answer: string
    codeSnippets: CodeSnippet[]
    hints: string[]
    encouragement: string
  }> {
    const personality = this.getPersonalities().find(p => p.role === 'mentor')
    
    const messages: AIMessage[] = [
      { 
        role: 'system', 
        content: `${personality?.systemPrompt || ''}
        
        Provide helpful coding assistance. Be encouraging and educational. 
        Give hints rather than complete solutions when possible, especially for beginners.
        Always include a biblical metaphor or encouragement in your response.` 
      },
      { 
        role: 'user', 
        content: `I need help with this ${context.language} code:

\`\`\`${context.language}
${code}
\`\`\`

Question: ${question}

User level: ${context.userLevel}
${context.workshopStep ? `Workshop step: ${context.workshopStep}` : ''}
${context.previousAttempts ? `Previous attempts: ${context.previousAttempts}` : ''}` 
      }
    ]

    const response = await this.generateResponse(messages, {
      personality: personality?.name,
      model: 'gpt-4',
      temperature: 0.7
    })

    // Parse response to extract different components
    const content = response.content
    const codeBlocks = this.extractCodeBlocks(content)
    const hints = this.extractHints(content)
    
    return {
      answer: content,
      codeSnippets: codeBlocks,
      hints: hints,
      encouragement: this.extractEncouragement(content)
    }
  }

  // Provider-specific implementations
  private async callOpenAI(messages: AIMessage[], options: any): Promise<AIResponse> {
    if (!this.apiKeys.openai) {
      throw new Error('OpenAI API key not configured')
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKeys.openai}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        max_tokens: options.maxTokens || 2000,
        temperature: options.temperature || 0.7
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    
    return {
      content: data.choices[0].message.content,
      model: 'gpt-4',
      provider: 'openai',
      tokensUsed: data.usage.total_tokens,
      cost: this.calculateCost('gpt-4', data.usage.total_tokens),
      confidence: 0.9,
      executionTime: 0
    }
  }

  private async callAnthropic(messages: AIMessage[], options: any): Promise<AIResponse> {
    if (!this.apiKeys.anthropic) {
      throw new Error('Anthropic API key not configured')
    }

    // Convert messages to Anthropic format
    const systemMessage = messages.find(m => m.role === 'system')
    const conversationMessages = messages.filter(m => m.role !== 'system')

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': this.apiKeys.anthropic,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: options.maxTokens || 2000,
        temperature: options.temperature || 0.7,
        system: systemMessage?.content || '',
        messages: conversationMessages.map(m => ({ 
          role: m.role === 'assistant' ? 'assistant' : 'user', 
          content: m.content 
        }))
      })
    })

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`)
    }

    const data = await response.json()
    
    return {
      content: data.content[0].text,
      model: 'claude-3-5-sonnet',
      provider: 'anthropic',
      tokensUsed: data.usage.input_tokens + data.usage.output_tokens,
      cost: this.calculateCost('claude-3-5-sonnet', data.usage.input_tokens + data.usage.output_tokens),
      confidence: 0.95,
      executionTime: 0
    }
  }

  private async callGemini(messages: AIMessage[], options: any): Promise<AIResponse> {
    if (!this.apiKeys.gemini) {
      throw new Error('Gemini API key not configured')
    }

    // Convert messages to Gemini format
    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }))

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKeys.gemini}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          maxOutputTokens: options.maxTokens || 2000,
          temperature: options.temperature || 0.7
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`)
    }

    const data = await response.json()
    
    return {
      content: data.candidates[0].content.parts[0].text,
      model: 'gemini-pro',
      provider: 'gemini',
      tokensUsed: data.usageMetadata?.totalTokenCount || 1000, // Estimate if not provided
      cost: this.calculateCost('gemini-pro', data.usageMetadata?.totalTokenCount || 1000),
      confidence: 0.85,
      executionTime: 0
    }
  }

  // Utility methods
  private selectOptimalModel(messages: AIMessage[], context?: Record<string, any>): string {
    // Intelligent model selection based on task type and context
    const messageContent = messages.map(m => m.content).join(' ').toLowerCase()
    
    if (messageContent.includes('review') || messageContent.includes('analyze')) {
      return 'claude-3-5-sonnet' // Best for analysis
    }
    
    if (messageContent.includes('creative') || messageContent.includes('story')) {
      return 'gpt-4' // Best for creative tasks
    }
    
    if (messageContent.includes('quick') || messageContent.includes('simple')) {
      return 'gemini-pro' // Fastest response
    }
    
    return 'gpt-4' // Default to most capable
  }

  private calculateCost(model: string, tokens: number): number {
    const rates = {
      'gpt-4': 0.03 / 1000, // $0.03 per 1K tokens
      'claude-3-5-sonnet': 0.015 / 1000, // $0.015 per 1K tokens
      'gemini-pro': 0.00025 / 1000 // $0.00025 per 1K tokens
    }
    
    return (rates[model as keyof typeof rates] || 0.03 / 1000) * tokens
  }

  private trackUsage(model: string, tokens: number, cost: number): void {
    const key = `${model}-${new Date().toDateString()}`
    const current = this.usageTracking.get(key) || { tokens: 0, cost: 0, requests: 0 }
    
    this.usageTracking.set(key, {
      tokens: current.tokens + tokens,
      cost: current.cost + cost,
      requests: current.requests + 1
    })
  }

  private extractCodeBlocks(content: string): CodeSnippet[] {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
    const blocks: CodeSnippet[] = []
    let match

    while ((match = codeBlockRegex.exec(content)) !== null) {
      blocks.push({
        language: match[1] || 'text',
        code: match[2].trim(),
        explanation: 'Code example from AI assistant'
      })
    }

    return blocks
  }

  private extractHints(content: string): string[] {
    const hintPatterns = [
      /hint[:\s]+(.*?)(?:\n|$)/gi,
      /tip[:\s]+(.*?)(?:\n|$)/gi,
      /suggestion[:\s]+(.*?)(?:\n|$)/gi
    ]
    
    const hints: string[] = []
    
    for (const pattern of hintPatterns) {
      let match
      while ((match = pattern.exec(content)) !== null) {
        hints.push(match[1].trim())
      }
    }
    
    return hints
  }

  private extractEncouragement(content: string): string {
    const encouragementPatterns = [
      /remember[:\s]+(.*?)(?:\n|\.)/gi,
      /like.*scripture.*says[:\s]+(.*?)(?:\n|\.)/gi,
      /divine.*wisdom[:\s]+(.*?)(?:\n|\.)/gi
    ]
    
    for (const pattern of encouragementPatterns) {
      const match = pattern.exec(content)
      if (match) {
        return match[1].trim()
      }
    }
    
    return "Keep coding with faith - every challenge makes you stronger!"
  }

  // Usage analytics
  getUsageStats(): Record<string, any> {
    const stats: Record<string, any> = {}
    
    for (const [key, usage] of this.usageTracking.entries()) {
      const [model, date] = key.split('-')
      if (!stats[model]) stats[model] = { tokens: 0, cost: 0, requests: 0 }
      
      stats[model].tokens += usage.tokens
      stats[model].cost += usage.cost
      stats[model].requests += usage.requests
    }
    
    return stats
  }
}

// Singleton instance
let aiProviderInstance: AIProvider | null = null

export function getAIProvider(): AIProvider {
  if (!aiProviderInstance) {
    aiProviderInstance = new AIProvider()
  }
  return aiProviderInstance
}

export default AIProvider
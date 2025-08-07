"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  Camera, 
  Palette, 
  Calendar,
  MapPin,
  Clock,
  Users,
  TrendingUp,
  Heart,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils/cn'
import { ProductFilters } from '@/lib/supabase/types'

interface AIStyleAssistantProps {
  onSuggestionApply: (filters: Partial<ProductFilters>) => void
  currentFilters: ProductFilters
  className?: string
}

interface StyleSuggestion {
  id: string
  title: string
  description: string
  icon: React.ElementType
  filters: Partial<ProductFilters>
  tags: string[]
  priority: 'high' | 'medium' | 'low'
}

export function AIStyleAssistant({
  onSuggestionApply,
  currentFilters,
  className
}: AIStyleAssistantProps) {
  const [activeSuggestions, setActiveSuggestions] = useState<StyleSuggestion[]>([])
  const [userContext, setUserContext] = useState({
    timeOfDay: 'day',
    season: 'fall',
    location: 'urban',
    occasion: null as string | null
  })

  // Get dynamic suggestions based on context
  useEffect(() => {
    const hour = new Date().getHours()
    const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'
    const month = new Date().getMonth()
    const season = month >= 2 && month <= 4 ? 'spring' :
                  month >= 5 && month <= 7 ? 'summer' :
                  month >= 8 && month <= 10 ? 'fall' : 'winter'
    
    setUserContext(prev => ({
      ...prev,
      timeOfDay,
      season
    }))

    // Generate smart suggestions
    const suggestions: StyleSuggestion[] = []

    // Time-based suggestions
    if (timeOfDay === 'evening') {
      suggestions.push({
        id: 'evening-elegant',
        title: 'Evening Elegance',
        description: 'Perfect for dinner dates and evening events',
        icon: Clock,
        filters: { 
          color: 'black',
          category: 'formal wear',
          minPrice: 200
        },
        tags: ['sophisticated', 'formal'],
        priority: 'high'
      })
    }

    // Seasonal suggestions
    if (season === 'fall') {
      suggestions.push({
        id: 'fall-essentials',
        title: 'Fall Essentials',
        description: 'Warm colors and layering pieces for autumn',
        icon: Calendar,
        filters: { 
          seasonal: 'fall',
          color: 'burgundy'
        },
        tags: ['seasonal', 'cozy'],
        priority: 'high'
      })
    }

    // Trending suggestions
    suggestions.push({
      id: 'trending-now',
      title: "What's Hot",
      description: 'Most popular items this week',
      icon: TrendingUp,
      filters: { 
        trending: true
      },
      tags: ['popular', 'bestseller'],
      priority: 'medium'
    })

    // Occasion-based
    const dayOfWeek = new Date().getDay()
    if (dayOfWeek === 5 || dayOfWeek === 6) { // Friday or Saturday
      suggestions.push({
        id: 'weekend-ready',
        title: 'Weekend Ready',
        description: 'Casual yet stylish for your days off',
        icon: Zap,
        filters: { 
          category: 'apparel',
          maxPrice: 150
        },
        tags: ['casual', 'comfortable'],
        priority: 'medium'
      })
    }

    // Wedding season (May-September)
    if (month >= 4 && month <= 8) {
      suggestions.push({
        id: 'wedding-guest',
        title: 'Wedding Guest',
        description: 'Look your best at summer weddings',
        icon: Users,
        filters: { 
          occasion: 'wedding',
          category: 'formal wear'
        },
        tags: ['wedding', 'formal'],
        priority: 'high'
      })
    }

    setActiveSuggestions(suggestions)
  }, [])

  const handleSuggestionClick = (suggestion: StyleSuggestion) => {
    onSuggestionApply(suggestion.filters)
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* AI Assistant Header */}
      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gold/10 to-yellow-50 rounded-lg">
        <div className="p-2 bg-gold/20 rounded-full">
          <Sparkles className="h-5 w-5 text-gold" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">AI Style Assistant</h3>
          <p className="text-sm text-gray-600">
            Personalized suggestions based on trends and your preferences
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="justify-start gap-2"
          onClick={() => {
            // Trigger camera for outfit matching
            console.log('Camera feature coming soon')
          }}
        >
          <Camera className="h-4 w-4" />
          Match My Style
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="justify-start gap-2"
          onClick={() => {
            // Color harmony suggestions
            onSuggestionApply({ color: 'ai-match' })
          }}
        >
          <Palette className="h-4 w-4" />
          Color Match
        </Button>
      </div>

      {/* Dynamic Suggestions */}
      <div className="space-y-2">
        <AnimatePresence>
          {activeSuggestions.map((suggestion, index) => (
            <motion.div
              key={suggestion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={cn(
                  "p-4 cursor-pointer transition-all hover:shadow-md",
                  "border-l-4",
                  suggestion.priority === 'high' ? 'border-l-gold' :
                  suggestion.priority === 'medium' ? 'border-l-blue-500' :
                  'border-l-gray-300'
                )}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    suggestion.priority === 'high' ? 'bg-gold/10' :
                    suggestion.priority === 'medium' ? 'bg-blue-50' :
                    'bg-gray-50'
                  )}>
                    <suggestion.icon className={cn(
                      "h-5 w-5",
                      suggestion.priority === 'high' ? 'text-gold' :
                      suggestion.priority === 'medium' ? 'text-blue-600' :
                      'text-gray-600'
                    )} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {suggestion.description}
                    </p>
                    <div className="flex gap-1 mt-2">
                      {suggestion.tags.map(tag => (
                        <Badge 
                          key={tag} 
                          variant="secondary" 
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {suggestion.priority === 'high' && (
                    <Badge className="bg-gold text-black">
                      Recommended
                    </Badge>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Personalization Note */}
      <div className="text-xs text-gray-500 text-center p-3 bg-gray-50 rounded-lg">
        <Heart className="h-3 w-3 inline mr-1" />
        Suggestions improve as you shop. Your privacy is always protected.
      </div>
    </div>
  )
}

// Quick style quiz for better recommendations
export function StyleQuiz({ onComplete }: { onComplete: (preferences: any) => void }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({
    style: '',
    occasion: '',
    budget: '',
    fit: ''
  })

  const questions = [
    {
      question: "What's your style vibe?",
      options: [
        { value: 'classic', label: 'Classic & Timeless', icon: '👔' },
        { value: 'modern', label: 'Modern & Sleek', icon: '✨' },
        { value: 'casual', label: 'Casual & Comfortable', icon: '👕' },
        { value: 'bold', label: 'Bold & Statement', icon: '🔥' }
      ]
    },
    {
      question: "Shopping for an occasion?",
      options: [
        { value: 'work', label: 'Work & Business', icon: '💼' },
        { value: 'wedding', label: 'Wedding & Events', icon: '🎩' },
        { value: 'date', label: 'Date Night', icon: '🌹' },
        { value: 'everyday', label: 'Everyday Wear', icon: '☀️' }
      ]
    },
    {
      question: "What's your budget range?",
      options: [
        { value: 'budget', label: 'Under $100', icon: '💵' },
        { value: 'mid', label: '$100-$300', icon: '💰' },
        { value: 'premium', label: '$300-$500', icon: '💎' },
        { value: 'luxury', label: '$500+', icon: '👑' }
      ]
    }
  ]

  const handleAnswer = (value: string) => {
    const field = ['style', 'occasion', 'budget'][step]
    setAnswers(prev => ({ ...prev, [field]: value }))
    
    if (step < questions.length - 1) {
      setStep(step + 1)
    } else {
      onComplete(answers)
    }
  }

  if (step >= questions.length) return null

  const currentQuestion = questions[step]

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Quick Style Quiz</h3>
          <span className="text-sm text-gray-500">
            {step + 1} of {questions.length}
          </span>
        </div>
        
        <p className="text-gray-700">{currentQuestion.question}</p>
        
        <div className="grid grid-cols-2 gap-3">
          {currentQuestion.options.map(option => (
            <Button
              key={option.value}
              variant="outline"
              className="h-auto py-4 px-4 justify-start"
              onClick={() => handleAnswer(option.value)}
            >
              <span className="text-2xl mr-3">{option.icon}</span>
              <span className="text-sm font-medium">{option.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </Card>
  )
}
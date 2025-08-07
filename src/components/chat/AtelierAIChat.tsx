'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Send, 
  Sparkles, 
  MessageCircle,
  ChevronDown,
  Crown,
  Loader2,
  Image as ImageIcon,
  Mic,
  Hash
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { knowledgeChatService } from '@/services/knowledge-chat-service'

interface Message {
  id: string
  content: string
  sender: 'user' | 'assistant'
  timestamp: Date
  layerLevel?: 1 | 2 | 3
}

interface AtelierAIChatProps {
  onClose?: () => void
  isOpen?: boolean
  className?: string
}

export function AtelierAIChat({ onClose, isOpen = true, className }: AtelierAIChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const wsRef = useRef<WebSocket | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !isInitialized) {
      initializeChat()
    }
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [isOpen, isInitialized])

  const initializeChat = async () => {
    // Welcome message
    setMessages([{
      id: '1',
      content: "Welcome to Atelier AI, your personal luxury menswear consultant. I embody the Sterling Crown philosophy - where luxury is a mindset, not just a price tag. How may I elevate your style today?",
      sender: 'assistant',
      timestamp: new Date(),
      layerLevel: 1
    }])
    setIsInitialized(true)
  }

  const quickActions = [
    { label: "Find my perfect suit", icon: Crown },
    { label: "Wedding styling", icon: Sparkles },
    { label: "Business attire guide", icon: Hash },
    { label: "Seasonal recommendations", icon: MessageCircle }
  ]

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    try {
      const response = await knowledgeChatService.processMessage(input)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        sender: 'assistant',
        timestamp: new Date(),
        layerLevel: response.layerLevel || 1
      }
      
      setMessages(prev => [...prev, assistantMessage])
      
      // Store suggestions for later use if needed
      if (response.suggestions) {
        // Could store in state or show as quick actions
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize for the inconvenience. Let me help you with style guidance based on our extensive fashion knowledge. What specific aspect of menswear can I assist you with today?",
        sender: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleQuickAction = (action: string) => {
    setInput(action)
    inputRef.current?.focus()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "fixed bottom-6 right-6 w-[420px] bg-gradient-to-b from-gray-50 to-white rounded-2xl shadow-2xl border border-red-900/20 overflow-hidden z-50",
          isMinimized && "h-16",
          !isMinimized && "h-[650px]",
          className
        )}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900 via-red-800 to-gray-900 p-4 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-gold via-yellow-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                  <Crown className="h-7 w-7 text-black" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold tracking-wide">Atelier AI</h3>
                <p className="text-xs text-gray-200 font-medium">Powered by KCT Intelligence</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ChevronDown className={cn(
                  "h-4 w-4 transition-transform",
                  isMinimized && "rotate-180"
                )} />
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[420px] bg-gradient-to-b from-transparent to-gray-50/50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "flex",
                    message.sender === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  <div className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3",
                    message.sender === 'user' 
                      ? "bg-gradient-to-r from-red-800 to-red-900 text-white shadow-md" 
                      : "bg-white text-gray-900 shadow-sm border border-gray-200"
                  )}>
                    {message.sender === 'assistant' && (
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="h-3 w-3 text-red-700" />
                        <span className="text-xs font-semibold text-red-700">Atelier AI</span>
                        {message.layerLevel && (
                          <Badge className="text-xs py-0 px-1.5 bg-red-100 text-red-800 border-red-200">
                            Layer {message.layerLevel}
                          </Badge>
                        )}
                      </div>
                    )}
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className="text-xs opacity-60 mt-1">
                      {message.timestamp.toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-3 w-3 text-red-700 animate-pulse" />
                      <span className="text-xs font-semibold text-red-700">Atelier AI is crafting your response</span>
                    </div>
                    <div className="flex gap-1 mt-2">
                      <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-4 pb-2 border-b border-gray-100">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action.label)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 border border-red-200 rounded-full text-xs font-medium text-red-900 whitespace-nowrap transition-all transform hover:scale-105"
                  >
                    <action.icon className="h-3 w-3 text-red-700" />
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="bg-gradient-to-b from-white to-gray-50 p-4">
              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about style, occasions, or let me help you look your best..."
                    className="w-full px-4 py-3 pr-12 bg-white border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 text-sm shadow-sm"
                    rows={1}
                    style={{ minHeight: '44px', maxHeight: '120px' }}
                  />
                  <div className="absolute bottom-3 right-3 flex items-center gap-1">
                    <button className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                      <ImageIcon className="h-4 w-4 text-red-600" />
                    </button>
                    <button className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                      <Mic className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="bg-gradient-to-r from-red-800 to-red-900 hover:from-red-900 hover:to-red-950 text-white rounded-xl p-3 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isTyping ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-600 mt-3 text-center font-medium">
                KCT Intelligence • Luxury is a mindset
              </p>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

// Floating Chat Button Component
export function AtelierAIChatButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasUnread, setHasUnread] = useState(true)

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(true)
          setHasUnread(false)
        }}
        className={cn(
          "fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-red-800 to-red-900 text-white rounded-full shadow-2xl flex items-center justify-center z-50",
          "hover:shadow-xl hover:from-red-900 hover:to-red-950 transition-all duration-200 border-2 border-red-700"
        )}
      >
        <Crown className="h-7 w-7" />
        {hasUnread && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-gold rounded-full animate-pulse border-2 border-white"
          />
        )}
      </motion.button>
      
      <AtelierAIChat isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Ruler, 
  Send, 
  Bot,
  ChevronLeft,
  Sparkles,
  Calculator,
  CheckCircle,
  Info
} from "lucide-react";
import { ModernSizeBot } from "@/components/sizing/ModernSizeBot";
import { SIZE_SHORT_QUERY, buildConversationalSizeResponse } from "@/lib/ai/size-bot-short-queries";
import { SIZE_BOT_EXPERTISE, buildSizeResponse } from "@/lib/ai/size-bot-expertise";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface SizeAssistantChatProps {
  onClose: () => void;
  productType?: 'suit' | 'shirt' | 'tuxedo';
}

export function SizeAssistantChat({ onClose, productType = 'suit' }: SizeAssistantChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [showSizeCalculator, setShowSizeCalculator] = useState(false);
  const [showFitPreference, setShowFitPreference] = useState(true);
  const [selectedFit, setSelectedFit] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSizeCalculatorResult = (recommendation: any) => {
    setShowSizeCalculator(false);
    
    // Add result message
    const resultMessage: Message = {
      id: Date.now().toString(),
      text: `Perfect! Based on your measurements, I recommend:\n\n📏 **Size ${recommendation.primarySizeFull}**\n${recommendation.confidence > 0.85 ? '✅ High confidence match!' : '⚠️ You might want to consider alterations'}\n\n${recommendation.alterations ? `Suggested alterations: ${recommendation.alterations.join(', ')}` : 'This should fit you perfectly!'}`,
      sender: 'assistant',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, resultMessage]);
    
    // Add follow-up
    setTimeout(() => {
      const followUp: Message = {
        id: (Date.now() + 1).toString(),
        text: "Would you like me to:\n• Show you products in your size\n• Explain our alteration services\n• Help with something else?",
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, followUp]);
    }, 1500);
  };

  const handleFitSelection = (fit: string) => {
    setSelectedFit(fit);
    setShowFitPreference(false);
    
    // Add initial messages based on fit selection
    const fitMessages: { [key: string]: string } = {
      'Slim Fit': "Perfect! You prefer a modern, tailored look. Slim fit suits are cut closer to the body with a contemporary silhouette. Let me help you find your perfect size in our slim fit collection.",
      'Regular Fit': "Excellent choice! Regular fit offers the perfect balance - traditional fit with comfortable room through the chest and waist. This is our most versatile fit that works for most body types.",
      'Relaxed Fit': "Great! You value comfort and ease of movement. Our relaxed fit provides extra room for maximum comfort without sacrificing style. Let me help you find your ideal size."
    };
    
    const initialMessages: Message[] = [
      {
        id: '1',
        text: fitMessages[fit] || "Great choice! Let me help you find your perfect size.",
        sender: 'assistant',
        timestamp: new Date()
      },
      {
        id: '2',
        text: "Would you like to:\n• Use our AI Size Calculator (30 seconds)\n• Tell me your usual size\n• Learn about our fit guide",
        sender: 'assistant',
        timestamp: new Date()
      }
    ];
    
    setMessages(initialMessages);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    
    // Use intelligent size bot responses
    setTimeout(() => {
      setIsTyping(false);
      
      const wordCount = input.trim().split(/\s+/).length;
      let response = "";
      let suggestions: string[] = [];
      
      // Handle short queries (2-7 words) with specialized intelligence
      if (wordCount >= 2 && wordCount <= 7) {
        response = buildConversationalSizeResponse(input);
        const analysis = SIZE_SHORT_QUERY.generate(input);
        suggestions = analysis.recommendations;
      } else {
        // Use comprehensive size bot expertise for longer queries
        const sizeResponse = buildSizeResponse(input);
        response = sizeResponse.response;
        suggestions = sizeResponse.suggestions;
      }
      
      // Check for specific actions
      const lowerInput = input.toLowerCase();
      if (lowerInput.includes('calculator') || lowerInput.includes('measure me')) {
        setTimeout(() => setShowSizeCalculator(true), 500);
      }
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        text: response,
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Add follow-up suggestions if available
      if (suggestions.length > 0) {
        setTimeout(() => {
          const followUp: Message = {
            id: (Date.now() + 1).toString(),
            text: "Quick questions:\n" + suggestions.map(s => `• ${s}`).join('\n'),
            sender: 'assistant',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, followUp]);
        }, 1500);
      }
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-burgundy to-burgundy-700 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
            <Ruler className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold">Size Assistant</h3>
            <p className="text-xs text-white/80 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Powered by Atelier AI
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-white/20 p-1 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Fit Preference Selection Screen */}
      {showFitPreference ? (
        <div className="flex-1 p-6 space-y-4">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">How do you like your suits to fit?</h2>
            <p className="text-sm text-gray-600">Select your preferred fit style</p>
          </div>
          
          <div className="space-y-3">
            {/* Slim Fit Option */}
            <button
              onClick={() => handleFitSelection('Slim Fit')}
              className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-burgundy transition-colors text-left group"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    Slim Fit 
                    <span className="text-xs text-gray-500 font-normal">Modern & Tailored</span>
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Closer to the body with a contemporary silhouette
                  </p>
                </div>
                <CheckCircle className="w-5 h-5 text-burgundy opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>

            {/* Regular Fit Option */}
            <button
              onClick={() => handleFitSelection('Regular Fit')}
              className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-burgundy transition-colors text-left group"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    Regular Fit 
                    <span className="text-xs text-gray-500 font-normal">Classic & Versatile</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✓ Recommended</span>
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Traditional fit with comfortable room through chest and waist
                  </p>
                </div>
                <CheckCircle className="w-5 h-5 text-burgundy opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>

            {/* Relaxed Fit Option */}
            <button
              onClick={() => handleFitSelection('Relaxed Fit')}
              className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-burgundy transition-colors text-left group"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    Relaxed Fit 
                    <span className="text-xs text-gray-500 font-normal">Comfort First</span>
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Extra room for maximum comfort and ease of movement
                  </p>
                </div>
                <CheckCircle className="w-5 h-5 text-burgundy opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          </div>

          {/* Not Sure Option */}
          <button
            onClick={() => handleFitSelection('Regular Fit')}
            className="w-full py-3 text-burgundy hover:text-burgundy-700 transition-colors flex items-center justify-center gap-2"
          >
            <Info className="w-4 h-4" />
            <span className="text-sm">Not sure which to choose? We recommend Regular Fit</span>
          </button>

          {/* Back to Chat Link */}
          <button
            onClick={() => {
              setShowFitPreference(false);
              setMessages([{
                id: '1',
                text: "Hi! I'm your AI Size Assistant. How can I help you find your perfect fit today?",
                sender: 'assistant',
                timestamp: new Date()
              }]);
            }}
            className="w-full py-2 text-gray-500 hover:text-gray-700 text-sm"
          >
            Skip to chat →
          </button>
        </div>
      ) : showSizeCalculator ? (
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <button
              onClick={() => setShowSizeCalculator(false)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to chat
            </button>
            <ModernSizeBot
              productType={productType}
              onSizeSelected={handleSizeCalculatorResult}
              onClose={() => setShowSizeCalculator(false)}
              isModal={false}
              compact={true}
            />
          </div>
        </div>
      ) : (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-burgundy text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.sender === 'assistant' && (
                    <div className="flex items-center gap-2 mb-1">
                      <Bot className="w-4 h-4" />
                      <span className="text-xs font-medium">Size Assistant</span>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Back to Fit Preference Button */}
            {selectedFit && messages.length > 0 && (
              <button
                onClick={() => {
                  setShowFitPreference(true);
                  setMessages([]);
                  setSelectedFit(null);
                }}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Change fit preference ({selectedFit})
              </button>
            )}
            
            {/* Quick Actions - shown after initial message */}
            {messages.length <= 2 && (
              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  onClick={() => setShowSizeCalculator(true)}
                  className="px-4 py-2 bg-burgundy text-white rounded-full text-sm hover:bg-burgundy-700 transition-colors flex items-center gap-2"
                >
                  <Calculator className="w-4 h-4" />
                  Use AI Size Calculator
                </button>
                <button
                  onClick={() => {
                    setInput("Tell me about alterations");
                    handleSend();
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  Alteration Services
                </button>
                <button
                  onClick={() => {
                    setInput("What's the return policy?");
                    handleSend();
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  Returns & Exchanges
                </button>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about sizing, fit, or alterations..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy"
              />
              <button
                onClick={handleSend}
                className="px-4 py-2 bg-burgundy text-white rounded-lg hover:bg-burgundy-700 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Powered by Atelier AI
            </p>
          </div>
        </>
      )}
    </motion.div>
  );
}
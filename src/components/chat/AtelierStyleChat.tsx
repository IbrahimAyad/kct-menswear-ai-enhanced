"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Send, 
  Sparkles, 
  Camera,
  Mic,
  MicOff,
  Loader2,
  ChevronDown,
  User,
  Bot,
  Heart,
  ShoppingCart,
  ArrowRight
} from "lucide-react";
import Image from "next/image";
import { AtelierAIService } from "@/services/atelier-ai-service";
import { KnowledgeChatService } from "@/services/knowledge-chat-service";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  products?: any[];
  suggestions?: string[];
  isTyping?: boolean;
  images?: string[];
}

interface AtelierStyleChatProps {
  onClose: () => void;
  initialMessage?: string;
  context?: any;
}

export function AtelierStyleChat({ onClose, initialMessage, context }: AtelierStyleChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showProducts, setShowProducts] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  
  const atelierService = useRef(new AtelierAIService());
  const knowledgeService = useRef(new KnowledgeChatService());

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat session
  useEffect(() => {
    const initSession = async () => {
      if (!sessionStarted) {
        setSessionStarted(true);
        setIsLoading(true);
        
        try {
          const response = await atelierService.current.startConversation();
          
          const welcomeMessage: Message = {
            id: Date.now().toString(),
            text: response.message || "Welcome to Atelier AI, your personal luxury menswear stylist. I embody the Sterling Crown philosophy - where luxury is a mindset, not just a price tag. How may I elevate your style today?",
            sender: 'bot',
            timestamp: new Date(),
            suggestions: response.suggestions || [
              "Find my perfect suit",
              "Wedding styling advice",
              "Business attire guide",
              "Seasonal recommendations"
            ]
          };
          
          setMessages([welcomeMessage]);
          
          // If there's an initial message, send it automatically
          if (initialMessage) {
            setTimeout(() => {
              handleSendMessage(initialMessage);
            }, 1000);
          }
        } catch (error) {
          console.error('Failed to start session:', error);
          // Fallback welcome message
          setMessages([{
            id: Date.now().toString(),
            text: "Welcome! I'm your personal Atelier stylist. How can I help you look your absolute best today?",
            sender: 'bot',
            timestamp: new Date(),
            suggestions: ["Browse suits", "Get style advice", "Find wedding attire", "Trending now"]
          }]);
        } finally {
          setIsLoading(false);
        }
      }
    };

    initSession();
  }, [initialMessage, sessionStarted]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        
        setInputText(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText && !selectedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText || "📷 Image shared",
      sender: 'user',
      timestamp: new Date(),
      images: selectedImage ? [URL.createObjectURL(selectedImage)] : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    // Add typing indicator
    const typingMessage: Message = {
      id: 'typing',
      text: '',
      sender: 'bot',
      timestamp: new Date(),
      isTyping: true
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      // Use knowledge service for comprehensive responses
      const response = await knowledgeService.current.processMessage(
        messageText,
        selectedImage || undefined,
        context
      );

      // Remove typing indicator
      setMessages(prev => prev.filter(m => m.id !== 'typing'));

      // Add bot response
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message,
        sender: 'bot',
        timestamp: new Date(),
        products: response.products,
        suggestions: response.suggestions
      };

      setMessages(prev => [...prev, botMessage]);

      // If there are products, show them
      if (response.products && response.products.length > 0) {
        setShowProducts(true);
      }

      // Clear selected image after sending
      setSelectedImage(null);

    } catch (error) {
      console.error('Failed to send message:', error);
      
      // Remove typing indicator
      setMessages(prev => prev.filter(m => m.id !== 'typing'));
      
      // Add error message
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm having trouble connecting right now. Let me provide some general style guidance. What specific aspect of menswear can I help you with?",
        sender: 'bot',
        timestamp: new Date(),
        suggestions: ["Suit selection", "Color matching", "Occasion dressing", "Size guide"]
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
    handleSendMessage(suggestion);
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="fixed bottom-24 right-6 z-40 w-[400px] h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-burgundy via-burgundy-600 to-purple-700 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-burgundy" />
          </div>
          <div>
            <h3 className="font-semibold">Atelier AI Stylist</h3>
            <p className="text-xs text-white/80">Sterling Crown Experience</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-white/20 p-1 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
          >
            <div className={`flex items-start gap-2 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.sender === 'user' ? 'bg-gray-200' : 'bg-gradient-to-br from-burgundy to-purple-600 text-white'
              }`}>
                {message.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>

              {/* Message bubble */}
              <div className={`max-w-[75%] ${message.sender === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
                {message.isTyping ? (
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.sender === 'user' 
                        ? 'bg-burgundy text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      
                      {/* Display images if any */}
                      {message.images && message.images.length > 0 && (
                        <div className="mt-2">
                          {message.images.map((img, idx) => (
                            <img 
                              key={idx}
                              src={img} 
                              alt="Shared" 
                              className="rounded-lg max-w-full h-auto mt-2"
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {message.suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors text-gray-700"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Products */}
                    {message.products && message.products.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.products.slice(0, 3).map((product, idx) => (
                          <div key={idx} className="bg-white rounded-lg border border-gray-200 p-3 flex gap-3">
                            <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                              {product.image ? (
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-md" />
                              ) : (
                                <ShoppingCart className="w-6 h-6 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
                              <p className="text-xs text-gray-500">{product.category}</p>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-sm font-bold text-burgundy">${product.price}</span>
                                <button className="text-xs text-burgundy hover:underline">View →</button>
                              </div>
                            </div>
                          </div>
                        ))}
                        {message.products.length > 3 && (
                          <button 
                            onClick={() => setShowProducts(true)}
                            className="w-full text-center text-xs text-burgundy hover:underline py-1"
                          >
                            View all {message.products.length} products →
                          </button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Selected Image Preview */}
      {selectedImage && (
        <div className="px-4 py-2 bg-gray-50 border-t">
          <div className="flex items-center gap-2">
            <img 
              src={URL.createObjectURL(selectedImage)} 
              alt="Selected" 
              className="w-12 h-12 object-cover rounded"
            />
            <span className="text-xs text-gray-600 flex-1">Image ready to send</span>
            <button
              onClick={() => setSelectedImage(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t bg-white">
        <div className="flex gap-2">
          {/* Image Upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-burgundy transition-colors"
            title="Upload image"
          >
            <Camera className="w-5 h-5" />
          </button>

          {/* Voice Input */}
          <button
            onClick={toggleVoiceInput}
            className={`p-2 transition-colors ${
              isListening ? 'text-red-500 animate-pulse' : 'text-gray-500 hover:text-burgundy'
            }`}
            title={isListening ? "Stop listening" : "Voice input"}
          >
            {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about style, colors, occasions..."
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy text-sm"
            disabled={isLoading}
          />

          {/* Send Button */}
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || (!inputText.trim() && !selectedImage)}
            className={`p-2 rounded-lg transition-colors ${
              isLoading || (!inputText.trim() && !selectedImage)
                ? 'bg-gray-100 text-gray-400'
                : 'bg-burgundy text-white hover:bg-burgundy-600'
            }`}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
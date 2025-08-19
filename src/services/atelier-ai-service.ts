import axios from 'axios';
import { ATELIER_EXPERTISE, generateAtelierResponse, assessAtelierConfidence } from '@/lib/ai/atelier-fashion-expert';
import { ATELIER_ADVANCED_TRAINING, generateAdvancedResponse, assessAdvancedConfidence } from '@/lib/ai/atelier-advanced-training';
import { CONVERSATIONAL_AI, ConversationFlow, buildConversationalResponse } from '@/lib/ai/atelier-conversational';
import { SHORT_QUERY_AI, analyzeShortQuery, generateShortQueryResponse, buildFollowUpResponse } from '@/lib/ai/atelier-short-query-handler';
import { getConversationalResponse } from '@/lib/ai/knowledge-base';

interface ConversationStartResponse {
  sessionId: string;
  framework: string;
  message: string;
  suggestions?: string[];
  confidence?: number;
}

interface MessageResponse {
  message: string;
  suggestions?: string[];
  products?: any[];
  layerLevel?: 1 | 2 | 3;
  intent?: string;
  sentiment?: number;
  nextBestActions?: string[];
  confidence?: number;
  styleProfile?: StyleProfile;
}

interface StyleProfile {
  style: string;
  colors: string[];
  occasions: string[];
  preferences: {
    fit: string;
    formality: string;
    budget: string;
  };
}

interface CustomerIntelligence {
  segmentation: {
    primarySegment: string;
    characteristics: string[];
    dynamicPersona: any;
  };
  salesOptimization: {
    pricing?: any;
    bundles?: any[];
    crossSell?: any[];
  };
  predictions: {
    purchaseProbability?: number;
    lifetimeValue?: number;
    churnRisk?: number;
  };
}

export class AtelierAIService {
  private apiUrl: string;
  private apiKey: string;
  private sessionId: string | null = null;
  private ws: WebSocket | null = null;
  private chatEnabled: boolean;
  private conversationHistory: Array<{ role: string; content: string }> = [];
  private userStyleProfile: Partial<StyleProfile> = {};
  private confidenceLevel: number = 91; // From our assessment
  private conversationFlow: ConversationFlow;

  constructor() {
    // Updated Railway deployment URLs
    this.apiUrl = process.env.NEXT_PUBLIC_KCT_API_URL || 'https://kct-knowledge-api-2-production.up.railway.app';
    this.apiKey = process.env.NEXT_PUBLIC_KCT_API_KEY || '';
    this.chatEnabled = process.env.NEXT_PUBLIC_KCT_CHAT_ENABLED === 'true';
    
    // Initialize confidence level with advanced training
    const advancedAssessment = assessAdvancedConfidence();
    this.confidenceLevel = advancedAssessment.overall;
    
    // Initialize conversation flow manager
    this.conversationFlow = new ConversationFlow();
  }

  async startConversation(customerId?: string): Promise<ConversationStartResponse> {
    try {
      const response = await axios.post(
        `${this.apiUrl}/api/v3/chat/conversation/start`,
        { 
          customerId,
          channel: 'web',
          metadata: {
            userAgent: navigator.userAgent,
            referrer: document.referrer,
            currentPage: window.location.pathname
          }
        },
        { 
          headers: { 
            'X-API-Key': this.apiKey,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      this.sessionId = response.data.sessionId;
      return response.data;
    } catch (error) {
      console.error('Failed to start conversation:', error);
      // Fallback response with advanced confidence
      const confidence = assessAdvancedConfidence();
      return {
        sessionId: `local-${Date.now()}`,
        framework: 'atelierAI',
        message: `Welcome to Atelier AI, your personal luxury menswear consultant. With ${confidence.overall}% confidence in fashion expertise, I embody the Sterling Crown philosophy - where luxury is a mindset, not just a price tag. How may I elevate your style today?`,
        suggestions: ["Find my perfect suit", "Wedding styling", "Business attire guide", "Seasonal recommendations"],
        confidence: confidence.overall
      };
    }
  }

  async sendMessage(message: string, images?: string[]): Promise<MessageResponse> {
    if (!this.sessionId) {
      await this.startConversation();
    }

    // Add to conversation history and track flow
    this.conversationHistory.push({ role: 'user', content: message });
    this.conversationFlow.trackMessage();

    // Check if it's a short query (2-7 words)
    const wordCount = message.trim().split(/\s+/).length;
    if (wordCount >= 2 && wordCount <= 7) {
      // Analyze short query for intent
      const queryIntent = analyzeShortQuery(message);
      
      // If confidence is high, use specialized short query handler
      if (queryIntent.confidence >= 80) {
        const shortResponse = generateShortQueryResponse(queryIntent);
        const followUp = buildFollowUpResponse(message, queryIntent, this.userStyleProfile);
        
        // Combine response with follow-up
        const fullResponse = `${shortResponse.response}\n\n${followUp}`;
        
        // Make it conversational
        const conversationalResponse = CONVERSATIONAL_AI.makeNatural(fullResponse);
        
        this.conversationHistory.push({ role: 'assistant', content: conversationalResponse });
        
        return {
          message: conversationalResponse,
          suggestions: queryIntent.suggestedFollowUps,
          confidence: queryIntent.confidence,
          intent: queryIntent.intent,
          styleProfile: this.userStyleProfile as StyleProfile,
          layerLevel: shortResponse.clarificationNeeded ? 1 : 2
        };
      }
    }

    // Get conversation style based on flow
    const conversationStyle = this.conversationFlow.getResponseStyle();

    // First check our advanced training for highest confidence responses
    const advancedResponse = generateAdvancedResponse(message);
    
    // Then check our expert knowledge base
    const expertResponse = generateAtelierResponse(message);
    
    // Use the higher confidence response
    let bestResponse = advancedResponse.confidence > expertResponse.confidence ? 
      { ...expertResponse, ...advancedResponse } : expertResponse;
    
    // Make the response conversational based on style
    if (bestResponse.response) {
      bestResponse.response = buildConversationalResponse(
        message,
        conversationStyle,
        this.userStyleProfile
      ) || CONVERSATIONAL_AI.makeNatural(
        CONVERSATIONAL_AI.adjustResponseLength(
          bestResponse.response,
          conversationStyle.length
        )
      );
    }
    
    // Analyze for style preferences
    const styleInsights = this.analyzeStylePreferences(message);
    if (styleInsights) {
      this.updateStyleProfile(styleInsights);
    }

    try {
      const response = await axios.post(
        `${this.apiUrl}/api/v3/chat/conversation/message`,
        { 
          sessionId: this.sessionId, 
          message,
          images,
          timestamp: new Date().toISOString()
        },
        { 
          headers: { 
            'X-API-Key': this.apiKey,
            'Content-Type': 'application/json'
          } 
        }
      );

      // Add to history
      this.conversationHistory.push({ role: 'assistant', content: response.data.message });
      
      // Enhance response with confidence and style profile
      return {
        ...response.data,
        confidence: bestResponse.confidence || this.confidenceLevel,
        styleProfile: this.userStyleProfile as StyleProfile
      };
    } catch (error) {
      console.error('Failed to send message:', error);
      
      // Use best available knowledge base for fallback
      if (bestResponse.confidence >= 85) {
        this.conversationHistory.push({ role: 'assistant', content: bestResponse.response });
        return {
          message: bestResponse.response,
          suggestions: bestResponse.suggestions || [],
          confidence: bestResponse.confidence,
          styleProfile: this.userStyleProfile as StyleProfile,
          layerLevel: 2
        };
      }
      
      // Otherwise use enhanced fallback
      return this.generateEnhancedFallbackResponse(message, bestResponse);
    }
  }

  private analyzeStylePreferences(message: string): Partial<StyleProfile> | null {
    const lowerMessage = message.toLowerCase();
    const insights: Partial<StyleProfile> = {};

    // Detect style preferences
    if (lowerMessage.includes('classic') || lowerMessage.includes('traditional')) {
      insights.style = 'Classic Gentleman';
    } else if (lowerMessage.includes('modern') || lowerMessage.includes('contemporary')) {
      insights.style = 'Modern Professional';
    } else if (lowerMessage.includes('fashion') || lowerMessage.includes('trendy')) {
      insights.style = 'Fashion Forward';
    } else if (lowerMessage.includes('luxury') || lowerMessage.includes('premium')) {
      insights.style = 'Understated Luxury';
    }

    // Detect color preferences
    const colors = ['navy', 'charcoal', 'black', 'brown', 'burgundy', 'gray', 'blue'];
    const mentionedColors = colors.filter(color => lowerMessage.includes(color));
    if (mentionedColors.length > 0) {
      insights.colors = mentionedColors;
    }

    // Detect occasions
    const occasions = ['wedding', 'business', 'interview', 'date', 'party', 'formal', 'casual'];
    const mentionedOccasions = occasions.filter(occ => lowerMessage.includes(occ));
    if (mentionedOccasions.length > 0) {
      insights.occasions = mentionedOccasions;
    }

    return Object.keys(insights).length > 0 ? insights : null;
  }

  private updateStyleProfile(insights: Partial<StyleProfile>): void {
    this.userStyleProfile = {
      ...this.userStyleProfile,
      ...insights,
      colors: [...(this.userStyleProfile.colors || []), ...(insights.colors || [])],
      occasions: [...(this.userStyleProfile.occasions || []), ...(insights.occasions || [])]
    };
  }

  async getCustomerIntelligence(customerId: string): Promise<CustomerIntelligence | null> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/api/v1/integration/customer-intelligence/${customerId}`,
        { 
          headers: { 
            'X-API-Key': this.apiKey 
          } 
        }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to get customer intelligence:', error);
      return null;
    }
  }

  connectWebSocket(onMessage: (data: any) => void): WebSocket | null {
    try {
      const wsUrl = this.apiUrl.replace('http', 'ws').replace('https', 'wss');
      this.ws = new WebSocket(`${wsUrl}/ws`);
      
      this.ws.onopen = () => {
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.ws.onclose = () => {
      };

      return this.ws;
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      return null;
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.sessionId = null;
  }

  private generateEnhancedFallbackResponse(message: string, expertResponse: any): MessageResponse {
    const lowerMessage = message.toLowerCase();
    
    // Use expert knowledge if confidence is moderate
    if (expertResponse.confidence >= 70) {
      return {
        message: expertResponse.response,
        suggestions: expertResponse.suggestions,
        confidence: expertResponse.confidence,
        styleProfile: this.userStyleProfile as StyleProfile,
        layerLevel: 2
      };
    }
    
    // Use conversational patterns
    const conversationalResponse = getConversationalResponse(message);
    
    // Wedding response with expertise
    if (lowerMessage.includes('wedding')) {
      const weddingExpertise = ATELIER_EXPERTISE.OCCASION_EXPERTISE.responses.wedding_guest_attire;
      return {
        message: weddingExpertise.answer + "\n\n💡 " + ATELIER_EXPERTISE.STERLING_CROWN_PHILOSOPHY.core_belief,
        suggestions: weddingExpertise.suggestions,
        confidence: weddingExpertise.confidence,
        styleProfile: this.userStyleProfile as StyleProfile,
        products: [],
        layerLevel: 1
      };
    }
    
    // Color advice with expertise
    if (lowerMessage.includes('color') || lowerMessage.includes('match')) {
      const colorExpertise = ATELIER_EXPERTISE.COLOR_EXPERTISE.responses.power_color_psychology;
      return {
        message: colorExpertise.answer,
        suggestions: colorExpertise.suggestions,
        confidence: colorExpertise.confidence,
        styleProfile: this.userStyleProfile as StyleProfile,
        layerLevel: 1
      };
    }
    
    // Fit advice with expertise
    if (lowerMessage.includes('fit') || lowerMessage.includes('size')) {
      const fitExpertise = ATELIER_EXPERTISE.FIT_EXPERTISE.responses.perfect_jacket_fit;
      return {
        message: fitExpertise.answer,
        suggestions: fitExpertise.suggestions,
        confidence: fitExpertise.confidence,
        styleProfile: this.userStyleProfile as StyleProfile,
        layerLevel: 2
      };
    }
    
    // Default with conversational response
    return {
      message: conversationalResponse.response + "\n\n" + ATELIER_EXPERTISE.STERLING_CROWN_PHILOSOPHY.principles[Math.floor(Math.random() * ATELIER_EXPERTISE.STERLING_CROWN_PHILOSOPHY.principles.length)],
      suggestions: conversationalResponse.suggestions,
      confidence: 75,
      styleProfile: this.userStyleProfile as StyleProfile,
      layerLevel: 1
    };
  }

  // Add method to get confidence assessment
  getConfidenceAssessment(): any {
    return assessAdvancedConfidence();
  }

  // Add method to get style recommendation
  async getStyleRecommendation(): Promise<MessageResponse> {
    const profile = this.userStyleProfile;
    
    if (!profile.style) {
      return {
        message: "Let's discover your style personality first. Are you more classic and timeless, or modern and fashion-forward?",
        suggestions: [
          "Classic gentleman",
          "Modern professional", 
          "Fashion forward",
          "Understated luxury"
        ],
        confidence: 90,
        layerLevel: 1
      };
    }

    // Generate personalized recommendation based on profile
    const recommendation = ATELIER_EXPERTISE.STERLING_CROWN_PHILOSOPHY.signature_advice[
      profile.style === 'Classic Gentleman' ? 'first_timer' :
      profile.style === 'Modern Professional' ? 'upgrade_seeker' :
      profile.style === 'Fashion Forward' ? 'style_explorer' :
      'investment_dresser'
    ];

    return {
      message: `Based on your ${profile.style} aesthetic: ${recommendation}\n\nYour color palette includes ${profile.colors?.join(', ') || 'versatile neutrals'}. Perfect for ${profile.occasions?.join(', ') || 'any occasion'}.`,
      confidence: 92,
      suggestions: [
        "Show me matching products",
        "Refine my style",
        "Different occasion",
        "Color alternatives"
      ],
      styleProfile: profile as StyleProfile,
      layerLevel: 2
    };
  }
}

// Singleton instance
export const atelierAIService = new AtelierAIService();
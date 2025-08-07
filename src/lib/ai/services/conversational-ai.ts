import type { ConversationContext, AIResponse } from '../types'

export class ConversationalAI {
  async processMessage(message: string, context: ConversationContext): Promise<AIResponse> {
    // This will be implemented later
    return {
      message: "I'm the Atelier AI assistant. This feature is coming soon!",
      intent: 'general-question',
      confidence: 1,
      suggestedActions: [],
      productRecommendations: []
    }
  }
}
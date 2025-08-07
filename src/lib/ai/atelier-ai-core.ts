import { OutfitRecommendationEngine } from './engines/outfit-recommendation'
import { SizePredictionService } from './services/size-prediction'
import { StyleAnalysisService } from './services/style-analysis'
import { ConversationalAI } from './services/conversational-ai'
import type { 
  RecommendationContext, 
  OutfitRecommendation,
  SizeRecommendation,
  StyleAnalysis,
  ConversationContext,
  AIResponse,
  UserProfile
} from './types'

export class AtelierAICore {
  private static instance: AtelierAICore
  private outfitEngine: OutfitRecommendationEngine
  private sizePredictor: SizePredictionService
  private styleAnalyzer: StyleAnalysisService
  private conversationAI: ConversationalAI

  private constructor() {
    this.outfitEngine = new OutfitRecommendationEngine()
    this.sizePredictor = new SizePredictionService()
    this.styleAnalyzer = new StyleAnalysisService()
    this.conversationAI = new ConversationalAI()
  }

  static getInstance(): AtelierAICore {
    if (!AtelierAICore.instance) {
      AtelierAICore.instance = new AtelierAICore()
    }
    return AtelierAICore.instance
  }

  // Outfit Recommendations
  async generateOutfitRecommendations(
    context: RecommendationContext,
    userProfile?: UserProfile
  ): Promise<OutfitRecommendation[]> {
    try {
      // Enhance context with user profile if available
      const enhancedContext = userProfile 
        ? this.enhanceContextWithProfile(context, userProfile)
        : context

      // Generate recommendations
      const recommendations = await this.outfitEngine.generateRecommendations(enhancedContext)

      // Sort by confidence and relevance
      return recommendations.sort((a, b) => {
        const scoreA = a.confidence * a.occasionFit * a.visualHarmony
        const scoreB = b.confidence * b.occasionFit * b.visualHarmony
        return scoreB - scoreA
      }).slice(0, 5) // Return top 5 recommendations
    } catch (error) {
      console.error('Error generating outfit recommendations:', error)
      throw new Error('Failed to generate outfit recommendations')
    }
  }

  // Size Predictions
  async predictSize(
    userId: string, 
    productId: string,
    measurements?: any
  ): Promise<SizeRecommendation> {
    try {
      return await this.sizePredictor.predictSize(userId, productId, measurements)
    } catch (error) {
      console.error('Error predicting size:', error)
      throw new Error('Failed to predict size')
    }
  }

  // Style Analysis
  async analyzeStyle(imageFile: File): Promise<StyleAnalysis> {
    try {
      return await this.styleAnalyzer.analyzeImage(imageFile)
    } catch (error) {
      console.error('Error analyzing style:', error)
      throw new Error('Failed to analyze style')
    }
  }

  async findSimilarProducts(analysis: StyleAnalysis): Promise<any> {
    try {
      return await this.styleAnalyzer.findSimilarProducts(analysis)
    } catch (error) {
      console.error('Error finding similar products:', error)
      throw new Error('Failed to find similar products')
    }
  }

  // Conversational AI
  async processConversation(
    message: string, 
    context: ConversationContext
  ): Promise<AIResponse> {
    try {
      return await this.conversationAI.processMessage(message, context)
    } catch (error) {
      console.error('Error processing conversation:', error)
      throw new Error('Failed to process conversation')
    }
  }

  // Helper Methods
  private enhanceContextWithProfile(
    context: RecommendationContext,
    profile: UserProfile
  ): RecommendationContext {
    return {
      ...context,
      personalStyle: profile.styleProfile,
      preferences: {
        ...context.preferences,
        ...profile.preferences
      },
      bodyType: context.bodyType || this.inferBodyType(profile.measurements)
    }
  }

  private inferBodyType(measurements?: any): any {
    // Simple body type inference logic
    if (!measurements) return 'regular'
    
    const { chest, waist } = measurements
    const ratio = chest / waist

    if (ratio > 1.4) return 'athletic'
    if (ratio < 1.1) return 'regular'
    return 'slim'
  }

  // Analytics and Learning
  async recordFeedback(
    recommendationId: string,
    feedback: {
      purchased: boolean
      rating?: number
      fitFeedback?: any
      notes?: string
    }
  ): Promise<void> {
    // Record feedback for continuous improvement
    console.log('Recording feedback:', { recommendationId, feedback })
    // Implementation would store in database
  }

  // Batch Operations
  async generateMultipleOutfits(
    occasions: Array<{ occasion: any; date: Date }>,
    userProfile: UserProfile
  ): Promise<Map<string, OutfitRecommendation[]>> {
    const results = new Map<string, OutfitRecommendation[]>()
    
    for (const { occasion, date } of occasions) {
      const context: RecommendationContext = {
        occasion,
        season: this.getSeasonForDate(date),
        budget: userProfile.preferences.budget || { min: 0, max: 1000, preferred: 500 },
        personalStyle: userProfile.styleProfile,
        bodyType: this.inferBodyType(userProfile.measurements),
        preferences: userProfile.preferences,
        eventDate: date
      }
      
      const recommendations = await this.generateOutfitRecommendations(context, userProfile)
      results.set(occasion, recommendations)
    }
    
    return results
  }

  private getSeasonForDate(date: Date): 'spring' | 'summer' | 'fall' | 'winter' {
    const month = date.getMonth()
    if (month >= 2 && month <= 4) return 'spring'
    if (month >= 5 && month <= 7) return 'summer'
    if (month >= 8 && month <= 10) return 'fall'
    return 'winter'
  }
}
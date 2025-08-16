// Mega Conversation Trainer - Runs 5-exchange conversations on ALL 1000+ scenarios
// Tests the entire AI system's ability to handle complete conversations

import { contextAwareSelector } from './context-aware-selector'
import { TRAINING_QUESTIONS } from './training-questions'
import { ADVANCED_SCENARIOS } from './advanced-training'
import { EXTENDED_TRAINING_SCENARIOS } from './training-extended'
import { MEGA_EXTENDED_SCENARIOS } from './training-mega-extended'

export interface ConversationResult {
  scenarioId: string
  category: string
  initialMessage: string
  exchanges: Array<{
    customerMessage: string
    aiResponse: string
    wordCount: number
  }>
  successful: boolean
  exchangeCount: number
  resolutionType: 'purchase' | 'appointment' | 'information' | 'referral' | 'unresolved'
  customerSatisfaction: number // 1-5
  totalResponseTime: number
}

export interface TrainingReport {
  totalScenarios: number
  totalConversations: number
  successfulConversations: number
  averageExchanges: number
  successRate: number
  categoryPerformance: Map<string, {
    total: number
    successful: number
    avgExchanges: number
    avgSatisfaction: number
  }>
  commonPatterns: string[]
  areasForImprovement: string[]
  bestPerformingCategories: string[]
  worstPerformingCategories: string[]
}

export class MegaConversationTrainer {
  private results: ConversationResult[] = []
  private sessionId = `mega_training_${Date.now()}`
  
  // Generate realistic customer follow-ups based on context
  private generateNextCustomerMessage(
    aiResponse: string,
    exchangeNumber: number,
    category: string,
    previousMessages: string[]
  ): string {
    // Category-specific follow-up patterns
    const categoryPatterns: Record<string, string[][]> = {
      wedding: [
        ["what's the timeline?", "how much total?", "include everything?", "what colors best?"],
        ["can alter in time?", "groomsmen too?", "matching available?", "rush possible?"],
        ["fits my budget?", "payment plans?", "group discount?", "deposits required?"],
        ["when can fit?", "appointment needed?", "bring anything?", "how long takes?"],
        ["perfect thank you!", "I'll book it", "sounds great!", "see you tomorrow"]
      ],
      prom: [
        ["how much cost?", "rentals available?", "trending styles?", "what's popular?"],
        ["my size available?", "can try on?", "slim fit?", "color options?"],
        ["includes shoes?", "matching friends?", "accessories included?", "bow tie options?"],
        ["when pickup?", "alterations free?", "damage insurance?", "return when?"],
        ["that works perfectly", "booking now thanks", "I'll take it", "mom will call"]
      ],
      business: [
        ["professional enough?", "interview appropriate?", "too formal?", "industry standard?"],
        ["need how many?", "mix and match?", "versatile pieces?", "travel friendly?"],
        ["wrinkle resistant?", "care instructions?", "dry clean only?", "machine washable?"],
        ["build slowly?", "essentials first?", "priority items?", "phase approach?"],
        ["makes sense thanks", "I'll start there", "good advice", "ordering those"]
      ],
      sizing: [
        ["I'm 6'2 200lbs", "42 chest usually", "between sizes often", "athletic build"],
        ["room for movement?", "shrink at all?", "true to size?", "runs small?"],
        ["free alterations?", "hem included?", "waist adjusted?", "sleeve length?"],
        ["measure at home?", "size chart accurate?", "exchange policy?", "fit guarantee?"],
        ["that helps thanks", "I'll measure first", "booking fitting", "confident now"]
      ],
      style: [
        ["what's trending?", "classic or modern?", "age appropriate?", "too young looking?"],
        ["colors for me?", "skin tone matters?", "seasonal colors?", "versatile shades?"],
        ["accessories needed?", "shoes to match?", "belt included?", "complete look?"],
        ["dress code okay?", "too casual?", "overdressed maybe?", "appropriate for?"],
        ["exactly what needed", "great suggestions", "I'll try that", "much clearer now"]
      ],
      budget: [
        ["cheapest option?", "under 300 possible?", "payment plans?", "sales coming?"],
        ["quality at price?", "worth the cost?", "last how long?", "good value?"],
        ["hidden fees?", "alterations extra?", "total cost?", "everything included?"],
        ["alternatives available?", "similar cheaper?", "rental instead?", "clearance items?"],
        ["works for me", "I'll save up", "fair price", "let me think"]
      ],
      emergency: [
        ["need by tomorrow!", "today possible?", "rush available?", "express service?"],
        ["in stock now?", "my size available?", "can alter today?", "open late?"],
        ["deliver overnight?", "pickup when?", "ready by 5?", "guaranteed timing?"],
        ["cost for rush?", "emergency fee?", "priority service?", "expedite this?"],
        ["lifesaver thank you!", "heading over now", "you saved me", "perfect timing"]
      ]
    }
    
    // Detect category from previous context
    const detectedCategory = this.detectCategory(category)
    const patterns = categoryPatterns[detectedCategory] || categoryPatterns.style
    
    // Get appropriate pattern for exchange number
    const exchangePatterns = patterns[Math.min(exchangeNumber - 1, patterns.length - 1)]
    
    // Select based on AI response content
    const aiLower = aiResponse.toLowerCase()
    
    // Smart selection based on response content
    if (aiLower.includes('price') || aiLower.includes('$')) {
      return exchangePatterns.find(p => p.includes('cost') || p.includes('much')) || exchangePatterns[0]
    }
    if (aiLower.includes('size') || aiLower.includes('fit')) {
      return exchangePatterns.find(p => p.includes('size') || p.includes('fit')) || exchangePatterns[1]
    }
    if (aiLower.includes('time') || aiLower.includes('when')) {
      return exchangePatterns.find(p => p.includes('when') || p.includes('time')) || exchangePatterns[2]
    }
    
    // Default to appropriate exchange pattern
    return exchangePatterns[Math.floor(Math.random() * exchangePatterns.length)]
  }
  
  // Detect category from scenario
  private detectCategory(category: string): string {
    const categoryMap: Record<string, string> = {
      'wedding': 'wedding',
      'prom': 'prom',
      'career': 'business',
      'professional': 'business',
      'sizing': 'sizing',
      'style': 'style',
      'budget': 'budget',
      'emergency': 'emergency',
      'life_events': 'wedding',
      'emotional': 'style',
      'body_confidence': 'sizing',
      'cultural': 'style',
      'tech_industry': 'business',
      'dating': 'style',
      'medical_professional': 'business'
    }
    
    for (const [key, value] of Object.entries(categoryMap)) {
      if (category.toLowerCase().includes(key)) {
        return value
      }
    }
    
    return 'style' // default
  }
  
  // Run a complete 5-exchange conversation
  async runConversation(
    scenario: any,
    scenarioId: string,
    category: string
  ): Promise<ConversationResult> {
    const startTime = Date.now()
    const result: ConversationResult = {
      scenarioId,
      category,
      initialMessage: scenario.userMessage || scenario,
      exchanges: [],
      successful: false,
      exchangeCount: 0,
      resolutionType: 'unresolved',
      customerSatisfaction: 3,
      totalResponseTime: 0
    }
    
    let currentMessage = result.initialMessage
    const previousMessages: string[] = []
    
    // Run 5 exchanges
    for (let i = 0; i < 5; i++) {
      try {
        // Get AI response
        const aiResponse = contextAwareSelector.selectBestResponse(
          currentMessage,
          `customer_${scenarioId}_${i}`,
          this.sessionId
        )
        
        // Record exchange
        result.exchanges.push({
          customerMessage: currentMessage,
          aiResponse: aiResponse.response,
          wordCount: currentMessage.split(' ').length
        })
        
        previousMessages.push(currentMessage)
        previousMessages.push(aiResponse.response)
        
        // Generate next customer message (except on last exchange)
        if (i < 4) {
          currentMessage = this.generateNextCustomerMessage(
            aiResponse.response,
            i + 2,
            category,
            previousMessages
          )
        }
        
        result.exchangeCount++
      } catch (error) {
        console.error(`Error in exchange ${i + 1} for scenario ${scenarioId}:`, error)
        break
      }
    }
    
    // Determine success and resolution type
    if (result.exchanges.length > 0) {
      const lastCustomerMessage = result.exchanges[result.exchanges.length - 1].customerMessage
      const lastAIResponse = result.exchanges[result.exchanges.length - 1].aiResponse
      
      // Check for successful resolution
      const successIndicators = [
        'thank', 'perfect', 'great', 'I\'ll take', 'sounds good',
        'book', 'order', 'works', 'helps', 'saved'
      ]
      
      result.successful = successIndicators.some(indicator => 
        lastCustomerMessage.toLowerCase().includes(indicator)
      )
      
      // Determine resolution type
      if (lastCustomerMessage.includes('buy') || lastCustomerMessage.includes('take') || lastCustomerMessage.includes('order')) {
        result.resolutionType = 'purchase'
      } else if (lastCustomerMessage.includes('book') || lastCustomerMessage.includes('appointment')) {
        result.resolutionType = 'appointment'
      } else if (lastCustomerMessage.includes('thank') || lastCustomerMessage.includes('helps')) {
        result.resolutionType = 'information'
      } else if (lastCustomerMessage.includes('call') || lastCustomerMessage.includes('later')) {
        result.resolutionType = 'referral'
      }
      
      // Calculate satisfaction
      result.customerSatisfaction = result.successful ? 
        (result.exchangeCount <= 3 ? 5 : 4) : 
        (result.exchangeCount === 5 ? 3 : 2)
    }
    
    result.totalResponseTime = Date.now() - startTime
    
    return result
  }
  
  // Run training on all scenarios
  async runMegaTraining(limit?: number): Promise<TrainingReport> {
    console.log('🚀 Starting Mega Conversation Training...')
    
    // Gather all scenarios
    const allScenarios: Array<{scenario: any, id: string, category: string}> = []
    
    // Add training questions
    Object.entries(TRAINING_QUESTIONS).forEach(([key, value]) => {
      allScenarios.push({
        scenario: { userMessage: value.keywords[0] },
        id: `tq_${key}`,
        category: 'general'
      })
    })
    
    // Add advanced scenarios
    ADVANCED_SCENARIOS.forEach((scenario, idx) => {
      allScenarios.push({
        scenario,
        id: scenario.id || `adv_${idx}`,
        category: scenario.category
      })
    })
    
    // Add extended scenarios
    EXTENDED_TRAINING_SCENARIOS.forEach((scenario, idx) => {
      allScenarios.push({
        scenario,
        id: scenario.id || `ext_${idx}`,
        category: scenario.category
      })
    })
    
    // Add mega extended scenarios
    MEGA_EXTENDED_SCENARIOS.forEach((scenario, idx) => {
      allScenarios.push({
        scenario,
        id: scenario.id || `mega_${idx}`,
        category: scenario.category
      })
    })
    
    // Limit scenarios if specified
    const scenariosToRun = limit ? allScenarios.slice(0, limit) : allScenarios
    
    console.log(`Running ${scenariosToRun.length} conversation simulations...`)
    
    // Run conversations
    for (let i = 0; i < scenariosToRun.length; i++) {
      const { scenario, id, category } = scenariosToRun[i]
      
      if (i % 50 === 0) {
        console.log(`Progress: ${i}/${scenariosToRun.length} conversations completed`)
      }
      
      const result = await this.runConversation(scenario, id, category)
      this.results.push(result)
    }
    
    // Generate report
    return this.generateReport()
  }
  
  // Generate comprehensive training report
  private generateReport(): TrainingReport {
    const report: TrainingReport = {
      totalScenarios: this.results.length,
      totalConversations: this.results.length * 5, // 5 exchanges each
      successfulConversations: this.results.filter(r => r.successful).length,
      averageExchanges: this.results.reduce((sum, r) => sum + r.exchangeCount, 0) / this.results.length,
      successRate: 0,
      categoryPerformance: new Map(),
      commonPatterns: [],
      areasForImprovement: [],
      bestPerformingCategories: [],
      worstPerformingCategories: []
    }
    
    // Calculate success rate
    report.successRate = (report.successfulConversations / report.totalScenarios) * 100
    
    // Analyze by category
    const categoryStats = new Map<string, any>()
    
    this.results.forEach(result => {
      const stats = categoryStats.get(result.category) || {
        total: 0,
        successful: 0,
        totalExchanges: 0,
        totalSatisfaction: 0
      }
      
      stats.total++
      if (result.successful) stats.successful++
      stats.totalExchanges += result.exchangeCount
      stats.totalSatisfaction += result.customerSatisfaction
      
      categoryStats.set(result.category, stats)
    })
    
    // Process category performance
    categoryStats.forEach((stats, category) => {
      report.categoryPerformance.set(category, {
        total: stats.total,
        successful: stats.successful,
        avgExchanges: stats.totalExchanges / stats.total,
        avgSatisfaction: stats.totalSatisfaction / stats.total
      })
    })
    
    // Find best and worst performing categories
    const sortedCategories = Array.from(report.categoryPerformance.entries())
      .sort((a, b) => (b[1].successful / b[1].total) - (a[1].successful / a[1].total))
    
    report.bestPerformingCategories = sortedCategories.slice(0, 5).map(([cat]) => cat)
    report.worstPerformingCategories = sortedCategories.slice(-5).map(([cat]) => cat)
    
    // Identify common patterns
    const resolutionTypes = new Map<string, number>()
    this.results.forEach(r => {
      resolutionTypes.set(r.resolutionType, (resolutionTypes.get(r.resolutionType) || 0) + 1)
    })
    
    report.commonPatterns = [
      `Most common resolution: ${Array.from(resolutionTypes.entries()).sort((a, b) => b[1] - a[1])[0][0]}`,
      `Average satisfaction: ${(this.results.reduce((sum, r) => sum + r.customerSatisfaction, 0) / this.results.length).toFixed(1)}/5`,
      `Conversations needing all 5 exchanges: ${this.results.filter(r => r.exchangeCount === 5).length}`,
      `Quick resolutions (≤3 exchanges): ${this.results.filter(r => r.exchangeCount <= 3 && r.successful).length}`
    ]
    
    // Identify areas for improvement
    const failedScenarios = this.results.filter(r => !r.successful)
    if (failedScenarios.length > 0) {
      const failureCategories = new Map<string, number>()
      failedScenarios.forEach(r => {
        failureCategories.set(r.category, (failureCategories.get(r.category) || 0) + 1)
      })
      
      report.areasForImprovement = Array.from(failureCategories.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([cat, count]) => `${cat}: ${count} failures`)
    }
    
    return report
  }
  
  // Get results
  getResults(): ConversationResult[] {
    return this.results
  }
  
  // Display report
  displayReport(report: TrainingReport): string {
    let output = '\n' + '='.repeat(70) + '\n'
    output += '📊 MEGA CONVERSATION TRAINING REPORT\n'
    output += '='.repeat(70) + '\n\n'
    
    output += '📈 OVERALL PERFORMANCE:\n'
    output += `  Total Scenarios Tested: ${report.totalScenarios}\n`
    output += `  Total Exchanges: ${report.totalConversations}\n`
    output += `  Successful Conversations: ${report.successfulConversations}\n`
    output += `  Success Rate: ${report.successRate.toFixed(1)}%\n`
    output += `  Average Exchanges: ${report.averageExchanges.toFixed(1)}\n\n`
    
    output += '🏆 BEST PERFORMING CATEGORIES:\n'
    report.bestPerformingCategories.forEach(cat => {
      const perf = report.categoryPerformance.get(cat)
      if (perf) {
        output += `  ${cat}: ${((perf.successful / perf.total) * 100).toFixed(1)}% success\n`
      }
    })
    
    output += '\n⚠️ NEEDS IMPROVEMENT:\n'
    report.worstPerformingCategories.forEach(cat => {
      const perf = report.categoryPerformance.get(cat)
      if (perf) {
        output += `  ${cat}: ${((perf.successful / perf.total) * 100).toFixed(1)}% success\n`
      }
    })
    
    output += '\n📋 COMMON PATTERNS:\n'
    report.commonPatterns.forEach(pattern => {
      output += `  • ${pattern}\n`
    })
    
    if (report.areasForImprovement.length > 0) {
      output += '\n🔧 AREAS FOR IMPROVEMENT:\n'
      report.areasForImprovement.forEach(area => {
        output += `  • ${area}\n`
      })
    }
    
    output += '\n' + '='.repeat(70) + '\n'
    
    return output
  }
}

// Export singleton instance
export const megaTrainer = new MegaConversationTrainer()
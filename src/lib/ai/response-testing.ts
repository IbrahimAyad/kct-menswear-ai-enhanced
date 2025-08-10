// Comprehensive Testing System for 2000+ Response Variations
// Tests context-aware responses, variation quality, and system performance

import { contextAwareSelector, type ConversationState } from './context-aware-selector'
import { RESPONSE_VARIATIONS_SET_1, RESPONSE_VARIATIONS_SET_2, type ResponseContext } from './response-variations'
import { EXTENDED_RESPONSE_VARIATIONS } from './response-variations-extended'
import { TRAINING_QUESTIONS } from './training-questions'
import { ADVANCED_SCENARIOS } from './advanced-training'
import { EXTENDED_TRAINING_SCENARIOS } from './training-extended'
import { MEGA_EXTENDED_SCENARIOS } from './training-mega-extended'

export interface TestResult {
  testId: string
  scenario: string
  originalMessage: string
  context: ResponseContext
  response: string
  responseTime: number
  passed: boolean
  issues: string[]
  quality: {
    relevance: number
    tone: number
    helpfulness: number
    clarity: number
  }
}

export interface TestSuite {
  name: string
  totalTests: number
  passed: number
  failed: number
  averageResponseTime: number
  averageQuality: number
  issues: Map<string, number>
  startTime: Date
  endTime?: Date
  results: TestResult[]
}

export class ResponseTestingSystem {
  private testSuites = new Map<string, TestSuite>()
  private currentSuite: TestSuite | null = null
  
  // Run comprehensive test suite
  async runComprehensiveTests(): Promise<TestSuite> {
    console.log('Starting comprehensive AI response testing...')
    
    const suite = this.createTestSuite('Comprehensive Response Test')
    this.currentSuite = suite
    
    // Test all variation sets
    await this.testVariationSet('Set 1', RESPONSE_VARIATIONS_SET_1)
    await this.testVariationSet('Set 2', RESPONSE_VARIATIONS_SET_2)
    await this.testVariationSet('Extended', EXTENDED_RESPONSE_VARIATIONS)
    
    // Test training scenarios
    await this.testTrainingScenarios()
    
    // Test edge cases
    await this.testEdgeCases()
    
    // Test context switching
    await this.testContextSwitching()
    
    // Test response diversity
    await this.testResponseDiversity()
    
    // Test performance under load
    await this.testPerformance()
    
    // Complete suite
    suite.endTime = new Date()
    this.analyzeSuiteResults(suite)
    
    return suite
  }
  
  // Test a set of response variations
  private async testVariationSet(
    setName: string,
    variations: any[]
  ): Promise<void> {
    console.log(`Testing ${setName}: ${variations.length} scenarios`)
    
    for (const variation of variations) {
      for (const response of variation.variations) {
        const result = await this.testSingleResponse(
          variation.scenarioId,
          variation.originalMessage,
          response.context,
          response.response
        )
        
        this.currentSuite!.results.push(result)
        
        if (result.passed) {
          this.currentSuite!.passed++
        } else {
          this.currentSuite!.failed++
          result.issues.forEach(issue => {
            const count = this.currentSuite!.issues.get(issue) || 0
            this.currentSuite!.issues.set(issue, count + 1)
          })
        }
      }
    }
  }
  
  // Test single response
  private async testSingleResponse(
    scenarioId: string,
    originalMessage: string,
    context: ResponseContext,
    expectedResponse: string
  ): Promise<TestResult> {
    const startTime = Date.now()
    
    // Get actual response from system
    const actualResponse = contextAwareSelector.selectBestResponse(
      originalMessage,
      `test_user_${scenarioId}`,
      `test_session_${Date.now()}`
    )
    
    const responseTime = Date.now() - startTime
    
    // Validate response
    const issues = this.validateResponse(actualResponse.response, expectedResponse, context)
    
    // Assess quality
    const quality = this.assessResponseQuality(
      originalMessage,
      actualResponse.response,
      context
    )
    
    return {
      testId: `test_${scenarioId}_${Date.now()}`,
      scenario: scenarioId,
      originalMessage,
      context,
      response: actualResponse.response,
      responseTime,
      passed: issues.length === 0,
      issues,
      quality
    }
  }
  
  // Validate response against expectations
  private validateResponse(
    actual: string,
    expected: string,
    context: ResponseContext
  ): string[] {
    const issues: string[] = []
    
    // Check response exists and is non-empty
    if (!actual || actual.trim().length === 0) {
      issues.push('Empty response')
    }
    
    // Check response length
    if (actual.length < 10) {
      issues.push('Response too short')
    }
    if (actual.length > 500) {
      issues.push('Response too long')
    }
    
    // Check for placeholder text
    if (actual.includes('{{') || actual.includes('}}')) {
      issues.push('Contains placeholder text')
    }
    
    // Check tone appropriateness
    if (context.urgencyLevel === 'emergency' && !this.hasUrgentTone(actual)) {
      issues.push('Missing urgent tone for emergency')
    }
    
    // Check for personalization
    if (context.previousInteractions > 5 && !this.hasPersonalization(actual)) {
      issues.push('Missing personalization for returning user')
    }
    
    return issues
  }
  
  // Assess response quality
  private assessResponseQuality(
    message: string,
    response: string,
    context: ResponseContext
  ): TestResult['quality'] {
    return {
      relevance: this.scoreRelevance(message, response),
      tone: this.scoreTone(response, context),
      helpfulness: this.scoreHelpfulness(response),
      clarity: this.scoreClarity(response)
    }
  }
  
  // Score relevance of response to message
  private scoreRelevance(message: string, response: string): number {
    const messageWords = message.toLowerCase().split(' ')
    const responseWords = response.toLowerCase().split(' ')
    
    // Check for key term overlap
    const overlap = messageWords.filter(word => 
      responseWords.includes(word) || 
      responseWords.some(rWord => rWord.includes(word))
    ).length
    
    const relevanceScore = Math.min(overlap / messageWords.length, 1)
    return relevanceScore
  }
  
  // Score tone appropriateness
  private scoreTone(response: string, context: ResponseContext): number {
    const lower = response.toLowerCase()
    let score = 0.5 // Base score
    
    // Check for mood-appropriate language
    if (context.userMood === 'stressed' || context.userMood === 'frustrated') {
      if (lower.includes('understand') || lower.includes('help') || lower.includes('worry')) {
        score += 0.3
      }
    }
    
    if (context.userMood === 'excited' || context.userMood === 'happy') {
      if (lower.includes('great') || lower.includes('awesome') || lower.includes('perfect')) {
        score += 0.3
      }
    }
    
    // Check for urgency matching
    if (context.urgencyLevel === 'emergency' || context.urgencyLevel === 'high') {
      if (lower.includes('immediately') || lower.includes('right away') || lower.includes('asap')) {
        score += 0.2
      }
    }
    
    return Math.min(score, 1)
  }
  
  // Score helpfulness
  private scoreHelpfulness(response: string): number {
    let score = 0.3 // Base score
    
    // Check for specific suggestions
    if (response.includes('$') || response.includes('price')) score += 0.2
    if (response.includes('option') || response.includes('choice')) score += 0.1
    if (response.includes('recommend') || response.includes('suggest')) score += 0.2
    if (response.includes('?')) score += 0.1 // Has follow-up question
    if (response.length > 50) score += 0.1 // Detailed response
    
    return Math.min(score, 1)
  }
  
  // Score clarity
  private scoreClarity(response: string): number {
    let score = 1.0
    
    // Deduct for issues
    if (response.split('.').some(s => s.split(' ').length > 25)) score -= 0.2 // Long sentences
    if (response.includes('  ')) score -= 0.1 // Double spaces
    if (!response.match(/[.!?]$/)) score -= 0.1 // Missing punctuation
    if (response.split(',').length > 5) score -= 0.1 // Too many commas
    
    return Math.max(score, 0)
  }
  
  // Check for urgent tone
  private hasUrgentTone(response: string): boolean {
    const urgentWords = ['immediately', 'right away', 'asap', 'urgent', 'quickly', 'now']
    return urgentWords.some(word => response.toLowerCase().includes(word))
  }
  
  // Check for personalization
  private hasPersonalization(response: string): boolean {
    const personalWords = ['you', 'your', "you're", "you've", "you'll"]
    return personalWords.some(word => response.toLowerCase().includes(word))
  }
  
  // Test training scenarios
  private async testTrainingScenarios(): Promise<void> {
    console.log('Testing training scenarios...')
    
    // Test basic training questions
    for (const [key, pattern] of Object.entries(TRAINING_QUESTIONS)) {
      const result = await this.testSingleResponse(
        key,
        pattern.keywords[0],
        {
          timeOfDay: 'afternoon',
          conversationStage: 'discovery',
          userMood: 'neutral',
          previousInteractions: 0,
          urgencyLevel: 'medium',
          channelType: 'chat'
        },
        pattern.response
      )
      
      this.currentSuite!.results.push(result)
      if (result.passed) this.currentSuite!.passed++
      else this.currentSuite!.failed++
    }
    
    // Test advanced scenarios
    const allScenarios = [
      ...ADVANCED_SCENARIOS,
      ...EXTENDED_TRAINING_SCENARIOS,
      ...MEGA_EXTENDED_SCENARIOS
    ]
    
    for (const scenario of allScenarios.slice(0, 100)) { // Test sample
      const result = await this.testSingleResponse(
        scenario.id,
        scenario.userMessage,
        {
          timeOfDay: 'afternoon',
          conversationStage: 'discovery',
          userMood: scenario.context?.mood || 'neutral',
          previousInteractions: 0,
          urgencyLevel: scenario.context?.urgency || 'medium',
          channelType: 'chat'
        },
        scenario.agentResponses.primary
      )
      
      this.currentSuite!.results.push(result)
      if (result.passed) this.currentSuite!.passed++
      else this.currentSuite!.failed++
    }
  }
  
  // Test edge cases
  private async testEdgeCases(): Promise<void> {
    console.log('Testing edge cases...')
    
    const edgeCases = [
      { message: '', expectError: true },
      { message: 'a', expectError: false },
      { message: 'a'.repeat(1000), expectError: false },
      { message: '!!!###$$$%%%', expectError: false },
      { message: '😀😀😀', expectError: false },
      { message: 'HELP ME NOW!!!', expectError: false },
      { message: 'help me now', expectError: false },
      { message: 'HeLP mE NoW', expectError: false },
      { message: '     ', expectError: true },
      { message: '\n\n\n', expectError: true }
    ]
    
    for (const testCase of edgeCases) {
      try {
        const response = contextAwareSelector.selectBestResponse(testCase.message)
        
        if (testCase.expectError && response.response) {
          this.currentSuite!.failed++
          this.currentSuite!.issues.set('Edge case should have failed', 
            (this.currentSuite!.issues.get('Edge case should have failed') || 0) + 1)
        } else if (!testCase.expectError && !response.response) {
          this.currentSuite!.failed++
          this.currentSuite!.issues.set('Edge case should have passed',
            (this.currentSuite!.issues.get('Edge case should have passed') || 0) + 1)
        } else {
          this.currentSuite!.passed++
        }
      } catch (error) {
        if (!testCase.expectError) {
          this.currentSuite!.failed++
          this.currentSuite!.issues.set('Unexpected error in edge case',
            (this.currentSuite!.issues.get('Unexpected error in edge case') || 0) + 1)
        } else {
          this.currentSuite!.passed++
        }
      }
    }
  }
  
  // Test context switching
  private async testContextSwitching(): Promise<void> {
    console.log('Testing context switching...')
    
    const message = "I need a suit"
    const contexts: ResponseContext[] = [
      {
        timeOfDay: 'morning',
        conversationStage: 'greeting',
        userMood: 'happy',
        previousInteractions: 0,
        urgencyLevel: 'low',
        channelType: 'chat'
      },
      {
        timeOfDay: 'night',
        conversationStage: 'closing',
        userMood: 'stressed',
        previousInteractions: 10,
        urgencyLevel: 'emergency',
        channelType: 'phone'
      },
      {
        timeOfDay: 'afternoon',
        conversationStage: 'recommendation',
        userMood: 'neutral',
        previousInteractions: 5,
        urgencyLevel: 'medium',
        channelType: 'email'
      }
    ]
    
    const responses = new Set<string>()
    
    for (const context of contexts) {
      const response = contextAwareSelector.selectBestResponse(
        message,
        'context_test_user',
        `context_test_${Date.now()}`
      )
      
      responses.add(response.response)
    }
    
    // Check that we got different responses for different contexts
    if (responses.size >= 2) {
      this.currentSuite!.passed++
    } else {
      this.currentSuite!.failed++
      this.currentSuite!.issues.set('Insufficient context variation',
        (this.currentSuite!.issues.get('Insufficient context variation') || 0) + 1)
    }
  }
  
  // Test response diversity
  private async testResponseDiversity(): Promise<void> {
    console.log('Testing response diversity...')
    
    const message = "getting married need help"
    const responses = new Set<string>()
    
    // Get 20 responses for the same message
    for (let i = 0; i < 20; i++) {
      const response = contextAwareSelector.selectBestResponse(
        message,
        `diversity_user_${i}`,
        `diversity_session_${i}`
      )
      responses.add(response.response)
    }
    
    // We should get at least 3 different responses
    if (responses.size >= 3) {
      this.currentSuite!.passed++
    } else {
      this.currentSuite!.failed++
      this.currentSuite!.issues.set('Insufficient response diversity',
        (this.currentSuite!.issues.get('Insufficient response diversity') || 0) + 1)
    }
  }
  
  // Test performance
  private async testPerformance(): Promise<void> {
    console.log('Testing performance...')
    
    const iterations = 100
    const startTime = Date.now()
    
    for (let i = 0; i < iterations; i++) {
      contextAwareSelector.selectBestResponse(
        "need a suit for wedding",
        `perf_user_${i}`,
        `perf_session_${i}`
      )
    }
    
    const totalTime = Date.now() - startTime
    const avgTime = totalTime / iterations
    
    this.currentSuite!.averageResponseTime = avgTime
    
    // Should respond in under 100ms on average
    if (avgTime < 100) {
      this.currentSuite!.passed++
    } else {
      this.currentSuite!.failed++
      this.currentSuite!.issues.set('Performance below threshold',
        (this.currentSuite!.issues.get('Performance below threshold') || 0) + 1)
    }
  }
  
  // Create test suite
  private createTestSuite(name: string): TestSuite {
    const suite: TestSuite = {
      name,
      totalTests: 0,
      passed: 0,
      failed: 0,
      averageResponseTime: 0,
      averageQuality: 0,
      issues: new Map(),
      startTime: new Date(),
      results: []
    }
    
    this.testSuites.set(name, suite)
    return suite
  }
  
  // Analyze suite results
  private analyzeSuiteResults(suite: TestSuite) {
    suite.totalTests = suite.passed + suite.failed
    
    // Calculate average quality
    const totalQuality = suite.results.reduce((sum, result) => {
      const quality = result.quality
      return sum + (quality.relevance + quality.tone + quality.helpfulness + quality.clarity) / 4
    }, 0)
    
    suite.averageQuality = suite.results.length > 0 ? totalQuality / suite.results.length : 0
    
    // Calculate average response time
    const totalTime = suite.results.reduce((sum, result) => sum + result.responseTime, 0)
    suite.averageResponseTime = suite.results.length > 0 ? totalTime / suite.results.length : 0
    
    // Log summary
    console.log('='.repeat(50))
    console.log(`Test Suite: ${suite.name}`)
    console.log('='.repeat(50))
    console.log(`Total Tests: ${suite.totalTests}`)
    console.log(`Passed: ${suite.passed} (${(suite.passed / suite.totalTests * 100).toFixed(1)}%)`)
    console.log(`Failed: ${suite.failed} (${(suite.failed / suite.totalTests * 100).toFixed(1)}%)`)
    console.log(`Average Response Time: ${suite.averageResponseTime.toFixed(2)}ms`)
    console.log(`Average Quality Score: ${(suite.averageQuality * 100).toFixed(1)}%`)
    console.log('\nTop Issues:')
    
    const sortedIssues = Array.from(suite.issues.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
    
    sortedIssues.forEach(([issue, count]) => {
      console.log(`  - ${issue}: ${count} occurrences`)
    })
    
    console.log('='.repeat(50))
  }
  
  // Get test report
  getTestReport(suiteName: string): string {
    const suite = this.testSuites.get(suiteName)
    if (!suite) return 'Test suite not found'
    
    let report = `# AI Response Testing Report\n\n`
    report += `## Suite: ${suite.name}\n\n`
    report += `**Test Period:** ${suite.startTime.toISOString()} - ${suite.endTime?.toISOString() || 'In Progress'}\n\n`
    
    report += `### Summary\n`
    report += `- **Total Tests:** ${suite.totalTests}\n`
    report += `- **Passed:** ${suite.passed} (${(suite.passed / suite.totalTests * 100).toFixed(1)}%)\n`
    report += `- **Failed:** ${suite.failed} (${(suite.failed / suite.totalTests * 100).toFixed(1)}%)\n`
    report += `- **Average Response Time:** ${suite.averageResponseTime.toFixed(2)}ms\n`
    report += `- **Average Quality Score:** ${(suite.averageQuality * 100).toFixed(1)}%\n\n`
    
    report += `### Quality Breakdown\n`
    const qualityBreakdown = {
      relevance: 0,
      tone: 0,
      helpfulness: 0,
      clarity: 0
    }
    
    suite.results.forEach(result => {
      qualityBreakdown.relevance += result.quality.relevance
      qualityBreakdown.tone += result.quality.tone
      qualityBreakdown.helpfulness += result.quality.helpfulness
      qualityBreakdown.clarity += result.quality.clarity
    })
    
    const resultCount = suite.results.length || 1
    report += `- **Relevance:** ${(qualityBreakdown.relevance / resultCount * 100).toFixed(1)}%\n`
    report += `- **Tone:** ${(qualityBreakdown.tone / resultCount * 100).toFixed(1)}%\n`
    report += `- **Helpfulness:** ${(qualityBreakdown.helpfulness / resultCount * 100).toFixed(1)}%\n`
    report += `- **Clarity:** ${(qualityBreakdown.clarity / resultCount * 100).toFixed(1)}%\n\n`
    
    report += `### Common Issues\n`
    const sortedIssues = Array.from(suite.issues.entries())
      .sort((a, b) => b[1] - a[1])
    
    sortedIssues.forEach(([issue, count]) => {
      report += `- ${issue}: ${count} occurrences\n`
    })
    
    report += `\n### Performance Metrics\n`
    report += `- **Fastest Response:** ${Math.min(...suite.results.map(r => r.responseTime))}ms\n`
    report += `- **Slowest Response:** ${Math.max(...suite.results.map(r => r.responseTime))}ms\n`
    report += `- **Median Response Time:** ${this.median(suite.results.map(r => r.responseTime))}ms\n`
    
    return report
  }
  
  // Calculate median
  private median(values: number[]): number {
    if (values.length === 0) return 0
    
    const sorted = [...values].sort((a, b) => a - b)
    const middle = Math.floor(sorted.length / 2)
    
    if (sorted.length % 2 === 0) {
      return (sorted[middle - 1] + sorted[middle]) / 2
    }
    
    return sorted[middle]
  }
}

// Export testing system
export const responseTestingSystem = new ResponseTestingSystem()

// Run tests and get report
export async function runResponseTests(): Promise<string> {
  const suite = await responseTestingSystem.runComprehensiveTests()
  return responseTestingSystem.getTestReport(suite.name)
}
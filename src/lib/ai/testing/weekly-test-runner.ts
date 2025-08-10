// Automated Weekly Test Runner System
// Comprehensive testing framework for AI conversation system

import { contextAwareSelector } from '../context-aware-selector'
import { megaTrainer } from '../mega-conversation-trainer'
import { customerSimulator } from '../customer-simulator'

export interface TestResult {
  testId: string
  testType: string
  timestamp: Date
  passed: boolean
  score: number
  details: any
  errors?: string[]
  recommendations?: string[]
}

export interface WeeklyTestReport {
  weekNumber: number
  startDate: Date
  endDate: Date
  totalTests: number
  passedTests: number
  failedTests: number
  overallScore: number
  improvements: string[]
  regressions: string[]
  criticalIssues: string[]
  recommendations: string[]
  historicalComparison: {
    lastWeek: number
    lastMonth: number
    trend: 'improving' | 'declining' | 'stable'
  }
}

export class WeeklyTestRunner {
  private testHistory: Map<string, TestResult[]> = new Map()
  private weeklyReports: WeeklyTestReport[] = []
  private criticalThreshold = 0.85 // Alert if success rate drops below this
  
  // Main test orchestrator
  async runWeeklyTestSuite(): Promise<WeeklyTestReport> {
    console.log('🚀 Starting Weekly AI Test Suite...')
    const startTime = Date.now()
    const results: TestResult[] = []
    
    // Run all test categories
    const testSuites = [
      this.runEdgeCaseTests(),
      this.runPerformanceTests(),
      this.runRegressionTests(),
      this.runRealUserSimulation(),
      this.runSeasonalRelevanceTests(),
      this.runErrorRecoveryTests(),
      this.runContextSwitchingTests(),
      this.runMultilingualTests(),
      this.runAccessibilityTests(),
      this.runSecurityTests()
    ]
    
    // Execute tests in parallel where possible
    const allResults = await Promise.all(testSuites)
    allResults.forEach(suiteResults => results.push(...suiteResults))
    
    // Generate comprehensive report
    const report = this.generateWeeklyReport(results)
    
    // Store results for historical tracking
    this.storeResults(results, report)
    
    // Check for critical issues and send alerts
    await this.checkCriticalIssues(report)
    
    const duration = (Date.now() - startTime) / 1000
    console.log(`✅ Weekly test suite completed in ${duration}s`)
    
    return report
  }
  
  // 1. Edge Case Testing - Test unusual inputs
  private async runEdgeCaseTests(): Promise<TestResult[]> {
    const results: TestResult[] = []
    const testCases = [
      // Typos and misspellings
      { input: 'weding tomorow hlep', expected: 'wedding', testName: 'typo_correction' },
      { input: 'sute for intervew', expected: 'suit interview', testName: 'spelling_correction' },
      
      // Mixed languages
      { input: 'necesito suit para wedding', expected: 'suit wedding', testName: 'multilingual_mix' },
      { input: 'je need tuxedo pour prom', expected: 'tuxedo prom', testName: 'french_english_mix' },
      
      // Emotional extremes
      { input: 'HELP!!!!! EMERGENCY!!!!', expected: 'emergency', testName: 'panic_mode' },
      { input: 'meh whatever idk', expected: 'assistance', testName: 'apathetic_customer' },
      
      // Contradictions
      { input: 'cheap but luxury quality', expected: 'value', testName: 'contradiction_handling' },
      { input: 'formal casual outfit needed', expected: 'smart casual', testName: 'oxymoron_request' },
      
      // Empty or minimal input
      { input: '?', expected: 'help', testName: 'single_character' },
      { input: 'suit', expected: 'suit', testName: 'single_word' },
      
      // Special characters and emojis
      { input: 'need suit 😊🎉', expected: 'suit', testName: 'emoji_handling' },
      { input: '$$$$ budget????', expected: 'budget', testName: 'special_chars' },
      
      // Very long input (testing truncation)
      { input: 'i need help ' + 'really '.repeat(50) + 'badly', expected: 'help', testName: 'long_input' },
      
      // Numbers and measurements
      { input: '42 chest 32 waist help', expected: 'sizing', testName: 'measurements_only' },
      { input: 'under 500 dollars max', expected: 'budget', testName: 'price_constraint' },
      
      // Time pressure variations
      { input: '2day need now asap', expected: 'urgent', testName: 'urgency_shorthand' },
      { input: 'sometime maybe eventually', expected: 'browsing', testName: 'no_urgency' }
    ]
    
    for (const testCase of testCases) {
      try {
        const response = contextAwareSelector.selectBestResponse(
          testCase.input,
          `edge_test_${testCase.testName}`,
          `edge_session_${Date.now()}`
        )
        
        const passed = response.response.toLowerCase().includes(testCase.expected) ||
                      response.confidence > 0.7
        
        results.push({
          testId: `edge_${testCase.testName}`,
          testType: 'edge_case',
          timestamp: new Date(),
          passed,
          score: response.confidence,
          details: {
            input: testCase.input,
            expected: testCase.expected,
            actual: response.response,
            agent: response.agent
          }
        })
      } catch (error) {
        results.push({
          testId: `edge_${testCase.testName}`,
          testType: 'edge_case',
          timestamp: new Date(),
          passed: false,
          score: 0,
          details: { input: testCase.input, error: error.message },
          errors: [error.message]
        })
      }
    }
    
    return results
  }
  
  // 2. Performance Testing - Test system under load
  private async runPerformanceTests(): Promise<TestResult[]> {
    const results: TestResult[] = []
    
    // Concurrent conversation test
    const concurrentTest = await this.testConcurrentConversations(100)
    results.push(concurrentTest)
    
    // Response time under load
    const loadTest = await this.testResponseTimeUnderLoad()
    results.push(loadTest)
    
    // Memory usage test
    const memoryTest = await this.testMemoryUsage()
    results.push(memoryTest)
    
    // Cache effectiveness test
    const cacheTest = await this.testCacheHitRate()
    results.push(cacheTest)
    
    return results
  }
  
  // Test concurrent conversations
  private async testConcurrentConversations(count: number): Promise<TestResult> {
    const startTime = Date.now()
    const promises = []
    
    for (let i = 0; i < count; i++) {
      promises.push(
        contextAwareSelector.selectBestResponse(
          `concurrent test ${i}`,
          `user_${i}`,
          `session_${i}`
        )
      )
    }
    
    try {
      const responses = await Promise.all(promises)
      const duration = Date.now() - startTime
      const avgResponseTime = duration / count
      const successRate = responses.filter(r => r.confidence > 0.7).length / count
      
      return {
        testId: 'perf_concurrent',
        testType: 'performance',
        timestamp: new Date(),
        passed: avgResponseTime < 100 && successRate > 0.9,
        score: successRate,
        details: {
          concurrentConversations: count,
          totalDuration: duration,
          avgResponseTime,
          successRate
        }
      }
    } catch (error) {
      return {
        testId: 'perf_concurrent',
        testType: 'performance',
        timestamp: new Date(),
        passed: false,
        score: 0,
        details: { error: error.message },
        errors: [error.message]
      }
    }
  }
  
  // Test response time under load
  private async testResponseTimeUnderLoad(): Promise<TestResult> {
    const iterations = 1000
    const responseTimes: number[] = []
    
    for (let i = 0; i < iterations; i++) {
      const start = Date.now()
      await contextAwareSelector.selectBestResponse(
        `load test message ${i}`,
        `load_user_${i}`,
        `load_session`
      )
      responseTimes.push(Date.now() - start)
    }
    
    const avgTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
    const maxTime = Math.max(...responseTimes)
    const minTime = Math.min(...responseTimes)
    const p95Time = responseTimes.sort()[Math.floor(iterations * 0.95)]
    
    return {
      testId: 'perf_response_time',
      testType: 'performance',
      timestamp: new Date(),
      passed: avgTime < 50 && p95Time < 100,
      score: Math.max(0, 1 - (avgTime / 100)),
      details: {
        iterations,
        avgTime,
        minTime,
        maxTime,
        p95Time
      }
    }
  }
  
  // Test memory usage
  private async testMemoryUsage(): Promise<TestResult> {
    const initialMemory = process.memoryUsage()
    
    // Run memory-intensive operations
    const largeConversations = []
    for (let i = 0; i < 100; i++) {
      const conversation = await customerSimulator.simulateConversation(
        `memory test ${i}`
      )
      largeConversations.push(conversation)
    }
    
    const finalMemory = process.memoryUsage()
    const heapUsed = (finalMemory.heapUsed - initialMemory.heapUsed) / 1024 / 1024 // MB
    const externalUsed = (finalMemory.external - initialMemory.external) / 1024 / 1024 // MB
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc()
    }
    
    const afterGC = process.memoryUsage()
    const retained = (afterGC.heapUsed - initialMemory.heapUsed) / 1024 / 1024 // MB
    
    return {
      testId: 'perf_memory',
      testType: 'performance',
      timestamp: new Date(),
      passed: heapUsed < 100 && retained < 50, // Less than 100MB used, 50MB retained
      score: Math.max(0, 1 - (retained / 100)),
      details: {
        heapUsedMB: heapUsed,
        externalUsedMB: externalUsed,
        retainedAfterGC: retained,
        conversationsTested: largeConversations.length
      }
    }
  }
  
  // Test cache hit rate
  private async testCacheHitRate(): Promise<TestResult> {
    const testMessages = [
      'need wedding suit',
      'prom tuxedo help',
      'interview outfit',
      'casual Friday clothes',
      'black tie event'
    ]
    
    let cacheHits = 0
    let cacheMisses = 0
    
    // First pass - populate cache
    for (const message of testMessages) {
      await contextAwareSelector.selectBestResponse(message, 'cache_user', 'cache_session')
      cacheMisses++
    }
    
    // Second pass - should hit cache
    const startTime = Date.now()
    for (const message of testMessages) {
      const response = await contextAwareSelector.selectBestResponse(message, 'cache_user', 'cache_session')
      // Check if response was faster (indicating cache hit)
      if (Date.now() - startTime < 5) {
        cacheHits++
      }
    }
    
    const hitRate = cacheHits / testMessages.length
    
    return {
      testId: 'perf_cache',
      testType: 'performance',
      timestamp: new Date(),
      passed: hitRate > 0.8,
      score: hitRate,
      details: {
        cacheHits,
        cacheMisses,
        hitRate,
        testMessages: testMessages.length
      }
    }
  }
  
  // 3. Regression Testing - Ensure previous fixes still work
  private async runRegressionTests(): Promise<TestResult[]> {
    const results: TestResult[] = []
    
    // Test previously failed scenarios
    const previousFailures = [
      { scenario: 'age milestone 30th birthday', category: 'age_milestones' },
      { scenario: 'modest cultural wedding', category: 'cultural' },
      { scenario: 'plus size confidence', category: 'body_confidence' },
      { scenario: 'retirement party outfit', category: 'age_milestones' },
      { scenario: 'wheelchair accessible fitting', category: 'accessibility' }
    ]
    
    for (const failure of previousFailures) {
      const conversation = await megaTrainer.runConversation(
        { userMessage: failure.scenario },
        `regression_${failure.category}`,
        failure.category
      )
      
      results.push({
        testId: `regression_${failure.category}`,
        testType: 'regression',
        timestamp: new Date(),
        passed: conversation.successful,
        score: conversation.customerSatisfaction / 5,
        details: {
          scenario: failure.scenario,
          exchanges: conversation.exchangeCount,
          resolution: conversation.resolutionType
        }
      })
    }
    
    return results
  }
  
  // 4. Real User Simulation - Realistic user behaviors
  private async runRealUserSimulation(): Promise<TestResult[]> {
    const results: TestResult[] = []
    
    // Ghost customer (abandons mid-conversation)
    const ghostTest = await this.testGhostCustomer()
    results.push(ghostTest)
    
    // Topic switcher
    const switchTest = await this.testTopicSwitching()
    results.push(switchTest)
    
    // Impatient customer (rapid messages)
    const impatientTest = await this.testImpatientCustomer()
    results.push(impatientTest)
    
    // Return customer with context
    const returnTest = await this.testReturnCustomer()
    results.push(returnTest)
    
    return results
  }
  
  // Test ghost customer behavior
  private async testGhostCustomer(): Promise<TestResult> {
    const exchanges = []
    
    // Start conversation
    exchanges.push(await contextAwareSelector.selectBestResponse(
      'need help with suit',
      'ghost_user',
      'ghost_session'
    ))
    
    // Second exchange
    exchanges.push(await contextAwareSelector.selectBestResponse(
      'for wedding next month',
      'ghost_user',
      'ghost_session'
    ))
    
    // Customer ghosts... simulate 5 minute gap
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // System should handle re-engagement
    const reEngagement = await contextAwareSelector.selectBestResponse(
      'hello still there?',
      'ghost_user',
      'ghost_session'
    )
    
    return {
      testId: 'real_ghost_customer',
      testType: 'real_user_simulation',
      timestamp: new Date(),
      passed: reEngagement.response.includes('help') || reEngagement.response.includes('here'),
      score: reEngagement.confidence,
      details: {
        exchanges: exchanges.length,
        reEngagementResponse: reEngagement.response,
        handledGracefully: true
      }
    }
  }
  
  // Test topic switching
  private async testTopicSwitching(): Promise<TestResult> {
    const conversation = []
    
    // Start with suits
    conversation.push(await contextAwareSelector.selectBestResponse(
      'looking for navy suit',
      'switch_user',
      'switch_session'
    ))
    
    // Switch to shoes
    conversation.push(await contextAwareSelector.selectBestResponse(
      'actually need shoes first',
      'switch_user',
      'switch_session'
    ))
    
    // Back to suits
    conversation.push(await contextAwareSelector.selectBestResponse(
      'wait the suit more important',
      'switch_user',
      'switch_session'
    ))
    
    const handled = conversation.every(r => r.confidence > 0.6)
    
    return {
      testId: 'real_topic_switch',
      testType: 'real_user_simulation',
      timestamp: new Date(),
      passed: handled,
      score: conversation.reduce((sum, r) => sum + r.confidence, 0) / conversation.length,
      details: {
        switches: 2,
        avgConfidence: conversation.reduce((sum, r) => sum + r.confidence, 0) / conversation.length,
        responses: conversation.map(c => c.response.substring(0, 50))
      }
    }
  }
  
  // Test impatient customer
  private async testImpatientCustomer(): Promise<TestResult> {
    const rapidMessages = [
      'hello',
      'anyone there??',
      'HELLO???',
      'need help NOW',
      'forget it'
    ]
    
    const responses = []
    const startTime = Date.now()
    
    // Send messages rapidly
    for (const message of rapidMessages) {
      responses.push(await contextAwareSelector.selectBestResponse(
        message,
        'impatient_user',
        'impatient_session'
      ))
    }
    
    const totalTime = Date.now() - startTime
    const avgResponseTime = totalTime / rapidMessages.length
    const handledWell = responses[responses.length - 1].response.includes('help') ||
                       responses[responses.length - 1].response.includes('sorry')
    
    return {
      testId: 'real_impatient',
      testType: 'real_user_simulation',
      timestamp: new Date(),
      passed: handledWell && avgResponseTime < 100,
      score: handledWell ? 0.8 : 0.3,
      details: {
        messagesCount: rapidMessages.length,
        avgResponseTime,
        finalResponse: responses[responses.length - 1].response,
        handledFrustration: handledWell
      }
    }
  }
  
  // Test return customer with context
  private async testReturnCustomer(): Promise<TestResult> {
    // First visit
    await contextAwareSelector.selectBestResponse(
      'bought navy suit last week',
      'return_user',
      'session_1'
    )
    
    // Return visit (new session but same user)
    const returnResponse = await contextAwareSelector.selectBestResponse(
      'need matching shoes',
      'return_user',
      'session_2'
    )
    
    // Check if system maintains context
    const hasContext = returnResponse.response.includes('navy') ||
                      returnResponse.response.includes('suit') ||
                      returnResponse.response.includes('match')
    
    return {
      testId: 'real_return_customer',
      testType: 'real_user_simulation',
      timestamp: new Date(),
      passed: hasContext,
      score: hasContext ? 1 : 0.5,
      details: {
        maintainedContext: hasContext,
        response: returnResponse.response,
        confidence: returnResponse.confidence
      }
    }
  }
  
  // 5. Seasonal Relevance Testing
  private async runSeasonalRelevanceTests(): Promise<TestResult[]> {
    const results: TestResult[] = []
    const currentMonth = new Date().getMonth()
    const currentSeason = this.getCurrentSeason(currentMonth)
    
    const seasonalTests = {
      winter: ['winter coat needed', 'holiday party outfit', 'new years eve tux'],
      spring: ['easter sunday suit', 'spring wedding guest', 'graduation outfit'],
      summer: ['summer wedding light', 'beach wedding attire', 'outdoor event hot'],
      fall: ['fall colors suit', 'thanksgiving dinner outfit', 'homecoming dance']
    }
    
    const relevantTests = seasonalTests[currentSeason]
    
    for (const test of relevantTests) {
      const response = await contextAwareSelector.selectBestResponse(
        test,
        'seasonal_user',
        'seasonal_session'
      )
      
      // Check if response is seasonally appropriate
      const isRelevant = this.checkSeasonalRelevance(response.response, currentSeason)
      
      results.push({
        testId: `seasonal_${test.replace(/\s/g, '_')}`,
        testType: 'seasonal',
        timestamp: new Date(),
        passed: isRelevant,
        score: isRelevant ? 1 : 0.5,
        details: {
          season: currentSeason,
          query: test,
          response: response.response.substring(0, 100),
          seasonallyAppropriate: isRelevant
        }
      })
    }
    
    return results
  }
  
  // 6. Error Recovery Testing
  private async runErrorRecoveryTests(): Promise<TestResult[]> {
    const results: TestResult[] = []
    
    // Test recovery from misunderstanding
    const misunderstandingTest = await this.testMisunderstandingRecovery()
    results.push(misunderstandingTest)
    
    // Test handling of impossible requests
    const impossibleTest = await this.testImpossibleRequest()
    results.push(impossibleTest)
    
    // Test graceful degradation
    const degradationTest = await this.testGracefulDegradation()
    results.push(degradationTest)
    
    return results
  }
  
  // Test recovery from misunderstanding
  private async testMisunderstandingRecovery(): Promise<TestResult> {
    const conversation = []
    
    // Initial request
    conversation.push(await contextAwareSelector.selectBestResponse(
      'need blue thing',
      'misunderstand_user',
      'misunderstand_session'
    ))
    
    // Clarification
    conversation.push(await contextAwareSelector.selectBestResponse(
      'no not shirt, full suit',
      'misunderstand_user',
      'misunderstand_session'
    ))
    
    // Check if AI recovered and understood
    const recovered = conversation[1].response.includes('suit') && 
                     conversation[1].confidence > 0.7
    
    return {
      testId: 'error_misunderstanding',
      testType: 'error_recovery',
      timestamp: new Date(),
      passed: recovered,
      score: recovered ? 1 : 0.3,
      details: {
        initialResponse: conversation[0].response.substring(0, 50),
        recoveryResponse: conversation[1].response.substring(0, 50),
        recovered
      }
    }
  }
  
  // Test impossible request handling
  private async testImpossibleRequest(): Promise<TestResult> {
    const response = await contextAwareSelector.selectBestResponse(
      'need invisible tuxedo yesterday',
      'impossible_user',
      'impossible_session'
    )
    
    // Should acknowledge impossibility but offer alternatives
    const handledWell = response.response.includes('but') ||
                       response.response.includes('however') ||
                       response.response.includes('instead') ||
                       response.response.includes('alternative')
    
    return {
      testId: 'error_impossible',
      testType: 'error_recovery',
      timestamp: new Date(),
      passed: handledWell,
      score: handledWell ? 1 : 0.5,
      details: {
        request: 'invisible tuxedo yesterday',
        response: response.response,
        offeredAlternative: handledWell
      }
    }
  }
  
  // Test graceful degradation
  private async testGracefulDegradation(): Promise<TestResult> {
    // Simulate system under stress with garbage input
    const garbledInput = 'a$#@!%^&*()_+{}|:"<>?[];,./~`'
    
    try {
      const response = await contextAwareSelector.selectBestResponse(
        garbledInput,
        'degradation_user',
        'degradation_session'
      )
      
      // Should still provide helpful response
      const degradedGracefully = response.response.includes('help') ||
                                 response.response.includes('assist') ||
                                 response.response.includes('understand')
      
      return {
        testId: 'error_degradation',
        testType: 'error_recovery',
        timestamp: new Date(),
        passed: degradedGracefully,
        score: degradedGracefully ? 1 : 0,
        details: {
          input: 'garbled special characters',
          response: response.response,
          degradedGracefully
        }
      }
    } catch (error) {
      return {
        testId: 'error_degradation',
        testType: 'error_recovery',
        timestamp: new Date(),
        passed: false,
        score: 0,
        details: { error: error.message },
        errors: ['System crash on garbled input']
      }
    }
  }
  
  // 7. Context Switching Tests
  private async runContextSwitchingTests(): Promise<TestResult[]> {
    const results: TestResult[] = []
    
    const contexts = [
      { mood: 'happy', time: 'morning', urgency: 'low' },
      { mood: 'stressed', time: 'evening', urgency: 'high' },
      { mood: 'confused', time: 'afternoon', urgency: 'medium' }
    ]
    
    const testMessage = 'need outfit help'
    
    for (const context of contexts) {
      const response = await contextAwareSelector.selectBestResponse(
        testMessage,
        `context_user_${context.mood}`,
        `context_session_${context.time}`,
        context
      )
      
      // Check if response matches context
      const appropriateTone = this.checkToneMatch(response.response, context.mood)
      
      results.push({
        testId: `context_${context.mood}_${context.urgency}`,
        testType: 'context_switching',
        timestamp: new Date(),
        passed: appropriateTone,
        score: appropriateTone ? 1 : 0.5,
        details: {
          context,
          response: response.response.substring(0, 100),
          toneAppropriate: appropriateTone
        }
      })
    }
    
    return results
  }
  
  // 8. Multilingual Support Tests
  private async runMultilingualTests(): Promise<TestResult[]> {
    const results: TestResult[] = []
    
    const multilingualTests = [
      { lang: 'es', input: 'necesito traje', expected: 'suit' },
      { lang: 'fr', input: 'costume pour mariage', expected: 'wedding' },
      { lang: 'de', input: 'Anzug für Arbeit', expected: 'work' },
      { lang: 'it', input: 'abito formale', expected: 'formal' },
      { lang: 'pt', input: 'terno para festa', expected: 'party' }
    ]
    
    for (const test of multilingualTests) {
      const response = await contextAwareSelector.selectBestResponse(
        test.input,
        `multilingual_${test.lang}`,
        'multilingual_session'
      )
      
      const understood = response.response.toLowerCase().includes(test.expected) ||
                        response.confidence > 0.6
      
      results.push({
        testId: `multilingual_${test.lang}`,
        testType: 'multilingual',
        timestamp: new Date(),
        passed: understood,
        score: understood ? 1 : 0.3,
        details: {
          language: test.lang,
          input: test.input,
          understood,
          response: response.response.substring(0, 100)
        }
      })
    }
    
    return results
  }
  
  // 9. Accessibility Tests
  private async runAccessibilityTests(): Promise<TestResult[]> {
    const results: TestResult[] = []
    
    const accessibilityTests = [
      { 
        scenario: 'visually impaired need help',
        expectedFeatures: ['describe', 'detail', 'color', 'texture']
      },
      {
        scenario: 'wheelchair user fitting',
        expectedFeatures: ['accessible', 'accommodate', 'comfortable']
      },
      {
        scenario: 'hearing impaired appointment',
        expectedFeatures: ['written', 'email', 'text', 'visual']
      }
    ]
    
    for (const test of accessibilityTests) {
      const response = await contextAwareSelector.selectBestResponse(
        test.scenario,
        'accessibility_user',
        'accessibility_session'
      )
      
      const hasFeatures = test.expectedFeatures.some(feature => 
        response.response.toLowerCase().includes(feature)
      )
      
      results.push({
        testId: `accessibility_${test.scenario.split(' ')[0]}`,
        testType: 'accessibility',
        timestamp: new Date(),
        passed: hasFeatures,
        score: hasFeatures ? 1 : 0.5,
        details: {
          scenario: test.scenario,
          response: response.response,
          addressedNeeds: hasFeatures
        }
      })
    }
    
    return results
  }
  
  // 10. Security and Privacy Tests
  private async runSecurityTests(): Promise<TestResult[]> {
    const results: TestResult[] = []
    
    const securityTests = [
      {
        input: 'my credit card is 4111111111111111',
        shouldNotStore: true,
        testName: 'credit_card_masking'
      },
      {
        input: 'ssn 123-45-6789 for records',
        shouldNotStore: true,
        testName: 'ssn_protection'
      },
      {
        input: 'email me at test@example.com',
        shouldMask: true,
        testName: 'email_privacy'
      }
    ]
    
    for (const test of securityTests) {
      const response = await contextAwareSelector.selectBestResponse(
        test.input,
        'security_user',
        'security_session'
      )
      
      // Check if sensitive data is not echoed back
      const containsSensitive = response.response.includes('4111') ||
                               response.response.includes('123-45') ||
                               (test.shouldMask && response.response.includes('@'))
      
      results.push({
        testId: `security_${test.testName}`,
        testType: 'security',
        timestamp: new Date(),
        passed: !containsSensitive,
        score: containsSensitive ? 0 : 1,
        details: {
          input: 'sensitive data provided',
          responseContainedSensitive: containsSensitive,
          handled: !containsSensitive
        }
      })
    }
    
    return results
  }
  
  // Helper function to get current season
  private getCurrentSeason(month: number): string {
    if (month >= 11 || month <= 1) return 'winter'
    if (month >= 2 && month <= 4) return 'spring'
    if (month >= 5 && month <= 7) return 'summer'
    return 'fall'
  }
  
  // Check seasonal relevance
  private checkSeasonalRelevance(response: string, season: string): boolean {
    const seasonKeywords = {
      winter: ['warm', 'wool', 'layer', 'cold', 'holiday'],
      spring: ['light', 'pastel', 'fresh', 'breathable'],
      summer: ['cool', 'linen', 'light', 'breathable', 'outdoor'],
      fall: ['layer', 'earth', 'warm', 'transition']
    }
    
    return seasonKeywords[season].some(keyword => 
      response.toLowerCase().includes(keyword)
    )
  }
  
  // Check tone match
  private checkToneMatch(response: string, mood: string): boolean {
    const moodIndicators = {
      happy: ['great', 'excellent', 'wonderful', 'perfect', '!'],
      stressed: ['quickly', 'immediately', 'right away', 'urgent'],
      confused: ['let me explain', 'here\'s', 'simply', 'basically']
    }
    
    return moodIndicators[mood]?.some(indicator => 
      response.toLowerCase().includes(indicator)
    ) || false
  }
  
  // Generate weekly report
  private generateWeeklyReport(results: TestResult[]): WeeklyTestReport {
    const totalTests = results.length
    const passedTests = results.filter(r => r.passed).length
    const failedTests = totalTests - passedTests
    const overallScore = results.reduce((sum, r) => sum + r.score, 0) / totalTests
    
    // Group results by test type
    const testTypes = new Map<string, TestResult[]>()
    results.forEach(result => {
      const typeResults = testTypes.get(result.testType) || []
      typeResults.push(result)
      testTypes.set(result.testType, typeResults)
    })
    
    // Identify critical issues
    const criticalIssues: string[] = []
    const failedByType = new Map<string, number>()
    
    testTypes.forEach((typeResults, type) => {
      const failed = typeResults.filter(r => !r.passed).length
      if (failed > typeResults.length * 0.3) {
        criticalIssues.push(`High failure rate in ${type}: ${failed}/${typeResults.length}`)
      }
      failedByType.set(type, failed)
    })
    
    // Generate recommendations
    const recommendations: string[] = []
    
    if (overallScore < 0.85) {
      recommendations.push('Overall score below threshold - immediate attention needed')
    }
    
    failedByType.forEach((count, type) => {
      if (count > 0) {
        recommendations.push(`Focus training on ${type} scenarios`)
      }
    })
    
    // Compare with historical data
    const lastWeekScore = this.getLastWeekScore()
    const lastMonthScore = this.getLastMonthScore()
    const trend = overallScore > lastWeekScore ? 'improving' : 
                  overallScore < lastWeekScore ? 'declining' : 'stable'
    
    return {
      weekNumber: this.getWeekNumber(),
      startDate: this.getWeekStartDate(),
      endDate: new Date(),
      totalTests,
      passedTests,
      failedTests,
      overallScore,
      improvements: this.identifyImprovements(results),
      regressions: this.identifyRegressions(results),
      criticalIssues,
      recommendations,
      historicalComparison: {
        lastWeek: lastWeekScore,
        lastMonth: lastMonthScore,
        trend
      }
    }
  }
  
  // Store results for historical tracking
  private storeResults(results: TestResult[], report: WeeklyTestReport): void {
    // Store individual test results
    results.forEach(result => {
      const history = this.testHistory.get(result.testId) || []
      history.push(result)
      this.testHistory.set(result.testId, history)
    })
    
    // Store weekly report
    this.weeklyReports.push(report)
    
    // Keep only last 12 weeks of reports
    if (this.weeklyReports.length > 12) {
      this.weeklyReports.shift()
    }
  }
  
  // Check for critical issues and send alerts
  private async checkCriticalIssues(report: WeeklyTestReport): Promise<void> {
    if (report.overallScore < this.criticalThreshold) {
      console.log('🚨 CRITICAL ALERT: Overall score below threshold!')
      console.log(`Score: ${report.overallScore.toFixed(2)} (Threshold: ${this.criticalThreshold})`)
      
      // In production, this would send alerts via email/Slack/etc
      await this.sendAlert({
        severity: 'critical',
        message: `AI test score dropped to ${report.overallScore.toFixed(2)}`,
        report
      })
    }
    
    if (report.criticalIssues.length > 0) {
      console.log('⚠️ Critical issues detected:')
      report.criticalIssues.forEach(issue => console.log(`  - ${issue}`))
    }
  }
  
  // Send alert (placeholder for production implementation)
  private async sendAlert(alert: any): Promise<void> {
    // In production: send to monitoring service, email, Slack, etc.
    console.log('📧 Alert would be sent:', alert)
  }
  
  // Get last week's score
  private getLastWeekScore(): number {
    if (this.weeklyReports.length < 2) return 0.85
    return this.weeklyReports[this.weeklyReports.length - 2].overallScore
  }
  
  // Get last month's score
  private getLastMonthScore(): number {
    if (this.weeklyReports.length < 5) return 0.85
    return this.weeklyReports[this.weeklyReports.length - 5].overallScore
  }
  
  // Get current week number
  private getWeekNumber(): number {
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 1)
    const diff = now.getTime() - start.getTime()
    return Math.floor(diff / (7 * 24 * 60 * 60 * 1000))
  }
  
  // Get week start date
  private getWeekStartDate(): Date {
    const now = new Date()
    const dayOfWeek = now.getDay()
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
    return new Date(now.setDate(diff))
  }
  
  // Identify improvements from last week
  private identifyImprovements(results: TestResult[]): string[] {
    const improvements: string[] = []
    
    // Compare with historical data
    results.forEach(result => {
      const history = this.testHistory.get(result.testId)
      if (history && history.length > 1) {
        const previousScore = history[history.length - 2].score
        if (result.score > previousScore + 0.1) {
          improvements.push(`${result.testId}: ${previousScore.toFixed(2)} → ${result.score.toFixed(2)}`)
        }
      }
    })
    
    return improvements
  }
  
  // Identify regressions from last week
  private identifyRegressions(results: TestResult[]): string[] {
    const regressions: string[] = []
    
    results.forEach(result => {
      const history = this.testHistory.get(result.testId)
      if (history && history.length > 1) {
        const previousScore = history[history.length - 2].score
        if (result.score < previousScore - 0.1) {
          regressions.push(`${result.testId}: ${previousScore.toFixed(2)} → ${result.score.toFixed(2)}`)
        }
      }
    })
    
    return regressions
  }
  
  // Export test results to JSON
  exportResults(): string {
    return JSON.stringify({
      testHistory: Array.from(this.testHistory.entries()),
      weeklyReports: this.weeklyReports
    }, null, 2)
  }
  
  // Import historical test results
  importResults(data: string): void {
    const parsed = JSON.parse(data)
    this.testHistory = new Map(parsed.testHistory)
    this.weeklyReports = parsed.weeklyReports
  }
}

// Export singleton instance
export const weeklyTestRunner = new WeeklyTestRunner()
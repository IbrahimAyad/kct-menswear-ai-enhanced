#!/usr/bin/env tsx

import { conversationalAI, ConversationContext } from '../models/conversational-ai';
import { vectorStore } from '../embeddings/vector-store';
import { embeddingsGenerator } from '../embeddings/generator';
import fs from 'fs/promises';
import path from 'path';

interface TestCase {
  id: string;
  category: string;
  query: string;
  expectedIntent: string;
  expectedProducts?: string[];
  expectedKeywords?: string[];
  context?: ConversationContext;
}

interface EvaluationMetrics {
  totalTests: number;
  passed: number;
  failed: number;
  accuracy: number;
  averageResponseTime: number;
  averageConfidence: number;
  intentAccuracy: number;
  productRelevance: number;
  categoryMetrics: Record<string, {
    total: number;
    passed: number;
    accuracy: number;
  }>;
  failedTests: Array<{
    testId: string;
    reason: string;
  }>;
}

export class AIEvaluator {
  private testCases: TestCase[] = [];
  private metrics: EvaluationMetrics = {
    totalTests: 0,
    passed: 0,
    failed: 0,
    accuracy: 0,
    averageResponseTime: 0,
    averageConfidence: 0,
    intentAccuracy: 0,
    productRelevance: 0,
    categoryMetrics: {},
    failedTests: [],
  };

  constructor() {
    this.initializeTestCases();
  }

  private initializeTestCases(): void {
    this.testCases = [
      // Product Search Tests
      {
        id: 'search_1',
        category: 'product_search',
        query: 'Show me black tuxedos for a wedding',
        expectedIntent: 'product_search',
        expectedKeywords: ['black', 'tuxedo', 'wedding', 'formal'],
      },
      {
        id: 'search_2',
        category: 'product_search',
        query: 'I need a navy blue suit under $300',
        expectedIntent: 'product_search',
        expectedKeywords: ['navy', 'blue', 'suit', 'budget'],
      },

      // Recommendation Tests
      {
        id: 'rec_1',
        category: 'recommendation',
        query: 'What should I wear to a summer wedding?',
        expectedIntent: 'recommendation',
        expectedKeywords: ['summer', 'wedding', 'light', 'breathable'],
      },
      {
        id: 'rec_2',
        category: 'recommendation',
        query: 'Recommend a complete outfit for prom',
        expectedIntent: 'recommendation',
        expectedKeywords: ['prom', 'tuxedo', 'formal', 'complete'],
      },

      // Sizing Tests
      {
        id: 'size_1',
        category: 'sizing',
        query: 'How does the slim fit suit run? I normally wear a 40R',
        expectedIntent: 'sizing',
        expectedKeywords: ['slim fit', '40R', 'fit', 'size'],
      },
      {
        id: 'size_2',
        category: 'sizing',
        query: 'What size shirt should I get if my neck is 16 inches?',
        expectedIntent: 'sizing',
        expectedKeywords: ['16', 'neck', 'shirt', 'measurement'],
      },

      // Styling Tests
      {
        id: 'style_1',
        category: 'styling',
        query: 'What color tie goes with a charcoal grey suit?',
        expectedIntent: 'styling',
        expectedKeywords: ['charcoal', 'grey', 'tie', 'color', 'match'],
      },
      {
        id: 'style_2',
        category: 'styling',
        query: 'How do I coordinate a pocket square with my outfit?',
        expectedIntent: 'styling',
        expectedKeywords: ['pocket square', 'coordinate', 'match', 'accessory'],
      },

      // Care Instructions Tests
      {
        id: 'care_1',
        category: 'care',
        query: 'How do I care for a wool suit?',
        expectedIntent: 'care',
        expectedKeywords: ['wool', 'care', 'clean', 'maintain'],
      },
      {
        id: 'care_2',
        category: 'care',
        query: 'Can I machine wash a cotton dress shirt?',
        expectedIntent: 'care',
        expectedKeywords: ['cotton', 'wash', 'machine', 'shirt'],
      },

      // Price/Budget Tests
      {
        id: 'price_1',
        category: 'price',
        query: 'What are your most affordable suits?',
        expectedIntent: 'price',
        expectedKeywords: ['affordable', 'budget', 'price', 'cheap'],
      },
      {
        id: 'price_2',
        category: 'price',
        query: 'Do you have any suits between $200 and $400?',
        expectedIntent: 'price',
        expectedKeywords: ['200', '400', 'price', 'range'],
      },

      // Occasion Tests
      {
        id: 'occasion_1',
        category: 'occasion',
        query: 'What should I wear to a business meeting?',
        expectedIntent: 'occasion',
        expectedKeywords: ['business', 'professional', 'meeting', 'formal'],
      },
      {
        id: 'occasion_2',
        category: 'occasion',
        query: 'I need something for a casual date night',
        expectedIntent: 'occasion',
        expectedKeywords: ['casual', 'date', 'relaxed', 'comfortable'],
      },

      // Comparison Tests
      {
        id: 'compare_1',
        category: 'comparison',
        query: 'What\'s the difference between a tuxedo and a suit?',
        expectedIntent: 'comparison',
        expectedKeywords: ['difference', 'tuxedo', 'suit', 'formal'],
      },
      {
        id: 'compare_2',
        category: 'comparison',
        query: 'Should I get wool or cotton for summer?',
        expectedIntent: 'comparison',
        expectedKeywords: ['wool', 'cotton', 'summer', 'material'],
      },
    ];
  }

  async runEvaluation(): Promise<void> {
    console.log('='.repeat(50));
    console.log('AI System Evaluation');
    console.log('='.repeat(50));

    this.metrics.totalTests = this.testCases.length;
    const responseTimes: number[] = [];
    const confidenceScores: number[] = [];
    let intentMatches = 0;

    for (const testCase of this.testCases) {
      console.log(`\nRunning test: ${testCase.id} (${testCase.category})`);
      
      const startTime = Date.now();
      
      try {
        // Process the query
        const response = await conversationalAI.processQuery(
          testCase.query,
          testCase.context || { sessionId: `test_${testCase.id}` }
        );

        const responseTime = Date.now() - startTime;
        responseTimes.push(responseTime);

        // Evaluate the response
        const evaluation = this.evaluateResponse(testCase, response);
        
        if (evaluation.passed) {
          this.metrics.passed++;
          console.log(`✅ Test ${testCase.id} passed`);
        } else {
          this.metrics.failed++;
          this.metrics.failedTests.push({
            testId: testCase.id,
            reason: evaluation.reason || 'Unknown',
          });
          console.log(`❌ Test ${testCase.id} failed: ${evaluation.reason}`);
        }

        // Track intent accuracy
        if (response.metadata?.intent === testCase.expectedIntent) {
          intentMatches++;
        }

        // Track confidence
        if (response.metadata?.confidence) {
          confidenceScores.push(response.metadata.confidence);
        }

        // Update category metrics
        if (!this.metrics.categoryMetrics[testCase.category]) {
          this.metrics.categoryMetrics[testCase.category] = {
            total: 0,
            passed: 0,
            accuracy: 0,
          };
        }
        
        this.metrics.categoryMetrics[testCase.category].total++;
        if (evaluation.passed) {
          this.metrics.categoryMetrics[testCase.category].passed++;
        }

      } catch (error) {
        console.error(`❌ Test ${testCase.id} error:`, error);
        this.metrics.failed++;
        this.metrics.failedTests.push({
          testId: testCase.id,
          reason: `Error: ${error}`,
        });
      }

      // Clear memory after each test
      conversationalAI.clearMemory(`test_${testCase.id}`);
    }

    // Calculate final metrics
    this.metrics.accuracy = (this.metrics.passed / this.metrics.totalTests) * 100;
    this.metrics.averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    this.metrics.averageConfidence = confidenceScores.reduce((a, b) => a + b, 0) / confidenceScores.length;
    this.metrics.intentAccuracy = (intentMatches / this.testCases.length) * 100;

    // Calculate category accuracies
    for (const category in this.metrics.categoryMetrics) {
      const cat = this.metrics.categoryMetrics[category];
      cat.accuracy = (cat.passed / cat.total) * 100;
    }

    // Test vector search
    await this.evaluateVectorSearch();

    // Display results
    this.displayResults();

    // Save results
    await this.saveResults();
  }

  private evaluateResponse(testCase: TestCase, response: any): { passed: boolean; reason?: string } {
    // Check if response exists
    if (!response || !response.message) {
      return { passed: false, reason: 'No response generated' };
    }

    // Check intent match
    if (response.metadata?.intent !== testCase.expectedIntent) {
      return { 
        passed: false, 
        reason: `Intent mismatch: expected ${testCase.expectedIntent}, got ${response.metadata?.intent}` 
      };
    }

    // Check for expected keywords in response
    if (testCase.expectedKeywords) {
      const responseLower = response.message.toLowerCase();
      const missingKeywords = testCase.expectedKeywords.filter(
        keyword => !responseLower.includes(keyword.toLowerCase())
      );
      
      if (missingKeywords.length > testCase.expectedKeywords.length / 2) {
        return { 
          passed: false, 
          reason: `Missing keywords: ${missingKeywords.join(', ')}` 
        };
      }
    }

    // Check confidence threshold
    if (response.metadata?.confidence < config.training.minConfidenceScore) {
      return { 
        passed: false, 
        reason: `Low confidence: ${response.metadata?.confidence}` 
      };
    }

    return { passed: true };
  }

  private async evaluateVectorSearch(): Promise<void> {
    console.log('\n' + '='.repeat(30));
    console.log('Vector Search Evaluation');
    console.log('='.repeat(30));

    const testQueries = [
      'black tuxedo for wedding',
      'navy blue business suit',
      'casual summer shirt',
      'formal dress shoes',
      'burgundy tie',
    ];

    let totalRelevance = 0;
    
    for (const query of testQueries) {
      console.log(`\nTesting: "${query}"`);
      
      try {
        const embedding = await embeddingsGenerator.generateQueryEmbedding(query);
        const results = await vectorStore.search(embedding, 3);
        
        if (results.length > 0) {
          console.log(`Found ${results.length} results:`);
          results.forEach((result, i) => {
            console.log(`  ${i + 1}. ${result.payload?.title} (score: ${result.score?.toFixed(3)})`);
          });
          
          // Calculate relevance based on score
          const avgScore = results.reduce((sum, r) => sum + (r.score || 0), 0) / results.length;
          totalRelevance += avgScore;
        } else {
          console.log('  No results found');
        }
      } catch (error) {
        console.error(`  Error: ${error}`);
      }
    }

    this.metrics.productRelevance = (totalRelevance / testQueries.length) * 100;
  }

  private displayResults(): void {
    console.log('\n' + '='.repeat(50));
    console.log('Evaluation Results');
    console.log('='.repeat(50));
    
    console.log('\n📊 Overall Metrics:');
    console.log(`  Total Tests: ${this.metrics.totalTests}`);
    console.log(`  Passed: ${this.metrics.passed}`);
    console.log(`  Failed: ${this.metrics.failed}`);
    console.log(`  Accuracy: ${this.metrics.accuracy.toFixed(2)}%`);
    console.log(`  Intent Accuracy: ${this.metrics.intentAccuracy.toFixed(2)}%`);
    console.log(`  Product Relevance: ${this.metrics.productRelevance.toFixed(2)}%`);
    console.log(`  Avg Response Time: ${this.metrics.averageResponseTime.toFixed(0)}ms`);
    console.log(`  Avg Confidence: ${this.metrics.averageConfidence.toFixed(3)}`);

    console.log('\n📈 Category Performance:');
    for (const [category, metrics] of Object.entries(this.metrics.categoryMetrics)) {
      console.log(`  ${category}:`);
      console.log(`    - Tests: ${metrics.total}`);
      console.log(`    - Passed: ${metrics.passed}`);
      console.log(`    - Accuracy: ${metrics.accuracy.toFixed(2)}%`);
    }

    if (this.metrics.failedTests.length > 0) {
      console.log('\n❌ Failed Tests:');
      this.metrics.failedTests.forEach(test => {
        console.log(`  ${test.testId}: ${test.reason}`);
      });
    }

    const grade = this.calculateGrade(this.metrics.accuracy);
    console.log(`\n🎯 Overall Grade: ${grade}`);
  }

  private calculateGrade(accuracy: number): string {
    if (accuracy >= 90) return 'A (Excellent)';
    if (accuracy >= 80) return 'B (Good)';
    if (accuracy >= 70) return 'C (Satisfactory)';
    if (accuracy >= 60) return 'D (Needs Improvement)';
    return 'F (Poor)';
  }

  private async saveResults(): Promise<void> {
    const resultsPath = path.join(
      process.cwd(),
      'src/ai-training/evaluation/results.json'
    );

    await fs.writeFile(
      resultsPath,
      JSON.stringify({
        ...this.metrics,
        timestamp: new Date().toISOString(),
        testCases: this.testCases.length,
      }, null, 2)
    );

    console.log(`\n💾 Results saved to ${resultsPath}`);
  }
}

// Run evaluation if executed directly
if (require.main === module) {
  const evaluator = new AIEvaluator();
  evaluator.runEvaluation().catch(console.error);
}

export { AIEvaluator };
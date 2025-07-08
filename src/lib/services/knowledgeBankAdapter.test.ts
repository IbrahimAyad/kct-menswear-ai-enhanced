/**
 * Test file for Knowledge Bank Railway API integration
 * Run this to verify the API connection is working
 */

import { knowledgeBankAdapter } from './knowledgeBankAdapter';

async function testAPIConnection() {
  console.log('Testing Knowledge Bank Railway API Integration...\n');
  
  // Test 1: Color Relationships
  console.log('1. Testing Color Relationships endpoint...');
  try {
    const navyRelationships = await knowledgeBankAdapter.getColorRelationships('navy');
    if (navyRelationships) {
      console.log('✓ Color relationships fetched successfully:', navyRelationships);
    } else {
      console.log('⚠ Color relationships returned null (using fallback data)');
    }
  } catch (error) {
    console.error('✗ Error fetching color relationships:', error);
  }
  
  console.log('\n2. Testing Combination Validation endpoint...');
  try {
    const validation = await knowledgeBankAdapter.validateCombination('navy', 'white', 'burgundy');
    console.log('✓ Combination validation result:', validation);
  } catch (error) {
    console.error('✗ Error validating combination:', error);
  }
  
  console.log('\n3. Testing Recommendations endpoint...');
  try {
    const recommendations = await knowledgeBankAdapter.getRecommendations({
      occasion: 'business',
      season: 'fall'
    });
    console.log('✓ Recommendations fetched:', recommendations.length, 'items');
    if (recommendations.length > 0) {
      console.log('First recommendation:', recommendations[0]);
    }
  } catch (error) {
    console.error('✗ Error fetching recommendations:', error);
  }
  
  console.log('\n4. Testing Trending Combinations endpoint...');
  try {
    const trending = await knowledgeBankAdapter.getTrendingCombinations(5);
    console.log('✓ Trending combinations fetched:', trending.length, 'items');
  } catch (error) {
    console.error('✗ Error fetching trending combinations:', error);
  }
  
  console.log('\n5. Testing Style Profile endpoint...');
  try {
    const profile = await knowledgeBankAdapter.getStyleProfile('classic_conservative');
    if (profile) {
      console.log('✓ Style profile fetched successfully:', profile.name);
    } else {
      console.log('⚠ Style profile returned null (using fallback data)');
    }
  } catch (error) {
    console.error('✗ Error fetching style profile:', error);
  }
  
  console.log('\n6. Testing API configuration...');
  console.log('API URL:', process.env.NEXT_PUBLIC_KNOWLEDGE_BANK_API || 'https://kct-knowledge-api-production.up.railway.app');
  console.log('API Key:', process.env.NEXT_PUBLIC_KNOWLEDGE_BANK_KEY ? 'Configured' : 'Using default');
  
  console.log('\nTest completed!');
}

// Run the test
if (typeof window === 'undefined') {
  testAPIConnection().catch(console.error);
}

export { testAPIConnection };
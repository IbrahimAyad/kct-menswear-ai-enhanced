import { topBundleGenerator } from '@/lib/services/topBundleGenerator';

async function generateAndDisplayBundles() {
  console.log('🎯 Generating Top 15 KCT Menswear Bundle Combinations\n');
  console.log('=' . repeat(80));
  
  try {
    const bundles = await topBundleGenerator.generateTop15Bundles();
    
    bundles.forEach((bundle, index) => {
      console.log(`\n📦 Bundle #${index + 1}: ${bundle.name}`);
      console.log('-'.repeat(60));
      
      // Suit details
      console.log(`👔 Suit: ${bundle.suit.name}`);
      console.log(`   Color: ${bundle.suit.color}`);
      console.log(`   Price: $${bundle.suit.price}`);
      
      // Shirt details
      console.log(`👕 Shirt: ${bundle.shirt.name}`);
      console.log(`   Color: ${bundle.shirt.color}`);
      console.log(`   Fit: ${bundle.shirt.fit}`);
      console.log(`   Price: $${bundle.shirt.price}`);
      
      // Tie details
      console.log(`🎀 Tie: ${bundle.tie.name}`);
      console.log(`   Color: ${bundle.tie.color}`);
      console.log(`   Style: ${bundle.tie.style}`);
      console.log(`   Price: $${bundle.tie.price}`);
      
      // Bundle pricing
      console.log(`\n💰 Pricing:`);
      console.log(`   Total Price: $${bundle.totalPrice.toFixed(2)}`);
      console.log(`   Bundle Price: $${bundle.bundlePrice.toFixed(2)}`);
      console.log(`   You Save: $${bundle.discount.toFixed(2)} (${bundle.discountPercentage}% off)`);
      
      // AI Analysis
      console.log(`\n🤖 AI Analysis:`);
      console.log(`   Color Harmony Score: ${bundle.colorHarmonyScore}/100`);
      console.log(`   AI Confidence: ${bundle.aiConfidenceScore}%`);
      console.log(`   Trending: ${bundle.trending ? '🔥 Yes' : 'No'}`);
      
      // Target & Occasions
      console.log(`\n🎯 Target Customer: ${bundle.targetCustomer}`);
      console.log(`📅 Best For: ${bundle.occasion.join(', ')}`);
      console.log(`🌤️ Seasonality: ${bundle.seasonality.join(', ')}`);
      
      // Reasoning
      console.log(`\n💡 Why This Works:`);
      console.log(`   ${bundle.reasoning}`);
      
      console.log('\n' + '='.repeat(80));
    });
    
    // Summary statistics
    console.log('\n📊 BUNDLE SUMMARY STATISTICS');
    console.log('-'.repeat(60));
    
    const avgOriginalPrice = bundles.reduce((sum, b) => sum + b.totalPrice, 0) / bundles.length;
    const avgBundlePrice = bundles.reduce((sum, b) => sum + b.bundlePrice, 0) / bundles.length;
    const avgDiscount = bundles.reduce((sum, b) => sum + b.discount, 0) / bundles.length;
    const trendingCount = bundles.filter(b => b.trending).length;
    const avgColorHarmony = bundles.reduce((sum, b) => sum + b.colorHarmonyScore, 0) / bundles.length;
    const avgAIConfidence = bundles.reduce((sum, b) => sum + b.aiConfidenceScore, 0) / bundles.length;
    
    console.log(`Average Original Price: $${avgOriginalPrice.toFixed(2)}`);
    console.log(`Average Bundle Price: $${avgBundlePrice.toFixed(2)}`);
    console.log(`Average Savings: $${avgDiscount.toFixed(2)}`);
    console.log(`Trending Bundles: ${trendingCount}/15`);
    console.log(`Average Color Harmony Score: ${avgColorHarmony.toFixed(1)}/100`);
    console.log(`Average AI Confidence: ${avgAIConfidence.toFixed(1)}%`);
    
    // Occasion breakdown
    console.log('\n📅 OCCASION BREAKDOWN:');
    const occasionCount: Record<string, number> = {};
    bundles.forEach(bundle => {
      bundle.occasion.forEach(occ => {
        occasionCount[occ] = (occasionCount[occ] || 0) + 1;
      });
    });
    
    Object.entries(occasionCount)
      .sort((a, b) => b[1] - a[1])
      .forEach(([occasion, count]) => {
        console.log(`  ${occasion}: ${count} bundles`);
      });
    
    // Season breakdown
    console.log('\n🌤️ SEASONALITY BREAKDOWN:');
    const seasonCount: Record<string, number> = {};
    bundles.forEach(bundle => {
      bundle.seasonality.forEach(season => {
        seasonCount[season] = (seasonCount[season] || 0) + 1;
      });
    });
    
    Object.entries(seasonCount)
      .sort((a, b) => b[1] - a[1])
      .forEach(([season, count]) => {
        console.log(`  ${season}: ${count} bundles`);
      });
    
  } catch (error) {
    console.error('Error generating bundles:', error);
  }
}

// Run the generator
generateAndDisplayBundles();
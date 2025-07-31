import { fashionClipBundleGenerator } from '@/lib/services/fashionClipBundleGenerator';

async function generateAndDisplayFashionClipBundles() {
  console.log('🤖 FASHION CLIP AI - Visual Bundle Analysis\n');
  console.log('=' .repeat(80));
  console.log('Using pure visual AI to create the most aesthetically pleasing combinations');
  console.log('=' .repeat(80) + '\n');

  const bundles = await fashionClipBundleGenerator.generateVisuallyPerfectBundles();

  bundles.forEach((bundle, index) => {
    console.log(`\n${index + 1}. ${bundle.name.toUpperCase()}`);
    console.log('   Visual Score: ' + '⭐'.repeat(Math.round(bundle.visualScore / 20)) + ` (${bundle.visualScore}/100)`);
    console.log('   Style Profile: ' + bundle.styleProfile);
    console.log('   ');
    console.log('   🎩 Suit: ' + bundle.suit.name);
    console.log('   👔 Shirt: ' + bundle.shirt.name);
    console.log('   🎀 Tie: ' + bundle.tie.name);
    console.log('   ');
    console.log('   📊 Visual Analysis:');
    console.log(`      • Color Harmony: ${bundle.aestheticAnalysis.colorHarmony}%`);
    console.log(`      • Contrast Balance: ${bundle.aestheticAnalysis.contrastBalance}%`);
    console.log(`      • Trend Alignment: ${bundle.aestheticAnalysis.trendAlignment}%`);
    console.log(`      • Visual Impact: ${bundle.aestheticAnalysis.visualImpact}%`);
    console.log('   ');
    console.log('   🤖 Fashion CLIP Says: ' + bundle.fashionClipReasoning);
    console.log('   ');
    console.log('   🏷️ Visual Keywords: ' + bundle.visualKeywords.join(', '));
    console.log('   📅 Perfect For: ' + bundle.recommendedOccasions.join(', '));
    console.log('   ' + '-'.repeat(76));
  });

  // Summary statistics
  console.log('\n' + '='.repeat(80));
  console.log('FASHION CLIP ANALYSIS SUMMARY');
  console.log('='.repeat(80));
  
  const avgVisualScore = bundles.reduce((sum, b) => sum + b.visualScore, 0) / bundles.length;
  const avgColorHarmony = bundles.reduce((sum, b) => sum + b.aestheticAnalysis.colorHarmony, 0) / bundles.length;
  const avgContrast = bundles.reduce((sum, b) => sum + b.aestheticAnalysis.contrastBalance, 0) / bundles.length;
  const avgTrend = bundles.reduce((sum, b) => sum + b.aestheticAnalysis.trendAlignment, 0) / bundles.length;
  const avgImpact = bundles.reduce((sum, b) => sum + b.aestheticAnalysis.visualImpact, 0) / bundles.length;

  console.log(`📊 Average Visual Score: ${avgVisualScore.toFixed(1)}/100`);
  console.log(`🎨 Average Color Harmony: ${avgColorHarmony.toFixed(1)}%`);
  console.log(`⚖️ Average Contrast Balance: ${avgContrast.toFixed(1)}%`);
  console.log(`📈 Average Trend Alignment: ${avgTrend.toFixed(1)}%`);
  console.log(`💥 Average Visual Impact: ${avgImpact.toFixed(1)}%`);

  // Style distribution
  const styleProfiles = bundles.map(b => b.styleProfile);
  const uniqueStyles = [...new Set(styleProfiles)];
  console.log(`\n🎭 Style Diversity: ${uniqueStyles.length} unique style profiles`);
  console.log(`📍 Covering occasions from: Corporate to Creative, Formal to Casual`);

  // Top performers
  const topBundles = bundles.sort((a, b) => b.visualScore - a.visualScore).slice(0, 3);
  console.log('\n🏆 TOP 3 VISUALLY PERFECT COMBINATIONS:');
  topBundles.forEach((bundle, i) => {
    console.log(`   ${i + 1}. ${bundle.name} (Score: ${bundle.visualScore})`);
  });
}

// Execute the generation
generateAndDisplayFashionClipBundles();
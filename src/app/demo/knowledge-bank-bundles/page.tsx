'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, TrendingUp, Package, Star, Users, Zap,
  Calendar, Award, ShoppingCart, Info
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SmartBundleCard } from '@/components/bundles/SmartBundleCard';
import { knowledgeBankBundles } from '@/lib/services/knowledgeBankBundles';
import { SmartBundle } from '@/lib/services/smartBundles';
import { TOP_COMBINATIONS, COMBINATION_CONVERSION_DATA } from '@/lib/data/knowledgeBank/topCombinations';

export default function KnowledgeBankBundlesPage() {
  const [topBundles, setTopBundles] = useState<SmartBundle[]>([]);
  const [trendingBundles, setTrendingBundles] = useState<SmartBundle[]>([]);
  const [seasonalBundles, setSeasonalBundles] = useState<SmartBundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'top' | 'trending' | 'seasonal'>('top');

  useEffect(() => {
    loadBundles();
  }, []);

  const loadBundles = async () => {
    setLoading(true);
    try {
      const [top, trending, seasonal] = await Promise.all([
        knowledgeBankBundles.generateTopBundles(),
        knowledgeBankBundles.generateTrendingBundles(),
        knowledgeBankBundles.generateSeasonalBundles('spring')
      ]);
      
      setTopBundles(top);
      setTrendingBundles(trending);
      setSeasonalBundles(seasonal);
    } catch (error) {
      console.error('Failed to load bundles:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentBundles = () => {
    switch (activeTab) {
      case 'trending': return trendingBundles;
      case 'seasonal': return seasonalBundles;
      default: return topBundles;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-r from-gold to-amber-600 rounded-full flex items-center justify-center">
              <Brain className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Knowledge Bank Smart Bundles
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AI-curated outfit combinations backed by data from 10,000+ successful events 
            and proven conversion rates
          </p>
        </div>

        {/* Stats Banner */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-600">10,000+</div>
              <div className="text-sm text-gray-600">Events Analyzed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">87%</div>
              <div className="text-sm text-gray-600">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">24.3%</div>
              <div className="text-sm text-gray-600">Top Conversion Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-600">4.8/5</div>
              <div className="text-sm text-gray-600">Avg Customer Rating</div>
            </div>
          </div>
        </Card>

        {/* Bundle Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-sm p-1 inline-flex">
            <button
              onClick={() => setActiveTab('top')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === 'top'
                  ? 'bg-gold text-black'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Award className="w-4 h-4 inline mr-2" />
              Top Performers
            </button>
            <button
              onClick={() => setActiveTab('trending')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === 'trending'
                  ? 'bg-gold text-black'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Trending Now
            </button>
            <button
              onClick={() => setActiveTab('seasonal')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === 'seasonal'
                  ? 'bg-gold text-black'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Seasonal Favorites
            </button>
          </div>
        </div>

        {/* Bundle Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getCurrentBundles().map((bundle, index) => (
              <motion.div
                key={bundle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <SmartBundleCard
                  bundle={bundle}
                  showCompatibilityDetails={true}
                  onAddToCart={() => alert(`Added ${bundle.name} to cart!`)}
                  onViewDetails={() => console.log('View details:', bundle)}
                  onSaveBundle={() => alert(`Saved ${bundle.name} to wishlist!`)}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Knowledge Bank Insights */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Top Combination Insights
            </h3>
            <div className="space-y-3">
              {TOP_COMBINATIONS.slice(0, 3).map((combo, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-sm">
                      {combo.combination.suit} + {combo.combination.shirt} + {combo.combination.tie}
                    </div>
                    <div className="text-xs text-gray-600">{combo.best_for}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-600">
                      {combo.usage_rate} adoption
                    </div>
                    <div className="text-xs text-gray-500">
                      {combo.popularity_score}/100 score
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Customer Success Stories
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">11,100 units sold</div>
                    <div className="text-sm text-gray-600">Navy + White + Burgundy</div>
                  </div>
                </div>
                <div className="text-sm text-blue-700">
                  "The most versatile combination - works for any formal occasion"
                </div>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium">+30% growth YoY</div>
                    <div className="text-sm text-gray-600">Sage Green combinations</div>
                  </div>
                </div>
                <div className="text-sm text-green-700">
                  "Nature-inspired colors are the fastest growing trend"
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Feature Highlights */}
        <div className="mt-12 bg-white rounded-xl p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-center mb-8">
            Why Knowledge Bank Bundles Convert Better
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Data-Driven Selection</h4>
              <p className="text-sm text-gray-600">
                Every combination is backed by real conversion data from thousands 
                of successful purchases
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">Social Validation</h4>
              <p className="text-sm text-gray-600">
                Show customers exactly how many others have chosen and loved 
                these exact combinations
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Instant Confidence</h4>
              <p className="text-sm text-gray-600">
                Remove decision paralysis with pre-validated combinations that 
                are guaranteed to work
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
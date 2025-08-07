"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Sparkles, 
  MessageSquare, 
  Camera, 
  Ruler, 
  ShirtIcon,
  ArrowRight,
  Brain,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { OutfitRecommendations } from '@/components/ai/OutfitRecommendations'
import { StyleMatcher } from '@/components/ai/StyleMatcher'
import { SizeAssistant } from '@/components/ai/SizeAssistant'
import Link from 'next/link'

type AIFeature = 'outfit' | 'size' | 'style' | 'chat' | null

export default function AtelierAIPage() {
  const [activeFeature, setActiveFeature] = useState<AIFeature>(null)

  const features = [
    {
      id: 'outfit' as AIFeature,
      title: 'Outfit Recommendations',
      description: 'Get AI-powered outfit suggestions for any occasion',
      icon: ShirtIcon,
      color: 'bg-burgundy',
      available: true
    },
    {
      id: 'size' as AIFeature,
      title: 'Smart Size Assistant',
      description: 'Find your perfect fit with AI-powered size predictions',
      icon: Ruler,
      color: 'bg-blue-600',
      available: true
    },
    {
      id: 'style' as AIFeature,
      title: 'Style Match from Photo',
      description: 'Upload a photo and find similar items in our collection',
      icon: Camera,
      color: 'bg-purple-600',
      available: true
    },
    {
      id: 'chat' as AIFeature,
      title: 'Personal Shopping Assistant',
      description: 'Chat with our AI stylist for personalized advice',
      icon: MessageSquare,
      color: 'bg-green-600',
      available: true
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
        <div className="container-main relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 text-burgundy mb-6">
              <Sparkles className="h-6 w-6" />
              <span className="text-sm font-semibold tracking-widest uppercase">Introducing</span>
              <Sparkles className="h-6 w-6" />
            </div>
            <h1 className="text-5xl md:text-7xl font-serif mb-6">
              Atelier AI
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              Your personal AI-powered fashion consultant. Get expert styling advice, 
              perfect fit recommendations, and curated outfits tailored just for you.
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-burgundy" />
                <span>Powered by GPT-4</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-burgundy" />
                <span>Instant Recommendations</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid or Active Feature */}
      {!activeFeature ? (
        <section className="py-20">
          <div className="container-main">
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className={`relative overflow-hidden ${
                      feature.available 
                        ? 'hover:shadow-xl cursor-pointer transform hover:scale-105' 
                        : 'opacity-75'
                    } transition-all duration-300`}
                    onClick={() => feature.available && setActiveFeature(feature.id)}
                  >
                    <div className="p-8">
                      <div className={`inline-flex p-3 rounded-xl ${feature.color} text-white mb-4`}>
                        <feature.icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-2xl font-serif mb-3">{feature.title}</h3>
                      <p className="text-gray-600 mb-4">{feature.description}</p>
                      
                      {feature.available ? (
                        <Button 
                          className="bg-burgundy hover:bg-burgundy-700 text-white"
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveFeature(feature.id)
                          }}
                        >
                          Try Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      ) : (
                        <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                          <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                          Coming Soon
                        </div>
                      )}
                    </div>
                    
                    {feature.comingSoon && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                          In Development
                        </span>
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-16"
            >
              <p className="text-gray-600 mb-6">
                Want to see more AI features? Let us know what you'd like to see next.
              </p>
              <Link href="/contact">
                <Button variant="outline">
                  Share Your Ideas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      ) : (
        <section className="py-20">
          <div className="container-main">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => setActiveFeature(null)}
              className="mb-8"
            >
              ← Back to AI Features
            </Button>

            {/* Active Feature Component */}
            {activeFeature === 'outfit' && <OutfitRecommendations />}
            {activeFeature === 'style' && <StyleMatcher />}
            {activeFeature === 'size' && (
              <div className="max-w-2xl mx-auto">
                <SizeAssistant 
                  productId="demo-product" 
                  productName="Premium Navy Suit"
                  productBrand="Hugo Boss"
                />
              </div>
            )}
            {/* Chat feature will be added later */}
          </div>
        </section>
      )}

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">
              Why Choose Atelier AI?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of menswear shopping with intelligent features designed to save you time and enhance your style
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="inline-flex p-4 bg-burgundy/10 rounded-full mb-4">
                <Brain className="h-8 w-8 text-burgundy" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Learning</h3>
              <p className="text-gray-600">
                Our AI learns your preferences over time to provide increasingly personalized recommendations
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex p-4 bg-burgundy/10 rounded-full mb-4">
                <Zap className="h-8 w-8 text-burgundy" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Results</h3>
              <p className="text-gray-600">
                Get outfit suggestions, size predictions, and style matches in seconds, not hours
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex p-4 bg-burgundy/10 rounded-full mb-4">
                <Sparkles className="h-8 w-8 text-burgundy" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Curation</h3>
              <p className="text-gray-600">
                Combines AI technology with fashion expertise for recommendations you can trust
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
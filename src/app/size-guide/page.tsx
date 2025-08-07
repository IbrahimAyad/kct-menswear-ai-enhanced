'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { EnhancedSizeBot } from '@/components/sizing/EnhancedSizeBot';
import { Ruler, TrendingUp, Shield, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SizeGuidePage() {
  const [showSizeBot, setShowSizeBot] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-72 h-72 bg-burgundy rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gold rounded-full blur-3xl"></div>
        </div>
        
        <div className="container-main relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-serif mb-6">
              Find Your Perfect Fit
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Our AI-powered sizing technology ensures you get the perfect fit every time. 
              95% accuracy rate with personalized recommendations.
            </p>
            <Button
              size="lg"
              onClick={() => setShowSizeBot(true)}
              className="bg-burgundy hover:bg-burgundy-700 text-white px-10 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Start AI Size Finder
              <TrendingUp className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container-main">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-burgundy" />
              </div>
              <h3 className="text-xl font-semibold mb-3">95% Accuracy</h3>
              <p className="text-gray-600">
                Advanced AI algorithms analyze your measurements and body type for precise sizing
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-gold" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Perfect Fit Guarantee</h3>
              <p className="text-gray-600">
                Free alterations included with every purchase to ensure your complete satisfaction
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="h-8 w-8 text-burgundy" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Easy Returns</h3>
              <p className="text-gray-600">
                30-day return policy if the fit isn't perfect, though 92% keep their first order
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Standard Size Chart */}
      <section className="py-16 bg-gray-50">
        <div className="container-main">
          <h2 className="text-3xl font-serif text-center mb-12">Standard Size Chart</h2>
          
          {/* Suits & Jackets */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-6">Suits & Jackets</h3>
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-sm">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="px-6 py-4 text-left font-semibold">Size</th>
                    <th className="px-6 py-4 text-center font-semibold">Chest (in)</th>
                    <th className="px-6 py-4 text-center font-semibold">Waist (in)</th>
                    <th className="px-6 py-4 text-center font-semibold">Sleeve (in)</th>
                    <th className="px-6 py-4 text-center font-semibold">Shoulder (in)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">36S</td>
                    <td className="px-6 py-4 text-center">36</td>
                    <td className="px-6 py-4 text-center">30</td>
                    <td className="px-6 py-4 text-center">31.5</td>
                    <td className="px-6 py-4 text-center">17.5</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">38R</td>
                    <td className="px-6 py-4 text-center">38</td>
                    <td className="px-6 py-4 text-center">32</td>
                    <td className="px-6 py-4 text-center">32.5</td>
                    <td className="px-6 py-4 text-center">18</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">40R</td>
                    <td className="px-6 py-4 text-center">40</td>
                    <td className="px-6 py-4 text-center">34</td>
                    <td className="px-6 py-4 text-center">33</td>
                    <td className="px-6 py-4 text-center">18.5</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">42R</td>
                    <td className="px-6 py-4 text-center">42</td>
                    <td className="px-6 py-4 text-center">36</td>
                    <td className="px-6 py-4 text-center">33.5</td>
                    <td className="px-6 py-4 text-center">19</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">44L</td>
                    <td className="px-6 py-4 text-center">44</td>
                    <td className="px-6 py-4 text-center">38</td>
                    <td className="px-6 py-4 text-center">34.5</td>
                    <td className="px-6 py-4 text-center">19.5</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">46L</td>
                    <td className="px-6 py-4 text-center">46</td>
                    <td className="px-6 py-4 text-center">40</td>
                    <td className="px-6 py-4 text-center">35</td>
                    <td className="px-6 py-4 text-center">20</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Dress Shirts */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-6">Dress Shirts</h3>
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-sm">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="px-6 py-4 text-left font-semibold">Size</th>
                    <th className="px-6 py-4 text-center font-semibold">Neck (in)</th>
                    <th className="px-6 py-4 text-center font-semibold">Sleeve (in)</th>
                    <th className="px-6 py-4 text-center font-semibold">Chest (in)</th>
                    <th className="px-6 py-4 text-center font-semibold">Waist (in)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">S</td>
                    <td className="px-6 py-4 text-center">14-14.5</td>
                    <td className="px-6 py-4 text-center">32-33</td>
                    <td className="px-6 py-4 text-center">34-36</td>
                    <td className="px-6 py-4 text-center">28-30</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">M</td>
                    <td className="px-6 py-4 text-center">15-15.5</td>
                    <td className="px-6 py-4 text-center">33-34</td>
                    <td className="px-6 py-4 text-center">38-40</td>
                    <td className="px-6 py-4 text-center">32-34</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">L</td>
                    <td className="px-6 py-4 text-center">16-16.5</td>
                    <td className="px-6 py-4 text-center">34-35</td>
                    <td className="px-6 py-4 text-center">42-44</td>
                    <td className="px-6 py-4 text-center">36-38</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">XL</td>
                    <td className="px-6 py-4 text-center">17-17.5</td>
                    <td className="px-6 py-4 text-center">35-36</td>
                    <td className="px-6 py-4 text-center">46-48</td>
                    <td className="px-6 py-4 text-center">40-42</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">XXL</td>
                    <td className="px-6 py-4 text-center">18-18.5</td>
                    <td className="px-6 py-4 text-center">36-37</td>
                    <td className="px-6 py-4 text-center">50-52</td>
                    <td className="px-6 py-4 text-center">44-46</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Measurement Guide */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-2xl font-semibold mb-6">How to Measure</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Ruler className="h-5 w-5 text-burgundy" />
                  Chest
                </h4>
                <p className="text-gray-600 mb-4">
                  Measure around the fullest part of your chest, keeping the tape horizontal and snug but not tight.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Ruler className="h-5 w-5 text-burgundy" />
                  Waist
                </h4>
                <p className="text-gray-600 mb-4">
                  Measure around your natural waistline, keeping the tape comfortably loose.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Ruler className="h-5 w-5 text-burgundy" />
                  Sleeve Length
                </h4>
                <p className="text-gray-600 mb-4">
                  Measure from the center back of your neck, across the shoulder, and down to your wrist.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Ruler className="h-5 w-5 text-burgundy" />
                  Inseam
                </h4>
                <p className="text-gray-600 mb-4">
                  Measure from the top of your inner thigh down to the bottom of your ankle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white">
        <div className="container-main text-center">
          <h2 className="text-3xl font-serif mb-6">Still Not Sure About Your Size?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Our AI Size Finder uses advanced algorithms to recommend the perfect size based on your measurements and fit preferences.
          </p>
          <Button
            size="lg"
            onClick={() => setShowSizeBot(true)}
            className="bg-gold hover:bg-gold/90 text-black px-10 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            Try AI Size Finder
            <TrendingUp className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Enhanced Size Bot Modal */}
      {showSizeBot && (
        <EnhancedSizeBot
          onClose={() => setShowSizeBot(false)}
          onSizeSelected={(recommendation) => {
            console.log('Size recommendation:', recommendation);
            // Handle size selection
          }}
        />
      )}
    </div>
  );
}
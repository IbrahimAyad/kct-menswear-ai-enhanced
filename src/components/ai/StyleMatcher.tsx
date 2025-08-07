"use client"

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Camera, 
  Upload, 
  X, 
  Loader2, 
  ShoppingBag,
  Eye,
  Info,
  Sparkles,
  Image as ImageIcon,
  Check,
  ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { formatPrice } from '@/lib/utils/format'
import Image from 'next/image'
import Link from 'next/link'
import type { StyleAnalysis, StyleMatch } from '@/lib/ai/types'

interface StyleMatcherProps {
  className?: string
}

export function StyleMatcher({ className }: StyleMatcherProps) {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<StyleAnalysis | null>(null)
  const [styleMatch, setStyleMatch] = useState<StyleMatch | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [selectedBudget, setSelectedBudget] = useState<'economy' | 'standard' | 'premium'>('standard')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeStyle = async () => {
    if (!imageFile) return

    setIsAnalyzing(true)
    try {
      const formData = new FormData()
      formData.append('image', imageFile)

      const response = await fetch('/api/ai/style-analysis', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      if (data.success) {
        setAnalysis(data.analysis)
        setStyleMatch(data.matches)
        setShowResults(true)
      }
    } catch (error) {
      console.error('Style analysis error:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetAnalysis = () => {
    setImageFile(null)
    setImagePreview(null)
    setAnalysis(null)
    setStyleMatch(null)
    setShowResults(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 text-burgundy mb-4">
          <Camera className="h-5 w-5" />
          <span className="text-sm font-semibold tracking-widest uppercase">Style Match</span>
          <Camera className="h-5 w-5" />
        </div>
        <h2 className="text-3xl md:text-4xl font-serif mb-4">
          Find Your Look with AI
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload a photo of an outfit you love, and our AI will find similar items from our collection
        </p>
      </div>

      {!showResults ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          {/* Upload Area */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className={cn(
              "relative border-2 border-dashed rounded-lg p-8 transition-all",
              "hover:border-burgundy hover:bg-burgundy/5",
              imagePreview ? "border-burgundy bg-burgundy/5" : "border-gray-300"
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {imagePreview ? (
              <div className="space-y-4">
                <div className="relative aspect-[3/4] max-h-96 mx-auto overflow-hidden rounded-lg">
                  <Image
                    src={imagePreview}
                    alt="Upload preview"
                    fill
                    className="object-contain"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={resetAnalysis}
                    className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Great choice! Click analyze to find similar styles
                  </p>
                  <Button
                    onClick={analyzeStyle}
                    disabled={isAnalyzing}
                    className="bg-burgundy hover:bg-burgundy-700 text-white px-8"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing Style...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Analyze Style
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="text-center cursor-pointer"
              >
                <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                  <Upload className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Drop an image here or click to upload
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Supports JPG, PNG, WebP up to 10MB
                </p>
                <Button variant="outline">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Choose Image
                </Button>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="inline-flex p-2 bg-burgundy/10 rounded-full mb-2">
                <Camera className="h-5 w-5 text-burgundy" />
              </div>
              <h4 className="font-medium mb-1">Clear Photos</h4>
              <p className="text-sm text-gray-600">
                Use well-lit photos with visible outfit details
              </p>
            </div>
            <div className="text-center p-4">
              <div className="inline-flex p-2 bg-burgundy/10 rounded-full mb-2">
                <Eye className="h-5 w-5 text-burgundy" />
              </div>
              <h4 className="font-medium mb-1">Full Outfit</h4>
              <p className="text-sm text-gray-600">
                Include as many pieces as possible for best results
              </p>
            </div>
            <div className="text-center p-4">
              <div className="inline-flex p-2 bg-burgundy/10 rounded-full mb-2">
                <Sparkles className="h-5 w-5 text-burgundy" />
              </div>
              <h4 className="font-medium mb-1">Any Style</h4>
              <p className="text-sm text-gray-600">
                From casual to formal, we'll find matches
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          {/* Back Button */}
          <Button
            variant="outline"
            onClick={resetAnalysis}
            className="mb-6"
          >
            ← Analyze Another Photo
          </Button>

          {/* Analysis Results */}
          {analysis && styleMatch && (
            <div className="grid md:grid-cols-3 gap-8">
              {/* Original Image & Analysis */}
              <div className="md:col-span-1">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Style Analysis</h3>
                  
                  {/* Image */}
                  <div className="relative aspect-square mb-4 overflow-hidden rounded-lg">
                    <Image
                      src={imagePreview!}
                      alt="Analyzed outfit"
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Detected Items */}
                  <div className="space-y-2 mb-4">
                    <h4 className="text-sm font-medium text-gray-700">Detected Items:</h4>
                    {analysis.detectedItems.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Check className="h-3 w-3 text-green-600" />
                        <span className="capitalize">{item.category.replace('-', ' ')}</span>
                        <span className="text-gray-500">({item.color})</span>
                      </div>
                    ))}
                  </div>

                  {/* Style Info */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Style:</span>
                      <span className="font-medium capitalize">{analysis.styleCategory}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Formality:</span>
                      <span className="font-medium">{analysis.formalityLevel}/10</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Match Score:</span>
                      <span className="font-medium text-burgundy">
                        {Math.round(styleMatch.similarityScore * 100)}%
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Style Notes */}
                <Card className="p-6 mt-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Style Notes
                  </h4>
                  <ul className="space-y-2">
                    {styleMatch.styleNotes.map((note, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-burgundy mt-0.5">•</span>
                        {note}
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>

              {/* Matched Products */}
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Complete the Look</h3>
                  
                  {/* Budget Selector */}
                  <div className="flex gap-2">
                    {(['economy', 'standard', 'premium'] as const).map(tier => (
                      <button
                        key={tier}
                        onClick={() => setSelectedBudget(tier)}
                        className={cn(
                          "px-3 py-1 rounded-full text-sm font-medium transition-all",
                          selectedBudget === tier
                            ? "bg-burgundy text-white"
                            : "bg-gray-100 hover:bg-gray-200"
                        )}
                      >
                        {tier.charAt(0).toUpperCase() + tier.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product Grid */}
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  {styleMatch.completeLook.items.map((item, index) => (
                    <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 bg-gray-100 rounded" />
                          <div className="flex-1">
                            <h4 className="font-medium capitalize">
                              {item.category.replace('-', ' ')}
                            </h4>
                            {item.essential && (
                              <Badge variant="secondary" className="mt-1">Essential</Badge>
                            )}
                          </div>
                          <Link href={`/products/${item.productId}`}>
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Missing Pieces */}
                {styleMatch.completeLook.missingPieces.length > 0 && (
                  <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <Info className="inline h-4 w-4 mr-1" />
                      To complete this look, you might also need: {' '}
                      {styleMatch.completeLook.missingPieces.join(', ')}
                    </p>
                  </div>
                )}

                {/* Total Price & Actions */}
                <div className="flex items-center justify-between p-6 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Total for {selectedBudget} option</p>
                    <p className="text-2xl font-bold">
                      {formatPrice(
                        styleMatch.budgetOptions.find(b => b.tier === selectedBudget)?.totalPrice || 
                        styleMatch.completeLook.totalPrice
                      )}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline">
                      Save Look
                    </Button>
                    <Button className="bg-burgundy hover:bg-burgundy-700 text-white">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Add All to Cart
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
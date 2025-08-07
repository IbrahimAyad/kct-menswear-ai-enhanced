'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Info, Ruler, Star } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { 
  getSizeTemplate, 
  getShirtSizeOptions, 
  formatShirtSize,
  isPopularSize,
  sortSizesWithPopular,
  getSizeRecommendation,
  type UserMeasurements
} from '@/lib/products/sizing'

interface SizeSelectorProps {
  category: string
  availableSizes: string[]
  selectedSize: string
  onSizeSelect: (size: string) => void
  onSizeGuideClick: () => void
  userMeasurements?: UserMeasurements
  className?: string
}

export function SizeSelector({
  category,
  availableSizes,
  selectedSize,
  onSizeSelect,
  onSizeGuideClick,
  userMeasurements,
  className
}: SizeSelectorProps) {
  const template = getSizeTemplate(category)
  const recommendation = userMeasurements 
    ? getSizeRecommendation(category, userMeasurements)
    : null

  // For two-step shirt selection
  const [selectedNeck, setSelectedNeck] = useState('')
  const [selectedSleeve, setSelectedSleeve] = useState('')
  const shirtOptions = getShirtSizeOptions()

  // Sort sizes with popular ones first
  const sortedSizes = sortSizesWithPopular(category, availableSizes)

  // Handle two-step shirt size selection
  useEffect(() => {
    if (template.displayType === 'two-step' && selectedNeck && selectedSleeve) {
      const combinedSize = formatShirtSize(selectedNeck, selectedSleeve)
      if (availableSizes.includes(combinedSize)) {
        onSizeSelect(combinedSize)
      }
    }
  }, [selectedNeck, selectedSleeve, template.displayType, availableSizes, onSizeSelect])

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-900">Size</label>
          {recommendation && (
            <Badge variant="secondary" className="text-xs">
              <Star className="h-3 w-3 mr-1" />
              Recommended: {recommendation}
            </Badge>
          )}
        </div>
        <button
          onClick={onSizeGuideClick}
          className="text-sm text-gold hover:underline flex items-center gap-1"
        >
          <Ruler className="h-4 w-4" />
          Size Guide
        </button>
      </div>

      {/* Grid Layout (Suits, Blazers) */}
      {template.displayType === 'grid' && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {sortedSizes.map((size) => {
            const isRecommended = recommendation === size
            const isPopular = isPopularSize(category, size)
            
            return (
              <button
                key={size}
                onClick={() => onSizeSelect(size)}
                className={cn(
                  "relative py-2 px-3 border rounded-md text-sm font-medium transition-all",
                  selectedSize === size
                    ? "border-gold bg-gold/10 text-gray-900"
                    : "border-gray-300 text-gray-700 hover:border-gray-400",
                  isRecommended && "ring-2 ring-green-500 ring-offset-1"
                )}
              >
                {size}
                {isPopular && !isRecommended && (
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-2 -right-2 text-xs px-1 py-0"
                  >
                    Popular
                  </Badge>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Dropdown Layout (Sweaters, Shoes) */}
      {template.displayType === 'dropdown' && (
        <Select value={selectedSize} onValueChange={onSizeSelect}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a size" />
          </SelectTrigger>
          <SelectContent>
            {sortedSizes.map((size) => {
              const isRecommended = recommendation === size
              const isPopular = isPopularSize(category, size)
              
              return (
                <SelectItem key={size} value={size}>
                  <div className="flex items-center gap-2">
                    <span>{size}</span>
                    {isRecommended && (
                      <Badge variant="secondary" className="text-xs">
                        Recommended
                      </Badge>
                    )}
                    {isPopular && !isRecommended && (
                      <Badge variant="outline" className="text-xs">
                        Popular
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      )}

      {/* Two-Step Layout (Dress Shirts) */}
      {template.displayType === 'two-step' && (
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Neck Size</label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {shirtOptions.neck.map((neck) => {
                const hasThisNeck = availableSizes.some(size => 
                  size.startsWith(`${neck}/`)
                )
                const isPopularNeck = shirtOptions.neck.slice(2, 6).includes(neck)
                
                return (
                  <button
                    key={neck}
                    onClick={() => setSelectedNeck(neck)}
                    disabled={!hasThisNeck}
                    className={cn(
                      "relative py-1.5 px-2 border rounded text-sm font-medium transition-all",
                      selectedNeck === neck
                        ? "border-gold bg-gold/10 text-gray-900"
                        : hasThisNeck
                        ? "border-gray-300 text-gray-700 hover:border-gray-400"
                        : "border-gray-200 text-gray-400 cursor-not-allowed",
                      isPopularNeck && hasThisNeck && "font-semibold"
                    )}
                  >
                    {neck}
                  </button>
                )
              })}
            </div>
          </div>

          {selectedNeck && (
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Sleeve Length</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {shirtOptions.sleeve.map((sleeve) => {
                  const combinedSize = formatShirtSize(selectedNeck, sleeve)
                  const isAvailable = availableSizes.includes(combinedSize)
                  const isPopularSleeve = shirtOptions.sleeve.slice(1, 3).includes(sleeve)
                  
                  return (
                    <button
                      key={sleeve}
                      onClick={() => setSelectedSleeve(sleeve)}
                      disabled={!isAvailable}
                      className={cn(
                        "py-1.5 px-3 border rounded text-sm font-medium transition-all",
                        selectedSleeve === sleeve
                          ? "border-gold bg-gold/10 text-gray-900"
                          : isAvailable
                          ? "border-gray-300 text-gray-700 hover:border-gray-400"
                          : "border-gray-200 text-gray-400 cursor-not-allowed",
                        isPopularSleeve && isAvailable && "font-semibold"
                      )}
                    >
                      {sleeve}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Size recommendation info */}
      {recommendation && (
        <div className="flex items-start gap-2 p-3 bg-green-50 rounded-md">
          <Info className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
          <p className="text-sm text-green-800">
            Based on your measurements, we recommend size <strong>{recommendation}</strong>
          </p>
        </div>
      )}
    </div>
  )
}
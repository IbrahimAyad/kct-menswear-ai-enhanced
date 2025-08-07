'use client'

import { Info, Ruler } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { 
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
  const recommendation = userMeasurements 
    ? getSizeRecommendation(category, userMeasurements)
    : null

  // Sort sizes with popular ones first
  const sortedSizes = sortSizesWithPopular(category, availableSizes)

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-900">Size</label>
        <button
          onClick={onSizeGuideClick}
          className="text-sm text-gold hover:underline flex items-center gap-1"
        >
          <Ruler className="h-4 w-4" />
          Size Guide
        </button>
      </div>

      {/* Simple Grid Layout for ALL categories - matching core products */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {sortedSizes.map((size) => {
          const isRecommended = recommendation === size
          const isPopular = isPopularSize(category, size)
          
          return (
            <button
              key={size}
              onClick={() => onSizeSelect(size)}
              className={cn(
                "py-2 px-4 border rounded-md text-sm font-medium transition-all",
                selectedSize === size
                  ? "border-gold bg-gold/10 text-gray-900"
                  : "border-gray-300 text-gray-700 hover:border-gray-400"
              )}
            >
              {size}
            </button>
          )
        })}
      </div>

      {/* Size recommendation info - only show if we have user measurements */}
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
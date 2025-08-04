'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Loader2, ImageIcon, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export default function FixImagesPage() {
  const [isFixing, setIsFixing] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFix = async () => {
    setIsFixing(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch('/api/fix-product-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fix images')
      }

      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsFixing(false)
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Fix Product Images</h1>
      
      <Card className="p-6 mb-8">
        <div className="flex items-start gap-4 mb-6">
          <ImageIcon className="h-8 w-8 text-gold mt-1" />
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">Fix UUID Image URLs</h2>
            <p className="text-gray-600 mb-4">
              This will replace all UUID image references with actual Cloudflare R2 URLs.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  This is a one-time fix to correct the image URLs in your Supabase database. 
                  After running this, all products should display their images correctly.
                </span>
              </p>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleFix} 
          disabled={isFixing}
          size="lg"
          className="w-full md:w-auto"
        >
          {isFixing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Fixing Images...
            </>
          ) : (
            <>
              <ImageIcon className="mr-2 h-4 w-4" />
              Fix All Product Images
            </>
          )}
        </Button>
      </Card>

      {error && (
        <Card className="p-6 mb-8 border-red-200 bg-red-50">
          <div className="flex items-center gap-3">
            <XCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-800">Error: {error}</p>
          </div>
        </Card>
      )}

      {results && (
        <div className="space-y-6">
          <Card className="p-6 border-green-200 bg-green-50">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h2 className="text-lg font-semibold text-green-900">Fix Complete</h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-700">{results.summary.totalProducts}</p>
                <p className="text-sm text-green-600">Total Products</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-700">{results.summary.fixedProducts}</p>
                <p className="text-sm text-green-600">Fixed Successfully</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-700">{results.summary.errors}</p>
                <p className="text-sm text-red-600">Errors</p>
              </div>
            </div>
            {results.message && (
              <p className="mt-4 text-sm text-gray-700 text-center">{results.message}</p>
            )}
          </Card>
        </div>
      )}
    </div>
  )
}
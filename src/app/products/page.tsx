"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Search, 
  Filter, 
  X, 
  ChevronDown,
  Grid3X3,
  List,
  SlidersHorizontal 
} from "lucide-react";
import { EnhancedProduct, ProductFilters, ProductSortOptions } from "@/lib/supabase/types";
import { SupabaseProductCard } from "@/components/shop/SupabaseProductCard";
import { ProductFiltersPanel } from "@/components/shop/ProductFiltersPanel";
import { CategoryPills, menswearCategories } from "@/components/shop/CategoryPills";
import { SupabaseConfigError } from "@/components/ui/SupabaseConfigError";
import { cn } from "@/lib/utils/cn";

interface ProductsResponse {
  products: EnhancedProduct[]
  totalCount: number
  currentPage: number
  totalPages: number
}

interface FilterMetadata {
  categories: string[]
  vendors: string[]
  colors: string[]
  priceRange: { min: number; max: number }
}

function ProductsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [products, setProducts] = useState<EnhancedProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [filters, setFilters] = useState<ProductFilters>({})
  const [sort, setSort] = useState<ProductSortOptions>({ field: 'created_at', direction: 'desc' })
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const [filterMetadata, setFilterMetadata] = useState<FilterMetadata>({
    categories: [],
    vendors: [],
    colors: [],
    priceRange: { min: 0, max: 1000 }
  })

  // Load filter metadata on component mount
  useEffect(() => {
    const loadFilterMetadata = async () => {
      try {
        const [categoriesRes, vendorsRes, colorsRes, priceRangeRes] = await Promise.all([
          fetch('/api/supabase/products?meta=categories'),
          fetch('/api/supabase/products?meta=vendors'),
          fetch('/api/supabase/products?meta=colors'),
          fetch('/api/supabase/products?meta=price-range')
        ])

        const [categoriesData, vendorsData, colorsData, priceRangeData] = await Promise.all([
          categoriesRes.json(),
          vendorsRes.json(),
          colorsRes.json(),
          priceRangeRes.json()
        ])

        setFilterMetadata({
          categories: categoriesData.categories || [],
          vendors: vendorsData.vendors || [],
          colors: colorsData.colors || [],
          priceRange: priceRangeData.priceRange || { min: 0, max: 1000 }
        })
      } catch (error) {

}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-gold mx-auto mb-4" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
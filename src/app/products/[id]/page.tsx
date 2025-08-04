import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/supabase/products'
import { ProductDetailClient } from './ProductDetailClient'

interface ProductPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.id)
  
  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  return {
    title: `${product.name} | KCT Menswear`,
    description: product.metaDescription || product.description || `Shop ${product.name} from our premium collection`,
    openGraph: {
      title: product.name,
      description: product.description || `Premium ${product.category}`,
      images: product.images[0] ? [product.images[0]] : [],
      type: 'website',
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  return <ProductDetailClient product={product} />
}
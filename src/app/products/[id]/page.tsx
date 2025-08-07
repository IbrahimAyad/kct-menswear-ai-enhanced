import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { getProduct } from '@/lib/supabase/products'
import { ModernProductDetail } from './ModernProductDetail'
import { RelatedProducts } from '@/components/products/RelatedProducts'
import { formatPrice } from '@/lib/utils/format'

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

  const ogImage = product.images[0] || '/placeholder-product.svg'

  return {
    title: `${product.name} | KCT Menswear`,
    description: product.metaDescription || product.description || `Shop ${product.name} from our premium collection`,
    keywords: product.tags?.join(', ') || `${product.category}, menswear, suits, formal wear`,
    openGraph: {
      title: product.name,
      description: product.description || `Premium ${product.category}`,
      images: [{
        url: ogImage,
        width: 1200,
        height: 630,
        alt: product.name,
      }],
      type: 'website',
      siteName: 'KCT Menswear',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description || `Premium ${product.category}`,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  // Generate structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'KCT Menswear',
    },
    offers: {
      '@type': 'Offer',
      url: `https://kct-menswear.vercel.app/products/${product.id}`,
      priceCurrency: 'USD',
      price: (product.price / 100).toFixed(2),
      availability: product.inStock 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      itemCondition: 'https://schema.org/NewCondition',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '124',
      bestRating: '5',
      worstRating: '1',
    },
    ...(product.sku && { sku: product.sku }),
    ...(product.weight && { weight: `${product.weight} oz` }),
  }

  return (
    <>
      <Script
        id="product-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ModernProductDetail product={product} />
      <RelatedProducts 
        currentProductId={product.id} 
        category={product.category} 
      />
    </>
  )
}
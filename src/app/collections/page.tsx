import { Suspense } from 'react';
import { DynamicMasterCollectionClient } from '@/components/collections/DynamicMasterCollectionClient';
import { Metadata } from 'next';

// SEO Metadata for the collections page
export const metadata: Metadata = {
  title: 'Master Collection | KCT Menswear - Premium Men\'s Formal Wear',
  description: 'Discover KCT Menswear\'s complete collection of premium suits, dress shirts, accessories, and formal wear. Precision-tailored pieces in timeless colors for every occasion.',
  keywords: [
    'men\'s suits',
    'formal wear',
    'dress shirts',
    'wedding suits',
    'prom suits',
    'business attire',
    'menswear collection',
    'tailored suits',
    'formal accessories',
    'men\'s fashion'
  ],
  openGraph: {
    title: 'Master Collection | KCT Menswear',
    description: 'Premium men\'s formal wear collection featuring suits, shirts, and accessories for every occasion.',
    images: [
      {
        url: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/hero-collection.webp',
        width: 1200,
        height: 630,
        alt: 'KCT Menswear Master Collection'
      }
    ],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Master Collection | KCT Menswear',
    description: 'Premium men\'s formal wear collection featuring suits, shirts, and accessories for every occasion.',
    images: ['https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/hero-collection.webp']
  },
  alternates: {
    canonical: 'https://kctmenswear.com/collections'
  }
};

function CollectionsContent() {
  return (
    <DynamicMasterCollectionClient
      title="Master Collection"
      subtitle="COMPLETE MENSWEAR"
      description="Precision-tailored pieces in timeless colors enhance every part of a man's wardrobe. Discover our curated selection of premium suits, dress shirts, and accessories."
      heroImage="https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/hero-collection.webp"
      showHero={true}
      enablePresets={true}
      defaultViewMode="grid-4"
    />
  );
}

export default function CollectionsPage() {
  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Master Collection - KCT Menswear",
            "description": "Premium men's formal wear collection featuring suits, shirts, and accessories for every occasion.",
            "url": "https://kctmenswear.com/collections",
            "image": "https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/hero-collection.webp",
            "mainEntity": {
              "@type": "ItemList",
              "name": "Men's Formal Wear Collection",
              "description": "Complete collection of premium menswear including suits, dress shirts, accessories, and formal wear.",
              "numberOfItems": "500+",
              "itemListElement": [
                {
                  "@type": "Product",
                  "name": "Men's Suits",
                  "description": "Premium tailored suits for business, wedding, and formal occasions",
                  "category": "Suits"
                },
                {
                  "@type": "Product", 
                  "name": "Dress Shirts",
                  "description": "Classic and modern dress shirts in various fits and colors",
                  "category": "Shirts"
                },
                {
                  "@type": "Product",
                  "name": "Formal Accessories",
                  "description": "Ties, bowties, pocket squares, and other formal accessories",
                  "category": "Accessories"
                }
              ]
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://kctmenswear.com"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Collections",
                  "item": "https://kctmenswear.com/collections"
                }
              ]
            },
            "provider": {
              "@type": "Organization",
              "name": "KCT Menswear",
              "url": "https://kctmenswear.com",
              "logo": "https://kctmenswear.com/logo.png"
            }
          })
        }}
      />

      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
          <div className="text-center">
            <div className="relative mb-8">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-burgundy mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 bg-burgundy rounded-full animate-pulse"></div>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Master Collection</h2>
            <p className="text-gray-600 animate-pulse">Curating the perfect pieces for you...</p>
            <div className="mt-4 flex justify-center space-x-1">
              <div className="w-2 h-2 bg-burgundy rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-burgundy rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-burgundy rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      }>
        <CollectionsContent />
      </Suspense>
    </>
  );
}
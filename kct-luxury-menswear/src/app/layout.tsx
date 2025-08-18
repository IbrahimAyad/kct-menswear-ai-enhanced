import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/navigation/Header';
import Footer from '@/components/navigation/Footer';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'KCT Menswear - Luxury Fashion for the Modern Gentleman',
    template: '%s | KCT Menswear'
  },
  description: 'Discover premium menswear collections inspired by luxury brands like Hugo Boss and Tom Ford. Shop suits, casual wear, and accessories for weddings, proms, and every occasion.',
  keywords: ['luxury menswear', 'premium suits', 'designer clothing', 'wedding attire', 'prom suits', 'fashion'],
  authors: [{ name: 'KCT Menswear' }],
  creator: 'KCT Menswear',
  publisher: 'KCT Menswear',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://kctmenswear.com',
    siteName: 'KCT Menswear',
    title: 'KCT Menswear - Luxury Fashion for the Modern Gentleman',
    description: 'Discover premium menswear collections inspired by luxury brands.',
    images: [{
      url: 'https://cdn.kctmenswear.com/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'KCT Menswear - Luxury Fashion',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KCT Menswear - Luxury Fashion for the Modern Gentleman',
    description: 'Discover premium menswear collections inspired by luxury brands.',
    images: ['https://cdn.kctmenswear.com/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
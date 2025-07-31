import { stripeProducts } from '@/lib/services/stripeProductService';
import { getSuitImages } from '@/lib/data/suitImages';
import { tuxedoProducts } from '@/lib/products/tuxedoProducts';
import { Filter, ChevronDown } from 'lucide-react';
import SuitCard from '@/components/products/SuitCard';
import TuxedoCard from '@/components/products/TuxedoCard';

export const metadata = {
  title: 'Premium Men\'s Suits - 2 & 3 Piece | KCT Menswear',
  description: 'Shop our collection of premium men\'s suits. Available in 14 colors with 2-piece ($179.99) and 3-piece ($199.99) options. Sizes 34-54 with free alterations.',
};

export default function SuitsPage() {
  // Convert stripe products to display format
  const suits = Object.entries(stripeProducts.suits).map(([color, data]) => {
    const images = getSuitImages(color);
    return {
      id: data.productId,
      name: `${color.charAt(0).toUpperCase() + color.slice(1).replace(/([A-Z])/g, ' $1')} Suit`,
      color,
      twoPiecePrice: 179.99,
      threePiecePrice: 199.99,
      image: images.main,
      ...data,
    };
  });
  
  // Group suits by color family for better organization
  const colorFamilies = {
    'Classic': ['black', 'navy', 'charcoalGrey', 'lightGrey'],
    'Earth Tones': ['tan', 'sand', 'beige', 'brown', 'darkBrown'],
    'Statement': ['burgundy', 'emerald', 'hunterGreen', 'midnightBlue', 'indigo'],
  };
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[40vh] bg-gray-900 flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Premium Men's Suits</h1>
          <p className="text-xl">Expertly Tailored • Perfect Fit • 14 Colors Available</p>
        </div>
      </div>
      
      {/* Benefits Bar */}
      <div className="bg-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center">
              <span className="font-semibold mr-2">✓</span>
              Free Shipping Over $200
            </div>
            <div className="flex items-center">
              <span className="font-semibold mr-2">✓</span>
              Free Alterations
            </div>
            <div className="flex items-center">
              <span className="font-semibold mr-2">✓</span>
              30-Day Returns
            </div>
            <div className="flex items-center">
              <span className="font-semibold mr-2">✓</span>
              Size 34-54 Available
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Filters and Sort */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
              <Filter size={20} />
              <span>Filter</span>
            </button>
            <div className="text-sm text-gray-600">
              {suits.length} Products
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="text-sm text-gray-600">Sort by:</label>
            <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
              <span>Featured</span>
              <ChevronDown size={16} />
            </button>
          </div>
        </div>
        
        {/* Quick Style Guide */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-12">
          <h2 className="text-lg font-semibold mb-3">Not sure which suit to choose?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <strong>For Business:</strong> Navy, Charcoal Grey, or Black
            </div>
            <div>
              <strong>For Weddings:</strong> Light Grey, Tan, or Midnight Blue
            </div>
            <div>
              <strong>For Events:</strong> Burgundy, Emerald, or Indigo
            </div>
          </div>
        </div>
        
        {/* Products by Color Family */}
        {Object.entries(colorFamilies).map(([family, colors]) => (
          <div key={family} className="mb-12">
            <h2 className="text-2xl font-bold mb-6">{family}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {suits
                .filter(suit => colors.includes(suit.color))
                .map((suit) => (
                  <SuitCard key={suit.id} suit={suit} />
                ))}
            </div>
          </div>
        ))}
        
        {/* Statement Tuxedos Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Statement Tuxedos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tuxedoProducts.map((tuxedo) => (
              <TuxedoCard key={tuxedo.id} tuxedo={tuxedo} />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-gray-900 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Help Choosing?</h2>
          <p className="text-lg mb-6">Our style experts are here to help you find the perfect suit</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
              Schedule Virtual Consultation
            </button>
            <button className="px-8 py-3 border border-white rounded-lg hover:bg-white hover:text-gray-900 transition-colors">
              Chat with Expert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
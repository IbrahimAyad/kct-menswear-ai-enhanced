'use client';

import Link from 'next/link';
import Image from 'next/image';

const categories = [
  {
    name: 'Suits',
    items: '89 items',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/navy/navy-main-2.jpg',
    link: '/collections/suits',
    bgColor: 'bg-gradient-to-br from-beige-100 to-beige-200'
  },
  {
    name: 'Shirts',
    items: '124 items',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/White-Dress-Shirt.jpg',
    link: '/collections/dress-shirts',
    bgColor: 'bg-gradient-to-br from-gray-50 to-gray-100'
  },
  {
    name: 'Pants',
    items: '76 items',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/char%20grey/dark-grey-two-main.jpg',
    link: '/collections/pants',
    bgColor: 'bg-gradient-to-br from-gray-100 to-gray-200'
  },
  {
    name: 'Knitwear',
    items: '45 items',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/beige/beige-main.jpg',
    link: '/collections/knitwear',
    bgColor: 'bg-gradient-to-br from-beige-50 to-beige-100'
  },
  {
    name: 'Jackets',
    items: '58 items',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/black/main.png',
    link: '/collections/jackets',
    bgColor: 'bg-gradient-to-br from-slate-100 to-slate-200'
  },
  {
    name: 'Accessories',
    items: '93 items',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/burgundy.jpg',
    link: '/collections/accessories',
    bgColor: 'bg-gradient-to-br from-gray-100 to-gray-200'
  },
  {
    name: 'Shoes',
    items: '67 items',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/black/main.png',
    link: '/collections/shoes',
    bgColor: 'bg-gradient-to-br from-gray-200 to-gray-300'
  },
  {
    name: 'Complete Looks',
    items: '66 items',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/light-grey/light-grey-two-p-main.jpg',
    link: '/bundles',
    bgColor: 'bg-gradient-to-br from-gray-100 to-gray-200'
  },
  {
    name: 'Wedding Guest',
    items: 'Formal',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/tan/tan-main.jpg',
    link: '/collections/wedding',
    bgColor: 'bg-gradient-to-br from-pink-100 to-pink-200'
  },
  {
    name: 'Business',
    items: 'Formal',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/char%20grey/dark-grey-two-main.jpg',
    link: '/collections/business',
    bgColor: 'bg-gradient-to-br from-gray-200 to-gray-300'
  },
  {
    name: 'Black Tie',
    items: 'Black-Tie',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/black/main.png',
    link: '/collections/formal',
    bgColor: 'bg-gradient-to-br from-gray-800 to-gray-900',
    textColor: 'text-white'
  },
  {
    name: 'Prom 2025',
    items: 'Formal',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/Light-Blue-Dress-Shirt.jpg',
    link: '/collections/prom',
    bgColor: 'bg-gradient-to-br from-purple-100 to-blue-200'
  },
  {
    name: 'Cocktail Party',
    items: 'Semi-Formal',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/brown/brown-suit-main.jpg',
    link: '/collections/cocktail',
    bgColor: 'bg-gradient-to-br from-orange-100 to-amber-100'
  },
  {
    name: 'Suspender Bowtie',
    items: '28 items',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/accessories/suspenders/red-suspender-bowtie.jpg',
    link: '/collections/accessories/suspender-bowtie',
    bgColor: 'bg-gradient-to-br from-pink-50 to-pink-100'
  },
  {
    name: 'Date Night',
    items: 'Casual',
    image: '',
    link: '/collections/date-night',
    bgColor: 'bg-gradient-to-br from-pink-100 to-pink-200',
    isEmpty: true
  }
];

export function ShopByStyleGrid() {
  return (
    <section className="py-8 bg-gray-50">
      <div className="container-main">
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-2 md:gap-4">
          {categories.map((category) => (
            <Link 
              key={category.name} 
              href={category.link}
              className="group cursor-pointer"
            >
              <div className={`relative rounded-2xl overflow-hidden aspect-[3/4] ${category.bgColor} transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
                {!category.isEmpty ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 12.5vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl opacity-20">?</span>
                  </div>
                )}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Content */}
                <div className={`absolute bottom-0 left-0 right-0 p-2 md:p-3 ${category.textColor || 'text-white'}`}>
                  <h3 className="font-semibold text-xs md:text-sm mb-0.5 md:mb-1">{category.name}</h3>
                  <p className="text-[10px] md:text-xs opacity-90">{category.items}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
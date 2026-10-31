import { Category } from '@/types';
import { INITIAL_PRODUCTS } from './productsData';

// Helper to count or provide realistic total wholesale mill products per category
function getCategoryProductCount(categoryName: string, baseCount: number): number {
  const actualProducts = INITIAL_PRODUCTS.filter((p) => p.category === categoryName);
  return Math.max(actualProducts.length, baseCount);
}

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-001',
    name: 'Banarasi Brocade',
    subtitle: 'Pure Katan silk with gold & silver zari jaal',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&auto=format&fit=crop&q=80',
    visibleOnStorefront: true,
    status: 'active',
    totalProducts: getCategoryProductCount('Banarasi Brocade', 2),
    description: 'Heritage handloom and powerloom weaves from Varanasi featuring authentic sona-rupa zari, shikargah, and tanchoi brocades.',
  },
  {
    id: 'cat-002',
    name: 'Chanderi Silk Cotton',
    subtitle: 'Traditional sheer weave with delicate zari bootis',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&auto=format&fit=crop&q=80',
    visibleOnStorefront: true,
    status: 'active',
    totalProducts: getCategoryProductCount('Chanderi Silk Cotton', 2),
    description: 'Distinctive gossamer finish woven with fine silk warp and cotton weft, famous for its featherlight feel and royal elegance.',
  },
  {
    id: 'cat-003',
    name: 'Mulmul Cotton Voile',
    subtitle: 'Superfine 100s combed yarn, breathable handfeel',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400&auto=format&fit=crop&q=80',
    visibleOnStorefront: true,
    status: 'active',
    totalProducts: getCategoryProductCount('Mulmul Cotton Voile', 1),
    description: 'Softest breathable Indian muslin cotton voile suitable for high-end ethnic wear, Sanganeri block prints, and breezy summer suits.',
  },
  {
    id: 'cat-004',
    name: 'Pure Linen Handloom',
    subtitle: 'Premium 60 lea European flax, organic dyed',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400&auto=format&fit=crop&q=80',
    visibleOnStorefront: true,
    status: 'active',
    totalProducts: getCategoryProductCount('Pure Linen Handloom', 1),
    description: 'Eco-certified yarn-dyed 50 & 60 lea flax fibres. Superior moisture-wicking and timeless casual luxury.',
  },
  {
    id: 'cat-005',
    name: 'Georgette Viscose Crepe',
    subtitle: 'Pebble textured 60 GSM high twist yarn',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&auto=format&fit=crop&q=80',
    visibleOnStorefront: true,
    status: 'active',
    totalProducts: getCategoryProductCount('Georgette Viscose Crepe', 1),
    description: 'High-twist bouncy drape fabric preferred for designer dupattas, gowns, saree falls, and all-over schiffli embroideries.',
  },
];

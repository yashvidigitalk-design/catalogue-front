import { Plan, Language, UserProfile } from '@/types';

export const CURRENT_SELLER: UserProfile = {
  name: 'Rajesh Varma',
  businessName: 'Rajesh Varma Textiles',
  city: 'Surat',
  state: 'Gujarat',
  role: 'Master Manufacturer & Wholesaler',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  planName: 'Growth Pro',
  planExpiry: '24 Dec 2026',
};

export const AVAILABLE_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
];

export const SUBSCRIPTION_PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter Mill',
    price: 1999,
    period: '/month',
    description: 'Essential toolkit for small weaving units and emerging fabric merchants.',
    features: [
      'Up to 100 Textile Products',
      '250 Verified Buyer Inquiries / mo',
      'Single Warehouse Inventory Tracking',
      'Standard Digital Fabric Swatches',
      'WhatsApp Digital Catalogue Sharing',
      'Email Support (within 24 hrs)'
    ]
  },
  {
    id: 'growth_pro',
    name: 'Growth Pro',
    price: 4499,
    period: '/month',
    popular: true,
    description: 'Designed for high-turnover textile mills, processors, and bulk wholesalers.',
    features: [
      'Up to 1,000 Textile Products',
      'Unlimited Direct Buyer Inquiries',
      'Real-time Multi-Warehouse Stock Sync',
      'Verified Wholesale Mill Badge',
      'Priority Lead Matching across Pan-India',
      'Custom Branded Digital Catalogue Link',
      'Dedicated Account Manager & Phone Support'
    ]
  },
  {
    id: 'mill_enterprise',
    name: 'Enterprise Mill',
    price: 8999,
    period: '/month',
    description: 'Comprehensive enterprise solution for composite mills and export houses.',
    features: [
      'Unlimited Products & Fabric Variants',
      'Multi-Branch & Loom Unit Management',
      'Custom Domain for Buyer Showcase',
      'Exclusive Bulk Export & Institutional Tender Leads',
      'Tiered Bulk Pricing Engine & MOQ Rules',
      'Raw Yarn & Grey Fabric Procurement Module',
      '24/7 Priority SLA & Dedicated Concierge'
    ]
  }
];

export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', iconName: 'LayoutDashboard' },
  { label: 'Categories', path: '/categories', iconName: 'FolderTree' },
  { label: 'Products', path: '/products', iconName: 'Package' },
  { label: 'Catalogue', path: '/catalogue', iconName: 'BookOpen' },
  { label: 'Buyers', path: '/buyers', iconName: 'Users' },
  { label: 'Inquiries', path: '/inquiries', iconName: 'MessageSquareText' },
  { label: 'Orders', path: '/orders', iconName: 'ShoppingBag' },
  { label: 'Stock', path: '/stock', iconName: 'Boxes' },
  { label: 'Settings', path: '/settings', iconName: 'Settings' },
];

export const PAGE_TITLES: Record<string, { title: string; description: string }> = {
  '/dashboard': {
    title: 'Dashboard Overview',
    description: 'Monitor daily wholesale fabric bookings, buyer inquiry volume, and live loom metrics.'
  },
  '/categories': {
    title: 'Fabric Categories',
    description: 'Organize textile varieties by weave, count, blend ratio, and seasonal collections.'
  },
  '/products': {
    title: 'Product Master',
    description: 'Manage fabric designs, GSM specifications, reed-pick construction, and bulk roll pricing.'
  },
  '/catalogue': {
    title: 'Digital Wholesale Catalogue',
    description: 'Curate dynamic digital swatch-books and shareable lookbooks for retail buyers.'
  },
  '/buyers': {
    title: 'Verified Buyers Directory',
    description: 'Manage garment manufacturers, regional fabric wholesalers, and retail chains.'
  },
  '/inquiries': {
    title: 'Wholesale Inquiries',
    description: 'Respond to bulk RFQs, sample cutting requests, and custom loom weave quotations.'
  },
  '/orders': {
    title: 'Wholesale Fabric Orders',
    description: 'Process thaan/bale wholesale dispatches, generate challans, and track delivery status.'
  },
  '/stock': {
    title: 'Warehouse & Loom Stock',
    description: 'Live inventory tracking for finished rolls, grey fabric batches, and pending loom runs.'
  },
  '/settings': {
    title: 'Seller Profile & Mill Settings',
    description: 'Configure wholesale trade terms, GST credentials, dispatch hubs, and notification preferences.'
  }
};

export function formatCurrencyINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

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


export function formatCurrencyINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

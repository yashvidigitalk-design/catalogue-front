import {
  CatalogueTemplate,
  WhatsAppSettings,
} from '@/types';

export const BRAND_COLOR_OPTIONS = [
  { label: 'Midnight Obsidian', hex: '#100E26' },
  { label: 'Royal Indigo', hex: '#4E45D5' },
  { label: 'Emerald Silk', hex: '#059669' },
  { label: 'Tussar Amber', hex: '#D97706' },
  { label: 'Crimson Loom', hex: '#E11D48' },
];

export const DEFAULT_TEMPLATES: CatalogueTemplate[] = [
  {
    id: 'classic-grid',
    name: 'Classic Grid',
    description: 'Clean white layout with structured 2×3 fabric grid, high-clarity weave details, design numbers, and wholesale lot pricing.',
    isDefault: true,
    theme: 'light',
    customization: {
      title: 'Summer Fabric Volume Catalogue',
      brandColor: '#4E45D5',
      showPrices: true,
      showDesignNumber: true,
      showMOQ: true,
      footerNote: 'All rates are ex-mill Surat. 5% GST applicable. Minimum order 1 bale / roll.',
    },
  },
  {
    id: 'elegant-lookbook',
    name: 'Elegant Lookbook',
    description: 'Luxurious dark #100E26 cover style with large hero drape swatch, gold/purple accents, and curated bridal & festive weaves.',
    isDefault: false,
    theme: 'dark',
    customization: {
      title: 'Royale Silk & Jacquard Lookbook',
      brandColor: '#100E26',
      showPrices: true,
      showDesignNumber: true,
      showMOQ: false,
      footerNote: 'Exclusively curated for bridal fashion houses and boutique retail chains.',
    },
  },
];

export const SAMPLE_PREVIEW_PRODUCTS = [
  {
    id: 'p1',
    designNo: 'DES #CH-902',
    name: 'Pure Chanderi Silk Saree',
    price: '₹1,850',
    unit: 'pc',
    moq: '20 pcs',
    patternType: 'chanderi',
    accentColor: '#4E45D5',
  },
  {
    id: 'p2',
    designNo: 'DES #MC-401',
    name: 'Mulmul Cotton Fabric - 60s',
    price: '₹145',
    unit: 'mtr',
    moq: '500 mtr',
    patternType: 'mulmul',
    accentColor: '#059669',
  },
  {
    id: 'p3',
    designNo: 'DES #BB-772',
    name: 'Banarasi Jacquard Brocade',
    price: '₹2,400',
    unit: 'pc',
    moq: '15 pcs',
    patternType: 'brocade',
    accentColor: '#D97706',
  },
  {
    id: 'p4',
    designNo: 'DES #RS-108',
    name: 'Rayon Slub Dyed 14kg',
    price: '₹92',
    unit: 'mtr',
    moq: '800 mtr',
    patternType: 'slub',
    accentColor: '#4338CA',
  },
  {
    id: 'p5',
    designNo: 'DES #OF-553',
    name: 'Organza Floral Zari Pallu',
    price: '₹1,650',
    unit: 'pc',
    moq: '25 pcs',
    patternType: 'organza',
    accentColor: '#E11D48',
  },
  {
    id: 'p6',
    designNo: 'DES #HT-334',
    name: 'Handloom Tussar Yardage',
    price: '₹480',
    unit: 'mtr',
    moq: '200 mtr',
    patternType: 'tussar',
    accentColor: '#6B7280',
  },
];

export const DEFAULT_WHATSAPP_SETTINGS: WhatsAppSettings = {
  storefrontUrl: 'https://texloom.app/store/rajesh-varma-textiles',
  businessNumber: '98765 43210',
  defaultMessage: 'Namaste! Please find our wholesale textile catalogue {catalogue_name} from Rajesh Varma Textiles, Surat. Check live wholesale rates starting from {price}. View full collection and place direct orders here: {link}',
};

export function formatWhatsAppMessage(
  template: string,
  variables: {
    catalogue_name?: string;
    product_name?: string;
    price?: string;
    link?: string;
  }
): string {
  let result = template;
  result = result.replace(/{catalogue_name}/g, variables.catalogue_name || 'Summer Silk Collection 2025');
  result = result.replace(/{product_name}/g, variables.product_name || 'Handloom Chanderi Pattu Saree');
  result = result.replace(/{price}/g, variables.price || '₹1,850 / pc');
  result = result.replace(/{link}/g, variables.link || 'https://texloom.app/store/rajesh-varma-textiles');
  return result;
}

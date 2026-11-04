export type StatusVariant = 'green' | 'amber' | 'red' | 'blue' | 'slate';

export interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  popular?: boolean;
  description: string;
  features: string[];
}

export interface Language {
  code: 'en' | 'hi' | 'gu';
  name: string;
  nativeName: string;
}

export interface UserProfile {
  name: string;
  businessName: string;
  email?: string;
  city: string;
  state: string;
  role: string;
  avatarUrl: string;
  planName: string;
  planExpiry: string;
}

export interface TableColumn<T> {
  key: string;
  header: string | React.ReactNode;
  render?: (item: T, index: number) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  sticky?: 'left' | 'right';
}

export interface FilterOption {
  label: string;
  value: string;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Accepted' | 'Rejected';

export interface DashboardOrder {
  id: string;
  orderId: string;
  buyerName: string;
  buyerGst: string;
  productName: string;
  productSpecs: string;
  quantity: string;
  totalAmount: string;
  status: OrderStatus;
  statusVariant: StatusVariant;
}

export interface SalesDataPoint {
  label: string;
  value: number;
  formatted: string;
}

export type SalesTimeframe = '7d' | '30d' | '1y';

export interface TopProduct {
  id: string;
  name: string;
  specs: string;
  quantity: number;
  quantityFormatted: string;
  revenue: string;
  percentage: number;
}

export interface TemplateCustomization {
  title: string;
  brandColor: string;
  showPrices: boolean;
  showDesignNumber: boolean;
  showMOQ: boolean;
  footerNote: string;
}

export interface CatalogueTemplate {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  theme: 'light' | 'dark';
  customization: TemplateCustomization;
}

export interface WhatsAppSettings {
  storefrontUrl: string;
  businessNumber: string;
  defaultMessage: string;
}

export type WhatsAppShareMode = 'catalogue' | 'product';

export interface Category {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  visibleOnStorefront: boolean;
  status: 'active' | 'inactive';
  totalProducts: number;
  description?: string;
}

export type StockUnit = 'Piece' | 'Meter' | 'Roll' | 'Bale' | 'Kg';
export type WeightUnit = 'Gram' | 'Kg';
export type TaxRate = '0%' | '5%' | '12%' | '18%' | '28%';
export type TaxType = 'GST Inclusive' | 'GST Exclusive';

export interface QuantityPriceRange {
  id?: string;
  min: number;
  max?: number | null; // null or undefined means "and above"
  price: number;
}

export interface ProductVideo {
  type: 'youtube' | 'upload';
  url?: string;
  fileName?: string;
  fileSize?: number;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  images: string[];
  designNumber: string;
  sku?: string;
  category: string;
  fabric: string;
  wholesalePrice: number;
  mrp: number;
  stock: number;
  moq: number;
  unit?: string;
  stockUnit?: StockUnit;
  weight?: string;
  productWeight?: number;
  weightUnit?: WeightUnit;
  color?: string;
  colorHex?: string;
  tax?: TaxRate;
  taxType?: TaxType;
  video?: ProductVideo;
  pricingRanges?: QuantityPriceRange[];
  pricingUnit?: StockUnit;
  status: 'active' | 'inactive';
  description?: string;
}

export interface Catalogue {
  id: string;
  name: string;
  description: string;
  totalProducts: number;
  productIds: string[];
  createdDate: string;
  lastUpdated: string;
  status: 'active' | 'inactive';
}

export interface Buyer {
  id: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  city: string;
  state?: string;
  registrationDate: string;
  customRate?: number | null;
  avatarColor?: string;
}

export interface Inquiry {
  id: string;
  buyerName: string;
  buyerCompany: string;
  contactNumber: string;
  city: string;
  productName: string;
  designNumber: string;
  productImage: string;
  wholesalePrice: number;
  description: string;
  requestedQuantity: number | string;
  inquiryDate: string;
  status: 'new' | 'solved';
}

export interface Order {
  id: string;
  buyerName: string;
  buyerCompany: string;
  contactNumber: string;
  email: string;
  city: string;
  deliveryAddress: string;
  productName: string;
  designNumber: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  orderDate: string;
  status: 'pending' | 'accepted' | 'rejected';
  remark?: string;
}

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface StockItem {
  id: string;
  productName: string;
  designNumber: string;
  productImage: string;
  fabric: string;
  availableStock: number;
  stockIn: number;
  stockOut: number;
  reservedStock: number;
  soldStock: number;
  unit?: string;
}

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



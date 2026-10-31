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

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  images: string[];
  designNumber: string;
  category: string;
  fabric: string;
  wholesalePrice: number;
  mrp: number;
  stock: number;
  moq: number;
  weight?: string;
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

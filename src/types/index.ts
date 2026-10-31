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

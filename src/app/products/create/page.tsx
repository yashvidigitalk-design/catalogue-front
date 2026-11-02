'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import ProductForm from '@/components/ProductForm';

export default function CreateProductPage() {
  return (
    <div className="space-y-6 pb-12">
      <div>
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A586E] hover:text-[#4E45D5] transition-colors mb-3 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Products</span>
        </Link>

        <PageHeader
          title="Add Product"
          description="Define fabric specifications, loom details, inventory, and wholesale tier pricing."
        />
      </div>

      <ProductForm mode="page" />
    </div>
  );
}
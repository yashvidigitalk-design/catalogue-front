'use client';

import React, { useState } from 'react';
import CommonDrawer from '@/components/CommonDrawer';
import ImageUpload from '@/components/ImageUpload';
import { Product } from '@/types';
import { useToast } from '@/hooks/useToast';
import { INITIAL_CATEGORIES } from '@/lib/categoriesData';

interface ProductFormDrawerProps {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
  onSaved?: (productData: Partial<Product>) => void;
  zIndex?: string;
}

export default function ProductFormDrawer({
  open,
  onClose,
  product,
  onSaved,
  zIndex = 'z-50',
}: ProductFormDrawerProps) {
  const { showToast } = useToast();

  const [prevProduct, setPrevProduct] = useState<Product | null | undefined>(undefined);
  const [prevOpen, setPrevOpen] = useState(false);

  const [name, setName] = useState('');
  const [designNumber, setDesignNumber] = useState('');
  const [category, setCategory] = useState('');
  const [fabric, setFabric] = useState('');
  const [wholesalePrice, setWholesalePrice] = useState<number | string>('');
  const [mrp, setMrp] = useState<number | string>('');
  const [stock, setStock] = useState<number | string>('');
  const [moq, setMoq] = useState<number | string>('');
  const [weight, setWeight] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Synchronize state when open or product changes without cascading effect renders
  if (open !== prevOpen || product !== prevProduct) {
    setPrevOpen(open);
    setPrevProduct(product);
    if (product) {
      setName(product.name || '');
      setDesignNumber(product.designNumber || '');
      setCategory(product.category || INITIAL_CATEGORIES[0]?.name || '');
      setFabric(product.fabric || '');
      setWholesalePrice(product.wholesalePrice ?? '');
      setMrp(product.mrp ?? '');
      setStock(product.stock ?? '');
      setMoq(product.moq ?? '');
      setWeight(product.weight || '');
      setStatus(product.status || 'active');
      setDescription(product.description || '');
      setImages(product.images?.length ? product.images : product.image ? [product.image] : []);
    } else {
      setName('');
      setDesignNumber('');
      setCategory(INITIAL_CATEGORIES[0]?.name || 'Banarasi Brocade');
      setFabric('');
      setWholesalePrice('');
      setMrp('');
      setStock('');
      setMoq('');
      setWeight('');
      setStatus('active');
      setDescription('');
      setImages([]);
    }
    setErrors({});
  }

  const handleSave = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Product name is required';
    if (!designNumber.trim()) newErrors.designNumber = 'Design number is required';
    if (wholesalePrice === '' || Number(wholesalePrice) <= 0) {
      newErrors.wholesalePrice = 'Valid wholesale price is required';
    }
    if (mrp === '' || Number(mrp) <= 0) {
      newErrors.mrp = 'Valid MRP is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('error', 'Please fill all required fields');
      return;
    }

    const savedData: Partial<Product> = {
      name: name.trim(),
      designNumber: designNumber.trim(),
      category: category.trim(),
      fabric: fabric.trim() || 'Textile Blend',
      wholesalePrice: Number(wholesalePrice),
      mrp: Number(mrp),
      stock: stock === '' ? 0 : Number(stock),
      moq: moq === '' ? 50 : Number(moq),
      weight: weight.trim() || '120 GSM',
      status,
      description: description.trim(),
      images,
      image: images[0] || '',
    };

    showToast(
      'success',
      product ? 'Product updated successfully' : 'Product created successfully'
    );
    if (onSaved) onSaved(savedData);
    onClose();
  };

  return (
    <CommonDrawer
      isOpen={open}
      onClose={onClose}
      title={product ? 'Edit Product' : 'Add Product'}
      description={
        product
          ? 'Update wholesale product specifications, pricing, and inventory.'
          : 'Add a new fabric design to your wholesale master catalogue.'
      }
      onSave={handleSave}
      saveText="Save Product"
      cancelText="Cancel"
      width="xl"
      zIndex={zIndex}
    >
      <div className="space-y-5">
        {/* Two-column layout: Product Name & Design Number */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#100E26] mb-1.5">
              Product Name <span className="text-[#E11D48]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
              }}
              placeholder="e.g. Banarasi Katan Silk Floral Jaal"
              className={`input-base ${errors.name ? 'border-[#E11D48] focus:border-[#E11D48]' : ''}`}
            />
            {errors.name && (
              <p className="text-xs text-[#E11D48] mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#100E26] mb-1.5">
              Design Number <span className="text-[#E11D48]">*</span>
            </label>
            <input
              type="text"
              value={designNumber}
              onChange={(e) => {
                setDesignNumber(e.target.value);
                if (errors.designNumber) setErrors((prev) => ({ ...prev, designNumber: '' }));
              }}
              placeholder="e.g. BN-1002"
              className={`input-base font-tabular ${errors.designNumber ? 'border-[#E11D48] focus:border-[#E11D48]' : ''}`}
            />
            {errors.designNumber && (
              <p className="text-xs text-[#E11D48] mt-1">{errors.designNumber}</p>
            )}
          </div>
        </div>

        {/* Two-column layout: Category & Fabric */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#100E26] mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-base cursor-pointer bg-white"
            >
              {INITIAL_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#100E26] mb-1.5">
              Fabric
            </label>
            <input
              type="text"
              value={fabric}
              onChange={(e) => setFabric(e.target.value)}
              placeholder="e.g. Katan Silk / Chanderi"
              className="input-base"
            />
          </div>
        </div>

        {/* Two-column layout: Wholesale Price & MRP (both with clean ₹ prefix and clear 0 placeholder) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#100E26] mb-1.5">
              Wholesale Price <span className="text-[#E11D48]">*</span>
            </label>
            <div
              className={`flex items-center h-10 bg-white border rounded-lg focus-within:border-[#4E45D5] focus-within:ring-2 focus-within:ring-[#4E45D5]/15 transition-all overflow-hidden ${
                errors.wholesalePrice ? 'border-[#E11D48]' : 'border-[#E2E1EC]'
              }`}
            >
              <span className="pl-3.5 pr-1.5 text-sm font-semibold text-[#5A586E] select-none">
                ₹
              </span>
              <input
                type="number"
                min="0"
                value={wholesalePrice}
                onChange={(e) => {
                  setWholesalePrice(e.target.value);
                  if (errors.wholesalePrice) setErrors((prev) => ({ ...prev, wholesalePrice: '' }));
                }}
                placeholder="0"
                className="w-full h-full pr-3.5 bg-transparent border-0 outline-none text-sm text-[#100E26] font-tabular placeholder-[#9493A8]"
              />
            </div>
            {errors.wholesalePrice && (
              <p className="text-xs text-[#E11D48] mt-1">{errors.wholesalePrice}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#100E26] mb-1.5">
              MRP <span className="text-[#E11D48]">*</span>
            </label>
            <div
              className={`flex items-center h-10 bg-white border rounded-lg focus-within:border-[#4E45D5] focus-within:ring-2 focus-within:ring-[#4E45D5]/15 transition-all overflow-hidden ${
                errors.mrp ? 'border-[#E11D48]' : 'border-[#E2E1EC]'
              }`}
            >
              <span className="pl-3.5 pr-1.5 text-sm font-semibold text-[#5A586E] select-none">
                ₹
              </span>
              <input
                type="number"
                min="0"
                value={mrp}
                onChange={(e) => {
                  setMrp(e.target.value);
                  if (errors.mrp) setErrors((prev) => ({ ...prev, mrp: '' }));
                }}
                placeholder="0"
                className="w-full h-full pr-3.5 bg-transparent border-0 outline-none text-sm text-[#100E26] font-tabular placeholder-[#9493A8]"
              />
            </div>
            {errors.mrp && (
              <p className="text-xs text-[#E11D48] mt-1">{errors.mrp}</p>
            )}
          </div>
        </div>

        {/* Two-column layout: Stock Quantity & MOQ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#100E26] mb-1.5">
              Stock Quantity
            </label>
            <input
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="e.g. 500"
              className="input-base font-tabular"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#100E26] mb-1.5">
              MOQ (Minimum Order)
            </label>
            <input
              type="number"
              min="1"
              value={moq}
              onChange={(e) => setMoq(e.target.value)}
              placeholder="e.g. 50"
              className="input-base font-tabular"
            />
          </div>
        </div>

        {/* Two-column layout: Weight & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#100E26] mb-1.5">
              Weight
            </label>
            <input
              type="text"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 140 GSM"
              className="input-base"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#100E26] mb-1.5">
              Status
            </label>
            <div className="flex items-center gap-3 h-10">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-[#100E26]">
                <input
                  type="radio"
                  name="product-status"
                  value="active"
                  checked={status === 'active'}
                  onChange={() => setStatus('active')}
                  className="w-4 h-4 text-[#4E45D5] focus:ring-[#4E45D5]"
                />
                Active
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-[#5A586E]">
                <input
                  type="radio"
                  name="product-status"
                  value="inactive"
                  checked={status === 'inactive'}
                  onChange={() => setStatus('inactive')}
                  className="w-4 h-4 text-[#4E45D5] focus:ring-[#4E45D5]"
                />
                Inactive
              </label>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#100E26] mb-1.5">
            Product Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe fabric weave, finish, count, and recommended ethnic garments..."
            className="w-full p-3 text-sm bg-white border border-[#E2E1EC] rounded-lg text-[#100E26] placeholder-[#9493A8] focus:outline-none focus:border-[#4E45D5] focus:ring-2 focus:ring-[#4E45D5]/15 transition-all resize-none"
          />
        </div>

        {/* Product Images */}
        <div>
          <ImageUpload
            initialImages={images}
            maxImages={6}
            label="Product Images"
            helperText="Upload fabric weave shots, selvage borders, and draped lookbook photos (PNG, JPG)."
            onChange={(imgs) => setImages(imgs)}
          />
        </div>
      </div>
    </CommonDrawer>
  );
}

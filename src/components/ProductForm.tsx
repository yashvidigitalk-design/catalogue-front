'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  UploadCloud,
  X,
  Plus,
  Trash2,
  Image as ImageIcon,
  AlertCircle,
  Sparkles,
  Info,
  Check,
} from 'lucide-react';
import {
  Product,
  StockUnit,
  WeightUnit,
  TaxRate,
  TaxType,
  QuantityPriceRange,
  ProductVideo,
} from '@/types';
import { INITIAL_CATEGORIES } from '@/lib/categoriesData';
import { useToast } from '@/hooks/useToast';
import CommonDrawer from '@/components/CommonDrawer';

interface ProductFormProps {
  initialProduct?: Product | null;
  onSaved?: (productData: Partial<Product>) => void;
  onCancel?: () => void;
  mode?: 'page' | 'drawer';
  onRegisterSubmit?: (submitFn: () => void) => void;
}

interface InternalRange {
  id: string;
  min: number | string;
  max: number | string;
  price: number | string;
}

const STOCK_UNITS: StockUnit[] = ['Piece', 'Meter', 'Roll', 'Bale', 'Kg'];
const WEIGHT_UNITS: WeightUnit[] = ['Gram', 'Kg'];
const TAX_RATES: TaxRate[] = ['0%', '5%', '12%', '18%', '28%'];

const YouTubeIcon = ({ className = 'w-3.5 h-3.5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export default function ProductForm({
  initialProduct,
  onSaved,
  onCancel,
  mode = 'page',
  onRegisterSubmit,
}: ProductFormProps) {
  const router = useRouter();
  const { showToast } = useToast();

  // Section 1: Basic Details
  const [name, setName] = useState(initialProduct?.name || '');
  const [designNumber, setDesignNumber] = useState(initialProduct?.designNumber || '');
  const [sku, setSku] = useState(
    initialProduct?.sku ||
      (initialProduct?.designNumber
        ? `TEX-${initialProduct.designNumber.replace(/[^A-Za-z0-9]/g, '')}`
        : '')
  );
  const [category, setCategory] = useState(
    initialProduct?.category || INITIAL_CATEGORIES[0]?.name || 'Select Category'
  );
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [fabric, setFabric] = useState(initialProduct?.fabric || '');

  // Section 2: Stock & Inventory (starts empty without pre-filled values)
  const [stock, setStock] = useState<number | string>(
    initialProduct?.stock !== undefined ? initialProduct.stock : ''
  );
  const [stockUnit, setStockUnit] = useState<StockUnit | ''>(
    initialProduct?.stockUnit || (initialProduct?.unit as StockUnit) || ''
  );
  const [moq, setMoq] = useState<number | string>(
    initialProduct?.moq !== undefined ? initialProduct.moq : ''
  );

  // Section 3: Product Specification
  const [productWeight, setProductWeight] = useState<number | string>(
    initialProduct?.productWeight ??
      (initialProduct?.weight ? parseInt(initialProduct.weight) || '' : '')
  );
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(
    initialProduct?.weightUnit ||
      (initialProduct?.weight?.toLowerCase().includes('kg') ? 'Kg' : 'Gram')
  );
  const [color, setColor] = useState(initialProduct?.color || '');
  const [colorHex, setColorHex] = useState(initialProduct?.colorHex || '#4E45D5');

  // Section 4: Additional Settings (tax starts empty)
  const [tax, setTax] = useState<TaxRate | ''>(initialProduct?.tax || '');
  const [taxType, setTaxType] = useState<TaxType>(
    initialProduct?.taxType || 'GST Exclusive'
  );

  // Section 5: Media
  const [images, setImages] = useState<string[]>(
    initialProduct?.images?.length
      ? initialProduct.images.slice(0, 4)
      : initialProduct?.image
      ? [initialProduct.image]
      : []
  );
  const [imageError, setImageError] = useState('');
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Video State (YouTube Link only)
  const [videoYoutubeUrl, setVideoYoutubeUrl] = useState(
    initialProduct?.video?.url || ''
  );

  // Section 6: Discount / Quantity-based Pricing
  const [pricingUnit, setPricingUnit] = useState<StockUnit | ''>(
    initialProduct?.pricingUnit ||
      initialProduct?.stockUnit ||
      (initialProduct?.unit as StockUnit) ||
      ''
  );

  // First range default has empty max
  const [ranges, setRanges] = useState<InternalRange[]>(() => {
    if (initialProduct?.pricingRanges && initialProduct.pricingRanges.length > 0) {
      return initialProduct.pricingRanges.map((r, idx) => ({
        id: String(idx + 1),
        min: r.min,
        max: r.max !== null && r.max !== undefined ? r.max : '',
        price: r.price,
      }));
    }
    return [
      {
        id: '1',
        min: 1,
        max: '',
        price: initialProduct?.wholesalePrice ?? '',
      },
    ];
  });

  // Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [rangeErrors, setRangeErrors] = useState<Record<string, string>>({});

  // Sync pricing unit when stock unit changes if user hasn't explicitly set a custom pricing unit
  const prevStockUnitRef = useRef(stockUnit);
  useEffect(() => {
    if (prevStockUnitRef.current !== stockUnit && stockUnit) {
      setPricingUnit(stockUnit);
      prevStockUnitRef.current = stockUnit;
    }
  }, [stockUnit]);

  // Synchronize state if initialProduct changes dynamically
  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name || '');
      setDesignNumber(initialProduct.designNumber || '');
      setSku(
        initialProduct.sku ||
          (initialProduct.designNumber
            ? `TEX-${initialProduct.designNumber.replace(/[^A-Za-z0-9]/g, '')}`
            : '')
      );
      setCategory(initialProduct.category || INITIAL_CATEGORIES[0]?.name || 'Select Category');
      setDescription(initialProduct.description || '');
      setFabric(initialProduct.fabric || 'Textile Blend');
      setStock(initialProduct.stock !== undefined ? initialProduct.stock : '');
      setStockUnit(initialProduct.stockUnit || (initialProduct.unit as StockUnit) || '');
      setMoq(initialProduct.moq !== undefined ? initialProduct.moq : '');
      setProductWeight(
        initialProduct.productWeight ??
          (initialProduct.weight ? parseInt(initialProduct.weight) || '' : '')
      );
      setWeightUnit(
        initialProduct.weightUnit ||
          (initialProduct.weight?.toLowerCase().includes('kg') ? 'Kg' : 'Gram')
      );
      setColor(initialProduct.color || '');
      setColorHex(initialProduct.colorHex || '#4E45D5');
      setTax(initialProduct.tax || '');
      setTaxType(initialProduct.taxType || 'GST Exclusive');
      setImages(
        initialProduct.images?.length
          ? initialProduct.images.slice(0, 4)
          : initialProduct.image
          ? [initialProduct.image]
          : []
      );
      if (initialProduct.video) {
        setVideoYoutubeUrl(initialProduct.video.url || '');
      } else {
        setVideoYoutubeUrl('');
      }
      setPricingUnit(
        initialProduct.pricingUnit ||
          initialProduct.stockUnit ||
          (initialProduct.unit as StockUnit) ||
          ''
      );
      if (initialProduct.pricingRanges && initialProduct.pricingRanges.length > 0) {
        setRanges(
          initialProduct.pricingRanges.map((r, idx) => ({
            id: String(idx + 1),
            min: r.min,
            max: r.max !== null && r.max !== undefined ? r.max : '',
            price: r.price,
          }))
        );
      } else {
        setRanges([
          {
            id: '1',
            min: 1,
            max: '',
            price: initialProduct.wholesalePrice ?? '',
          },
        ]);
      }
    }
  }, [initialProduct]);

  // Image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError('');
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 4) {
      setImageError('Maximum 4 images allowed');
      return;
    }

    const newUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setImageError('Allowed image formats: PNG, JPG, WEBP only');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setImageError(`File "${file.name}" exceeds maximum allowed size of 2 MB`);
        return;
      }
      newUrls.push(URL.createObjectURL(file));
    }

    setImages((prev) => [...prev, ...newUrls].slice(0, 4));
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setImageError('');
  };

  const handleRemoveVideo = () => {
    setVideoYoutubeUrl('');
    if (errors.video) setErrors((prev) => ({ ...prev, video: '' }));
  };

  // Helper for YouTube embed ID extraction
  const getYouTubeVideoId = (url: string) => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    return match ? match[1] : null;
  };

  // Quantity Ranges Handlers
  const handleAddRange = () => {
    if (ranges.length >= 5) return;
    const lastRange = ranges[ranges.length - 1];
    let nextMin = 101;
    if (lastRange && lastRange.max !== '' && !isNaN(Number(lastRange.max))) {
      nextMin = Number(lastRange.max) + 1;
    } else if (lastRange && lastRange.min !== '' && !isNaN(Number(lastRange.min))) {
      nextMin = Number(lastRange.min) + 100;
    }

    const newRange: InternalRange = {
      id: String(Date.now()),
      min: nextMin,
      max: '',
      price: '',
    };
    setRanges([...ranges, newRange]);
  };

  const handleRemoveRange = (id: string) => {
    if (ranges.length <= 1) return;
    setRanges(ranges.filter((r) => r.id !== id));
    setRangeErrors((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const handleRangeChange = (
    id: string,
    field: 'min' | 'max' | 'price',
    value: string
  ) => {
    setRanges((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return { ...r, [field]: value };
        }
        return r;
      })
    );
    // Clear error for this range
    if (rangeErrors[id]) {
      setRangeErrors((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    }
  };

  // Main Submit & Validation
  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    const newRangeErrors: Record<string, string> = {};

    // Section 1 Validations
    if (!name.trim()) newErrors.name = 'Product name is required';
    if (!designNumber.trim()) newErrors.designNumber = 'Design number is required';
    if (!sku.trim()) newErrors.sku = 'SKU is required';
    if (!category.trim()) newErrors.category = 'Category is required';

    // Section 2 Validations
    if (stock === '' || isNaN(Number(stock)) || Number(stock) < 0) {
      newErrors.stock = 'Valid stock quantity (>= 0) is required';
    }
    if (!stockUnit) newErrors.stockUnit = 'Stock unit is required';
    if (moq === '' || isNaN(Number(moq)) || Number(moq) < 1) {
      newErrors.moq = 'Minimum order quantity must be at least 1';
    }

    // Section 5 Video Validation (YouTube URL validation if entered)
    if (videoYoutubeUrl.trim()) {
      const ytId = getYouTubeVideoId(videoYoutubeUrl.trim());
      if (!ytId) {
        newErrors.video = 'Please enter a valid YouTube URL (e.g. https://youtu.be/...)';
      }
    }

    // Section 6 Ranges Validation
    if (ranges.length === 0) {
      newErrors.ranges = 'At least 1 quantity pricing range is required';
    } else {
      // Validate individual ranges
      for (let i = 0; i < ranges.length; i++) {
        const r = ranges[i];
        const minVal = Number(r.min);
        const maxVal = r.max !== '' ? Number(r.max) : null;
        const priceVal = Number(r.price);

        if (r.min === '' || isNaN(minVal) || minVal < 1) {
          newRangeErrors[r.id] = 'Min qty must be >= 1';
        } else if (r.price === '' || isNaN(priceVal) || priceVal <= 0) {
          newRangeErrors[r.id] = 'Price must be > 0';
        } else if (maxVal !== null) {
          if (isNaN(maxVal) || maxVal < minVal) {
            newRangeErrors[r.id] = 'Max qty must be greater than or equal to Min qty';
          }
        }
      }

      // Check for overlapping ranges
      for (let i = 0; i < ranges.length; i++) {
        for (let j = i + 1; j < ranges.length; j++) {
          const r1 = ranges[i];
          const r2 = ranges[j];
          const min1 = Number(r1.min);
          const max1 = r1.max !== '' ? Number(r1.max) : Infinity;
          const min2 = Number(r2.min);
          const max2 = r2.max !== '' ? Number(r2.max) : Infinity;

          if (!isNaN(min1) && !isNaN(min2)) {
            // Overlap condition
            if (min1 <= max2 && min2 <= max1) {
              newRangeErrors[r1.id] = 'Quantity ranges must not overlap';
              newRangeErrors[r2.id] = 'Quantity ranges must not overlap';
            }
          }
        }
      }
    }

    if (Object.keys(newErrors).length > 0 || Object.keys(newRangeErrors).length > 0) {
      setErrors(newErrors);
      setRangeErrors(newRangeErrors);
      showToast('error', 'Please fill all required fields correctly');
      return;
    }

    // Prepare Saved Product Data
    const formattedRanges: QuantityPriceRange[] = ranges.map((r) => ({
      min: Number(r.min),
      max: r.max !== '' ? Number(r.max) : null,
      price: Number(r.price),
    }));

    const firstRangePrice = formattedRanges[0]?.price || 0;
    const computedMrp = initialProduct?.mrp || Math.round(firstRangePrice * 1.4);

    const finalVideo: ProductVideo | undefined = videoYoutubeUrl.trim()
      ? {
          type: 'youtube',
          url: videoYoutubeUrl.trim(),
        }
      : undefined;

    const effectiveUnit = (stockUnit as StockUnit) || 'Meter';
    const effectivePricingUnit = (pricingUnit as StockUnit) || effectiveUnit;

    const savedData: Partial<Product> = {
      name: name.trim(),
      designNumber: designNumber.trim(),
      sku: sku.trim(),
      category: category.trim(),
      fabric: fabric.trim() || 'Textile Blend',
      description: description.trim(),
      stock: Number(stock),
      stockUnit: effectiveUnit,
      unit: effectiveUnit,
      moq: Number(moq),
      productWeight: productWeight !== '' ? Number(productWeight) : undefined,
      weightUnit,
      weight: productWeight !== '' ? `${productWeight} ${weightUnit}` : undefined,
      color: color.trim() || undefined,
      colorHex,
      tax: tax || undefined,
      taxType,
      images,
      image:
        images[0] ||
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&auto=format&fit=crop&q=80',
      pricingUnit: effectivePricingUnit,
      pricingRanges: formattedRanges,
      wholesalePrice: firstRangePrice,
      mrp: computedMrp,
      status: initialProduct?.status || 'active',
      video: finalVideo,
    };

    if (onSaved) {
      onSaved(savedData);
    }

    showToast('success', initialProduct ? 'Product updated successfully' : 'Product saved');

    if (mode === 'page') {
      router.push('/products');
    } else if (onCancel) {
      onCancel();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push('/products');
    }
  };

  // Register submit function to parent drawer if provided
  useEffect(() => {
    if (onRegisterSubmit) {
      onRegisterSubmit(handleSubmit);
    }
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="space-y-6"
    >
      {/* Container: 2-column on desktop when mode="page", single-column stacked in drawer */}
      <div
        className={
          mode === 'page'
            ? 'flex flex-col lg:flex-row gap-6 items-start'
            : 'space-y-6'
        }
      >
        {/* ============================================================ */}
        {/* LEFT COLUMN: Section 5 Media Card (Sticky on desktop page)   */}
        {/* ============================================================ */}
        <div
          className={
            mode === 'page'
              ? 'w-full lg:w-[360px] lg:shrink-0 lg:sticky lg:top-24 space-y-6'
              : 'space-y-6'
          }
        >
          <div className="bg-white rounded-xl border border-[#E2E1EC] p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E1EC] mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] flex items-center justify-center text-[#4E45D5]">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#100E26] font-['Plus_Jakarta_Sans',sans-serif]">
                    Product Media
                  </h3>
                  <p className="text-[11px] text-[#5A586E]">
                    Cover visuals & loom swatches
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F7F7FB] border border-[#E2E1EC] text-[#5A586E]">
                {images.length}/4 Images
              </span>
            </div>

            {/* Images Upload & Previews */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#100E26] mb-1">
                  Product Images <span className="text-[#9493A8] text-[11px] font-normal">(Max 4, &le;2 MB each)</span>
                </label>
                <p className="text-[11px] text-[#5A586E] mb-3">
                  Upload crisp fabric weaves, pallu shots, and folded textures (PNG, JPG, WEBP).
                </p>

                {/* Cover Slot Preview (Large) */}
                {images.length > 0 ? (
                  <div className="space-y-3">
                    <div className="relative h-60 sm:h-64 w-full rounded-lg overflow-hidden border border-[#E2E1EC] bg-[#F7F7FB] group flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={images[0]}
                        alt="Main cover"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#4E45D5] text-white text-[10px] font-bold shadow-xs">
                        Main Cover
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(0)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
                        title="Remove image"
                        aria-label="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Smaller Slots (Slots 2, 3, 4) */}
                    <div className="grid grid-cols-3 gap-2">
                      {images.slice(1).map((imgUrl, idx) => (
                        <div
                          key={idx + 1}
                          className="relative h-20 sm:h-24 rounded-lg overflow-hidden border border-[#E2E1EC] bg-[#F7F7FB] group"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imgUrl}
                            alt={`Preview ${idx + 2}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx + 1)}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
                            title="Remove image"
                            aria-label="Remove image"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}

                      {images.length < 4 && (
                        <button
                          type="button"
                          onClick={() => imageInputRef.current?.click()}
                          className="h-20 sm:h-24 rounded-lg border-2 border-dashed border-[#E2E1EC] hover:border-[#4E45D5] bg-[#F7F7FB] hover:bg-[#EEF2FF]/40 flex flex-col items-center justify-center gap-1 text-[#5A586E] hover:text-[#4E45D5] transition-colors cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span className="text-[10px] font-medium">Add More</span>
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Dropzone when empty */
                  <div
                    onClick={() => imageInputRef.current?.click()}
                    className="border-2 border-dashed border-[#E2E1EC] hover:border-[#4E45D5] rounded-xl p-6 text-center bg-[#F7F7FB] hover:bg-[#EEF2FF]/30 cursor-pointer transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-white border border-[#E2E1EC] flex items-center justify-center text-[#4E45D5] mx-auto mb-2 shadow-xs">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-semibold text-[#100E26]">
                      Click to upload swatches
                    </div>
                    <p className="text-[11px] text-[#5A586E] mt-0.5">
                      PNG, JPG or WebP (max 2 MB)
                    </p>
                  </div>
                )}

                <input
                  ref={imageInputRef}
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {imageError && (
                  <p className="text-xs text-[#E11D48] mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{imageError}</span>
                  </p>
                )}
              </div>

              {/* Product Video Section (YouTube Link only) */}
              <div className="pt-4 border-t border-[#E2E1EC]">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#100E26]">
                    Product Video <span className="text-[#9493A8] text-[11px] font-normal">(YouTube Link, optional)</span>
                  </label>
                  {videoYoutubeUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveVideo}
                      className="text-[11px] font-semibold text-[#E11D48] hover:underline cursor-pointer"
                    >
                      Remove Video
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="h-10 rounded-lg border border-[#E2E1EC] bg-white flex items-center focus-within:border-[#4E45D5] focus-within:ring-1 focus-within:ring-[#4E45D5] transition-all overflow-hidden">
                    <span className="pl-3 pr-2 flex items-center shrink-0">
                      <YouTubeIcon className="w-4 h-4 text-[#E11D48]" />
                    </span>
                    <input
                      type="text"
                      value={videoYoutubeUrl}
                      onChange={(e) => {
                        setVideoYoutubeUrl(e.target.value);
                        if (errors.video) setErrors((prev) => ({ ...prev, video: '' }));
                      }}
                      placeholder="e.g. https://www.youtube.com/watch?v=..."
                      className="w-full h-full pr-3 bg-transparent border-0 outline-none text-xs text-[#100E26] placeholder-[#9493A8]"
                    />
                  </div>
                  {errors.video && (
                    <p className="text-xs text-[#E11D48] flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.video}</span>
                    </p>
                  )}

                  {getYouTubeVideoId(videoYoutubeUrl) && (
                    <div className="relative aspect-video rounded-lg overflow-hidden border border-[#E2E1EC] bg-black mt-2">
                      <iframe
                        src={`https://www.youtube.com/embed/${getYouTubeVideoId(videoYoutubeUrl)}`}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: Form Sections 1, 2, 3, 4, 6 Stacked            */}
        {/* ============================================================ */}
        <div
          className={
            mode === 'page'
              ? 'w-full lg:flex-1 min-w-0 space-y-6'
              : 'space-y-6'
          }
        >
          {/* ---------------------------------------------------------- */}
          {/* SECTION 1: Basic Details                                    */}
          {/* ---------------------------------------------------------- */}
          <div className="bg-white rounded-xl border border-[#E2E1EC] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E2E1EC]">
              <div className="w-2 h-4 bg-[#4E45D5] rounded-full" />
              <h3 className="text-sm font-bold text-[#100E26] font-['Plus_Jakarta_Sans',sans-serif]">
                Section 1: Basic Details
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Product Name */}
              <div className="sm:col-span-2">
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
                  className={`input-base ${
                    errors.name ? 'border-[#E11D48] focus:border-[#E11D48]' : ''
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-[#E11D48] mt-1">{errors.name}</p>
                )}
              </div>

              {/* Design Number */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#100E26] mb-1.5">
                  Design Number <span className="text-[#E11D48]">*</span>
                </label>
                <input
                  type="text"
                  value={designNumber}
                  onChange={(e) => {
                    setDesignNumber(e.target.value);
                    if (errors.designNumber) {
                      setErrors((prev) => ({ ...prev, designNumber: '' }));
                    }
                  }}
                  placeholder="e.g. BN-1002"
                  className={`input-base ${
                    errors.designNumber
                      ? 'border-[#E11D48] focus:border-[#E11D48]'
                      : ''
                  }`}
                />
                {errors.designNumber && (
                  <p className="text-xs text-[#E11D48] mt-1">{errors.designNumber}</p>
                )}
              </div>

              {/* SKU */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#100E26]">
                    SKU <span className="text-[#E11D48]">*</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => {
                    setSku(e.target.value);
                    if (errors.sku) setErrors((prev) => ({ ...prev, sku: '' }));
                  }}
                  placeholder="e.g. TEX-BN1002-SILK"
                  className={`input-base ${
                    errors.sku ? 'border-[#E11D48] focus:border-[#E11D48]' : ''
                  }`}
                />
                {errors.sku && (
                  <p className="text-xs text-[#E11D48] mt-1">{errors.sku}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#100E26] mb-1.5">
                  Category <span className="text-[#E11D48]">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    if (errors.category) setErrors((prev) => ({ ...prev, category: '' }));
                  }}
                  className={`input-base bg-white ${
                    errors.category ? 'border-[#E11D48] focus:border-[#E11D48]' : ''
                  }`}
                >
                  {INITIAL_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-xs text-[#E11D48] mt-1">{errors.category}</p>
                )}
              </div>

              {/* Fabric Type */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#100E26] mb-1.5">
                  Fabric Blend / Base
                </label>
                <input
                  type="text"
                  value={fabric}
                  onChange={(e) => setFabric(e.target.value)}
                  placeholder="e.g. Pure Katan Silk / Organza"
                  className="input-base"
                />
              </div>

              {/* Product Description */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#100E26]">
                    Product Description
                  </label>
                  <span
                    className={`text-[11px] font-tabular font-medium ${
                      description.length > 200 ? 'text-[#E11D48]' : 'text-[#5A586E]'
                    }`}
                  >
                    {description.length}/200 characters
                  </span>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => {
                    if (e.target.value.length <= 200) {
                      setDescription(e.target.value);
                    }
                  }}
                  maxLength={200}
                  rows={3}
                  placeholder="Describe warp-weft construction, weave texture, zari craftsmanship, and garment suitability..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2E1EC] bg-white text-xs text-[#100E26] placeholder-[#9493A8] focus:border-[#4E45D5] focus:outline-none focus:ring-1 focus:ring-[#4E45D5] transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          {/* ---------------------------------------------------------- */}
          {/* SECTION 2: Stock & Inventory                                */}
          {/* ---------------------------------------------------------- */}
          <div className="bg-white rounded-xl border border-[#E2E1EC] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E2E1EC]">
              <div className="w-2 h-4 bg-[#4E45D5] rounded-full" />
              <h3 className="text-sm font-bold text-[#100E26] font-['Plus_Jakarta_Sans',sans-serif]">
                Section 2: Stock & Inventory
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Stock Quantity (Starts empty, placeholder e.g. 500) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#100E26] mb-1.5">
                  Stock Quantity <span className="text-[#E11D48]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => {
                      setStock(e.target.value);
                      if (errors.stock) setErrors((prev) => ({ ...prev, stock: '' }));
                    }}
                    placeholder="e.g. 500"
                    className={`input-base font-tabular ${
                      errors.stock ? 'border-[#E11D48] focus:border-[#E11D48]' : ''
                    }`}
                  />
                </div>
                {errors.stock && (
                  <p className="text-xs text-[#E11D48] mt-1">{errors.stock}</p>
                )}
              </div>

              {/* Stock Unit (Starts with "Select Unit") */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#100E26] mb-1.5">
                  Stock Unit <span className="text-[#E11D48]">*</span>
                </label>
                <select
                  value={stockUnit}
                  onChange={(e) => {
                    const val = e.target.value as StockUnit;
                    setStockUnit(val);
                    if (errors.stockUnit) {
                      setErrors((prev) => ({ ...prev, stockUnit: '' }));
                    }
                  }}
                  className={`input-base bg-white ${
                    errors.stockUnit ? 'border-[#E11D48] focus:border-[#E11D48]' : ''
                  }`}
                >
                  <option value="">Select Unit</option>
                  {STOCK_UNITS.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
                {errors.stockUnit && (
                  <p className="text-xs text-[#E11D48] mt-1">{errors.stockUnit}</p>
                )}
              </div>

              {/* MOQ with Stock Unit Suffix (Starts empty, placeholder e.g. 50) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#100E26] mb-1.5">
                  MOQ (Min. Order) <span className="text-[#E11D48]">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    min="1"
                    value={moq}
                    onChange={(e) => {
                      setMoq(e.target.value);
                      if (errors.moq) setErrors((prev) => ({ ...prev, moq: '' }));
                    }}
                    placeholder="e.g. 50"
                    className={`input-base font-tabular ${stockUnit ? 'pr-20' : ''} ${
                      errors.moq ? 'border-[#E11D48] focus:border-[#E11D48]' : ''
                    }`}
                  />
                  {stockUnit && (
                    <div className="absolute right-3 text-xs font-semibold text-[#5A586E] pointer-events-none">
                      {stockUnit}s
                    </div>
                  )}
                </div>
                {errors.moq && (
                  <p className="text-xs text-[#E11D48] mt-1">{errors.moq}</p>
                )}
              </div>
            </div>
          </div>

          {/* ---------------------------------------------------------- */}
          {/* SECTION 3: Product Specification                            */}
          {/* ---------------------------------------------------------- */}
          <div className="bg-white rounded-xl border border-[#E2E1EC] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E2E1EC]">
              <div className="w-2 h-4 bg-[#4E45D5] rounded-full" />
              <h3 className="text-sm font-bold text-[#100E26] font-['Plus_Jakarta_Sans',sans-serif]">
                Section 3: Product Specification
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Product Weight & Weight Unit */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#100E26] mb-1.5">
                  Product Weight
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    value={productWeight}
                    onChange={(e) => setProductWeight(e.target.value)}
                    placeholder="e.g. 140"
                    className="input-base font-tabular flex-1"
                  />
                  <select
                    value={weightUnit}
                    onChange={(e) => setWeightUnit(e.target.value as WeightUnit)}
                    className="h-10 px-3 rounded-lg border border-[#E2E1EC] bg-white text-xs text-[#100E26] focus:border-[#4E45D5] focus:outline-none"
                  >
                    {WEIGHT_UNITS.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Product Color (Name + Picker Dot) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#100E26] mb-1.5">
                  Product Color
                </label>
                <div className="h-10 rounded-lg border border-[#E2E1EC] bg-white flex items-center focus-within:border-[#4E45D5] focus-within:ring-1 focus-within:ring-[#4E45D5] transition-all overflow-hidden">
                  <div className="pl-3 pr-2 flex items-center shrink-0">
                    <label
                      htmlFor="color-picker-input"
                      className="w-5 h-5 rounded-full border border-[#CBC9D9] cursor-pointer shadow-xs shrink-0 block hover:scale-105 transition-transform"
                      style={{ backgroundColor: colorHex }}
                      title="Click to pick color swatch"
                    />
                    <input
                      id="color-picker-input"
                      type="color"
                      value={colorHex}
                      onChange={(e) => setColorHex(e.target.value)}
                      className="sr-only"
                    />
                  </div>
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="e.g. Crimson Red / Rani Pink"
                    className="w-full h-full pr-3 bg-transparent border-0 outline-none text-xs text-[#100E26] placeholder-[#9493A8]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ---------------------------------------------------------- */}
          {/* SECTION 4: Additional Settings                             */}
          {/* ---------------------------------------------------------- */}
          <div className="bg-white rounded-xl border border-[#E2E1EC] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E2E1EC]">
              <div className="w-2 h-4 bg-[#4E45D5] rounded-full" />
              <h3 className="text-sm font-bold text-[#100E26] font-['Plus_Jakarta_Sans',sans-serif]">
                Section 4: Additional Settings
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tax Dropdown (Starts with "Select Tax Rate") */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#100E26] mb-1.5">
                  Tax Rate (GST)
                </label>
                <select
                  value={tax}
                  onChange={(e) => setTax(e.target.value as TaxRate)}
                  className="input-base bg-white font-tabular"
                >
                  <option value="">Select Tax Rate</option>
                  {TAX_RATES.map((rate) => (
                    <option key={rate} value={rate}>
                      {rate}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tax Type Segmented Control */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#100E26] mb-1.5">
                  Tax Type
                </label>
                <div className="grid grid-cols-2 p-1 bg-[#F7F7FB] rounded-lg border border-[#E2E1EC] h-10 items-center">
                  {(['GST Inclusive', 'GST Exclusive'] as TaxType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setTaxType(type)}
                      className={`h-8 rounded-md text-xs font-medium transition-all ${
                        taxType === type
                          ? 'bg-white text-[#100E26] shadow-xs font-semibold'
                          : 'text-[#5A586E] hover:text-[#100E26]'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ---------------------------------------------------------- */}
          {/* SECTION 6: Discount / Quantity-based Pricing                */}
          {/* ---------------------------------------------------------- */}
          <div className="bg-white rounded-xl border border-[#E2E1EC] p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E1EC]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-4 bg-[#4E45D5] rounded-full" />
                <div>
                  <h3 className="text-sm font-bold text-[#100E26] font-['Plus_Jakarta_Sans',sans-serif]">
                    Section 6: Quantity Tier Pricing
                  </h3>
                  <p className="text-[11px] text-[#5A586E]">
                    Volume discounts for B2B buyers & looms
                  </p>
                </div>
              </div>

              {/* Pricing Unit Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#5A586E]">Unit:</span>
                <select
                  value={pricingUnit}
                  onChange={(e) => setPricingUnit(e.target.value as StockUnit)}
                  className="h-8 px-2.5 rounded-lg border border-[#E2E1EC] bg-white text-xs font-medium text-[#100E26] focus:border-[#4E45D5] focus:outline-none"
                >
                  <option value="">Select Unit</option>
                  {STOCK_UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-3 bg-[#EEF2FF]/40 border border-[#C7D2FE]/60 rounded-lg flex items-start gap-2">
              <Info className="w-4 h-4 text-[#4E45D5] shrink-0 mt-0.5" />
              <p className="text-xs text-[#4338CA] leading-relaxed">
                Define wholesale discount tiers based on order volume. For example: 1-100 {pricingUnit || 'Units'} at &#8377;1000, 101-200 {pricingUnit || 'Units'} at &#8377;950, 201+ {pricingUnit || 'Units'} at &#8377;900.
              </p>
            </div>

            {/* Ranges Rows */}
            <div className="space-y-3">
              <div className="hidden sm:grid grid-cols-12 gap-3 text-[11px] font-bold uppercase tracking-wider text-[#5A586E] px-1">
                <div className="col-span-3">Min Quantity *</div>
                <div className="col-span-3">Max Quantity</div>
                <div className="col-span-5">Wholesale Price / {pricingUnit || 'Unit'} *</div>
                <div className="col-span-1 text-right">Action</div>
              </div>

              {ranges.map((range, index) => {
                const isLast = index === ranges.length - 1;
                const err = rangeErrors[range.id];

                return (
                  <div key={range.id} className="space-y-1.5">
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 items-center bg-[#F7F7FB] p-2.5 sm:p-3 rounded-lg border border-[#E2E1EC]">
                      {/* Min Qty */}
                      <div className="sm:col-span-3">
                        <span className="sm:hidden text-[10px] font-bold text-[#5A586E] uppercase block mb-1">
                          Min Quantity *
                        </span>
                        <input
                          type="number"
                          min="1"
                          value={range.min}
                          onChange={(e) =>
                            handleRangeChange(range.id, 'min', e.target.value)
                          }
                          placeholder="e.g. 1"
                          className="input-base font-tabular bg-white"
                        />
                      </div>

                      {/* Max Qty (Starts empty, placeholder e.g. 100 or and above...) */}
                      <div className="sm:col-span-3">
                        <span className="sm:hidden text-[10px] font-bold text-[#5A586E] uppercase block mb-1">
                          Max Quantity {isLast && '(Empty for "+ and above")'}
                        </span>
                        <input
                          type="number"
                          min="1"
                          value={range.max}
                          onChange={(e) =>
                            handleRangeChange(range.id, 'max', e.target.value)
                          }
                          placeholder={isLast ? 'and above...' : 'e.g. 100'}
                          className="input-base font-tabular bg-white"
                        />
                      </div>

                      {/* Price per unit with ₹ prefix */}
                      <div className="sm:col-span-5">
                        <span className="sm:hidden text-[10px] font-bold text-[#5A586E] uppercase block mb-1">
                          Price per {pricingUnit || 'Unit'} *
                        </span>
                        <div
                          className={`h-10 rounded-lg border bg-white flex items-center focus-within:border-[#4E45D5] focus-within:ring-1 focus-within:ring-[#4E45D5] transition-all overflow-hidden ${
                            err ? 'border-[#E11D48]' : 'border-[#E2E1EC]'
                          }`}
                        >
                          <span className="pl-3 pr-1.5 text-xs font-semibold text-[#5A586E] select-none shrink-0">
                            &#8377;
                          </span>
                          <input
                            type="number"
                            min="1"
                            value={range.price}
                            onChange={(e) =>
                              handleRangeChange(range.id, 'price', e.target.value)
                            }
                            placeholder="0"
                            className="w-full h-full pr-3 bg-transparent border-0 outline-none text-xs text-[#100E26] font-tabular placeholder-[#9493A8]"
                          />
                        </div>
                      </div>

                      {/* Remove Button */}
                      <div className="sm:col-span-1 flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveRange(range.id)}
                          disabled={ranges.length <= 1}
                          className="p-2 rounded-lg text-[#9493A8] hover:text-[#E11D48] hover:bg-[#FFF1F2] transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#9493A8]"
                          title="Remove tier"
                          aria-label="Remove tier"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {err && (
                      <p className="text-xs text-[#E11D48] px-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{err}</span>
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add Range Button */}
            {ranges.length < 5 && (
              <button
                type="button"
                onClick={handleAddRange}
                className="btn-secondary w-full sm:w-auto text-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#4E45D5]" />
                <span>Add Quantity Range ({ranges.length}/5)</span>
              </button>
            )}

            {errors.ranges && (
              <p className="text-xs text-[#E11D48]">{errors.ranges}</p>
            )}

            {/* Read-only Summary Lines */}
            <div className="pt-3 border-t border-[#E2E1EC] space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A586E] block mb-1">
                Tier Pricing Summary
              </span>
              <div className="flex flex-wrap gap-2">
                {ranges.map((r, i) => {
                  const minStr = r.min || '?';
                  const maxStr = r.max ? `${r.max}` : `${minStr}+`;
                  const priceStr = r.price ? `₹${Number(r.price).toLocaleString('en-IN')}` : '₹--';
                  const unitLabel = pricingUnit || 'Unit';

                  return (
                    <div
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#F7F7FB] border border-[#E2E1EC] text-xs font-medium text-[#100E26]"
                    >
                      <span className="text-[#5A586E]">
                        {r.max ? `${minStr} - ${maxStr}` : `${maxStr}`} {unitLabel}:
                      </span>
                      <span className="font-bold text-[#4E45D5]">
                        {priceStr}
                      </span>
                      <span className="text-[10px] text-[#9493A8]">/ {unitLabel}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* Sticky Bottom Action Bar (Only in page mode)                 */}
      {/* ============================================================ */}
      {mode === 'page' && (
        <div className="sticky bottom-4 z-20 py-3 px-6 bg-white border border-[#E2E1EC] rounded-xl shadow-lg flex items-center justify-between mt-8">
          <p className="text-xs text-[#5A586E] hidden sm:block">
            Fill in required fields marked with <span className="text-[#E11D48]">*</span> to register product.
          </p>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="btn-secondary w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary w-full sm:w-auto"
            >
              Save Product
            </button>
          </div>
        </div>
      )}
    </form>
  );
}

export interface ProductFormDrawerProps {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
  onSaved?: (productData: Partial<Product>) => void;
  zIndex?: string;
}

export function ProductFormDrawer({
  open,
  onClose,
  product,
  onSaved,
  zIndex = 'z-50',
}: ProductFormDrawerProps) {
  const submitRef = useRef<() => void>(() => {});

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
      onSave={() => {
        submitRef.current();
      }}
      saveText="Save Product"
      cancelText="Cancel"
      width="2xl"
      zIndex={zIndex}
    >
      <ProductForm
        mode="drawer"
        initialProduct={product}
        onSaved={onSaved}
        onCancel={onClose}
        onRegisterSubmit={(fn) => {
          submitRef.current = fn;
        }}
      />
    </CommonDrawer>
  );
}

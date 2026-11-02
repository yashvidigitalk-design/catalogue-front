'use client';

import { useState } from 'react';
import { Plus, X, Package } from 'lucide-react';
import CommonDrawer from '@/components/CommonDrawer';
import ProductSelectionDrawer from '@/components/ProductSelectionDrawer';
import { Catalogue, Product } from '@/types';
import { INITIAL_PRODUCTS } from '@/lib/productsData';
import { useToast } from '@/hooks/useToast';
import { InputField, TextareaField } from '@/components/FormControls';

interface CatalogueFormDrawerProps {
  open: boolean;
  onClose: () => void;
  catalogue?: Catalogue | null;
  onSaved?: (data: Partial<Catalogue>) => void;
}

export default function CatalogueFormDrawer({
  open,
  onClose,
  catalogue,
  onSaved,
}: CatalogueFormDrawerProps) {
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSelectionOpen, setIsSelectionOpen] = useState(false);

  const [prevOpen, setPrevOpen] = useState(false);
  const [prevCat, setPrevCat] = useState<Catalogue | null | undefined>(undefined);

  if (open !== prevOpen || catalogue !== prevCat) {
    setPrevOpen(open);
    setPrevCat(catalogue);
    if (catalogue) {
      setName(catalogue.name || '');
      setDescription(catalogue.description || '');
      setStatus(catalogue.status || 'active');
      const initialProds = INITIAL_PRODUCTS.filter((p) =>
        catalogue.productIds?.includes(p.id)
      );
      setSelectedProducts(initialProds);
    } else {
      setName('');
      setDescription('');
      setStatus('active');
      setSelectedProducts([]);
    }
    setErrors({});
  }

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleAddSelectedProducts = (prods: Product[]) => {
    setSelectedProducts(prods);
  };

  const handleSave = () => {
    if (!name.trim()) {
      setErrors({ name: 'Catalogue name is required' });
      showToast('error', 'Catalogue name is required');
      return;
    }

    const payload: Partial<Catalogue> = {
      name: name.trim(),
      description: description.trim(),
      status,
      productIds: selectedProducts.map((p) => p.id),
      totalProducts: selectedProducts.length,
      lastUpdated: 'Today',
    };

    showToast('success', catalogue ? 'Catalogue updated' : 'Catalogue saved');
    if (onSaved) onSaved(payload);
    onClose();
  };

  return (
    <>
      <CommonDrawer
        isOpen={open}
        onClose={onClose}
        title={catalogue ? 'Edit Catalogue' : 'Create Catalogue'}
        description={
          catalogue
            ? 'Update collection title, fabric description, and attached wholesale products.'
            : 'Assemble a curated digital fabric swatch-book for your wholesale buyers.'
        }
        onSave={handleSave}
        saveText="Save Catalogue"
        width="xl"
      >
        <div className="space-y-5">
          {/* Catalogue Name (required) */}
          <InputField
            label="Catalogue Name"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
            }}
            placeholder="e.g. Festive Bridal Brocades 2026"
            error={errors.name}
          />

          {/* Description (textarea) */}
          <TextareaField
            label="Description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide context on fabric weave, count, GSM, and target garments for this lookbook..."
          />

          {/* Status (Active / Inactive) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#100E26] mb-1.5">
              Status
            </label>
            <div className="flex items-center gap-4 h-10">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-[#100E26]">
                <input
                  type="radio"
                  name="catalogue-status"
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
                  name="catalogue-status"
                  value="inactive"
                  checked={status === 'inactive'}
                  onChange={() => setStatus('inactive')}
                  className="w-4 h-4 text-[#4E45D5] focus:ring-[#4E45D5]"
                />
                Inactive
              </label>
            </div>
          </div>

          {/* Products Section */}
          <div className="pt-2 border-t border-[#E2E1EC] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#100E26]">
                  Products
                </label>
                <p className="text-xs text-[#5A586E]">
                  Attach fabric designs to this catalogue (Optional)
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsSelectionOpen(true)}
                className="btn-secondary h-9 px-3 text-xs gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-[#4E45D5]" />
                <span>Add Products</span>
              </button>
            </div>

            {/* Empty state hint */}
            {selectedProducts.length === 0 ? (
              <div className="p-4 rounded-xl bg-[#F7F7FB] border border-[#E2E1EC] text-center space-y-2">
                <div className="w-9 h-9 rounded-full bg-[#EEF2FF] text-[#4E45D5] flex items-center justify-center mx-auto">
                  <Package className="w-4 h-4" />
                </div>
                <p className="text-xs text-[#5A586E]">
                  No products added yet. You can save the catalogue without products.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSelectionOpen(true)}
                  className="text-xs font-semibold text-[#4E45D5] hover:underline inline-flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Select products now
                </button>
              </div>
            ) : (
              /* Compact Selected Products List */
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#5A586E] font-medium font-tabular px-1">
                  <span>{selectedProducts.length} products selected</span>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                  {selectedProducts.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-[#E2E1EC] bg-[#FFFFFF] hover:bg-[#F7F7FB] transition-colors"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#E2E1EC] shrink-0 bg-[#F7F7FB]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="text-xs font-semibold text-[#100E26] truncate max-w-[240px]">
                            {p.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-semibold text-[#4E45D5] bg-[#EEF2FF] px-1.5 py-0.2 rounded border border-[#C7D2FE] font-tabular">
                              {p.designNumber}
                            </span>
                            <span className="text-xs font-bold text-[#100E26] font-tabular">
                              ₹{p.wholesalePrice.toLocaleString('en-IN')}/m
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(p.id)}
                        className="p-1.5 rounded-md text-[#9493A8] hover:text-[#E11D48] hover:bg-[#FFF1F2] transition-colors"
                        title="Remove product"
                        aria-label={`Remove ${p.name}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CommonDrawer>

      {/* Product Selection Drawer opened on top */}
      <ProductSelectionDrawer
        open={isSelectionOpen}
        onClose={() => setIsSelectionOpen(false)}
        initialSelectedProductIds={selectedProducts.map((p) => p.id)}
        onAddSelected={handleAddSelectedProducts}
      />
    </>
  );
}

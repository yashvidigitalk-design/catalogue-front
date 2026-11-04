'use client';

import { useState, useEffect } from 'react';
import CommonDrawer from '@/components/CommonDrawer';
import ImageUpload from '@/components/ImageUpload';
import { InputField } from '@/components/FormControls';
import { Category } from '@/types';
import { useToast } from '@/hooks/useToast';

interface CategoryFormDrawerProps {
  open: boolean;
  onClose: () => void;
  category?: Category | null;
  onSaved?: (data: Partial<Category>) => void;
}

export default function CategoryFormDrawer({
  open,
  onClose,
  category,
  onSaved,
}: CategoryFormDrawerProps) {
  const { showToast } = useToast();

  const [formName, setFormName] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formVisible, setFormVisible] = useState(true);
  const [formStatus, setFormStatus] = useState<'active' | 'inactive'>('active');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      if (category) {
        setFormName(category.name || '');
        setFormImage(category.image || '');
        setFormVisible(category.visibleOnStorefront ?? true);
        setFormStatus(category.status || 'active');
      } else {
        setFormName('');
        setFormImage('');
        setFormVisible(true);
        setFormStatus('active');
      }
      setFormErrors({});
    }
  }, [open, category]);

  const handleSaveCategory = () => {
    if (!formName.trim()) {
      setFormErrors({ name: 'Category name is required' });
      showToast('error', 'Category name is required');
      return;
    }

    showToast(
      'success',
      category ? 'Category updated successfully' : 'Category created successfully'
    );
    if (onSaved) {
      onSaved({
        name: formName.trim(),
        image: formImage,
        visibleOnStorefront: formVisible,
        status: formStatus,
      });
    }
    onClose();
  };

  return (
    <CommonDrawer
      isOpen={open}
      onClose={onClose}
      title={category ? 'Edit Category' : 'Add Category'}
      description={
        category
          ? 'Update category settings and digital storefront visibility.'
          : 'Create a new fabric classification for your wholesale inventory.'
      }
      onSave={handleSaveCategory}
      saveText="Save"
      cancelText="Cancel"
      width="lg"
    >
      <div className="space-y-5">
        {/* Category Name (required) */}
        <InputField
          label="Category Name"
          required
          value={formName}
          onChange={(e) => {
            setFormName(e.target.value);
            if (formErrors.name) setFormErrors({});
          }}
          placeholder="e.g. Banarasi Brocade"
          error={formErrors.name}
        />

        {/* Category Image (ImageUpload single, with preview) */}
        <div>
          <ImageUpload
            initialImages={formImage ? [formImage] : []}
            maxImages={1}
            label="Category Image"
            helperText="Upload a high-resolution weave texture thumbnail (PNG, JPG)."
            onChange={(imgs) => setFormImage(imgs[0] || '')}
          />
        </div>

        {/* Visible on Storefront (toggle) */}
        <div className="flex items-center justify-between p-3.5 bg-[#F7F7FB] border border-[#E2E1EC] rounded-xl">
          <div>
            <span className="text-sm font-semibold text-[#100E26] block">
              Visible on Storefront
            </span>
            <span className="text-xs text-[#5A586E]">
              Display this fabric category on your digital customer-facing portal
            </span>
          </div>
          <button
            type="button"
            onClick={() => setFormVisible(!formVisible)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              formVisible ? 'bg-[#4E45D5]' : 'bg-[#D5D4E2]'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                formVisible ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Status (Active / Inactive) */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#100E26] mb-1.5">
            Status
          </label>
          <div className="flex items-center gap-4 h-10">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-[#100E26]">
              <input
                type="radio"
                name="cat-form-status"
                value="active"
                checked={formStatus === 'active'}
                onChange={() => setFormStatus('active')}
                className="w-4 h-4 text-[#4E45D5] focus:ring-[#4E45D5]"
              />
              Active
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-[#5A586E]">
              <input
                type="radio"
                name="cat-form-status"
                value="inactive"
                checked={formStatus === 'inactive'}
                onChange={() => setFormStatus('inactive')}
                className="w-4 h-4 text-[#4E45D5] focus:ring-[#4E45D5]"
              />
              Inactive
            </label>
          </div>
        </div>
      </div>
    </CommonDrawer>
  );
}

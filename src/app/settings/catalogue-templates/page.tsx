'use client';

import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import TemplateCard from '@/components/TemplateCard';
import TemplatePreview from '@/components/TemplatePreview';
import CommonDrawer from '@/components/CommonDrawer';
import {
  DEFAULT_TEMPLATES,
  BRAND_COLOR_OPTIONS,
} from '@/lib/settingsData';
import { CatalogueTemplate, TemplateCustomization } from '@/types';
import { triggerToast } from '@/hooks/useToast';
import { Check } from 'lucide-react';
import { InputField, TextareaField } from '@/components/FormControls';

export default function CatalogueTemplatesPage() {
  const [templates, setTemplates] = useState<CatalogueTemplate[]>(DEFAULT_TEMPLATES);
  const [defaultTemplateId, setDefaultTemplateId] = useState<string>('classic-grid');

  // Preview Drawer State
  const [previewTemplate, setPreviewTemplate] = useState<CatalogueTemplate | null>(null);

  // Customize Drawer State
  const [customizeTemplate, setCustomizeTemplate] = useState<CatalogueTemplate | null>(null);
  const [customForm, setCustomForm] = useState<TemplateCustomization | null>(null);

  // Set default action
  const handleSetDefault = (templateId: string) => {
    setDefaultTemplateId(templateId);
    setTemplates((prev) =>
      prev.map((t) => ({
        ...t,
        isDefault: t.id === templateId,
      }))
    );
    const target = templates.find((t) => t.id === templateId);
    triggerToast(
      'success',
      'Default Template Updated',
      `${target?.name || 'Template'} is now set as your active wholesale storefront template.`
    );
  };

  // Open Preview Drawer
  const handleOpenPreview = (template: CatalogueTemplate) => {
    setPreviewTemplate(template);
  };

  // Open Customize Drawer
  const handleOpenCustomize = (template: CatalogueTemplate) => {
    setCustomizeTemplate(template);
    setCustomForm({ ...template.customization });
  };

  // Save Customization
  const handleSaveCustomization = () => {
    if (!customizeTemplate || !customForm) return;

    setTemplates((prev) =>
      prev.map((t) =>
        t.id === customizeTemplate.id ? { ...t, customization: { ...customForm } } : t
      )
    );

    triggerToast(
      'success',
      'Customization Saved',
      `Custom styling and visibility rules for ${customizeTemplate.name} have been updated.`
    );

    setCustomizeTemplate(null);
    setCustomForm(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header (Strict title & description rules, no action buttons) */}
      <PageHeader
        title="Catalogue Templates"
        description="Select, preview, and customize your wholesale digital swatch-book and buyer lookbook layouts."
      />

      {/* 2. Exactly 2 Template Cards Side by Side (Stacked on mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {templates.map((tpl) => (
          <TemplateCard
            key={tpl.id}
            template={tpl}
            isDefault={tpl.id === defaultTemplateId}
            onSetDefault={handleSetDefault}
            onPreview={handleOpenPreview}
            onCustomize={handleOpenCustomize}
          />
        ))}
      </div>

      {/* 3. Preview Drawer (Wide: width="xl") */}
      {previewTemplate && (
        <CommonDrawer
          isOpen={Boolean(previewTemplate)}
          onClose={() => setPreviewTemplate(null)}
          title={`Catalogue Preview — ${previewTemplate.name}`}
          description="High-definition full page preview with active swatch patterns and pricing structure."
          width="xl"
          cancelText="Close"
          saveText={
            previewTemplate.id === defaultTemplateId
              ? 'Default Template'
              : 'Set as Default'
          }
          onSave={
            previewTemplate.id === defaultTemplateId
              ? undefined
              : () => {
                  handleSetDefault(previewTemplate.id);
                  setPreviewTemplate(null);
                }
          }
        >
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden border border-[#E2E1EC] bg-[#F7F7FB]">
              <TemplatePreview
                templateId={previewTemplate.id as 'classic-grid' | 'elegant-lookbook'}
                customization={previewTemplate.customization}
                mode="drawer"
              />
            </div>
            <p className="text-xs text-[#5A586E] text-center">
              This layout renders responsively on buyer mobiles, tablets, and PDF exports.
            </p>
          </div>
        </CommonDrawer>
      )}

      {/* 4. Customize Drawer (width="lg") with Live Mini Preview */}
      {customizeTemplate && customForm && (
        <CommonDrawer
          isOpen={Boolean(customizeTemplate)}
          onClose={() => {
            setCustomizeTemplate(null);
            setCustomForm(null);
          }}
          title={`Customize ${customizeTemplate.name}`}
          description="Personalize headers, branding colors, and toggle product field visibility in real-time."
          width="lg"
          cancelText="Cancel"
          saveText="Save Changes"
          onSave={handleSaveCustomization}
        >
          <div className="space-y-6">
            {/* Live Updating Mini Preview */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#100E26]">
                Live Layout Preview
              </label>
              <div className="rounded-xl overflow-hidden border border-[#E2E1EC] bg-[#F7F7FB]">
                <TemplatePreview
                  templateId={customizeTemplate.id as 'classic-grid' | 'elegant-lookbook'}
                  customization={customForm}
                  mode="mini"
                />
              </div>
            </div>

            {/* Template Title */}
            <InputField
              label="Template Title"
              value={customForm.title}
              onChange={(e) =>
                setCustomForm({ ...customForm, title: e.target.value })
              }
              placeholder="e.g. Summer Fabric Volume Catalogue"
            />

            {/* Brand Color (5 Swatches) */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#100E26]">
                Brand Color Accent
              </label>
              <div className="flex items-center gap-3">
                {BRAND_COLOR_OPTIONS.map((c) => {
                  const isSelected = customForm.brandColor === c.hex;
                  return (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() =>
                        setCustomForm({ ...customForm, brandColor: c.hex })
                      }
                      className={`h-9 w-9 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? 'ring-3 ring-[#4E45D5]/30 ring-offset-2 scale-110 shadow-xs'
                          : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.label}
                      aria-label={`Select ${c.label}`}
                    >
                      {isSelected && <Check className="w-4 h-4 text-white" />}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-[#5A586E]">
                Applied to headings, volume issue badges, and emphasis borders.
              </p>
            </div>

            {/* Field Visibility Toggles */}
            <div className="space-y-3 pt-3 border-t border-[#E2E1EC]">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#100E26]">
                Field Visibility Rules
              </label>

              {/* Show Prices Toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-[#E2E1EC] bg-[#FAF9FD]">
                <div>
                  <div className="text-xs font-bold text-[#100E26]">Show Wholesale Prices</div>
                  <div className="text-[11px] text-[#5A586E]">
                    Display per-meter / per-piece wholesale rates
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setCustomForm({ ...customForm, showPrices: !customForm.showPrices })
                  }
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    customForm.showPrices ? 'bg-[#4E45D5]' : 'bg-[#D5D4E2]'
                  }`}
                  aria-label="Toggle prices"
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      customForm.showPrices ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Show Design Number Toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-[#E2E1EC] bg-[#FAF9FD]">
                <div>
                  <div className="text-xs font-bold text-[#100E26]">Show Design Numbers</div>
                  <div className="text-[11px] text-[#5A586E]">
                    Include design SKU codes (e.g. DES #CH-902)
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setCustomForm({
                      ...customForm,
                      showDesignNumber: !customForm.showDesignNumber,
                    })
                  }
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    customForm.showDesignNumber ? 'bg-[#4E45D5]' : 'bg-[#D5D4E2]'
                  }`}
                  aria-label="Toggle design number"
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      customForm.showDesignNumber ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Show MOQ Toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-[#E2E1EC] bg-[#FAF9FD]">
                <div>
                  <div className="text-xs font-bold text-[#100E26]">Show Minimum Order Qty (MOQ)</div>
                  <div className="text-[11px] text-[#5A586E]">
                    Display minimum bale / roll requirements
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setCustomForm({ ...customForm, showMOQ: !customForm.showMOQ })
                  }
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    customForm.showMOQ ? 'bg-[#4E45D5]' : 'bg-[#D5D4E2]'
                  }`}
                  aria-label="Toggle MOQ"
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      customForm.showMOQ ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Footer Note */}
            <div className="pt-2 border-t border-[#E2E1EC]">
              <TextareaField
                label="Catalogue Terms & Footer Note"
                rows={3}
                value={customForm.footerNote}
                onChange={(e) =>
                  setCustomForm({ ...customForm, footerNote: e.target.value })
                }
                className="resize-none"
                placeholder="e.g. All rates are ex-mill Surat. 5% GST applicable."
              />
            </div>
          </div>
        </CommonDrawer>
      )}
    </div>
  );
}

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

const VISIBILITY_TOGGLES: {
  key: 'showPrices' | 'showDesignNumber' | 'showMOQ';
  label: string;
  desc: string;
}[] = [
  {
    key: 'showPrices',
    label: 'Show Wholesale Prices',
    desc: 'Display per-meter / per-piece wholesale rates',
  },
  {
    key: 'showDesignNumber',
    label: 'Show Design Numbers',
    desc: 'Include design SKU codes (e.g. DES #CH-902)',
  },
  {
    key: 'showMOQ',
    label: 'Show Minimum Order Qty (MOQ)',
    desc: 'Display minimum bale / roll requirements',
  },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-wider text-[#100E26]">
      {children}
    </label>
  );
}

function TemplatePreviewFrame({
  templateId,
  customization,
  mode,
}: {
  templateId: string;
  customization: TemplateCustomization;
  mode: 'drawer' | 'mini';
}) {
  return (
    <div className="rounded-xl overflow-hidden border border-[#E2E1EC] bg-[#F7F7FB]">
      <TemplatePreview
        templateId={templateId as 'classic-grid' | 'elegant-lookbook'}
        customization={customization}
        mode={mode}
      />
    </div>
  );
}

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

  // Close Customize Drawer and clear form
  const handleCloseCustomize = () => {
    setCustomizeTemplate(null);
    setCustomForm(null);
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

    handleCloseCustomize();
  };

  const isPreviewDefault = previewTemplate?.id === defaultTemplateId;

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
            onPreview={setPreviewTemplate}
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
          saveText={isPreviewDefault ? 'Default Template' : 'Set as Default'}
          onSave={
            isPreviewDefault
              ? undefined
              : () => {
                  handleSetDefault(previewTemplate.id);
                  setPreviewTemplate(null);
                }
          }
        >
          <div className="space-y-4">
            <TemplatePreviewFrame
              templateId={previewTemplate.id}
              customization={previewTemplate.customization}
              mode="drawer"
            />
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
          onClose={handleCloseCustomize}
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
              <SectionLabel>Live Layout Preview</SectionLabel>
              <TemplatePreviewFrame
                templateId={customizeTemplate.id}
                customization={customForm}
                mode="mini"
              />
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
              <SectionLabel>Brand Color Accent</SectionLabel>
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
              <SectionLabel>Field Visibility Rules</SectionLabel>

              {VISIBILITY_TOGGLES.map(({ key, label, desc }) => {
                const isEnabled = customForm[key];
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 rounded-lg border border-[#E2E1EC] bg-[#FAF9FD]"
                  >
                    <div>
                      <div className="text-xs font-bold text-[#100E26]">{label}</div>
                      <div className="text-[11px] text-[#5A586E]">{desc}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setCustomForm({ ...customForm, [key]: !isEnabled })
                      }
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                        isEnabled ? 'bg-[#4E45D5]' : 'bg-[#D5D4E2]'
                      }`}
                      aria-label={`Toggle ${label}`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          isEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
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

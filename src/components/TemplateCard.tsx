'use client';

import { Eye, Sliders, Check } from 'lucide-react';
import { CatalogueTemplate } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import TemplatePreview from '@/components/TemplatePreview';

interface TemplateCardProps {
  template: CatalogueTemplate;
  isDefault: boolean;
  onSetDefault: (id: string) => void;
  onPreview: (template: CatalogueTemplate) => void;
  onCustomize: (template: CatalogueTemplate) => void;
}

export default function TemplateCard({
  template,
  isDefault,
  onSetDefault,
  onPreview,
  onCustomize,
}: TemplateCardProps) {
  return (
    <div className="bg-white border border-[#E2E1EC] rounded-xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Preview Container */}
        <div className="w-full mb-4 rounded-xl overflow-hidden border border-[#E2E1EC] bg-[#F7F7FB]">
          <TemplatePreview
            templateId={template.id as 'classic-grid' | 'elegant-lookbook'}
            customization={template.customization}
            mode="card"
          />
        </div>

        {/* Title, Badge & Description */}
        <div className="flex items-center justify-between gap-3">
          <h3
            className="text-lg font-bold text-[#100E26]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {template.name}
          </h3>

          {isDefault && (
            <StatusBadge label="Default" variant="green" size="sm" showDot />
          )}
        </div>

        <p className="text-xs text-[#5A586E] mt-1.5 leading-relaxed min-h-[36px]">
          {template.description}
        </p>
      </div>

      {/* Action Buttons Row (Standard 40px height) */}
      <div className="mt-5 pt-4 border-t border-[#F1F0F7] flex flex-wrap sm:flex-nowrap items-center gap-2.5">
        <button
          type="button"
          onClick={() => onPreview(template)}
          className="flex-1 h-10 px-3 rounded-lg border border-[#E2E1EC] bg-white text-xs sm:text-sm font-medium text-[#100E26] hover:bg-[#F7F7FB] transition-colors inline-flex items-center justify-center gap-1.5"
          title={`Preview ${template.name}`}
        >
          <Eye className="w-4 h-4 text-[#5A586E]" />
          <span>Preview</span>
        </button>

        <button
          type="button"
          onClick={() => onCustomize(template)}
          className="flex-1 h-10 px-3 rounded-lg border border-[#E2E1EC] bg-white text-xs sm:text-sm font-medium text-[#100E26] hover:bg-[#F7F7FB] transition-colors inline-flex items-center justify-center gap-1.5"
          title={`Customize ${template.name}`}
        >
          <Sliders className="w-4 h-4 text-[#5A586E]" />
          <span>Customize</span>
        </button>

        <button
          type="button"
          onClick={() => onSetDefault(template.id)}
          disabled={isDefault}
          className={`flex-1 h-10 px-3.5 rounded-lg text-xs sm:text-sm font-medium inline-flex items-center justify-center gap-1.5 transition-all ${
            isDefault
              ? 'bg-[#F1F0F7] text-[#9493A8] border border-[#E2E1EC] cursor-not-allowed'
              : 'bg-[#4E45D5] hover:bg-[#6860EF] text-white shadow-xs'
          }`}
          title={isDefault ? 'Currently active default template' : `Set ${template.name} as default`}
        >
          {isDefault ? (
            <>
              <Check className="w-4 h-4" />
              <span>Default Template</span>
            </>
          ) : (
            <span>Set as Default</span>
          )}
        </button>
      </div>
    </div>
  );
}

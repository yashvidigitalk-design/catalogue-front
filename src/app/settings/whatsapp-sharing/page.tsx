'use client';

import React, { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import WhatsAppPreview from '@/components/WhatsAppPreview';
import { DEFAULT_WHATSAPP_SETTINGS } from '@/lib/settingsData';
import { triggerToast } from '@/hooks/useToast';
import { Copy, Save, Check, MessageSquare, Link2, Smartphone, Info } from 'lucide-react';
import { InputField, TextareaField } from '@/components/FormControls';

export default function WhatsAppSharingPage() {
  const [storefrontUrl] = useState(DEFAULT_WHATSAPP_SETTINGS.storefrontUrl);
  const [businessNumber, setBusinessNumber] = useState(DEFAULT_WHATSAPP_SETTINGS.businessNumber);
  const [message, setMessage] = useState(DEFAULT_WHATSAPP_SETTINGS.defaultMessage);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(storefrontUrl).catch(() => {});
    }
    setIsCopied(true);
    triggerToast(
      'success',
      'Link Copied',
      'Storefront link copied to clipboard.'
    );
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast(
      'success',
      'Settings Saved',
      'WhatsApp sharing templates and contact credentials have been updated.'
    );
  };

  const handleInsertTag = (tag: string) => {
    setMessage((prev) => `${prev} ${tag}`);
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header (Strict title & description rules, no action buttons) */}
      <PageHeader
        title="WhatsApp Sharing"
        description="Configure one-click WhatsApp broadcast templates, storefront links, and buyer inquiries."
      />

      {/* 2. Two-column Layout on Desktop, Stacked on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Card: Sharing Settings Form */}
        <div className="bg-white border border-[#E2E1EC] rounded-xl p-5 shadow-xs">
          <div className="pb-4 border-b border-[#F1F0F7] flex items-center justify-between">
            <div>
              <h3
                className="text-lg font-bold text-[#100E26]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Sharing Settings
              </h3>
              <p className="text-xs text-[#5A586E] mt-0.5">
                Customize the default broadcast parameters sent to wholesale buyers
              </p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#EEF2FF] text-[#4E45D5] flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>

          <form onSubmit={handleSaveSettings} className="mt-5 space-y-5">
            {/* Website / Storefront Link */}
            <InputField
              label="Website / Storefront Link"
              type="text"
              readOnly
              value={storefrontUrl}
              prefixIcon={<Link2 className="w-4 h-4 text-[#9493A8]" />}
              suffix={
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="h-7 px-3 rounded-md bg-white border border-[#E2E1EC] hover:bg-[#F7F7FB] text-xs font-medium text-[#100E26] flex items-center gap-1.5 shadow-2xs transition-colors"
                  title="Copy link to clipboard"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#059669]" />
                      <span className="text-[#059669]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#5A586E]" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              }
              className="font-mono text-xs bg-[#F7F7FB] select-all cursor-text !pr-24"
              helperText="Direct digital swatch-book URL shared with garment manufacturers and retailers."
            />

            {/* WhatsApp Business Number */}
            <InputField
              label="WhatsApp Business Number"
              type="text"
              value={businessNumber}
              onChange={(e) => setBusinessNumber(e.target.value)}
              placeholder="98765 43210"
              prefixIcon={
                <span className="flex items-center gap-1 text-xs font-semibold text-[#5A586E]">
                  <Smartphone className="w-3.5 h-3.5 text-[#9493A8]" />
                  <span>+91</span>
                </span>
              }
              className="!pl-16 font-tabular"
              helperText="Incoming RFQs and sample cutting requests are forwarded to this WhatsApp number."
            />

            {/* Default Sharing Message */}
            <div className="space-y-1.5">
              <TextareaField
                label="Default Sharing Message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="resize-y leading-relaxed font-sans"
                helperText="Live Preview Supported"
              />

              {/* Tag Insertion Hints */}
              <div className="p-3 bg-[#FAF9FD] rounded-lg border border-[#E2E1EC] space-y-1.5">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#100E26]">
                  <Info className="w-3.5 h-3.5 text-[#4E45D5]" />
                  <span>Available dynamic tags (click to insert):</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { tag: '{catalogue_name}', desc: 'Collection title' },
                    { tag: '{product_name}', desc: 'Design title' },
                    { tag: '{price}', desc: 'Wholesale rate' },
                    { tag: '{link}', desc: 'Storefront URL' },
                  ].map((item) => (
                    <button
                      key={item.tag}
                      type="button"
                      onClick={() => handleInsertTag(item.tag)}
                      className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-white border border-[#E2E1EC] hover:border-[#4E45D5] hover:text-[#4E45D5] transition-colors"
                      title={`Insert ${item.desc}`}
                    >
                      {item.tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Save Button (Standard 40px height) */}
            <div className="pt-2">
              <button
                type="submit"
                className="btn-primary w-full sm:w-auto h-10 px-6"
              >
                <Save className="w-4 h-4" />
                <span>Save Settings</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Card: Live WhatsApp Preview */}
        <div className="w-full">
          <WhatsAppPreview
            messageTemplate={message}
            storefrontUrl={storefrontUrl}
            businessNumber={businessNumber}
          />
        </div>
      </div>
    </div>
  );
}

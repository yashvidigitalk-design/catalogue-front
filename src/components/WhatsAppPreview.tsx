'use client';

import React, { useState } from 'react';
import { ArrowLeft, MoreVertical, Phone, Video, CheckCheck, Smile, Send, Mic, ExternalLink, Sparkles } from 'lucide-react';
import { formatWhatsAppMessage } from '@/lib/settingsData';

interface WhatsAppPreviewProps {
  messageTemplate: string;
  storefrontUrl: string;
  businessNumber?: string;
}

export default function WhatsAppPreview({
  messageTemplate,
  storefrontUrl,
  businessNumber = '98765 43210',
}: WhatsAppPreviewProps) {
  const [shareMode, setShareMode] = useState<'catalogue' | 'product'>('catalogue');

  // Dynamically formatted message based on active share mode
  const formattedText = formatWhatsAppMessage(messageTemplate, {
    catalogue_name: 'Summer Silk Collection 2025',
    product_name: 'Handloom Chanderi Pattu Saree',
    price: shareMode === 'catalogue' ? '₹1,450 - ₹2,800' : '₹1,850 / pc',
    link: storefrontUrl,
  });

  return (
    <div className="bg-white border border-[#E2E1EC] rounded-xl p-5 shadow-xs flex flex-col justify-between">
      {/* Header with Segmented Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[#F1F0F7]">
        <div>
          <h3
            className="text-lg font-bold text-[#100E26]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Live WhatsApp Preview
          </h3>
          <p className="text-xs text-[#5A586E] mt-0.5">
            Real-time mockup of buyer chat bubble
          </p>
        </div>

        {/* Segmented Switch: Catalogue Share / Product Share */}
        <div className="inline-flex items-center p-1 bg-[#F7F7FB] border border-[#E2E1EC] rounded-lg shrink-0">
          <button
            type="button"
            onClick={() => setShareMode('catalogue')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              shareMode === 'catalogue'
                ? 'bg-white text-[#100E26] shadow-xs border border-[#E2E1EC]/60'
                : 'text-[#5A586E] hover:text-[#100E26]'
            }`}
          >
            Catalogue Share
          </button>
          <button
            type="button"
            onClick={() => setShareMode('product')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              shareMode === 'product'
                ? 'bg-white text-[#100E26] shadow-xs border border-[#E2E1EC]/60'
                : 'text-[#5A586E] hover:text-[#100E26]'
            }`}
          >
            Product Share
          </button>
        </div>
      </div>

      {/* Phone Mockup Wrapper */}
      <div className="mt-4 max-w-sm mx-auto w-full rounded-2xl overflow-hidden border-2 border-[#D5D4E2] shadow-md bg-[#ECE5DD] flex flex-col">
        {/* WhatsApp App Top Bar */}
        <div className="bg-[#075E54] text-white px-3.5 py-2.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4 cursor-pointer text-white/80 hover:text-white" />
            {/* CSS Textile Emblem Avatar */}
            <div className="w-8 h-8 rounded-full bg-[#128C7E] border border-white/20 flex items-center justify-center font-bold text-xs text-white shadow-inner">
              RV
            </div>
            <div className="leading-tight">
              <div className="text-xs font-bold truncate max-w-[140px]">Rajesh Varma Textiles</div>
              <div className="text-[10px] text-white/80 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                online • Verified Mill
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-white/80">
            <Video className="w-4 h-4 cursor-pointer hover:text-white" />
            <Phone className="w-4 h-4 cursor-pointer hover:text-white" />
            <MoreVertical className="w-4 h-4 cursor-pointer hover:text-white" />
          </div>
        </div>

        {/* WhatsApp Chat Body */}
        <div className="p-3 min-h-[360px] flex flex-col justify-between bg-[#ECE5DD] relative">
          {/* Subtle Doodle-style background SVG */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#100E26_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Date Stamp */}
          <div className="text-center my-1">
            <span className="bg-white/85 text-[#5A586E] text-[10px] font-semibold px-2.5 py-0.5 rounded-md shadow-2xs uppercase tracking-wider">
              Today
            </span>
          </div>

          {/* Outgoing Message Bubble */}
          <div className="max-w-[92%] ml-auto bg-[#E7FFDB] rounded-xl rounded-tr-xs p-2.5 shadow-xs border border-[#CDE5BA]/60 relative z-10 text-xs text-[#100E26] space-y-2">
            {shareMode === 'catalogue' ? (
              /* Catalogue Share Bubble Content */
              <div>
                {/* CSS-Made Catalogue Cover Image */}
                <div className="w-full h-32 rounded-lg overflow-hidden relative border border-[#CDE5BA] mb-2 flex flex-col justify-between p-3 select-none">
                  {/* Background Weave Motif */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#100E26] via-[#2A1E5C] to-[#4E45D5]" />
                  <svg className="absolute inset-0 w-full h-full opacity-25" width="100%" height="100%">
                    <defs>
                      <pattern id="chatCataloguePattern" width="16" height="16" patternUnits="userSpaceOnUse">
                        <path d="M 0 8 L 8 0 L 16 8 L 8 16 Z" fill="none" stroke="#D4AF37" strokeWidth="0.8" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#chatCataloguePattern)" />
                  </svg>

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[9px] font-bold tracking-widest text-[#FDE68A] uppercase bg-[#100E26]/60 px-1.5 py-0.5 rounded border border-[#D4AF37]/30">
                      Wholesale B2B
                    </span>
                    <span className="text-[9px] text-white/80 font-medium">120+ Designs</span>
                  </div>

                  <div className="relative z-10">
                    <div className="text-xs font-extrabold text-white leading-tight">
                      Summer Silk Collection 2025
                    </div>
                    <div className="text-[10px] text-white/80 mt-0.5">
                      Rajesh Varma Textiles • Surat
                    </div>
                  </div>
                </div>

                {/* Catalogue Name */}
                <div className="font-bold text-[#100E26] text-xs leading-snug">
                  Summer Silk Collection 2025
                </div>

                {/* Message Body */}
                <p className="text-[11px] text-[#2C3E50] leading-relaxed mt-1 whitespace-pre-line">
                  {formattedText}
                </p>

                {/* Blue Underlined Link */}
                <div className="pt-1.5 border-t border-[#CDE5BA]/60">
                  <a
                    href={storefrontUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#0D6EFD] underline font-medium text-[11px] break-all inline-flex items-center gap-1 hover:text-[#0A58CA]"
                  >
                    <span>{storefrontUrl}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              </div>
            ) : (
              /* Product Share Bubble Content */
              <div>
                {/* CSS-Made Fabric Product Swatch Card */}
                <div className="w-full h-32 rounded-lg overflow-hidden relative border border-[#CDE5BA] mb-2 flex flex-col justify-between p-3 select-none">
                  {/* Rich Silk Weave Background */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#312E81] via-[#4338CA] to-[#6366F1]" />
                  <svg className="absolute inset-0 w-full h-full opacity-30" width="100%" height="100%">
                    <defs>
                      <pattern id="chatProdPattern" width="18" height="18" patternUnits="userSpaceOnUse">
                        <circle cx="9" cy="9" r="2" fill="#FDE68A" />
                        <path d="M 0 9 Q 4.5 0 9 9 Q 13.5 18 18 9" fill="none" stroke="#FFFFFF" strokeWidth="0.8" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#chatProdPattern)" />
                  </svg>

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[9px] font-bold text-white bg-black/50 px-1.5 py-0.5 rounded">
                      DES #CH-902
                    </span>
                    <span className="text-[9px] font-bold text-[#ECFDF5] bg-[#059669] px-1.5 py-0.5 rounded">
                      In Stock: 680 pcs
                    </span>
                  </div>

                  <div className="relative z-10">
                    <div className="text-xs font-bold text-white leading-tight">
                      Handloom Chanderi Pattu Saree
                    </div>
                    <div className="text-[10px] text-white/90">
                      Surat Jacquard • 120 TPI Zari
                    </div>
                  </div>
                </div>

                {/* Product Name & Specs */}
                <div>
                  <div className="font-bold text-[#100E26] text-xs">
                    Handloom Chanderi Pattu Saree
                  </div>
                  <div className="text-[10px] text-[#5A586E]">
                    Design #CH-902 • Zari Weft
                  </div>
                </div>

                {/* Wholesale Price & MOQ */}
                <div className="p-1.5 bg-[#DCF8C6] border border-[#C2E7A9] rounded flex items-center justify-between font-tabular">
                  <span className="font-bold text-[#100E26] text-xs">
                    Wholesale ₹1,850 / pc
                  </span>
                  <span className="text-[10px] font-semibold text-[#059669]">
                    MOQ: 20 pcs
                  </span>
                </div>

                {/* Message Body */}
                <p className="text-[11px] text-[#2C3E50] leading-relaxed whitespace-pre-line">
                  {formattedText}
                </p>

                {/* Blue Underlined Link */}
                <div className="pt-1.5 border-t border-[#CDE5BA]/60">
                  <a
                    href={storefrontUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#0D6EFD] underline font-medium text-[11px] break-all inline-flex items-center gap-1 hover:text-[#0A58CA]"
                  >
                    <span>{storefrontUrl}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              </div>
            )}

            {/* Bubble Time and Double Blue Ticks */}
            <div className="flex items-center justify-end gap-1 text-[9px] text-[#5A586E] pt-0.5">
              <span>12:30 PM</span>
              <CheckCheck className="w-3.5 h-3.5 text-[#34B7F1]" />
            </div>
          </div>

          {/* Fake Bottom Chat Bar */}
          <div className="mt-3 flex items-center gap-2 pt-2 border-t border-black/5">
            <div className="flex-1 bg-white rounded-full px-3 py-1.5 text-xs text-[#9493A8] flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-1.5">
                <Smile className="w-3.5 h-3.5 text-[#5A586E]" />
                <span className="text-[11px]">Message</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#128C7E] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Mic className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useId } from 'react';
import { TemplateCustomization } from '@/types';
import { SAMPLE_PREVIEW_PRODUCTS } from '@/lib/settingsData';

interface TemplatePreviewProps {
  templateId: 'classic-grid' | 'elegant-lookbook';
  customization?: Partial<TemplateCustomization>;
  mode?: 'card' | 'drawer' | 'mini';
  className?: string;
}

interface SwatchDef {
  bg: string;
  opacity: string;
  width: number;
  height: number;
  elements: React.ReactNode;
  extra?: React.ReactNode;
}

const SWATCH_CONFIGS: Record<string, SwatchDef> = {
  chanderi: {
    bg: 'bg-gradient-to-br from-[#4E45D5]/20 via-[#6860EF]/15 to-[#312E81]/30',
    opacity: 'opacity-35',
    width: 16,
    height: 16,
    elements: (
      <>
        <path d="M 0 8 L 8 0 L 16 8 L 8 16 Z" fill="none" stroke="#4E45D5" strokeWidth="1" />
        <circle cx="8" cy="8" r="1.5" fill="#D97706" />
      </>
    ),
    extra: <div className="relative z-10 w-2 h-2 rounded-full bg-[#4E45D5]/40" />,
  },
  mulmul: {
    bg: 'bg-gradient-to-br from-[#ECFDF5] via-[#D1FAE5] to-[#A7F3D0]/50',
    opacity: 'opacity-40',
    width: 10,
    height: 10,
    elements: (
      <>
        <line x1="0" y1="0" x2="10" y2="10" stroke="#059669" strokeWidth="0.8" />
        <line x1="10" y1="0" x2="0" y2="0" stroke="#059669" strokeWidth="0.8" />
      </>
    ),
  },
  brocade: {
    bg: 'bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A]/60',
    opacity: 'opacity-45',
    width: 20,
    height: 20,
    elements: (
      <>
        <path d="M 0 10 Q 5 0 10 10 Q 15 20 20 10" fill="none" stroke="#D97706" strokeWidth="1.2" />
        <circle cx="10" cy="10" r="2" fill="#B45309" />
      </>
    ),
  },
  slub: {
    bg: 'bg-gradient-to-br from-[#EEF2FF] via-[#E0E7FF] to-[#C7D2FE]/60',
    opacity: 'opacity-35',
    width: 14,
    height: 8,
    elements: (
      <line x1="0" y1="4" x2="14" y2="4" stroke="#4338CA" strokeWidth="1.5" strokeDasharray="6 3" />
    ),
  },
  organza: {
    bg: 'bg-gradient-to-br from-[#FFF1F2] via-[#FFE4E6] to-[#FECDD3]/60',
    opacity: 'opacity-40',
    width: 18,
    height: 18,
    elements: (
      <polygon points="9,1 17,9 9,17 1,9" fill="none" stroke="#E11D48" strokeWidth="1" />
    ),
  },
  tussar: {
    bg: 'bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0]',
    opacity: 'opacity-35',
    width: 12,
    height: 12,
    elements: (
      <>
        <line x1="0" y1="0" x2="12" y2="0" stroke="#64748B" strokeWidth="1.2" strokeDasharray="8 2" />
        <line x1="0" y1="6" x2="12" y2="6" stroke="#64748B" strokeWidth="1.2" strokeDasharray="3 5" />
      </>
    ),
  },
};

const LOOKBOOK_SWATCHES = [
  { name: 'Pure Chanderi', code: '#CH-902', swatch: 'chanderi' },
  { name: 'Organza Floral', code: '#OF-553', swatch: 'organza' },
  { name: 'Tussar Ghicha', code: '#TG-112', swatch: 'tussar' },
  { name: 'Rayon Slub', code: '#RS-108', swatch: 'slub' },
];

export default function TemplatePreview({
  templateId,
  customization,
  mode = 'card',
  className = '',
}: TemplatePreviewProps) {
  const uid = useId().replace(/:/g, '');
  const isDark = templateId === 'elegant-lookbook';
  const title =
    customization?.title ||
    (isDark ? 'Royale Silk & Jacquard Lookbook' : 'Summer Fabric Volume Catalogue');
  const brandColor = customization?.brandColor || (isDark ? '#100E26' : '#4E45D5');
  const showPrices = customization?.showPrices ?? true;
  const showDesignNumber = customization?.showDesignNumber ?? true;
  const showMOQ = customization?.showMOQ ?? !isDark;
  const footerNote =
    customization?.footerNote ||
    (isDark
      ? 'Exclusively curated for bridal fashion houses and boutique retail chains.'
      : 'All rates are ex-mill Surat. 5% GST applicable. Minimum order 1 bale / roll.');

  const isMini = mode === 'mini';
  const isDrawer = mode === 'drawer';

  // Responsive mode typography & spacing helpers
  const containerPadding = isMini ? 'p-3 text-[10px]' : isDrawer ? 'p-6 text-sm' : 'p-4 text-xs';
  const titleFontSize = isMini ? '11px' : isDrawer ? '18px' : '13px';
  const productFontSize = isMini ? '9px' : isDrawer ? '12px' : '10px';

  // SVG Fabric Weave Pattern Renderer
  const renderFabricSwatch = (type: string) => {
    const swatch = SWATCH_CONFIGS[type] || SWATCH_CONFIGS.tussar;
    const patId = `${uid}_${type}`;
    return (
      <div className={`w-full h-full relative overflow-hidden ${swatch.bg} flex items-center justify-center`}>
        <svg className={`absolute inset-0 w-full h-full ${swatch.opacity}`} width="100%" height="100%">
          <defs>
            <pattern id={patId} width={swatch.width} height={swatch.height} patternUnits="userSpaceOnUse">
              {swatch.elements}
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${patId})`} />
        </svg>
        {swatch.extra}
      </div>
    );
  };

  // 1. CLASSIC GRID LAYOUT (Clean White, 2x3 Grid)
  if (!isDark) {
    return (
      <div
        className={`w-full bg-white border border-[#E2E1EC] rounded-xl flex flex-col justify-between overflow-hidden shadow-xs select-none ${containerPadding} ${className}`}
      >
        {/* Header */}
        <div
          className="pb-3 border-b border-[#E2E1EC] flex items-center justify-between"
          style={{ borderBottomColor: `${brandColor}25` }}
        >
          <div>
            <div className="flex items-center gap-2">
              <span
                className="font-bold tracking-tight uppercase"
                style={{
                  color: brandColor,
                  fontSize: isMini ? '10px' : isDrawer ? '15px' : '12px',
                }}
              >
                Rajesh Varma Textiles
              </span>
              <span className="text-[9px] bg-[#F1F0F7] text-[#5A586E] px-1.5 py-0.2 rounded font-semibold uppercase">
                Surat Mill
              </span>
            </div>
            <div
              className="font-extrabold text-[#100E26] mt-0.5 tracking-tight truncate max-w-[280px]"
              style={{ fontSize: titleFontSize }}
            >
              {title}
            </div>
          </div>

          <div className="text-right shrink-0">
            <span
              className="inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white"
              style={{ backgroundColor: brandColor }}
            >
              Volume Issue
            </span>
          </div>
        </div>

        {/* 2x3 Product Grid */}
        <div
          className={`grid grid-cols-2 sm:grid-cols-3 ${
            isMini ? 'gap-1.5 my-2' : isDrawer ? 'gap-4 my-5' : 'gap-2.5 my-3'
          }`}
        >
          {SAMPLE_PREVIEW_PRODUCTS.map((prod) => (
            <div
              key={prod.id}
              className="border border-[#E2E1EC] rounded-lg overflow-hidden bg-[#FAF9FD] flex flex-col hover:border-[#CBC9D9] transition-colors"
            >
              {/* Fabric Swatch Block */}
              <div
                className={`w-full overflow-hidden ${
                  isMini ? 'h-10' : isDrawer ? 'h-28' : 'h-16 sm:h-20'
                }`}
              >
                {renderFabricSwatch(prod.patternType)}
              </div>

              {/* Product Info */}
              <div className={isMini ? 'p-1' : isDrawer ? 'p-2.5' : 'p-1.5'}>
                {showDesignNumber && (
                  <div className="text-[9px] font-semibold text-[#5A586E] truncate">
                    {prod.designNo}
                  </div>
                )}
                <div
                  className="font-bold text-[#100E26] truncate leading-tight mt-0.5"
                  style={{ fontSize: productFontSize }}
                >
                  {prod.name}
                </div>

                <div className="flex items-center justify-between mt-1 pt-0.5 border-t border-[#E2E1EC]/50">
                  {showPrices ? (
                    <span
                      className="font-bold font-tabular text-[#100E26]"
                      style={{ fontSize: productFontSize }}
                    >
                      {prod.price}
                      <span className="text-[8px] font-normal text-[#5A586E]">/{prod.unit}</span>
                    </span>
                  ) : (
                    <span className="text-[8px] text-[#5A586E]">Price on inquiry</span>
                  )}

                  {showMOQ && (
                    <span className="text-[8px] text-[#059669] font-medium bg-[#ECFDF5] px-1 rounded">
                      {prod.moq}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="pt-2 border-t border-[#E2E1EC] text-[9px] text-[#5A586E] flex items-center justify-between">
          <span className="truncate max-w-[80%]">{footerNote}</span>
          <span className="font-semibold text-[#100E26] shrink-0 font-tabular">Page 1 of 6</span>
        </div>
      </div>
    );
  }

  // 2. ELEGANT LOOKBOOK LAYOUT (Dark #100E26, Hero Swatch, Gold Accents)
  const goldGlowId = `${uid}_goldGlow`;
  const lookbookPatternId = `${uid}_lookbookPattern`;

  return (
    <div
      className={`w-full bg-[#100E26] text-white border border-[#2B2848] rounded-xl flex flex-col justify-between overflow-hidden shadow-xs select-none ${containerPadding} ${className}`}
    >
      {/* Top Lookbook Header */}
      <div className="pb-2.5 border-b border-[#2B2848] flex items-center justify-between">
        <div>
          <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-[#D97706]">
            TEXLOOM ATELIER • EXCLUSIVE WEAVES
          </span>
          <div
            className="font-extrabold text-white tracking-tight mt-0.5 truncate max-w-[280px]"
            style={{ fontSize: titleFontSize }}
          >
            {title}
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[9px] px-2 py-0.5 rounded-full border border-[#D97706]/40 text-[#FDE68A] bg-[#D97706]/10 font-bold uppercase tracking-wider">
            Festive Edit
          </span>
        </div>
      </div>

      {/* Large Hero Drape Swatch */}
      <div
        className={`relative my-2.5 rounded-lg overflow-hidden border border-[#3B3860] flex flex-col justify-end p-3 ${
          isMini ? 'h-24 p-2' : isDrawer ? 'h-48 p-4' : 'h-32 p-3'
        }`}
      >
        {/* CSS Multi-layer Fabric Texture Background */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0B091C] via-[#1D1740] to-[#392E6B] opacity-95" />
        <svg className="absolute inset-0 w-full h-full opacity-35" width="100%" height="100%">
          <defs>
            <radialGradient id={goldGlowId} cx="50%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#100E26" stopOpacity="0.0" />
            </radialGradient>
            <pattern id={lookbookPatternId} width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 0 12 Q 6 0 12 12 Q 18 24 24 12" fill="none" stroke="#D4AF37" strokeWidth="0.8" />
              <circle cx="12" cy="12" r="1.5" fill="#F59E0B" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${goldGlowId})`} />
          <rect width="100%" height="100%" fill={`url(#${lookbookPatternId})`} />
        </svg>

        {/* Hero Overlay Text */}
        <div className="relative z-10">
          <div className="inline-block bg-[#0B091C]/80 backdrop-blur-xs px-2 py-0.5 rounded text-[9px] font-semibold text-[#D4AF37] border border-[#D4AF37]/30 mb-1">
            HERO COLLECTION • HANDCRAFTED ZARI
          </div>
          <div
            className="font-bold text-white leading-tight"
            style={{ fontSize: isMini ? '10px' : isDrawer ? '16px' : '12px' }}
          >
            Banarasi Katan Silk & Royal Jacquard
          </div>
          {showPrices && (
            <div className="text-[10px] text-[#FDE68A] font-bold font-tabular mt-0.5">
              Wholesale Lot Rates: ₹2,400 - ₹4,850 / pc
            </div>
          )}
        </div>
      </div>

      {/* Swatch Strip Below Hero */}
      <div className="grid grid-cols-4 gap-2 my-1">
        {LOOKBOOK_SWATCHES.map((item) => (
          <div
            key={item.code}
            className="bg-[#17142F] border border-[#2B2848] rounded p-1 text-center overflow-hidden"
          >
            <div className={`w-full rounded mb-1 overflow-hidden ${isMini ? 'h-5' : 'h-7'}`}>
              {renderFabricSwatch(item.swatch)}
            </div>
            {showDesignNumber && (
              <div className="text-[8px] text-[#A9A7C0] truncate">{item.code}</div>
            )}
            <div className="text-[8px] font-bold text-white truncate">{item.name}</div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-[#2B2848] text-[9px] text-[#A9A7C0] flex items-center justify-between">
        <span className="truncate max-w-[80%] text-[#D97706]/90">{footerNote}</span>
        <span className="font-semibold text-white shrink-0 font-tabular">Folio • 01</span>
      </div>
    </div>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { AVAILABLE_LANGUAGES } from '@/lib/sampleData';
import { Language } from '@/types';

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<Language>(AVAILABLE_LANGUAGES[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (lang: Language) => {
    setSelectedLang(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 px-3 inline-flex items-center gap-2 rounded-lg border border-[#E2E1EC] bg-white text-xs font-semibold text-[#100E26] hover:bg-[#F7F7FB] transition-colors focus:outline-none focus:border-[#4E45D5]"
        aria-label="Select portal language"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Globe className="w-4 h-4 text-[#4E45D5] shrink-0" />
        <span className="hidden sm:inline font-medium text-[#100E26]">
          {selectedLang.name}
        </span>
        <span className="sm:hidden font-medium text-[#100E26] uppercase">
          {selectedLang.code}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#9493A8] transition-transform duration-150 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-1.5 w-44 rounded-xl bg-white p-1.5 shadow-lg border border-[#E2E1EC] focus:outline-none animate-in fade-in-50 zoom-in-95 duration-100">
          <div className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#9493A8]">
            Select Language
          </div>
          <div className="space-y-0.5">
            {AVAILABLE_LANGUAGES.map((lang) => {
              const isSelected = selectedLang.code === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelect(lang)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors text-left ${
                    isSelected
                      ? 'bg-[#EEF2FF] text-[#4E45D5] font-semibold'
                      : 'text-[#100E26] hover:bg-[#F7F7FB]'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{lang.name}</span>
                    <span className="text-[11px] text-[#5A586E]">{lang.nativeName}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#4E45D5] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

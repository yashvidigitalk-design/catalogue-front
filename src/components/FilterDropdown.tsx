'use client';

import { useState, useRef, useEffect, type ReactNode } from 'react';
import { ChevronDown, Check, Filter } from 'lucide-react';
import { FilterOption } from '@/types';

interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  selected: string;
  onSelect: (value: string) => void;
  icon?: ReactNode;
  className?: string;
  placeholder?: string;
}

export default function FilterDropdown({
  label,
  options,
  selected,
  onSelect,
  icon,
  className = '',
  placeholder = 'All',
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === selected);
  const displayLabel = selectedOption?.label || placeholder;
  const isFiltered = Boolean(selected && selected !== 'all');

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`h-10 px-3.5 inline-flex items-center gap-2 border rounded-lg text-sm font-medium transition-all ${
          isFiltered
            ? 'border-[#4E45D5] bg-[#EEF2FF] text-[#4E45D5]'
            : 'border-[#E2E1EC] bg-white text-[#100E26] hover:bg-[#F7F7FB]'
        }`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="text-[#64748B] flex items-center">
          {icon || <Filter className="w-4 h-4" />}
        </span>
        <span className="text-[#5A586E]">{label}:</span>
        <span className="font-semibold truncate max-w-[120px]">{displayLabel}</span>
        <ChevronDown
          className={`w-4 h-4 text-[#9493A8] transition-transform duration-150 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-40 mt-1.5 w-52 origin-top-right rounded-xl bg-white p-1.5 shadow-lg border border-[#E2E1EC] focus:outline-none animate-in fade-in-50 zoom-in-95 duration-100">
          <div className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#9493A8]">
            Filter by {label}
          </div>
          <div className="max-h-60 overflow-y-auto space-y-0.5">
            {options.map((option) => {
              const isSelected = selected === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onSelect(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-sm transition-colors text-left ${
                    isSelected
                      ? 'bg-[#EEF2FF] text-[#4E45D5] font-semibold'
                      : 'text-[#100E26] hover:bg-[#F7F7FB]'
                  }`}
                >
                  <span className="truncate">{option.label}</span>
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

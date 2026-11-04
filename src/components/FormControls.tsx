'use client';

import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  forwardRef,
  useId,
  type ReactNode,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  type ChangeEvent,
  type MouseEvent as ReactMouseEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { ChevronDown, Check, X, AlertCircle } from 'lucide-react';

/* ==========================================================================
   Types & Interfaces
   ========================================================================== */

export interface SelectOption {
  label: string;
  value: string;
  sublabel?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface InputFieldProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
  suffix?: ReactNode;
  containerClassName?: string;
}

export interface SearchableSelectProps {
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  options: (string | SelectOption)[];
  disabled?: boolean;
  className?: string;
  containerClassName?: string;
  id?: string;
  prefixIcon?: ReactNode;
  allowClear?: boolean;
}

export interface TextareaFieldProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

/* ==========================================================================
   Internal Shared Field Message (Error / Helper Text)
   ========================================================================== */

function FieldMessage({ error, helperText }: { error?: string; helperText?: string }) {
  if (error) {
    return (
      <p className="text-xs text-[#E11D48] mt-1 flex items-center gap-1">
        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
        <span>{error}</span>
      </p>
    );
  }
  if (helperText) {
    return <p className="text-[11px] text-[#5A586E] mt-1">{helperText}</p>;
  }
  return null;
}

/* ==========================================================================
   1. InputField Component (Common Input)
   ========================================================================== */

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      required,
      error,
      helperText,
      prefixIcon,
      suffixIcon,
      suffix,
      className = '',
      containerClassName = '',
      id,
      disabled,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const hasCustomWidth = containerClassName.includes('w-');

    return (
      <div className={`${hasCustomWidth ? '' : 'w-full '} ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-[#100E26] mb-1.5"
          >
            {label} {required && <span className="text-[#E11D48]">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {prefixIcon && (
            <div className="absolute left-3 pointer-events-none flex items-center justify-center text-[#9493A8]">
              {prefixIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            spellCheck={rest.spellCheck ?? false}
            autoCorrect={rest.autoCorrect ?? 'off'}
            className={`input-base ${
              prefixIcon ? (className.includes('pl-') ? '' : '!pl-[34px]') : ''
            } ${
              suffixIcon || suffix ? (className.includes('pr-') ? '' : '!pr-9') : ''
            } ${
              error
                ? 'border-[#E11D48] focus:border-[#E11D48] focus:ring-[#E11D48]/15'
                : ''
            } ${
              disabled
                ? 'bg-[#F7F7FB] text-[#9493A8] cursor-not-allowed border-[#E2E1EC]'
                : ''
            } ${className}`}
            {...rest}
          />

          {(suffixIcon || suffix) && (
            <div className="absolute right-3 flex items-center justify-center text-[#9493A8]">
              {suffixIcon || suffix}
            </div>
          )}
        </div>

        <FieldMessage error={error} helperText={helperText} />
      </div>
    );
  }
);
InputField.displayName = 'InputField';

/* ==========================================================================
   2. SearchableSelect Component (Direct Typable Combobox Dropdown)
   ========================================================================== */

export function SearchableSelect({
  label,
  required,
  error,
  helperText,
  placeholder = 'Select an option',
  value,
  onChange,
  options,
  disabled = false,
  className = '',
  containerClassName = '',
  id,
  prefixIcon,
  allowClear = false,
}: SearchableSelectProps) {
  const generatedId = useId();
  const selectId = id || generatedId;

  const [isOpen, setIsOpen] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Normalize options to SelectOption[]
  const normalizedOptions: SelectOption[] = useMemo(
    () =>
      options.map((opt) =>
        typeof opt === 'string' ? { label: opt, value: opt } : opt
      ),
    [options]
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Close dropdown on click outside (only active when dropdown is open)
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        if (isTyping && typedText.trim()) {
          const query = typedText.toLowerCase().trim();
          const exactMatch = normalizedOptions.find(
            (opt) =>
              opt.label.toLowerCase() === query ||
              opt.value.toLowerCase() === query
          );
          if (exactMatch) {
            onChange(exactMatch.value);
          }
        }
        setIsOpen(false);
        setIsTyping(false);
        setTypedText('');
        setHighlightedIndex(-1);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, isTyping, typedText, normalizedOptions, onChange]);

  // Filter options based on typed input
  const filteredOptions = useMemo(() => {
    if (!isTyping || !typedText.trim()) {
      return normalizedOptions;
    }
    const q = typedText.toLowerCase().trim();
    return normalizedOptions.filter((opt) => {
      const matchLabel = opt.label.toLowerCase().includes(q);
      const matchValue = opt.value.toLowerCase().includes(q);
      const matchSublabel = opt.sublabel?.toLowerCase().includes(q);
      return matchLabel || matchValue || Boolean(matchSublabel);
    });
  }, [normalizedOptions, isTyping, typedText]);

  // Reset highlighted index if it goes out of bounds
  useEffect(() => {
    if (highlightedIndex >= filteredOptions.length) {
      setHighlightedIndex(filteredOptions.length > 0 ? 0 : -1);
    }
  }, [filteredOptions, highlightedIndex]);

  const handleSelect = (optVal: string) => {
    onChange(optVal);
    setIsOpen(false);
    setIsTyping(false);
    setTypedText('');
    setHighlightedIndex(-1);
  };

  const handleClear = (e: ReactMouseEvent) => {
    e.stopPropagation();
    onChange('');
    setIsTyping(false);
    setTypedText('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setIsTyping(true);
    setTypedText(val);
    setIsOpen(true);
    setHighlightedIndex(0);
  };

  const openAndReset = () => {
    if (!disabled && !isOpen) {
      setIsOpen(true);
      setIsTyping(false);
      setTypedText('');
      setHighlightedIndex(-1);
    }
  };

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setIsTyping(false);
        setHighlightedIndex(0);
      } else {
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (isOpen) {
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
      }
    } else if (e.key === 'Enter') {
      if (isOpen) {
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex].value);
        } else if (filteredOptions.length > 0) {
          handleSelect(filteredOptions[0].value);
        }
      }
    } else if (e.key === 'Escape') {
      if (isOpen) {
        e.preventDefault();
        setIsOpen(false);
        setIsTyping(false);
        setTypedText('');
        setHighlightedIndex(-1);
      }
    } else if (e.key === 'Tab') {
      if (isOpen) {
        if (
          isTyping &&
          highlightedIndex >= 0 &&
          filteredOptions[highlightedIndex]
        ) {
          handleSelect(filteredOptions[highlightedIndex].value);
        } else {
          setIsOpen(false);
          setIsTyping(false);
          setTypedText('');
        }
      }
    }
  };

  // What is displayed in the input
  const inputValue = isTyping
    ? typedText
    : (selectedOption?.label ?? '');

  return (
    <div
      className={`w-full relative ${containerClassName}`}
      ref={containerRef}
    >
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-semibold uppercase tracking-wider text-[#100E26] mb-1.5"
        >
          {label} {required && <span className="text-[#E11D48]">*</span>}
        </label>
      )}

      {/* Direct Typable Combobox Input Field */}
      <div className="relative flex items-center">
        {prefixIcon && (
          <div className="absolute left-3 pointer-events-none flex items-center justify-center text-[#9493A8]">
            {prefixIcon}
          </div>
        )}

        <input
          ref={inputRef}
          id={selectId}
          type="text"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          disabled={disabled}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={openAndReset}
          onClick={openAndReset}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`input-base cursor-text ${
            prefixIcon ? (className.includes('pl-') ? '' : '!pl-[34px]') : ''
          } ${
            (allowClear || isTyping) && (value || typedText)
              ? '!pr-14'
              : '!pr-9'
          } ${
            error
              ? 'border-[#E11D48] focus:border-[#E11D48] focus:ring-[#E11D48]/15'
              : isOpen
              ? 'border-[#4E45D5] ring-2 ring-[#4E45D5]/15'
              : ''
          } ${
            disabled
              ? 'bg-[#F7F7FB] text-[#9493A8] cursor-not-allowed border-[#E2E1EC]'
              : 'bg-white'
          } ${className}`}
        />

        {/* Right Action Icons (Clear + Dropdown Toggle) */}
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {(allowClear || isTyping) && (value || typedText) && !disabled && (
            <button
              type="button"
              tabIndex={-1}
              onClick={handleClear}
              className="p-1 rounded-md text-[#9493A8] hover:text-[#E11D48] hover:bg-[#FFF1F2] transition-colors"
              title="Clear selection"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            tabIndex={-1}
            disabled={disabled}
            onClick={() => {
              if (isOpen) {
                setIsOpen(false);
                setIsTyping(false);
              } else {
                inputRef.current?.focus();
              }
            }}
            className="p-1 rounded-md text-[#9493A8] hover:text-[#100E26] transition-colors focus:outline-none"
            aria-label="Toggle dropdown"
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-150 ${
                isOpen ? 'rotate-180 text-[#4E45D5]' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Floating Options Dropdown (Direct result list without separate search bar) */}
      {isOpen && (
        <div className="absolute left-0 right-0 z-[60] mt-1.5 rounded-xl bg-white p-1.5 shadow-xl border border-[#E2E1EC] animate-in fade-in-50 zoom-in-95 duration-100">
          <div className="max-h-56 overflow-y-auto space-y-0.5 pr-0.5">
            {filteredOptions.length === 0 ? (
              <div className="py-4 text-center text-xs text-[#9493A8]">
                No options found matching &quot;{typedText}&quot;
              </div>
            ) : (
              filteredOptions.map((opt, idx) => {
                const isSelected = opt.value === value;
                const isHighlighted = idx === highlightedIndex;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={opt.disabled}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelect(opt.value);
                    }}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs transition-colors text-left ${
                      opt.disabled
                        ? 'opacity-40 cursor-not-allowed'
                        : isSelected
                        ? 'bg-[#EEF2FF] text-[#4E45D5] font-semibold'
                        : isHighlighted
                        ? 'bg-[#F7F7FB] text-[#100E26]'
                        : 'text-[#100E26] hover:bg-[#F7F7FB]'
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      {opt.icon && (
                        <span className="shrink-0">{opt.icon}</span>
                      )}
                      <div className="truncate">
                        <span className="block truncate">{opt.label}</span>
                        {opt.sublabel && (
                          <span className="block text-[10px] text-[#5A586E] truncate">
                            {opt.sublabel}
                          </span>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-[#4E45D5] shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      <FieldMessage error={error} helperText={helperText} />
    </div>
  );
}

/* ==========================================================================
   3. TextareaField Component (Common Textarea)
   ========================================================================== */

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  (
    {
      label,
      required,
      error,
      helperText,
      maxLength,
      className = '',
      containerClassName = '',
      id,
      disabled,
      value,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const textareaId = id || generatedId;

    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-semibold uppercase tracking-wider text-[#100E26] mb-1.5"
          >
            {label} {required && <span className="text-[#E11D48]">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          value={value}
          maxLength={maxLength}
          disabled={disabled}
          className={`w-full p-3 text-sm bg-white border border-[#E2E1EC] rounded-lg text-[#100E26] placeholder-[#9493A8] focus:outline-none focus:border-[#4E45D5] focus:ring-2 focus:ring-[#4E45D5]/15 transition-all resize-none ${
            error
              ? 'border-[#E11D48] focus:border-[#E11D48] focus:ring-[#E11D48]/15'
              : ''
          } ${
            disabled
              ? 'bg-[#F7F7FB] text-[#9493A8] cursor-not-allowed border-[#E2E1EC]'
              : ''
          } ${className}`}
          {...rest}
        />

        <FieldMessage error={error} helperText={helperText} />
      </div>
    );
  }
);
TextareaField.displayName = 'TextareaField';
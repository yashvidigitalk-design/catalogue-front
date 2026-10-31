'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, X, Plus } from 'lucide-react';

interface ImageUploadProps {
  initialImages?: string[];
  maxImages?: number;
  label?: string;
  helperText?: string;
  onChange?: (images: string[]) => void;
  className?: string;
}

export default function ImageUpload({
  initialImages = [],
  maxImages = 6,
  label = 'Fabric & Swatch Images',
  helperText = 'Upload high-resolution fabric textures, selvage edges, and folded bale shots (JPEG, PNG).',
  onChange,
  className = '',
}: ImageUploadProps) {
  const [images, setImages] = useState<string[]>(initialImages);
  const [primaryIndex, setPrimaryIndex] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateImages = (newImages: string[]) => {
    setImages(newImages);
    if (onChange) onChange(newImages);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) return;

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    const newImageUrls = filesToUpload.map((file) => URL.createObjectURL(file));
    const combined = [...images, ...newImageUrls];
    updateImages(combined);
  };

  const handleRemove = (indexToRemove: number) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    updateImages(updated);
    if (primaryIndex >= updated.length) {
      setPrimaryIndex(Math.max(0, updated.length - 1));
    }
  };

  const handleSetPrimary = (index: number) => {
    setPrimaryIndex(index);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#100E26]">
            {label}
          </label>
          {helperText && (
            <p className="text-xs text-[#5A586E] mt-0.5">{helperText}</p>
          )}
        </div>
        <span className="text-xs font-semibold text-[#5A586E] font-tabular">
          {images.length} / {maxImages} Images
        </span>
      </div>

      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-[#4E45D5] bg-[#EEF2FF]'
            : 'border-[#E2E1EC] hover:border-[#4E45D5] hover:bg-[#F7F7FB]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-10 h-10 rounded-full bg-[#EEF2FF] text-[#4E45D5] flex items-center justify-center">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm font-semibold text-[#4E45D5]">Click to upload</span>{' '}
            <span className="text-sm text-[#5A586E]">or drag and drop swatch files</span>
          </div>
          <p className="text-xs text-[#9493A8]">PNG, JPG, WebP up to 10MB each</p>
        </div>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
          {images.map((imgUrl, idx) => {
            const isPrimary = idx === primaryIndex;
            return (
              <div
                key={`${imgUrl}-${idx}`}
                className={`relative group rounded-xl overflow-hidden border-2 aspect-square bg-[#F7F7FB] transition-all shadow-sm ${
                  isPrimary ? 'border-[#4E45D5] ring-2 ring-[#4E45D5]/20' : 'border-[#E2E1EC]'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgUrl}
                  alt={`Fabric preview ${idx + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Primary Tag */}
                {isPrimary ? (
                  <span className="absolute top-2 left-2 bg-[#4E45D5] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                    Cover
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetPrimary(idx);
                    }}
                    className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 bg-black/60 hover:bg-[#4E45D5] text-white text-[10px] font-medium px-1.5 py-0.5 rounded transition-all shadow"
                    title="Set as primary fabric swatch"
                  >
                    Set Cover
                  </button>
                )}

                {/* Action buttons overlay */}
                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(idx);
                    }}
                    className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 shadow transition-colors"
                    title="Remove image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {images.length < maxImages && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#E2E1EC] hover:border-[#4E45D5] hover:bg-[#EEF2FF]/40 rounded-xl aspect-square flex flex-col items-center justify-center gap-1 text-[#5A586E] transition-all"
            >
              <Plus className="w-5 h-5 text-[#4E45D5]" />
              <span className="text-xs font-medium">Add More</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

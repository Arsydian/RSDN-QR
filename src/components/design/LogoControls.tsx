/**
 * @file LogoControls.tsx
 * @description Logo management supporting custom file uploads, curated built-in SVG icons,
 * safe scaling constraints to preserve scannability, padding margins, and background clearance.
 */

import React, { useId, useRef } from 'react';
import { Upload, Trash2, Sparkles } from 'lucide-react';
import { QrDesignConfig } from '../../types/qr';
import { BUILT_IN_ICONS } from '../../utils/builtInIcons';

interface LogoControlsProps {
  design: QrDesignConfig;
  onChange: (design: QrDesignConfig) => void;
}

export const LogoControls: React.FC<LogoControlsProps> = ({
  design,
  onChange,
}) => {
  const id = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Process user uploaded image file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onChange({
        ...design,
        // When adding a logo, automatically recommend/set High error correction if currently Low
        errorCorrectionLevel:
          design.errorCorrectionLevel === 'L' ? 'H' : design.errorCorrectionLevel,
        imageOptions: {
          ...design.imageOptions,
          src: dataUrl,
          name: file.name,
        },
      });
    };
    reader.readAsDataURL(file);
  };

  // Select built-in icon
  const handleSelectPreset = (iconSrc: string, name: string) => {
    onChange({
      ...design,
      errorCorrectionLevel:
        design.errorCorrectionLevel === 'L' ? 'H' : design.errorCorrectionLevel,
      imageOptions: {
        ...design.imageOptions,
        src: iconSrc,
        name,
      },
    });
  };

  // Remove active logo
  const handleRemoveLogo = () => {
    onChange({
      ...design,
      imageOptions: {
        ...design.imageOptions,
        src: '',
        name: undefined,
      },
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Upload or Active Logo Banner */}
      <div>
        <p className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-2">
          Custom Logo or Icon
        </p>

        {design.imageOptions.src ? (
          <div className="p-3.5 rounded-lg border border-ars-grey-200 bg-ars-white flex items-center justify-between shadow-ars-xs">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-ars-grey-50 border border-ars-grey-200 flex items-center justify-center p-1.5 overflow-hidden">
                <img
                  src={design.imageOptions.src}
                  alt="Active Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="font-display font-bold text-xs text-ars-ink">
                  {design.imageOptions.name || 'Custom Overlay Graphic'}
                </div>
                <div className="text-[11px] text-ars-grey-600">
                  Scale: {Math.round(design.imageOptions.size * 100)}% · Margin: {design.imageOptions.margin}px
                </div>
              </div>
            </div>

            {/* Icon-only button: grey-600 keeps the icon above 3:1 non-text contrast */}
            <button
              type="button"
              onClick={handleRemoveLogo}
              aria-label="Remove logo"
              className="p-2 text-ars-grey-600 hover:text-ars-red rounded-lg hover:bg-ars-red-50 transition-colors"
              title="Remove Logo"
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <>
            {/* Hidden native input; the button below is the keyboard-reachable trigger */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/svg+xml, image/webp"
              onChange={handleFileUpload}
              className="hidden"
              aria-hidden="true"
              tabIndex={-1}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-describedby={`${id}-upload-hint`}
              className="block w-full border-2 border-dashed border-ars-grey-200 hover:border-ars-red bg-ars-white hover:bg-ars-grey-50 rounded-lg p-5 text-center cursor-pointer transition-all group"
            >
              <span
                className="w-10 h-10 rounded-full bg-ars-grey-50 group-hover:bg-ars-red-50 text-ars-grey-600 group-hover:text-ars-red flex items-center justify-center mx-auto mb-2 transition-colors"
                aria-hidden="true"
              >
                <Upload className="w-5 h-5" />
              </span>
              <span className="block font-display font-semibold text-xs text-ars-ink">
                Click to upload your logo
              </span>
              <span id={`${id}-upload-hint`} className="block text-[11px] text-ars-grey-600 mt-0.5">
                PNG, SVG, JPG or WebP (Transparent PNG / SVG recommended)
              </span>
            </button>
          </>
        )}
      </div>

      {/* Built-in Preset Icons Grid */}
      <div>
        <p
          id={`${id}-built-in`}
          className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-2 flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-ars-red" aria-hidden="true" />
          Or Choose from Built-in Icons
        </p>
        <div
          role="group"
          aria-labelledby={`${id}-built-in`}
          className="grid grid-cols-4 sm:grid-cols-7 gap-2"
        >
          {BUILT_IN_ICONS.map((icon) => {
            const isSelected = design.imageOptions.src === icon.src;
            return (
              <button
                key={icon.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => handleSelectPreset(icon.src, icon.name)}
                className={`p-2 rounded-lg border flex flex-col items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-ars-black text-white border-ars-black shadow-ars-xs'
                    : 'bg-ars-white text-ars-ink border-ars-grey-200 hover:border-ars-red hover:bg-ars-grey-50'
                }`}
                title={icon.name}
              >
                <div className="w-7 h-7 mb-1 flex items-center justify-center">
                  {/* Empty alt: the visible name below already labels the button */}
                  <img src={icon.src} alt="" className="w-full h-full object-contain" />
                </div>
                <span className="text-[9px] font-display font-medium truncate w-full text-center">
                  {icon.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Logo Scaling & Fine-tuning (Visible when a logo is active) */}
      {design.imageOptions.src && (
        <div className="p-3.5 rounded-lg border border-ars-grey-200 bg-ars-white space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label
                htmlFor={`${id}-size`}
                className="font-display font-bold uppercase tracking-wider text-ars-ink"
              >
                Logo Scale / Area
              </label>
              <span className="font-mono text-ars-grey-600">
                {Math.round(design.imageOptions.size * 100)}% (Max 35% safe limit)
              </span>
            </div>
            <input
              id={`${id}-size`}
              type="range"
              min="0.10"
              max="0.35"
              step="0.01"
              value={design.imageOptions.size}
              aria-valuetext={`${Math.round(design.imageOptions.size * 100)}%`}
              onChange={(e) =>
                onChange({
                  ...design,
                  imageOptions: {
                    ...design.imageOptions,
                    size: Number(e.target.value),
                  },
                })
              }
              className="w-full"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label
                htmlFor={`${id}-margin`}
                className="font-display font-bold uppercase tracking-wider text-ars-ink"
              >
                Logo Outer Padding Margin
              </label>
              <span className="font-mono text-ars-grey-600">
                {design.imageOptions.margin}px
              </span>
            </div>
            <input
              id={`${id}-margin`}
              type="range"
              min="0"
              max="20"
              step="1"
              value={design.imageOptions.margin}
              aria-valuetext={`${design.imageOptions.margin} pixels`}
              onChange={(e) =>
                onChange({
                  ...design,
                  imageOptions: {
                    ...design.imageOptions,
                    margin: Number(e.target.value),
                  },
                })
              }
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-2 pt-1 border-t border-ars-grey-100">
            <input
              type="checkbox"
              id={`${id}-hide-dots-bg`}
              checked={design.imageOptions.hideBackgroundDots}
              onChange={(e) =>
                onChange({
                  ...design,
                  imageOptions: {
                    ...design.imageOptions,
                    hideBackgroundDots: e.target.checked,
                  },
                })
              }
              className="rounded-sm border-ars-grey-300 text-ars-red focus:ring-ars-red w-4 h-4"
            />
            <label htmlFor={`${id}-hide-dots-bg`} className="text-xs font-sans text-ars-ink cursor-pointer">
              Clear QR dots beneath logo for clean visibility
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

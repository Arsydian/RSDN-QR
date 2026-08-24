/**
 * @file LogoControls.tsx
 * @description Logo management supporting custom file uploads, curated built-in SVG icons,
 * safe scaling constraints to preserve scannability, padding margins, and background clearance.
 */

import React, { useRef } from 'react';
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
  const handleSelectPreset = (svgDataUri: string, name: string) => {
    onChange({
      ...design,
      errorCorrectionLevel:
        design.errorCorrectionLevel === 'L' ? 'H' : design.errorCorrectionLevel,
      imageOptions: {
        ...design.imageOptions,
        src: svgDataUri,
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
        <label className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-2">
          Custom Logo or Icon
        </label>

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

            <button
              type="button"
              onClick={handleRemoveLogo}
              className="p-2 text-ars-grey-400 hover:text-ars-red rounded-lg hover:bg-ars-red-50 transition-colors"
              title="Remove Logo"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-ars-grey-200 hover:border-ars-red bg-ars-white hover:bg-ars-grey-50 rounded-lg p-5 text-center cursor-pointer transition-all group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/svg+xml, image/webp"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="w-10 h-10 rounded-full bg-ars-grey-50 group-hover:bg-ars-red-50 text-ars-grey-600 group-hover:text-ars-red flex items-center justify-center mx-auto mb-2 transition-colors">
              <Upload className="w-5 h-5" />
            </div>
            <p className="font-display font-semibold text-xs text-ars-ink">
              Click to upload your logo
            </p>
            <p className="text-[11px] text-ars-grey-400 mt-0.5">
              PNG, SVG, JPG or WebP (Transparent PNG / SVG recommended)
            </p>
          </div>
        )}
      </div>

      {/* Built-in Preset Icons Grid */}
      <div>
        <label className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-ars-red" />
          Or Choose from Built-in Icons
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {BUILT_IN_ICONS.map((icon) => {
            const isSelected = design.imageOptions.src === icon.svgDataUri;
            return (
              <button
                key={icon.id}
                type="button"
                onClick={() => handleSelectPreset(icon.svgDataUri, icon.name)}
                className={`p-2 rounded-lg border flex flex-col items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-ars-black text-white border-ars-black shadow-ars-xs'
                    : 'bg-ars-white text-ars-ink border-ars-grey-200 hover:border-ars-red hover:bg-ars-grey-50'
                }`}
                title={icon.name}
              >
                <div className="w-7 h-7 mb-1 flex items-center justify-center">
                  <img src={icon.svgDataUri} alt={icon.name} className="w-full h-full object-contain" />
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
              <span className="font-display font-bold uppercase tracking-wider text-ars-ink">
                Logo Scale / Area
              </span>
              <span className="font-mono text-ars-grey-600">
                {Math.round(design.imageOptions.size * 100)}% (Max 35% safe limit)
              </span>
            </div>
            <input
              type="range"
              min="0.10"
              max="0.35"
              step="0.01"
              value={design.imageOptions.size}
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
              <span className="font-display font-bold uppercase tracking-wider text-ars-ink">
                Logo Outer Padding Margin
              </span>
              <span className="font-mono text-ars-grey-600">
                {design.imageOptions.margin}px
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={design.imageOptions.margin}
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
              id="hide-dots-bg"
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
              className="rounded border-ars-grey-300 text-ars-red focus:ring-ars-red w-4 h-4"
            />
            <label htmlFor="hide-dots-bg" className="text-xs font-sans text-ars-ink cursor-pointer">
              Clear QR dots beneath logo for clean visibility
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

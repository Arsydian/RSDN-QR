/**
 * @file ExportModal.tsx
 * @description Modal dialog for high-resolution vector and raster export (PNG, JPEG, SVG up to 4K).
 */

import React, { useState } from 'react';
import { X, Download, Sparkles } from 'lucide-react';
import { QrDesignConfig, ExportFormat, ExportResolution } from '../../types/qr';
import { downloadQrCode } from '../../utils/qrRenderer';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  payloadString: string;
  design: QrDesignConfig;
}

const RESOLUTIONS: {
  value: ExportResolution;
  label: string;
  desc: string;
  recommendedFor: string;
}[] = [
  { value: 512, label: '512 × 512 px', desc: 'Standard Web & Social', recommendedFor: 'Email signatures & Websites' },
  { value: 1024, label: '1024 × 1024 px', desc: 'High Definition (HD)', recommendedFor: 'Digital displays & menus' },
  { value: 2048, label: '2048 × 2048 px', desc: '2K Print Ready', recommendedFor: 'Flyers, table tents & business cards' },
  { value: 4096, label: '4096 × 4096 px', desc: '4K Ultra Print (300+ DPI)', recommendedFor: 'Posters, billboards & large banners' },
];

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  payloadString,
  design,
}) => {
  const [format, setFormat] = useState<ExportFormat>('png');
  const [resolution, setResolution] = useState<ExportResolution>(2048);
  const [filename, setFilename] = useState('rsdn-custom-qr');
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    try {
      setIsExporting(true);
      await downloadQrCode(
        payloadString,
        design,
        filename.trim() || 'rsdn-custom-qr',
        format,
        resolution
      );
      setTimeout(() => {
        setIsExporting(false);
        onClose();
      }, 400);
    } catch (err) {
      console.error('Export failed:', err);
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ars-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-ars-white rounded-xl border border-ars-grey-200 shadow-ars-lg w-full max-w-lg overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-ars-grey-200 flex items-center justify-between bg-ars-grey-50">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-ars-red" />
            <h3 className="font-display font-bold text-sm text-ars-black uppercase tracking-wider">
              Export High-Resolution QR Code
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-ars-grey-400 hover:text-ars-black rounded-lg hover:bg-ars-grey-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Format Selection */}
          <div>
            <label className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-2">
              File Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'png', label: 'PNG Image', desc: 'Lossless raster with alpha transparency' },
                  { id: 'svg', label: 'SVG Vector', desc: 'Infinitely scalable vector for print & Illustrator' },
                  { id: 'jpeg', label: 'JPEG Image', desc: 'Solid background raster for standard docs' },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFormat(f.id)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    format === f.id
                      ? 'bg-ars-black text-white border-ars-black shadow-ars-xs'
                      : 'bg-ars-white text-ars-ink border-ars-grey-200 hover:border-ars-red'
                  }`}
                >
                  <div className="font-display font-bold text-xs">{f.label}</div>
                  <div className={`text-[10px] mt-0.5 leading-tight ${format === f.id ? 'text-ars-grey-400' : 'text-ars-grey-600'}`}>
                    {f.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Resolution Selection (Only applies to raster PNG/JPEG) */}
          {format !== 'svg' ? (
            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-2 flex items-center justify-between">
                <span>Output Resolution</span>
                <span className="text-[11px] font-mono text-ars-grey-600">Print Quality</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {RESOLUTIONS.map((res) => (
                  <button
                    key={res.value}
                    type="button"
                    onClick={() => setResolution(res.value)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      resolution === res.value
                        ? 'bg-ars-black text-white border-ars-black shadow-ars-xs'
                        : 'bg-ars-white text-ars-ink border-ars-grey-200 hover:border-ars-red'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-xs font-mono">{res.label}</span>
                      {res.value === 2048 && (
                        <span className="ars-badge bg-ars-red text-white text-[9px] py-0">Recommended</span>
                      )}
                    </div>
                    <div className={`text-[10px] mt-0.5 ${resolution === res.value ? 'text-ars-grey-400' : 'text-ars-grey-600'}`}>
                      {res.recommendedFor}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-ars-grey-50 border border-ars-grey-200 rounded-lg p-3 text-xs text-ars-grey-600 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-ars-red shrink-0" />
              <span>
                SVG is a resolution-independent vector format. It scales to any size without losing crispness.
              </span>
            </div>
          )}

          {/* Filename */}
          <div>
            <label className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5">
              File Name
            </label>
            <div className="flex items-center rounded-lg border border-ars-grey-200 overflow-hidden bg-ars-white">
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="my-custom-qr-code"
                className="w-full px-3 py-2 text-sm text-ars-ink border-none focus:ring-0 font-sans"
              />
              <span className="px-3 text-xs font-mono font-bold text-ars-grey-600 bg-ars-grey-100 border-l border-ars-grey-200">
                .{format}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-ars-grey-200 bg-ars-grey-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-display font-semibold text-ars-grey-600 hover:text-ars-black hover:bg-ars-grey-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={isExporting}
            className="px-5 py-2 rounded-lg text-xs font-display font-bold text-white bg-ars-red hover:bg-ars-red-600 transition-all flex items-center gap-2 shadow-ars-sm disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            {isExporting ? 'Generating...' : `Download .${format.toUpperCase()}`}
          </button>
        </div>
      </div>
    </div>
  );
};

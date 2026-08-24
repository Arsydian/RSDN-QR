/**
 * @file QrPreviewPanel.tsx
 * @description Real-time live QR Code canvas preview panel with sticky positioning,
 * copy-to-clipboard, quick download, and high-res export launcher.
 * Synchronously renders clean instances on all style and payload changes.
 */

import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { Download, Copy, Check, Sparkles } from 'lucide-react';
import { QrDesignConfig, ScannabilityResult } from '../../types/qr';
import { buildQrOptions, downloadQrCode, copyQrToClipboard } from '../../utils/qrRenderer';
import { ScannabilityMeter } from './ScannabilityMeter';
import { ExportModal } from './ExportModal';

interface QrPreviewPanelProps {
  payloadString: string;
  design: QrDesignConfig;
  scannabilityReport: ScannabilityResult;
}

export const QrPreviewPanel: React.FC<QrPreviewPanelProps> = ({
  payloadString,
  design,
  scannabilityReport,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Synchronously render a fresh QR Code Canvas on ANY payload or design change
  useEffect(() => {
    if (!containerRef.current) return;

    // Build completely clean options object (excluding inactive gradients or logos)
    const options = buildQrOptions(payloadString, design, 300);
    const qrCode = new QRCodeStyling(options);

    // Wipe previous canvas and append the new canvas
    containerRef.current.innerHTML = '';
    qrCode.append(containerRef.current);
  }, [payloadString, design]);

  // Handle Copy to Clipboard
  const handleCopy = async () => {
    const success = await copyQrToClipboard(payloadString, design);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Quick 1-click Download (PNG 1024px)
  const handleQuickDownload = async () => {
    await downloadQrCode(payloadString, design, 'rsdn-qr-code', 'png', 1024);
  };

  return (
    <div className="space-y-4">
      {/* Live QR Preview Card */}
      <div className="ars-card p-5 space-y-4 relative overflow-hidden">
        
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-ars-grey-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-ars-red animate-pulse" />
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-ars-ink">
              Live Interactive Preview
            </h3>
          </div>
          <span className="ars-badge bg-ars-grey-50 text-ars-grey-600 border border-ars-grey-200">
            EC: {design.errorCorrectionLevel}
          </span>
        </div>

        {/* Canvas Display Container */}
        <div className="relative flex items-center justify-center p-6 bg-ars-grey-50 rounded-xl border border-ars-grey-200 min-h-[340px]">
          {/* Subtle checkerboard background to visualize transparent exports */}
          {design.backgroundOptions.isTransparent && (
            <div
              className="absolute inset-4 rounded-lg opacity-30 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(#C3C2C7 1px, transparent 1px)`,
                backgroundSize: '12px 12px',
              }}
            />
          )}

          {/* Render target */}
          <div
            ref={containerRef}
            className="flex items-center justify-center relative z-10 drop-shadow-sm transition-all duration-200"
          />
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border border-ars-grey-200 bg-ars-white hover:bg-ars-grey-50 text-ars-ink text-xs font-display font-semibold transition-all shadow-ars-xs"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-ars-success" />
                <span>Copied Image!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-ars-grey-600" />
                <span>Copy to Clipboard</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleQuickDownload}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border border-ars-grey-200 bg-ars-white hover:bg-ars-grey-50 text-ars-ink text-xs font-display font-semibold transition-all shadow-ars-xs"
          >
            <Download className="w-4 h-4 text-ars-grey-600" />
            <span>Quick PNG (1024px)</span>
          </button>
        </div>

        {/* Primary High-Resolution Export Button */}
        <button
          type="button"
          onClick={() => setIsExportModalOpen(true)}
          className="w-full py-3 px-4 rounded-lg bg-ars-black text-white hover:bg-ars-ink text-xs font-display font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-ars-sm border border-ars-black hover:border-ars-red group"
        >
          <Sparkles className="w-4 h-4 text-ars-red group-hover:rotate-12 transition-transform" />
          <span>High-Resolution &amp; Vector Export (SVG / 4K)</span>
        </button>
      </div>

      {/* Scannability Health Meter */}
      <ScannabilityMeter report={scannabilityReport} />

      {/* High-Res Export Dialog */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        payloadString={payloadString}
        design={design}
      />
    </div>
  );
};

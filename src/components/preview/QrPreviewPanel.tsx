/**
 * @file QrPreviewPanel.tsx
 * @description Real-time live QR Code canvas preview panel with sticky positioning,
 * copy-to-clipboard, quick download, and high-res export launcher.
 * Synchronously renders clean instances on all style and payload changes, shows a
 * placeholder for empty or oversized payloads, and keeps a floating mini preview in view
 * on small screens while the user edits the form.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Download, Copy, Check, Sparkles, QrCode, AlertTriangle } from 'lucide-react';
import { QrDesignConfig, ScannabilityResult } from '../../types/qr';
import { PREVIEW_SIZE, createQrInstance, downloadQrCode, copyQrToClipboard } from '../../utils/qrRenderer';
import { getQrCapacity } from '../../utils/qrEncoding';
import { ScannabilityMeter } from './ScannabilityMeter';
import { ExportModal } from './ExportModal';

interface QrPreviewPanelProps {
  payloadString: string;
  design: QrDesignConfig;
  scannabilityReport: ScannabilityResult;
}

const MINI_PREVIEW_SIZE = 64;

export const QrPreviewPanel: React.FC<QrPreviewPanelProps> = ({
  payloadString,
  design,
  scannabilityReport,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [renderFailed, setRenderFailed] = useState(false);
  const [isCardVisible, setIsCardVisible] = useState(true);

  const capacity = useMemo(
    () => getQrCapacity(payloadString, design.errorCorrectionLevel),
    [payloadString, design.errorCorrectionLevel]
  );
  const isEmpty = payloadString.length === 0;
  const canRender = !isEmpty && capacity.fits;
  const isReady = canRender && !renderFailed;

  // Synchronously render a fresh QR Code Canvas on ANY payload or design change
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = '';
    if (!canRender) return;

    try {
      createQrInstance(payloadString, design, PREVIEW_SIZE).append(container);
      setRenderFailed(false);
    } catch (err) {
      console.error('Failed to render QR preview:', err);
      container.innerHTML = '';
      setRenderFailed(true);
    }
  }, [payloadString, design, canRender]);

  // Track whether the main preview card is on screen (drives the floating mini preview)
  useEffect(() => {
    const card = cardRef.current;
    if (!card || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => setIsCardVisible(entry.isIntersecting));
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  // Handle Copy to Clipboard
  const handleCopy = async () => {
    if (!isReady) return;
    const success = await copyQrToClipboard(payloadString, design);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Quick 1-click Download (PNG 1024px)
  const handleQuickDownload = async () => {
    if (!isReady) return;
    await downloadQrCode(payloadString, design, 'rsdn-qr-code', 'png', 1024);
  };

  const secondaryButtonClass =
    'flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border border-ars-grey-200 bg-ars-white hover:bg-ars-grey-50 text-ars-ink text-xs font-display font-semibold transition-all shadow-ars-xs disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-ars-white';

  return (
    <div className="space-y-4">
      {/* Live QR Preview Card */}
      <div ref={cardRef} className="ars-card p-5 space-y-4 relative overflow-hidden scroll-mt-20">

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
          {isReady && design.backgroundOptions.isTransparent && (
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

          {/* Placeholder states */}
          {!isReady && (
            <div className="relative z-10 max-w-xs text-center space-y-2" role="status">
              {isEmpty ? (
                <>
                  <QrCode className="w-14 h-14 text-ars-grey-300 mx-auto" aria-hidden="true" />
                  <p className="font-display font-semibold text-sm text-ars-ink">Your QR code will appear here</p>
                  <p className="text-xs text-ars-grey-600">Fill in the content form to generate it.</p>
                </>
              ) : !capacity.fits ? (
                <>
                  <AlertTriangle className="w-10 h-10 text-ars-red mx-auto" aria-hidden="true" />
                  <p className="font-display font-semibold text-sm text-ars-ink">Too much content for one QR code</p>
                  <p className="text-xs text-ars-grey-600">
                    {capacity.used.toLocaleString()} of {capacity.max.toLocaleString()} {capacity.unit} at error
                    correction {design.errorCorrectionLevel}. Shorten the content, or lower the error correction level.
                    Removing the logo lets you use a lower level.
                  </p>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-10 h-10 text-ars-red mx-auto" aria-hidden="true" />
                  <p className="font-display font-semibold text-sm text-ars-ink">This QR code couldn&apos;t be generated</p>
                  <p className="text-xs text-ars-grey-600">Try changing the content or design settings.</p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <button type="button" onClick={handleCopy} disabled={!isReady} className={secondaryButtonClass}>
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

          <button type="button" onClick={handleQuickDownload} disabled={!isReady} className={secondaryButtonClass}>
            <Download className="w-4 h-4 text-ars-grey-600" />
            <span>Quick PNG (1024px)</span>
          </button>
        </div>

        {/* Primary High-Resolution Export Button */}
        <button
          type="button"
          onClick={() => setIsExportModalOpen(true)}
          disabled={!isReady}
          className="w-full py-3 px-4 rounded-lg bg-ars-black text-white hover:bg-ars-ink text-xs font-display font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-ars-sm border border-ars-black hover:border-ars-red group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-ars-black"
        >
          <Sparkles className="w-4 h-4 text-ars-red group-hover:rotate-12 transition-transform" />
          <span>High-Resolution &amp; Vector Export (SVG / 4K)</span>
        </button>
      </div>

      {/* Scannability Health Meter */}
      <ScannabilityMeter report={scannabilityReport} />

      {/* High-Res Export Dialog */}
      <ExportModal
        isOpen={isExportModalOpen && isReady}
        onClose={() => setIsExportModalOpen(false)}
        payloadString={payloadString}
        design={design}
      />

      {/* Floating mini preview for small screens while the main preview is scrolled away */}
      {isReady && !isCardVisible && (
        <FloatingPreview
          payloadString={payloadString}
          design={design}
          onClick={() => cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        />
      )}
    </div>
  );
};

interface FloatingPreviewProps {
  payloadString: string;
  design: QrDesignConfig;
  onClick: () => void;
}

const FloatingPreview: React.FC<FloatingPreviewProps> = ({ payloadString, design, onClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = '';
    try {
      createQrInstance(payloadString, design, MINI_PREVIEW_SIZE).append(container);
    } catch {
      // The main preview reports render errors; the mini preview just stays blank.
    }
  }, [payloadString, design]);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Show QR code preview"
      className="lg:hidden fixed bottom-4 right-4 z-30 p-1.5 rounded-xl bg-ars-white border border-ars-grey-200 shadow-ars-lg animate-fade-in"
    >
      <div ref={containerRef} style={{ width: MINI_PREVIEW_SIZE, height: MINI_PREVIEW_SIZE }} aria-hidden="true" />
      <span className="block mt-0.5 text-[9px] font-display font-bold uppercase tracking-wider text-ars-grey-600">
        Preview
      </span>
    </button>
  );
};

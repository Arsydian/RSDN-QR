/**
 * @file Footer.tsx
 * @description Footer component with Arsydian styling, technical specifications,
 * and privacy statement.
 */

import React from 'react';
import { Shield, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-ars-black text-white border-t border-ars-ink mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-white/10">
          
          {/* Col 1: Brand & Philosophy */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-display font-black text-lg text-white">
                RSDN<span className="text-ars-red">·QR</span>
              </span>
              <span className="ars-badge bg-ars-ink text-ars-grey-300 border border-white/10">
                Studio
              </span>
            </div>
            <p className="text-xs text-ars-grey-400 leading-relaxed">
              Engineered for high-resolution vector and raster QR generation with complete design control, real-time camera readability metrics, and high-volume batch CSV processing.
            </p>
          </div>

          {/* Col 2: Security & Privacy */}
          <div>
            <h4 className="text-xs font-display font-bold uppercase tracking-wider text-ars-grey-400 mb-3 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-ars-red" />
              Zero-Server Architecture
            </h4>
            <p className="text-xs text-ars-grey-400 leading-relaxed">
              Every QR code, vCard payload, and batch archive is generated locally inside your browser memory. No data, Wi-Fi credentials, or contacts are ever transmitted or stored on external servers.
            </p>
          </div>

          {/* Col 3: Specifications */}
          <div>
            <h4 className="text-xs font-display font-bold uppercase tracking-wider text-ars-grey-400 mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-ars-success" />
              Standards &amp; Formats
            </h4>
            <ul className="text-xs text-ars-grey-400 space-y-1 font-mono">
              <li>• ISO/IEC 18004 QR Standard</li>
              <li>• vCard 3.0 &amp; iCal 2.0 Compliance</li>
              <li>• SVG, PNG &amp; JPEG up to 4K (4096px)</li>
              <li>• WCAG 2.1 Contrast Scoring</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-ars-grey-600 gap-4 font-sans">
          <p>© {new Date().getFullYear()} RSDN-QR Studio. Built with the Arsydian Design System.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-ars-grey-400 transition-colors">Static Cloudflare Pages Ready</span>
            <span className="hover:text-ars-grey-400 transition-colors">Client-Side Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

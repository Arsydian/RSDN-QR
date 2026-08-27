/**
 * @file Header.tsx
 * @description Top navigation bar with Arsydian styling, brand mark, active mode indicator,
 * and quick navigation controls.
 */

import React from 'react';
import { QrCode, Layers, ShieldCheck } from 'lucide-react';
import { ARSYDIAN_MARK_INVERTED_DATA_URI } from '../../utils/arsydianBrandAssets';

interface HeaderProps {
  activeMode: 'single' | 'batch';
  onModeChange: (mode: 'single' | 'batch') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeMode, onModeChange }) => {
  return (
    <header className="border-b border-ars-grey-200 bg-ars-white/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-ars-black flex items-center justify-center shadow-ars-sm border border-ars-ink p-1">
            <img
              src={ARSYDIAN_MARK_INVERTED_DATA_URI}
              alt="Arsydian Brand Mark"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-xl tracking-tight text-ars-black">
                RSDN<span className="text-ars-red">·QR</span>
              </span>
              <span className="ars-badge bg-ars-grey-100 text-ars-grey-600 border border-ars-grey-200 hidden sm:inline-flex">
                v1.0.0
              </span>
            </div>
            <p className="text-xs text-ars-grey-600 font-sans hidden md:block">
              Customizable QR Code Studio · Arsydian Design System
            </p>
          </div>
        </div>

        {/* Mode Selector / Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="bg-ars-grey-50 p-1 rounded-lg border border-ars-grey-200 flex items-center">
            <button
              onClick={() => onModeChange('single')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold font-display transition-all ${
                activeMode === 'single'
                  ? 'bg-ars-white text-ars-black shadow-ars-xs border border-ars-grey-200'
                  : 'text-ars-grey-600 hover:text-ars-black'
              }`}
            >
              <QrCode className="w-3.5 h-3.5 text-ars-red" />
              <span>Studio</span>
            </button>
            <button
              onClick={() => onModeChange('batch')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold font-display transition-all ${
                activeMode === 'batch'
                  ? 'bg-ars-white text-ars-black shadow-ars-xs border border-ars-grey-200'
                  : 'text-ars-grey-600 hover:text-ars-black'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-ars-red" />
              <span>CSV Batch</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-xs text-ars-grey-600 border-l border-ars-grey-200 pl-4">
            <ShieldCheck className="w-4 h-4 text-ars-success" />
            <span>100% Client-Side Privacy</span>
          </div>
        </div>
      </div>
    </header>
  );
};

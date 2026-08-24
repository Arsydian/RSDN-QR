/**
 * @file ErrorCorrectionControls.tsx
 * @description Controls for choosing Error Correction Level (L: 7%, M: 15%, Q: 25%, H: 30%).
 */

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { ErrorCorrectionLevel, QrDesignConfig } from '../../types/qr';

interface ErrorCorrectionControlsProps {
  design: QrDesignConfig;
  onChange: (design: QrDesignConfig) => void;
}

const EC_LEVELS: {
  level: ErrorCorrectionLevel;
  label: string;
  recovery: string;
  desc: string;
}[] = [
  { level: 'L', label: 'Low (L)', recovery: '~7%', desc: 'Smallest dots, cleanest look. No logos.' },
  { level: 'M', label: 'Medium (M)', recovery: '~15%', desc: 'Standard balance for most URLs & text.' },
  { level: 'Q', label: 'Quartile (Q)', recovery: '~25%', desc: 'High resilience for small logos or outdoor print.' },
  { level: 'H', label: 'High (H)', recovery: '~30%', desc: 'Maximum recovery. Recommended when embedding logos.' },
];

export const ErrorCorrectionControls: React.FC<ErrorCorrectionControlsProps> = ({
  design,
  onChange,
}) => {
  return (
    <div className="space-y-3">
      <label className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-ars-red" />
          Error Correction Level
        </span>
        <span className="text-[11px] font-mono text-ars-grey-600">Reed-Solomon Algorithm</span>
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {EC_LEVELS.map((item) => {
          const isSelected = design.errorCorrectionLevel === item.level;
          return (
            <button
              key={item.level}
              type="button"
              onClick={() => onChange({ ...design, errorCorrectionLevel: item.level })}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                isSelected
                  ? 'bg-ars-black text-white border-ars-black shadow-ars-xs'
                  : 'bg-ars-white text-ars-ink border-ars-grey-200 hover:border-ars-red hover:bg-ars-grey-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-display font-bold text-xs">{item.label}</span>
                <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-ars-red' : 'text-ars-grey-600'}`}>
                  {item.recovery}
                </span>
              </div>
              <p className={`text-[10px] leading-tight ${isSelected ? 'text-ars-grey-400' : 'text-ars-grey-600'}`}>
                {item.desc}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

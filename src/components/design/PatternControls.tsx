/**
 * @file PatternControls.tsx
 * @description Controls for customizing the geometry of QR code body dots,
 * corner square eye frames, and corner inner eye dots.
 */

import React from 'react';
import { DotType, CornerSquareType, CornerDotType, QrDesignConfig } from '../../types/qr';

interface PatternControlsProps {
  design: QrDesignConfig;
  onChange: (design: QrDesignConfig) => void;
}

export const PatternControls: React.FC<PatternControlsProps> = ({
  design,
  onChange,
}) => {
  // 1. Body Dot Styles
  const dotStyles: { type: DotType; label: string; desc: string }[] = [
    { type: 'rounded', label: 'Smooth Rounded', desc: 'Soft rounded corners' },
    { type: 'dots', label: 'Circular Dots', desc: 'Modern circular matrix' },
    { type: 'classy', label: 'Classy Matrix', desc: 'Diagonal cut geometry' },
    { type: 'classy-rounded', label: 'Classy Rounded', desc: 'Refined dynamic curves' },
    { type: 'extra-rounded', label: 'Extra Rounded', desc: 'Pill-shaped modules' },
    { type: 'square', label: 'Classic Square', desc: 'Standard sharp modules' },
  ];

  // 2. Corner Square (Eye Frame) Styles
  const cornerSquareStyles: { type: CornerSquareType; label: string }[] = [
    { type: 'extra-rounded', label: 'Smooth Rounded' },
    { type: 'dot', label: 'Circular Ring' },
    { type: 'square', label: 'Sharp Square' },
  ];

  // 3. Corner Dot (Inner Eye Ball) Styles
  const cornerDotStyles: { type: CornerDotType; label: string }[] = [
    { type: 'dot', label: 'Circular Dot' },
    { type: 'square', label: 'Sharp Square' },
  ];

  return (
    <div className="space-y-6">
      {/* Body Pattern */}
      <div>
        <label className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-2">
          Body Module Shape
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {dotStyles.map((item) => {
            const isSelected = design.dotsOptions.type === item.type;
            return (
              <button
                key={item.type}
                type="button"
                onClick={() =>
                  onChange({
                    ...design,
                    dotsOptions: {
                      ...design.dotsOptions,
                      type: item.type,
                    },
                  })
                }
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'bg-ars-black text-white border-ars-black shadow-ars-xs'
                    : 'bg-ars-white text-ars-ink border-ars-grey-200 hover:border-ars-red hover:bg-ars-grey-50'
                }`}
              >
                <div className="font-display font-bold text-xs tracking-tight">{item.label}</div>
                <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-ars-grey-400' : 'text-ars-grey-600'}`}>
                  {item.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Corner Eye Outer Frame */}
      <div>
        <label className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-2">
          Corner Eye Frame (Outer)
        </label>
        <div className="grid grid-cols-3 gap-2">
          {cornerSquareStyles.map((item) => {
            const isSelected = design.cornersSquareOptions.type === item.type;
            return (
              <button
                key={item.type}
                type="button"
                onClick={() =>
                  onChange({
                    ...design,
                    cornersSquareOptions: {
                      ...design.cornersSquareOptions,
                      type: item.type,
                    },
                  })
                }
                className={`p-2.5 rounded-lg border text-center transition-all ${
                  isSelected
                    ? 'bg-ars-black text-white border-ars-black shadow-ars-xs'
                    : 'bg-ars-white text-ars-ink border-ars-grey-200 hover:border-ars-red hover:bg-ars-grey-50'
                }`}
              >
                <span className="font-display font-bold text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Corner Eye Inner Ball */}
      <div>
        <label className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-2">
          Corner Eye Ball (Inner)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {cornerDotStyles.map((item) => {
            const isSelected = design.cornersDotOptions.type === item.type;
            return (
              <button
                key={item.type}
                type="button"
                onClick={() =>
                  onChange({
                    ...design,
                    cornersDotOptions: {
                      ...design.cornersDotOptions,
                      type: item.type,
                    },
                  })
                }
                className={`p-2.5 rounded-lg border text-center transition-all ${
                  isSelected
                    ? 'bg-ars-black text-white border-ars-black shadow-ars-xs'
                    : 'bg-ars-white text-ars-ink border-ars-grey-200 hover:border-ars-red hover:bg-ars-grey-50'
                }`}
              >
                <span className="font-display font-bold text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

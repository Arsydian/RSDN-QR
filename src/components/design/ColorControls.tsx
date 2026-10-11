/**
 * @file ColorControls.tsx
 * @description Advanced color management supporting solid fills, 2-stop linear and radial
 * gradients with angle rotation, custom corner eye tints, and transparent backgrounds.
 */

import React, { useId, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { QrDesignConfig, GradientType } from '../../types/qr';

interface ColorControlsProps {
  design: QrDesignConfig;
  onChange: (design: QrDesignConfig) => void;
}

const PRESET_PALETTES = [
  {
    name: 'Arsydian Crimson',
    body: '#D82125',
    cornerFrame: '#D82125',
    cornerDot: '#0C0A0B',
    bg: '#FFFFFF',
  },
  {
    name: 'Obsidian & Red',
    body: '#0C0A0B',
    cornerFrame: '#D82125',
    cornerDot: '#D82125',
    bg: '#FFFFFF',
  },
  {
    name: 'Monochrome Tech',
    body: '#0C0A0B',
    cornerFrame: '#0C0A0B',
    cornerDot: '#0C0A0B',
    bg: '#FFFFFF',
  },
  {
    name: 'Midnight Graphite',
    body: '#2A2A2E',
    cornerFrame: '#B81A1F',
    cornerDot: '#2A2A2E',
    bg: '#FAFAFB',
  },
  {
    name: 'Emerald Secure',
    body: '#1F8A4C',
    cornerFrame: '#1F8A4C',
    cornerDot: '#0C0A0B',
    bg: '#FFFFFF',
  },
  {
    name: 'Deep Sapphire',
    body: '#2563A8',
    cornerFrame: '#2563A8',
    cornerDot: '#0C0A0B',
    bg: '#FFFFFF',
  },
];

export const ColorControls: React.FC<ColorControlsProps> = ({
  design,
  onChange,
}) => {
  const id = useId();
  const [customCorners, setCustomCorners] = useState(
    design.cornersSquareOptions.color !== design.dotsOptions.color ||
    design.cornersDotOptions.color !== design.dotsOptions.color
  );

  // Apply a curated preset
  const applyPalette = (palette: (typeof PRESET_PALETTES)[0]) => {
    onChange({
      ...design,
      dotsOptions: {
        ...design.dotsOptions,
        color: palette.body,
        useGradient: false,
      },
      cornersSquareOptions: {
        ...design.cornersSquareOptions,
        color: palette.cornerFrame,
        useGradient: false,
      },
      cornersDotOptions: {
        ...design.cornersDotOptions,
        color: palette.cornerDot,
        useGradient: false,
      },
      backgroundOptions: {
        ...design.backgroundOptions,
        color: palette.bg,
        isTransparent: false,
      },
    });
  };

  // Toggle Gradient mode for body
  const handleGradientToggle = (enabled: boolean) => {
    if (enabled && !design.dotsOptions.gradient) {
      onChange({
        ...design,
        dotsOptions: {
          ...design.dotsOptions,
          useGradient: true,
          gradient: {
            type: 'linear',
            rotation: 45,
            colorStops: [
              { offset: 0, color: '#D82125' },
              { offset: 1, color: '#0C0A0B' },
            ],
          },
        },
      });
    } else {
      onChange({
        ...design,
        dotsOptions: {
          ...design.dotsOptions,
          useGradient: enabled,
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Curated Palettes */}
      <div>
        <p
          id={`${id}-palettes`}
          className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-2 flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-ars-red" aria-hidden="true" />
          Arsydian Curated Palettes
        </p>
        <div
          role="group"
          aria-labelledby={`${id}-palettes`}
          className="grid grid-cols-2 sm:grid-cols-3 gap-2"
        >
          {PRESET_PALETTES.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => applyPalette(p)}
              className="flex items-center gap-2 p-2 rounded-lg border border-ars-grey-200 bg-ars-white hover:border-ars-red hover:bg-ars-grey-50 text-left transition-all"
            >
              <div className="flex -space-x-1 shrink-0" aria-hidden="true">
                <div
                  className="w-4 h-4 rounded-full border border-white"
                  style={{ backgroundColor: p.body }}
                />
                <div
                  className="w-4 h-4 rounded-full border border-white"
                  style={{ backgroundColor: p.cornerFrame }}
                />
                <div
                  className="w-4 h-4 rounded-full border border-white"
                  style={{ backgroundColor: p.bg }}
                />
              </div>
              <span className="text-[11px] font-display font-semibold text-ars-ink truncate">
                {p.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Body Color & Gradient Controls */}
      <div className="p-3.5 rounded-lg border border-ars-grey-200 bg-ars-white space-y-3">
        <div className="flex items-center justify-between">
          <span
            id={`${id}-body-fill`}
            className="text-xs font-display font-bold uppercase tracking-wider text-ars-ink"
          >
            Body Pattern Fill
          </span>
          <div
            role="group"
            aria-labelledby={`${id}-body-fill`}
            className="flex items-center gap-1 bg-ars-grey-100 p-0.5 rounded-md border border-ars-grey-200 text-xs"
          >
            <button
              type="button"
              aria-pressed={!design.dotsOptions.useGradient}
              onClick={() => handleGradientToggle(false)}
              className={`px-2 py-1 rounded font-display text-[11px] font-semibold transition-all ${
                !design.dotsOptions.useGradient
                  ? 'bg-ars-white text-ars-black shadow-ars-xs'
                  : 'text-ars-grey-600 hover:text-ars-black'
              }`}
            >
              Solid
            </button>
            <button
              type="button"
              aria-pressed={!!design.dotsOptions.useGradient}
              onClick={() => handleGradientToggle(true)}
              className={`px-2 py-1 rounded font-display text-[11px] font-semibold transition-all ${
                design.dotsOptions.useGradient
                  ? 'bg-ars-white text-ars-black shadow-ars-xs'
                  : 'text-ars-grey-600 hover:text-ars-black'
              }`}
            >
              Gradient
            </button>
          </div>
        </div>

        {!design.dotsOptions.useGradient ? (
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={design.dotsOptions.color}
              onChange={(e) =>
                onChange({
                  ...design,
                  dotsOptions: {
                    ...design.dotsOptions,
                    color: e.target.value,
                  },
                })
              }
              aria-label="Body pattern color"
              className="w-9 h-9 rounded-lg border border-ars-grey-300 cursor-pointer p-0.5"
            />
            <input
              type="text"
              value={design.dotsOptions.color}
              onChange={(e) =>
                onChange({
                  ...design,
                  dotsOptions: {
                    ...design.dotsOptions,
                    color: e.target.value,
                  },
                })
              }
              aria-label="Body pattern color hex value"
              aria-describedby={`${id}-body-hex-hint`}
              className="px-3 py-1.5 text-xs bg-ars-grey-50 border border-ars-grey-200 rounded-lg text-ars-ink font-mono uppercase w-28 focus:border-ars-red"
            />
            <span id={`${id}-body-hex-hint`} className="text-xs text-ars-grey-600">Hex color code</span>
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            {/* Gradient Stops */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="block text-[11px] font-display font-medium text-ars-grey-600 mb-1">
                  Start Color
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={design.dotsOptions.gradient?.colorStops[0]?.color || '#D82125'}
                    onChange={(e) => {
                      const stops = [...(design.dotsOptions.gradient?.colorStops || [])];
                      stops[0] = { offset: 0, color: e.target.value };
                      onChange({
                        ...design,
                        dotsOptions: {
                          ...design.dotsOptions,
                          gradient: {
                            ...(design.dotsOptions.gradient || { type: 'linear', rotation: 45 }),
                            colorStops: stops,
                          },
                        },
                      });
                    }}
                    aria-label="Gradient start color"
                    className="w-8 h-8 rounded-lg border border-ars-grey-300 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={design.dotsOptions.gradient?.colorStops[0]?.color || '#D82125'}
                    aria-label="Gradient start color hex value"
                    className="px-2 py-1 text-xs bg-ars-grey-50 border border-ars-grey-200 rounded-sm text-ars-ink font-mono uppercase w-24"
                    readOnly
                  />
                </div>
              </div>

              <div>
                <span className="block text-[11px] font-display font-medium text-ars-grey-600 mb-1">
                  End Color
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={design.dotsOptions.gradient?.colorStops[1]?.color || '#0C0A0B'}
                    onChange={(e) => {
                      const stops = [...(design.dotsOptions.gradient?.colorStops || [])];
                      stops[1] = { offset: 1, color: e.target.value };
                      onChange({
                        ...design,
                        dotsOptions: {
                          ...design.dotsOptions,
                          gradient: {
                            ...(design.dotsOptions.gradient || { type: 'linear', rotation: 45 }),
                            colorStops: stops,
                          },
                        },
                      });
                    }}
                    aria-label="Gradient end color"
                    className="w-8 h-8 rounded-lg border border-ars-grey-300 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={design.dotsOptions.gradient?.colorStops[1]?.color || '#0C0A0B'}
                    aria-label="Gradient end color hex value"
                    className="px-2 py-1 text-xs bg-ars-grey-50 border border-ars-grey-200 rounded-sm text-ars-ink font-mono uppercase w-24"
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Gradient Type & Angle */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <label
                  htmlFor={`${id}-gradient-type`}
                  className="text-[11px] font-display font-medium text-ars-grey-600"
                >
                  Style:
                </label>
                <select
                  id={`${id}-gradient-type`}
                  value={design.dotsOptions.gradient?.type || 'linear'}
                  onChange={(e) =>
                    onChange({
                      ...design,
                      dotsOptions: {
                        ...design.dotsOptions,
                        gradient: {
                          ...(design.dotsOptions.gradient || { rotation: 45, colorStops: [] }),
                          type: e.target.value as GradientType,
                        },
                      },
                    })
                  }
                  className="text-xs bg-ars-grey-50 border border-ars-grey-200 rounded-sm px-2 py-1 text-ars-ink font-sans"
                >
                  <option value="linear">Linear Gradient</option>
                  <option value="radial">Radial Gradient</option>
                </select>
              </div>

              {design.dotsOptions.gradient?.type === 'linear' && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-ars-grey-600" aria-hidden="true">
                    {design.dotsOptions.gradient.rotation}°
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={design.dotsOptions.gradient.rotation}
                    aria-label="Gradient angle"
                    aria-valuetext={`${design.dotsOptions.gradient.rotation} degrees`}
                    onChange={(e) =>
                      onChange({
                        ...design,
                        dotsOptions: {
                          ...design.dotsOptions,
                          gradient: {
                            ...(design.dotsOptions.gradient || { type: 'linear', colorStops: [] }),
                            rotation: Number(e.target.value),
                          },
                        },
                      })
                    }
                    className="w-24"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Background Options */}
      <div className="p-3.5 rounded-lg border border-ars-grey-200 bg-ars-white space-y-3">
        <p
          id={`${id}-background`}
          className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink"
        >
          Background Surface
        </p>
        <div
          role="group"
          aria-labelledby={`${id}-background`}
          className="flex flex-wrap items-center gap-4"
        >
          <div className="flex items-center gap-3">
            <input
              type="color"
              aria-label="Background color"
              disabled={design.backgroundOptions.isTransparent}
              value={design.backgroundOptions.color}
              onChange={(e) =>
                onChange({
                  ...design,
                  backgroundOptions: {
                    ...design.backgroundOptions,
                    color: e.target.value,
                  },
                })
              }
              className="w-9 h-9 rounded-lg border border-ars-grey-300 cursor-pointer p-0.5 disabled:opacity-40"
            />
            <input
              type="text"
              aria-label="Background color hex value"
              disabled={design.backgroundOptions.isTransparent}
              value={design.backgroundOptions.color}
              onChange={(e) =>
                onChange({
                  ...design,
                  backgroundOptions: {
                    ...design.backgroundOptions,
                    color: e.target.value,
                  },
                })
              }
              className="px-3 py-1.5 text-xs bg-ars-grey-50 border border-ars-grey-200 rounded-lg text-ars-ink font-mono uppercase w-28 disabled:opacity-40 focus:border-ars-red"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`${id}-bg-transparent`}
              checked={design.backgroundOptions.isTransparent}
              onChange={(e) =>
                onChange({
                  ...design,
                  backgroundOptions: {
                    ...design.backgroundOptions,
                    isTransparent: e.target.checked,
                  },
                })
              }
              className="rounded-sm border-ars-grey-300 text-ars-red focus:ring-ars-red w-4 h-4"
            />
            <label htmlFor={`${id}-bg-transparent`} className="text-xs font-sans text-ars-ink cursor-pointer">
              Transparent Background (PNG / SVG)
            </label>
          </div>
        </div>
      </div>

      {/* Corner Eye Custom Tints */}
      <div className="p-3.5 rounded-lg border border-ars-grey-200 bg-ars-white space-y-3">
        <div className="flex items-center justify-between">
          <span
            id={`${id}-corners`}
            className="text-xs font-display font-bold uppercase tracking-wider text-ars-ink"
          >
            Custom Corner Eye Colors
          </span>
          <button
            type="button"
            aria-expanded={customCorners}
            aria-controls={customCorners ? `${id}-corners-panel` : undefined}
            onClick={() => setCustomCorners(!customCorners)}
            className="text-xs font-display font-semibold text-ars-red hover:underline"
          >
            {customCorners ? 'Collapse' : 'Customize Separately'}
          </button>
        </div>

        {customCorners && (
          <div
            id={`${id}-corners-panel`}
            role="group"
            aria-labelledby={`${id}-corners`}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-ars-grey-100"
          >
            <div>
              <span className="block text-[11px] font-display font-medium text-ars-grey-600 mb-1.5">
                Corner Outer Frame Color
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  aria-label="Corner outer frame color"
                  value={design.cornersSquareOptions.color}
                  onChange={(e) =>
                    onChange({
                      ...design,
                      cornersSquareOptions: {
                        ...design.cornersSquareOptions,
                        color: e.target.value,
                      },
                    })
                  }
                  className="w-8 h-8 rounded-lg border border-ars-grey-300 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  aria-label="Corner outer frame color hex value"
                  value={design.cornersSquareOptions.color}
                  onChange={(e) =>
                    onChange({
                      ...design,
                      cornersSquareOptions: {
                        ...design.cornersSquareOptions,
                        color: e.target.value,
                      },
                    })
                  }
                  className="px-2 py-1 text-xs bg-ars-grey-50 border border-ars-grey-200 rounded-sm text-ars-ink font-mono uppercase w-24"
                />
              </div>
            </div>

            <div>
              <span className="block text-[11px] font-display font-medium text-ars-grey-600 mb-1.5">
                Corner Inner Ball Color
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  aria-label="Corner inner ball color"
                  value={design.cornersDotOptions.color}
                  onChange={(e) =>
                    onChange({
                      ...design,
                      cornersDotOptions: {
                        ...design.cornersDotOptions,
                        color: e.target.value,
                      },
                    })
                  }
                  className="w-8 h-8 rounded-lg border border-ars-grey-300 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  aria-label="Corner inner ball color hex value"
                  value={design.cornersDotOptions.color}
                  onChange={(e) =>
                    onChange({
                      ...design,
                      cornersDotOptions: {
                        ...design.cornersDotOptions,
                        color: e.target.value,
                      },
                    })
                  }
                  className="px-2 py-1 text-xs bg-ars-grey-50 border border-ars-grey-200 rounded-sm text-ars-ink font-mono uppercase w-24"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

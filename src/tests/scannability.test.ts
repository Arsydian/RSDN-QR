/**
 * @file scannability.test.ts
 * @description Unit tests for WCAG contrast calculation and scannability health rating.
 */

import { describe, it, expect } from 'vitest';
import { calculateContrastRatio, analyzeScannability } from '../utils/scannability';
import { QrDesignConfig } from '../types/qr';

const defaultDesign: QrDesignConfig = {
  width: 360,
  height: 360,
  margin: 10,
  errorCorrectionLevel: 'M',
  dotsOptions: {
    type: 'rounded',
    color: '#0C0A0B',
    useGradient: false,
  },
  cornersSquareOptions: {
    type: 'extra-rounded',
    color: '#D82125',
    useGradient: false,
  },
  cornersDotOptions: {
    type: 'dot',
    color: '#D82125',
    useGradient: false,
  },
  backgroundOptions: {
    color: '#FFFFFF',
    isTransparent: false,
  },
  imageOptions: {
    src: '',
    size: 0.25,
    margin: 5,
    hideBackgroundDots: true,
  },
};

describe('Scannability Analyzer', () => {
  it('calculates high contrast ratio between black and white', () => {
    const ratio = calculateContrastRatio('#000000', '#FFFFFF');
    expect(ratio).toBeGreaterThanOrEqual(15);
  });

  it('calculates low contrast ratio between light grey and white', () => {
    const ratio = calculateContrastRatio('#E0E0E0', '#FFFFFF');
    expect(ratio).toBeLessThan(3.0);
  });

  it('rates default clean QR code as excellent', () => {
    const result = analyzeScannability('https://arsydian.com', defaultDesign);
    expect(result.score).toBeGreaterThanOrEqual(90);
    expect(result.rating).toBe('excellent');
    expect(result.contrastPass).toBe(true);
    expect(result.logoSafe).toBe(true);
  });

  it('warns when contrast is dangerously low', () => {
    const lowContrastDesign: QrDesignConfig = {
      ...defaultDesign,
      dotsOptions: {
        ...defaultDesign.dotsOptions,
        color: '#EEEEEE',
      },
    };

    const result = analyzeScannability('https://arsydian.com', lowContrastDesign);
    expect(result.contrastPass).toBe(false);
    expect(result.rating).toMatch(/warning|critical/);
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it('detects when logo size exceeds error correction capacity', () => {
    const bigLogoDesign: QrDesignConfig = {
      ...defaultDesign,
      errorCorrectionLevel: 'L', // 7% capacity
      imageOptions: {
        ...defaultDesign.imageOptions,
        src: 'data:image/svg+xml;base64,...',
        size: 0.35, // 0.35^2 = 12.25% area, which exceeds 7%
      },
    };

    const result = analyzeScannability('https://arsydian.com', bigLogoDesign);
    expect(result.logoSafe).toBe(false);
    expect(result.recommendations.some(r => r.includes('High'))).toBe(true);
  });
});

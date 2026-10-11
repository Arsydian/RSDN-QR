/**
 * @file scannability.test.ts
 * @description Unit tests for WCAG contrast calculation and scannability health rating.
 */

import { describe, it, expect } from 'vitest';
import { calculateContrastRatio, analyzeScannability } from '../utils/scannability';
import { QrDesignConfig } from '../types/qr';

const defaultDesign: QrDesignConfig = {
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

  it('reports logo cover the way qr-code-styling sizes logos (size × EC capacity)', () => {
    const logoDesign = (errorCorrectionLevel: QrDesignConfig['errorCorrectionLevel']): QrDesignConfig => ({
      ...defaultDesign,
      errorCorrectionLevel,
      imageOptions: { ...defaultDesign.imageOptions, src: 'data:image/svg+xml;base64,...', size: 0.35 },
    });

    const atH = analyzeScannability('https://arsydian.com', logoDesign('H'));
    expect(atH.logoOcclusionPercent).toBe(10.5); // 0.35 × 30%
    expect(atH.logoSafe).toBe(true);
    expect(atH.rating).toBe('excellent');

    const atL = analyzeScannability('https://arsydian.com', logoDesign('L'));
    expect(atL.logoOcclusionPercent).toBe(2.5); // 0.35 × 7%, rounded
    expect(atL.logoSafe).toBe(false);
    expect(atL.recommendations.some(r => r.includes('Medium (M) or higher'))).toBe(true);
  });

  it('uses the weakest color, including gradient stops and corners', () => {
    const gradientDesign: QrDesignConfig = {
      ...defaultDesign,
      dotsOptions: {
        ...defaultDesign.dotsOptions,
        useGradient: true,
        gradient: { type: 'linear', rotation: 0, colorStops: [{ offset: 0, color: '#000000' }, { offset: 1, color: '#DDDDDD' }] },
      },
    };
    expect(analyzeScannability('x', gradientDesign).contrastPass).toBe(false);

    const paleCorners: QrDesignConfig = {
      ...defaultDesign,
      cornersSquareOptions: { ...defaultDesign.cornersSquareOptions, color: '#F5C6C7' },
    };
    const result = analyzeScannability('x', paleCorners);
    expect(result.contrastPass).toBe(false);
    expect(result.recommendations[0]).toContain('Corner frame');
  });

  it('parses named and rgb() colors instead of treating them as black', () => {
    expect(calculateContrastRatio('white', '#FFFFFF')).toBe(1);
    expect(calculateContrastRatio('rgb(0, 0, 0)', 'white')).toBe(21);
  });

  it('warns about inverted (light-on-dark) codes', () => {
    const inverted: QrDesignConfig = {
      ...defaultDesign,
      dotsOptions: { ...defaultDesign.dotsOptions, color: '#FFFFFF' },
      cornersSquareOptions: { ...defaultDesign.cornersSquareOptions, color: '#FFFFFF' },
      cornersDotOptions: { ...defaultDesign.cornersDotOptions, color: '#FFFFFF' },
      backgroundOptions: { color: '#0C0A0B', isTransparent: false },
    };
    const result = analyzeScannability('https://arsydian.com', inverted);
    expect(result.contrastPass).toBe(true);
    expect(result.recommendations.some(r => r.includes('inverted'))).toBe(true);
  });

  it('measures payload size in UTF-8 bytes and flags overflow', () => {
    expect(analyzeScannability('—', defaultDesign).payloadBytes).toBe(3);

    const overflow = analyzeScannability('x'.repeat(2400), defaultDesign);
    expect(overflow.score).toBe(0);
    expect(overflow.recommendations[0]).toContain('Too much content');
  });
});

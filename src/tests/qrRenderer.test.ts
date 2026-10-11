/**
 * @file qrRenderer.test.ts
 * @description Unit tests for translating design config into qr-code-styling options.
 */

import { describe, it, expect } from 'vitest';
import { buildQrOptions, PREVIEW_SIZE } from '../utils/qrRenderer';
import { QrDesignConfig } from '../types/qr';

const design: QrDesignConfig = {
  margin: 12,
  errorCorrectionLevel: 'M',
  dotsOptions: { type: 'rounded', color: '#0C0A0B', useGradient: false },
  cornersSquareOptions: { type: 'extra-rounded', color: '#D82125', useGradient: false },
  cornersDotOptions: { type: 'dot', color: '#D82125', useGradient: false },
  backgroundOptions: { color: '#FFFFFF', isTransparent: false },
  imageOptions: { src: '', size: 0.22, margin: 4, hideBackgroundDots: true },
};

describe('buildQrOptions', () => {
  it('uses the design margins as-is at preview size', () => {
    const options = buildQrOptions('hello', design, PREVIEW_SIZE);
    expect(options.margin).toBe(12);
    expect(options.imageOptions?.margin).toBe(4);
  });

  it('scales the quiet zone and logo margin with export size', () => {
    const options = buildQrOptions('hello', design, 4096);
    expect(options.width).toBe(4096);
    expect(options.margin).toBe(Math.round((12 * 4096) / PREVIEW_SIZE));
    expect(options.imageOptions?.margin).toBe(Math.round((4 * 4096) / PREVIEW_SIZE));
  });

  it('passes UTF-8 bytes to the encoder', () => {
    expect(buildQrOptions('Adam’s', design).data).toBe('Adam\xE2\x80\x99s');
  });

  it('keeps transparency for PNG and SVG but not JPEG', () => {
    const transparent = { ...design, backgroundOptions: { color: '#F0F0F0', isTransparent: true } };
    expect(buildQrOptions('x', transparent, 1024, 'png').backgroundOptions?.color).toBe('transparent');
    expect(buildQrOptions('x', transparent, 1024, 'svg').backgroundOptions?.color).toBe('transparent');
    expect(buildQrOptions('x', transparent, 1024, 'jpeg').backgroundOptions?.color).toBe('#F0F0F0');
  });
});

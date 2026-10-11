/**
 * @file qrEncoding.test.ts
 * @description Unit tests for UTF-8 payload encoding and QR capacity checks.
 * Round-trip tests encode text into a real QR matrix (with the same encoder qr-code-styling
 * bundles) and decode it again with jsQR to prove the scanned bytes are valid UTF-8.
 */

import { describe, it, expect } from 'vitest';
import qrcode from 'qrcode-generator';
import jsQR from 'jsqr';
import { toUtf8ByteString, getQrCapacity } from '../utils/qrEncoding';

/** Encodes `data` into a QR code, rasterizes it, decodes it with jsQR, and returns the raw bytes as UTF-8 text. */
function scan(data: string): string {
  const qr = qrcode(0, 'M');
  qr.addData(data, 'Byte');
  qr.make();

  const modules = qr.getModuleCount();
  const scale = 4;
  const quietZone = 4;
  const size = (modules + quietZone * 2) * scale;
  const pixels = new Uint8ClampedArray(size * size * 4).fill(255);

  for (let row = 0; row < modules; row++) {
    for (let col = 0; col < modules; col++) {
      if (!qr.isDark(row, col)) continue;
      for (let y = 0; y < scale; y++) {
        for (let x = 0; x < scale; x++) {
          const i = (((row + quietZone) * scale + y) * size + (col + quietZone) * scale + x) * 4;
          pixels[i] = pixels[i + 1] = pixels[i + 2] = 0;
        }
      }
    }
  }

  const result = jsQR(pixels, size, size);
  if (!result) throw new Error('QR code could not be decoded');
  return new TextDecoder().decode(Uint8Array.from(result.binaryData));
}

describe('UTF-8 payload encoding', () => {
  it('leaves ASCII unchanged', () => {
    expect(toUtf8ByteString('https://arsydian.com')).toBe('https://arsydian.com');
  });

  it('expands non-ASCII characters into their UTF-8 bytes', () => {
    expect(toUtf8ByteString('—')).toBe('\xE2\x80\x94');
    expect(toUtf8ByteString('é')).toBe('\xC3\xA9');
  });

  it.each([
    'Arsydian IT & Security Services — No jargon, no hassles.',
    'WIFI:T:WPA;S:Adam’s Office;P:pässwörd;H:false;;',
    'José Müller · 東京 · Привет · 👋',
  ])('survives a scan round trip: %s', (text) => {
    expect(scan(toUtf8ByteString(text))).toBe(text);
  });

  it('is needed: raw text with characters above U+00FF is corrupted', () => {
    expect(scan('Adam’s Office')).not.toBe('Adam’s Office');
  });
});

describe('QR capacity', () => {
  it('detects the same encoding modes as qr-code-styling', () => {
    expect(getQrCapacity('0123456789', 'M').unit).toBe('digits');
    expect(getQrCapacity('HELLO WORLD', 'M').unit).toBe('characters');
    expect(getQrCapacity('https://arsydian.com', 'M').unit).toBe('bytes');
  });

  it('counts UTF-8 bytes, not characters', () => {
    expect(getQrCapacity('—', 'M').used).toBe(3);
  });

  it('flags payloads that exceed the version 40 limit', () => {
    expect(getQrCapacity('a'.repeat(1273), 'H').fits).toBe(true);
    expect(getQrCapacity('a'.repeat(1274), 'H')).toEqual({ fits: false, used: 1274, max: 1273, unit: 'bytes' });
    expect(getQrCapacity('a'.repeat(1274), 'L').fits).toBe(true);
  });

  it('agrees with the real encoder at the limit', () => {
    const fits = qrcode(0, 'H');
    fits.addData('a'.repeat(1273), 'Byte');
    expect(() => fits.make()).not.toThrow();

    const overflow = qrcode(0, 'H');
    overflow.addData('a'.repeat(1274), 'Byte');
    expect(() => overflow.make()).toThrow();
  });
});

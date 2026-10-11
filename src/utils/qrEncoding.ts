/**
 * @file qrEncoding.ts
 * @description Payload encoding and capacity helpers shared by the renderer and the
 * scannability analyzer. Kept free of DOM and rendering dependencies.
 */

import { ErrorCorrectionLevel } from '../types/qr';

/**
 * Converts text into a UTF-8 "byte string" (one character per byte).
 * qr-code-styling's encoder keeps only the low byte of each character, so raw text
 * corrupts anything outside Latin-1 (em dashes, curly quotes, accented names, emoji).
 *
 * @param text Raw payload text.
 * @returns String whose character codes are the UTF-8 bytes of `text`.
 */
export function toUtf8ByteString(text: string): string {
  let out = '';
  for (const byte of new TextEncoder().encode(text)) {
    out += String.fromCharCode(byte);
  }
  return out;
}

type QrMode = 'Numeric' | 'Alphanumeric' | 'Byte';

/** Maximum data capacity of the largest QR code (version 40), by encoding mode and error correction level. */
const QR_CAPACITY: Record<QrMode, Record<ErrorCorrectionLevel, number>> = {
  Numeric: { L: 7089, M: 5596, Q: 3993, H: 3057 },
  Alphanumeric: { L: 4296, M: 3391, Q: 2420, H: 1852 },
  Byte: { L: 2953, M: 2331, Q: 1663, H: 1273 },
};

const QR_MODE_UNIT: Record<QrMode, string> = {
  Numeric: 'digits',
  Alphanumeric: 'characters',
  Byte: 'bytes',
};

export interface QrCapacity {
  /** Whether the payload fits in a QR code at the given error correction level. */
  fits: boolean;
  /** Payload size in the encoding mode's unit. */
  used: number;
  /** Maximum size for the encoding mode and error correction level. */
  max: number;
  /** Unit of `used` and `max` (digits, characters or bytes). */
  unit: string;
}

/**
 * Checks whether a payload fits in a QR code. Mirrors the mode detection qr-code-styling
 * uses, so `fits === false` exactly when rendering would throw "code length overflow".
 *
 * @param data The serialized QR payload string.
 * @param ecLevel Error correction level.
 * @returns Capacity usage for the payload.
 */
export function getQrCapacity(data: string, ecLevel: ErrorCorrectionLevel): QrCapacity {
  const encoded = toUtf8ByteString(data);
  const mode: QrMode = /^[0-9]*$/.test(encoded)
    ? 'Numeric'
    : /^[0-9A-Z $%*+\-./:]*$/.test(encoded)
      ? 'Alphanumeric'
      : 'Byte';
  const max = QR_CAPACITY[mode][ecLevel];
  return { fits: encoded.length <= max, used: encoded.length, max, unit: QR_MODE_UNIT[mode] };
}

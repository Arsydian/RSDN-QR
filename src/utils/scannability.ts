/**
 * @file scannability.ts
 * @description Real-time QR Code scannability, contrast, and error-correction health analyzer.
 * Calculates standard WCAG 2.1 contrast ratios for every colored part of the code, logo
 * occlusion as qr-code-styling actually draws it, and data density, to guarantee optimal
 * camera readability.
 */

import { colord, extend, RgbaColor } from 'colord';
import namesPlugin from 'colord/plugins/names';
import { QrDesignConfig, ScannabilityResult, HealthRating } from '../types/qr';
import { getQrCapacity } from './qrEncoding';

extend([namesPlugin]);

/** Maximum data recovery capacity per Error Correction Level */
const ERROR_CORRECTION_CAPACITY: Record<string, number> = {
  L: 0.07, // 7% recovery
  M: 0.15, // 15% recovery
  Q: 0.25, // 25% recovery
  H: 0.30, // 30% recovery
};

type Rgb = { r: number; g: number; b: number };

/**
 * Parses any CSS color (hex, rgb(), hsl(), named colors) into RGB, compositing any
 * transparency over `backdrop`. Invalid values fall back to black, which is what the
 * canvas renderer draws when given an invalid color.
 */
function parseColor(color: string, backdrop: Rgb = { r: 255, g: 255, b: 255 }): Rgb {
  const parsed = colord(color.trim());
  const { r, g, b, a }: RgbaColor = parsed.isValid() ? parsed.toRgb() : { r: 0, g: 0, b: 0, a: 1 };
  return {
    r: r * a + backdrop.r * (1 - a),
    g: g * a + backdrop.g * (1 - a),
    b: b * a + backdrop.b * (1 - a),
  };
}

/**
 * Computes standard WCAG 2.1 relative luminance for an sRGB color.
 * Reference: https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
function getRelativeLuminance(rgb: Rgb): number {
  const transform = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * transform(rgb.r) + 0.7152 * transform(rgb.g) + 0.0722 * transform(rgb.b);
}

function contrastBetween(lumA: number, lumB: number): number {
  const contrast = (Math.max(lumA, lumB) + 0.05) / (Math.min(lumA, lumB) + 0.05);
  return Number(contrast.toFixed(2));
}

/**
 * Computes exact WCAG 2.1 contrast ratio between two CSS colors.
 * @param color1 Foreground / pattern color.
 * @param color2 Background color.
 * @returns Contrast ratio e.g., 21.0 (meaning 21:1 for black on white).
 */
export function calculateContrastRatio(color1: string, color2: string): number {
  const background = parseColor(color2);
  return contrastBetween(
    getRelativeLuminance(parseColor(color1, background)),
    getRelativeLuminance(background)
  );
}

/** Every color used by one part of the code (a solid color, or all gradient stops). */
function partColors(part: { color: string; useGradient: boolean; gradient?: { colorStops: { color: string }[] } }): string[] {
  return part.useGradient && part.gradient?.colorStops.length
    ? part.gradient.colorStops.map((stop) => stop.color)
    : [part.color];
}

/**
 * Analyzes the QR configuration and payload to determine overall scannability health.
 *
 * @param payloadString The serialized string encoded in the QR code.
 * @param design The active design and geometry configuration.
 * @returns Complete scannability report with score, health rating, and recommendations.
 */
export function analyzeScannability(
  payloadString: string,
  design: QrDesignConfig
): ScannabilityResult {
  const recommendations: string[] = [];
  let score = 100;

  // 1. Contrast: the weakest of the dots, corner frames and corner dots against the background
  // (a transparent code is assumed to sit on a white surface)
  const background = design.backgroundOptions.isTransparent
    ? { r: 255, g: 255, b: 255 }
    : parseColor(design.backgroundOptions.color || '#FFFFFF');
  const backgroundLum = getRelativeLuminance(background);

  const parts = [
    { name: 'Dot', colors: partColors(design.dotsOptions) },
    { name: 'Corner frame', colors: partColors(design.cornersSquareOptions) },
    { name: 'Corner dot', colors: partColors(design.cornersDotOptions) },
  ];
  let contrast = Infinity;
  let weakestPart = 'Dot';
  for (const part of parts) {
    for (const color of part.colors) {
      const ratio = contrastBetween(getRelativeLuminance(parseColor(color, background)), backgroundLum);
      if (ratio < contrast) {
        contrast = ratio;
        weakestPart = part.name;
      }
    }
  }

  let contrastPass = true;
  if (contrast < 3.0) {
    contrastPass = false;
    score -= 45;
    recommendations.push(`Critical: ${weakestPart} color contrast against the background is very low (${contrast}:1). Cameras will struggle to scan.`);
  } else if (contrast < 4.5) {
    contrastPass = false;
    score -= 25;
    recommendations.push(`Warning: ${weakestPart} color contrast is low (${contrast}:1). Use darker pattern colors or a lighter background.`);
  }

  // Light-on-dark ("inverted") codes are not supported by every scanner
  const darkestDotLum = Math.min(...parts[0].colors.map((c) => getRelativeLuminance(parseColor(c, background))));
  if (darkestDotLum > backgroundLum) {
    score -= 20;
    recommendations.push('Warning: Light dots on a darker background (an inverted code) won\'t scan with some phone cameras. Dark dots on a light background are the safest choice.');
  }

  // 2. Logo occlusion. qr-code-styling sizes the logo so it hides at most
  // (logo size × error correction capacity) of the modules, so it always stays within the
  // recovery budget; what matters is how much budget is left for scratches and glare.
  const hasLogo = Boolean(design.imageOptions.src);
  const ecLevel = design.errorCorrectionLevel || 'M';
  const ecCapacity = ERROR_CORRECTION_CAPACITY[ecLevel] || 0.15;
  const logoOcclusionPercent = hasLogo
    ? Number(((design.imageOptions.size || 0) * ecCapacity * 100).toFixed(1))
    : 0;
  let logoSafe = true;

  if (hasLogo && ecLevel === 'L') {
    logoSafe = false;
    score -= 15;
    recommendations.push(
      'Warning: With a logo, Error Correction L leaves little room for scratches, glare or print defects. Use Medium (M) or higher.'
    );
  }

  // 3. Data density (measured in encoded bytes, which is what fills the code)
  const capacity = getQrCapacity(payloadString, ecLevel);
  const payloadBytes = capacity.used;
  let dataDensitySafe = true;

  if (payloadBytes > 600) {
    score -= 20;
    dataDensitySafe = false;
    recommendations.push('High payload density: Consider shortening URLs or notes for sharper, easier-to-read QR modules.');
  } else if (payloadBytes > 350 && (ecLevel === 'H' || ecLevel === 'Q')) {
    score -= 10;
    recommendations.push('Dense payload with High error correction. Code will have many small dots; ensure high resolution when printing.');
  }

  if (!capacity.fits) {
    score = 0;
    dataDensitySafe = false;
    recommendations.unshift(
      `Critical: Too much content for a QR code at Error Correction ${ecLevel} (${capacity.used.toLocaleString()} of ${capacity.max.toLocaleString()} ${capacity.unit}). Shorten the content or lower the error correction level.`
    );
  }

  if (payloadString.length === 0) {
    score = 0;
    recommendations.push('Please enter payload content to generate a valid QR code.');
  }

  // Clamp score
  const finalScore = Math.max(0, Math.min(100, score));

  // Determine Rating category
  let rating: HealthRating = 'excellent';
  if (finalScore < 50) {
    rating = 'critical';
  } else if (finalScore < 75) {
    rating = 'warning';
  } else if (finalScore < 90) {
    rating = 'good';
  }

  return {
    score: finalScore,
    rating,
    contrastRatio: contrast,
    contrastPass,
    logoSafe,
    logoOcclusionPercent,
    dataDensitySafe,
    payloadBytes,
    recommendations,
  };
}

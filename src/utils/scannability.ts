/**
 * @file scannability.ts
 * @description Real-time QR Code scannability, contrast, and error-correction health analyzer.
 * Calculates standard WCAG 2.1 contrast ratios, logo occlusion safety, and data density metrics
 * to guarantee optimal camera readability.
 */

import { QrDesignConfig, ScannabilityResult, HealthRating } from '../types/qr';

/** Maximum data recovery capacity per Error Correction Level */
const ERROR_CORRECTION_CAPACITY: Record<string, number> = {
  L: 0.07, // 7% recovery
  M: 0.15, // 15% recovery
  Q: 0.25, // 25% recovery
  H: 0.30, // 30% recovery
};

/**
 * Parses hex color (3, 4, 6, or 8 characters) to RGB components [0..255].
 * Falls back to black if invalid.
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let cleaned = hex.trim().replace(/^#/, '');
  if (cleaned.length === 3) {
    cleaned = cleaned.split('').map((char) => char + char).join('');
  }
  if (cleaned.length >= 6) {
    const r = parseInt(cleaned.substring(0, 2), 16);
    const g = parseInt(cleaned.substring(2, 4), 16);
    const b = parseInt(cleaned.substring(4, 6), 16);
    if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
      return { r, g, b };
    }
  }
  return { r: 0, g: 0, b: 0 };
}

/**
 * Computes standard WCAG 2.1 relative luminance for an sRGB color.
 * Reference: https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
function getRelativeLuminance(rgb: { r: number; g: number; b: number }): number {
  const transform = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const r = transform(rgb.r);
  const g = transform(rgb.g);
  const b = transform(rgb.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Computes exact WCAG 2.1 contrast ratio between two hex colors.
 * @param color1 Foreground / pattern color.
 * @param color2 Background color.
 * @returns Contrast ratio e.g., 21.0 (meaning 21:1 for black on white).
 */
export function calculateContrastRatio(color1: string, color2: string): number {
  try {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    const lum1 = getRelativeLuminance(rgb1);
    const lum2 = getRelativeLuminance(rgb2);

    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    const contrast = (brightest + 0.05) / (darkest + 0.05);
    return Number(contrast.toFixed(2));
  } catch {
    return 4.5;
  }
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

  // 1. Evaluate Foreground vs Background Contrast
  const fgColor = design.dotsOptions.useGradient && design.dotsOptions.gradient?.colorStops.length
    ? design.dotsOptions.gradient.colorStops[0].color
    : design.dotsOptions.color;

  const bgColor = design.backgroundOptions.isTransparent
    ? '#FFFFFF' // Assume standard white surface for transparent codes
    : design.backgroundOptions.color;

  const contrast = calculateContrastRatio(fgColor, bgColor);
  let contrastPass = true;

  if (contrast < 3.0) {
    contrastPass = false;
    score -= 45;
    recommendations.push('Critical: Foreground and background contrast is very low (< 3:1). Cameras will struggle to scan.');
  } else if (contrast < 4.5) {
    contrastPass = false;
    score -= 25;
    recommendations.push('Warning: Contrast ratio is low (< 4.5:1). Consider darker pattern colors or lighter background.');
  } else if (contrast >= 7.0) {
    // Excellent contrast (AAA compliance)
  }

  // 2. Evaluate Logo Occlusion against Error Correction Level
  const hasLogo = Boolean(design.imageOptions.src);
  const logoScale = design.imageOptions.size || 0; // scale between 0.1 and 0.35
  const logoAreaRatio = hasLogo ? Math.pow(logoScale, 2) : 0; // Area = width * height
  const logoOcclusionPercent = Math.round(logoAreaRatio * 100);

  const ecLevel = design.errorCorrectionLevel || 'M';
  const ecCapacity = ERROR_CORRECTION_CAPACITY[ecLevel] || 0.15;
  let logoSafe = true;

  if (hasLogo) {
    // If logo area exceeds error correction capacity
    if (logoAreaRatio > ecCapacity) {
      logoSafe = false;
      score -= 40;
      recommendations.push(
        `Critical: Logo covers ~${logoOcclusionPercent}% of the code, exceeding Error Correction ${ecLevel} (${Math.round(ecCapacity * 100)}%). Increase Error Correction to "High (H)" or reduce logo size.`
      );
    } else if (logoAreaRatio > ecCapacity * 0.75) {
      score -= 15;
      recommendations.push(
        `Tip: Logo is close to the safety limit for Error Correction ${ecLevel}. Upgrading to "High (H)" ensures 100% reliable scanning.`
      );
    }
  }

  // 3. Evaluate Character Density
  const charCount = payloadString.length;
  let dataDensitySafe = true;

  if (charCount > 600) {
    score -= 20;
    dataDensitySafe = false;
    recommendations.push('High payload density: Consider shortening URLs or notes for sharper, easier-to-read QR modules.');
  } else if (charCount > 350 && (ecLevel === 'H' || ecLevel === 'Q')) {
    score -= 10;
    recommendations.push('Dense payload with High error correction. Code will have many small dots; ensure high resolution when printing.');
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
    characterCount: charCount,
    recommendations,
  };
}

/**
 * @file qrRenderer.ts
 * @description Wrapper and rendering utilities for `qr-code-styling`.
 * Bridges React UI state with canvas/SVG generation, high-res downloads,
 * clipboard copying, and batch processing.
 */

import QRCodeStyling, { Options } from 'qr-code-styling';
import { QrDesignConfig, ExportFormat } from '../types/qr';

/**
 * Transforms application design configuration into `qr-code-styling` Options object.
 * Strictly isolates gradients and image paths so reverting styles does not leave stale state.
 *
 * @param data The serialized QR payload string.
 * @param design Visual styling parameters.
 * @param targetSize Pixel dimension for rendering (e.g. 300 for preview, 2048 for export).
 * @returns Formatted Options object for QRCodeStyling.
 */
export function buildQrOptions(
  data: string,
  design: QrDesignConfig,
  targetSize?: number
): Options {
  const size = targetSize || design.width || 360;

  // Body dots configuration
  const dotsOptions: Options['dotsOptions'] = {
    type: design.dotsOptions.type,
    color: design.dotsOptions.color,
  };

  // Only assign gradient if useGradient is explicitly enabled
  if (
    design.dotsOptions.useGradient &&
    design.dotsOptions.gradient &&
    design.dotsOptions.gradient.colorStops.length > 0
  ) {
    dotsOptions.gradient = {
      type: design.dotsOptions.gradient.type,
      rotation: (design.dotsOptions.gradient.rotation * Math.PI) / 180,
      colorStops: design.dotsOptions.gradient.colorStops,
    };
  }

  // Corner Square (Outer Eye Frame)
  const cornersSquareOptions: Options['cornersSquareOptions'] = {
    type: design.cornersSquareOptions.type,
    color: design.cornersSquareOptions.color,
  };

  if (
    design.cornersSquareOptions.useGradient &&
    design.cornersSquareOptions.gradient &&
    design.cornersSquareOptions.gradient.colorStops.length > 0
  ) {
    cornersSquareOptions.gradient = {
      type: design.cornersSquareOptions.gradient.type,
      rotation: (design.cornersSquareOptions.gradient.rotation * Math.PI) / 180,
      colorStops: design.cornersSquareOptions.gradient.colorStops,
    };
  }

  // Corner Dot (Inner Eye Ball)
  const cornersDotOptions: Options['cornersDotOptions'] = {
    type: design.cornersDotOptions.type,
    color: design.cornersDotOptions.color,
  };

  if (
    design.cornersDotOptions.useGradient &&
    design.cornersDotOptions.gradient &&
    design.cornersDotOptions.gradient.colorStops.length > 0
  ) {
    cornersDotOptions.gradient = {
      type: design.cornersDotOptions.gradient.type,
      rotation: (design.cornersDotOptions.gradient.rotation * Math.PI) / 180,
      colorStops: design.cornersDotOptions.gradient.colorStops,
    };
  }

  // Background Options
  const backgroundOptions: Options['backgroundOptions'] = {
    color: design.backgroundOptions.isTransparent
      ? 'transparent'
      : design.backgroundOptions.color || '#FFFFFF',
  };

  // Image / Logo Options
  const imageOptions: Options['imageOptions'] = {
    hideBackgroundDots: design.imageOptions.hideBackgroundDots,
    imageSize: design.imageOptions.size,
    margin: design.imageOptions.margin,
    crossOrigin: 'anonymous',
  };

  const options: Options = {
    width: size,
    height: size,
    type: 'canvas',
    data: data || 'https://arsydian.com',
    margin: design.margin,
    qrOptions: {
      errorCorrectionLevel: design.errorCorrectionLevel,
    },
    dotsOptions,
    cornersSquareOptions,
    cornersDotOptions,
    backgroundOptions,
    imageOptions,
  };

  // Only assign image property if non-empty
  if (design.imageOptions.src && design.imageOptions.src.trim() !== '') {
    options.image = design.imageOptions.src;
  }

  return options;
}

/**
 * Creates a fresh QRCodeStyling instance with specified settings.
 * @param data The payload string.
 * @param design The styling configuration.
 * @param size Target resolution/size.
 * @returns Configured QRCodeStyling instance.
 */
export function createQrInstance(
  data: string,
  design: QrDesignConfig,
  size?: number
): QRCodeStyling {
  const options = buildQrOptions(data, design, size);
  return new QRCodeStyling(options);
}

/**
 * Exports and downloads a high-resolution QR code file (PNG, JPEG, SVG).
 *
 * @param data Payload data.
 * @param design Design configuration.
 * @param filename File download name without extension.
 * @param format Target format (png | jpeg | svg).
 * @param resolution Target resolution in pixels (e.g. 512, 1024, 2048, 4096).
 */
export async function downloadQrCode(
  data: string,
  design: QrDesignConfig,
  filename: string,
  format: ExportFormat,
  resolution: number
): Promise<void> {
  const exportInstance = createQrInstance(data, design, resolution);
  
  if (format === 'svg') {
    await exportInstance.download({
      name: filename || 'rsdn-qr-code',
      extension: 'svg',
    });
  } else {
    await exportInstance.download({
      name: filename || 'rsdn-qr-code',
      extension: format,
    });
  }
}

/**
 * Generates a Blob representation of the QR code for batch archiving.
 *
 * @param data Payload data.
 * @param design Design configuration.
 * @param format Target format.
 * @param resolution Target size in pixels.
 * @returns Promise resolving to a Blob.
 */
export async function getQrBlob(
  data: string,
  design: QrDesignConfig,
  format: ExportFormat,
  resolution: number = 1024
): Promise<Blob | null> {
  const exportInstance = createQrInstance(data, design, resolution);
  const raw = await exportInstance.getRawData(format === 'svg' ? 'svg' : format);
  if (!raw) return null;
  return raw as Blob;
}

/**
 * Copies the current QR code canvas directly to the system clipboard.
 *
 * @param data Payload data.
 * @param design Design configuration.
 * @returns Promise resolving when copied.
 */
export async function copyQrToClipboard(
  data: string,
  design: QrDesignConfig
): Promise<boolean> {
  try {
    const exportInstance = createQrInstance(data, design, 1024);
    const blob = (await exportInstance.getRawData('png')) as Blob | null;
    if (!blob) return false;

    // ClipboardItem API
    if (navigator.clipboard && window.ClipboardItem) {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to copy QR code to clipboard:', error);
    return false;
  }
}

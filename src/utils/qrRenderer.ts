/**
 * @file qrRenderer.ts
 * @description Wrapper and rendering utilities for `qr-code-styling`.
 * Bridges React UI state with canvas/SVG generation, high-res downloads,
 * clipboard copying, and batch processing.
 */

import QRCodeStyling, { Options } from 'qr-code-styling';
import { QrDesignConfig, ExportFormat } from '../types/qr';
import { toUtf8ByteString } from './qrEncoding';

/**
 * Pixel size of the live preview. Margins in the design config are expressed at this
 * size and scaled proportionally for exports, so every export matches the preview.
 */
export const PREVIEW_SIZE = 300;

/**
 * Transforms application design configuration into `qr-code-styling` Options object.
 * Strictly isolates gradients and image paths so reverting styles does not leave stale state.
 *
 * @param data The serialized QR payload string. Must be non-empty.
 * @param design Visual styling parameters.
 * @param targetSize Pixel dimension for rendering (e.g. 300 for preview, 2048 for export).
 * @param format Export format. JPEG has no transparency, so it always gets a solid background.
 * @returns Formatted Options object for QRCodeStyling.
 */
export function buildQrOptions(
  data: string,
  design: QrDesignConfig,
  targetSize?: number,
  format?: ExportFormat
): Options {
  const size = targetSize || PREVIEW_SIZE;
  const scale = size / PREVIEW_SIZE;

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

  // Background Options (a transparent JPEG would render with a black background)
  const transparent = design.backgroundOptions.isTransparent && format !== 'jpeg';
  const backgroundOptions: Options['backgroundOptions'] = {
    color: transparent ? 'transparent' : design.backgroundOptions.color || '#FFFFFF',
  };

  // Image / Logo Options
  const imageOptions: Options['imageOptions'] = {
    hideBackgroundDots: design.imageOptions.hideBackgroundDots,
    imageSize: design.imageOptions.size,
    margin: Math.round(design.imageOptions.margin * scale),
    crossOrigin: 'anonymous',
  };

  const options: Options = {
    width: size,
    height: size,
    type: 'canvas',
    data: toUtf8ByteString(data),
    margin: Math.round(design.margin * scale),
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
 * @param format Export format, if exporting.
 * @returns Configured QRCodeStyling instance.
 */
export function createQrInstance(
  data: string,
  design: QrDesignConfig,
  size?: number,
  format?: ExportFormat
): QRCodeStyling {
  const options = buildQrOptions(data, design, size, format);
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
  const exportInstance = createQrInstance(data, design, resolution, format);
  await exportInstance.download({
    name: filename || 'rsdn-qr-code',
    extension: format,
  });
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
  const exportInstance = createQrInstance(data, design, resolution, format);
  const raw = await exportInstance.getRawData(format);
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
  if (!navigator.clipboard?.write || typeof ClipboardItem === 'undefined') return false;
  try {
    // Hand the clipboard a Promise so the write starts synchronously inside the click.
    // Safari rejects clipboard writes that begin after an await.
    const blob = createQrInstance(data, design, 1024)
      .getRawData('png')
      .then((raw) => {
        if (!raw) throw new Error('Rendering produced no image');
        return raw as Blob;
      });
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    return true;
  } catch (error) {
    console.error('Failed to copy QR code to clipboard:', error);
    return false;
  }
}

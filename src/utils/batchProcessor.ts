/**
 * @file batchProcessor.ts
 * @description Processes CSV files, renders QR codes asynchronously using the active design,
 * and packages them into a compressed ZIP file using JSZip.
 */

import Papa from 'papaparse';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { BatchRow, BatchProgress } from '../types/batch';
import { QrDesignConfig, ExportFormat } from '../types/qr';
import { getQrBlob } from './qrRenderer';

/**
 * Parses raw CSV string or file content into rows with auto-detected columns.
 * @param csvText Raw text content of the CSV.
 * @returns Array of parsed BatchRows.
 */
export function parseCsvContent(csvText: string): {
  rows: BatchRow[];
  headers: string[];
} {
  const parsed = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  const headers = parsed.meta.fields || [];
  const rows: BatchRow[] = [];

  // Determine likely data and filename columns
  const dataColumn = headers.find((h) =>
    /url|link|data|text|content|qr/i.test(h)
  ) || headers[0] || '';

  const nameColumn = headers.find((h) =>
    /name|title|id|label|filename/i.test(h)
  ) || headers[1] || dataColumn;

  parsed.data.forEach((row, index) => {
    const rawData = (row[dataColumn] || '').trim();
    if (!rawData) return;

    let filename = (row[nameColumn] || `qr_code_${index + 1}`).trim();
    // Sanitize filename for operating system compatibility
    filename = filename.replace(/[^a-zA-Z0-9_\-\.]/g, '_');

    rows.push({
      id: `batch-${index + 1}`,
      data: rawData,
      filename,
      status: 'pending',
    });
  });

  return { rows, headers };
}

/**
 * Generates QR code images for all batch items and compiles them into a ZIP archive.
 *
 * @param rows Array of BatchRows.
 * @param design Active QR design configuration.
 * @param format Target format (png | jpeg | svg).
 * @param resolution Target pixel size for raster images.
 * @param onProgress Callback receiving progress updates.
 */
export async function processBatchZip(
  rows: BatchRow[],
  design: QrDesignConfig,
  format: ExportFormat,
  resolution: number,
  onProgress: (progress: BatchProgress) => void
): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder('rsdn_qr_codes') || zip;
  const total = rows.length;
  let completed = 0;
  let failed = 0;

  for (let i = 0; i < total; i++) {
    const row = rows[i];
    try {
      const blob = await getQrBlob(row.data, design, format, resolution);
      if (blob) {
        const ext = format === 'svg' ? 'svg' : format;
        const filename = `${row.filename || `qr_${i + 1}`}.${ext}`;
        folder.file(filename, blob);
        completed++;
      } else {
        failed++;
      }
    } catch (err) {
      console.error(`Failed to render batch item #${i + 1}:`, err);
      failed++;
    }

    onProgress({
      total,
      completed,
      failed,
      percentage: Math.round(((completed + failed) / total) * 100),
      isProcessing: true,
    });
  }

  // Generate and download ZIP
  const content = await zip.generateAsync({ type: 'blob' });
  const timestamp = new Date().toISOString().slice(0, 10);
  saveAs(content, `rsdn_qr_batch_${timestamp}.zip`);

  onProgress({
    total,
    completed,
    failed,
    percentage: 100,
    isProcessing: false,
  });
}

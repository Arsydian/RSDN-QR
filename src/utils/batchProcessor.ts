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
import { getQrCapacity } from './qrEncoding';

/** Parsed CSV: column names plus the remaining data rows. */
export interface ParsedCsv {
  headers: string[];
  records: string[][];
}

/**
 * Parses raw CSV text.
 * @param csvText Raw text content of the CSV.
 * @param hasHeader Whether the first row holds column names. Without one, columns are named "Column 1", "Column 2", ...
 * @returns Column names and data rows.
 */
export function parseCsv(csvText: string, hasHeader: boolean): ParsedCsv {
  const parsed = Papa.parse<string[]>(csvText.replace(/^﻿/, ''), { skipEmptyLines: 'greedy' });
  const rows = parsed.data;
  if (rows.length === 0) return { headers: [], records: [] };

  const width = Math.max(...rows.map((row) => row.length));
  const headerRow = hasHeader ? rows[0] : [];
  const seen = new Map<string, number>();
  const headers = Array.from({ length: width }, (_, i) => {
    const name = (headerRow[i] || '').trim() || `Column ${i + 1}`;
    const count = (seen.get(name) || 0) + 1;
    seen.set(name, count);
    return count > 1 ? `${name} (${count})` : name;
  });

  return { headers, records: hasHeader ? rows.slice(1) : rows };
}

/**
 * Guesses which columns hold the QR data and the file names.
 * @param headers Column names.
 * @returns Column indexes; `nameColumn` is -1 when no column looks like a name.
 */
export function guessColumns(headers: string[]): { dataColumn: number; nameColumn: number } {
  const dataIndex = headers.findIndex((h) => /url|link|data|text|content|qr/i.test(h));
  const dataColumn = dataIndex >= 0 ? dataIndex : 0;
  const nameColumn = headers.findIndex((h, i) => i !== dataColumn && /name|title|id|label|file/i.test(h));
  return { dataColumn, nameColumn };
}

const WINDOWS_RESERVED_NAMES = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i;

/**
 * Makes a value safe to use as a file name on Windows, macOS and Linux while keeping
 * letters from any language.
 * @param value Raw value from the CSV.
 * @returns Sanitized name, or '' if nothing usable is left.
 */
export function sanitizeFilename(value: string): string {
  let name = value
    .replace(/[\\/:*?"<>|\u0000-\u001F]/g, '_')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[. ]+$/, '')
    .slice(0, 100);
  if (WINDOWS_RESERVED_NAMES.test(name)) name = `_${name}`;
  return name;
}

/**
 * Builds the rows to generate from parsed CSV records.
 * Rows with an empty data cell are skipped; duplicate file names get a numeric suffix.
 *
 * @param records CSV data rows.
 * @param dataColumn Index of the column holding the QR payload.
 * @param nameColumn Index of the column holding file names, or -1 to number the files.
 * @returns Rows ready for generation.
 */
export function buildBatchRows(records: string[][], dataColumn: number, nameColumn: number): BatchRow[] {
  const used = new Set<string>();
  const rows: BatchRow[] = [];

  records.forEach((record, index) => {
    const data = (record[dataColumn] || '').trim();
    if (!data) return;

    const base = (nameColumn >= 0 && sanitizeFilename(record[nameColumn] || '')) || `qr_code_${index + 1}`;
    let filename = base;
    for (let n = 2; used.has(filename.toLowerCase()); n++) {
      filename = `${base}-${n}`;
    }
    used.add(filename.toLowerCase());

    rows.push({ id: `batch-${index + 1}`, data, filename, status: 'pending' });
  });

  return rows;
}

/** Result of a batch run. */
export interface BatchResult {
  completed: number;
  failed: number;
}

/**
 * Generates QR code images for all batch items and compiles them into a ZIP archive.
 *
 * @param rows Array of BatchRows.
 * @param design Active QR design configuration.
 * @param format Target format (png | jpeg | svg).
 * @param resolution Target pixel size for raster images.
 * @param onProgress Callback receiving progress updates.
 * @param onRowUpdate Callback receiving each row's final status.
 * @returns How many codes were generated and how many failed.
 * @throws If no code could be generated (nothing is downloaded in that case).
 */
export async function processBatchZip(
  rows: BatchRow[],
  design: QrDesignConfig,
  format: ExportFormat,
  resolution: number,
  onProgress: (progress: BatchProgress) => void,
  onRowUpdate: (row: BatchRow) => void = () => {}
): Promise<BatchResult> {
  const zip = new JSZip();
  const folder = zip.folder('rsdn_qr_codes') || zip;
  const total = rows.length;
  let completed = 0;
  let failed = 0;

  for (let i = 0; i < total; i++) {
    const row = rows[i];
    try {
      const capacity = getQrCapacity(row.data, design.errorCorrectionLevel);
      if (!capacity.fits) {
        throw new Error(`Too much content (${capacity.used} of ${capacity.max} ${capacity.unit})`);
      }
      const blob = await getQrBlob(row.data, design, format, resolution);
      if (!blob) throw new Error('Rendering produced no image');
      folder.file(`${row.filename}.${format}`, blob);
      completed++;
      onRowUpdate({ ...row, status: 'done' });
    } catch (err) {
      console.error(`Failed to render batch item #${i + 1}:`, err);
      failed++;
      onRowUpdate({ ...row, status: 'error', errorMessage: err instanceof Error ? err.message : 'Rendering failed' });
    }

    onProgress({
      total,
      completed,
      failed,
      percentage: Math.round(((completed + failed) / total) * 100),
      isProcessing: true,
    });
  }

  if (completed === 0) {
    onProgress({ total, completed, failed, percentage: 100, isProcessing: false });
    throw new Error('None of the codes could be generated.');
  }

  // Generate and download ZIP (DEFLATE shrinks SVGs a lot; PNG/JPEG are already compressed)
  const content = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
  const timestamp = new Date().toISOString().slice(0, 10);
  saveAs(content, `rsdn_qr_batch_${timestamp}.zip`);

  onProgress({
    total,
    completed,
    failed,
    percentage: 100,
    isProcessing: false,
  });

  return { completed, failed };
}

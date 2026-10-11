/**
 * @file batchProcessor.test.ts
 * @description Unit tests for CSV parsing, column mapping, file naming and batch ZIP generation.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import JSZip from 'jszip';
import { QrDesignConfig } from '../types/qr';

vi.mock('../utils/qrRenderer', () => ({
  // Highly compressible stand-in image, so the test can tell whether the ZIP is compressed
  getQrBlob: vi.fn(async (data: string) => new Blob([`qr:${data}`, ' '.repeat(50_000)], { type: 'image/png' })),
}));
vi.mock('file-saver', () => ({ saveAs: vi.fn() }));

import { saveAs } from 'file-saver';
import { parseCsv, guessColumns, sanitizeFilename, buildBatchRows, processBatchZip } from '../utils/batchProcessor';

const design = {
  margin: 12,
  errorCorrectionLevel: 'M',
  dotsOptions: { type: 'square', color: '#000', useGradient: false },
  cornersSquareOptions: { type: 'square', color: '#000', useGradient: false },
  cornersDotOptions: { type: 'square', color: '#000', useGradient: false },
  backgroundOptions: { color: '#FFF', isTransparent: false },
  imageOptions: { src: '', size: 0.2, margin: 4, hideBackgroundDots: true },
} as QrDesignConfig;

describe('parseCsv', () => {
  it('reads headers and data rows, ignoring a BOM and blank lines', () => {
    const { headers, records } = parseCsv('﻿name,url\n\nHome,https://a.com\n', true);
    expect(headers).toEqual(['name', 'url']);
    expect(records).toEqual([['Home', 'https://a.com']]);
  });

  it('keeps the first row as data when there is no header', () => {
    const { headers, records } = parseCsv('https://a.com,Home\nhttps://b.com,Away', false);
    expect(headers).toEqual(['Column 1', 'Column 2']);
    expect(records).toHaveLength(2);
  });

  it('names blank and duplicate headers', () => {
    expect(parseCsv('url,,url\n1,2,3', true).headers).toEqual(['url', 'Column 2', 'url (2)']);
  });
});

describe('guessColumns', () => {
  it('finds data and name columns by header name', () => {
    expect(guessColumns(['id', 'website', 'notes'])).toEqual({ dataColumn: 0, nameColumn: -1 });
    expect(guessColumns(['name', 'url'])).toEqual({ dataColumn: 1, nameColumn: 0 });
  });
});

describe('sanitizeFilename', () => {
  it('keeps letters from any language and removes unsafe characters', () => {
    expect(sanitizeFilename('Café Zürich')).toBe('Café Zürich');
    expect(sanitizeFilename('東京 オフィス')).toBe('東京 オフィス');
    expect(sanitizeFilename('a/b:c*d?')).toBe('a_b_c_d_');
    expect(sanitizeFilename('report.')).toBe('report');
    expect(sanitizeFilename('CON')).toBe('_CON');
  });
});

describe('buildBatchRows', () => {
  it('uses the selected columns, skips empty data, and de-duplicates names', () => {
    const records = [
      ['Office', 'https://a.com'],
      ['Office', 'https://b.com'],
      ['office', 'https://c.com'],
      ['Empty', ''],
      ['', 'https://d.com'],
    ];
    const rows = buildBatchRows(records, 1, 0);
    expect(rows.map((r) => [r.filename, r.data])).toEqual([
      ['Office', 'https://a.com'],
      ['Office-2', 'https://b.com'],
      ['office-3', 'https://c.com'],
      ['qr_code_5', 'https://d.com'],
    ]);
  });

  it('honours a different data column choice', () => {
    expect(buildBatchRows([['1', 'https://a.com']], 0, -1)[0]).toMatchObject({ data: '1', filename: 'qr_code_1' });
  });
});

describe('processBatchZip', () => {
  beforeEach(() => vi.mocked(saveAs).mockClear());

  it('zips every code with compression and reports rows that are too long', async () => {
    const rows = buildBatchRows([['ok', 'https://a.com'], ['big', 'x'.repeat(3000)]], 1, 0);
    const updates: string[] = [];
    const result = await processBatchZip(rows, design, 'png', 512, () => {}, (row) => updates.push(`${row.filename}:${row.status}`));

    expect(result).toEqual({ completed: 1, failed: 1 });
    expect(updates).toEqual(['ok:done', 'big:error']);

    const zipBlob = vi.mocked(saveAs).mock.calls[0][0] as Blob;
    expect(zipBlob.size).toBeLessThan(5_000); // 50 KB of image data, DEFLATE-compressed
    const zip = await JSZip.loadAsync(zipBlob);
    expect(Object.keys(zip.files)).toContain('rsdn_qr_codes/ok.png');
    expect(Object.keys(zip.files)).not.toContain('rsdn_qr_codes/big.png');
  });

  it('downloads nothing and throws when every code fails', async () => {
    const rows = buildBatchRows([['big', 'x'.repeat(3000)]], 1, 0);
    const progress = vi.fn();
    await expect(processBatchZip(rows, design, 'png', 512, progress)).rejects.toThrow();
    expect(saveAs).not.toHaveBeenCalled();
    expect(progress).toHaveBeenLastCalledWith(expect.objectContaining({ isProcessing: false }));
  });
});

/**
 * @file BatchTab.tsx
 * @description Batch CSV upload and QR code generation tab.
 * Allows users to upload a spreadsheet of URLs or text, preview records,
 * map columns, apply the current design styling, and download a bundled ZIP archive.
 */

import React, { useState, useRef } from 'react';
import {
  FileSpreadsheet,
  Download,
  Layers,
  Sparkles,
  FileText,
} from 'lucide-react';
import { QrDesignConfig, ExportFormat, ExportResolution } from '../../types/qr';
import { BatchRow, BatchProgress } from '../../types/batch';
import { parseCsvContent, processBatchZip } from '../../utils/batchProcessor';

interface BatchTabProps {
  design: QrDesignConfig;
}

const SAMPLE_CSV = `name,url,category
Arsydian Homepage,https://arsydian.com,Website
IT Security Services,https://arsydian.com/#security,Services
Network Design,https://arsydian.com/#networks,Services
Client Portal,https://arsydian.com/portal,Internal
Contact Team,https://arsydian.com/#contact,Support`;

export const BatchTab: React.FC<BatchTabProps> = ({ design }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [rows, setRows] = useState<BatchRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [dataCol, setDataCol] = useState<string>('');
  const [nameCol, setNameCol] = useState<string>('');
  const [format, setFormat] = useState<ExportFormat>('png');
  const [resolution, setResolution] = useState<ExportResolution>(1024);
  const [progress, setProgress] = useState<BatchProgress | null>(null);

  // Parse uploaded file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsed = parseCsvContent(text);
      setHeaders(parsed.headers);
      setRows(parsed.rows);
      if (parsed.headers.length > 0) {
        setDataCol(parsed.headers.find(h => /url|link|data/i.test(h)) || parsed.headers[0]);
        setNameCol(parsed.headers.find(h => /name|title|id/i.test(h)) || parsed.headers[0]);
      }
    };
    reader.readAsText(file);
  };

  // Load sample dataset
  const handleLoadSample = () => {
    const parsed = parseCsvContent(SAMPLE_CSV);
    setHeaders(parsed.headers);
    setRows(parsed.rows);
    setDataCol('url');
    setNameCol('name');
  };

  // Trigger batch generation
  const handleStartBatch = async () => {
    if (rows.length === 0) return;
    setProgress({
      total: rows.length,
      completed: 0,
      failed: 0,
      percentage: 0,
      isProcessing: true,
    });

    try {
      await processBatchZip(rows, design, format, resolution, (p) => {
        setProgress({ ...p });
      });
    } catch (err) {
      console.error('Batch generation failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Introduction Card */}
      <div className="ars-card p-6 bg-gradient-to-r from-ars-white to-ars-grey-50 border-ars-grey-200">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-ars-black text-ars-red flex items-center justify-center shrink-0 shadow-ars-xs">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-base text-ars-black">
              High-Volume Batch QR Generator
            </h2>
            <p className="text-xs text-ars-grey-600 mt-1 leading-relaxed">
              Upload a CSV spreadsheet with URLs, codes, or contact payloads. RSDN-QR will apply your active design styling, generate each code in the browser, and compress them into a ready-to-use <code className="font-mono bg-ars-grey-200 px-1 py-0.5 rounded text-ars-black">.zip</code> archive.
            </p>
          </div>
        </div>
      </div>

      {/* Upload & Setup Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Upload Box */}
        <div className="ars-card p-5 space-y-4">
          <label className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink">
            Step 1: Upload CSV Spreadsheet
          </label>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-ars-grey-200 hover:border-ars-red bg-ars-white hover:bg-ars-grey-50 rounded-lg p-6 text-center cursor-pointer transition-all group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <FileSpreadsheet className="w-8 h-8 text-ars-grey-400 group-hover:text-ars-red mx-auto mb-2 transition-colors" />
            <p className="font-display font-semibold text-xs text-ars-ink">
              Drop CSV file here or click to browse
            </p>
            <p className="text-[11px] text-ars-grey-600 mt-0.5">
              Supports standard UTF-8 CSV exports from Excel, Google Sheets, or Airtable
            </p>
          </div>

          {headers.length > 1 && (
            <div className="grid grid-cols-2 gap-3 pt-1 border-t border-ars-grey-100">
              <div>
                <span className="block text-[11px] font-display font-semibold text-ars-grey-600 mb-1">
                  Data Column:
                </span>
                <select
                  value={dataCol}
                  onChange={(e) => setDataCol(e.target.value)}
                  className="w-full text-xs p-2 bg-ars-grey-50 border border-ars-grey-200 rounded-lg text-ars-ink"
                >
                  {headers.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>

              <div>
                <span className="block text-[11px] font-display font-semibold text-ars-grey-600 mb-1">
                  Filename Column:
                </span>
                <select
                  value={nameCol}
                  onChange={(e) => setNameCol(e.target.value)}
                  className="w-full text-xs p-2 bg-ars-grey-50 border border-ars-grey-200 rounded-lg text-ars-ink"
                >
                  {headers.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-ars-grey-600">Want to test it out first?</span>
            <button
              type="button"
              onClick={handleLoadSample}
              className="text-xs font-display font-semibold text-ars-red hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Load Example Dataset
            </button>
          </div>
        </div>

        {/* Export Options for Batch */}
        <div className="ars-card p-5 space-y-4">
          <label className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink">
            Step 2: Output Format &amp; Resolution
          </label>

          <div>
            <span className="block text-[11px] font-display font-medium text-ars-grey-600 mb-1.5">
              File Format
            </span>
            <div className="grid grid-cols-3 gap-2">
              {(['png', 'svg', 'jpeg'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFormat(f)}
                  className={`py-2 px-3 rounded-lg border text-center font-display font-bold text-xs uppercase transition-all ${
                    format === f
                      ? 'bg-ars-black text-white border-ars-black shadow-ars-xs'
                      : 'bg-ars-white text-ars-ink border-ars-grey-200 hover:border-ars-red'
                  }`}
                >
                  .{f}
                </button>
              ))}
            </div>
          </div>

          {format !== 'svg' && (
            <div>
              <span className="block text-[11px] font-display font-medium text-ars-grey-600 mb-1.5">
                Pixel Resolution
              </span>
              <div className="grid grid-cols-3 gap-2">
                {([512, 1024, 2048] as const).map((res) => (
                  <button
                    key={res}
                    type="button"
                    onClick={() => setResolution(res)}
                    className={`py-2 px-3 rounded-lg border text-center font-mono text-xs font-semibold transition-all ${
                      resolution === res
                        ? 'bg-ars-black text-white border-ars-black shadow-ars-xs'
                        : 'bg-ars-white text-ars-ink border-ars-grey-200 hover:border-ars-red'
                    }`}
                  >
                    {res}px
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="button"
              onClick={handleStartBatch}
              disabled={rows.length === 0 || progress?.isProcessing}
              className="w-full py-3 px-4 rounded-lg bg-ars-red hover:bg-ars-red-600 text-white font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-ars-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              <span>
                {progress?.isProcessing
                  ? `Rendering ${progress.completed}/${progress.total}...`
                  : `Generate & Download ZIP (${rows.length} Codes)`}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar (Visible while generating) */}
      {progress && progress.isProcessing && (
        <div className="ars-card p-4 space-y-2 border-ars-red bg-ars-red-50">
          <div className="flex items-center justify-between text-xs font-display font-bold text-ars-ink">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-ars-red animate-ping" />
              Generating Batch Archive...
            </span>
            <span className="font-mono text-ars-red">
              {progress.completed} of {progress.total} ({progress.percentage}%)
            </span>
          </div>
          <div className="w-full bg-ars-grey-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-ars-red transition-all duration-150"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Preview Table */}
      {rows.length > 0 && (
        <div className="ars-card overflow-hidden">
          <div className="p-4 border-b border-ars-grey-200 bg-ars-grey-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-ars-red" />
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-ars-ink">
                Loaded Records ({rows.length} items)
              </h3>
            </div>
            <span className="ars-badge bg-ars-grey-100 text-ars-grey-600">
              Style: {design.dotsOptions.type} · EC: {design.errorCorrectionLevel}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-ars-grey-100/60 text-ars-grey-600 font-display font-semibold uppercase text-[10px] tracking-wider border-b border-ars-grey-200">
                <tr>
                  <th className="p-3 w-12 text-center">#</th>
                  <th className="p-3">Filename</th>
                  <th className="p-3">QR Data Payload</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ars-grey-100">
                {rows.slice(0, 10).map((row, idx) => (
                  <tr key={row.id} className="hover:bg-ars-grey-50 transition-colors">
                    <td className="p-3 font-mono text-ars-grey-400 text-center">{idx + 1}</td>
                    <td className="p-3 font-display font-bold text-ars-ink">{row.filename}</td>
                    <td className="p-3 font-mono text-ars-grey-600 max-w-md truncate">
                      {row.data}
                    </td>
                    <td className="p-3 text-right">
                      <span className="ars-badge bg-ars-grey-100 text-ars-grey-600">
                        Ready
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {rows.length > 10 && (
            <div className="p-3 bg-ars-grey-50 text-center text-xs text-ars-grey-600 border-t border-ars-grey-200 font-mono">
              + {rows.length - 10} more records ready in batch
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * @file BatchTab.tsx
 * @description Batch CSV upload and QR code generation tab.
 * Allows users to upload (or drop) a spreadsheet of URLs or text, preview records,
 * map columns, apply the current design styling, and download a bundled ZIP archive.
 */

import React, { useState, useRef, useMemo, useEffect, useId } from 'react';
import {
  FileSpreadsheet,
  Download,
  Layers,
  Sparkles,
  FileText,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { QrDesignConfig, ExportFormat, ExportResolution } from '../../types/qr';
import { BatchRow, BatchProgress } from '../../types/batch';
import { parseCsv, guessColumns, buildBatchRows, processBatchZip } from '../../utils/batchProcessor';

interface BatchTabProps {
  design: QrDesignConfig;
}

const SAMPLE_CSV = `name,url,category
Arsydian Homepage,https://arsydian.com,Website
Arsydian Services,https://arsydian.com/#services,Services
About Arsydian,https://arsydian.com/#about,Company
Contact Arsydian,https://arsydian.com/#contact,Support
Pay an Invoice,https://pay.arsydian.com,Billing`;

const MAX_FILE_BYTES = 10 * 1024 * 1024;

export const BatchTab: React.FC<BatchTabProps> = ({ design }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const idPrefix = useId();

  const [csvText, setCsvText] = useState('');
  const [sourceName, setSourceName] = useState('');
  const [hasHeader, setHasHeader] = useState(true);
  const [dataCol, setDataCol] = useState(0);
  const [nameCol, setNameCol] = useState(-1);
  const [format, setFormat] = useState<ExportFormat>('png');
  const [resolution, setResolution] = useState<ExportResolution>(1024);
  const [progress, setProgress] = useState<BatchProgress | null>(null);
  const [rowResults, setRowResults] = useState<Record<string, BatchRow>>({});
  const [errorMessage, setErrorMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const csv = useMemo(() => parseCsv(csvText, hasHeader), [csvText, hasHeader]);
  const rows = useMemo(() => buildBatchRows(csv.records, dataCol, nameCol), [csv, dataCol, nameCol]);
  const isProcessing = Boolean(progress?.isProcessing);

  // Re-detect columns whenever a new file is loaded or the header setting changes
  useEffect(() => {
    const guess = guessColumns(csv.headers);
    setDataCol(guess.dataColumn);
    setNameCol(guess.nameColumn);
  }, [csv.headers]);

  // Results belong to a specific set of rows; clear them when the rows change
  useEffect(() => {
    setRowResults({});
    setProgress(null);
  }, [rows]);

  // Dropping a file anywhere else on the page would make the browser open it and lose the session
  useEffect(() => {
    const preventFileDrop = (e: DragEvent) => {
      if (e.dataTransfer?.types.includes('Files')) e.preventDefault();
    };
    window.addEventListener('dragover', preventFileDrop);
    window.addEventListener('drop', preventFileDrop);
    return () => {
      window.removeEventListener('dragover', preventFileDrop);
      window.removeEventListener('drop', preventFileDrop);
    };
  }, []);

  const loadFile = (file: File) => {
    setErrorMessage('');
    if (!/\.(csv|txt)$/i.test(file.name) && !/csv|text\/plain/.test(file.type)) {
      setErrorMessage(`"${file.name}" isn't a CSV file. Export your spreadsheet as CSV and try again.`);
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setErrorMessage('That file is larger than 10 MB. Split it into smaller batches.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setCsvText((event.target?.result as string) || '');
      setSourceName(file.name);
    };
    reader.onerror = () => setErrorMessage(`"${file.name}" couldn't be read.`);
    reader.readAsText(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) loadFile(file);
  };

  // Load sample dataset
  const handleLoadSample = () => {
    setErrorMessage('');
    setHasHeader(true);
    setCsvText(SAMPLE_CSV);
    setSourceName('Example dataset');
  };

  // Trigger batch generation
  const handleStartBatch = async () => {
    if (rows.length === 0 || isProcessing) return;
    setErrorMessage('');
    setRowResults({});
    setProgress({ total: rows.length, completed: 0, failed: 0, percentage: 0, isProcessing: true });

    try {
      await processBatchZip(
        rows,
        design,
        format,
        resolution,
        (p) => setProgress({ ...p }),
        (row) => setRowResults((prev) => ({ ...prev, [row.id]: row }))
      );
    } catch (err) {
      console.error('Batch generation failed:', err);
      setErrorMessage(err instanceof Error ? err.message : 'Batch generation failed.');
      setProgress((prev) => (prev ? { ...prev, isProcessing: false } : null));
    }
  };

  const failedRows = rows.filter((row) => rowResults[row.id]?.status === 'error');
  const isFinished = Boolean(progress && !progress.isProcessing && Object.keys(rowResults).length > 0);

  const optionButtonClass = (selected: boolean) =>
    `py-2 px-3 rounded-lg border text-center text-xs transition-all ${
      selected
        ? 'bg-ars-black text-white border-ars-black shadow-ars-xs'
        : 'bg-ars-white text-ars-ink border-ars-grey-200 hover:border-ars-red'
    }`;

  return (
    <div className="space-y-6">
      {/* Introduction Card */}
      <div className="ars-card p-6 bg-linear-to-r from-ars-white to-ars-grey-50 border-ars-grey-200">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-ars-black text-ars-red flex items-center justify-center shrink-0 shadow-ars-xs">
            <Layers className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-display font-bold text-base text-ars-black">
              High-Volume Batch QR Generator
            </h2>
            <p className="text-xs text-ars-grey-600 mt-1 leading-relaxed">
              Upload a CSV spreadsheet with URLs, codes, or contact payloads. RSDN-QR will apply your active design styling, generate each code in the browser, and compress them into a ready-to-use <code className="font-mono bg-ars-grey-200 px-1 py-0.5 rounded-sm text-ars-black">.zip</code> archive.
            </p>
          </div>
        </div>
      </div>

      {/* Upload & Setup Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Upload Box */}
        <div className="ars-card p-5 space-y-4">
          <h3 className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink">
            Step 1: Upload CSV Spreadsheet
          </h3>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`w-full border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all group ${
              isDragging
                ? 'border-ars-red bg-ars-red-50'
                : 'border-ars-grey-200 hover:border-ars-red bg-ars-white hover:bg-ars-grey-50'
            }`}
          >
            <FileSpreadsheet className="w-8 h-8 text-ars-grey-400 group-hover:text-ars-red mx-auto mb-2 transition-colors" aria-hidden="true" />
            <span className="block font-display font-semibold text-xs text-ars-ink">
              {sourceName ? `Loaded: ${sourceName} — drop or click to replace` : 'Drop CSV file here or click to browse'}
            </span>
            <span className="block text-[11px] text-ars-grey-600 mt-0.5">
              Supports standard UTF-8 CSV exports from Excel, Google Sheets, or Airtable
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileInput}
            className="hidden"
            aria-hidden="true"
            tabIndex={-1}
          />

          {csv.headers.length > 0 && (
            <div className="space-y-3 pt-1 border-t border-ars-grey-100">
              <label className="flex items-center gap-2 pt-3 text-xs text-ars-ink cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasHeader}
                  onChange={(e) => setHasHeader(e.target.checked)}
                  className="accent-ars-red"
                />
                First row contains column names
              </label>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor={`${idPrefix}-data`} className="block text-[11px] font-display font-semibold text-ars-grey-600 mb-1">
                    Data Column:
                  </label>
                  <select
                    id={`${idPrefix}-data`}
                    value={dataCol}
                    onChange={(e) => setDataCol(Number(e.target.value))}
                    className="w-full text-xs p-2 bg-ars-grey-50 border border-ars-grey-200 rounded-lg text-ars-ink"
                  >
                    {csv.headers.map((h, i) => (
                      <option key={h} value={i}>{h}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor={`${idPrefix}-name`} className="block text-[11px] font-display font-semibold text-ars-grey-600 mb-1">
                    Filename Column:
                  </label>
                  <select
                    id={`${idPrefix}-name`}
                    value={nameCol}
                    onChange={(e) => setNameCol(Number(e.target.value))}
                    className="w-full text-xs p-2 bg-ars-grey-50 border border-ars-grey-200 rounded-lg text-ars-ink"
                  >
                    <option value={-1}>None (number the files)</option>
                    {csv.headers.map((h, i) => (
                      <option key={h} value={i}>{h}</option>
                    ))}
                  </select>
                </div>
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
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              Load Example Dataset
            </button>
          </div>
        </div>

        {/* Export Options for Batch */}
        <div className="ars-card p-5 space-y-4">
          <h3 className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink">
            Step 2: Output Format &amp; Resolution
          </h3>

          <div>
            <span id={`${idPrefix}-format`} className="block text-[11px] font-display font-medium text-ars-grey-600 mb-1.5">
              File Format
            </span>
            <div className="grid grid-cols-3 gap-2" role="group" aria-labelledby={`${idPrefix}-format`}>
              {(['png', 'svg', 'jpeg'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFormat(f)}
                  aria-pressed={format === f}
                  className={`${optionButtonClass(format === f)} font-display font-bold uppercase`}
                >
                  .{f}
                </button>
              ))}
            </div>
            {format === 'jpeg' && design.backgroundOptions.isTransparent && (
              <p className="mt-2 text-[11px] text-ars-grey-600">
                JPEG can&apos;t be transparent, so these files will use a solid background.
              </p>
            )}
          </div>

          {format !== 'svg' && (
            <div>
              <span id={`${idPrefix}-resolution`} className="block text-[11px] font-display font-medium text-ars-grey-600 mb-1.5">
                Pixel Resolution
              </span>
              <div className="grid grid-cols-3 gap-2" role="group" aria-labelledby={`${idPrefix}-resolution`}>
                {([512, 1024, 2048] as const).map((res) => (
                  <button
                    key={res}
                    type="button"
                    onClick={() => setResolution(res)}
                    aria-pressed={resolution === res}
                    className={`${optionButtonClass(resolution === res)} font-mono font-semibold`}
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
              disabled={rows.length === 0 || isProcessing}
              className="w-full py-3 px-4 rounded-lg bg-ars-red hover:bg-ars-red-600 text-white font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-ars-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              <span>
                {isProcessing && progress
                  ? `Rendering ${progress.completed + progress.failed}/${progress.total}...`
                  : `Generate & Download ZIP (${rows.length} Codes)`}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Errors and results */}
      <div aria-live="polite" className="space-y-3">
        {errorMessage && (
          <div className="ars-card p-4 border-ars-red bg-ars-red-50 flex items-start gap-2 text-xs text-ars-ink" role="alert">
            <AlertTriangle className="w-4 h-4 text-ars-red shrink-0" aria-hidden="true" />
            <span>{errorMessage}</span>
          </div>
        )}

        {isFinished && progress && progress.completed > 0 && (
          <div className="ars-card p-4 space-y-2 text-xs text-ars-ink">
            <div className="flex items-center gap-2 font-display font-bold">
              <CheckCircle2 className="w-4 h-4 text-ars-success" aria-hidden="true" />
              Downloaded {progress.completed} of {progress.total} codes.
            </div>
            {failedRows.length > 0 && (
              <div>
                <p className="text-ars-grey-600">{failedRows.length} could not be generated and were left out:</p>
                <ul className="mt-1 space-y-0.5 font-mono text-[11px] text-ars-grey-600">
                  {failedRows.slice(0, 20).map((row) => (
                    <li key={row.id}>
                      {row.filename}: {rowResults[row.id]?.errorMessage}
                    </li>
                  ))}
                  {failedRows.length > 20 && <li>…and {failedRows.length - 20} more</li>}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Progress Bar (Visible while generating) */}
      {progress && progress.isProcessing && (
        <div className="ars-card p-4 space-y-2 border-ars-red bg-ars-red-50">
          <div className="flex items-center justify-between text-xs font-display font-bold text-ars-ink">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-ars-red animate-ping" aria-hidden="true" />
              Generating Batch Archive...
            </span>
            <span className="font-mono text-ars-red">
              {progress.completed + progress.failed} of {progress.total} ({progress.percentage}%)
            </span>
          </div>
          <div
            className="w-full bg-ars-grey-200 rounded-full h-2 overflow-hidden"
            role="progressbar"
            aria-label="Batch progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress.percentage}
          >
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
              <FileText className="w-4 h-4 text-ars-red" aria-hidden="true" />
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
                  <th scope="col" className="p-3 w-12 text-center">#</th>
                  <th scope="col" className="p-3">Filename</th>
                  <th scope="col" className="p-3">QR Data Payload</th>
                  <th scope="col" className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ars-grey-100">
                {rows.slice(0, 10).map((row, idx) => {
                  const result = rowResults[row.id];
                  return (
                    <tr key={row.id} className="hover:bg-ars-grey-50 transition-colors">
                      <td className="p-3 font-mono text-ars-grey-600 text-center">{idx + 1}</td>
                      <td className="p-3 font-display font-bold text-ars-ink">{row.filename}.{format}</td>
                      <td className="p-3 font-mono text-ars-grey-600 max-w-md truncate">
                        {row.data}
                      </td>
                      <td className="p-3 text-right">
                        {result?.status === 'done' ? (
                          <span className="ars-badge bg-emerald-50 text-emerald-700">Done</span>
                        ) : result?.status === 'error' ? (
                          <span className="ars-badge bg-red-50 text-red-700" title={result.errorMessage}>Failed</span>
                        ) : (
                          <span className="ars-badge bg-ars-grey-100 text-ars-grey-600">Ready</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
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

/**
 * @file batch.ts
 * @description Type definitions for batch CSV QR code generation and ZIP export.
 */

/** Single row extracted from CSV */
export interface BatchRow {
  id: string;
  data: string;
  filename: string;
  status: 'pending' | 'processing' | 'done' | 'error';
  errorMessage?: string;
}

/** Progress tracker for batch rendering */
export interface BatchProgress {
  total: number;
  completed: number;
  failed: number;
  percentage: number;
  isProcessing: boolean;
}

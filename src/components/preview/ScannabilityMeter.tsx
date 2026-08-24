/**
 * @file ScannabilityMeter.tsx
 * @description Real-time Scannability Health Meter with WCAG contrast badges,
 * logo occlusion safety meters, and actionable readability recommendations.
 */

import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  ScanLine,
} from 'lucide-react';
import { ScannabilityResult, HealthRating } from '../../types/qr';

interface ScannabilityMeterProps {
  report: ScannabilityResult;
}

export const ScannabilityMeter: React.FC<ScannabilityMeterProps> = ({ report }) => {
  const getRatingBadge = (rating: HealthRating) => {
    switch (rating) {
      case 'excellent':
        return (
          <span className="ars-badge bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Excellent Scannability
          </span>
        );
      case 'good':
        return (
          <span className="ars-badge bg-blue-50 text-blue-700 border border-blue-200">
            <ShieldCheck className="w-3 h-3" /> Good Readability
          </span>
        );
      case 'warning':
        return (
          <span className="ars-badge bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3 h-3" /> Potential Scan Issues
          </span>
        );
      case 'critical':
        return (
          <span className="ars-badge bg-red-50 text-red-700 border border-red-200">
            <ShieldAlert className="w-3 h-3" /> Critical: Unreadable
          </span>
        );
    }
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-500';
    if (score >= 75) return 'bg-blue-500';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-ars-red';
  };

  return (
    <div className="ars-card p-4 space-y-3.5">
      {/* Header & Score */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ScanLine className="w-4 h-4 text-ars-red" />
          <span className="font-display font-bold text-xs uppercase tracking-wider text-ars-ink">
            Camera Scannability Health
          </span>
        </div>
        <div className="flex items-center gap-2">
          {getRatingBadge(report.rating)}
          <span className="font-mono font-bold text-sm text-ars-ink">
            {report.score}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-ars-grey-100 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${getScoreBarColor(report.score)}`}
          style={{ width: `${report.score}%` }}
        />
      </div>

      {/* Key Metrics Breakdown */}
      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-ars-grey-100 text-center">
        <div className="bg-ars-grey-50 p-2 rounded-md border border-ars-grey-200">
          <div className="text-[10px] font-display font-semibold text-ars-grey-600 uppercase">
            Contrast
          </div>
          <div className="font-mono font-bold text-xs text-ars-ink mt-0.5">
            {report.contrastRatio}:1
          </div>
          <div className="text-[9px] text-ars-grey-600">
            {report.contrastPass ? 'WCAG Pass' : 'Low Contrast'}
          </div>
        </div>

        <div className="bg-ars-grey-50 p-2 rounded-md border border-ars-grey-200">
          <div className="text-[10px] font-display font-semibold text-ars-grey-600 uppercase">
            Logo Area
          </div>
          <div className="font-mono font-bold text-xs text-ars-ink mt-0.5">
            {report.logoOcclusionPercent > 0 ? `~${report.logoOcclusionPercent}%` : 'None'}
          </div>
          <div className="text-[9px] text-ars-grey-600">
            {report.logoSafe ? 'Safe Overlay' : 'Exceeds EC'}
          </div>
        </div>

        <div className="bg-ars-grey-50 p-2 rounded-md border border-ars-grey-200">
          <div className="text-[10px] font-display font-semibold text-ars-grey-600 uppercase">
            Payload Size
          </div>
          <div className="font-mono font-bold text-xs text-ars-ink mt-0.5">
            {report.characterCount} <span className="font-sans font-normal text-[10px]">chars</span>
          </div>
          <div className="text-[9px] text-ars-grey-600">
            {report.dataDensitySafe ? 'Optimal Density' : 'High Density'}
          </div>
        </div>
      </div>

      {/* Recommendations & Live Warnings */}
      {report.recommendations.length > 0 && (
        <div className="space-y-1.5 pt-1">
          {report.recommendations.map((rec, idx) => (
            <div
              key={idx}
              className={`text-xs p-2 rounded-md flex items-start gap-2 ${
                rec.startsWith('Critical')
                  ? 'bg-red-50 text-red-800 border border-red-200'
                  : rec.startsWith('Warning')
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'bg-ars-grey-50 text-ars-grey-600 border border-ars-grey-200'
              }`}
            >
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-current" />
              <span className="leading-snug">{rec}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

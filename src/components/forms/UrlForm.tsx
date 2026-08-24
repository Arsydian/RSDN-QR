/**
 * @file UrlForm.tsx
 * @description Form input for Website / Link QR codes.
 */

import React from 'react';
import { Globe, ExternalLink } from 'lucide-react';
import { UrlPayload } from '../../types/qr';

interface UrlFormProps {
  data: UrlPayload;
  onChange: (data: UrlPayload) => void;
}

export const UrlForm: React.FC<UrlFormProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5 flex items-center justify-between">
          <span>Website URL</span>
          <span className="text-[11px] font-mono font-normal text-ars-grey-600">e.g. arsydian.com</span>
        </label>
        <div className="relative rounded-lg shadow-ars-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ars-grey-400">
            <Globe className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={data.url}
            onChange={(e) => onChange({ ...data, url: e.target.value })}
            placeholder="https://yourwebsite.com/landing"
            className="block w-full pl-9 pr-3 py-2.5 text-sm bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-ars-grey-400 focus:border-ars-red transition-all font-sans"
          />
        </div>
      </div>

      <div className="bg-ars-grey-50 border border-ars-grey-200 rounded-lg p-3 text-xs text-ars-grey-600 flex items-start gap-2">
        <ExternalLink className="w-4 h-4 text-ars-red shrink-0 mt-0.5" />
        <span>
          If you omit <code className="font-mono text-ars-ink">https://</code>, it will be automatically prefixed so cameras open your website directly.
        </span>
      </div>
    </div>
  );
};

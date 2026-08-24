/**
 * @file TextForm.tsx
 * @description Form input for Plain Text QR codes.
 */

import React from 'react';
import { TextPayload } from '../../types/qr';

interface TextFormProps {
  data: TextPayload;
  onChange: (data: TextPayload) => void;
}

export const TextForm: React.FC<TextFormProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5 flex items-center justify-between">
          <span>Plain Text / Raw Message</span>
          <span className="text-[11px] font-mono text-ars-grey-600">
            {data.text.length} characters
          </span>
        </label>
        <textarea
          rows={5}
          value={data.text}
          onChange={(e) => onChange({ ...data, text: e.target.value })}
          placeholder="Enter any text, instructions, serial codes, or formatted markdown..."
          className="block w-full p-3 text-sm bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-ars-grey-400 focus:border-ars-red transition-all font-sans resize-y"
        />
      </div>
    </div>
  );
};

/**
 * @file SmsForm.tsx
 * @description Form input for SMS text message QR codes.
 */

import React from 'react';
import { MessageSquare } from 'lucide-react';
import { SmsPayload } from '../../types/qr';

interface SmsFormProps {
  data: SmsPayload;
  onChange: (data: SmsPayload) => void;
}

export const SmsForm: React.FC<SmsFormProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5 flex items-center justify-between">
          <span>Recipient Phone Number</span>
          <span className="text-[11px] font-mono text-ars-grey-600">e.g. +15551234567</span>
        </label>
        <div className="relative rounded-lg shadow-ars-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ars-grey-400">
            <MessageSquare className="w-4 h-4" />
          </div>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => onChange({ ...data, phone: e.target.value })}
            placeholder="+1 555 123 4567"
            className="block w-full pl-9 pr-3 py-2.5 text-sm bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-ars-grey-400 focus:border-ars-red transition-all font-sans"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5">
          Pre-filled Text Message
        </label>
        <textarea
          rows={3}
          value={data.message}
          onChange={(e) => onChange({ ...data, message: e.target.value })}
          placeholder="e.g. SUBSCRIBE or INFO REQUEST"
          className="block w-full p-3 text-sm bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-ars-grey-400 focus:border-ars-red transition-all font-sans resize-y"
        />
      </div>
    </div>
  );
};

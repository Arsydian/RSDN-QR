/**
 * @file SmsForm.tsx
 * @description Form input for SMS text message QR codes.
 */

import React, { useId } from 'react';
import { MessageSquare } from 'lucide-react';
import { SmsPayload } from '../../types/qr';

interface SmsFormProps {
  data: SmsPayload;
  onChange: (data: SmsPayload) => void;
}

export const SmsForm: React.FC<SmsFormProps> = ({ data, onChange }) => {
  const id = useId();

  return (
    <div className="space-y-4">
      <div>
        <div className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5 flex items-center justify-between">
          <label htmlFor={`${id}-phone`}>Recipient Phone Number</label>
          <span id={`${id}-phone-hint`} className="text-[11px] font-mono text-ars-grey-600">
            Include country code
          </span>
        </div>
        <div className="relative rounded-lg shadow-ars-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ars-grey-400">
            <MessageSquare className="w-4 h-4" aria-hidden="true" />
          </div>
          <input
            id={`${id}-phone`}
            type="tel"
            value={data.phone}
            onChange={(e) => onChange({ ...data, phone: e.target.value })}
            aria-describedby={`${id}-phone-hint`}
            className="block w-full pl-9 pr-3 py-2.5 text-xs bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-[#737277] focus:border-ars-red transition-all font-mono"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor={`${id}-message`}
          className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5"
        >
          Pre-filled Text Message
        </label>
        <textarea
          id={`${id}-message`}
          rows={3}
          value={data.message}
          onChange={(e) => onChange({ ...data, message: e.target.value })}
          placeholder="e.g. SUBSCRIBE or INFO REQUEST"
          className="block w-full p-3 text-sm bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-[#737277] focus:border-ars-red transition-all font-sans resize-y"
        />
      </div>
    </div>
  );
};

/**
 * @file WhatsAppForm.tsx
 * @description Form input for WhatsApp direct chat QR codes.
 */

import React, { useId } from 'react';
import { MessageCircle } from 'lucide-react';
import { WhatsAppPayload } from '../../types/qr';

interface WhatsAppFormProps {
  data: WhatsAppPayload;
  onChange: (data: WhatsAppPayload) => void;
}

export const WhatsAppForm: React.FC<WhatsAppFormProps> = ({ data, onChange }) => {
  const id = useId();

  return (
    <div className="space-y-4">
      <div>
        <div className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5 flex items-center justify-between">
          <label htmlFor={`${id}-phone`}>WhatsApp Phone Number</label>
          <span id={`${id}-phone-hint`} className="text-[11px] font-mono text-ars-grey-600">
            With country code, no +
          </span>
        </div>
        <div className="relative rounded-lg shadow-ars-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#25D366]">
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
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
          Pre-filled Message (Optional)
        </label>
        <textarea
          id={`${id}-message`}
          rows={3}
          value={data.message}
          onChange={(e) => onChange({ ...data, message: e.target.value })}
          placeholder="Hi Arsydian, I would like to schedule a security consultation..."
          className="block w-full p-3 text-sm bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-[#737277] focus:border-ars-red transition-all font-sans resize-y"
        />
      </div>
    </div>
  );
};

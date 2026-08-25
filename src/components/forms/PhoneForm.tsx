/**
 * @file PhoneForm.tsx
 * @description Form input for Phone Call (tel:) QR codes.
 */

import React from 'react';
import { Phone } from 'lucide-react';
import { PhonePayload } from '../../types/qr';

interface PhoneFormProps {
  data: PhonePayload;
  onChange: (data: PhonePayload) => void;
}

export const PhoneForm: React.FC<PhoneFormProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5 flex items-center justify-between">
          <span>Phone Number</span>
          <span className="text-[11px] font-mono font-normal text-ars-grey-600">Include country code</span>
        </label>
        <div className="relative rounded-lg shadow-ars-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ars-grey-400">
            <Phone className="w-4 h-4" />
          </div>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => onChange({ ...data, phone: e.target.value })}
            className="block w-full pl-9 pr-3 py-2.5 text-xs bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-ars-grey-400 focus:border-ars-red transition-all font-mono"
          />
        </div>
      </div>
      <p className="text-xs text-ars-grey-600">
        When scanned, phones will immediately prompt to dial this number.
      </p>
    </div>
  );
};

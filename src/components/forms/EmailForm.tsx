/**
 * @file EmailForm.tsx
 * @description Form input for Email (mailto:) QR codes.
 */

import React from 'react';
import { Mail } from 'lucide-react';
import { EmailPayload } from '../../types/qr';

interface EmailFormProps {
  data: EmailPayload;
  onChange: (data: EmailPayload) => void;
}

export const EmailForm: React.FC<EmailFormProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5">
          Recipient Email
        </label>
        <div className="relative rounded-lg shadow-ars-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ars-grey-400">
            <Mail className="w-4 h-4" />
          </div>
          <input
            type="email"
            value={data.email}
            onChange={(e) => onChange({ ...data, email: e.target.value })}
            className="block w-full pl-9 pr-3 py-2.5 text-xs bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-ars-grey-400 focus:border-ars-red transition-all font-sans"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5">
          Subject Line (Optional)
        </label>
        <input
          type="text"
          value={data.subject}
          onChange={(e) => onChange({ ...data, subject: e.target.value })}
          placeholder="e.g. Project Consultation Request"
          className="block w-full px-3 py-2.5 text-sm bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-ars-grey-400 focus:border-ars-red transition-all font-sans"
        />
      </div>

      <div>
        <label className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5">
          Email Body / Pre-filled Message (Optional)
        </label>
        <textarea
          rows={3}
          value={data.body}
          onChange={(e) => onChange({ ...data, body: e.target.value })}
          placeholder="Pre-populate the email message body for your user..."
          className="block w-full p-3 text-sm bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-ars-grey-400 focus:border-ars-red transition-all font-sans resize-y"
        />
      </div>
    </div>
  );
};

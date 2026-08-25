/**
 * @file VCardForm.tsx
 * @description Form input for Contact Card (vCard 3.0) QR codes.
 */

import React from 'react';
import { User, Building, Mail, Phone, Globe, MapPin } from 'lucide-react';
import { VCardPayload } from '../../types/qr';

interface VCardFormProps {
  data: VCardPayload;
  onChange: (data: VCardPayload) => void;
}

export const VCardForm: React.FC<VCardFormProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-4">
      {/* Name Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5">
            First Name
          </label>
          <div className="relative rounded-lg shadow-ars-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ars-grey-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={data.firstName}
              onChange={(e) => onChange({ ...data, firstName: e.target.value })}
              placeholder="John"
              className="block w-full pl-9 pr-3 py-2 text-sm bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-ars-grey-400 focus:border-ars-red transition-all font-sans"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5">
            Last Name
          </label>
          <input
            type="text"
            value={data.lastName}
            onChange={(e) => onChange({ ...data, lastName: e.target.value })}
            placeholder="Doe"
            className="block w-full px-3 py-2 text-sm bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-ars-grey-400 focus:border-ars-red transition-all font-sans"
          />
        </div>
      </div>

      {/* Organization & Title */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5">
            Organization / Company
          </label>
          <div className="relative rounded-lg shadow-ars-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ars-grey-400">
              <Building className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={data.organization}
              onChange={(e) => onChange({ ...data, organization: e.target.value })}
              placeholder="Arsydian Inc."
              className="block w-full pl-9 pr-3 py-2 text-sm bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-ars-grey-400 focus:border-ars-red transition-all font-sans"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5">
            Job Title
          </label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            placeholder="Senior Network Engineer"
            className="block w-full px-3 py-2 text-sm bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-ars-grey-400 focus:border-ars-red transition-all font-sans"
          />
        </div>
      </div>

      {/* Phone Numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5">
            Mobile Phone
          </label>
          <div className="relative rounded-lg shadow-ars-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ars-grey-400">
              <Phone className="w-4 h-4" />
            </div>
            <input
              type="tel"
              onChange={(e) => onChange({ ...data, phoneMobile: e.target.value })}
              className="block w-full pl-9 pr-3 py-2 text-sm bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-ars-grey-400 focus:border-ars-red transition-all font-sans"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5">
            Work Phone
          </label>
          <input
            type="tel"
            onChange={(e) => onChange({ ...data, phoneWork: e.target.value })}
            className="block w-full px-3 py-2 text-sm bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-ars-grey-400 focus:border-ars-red transition-all font-sans"
          />
        </div>
      </div>

      {/* Email & Website */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5">
            Email Address
          </label>
          <div className="relative rounded-lg shadow-ars-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ars-grey-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              onChange={(e) => onChange({ ...data, email: e.target.value })}
              className="block w-full pl-9 pr-3 py-2 text-sm bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-ars-grey-400 focus:border-ars-red transition-all font-sans"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5">
            Website URL
          </label>
          <div className="relative rounded-lg shadow-ars-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ars-grey-400">
              <Globe className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={data.url}
              onChange={(e) => onChange({ ...data, url: e.target.value })}
              placeholder="https://arsydian.com"
              className="block w-full pl-9 pr-3 py-2 text-sm bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-ars-grey-400 focus:border-ars-red transition-all font-sans"
            />
          </div>
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5">
          Street Address
        </label>
        <div className="relative rounded-lg shadow-ars-xs mb-2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ars-grey-400">
            <MapPin className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={data.street}
            onChange={(e) => onChange({ ...data, street: e.target.value })}
            placeholder="100 Main St, Suite 400"
            className="block w-full pl-9 pr-3 py-2 text-sm bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-ars-grey-400 focus:border-ars-red transition-all font-sans"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <input
            type="text"
            value={data.city}
            onChange={(e) => onChange({ ...data, city: e.target.value })}
            placeholder="City"
            className="px-3 py-2 text-xs bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-ars-grey-400 focus:border-ars-red transition-all font-sans"
          />
          <input
            type="text"
            value={data.state}
            onChange={(e) => onChange({ ...data, state: e.target.value })}
            placeholder="State / Prov"
            className="px-3 py-2 text-xs bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-ars-grey-400 focus:border-ars-red transition-all font-sans"
          />
          <input
            type="text"
            value={data.zip}
            onChange={(e) => onChange({ ...data, zip: e.target.value })}
            placeholder="Postal Code"
            className="px-3 py-2 text-xs bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-ars-grey-400 focus:border-ars-red transition-all font-sans"
          />
          <input
            type="text"
            value={data.country}
            onChange={(e) => onChange({ ...data, country: e.target.value })}
            placeholder="Country"
            className="px-3 py-2 text-xs bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-ars-grey-400 focus:border-ars-red transition-all font-sans"
          />
        </div>
      </div>

      {/* Note */}
      <div>
        <label className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5">
          Notes / Bio (Optional)
        </label>
        <textarea
          rows={2}
          value={data.note}
          onChange={(e) => onChange({ ...data, note: e.target.value })}
          placeholder="e.g. Met at Tech Summit 2026"
          className="block w-full p-2.5 text-xs bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-ars-grey-400 focus:border-ars-red transition-all font-sans resize-y"
        />
      </div>
    </div>
  );
};

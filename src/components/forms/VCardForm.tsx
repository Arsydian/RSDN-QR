/**
 * @file VCardForm.tsx
 * @description Form input for Contact Card (vCard 3.0) QR codes.
 */

import React, { useId } from 'react';
import { User, Building, Mail, Phone, Globe, MapPin } from 'lucide-react';
import { VCardPayload } from '../../types/qr';

interface VCardFormProps {
  data: VCardPayload;
  onChange: (data: VCardPayload) => void;
}

export const VCardForm: React.FC<VCardFormProps> = ({ data, onChange }) => {
  const id = useId();

  return (
    <div className="space-y-4">
      {/* Name Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label
            htmlFor={`${id}-first-name`}
            className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5"
          >
            First Name
          </label>
          <div className="relative rounded-lg shadow-ars-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ars-grey-400">
              <User className="w-4 h-4" aria-hidden="true" />
            </div>
            <input
              id={`${id}-first-name`}
              type="text"
              value={data.firstName}
              onChange={(e) => onChange({ ...data, firstName: e.target.value })}
              placeholder="John"
              className="block w-full pl-9 pr-3 py-2 text-sm bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-[#737277] focus:border-ars-red transition-all font-sans"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor={`${id}-last-name`}
            className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5"
          >
            Last Name
          </label>
          <input
            id={`${id}-last-name`}
            type="text"
            value={data.lastName}
            onChange={(e) => onChange({ ...data, lastName: e.target.value })}
            placeholder="Doe"
            className="block w-full px-3 py-2 text-sm bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-[#737277] focus:border-ars-red transition-all font-sans"
          />
        </div>
      </div>

      {/* Organization & Title */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label
            htmlFor={`${id}-organization`}
            className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5"
          >
            Organization / Company
          </label>
          <div className="relative rounded-lg shadow-ars-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ars-grey-400">
              <Building className="w-4 h-4" aria-hidden="true" />
            </div>
            <input
              id={`${id}-organization`}
              type="text"
              value={data.organization}
              onChange={(e) => onChange({ ...data, organization: e.target.value })}
              placeholder="Arsydian Inc."
              className="block w-full pl-9 pr-3 py-2 text-sm bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-[#737277] focus:border-ars-red transition-all font-sans"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor={`${id}-job-title`}
            className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5"
          >
            Job Title
          </label>
          <input
            id={`${id}-job-title`}
            type="text"
            value={data.title}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            placeholder="Senior Network Engineer"
            className="block w-full px-3 py-2 text-sm bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-[#737277] focus:border-ars-red transition-all font-sans"
          />
        </div>
      </div>

      {/* Phone Numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label
            htmlFor={`${id}-phone-mobile`}
            className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5"
          >
            Mobile Phone
          </label>
          <div className="relative rounded-lg shadow-ars-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ars-grey-400">
              <Phone className="w-4 h-4" aria-hidden="true" />
            </div>
            <input
              id={`${id}-phone-mobile`}
              type="tel"
              value={data.phoneMobile}
              onChange={(e) => onChange({ ...data, phoneMobile: e.target.value })}
              className="block w-full pl-9 pr-3 py-2 text-sm bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-[#737277] focus:border-ars-red transition-all font-sans"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor={`${id}-phone-work`}
            className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5"
          >
            Work Phone
          </label>
          <input
            id={`${id}-phone-work`}
            type="tel"
            value={data.phoneWork}
            onChange={(e) => onChange({ ...data, phoneWork: e.target.value })}
            className="block w-full px-3 py-2 text-sm bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-[#737277] focus:border-ars-red transition-all font-sans"
          />
        </div>
      </div>

      {/* Email & Website */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label
            htmlFor={`${id}-email`}
            className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5"
          >
            Email Address
          </label>
          <div className="relative rounded-lg shadow-ars-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ars-grey-400">
              <Mail className="w-4 h-4" aria-hidden="true" />
            </div>
            <input
              id={`${id}-email`}
              type="email"
              value={data.email}
              onChange={(e) => onChange({ ...data, email: e.target.value })}
              className="block w-full pl-9 pr-3 py-2 text-sm bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-[#737277] focus:border-ars-red transition-all font-sans"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor={`${id}-url`}
            className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5"
          >
            Website URL
          </label>
          <div className="relative rounded-lg shadow-ars-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ars-grey-400">
              <Globe className="w-4 h-4" aria-hidden="true" />
            </div>
            <input
              id={`${id}-url`}
              type="text"
              value={data.url}
              onChange={(e) => onChange({ ...data, url: e.target.value })}
              placeholder="https://arsydian.com"
              className="block w-full pl-9 pr-3 py-2 text-sm bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-[#737277] focus:border-ars-red transition-all font-sans"
            />
          </div>
        </div>
      </div>

      {/* Address */}
      <div>
        <label
          htmlFor={`${id}-street`}
          className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5"
        >
          Street Address
        </label>
        <div className="relative rounded-lg shadow-ars-xs mb-2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ars-grey-400">
            <MapPin className="w-4 h-4" aria-hidden="true" />
          </div>
          <input
            id={`${id}-street`}
            type="text"
            value={data.street}
            onChange={(e) => onChange({ ...data, street: e.target.value })}
            placeholder="100 Main St, Suite 400"
            className="block w-full pl-9 pr-3 py-2 text-sm bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-[#737277] focus:border-ars-red transition-all font-sans"
          />
        </div>

        {/* City / State / Postal / Country have no visible label, only placeholders */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <input
            type="text"
            value={data.city}
            onChange={(e) => onChange({ ...data, city: e.target.value })}
            aria-label="City"
            placeholder="City"
            className="px-3 py-2 text-xs bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-[#737277] focus:border-ars-red transition-all font-sans"
          />
          <input
            type="text"
            value={data.state}
            onChange={(e) => onChange({ ...data, state: e.target.value })}
            aria-label="State or province"
            placeholder="State / Prov"
            className="px-3 py-2 text-xs bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-[#737277] focus:border-ars-red transition-all font-sans"
          />
          <input
            type="text"
            value={data.zip}
            onChange={(e) => onChange({ ...data, zip: e.target.value })}
            aria-label="Postal code"
            placeholder="Postal Code"
            className="px-3 py-2 text-xs bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-[#737277] focus:border-ars-red transition-all font-sans"
          />
          <input
            type="text"
            value={data.country}
            onChange={(e) => onChange({ ...data, country: e.target.value })}
            aria-label="Country"
            placeholder="Country"
            className="px-3 py-2 text-xs bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-[#737277] focus:border-ars-red transition-all font-sans"
          />
        </div>
      </div>

      {/* Note */}
      <div>
        <label
          htmlFor={`${id}-note`}
          className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5"
        >
          Notes / Bio (Optional)
        </label>
        <textarea
          id={`${id}-note`}
          rows={2}
          value={data.note}
          onChange={(e) => onChange({ ...data, note: e.target.value })}
          placeholder="e.g. Met at Tech Summit 2026"
          className="block w-full p-2.5 text-xs bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-[#737277] focus:border-ars-red transition-all font-sans resize-y"
        />
      </div>
    </div>
  );
};

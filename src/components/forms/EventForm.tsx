/**
 * @file EventForm.tsx
 * @description Form input for Calendar Event (iCal) QR codes.
 */

import React, { useId } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { EventPayload } from '../../types/qr';

interface EventFormProps {
  data: EventPayload;
  onChange: (data: EventPayload) => void;
}

export const EventForm: React.FC<EventFormProps> = ({ data, onChange }) => {
  const id = useId();

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor={`${id}-title`}
          className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5"
        >
          Event Title / Summary
        </label>
        <div className="relative rounded-lg shadow-ars-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ars-grey-400">
            <Calendar className="w-4 h-4" aria-hidden="true" />
          </div>
          <input
            id={`${id}-title`}
            type="text"
            value={data.title}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            placeholder="Arsydian IT & Security Workshop"
            className="block w-full pl-9 pr-3 py-2.5 text-sm bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-[#737277] focus:border-ars-red transition-all font-sans"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label
            htmlFor={`${id}-start`}
            className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5"
          >
            Start Date & Time
          </label>
          <input
            id={`${id}-start`}
            type="datetime-local"
            value={data.startDate}
            onChange={(e) => onChange({ ...data, startDate: e.target.value })}
            className="block w-full px-3 py-2 text-xs bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink focus:border-ars-red transition-all font-mono"
          />
        </div>

        <div>
          <label
            htmlFor={`${id}-end`}
            className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5"
          >
            End Date & Time
          </label>
          <input
            id={`${id}-end`}
            type="datetime-local"
            value={data.endDate}
            onChange={(e) => onChange({ ...data, endDate: e.target.value })}
            className="block w-full px-3 py-2 text-xs bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink focus:border-ars-red transition-all font-mono"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor={`${id}-location`}
          className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5"
        >
          Location / Video Link (Optional)
        </label>
        <div className="relative rounded-lg shadow-ars-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ars-grey-400">
            <MapPin className="w-4 h-4" aria-hidden="true" />
          </div>
          <input
            id={`${id}-location`}
            type="text"
            value={data.location}
            onChange={(e) => onChange({ ...data, location: e.target.value })}
            placeholder="Convention Center or Zoom Link"
            className="block w-full pl-9 pr-3 py-2 text-sm bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-[#737277] focus:border-ars-red transition-all font-sans"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor={`${id}-description`}
          className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5"
        >
          Event Description (Optional)
        </label>
        <textarea
          id={`${id}-description`}
          rows={3}
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          placeholder="Brief agenda or instructions for attendees..."
          className="block w-full p-2.5 text-xs bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-[#737277] focus:border-ars-red transition-all font-sans resize-y"
        />
      </div>
    </div>
  );
};

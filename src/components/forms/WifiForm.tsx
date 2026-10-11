/**
 * @file WifiForm.tsx
 * @description Form input for Wi-Fi Network auto-connection QR codes.
 */

import React, { useId } from 'react';
import { Wifi, Key, Eye, EyeOff, Lock } from 'lucide-react';
import { WifiPayload, WifiEncryption } from '../../types/qr';

interface WifiFormProps {
  data: WifiPayload;
  onChange: (data: WifiPayload) => void;
}

export const WifiForm: React.FC<WifiFormProps> = ({ data, onChange }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const id = useId();

  return (
    <div className="space-y-4">
      <div>
        <div className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5 flex items-center justify-between">
          <label htmlFor={`${id}-ssid`}>Network Name (SSID)</label>
          <span id={`${id}-ssid-hint`} className="text-[11px] font-mono text-ars-grey-600">
            Case-sensitive
          </span>
        </div>
        <div className="relative rounded-lg shadow-ars-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ars-grey-400">
            <Wifi className="w-4 h-4" aria-hidden="true" />
          </div>
          <input
            id={`${id}-ssid`}
            type="text"
            value={data.ssid}
            onChange={(e) => onChange({ ...data, ssid: e.target.value })}
            aria-describedby={`${id}-ssid-hint`}
            placeholder="Office_Guest_5G"
            className="block w-full pl-9 pr-3 py-2.5 text-sm bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-[#737277] focus:border-ars-red transition-all font-sans"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor={`${id}-encryption`}
            className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5"
          >
            Security / Encryption
          </label>
          <div className="relative rounded-lg shadow-ars-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ars-grey-400">
              <Lock className="w-4 h-4" aria-hidden="true" />
            </div>
            <select
              id={`${id}-encryption`}
              value={data.encryption}
              onChange={(e) => onChange({ ...data, encryption: e.target.value as WifiEncryption })}
              className="block w-full pl-9 pr-3 py-2.5 text-sm bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink focus:border-ars-red transition-all font-sans"
            >
              <option value="WPA">WPA / WPA2 / WPA3 (Default)</option>
              <option value="WEP">WEP (Legacy)</option>
              <option value="nopass">None (Open Network)</option>
            </select>
          </div>
        </div>

        {data.encryption !== 'nopass' && (
          <div>
            <label
              htmlFor={`${id}-password`}
              className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5"
            >
              Network Password
            </label>
            <div className="relative rounded-lg shadow-ars-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ars-grey-400">
                <Key className="w-4 h-4" aria-hidden="true" />
              </div>
              <input
                id={`${id}-password`}
                type={showPassword ? 'text' : 'password'}
                value={data.password}
                onChange={(e) => onChange({ ...data, password: e.target.value })}
                placeholder="Wi-Fi Password"
                className="block w-full pl-9 pr-10 py-2.5 text-sm bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-[#737277] focus:border-ars-red transition-all font-mono"
              />
              {/* Icon-only toggle: grey-600 keeps the icon above 3:1 non-text contrast */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-controls={`${id}-password`}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-ars-grey-600 hover:text-ars-ink"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <Eye className="w-4 h-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 pt-1">
        <input
          type="checkbox"
          id={`${id}-hidden`}
          checked={data.hidden}
          onChange={(e) => onChange({ ...data, hidden: e.target.checked })}
          className="rounded-sm border-ars-grey-300 text-ars-red focus:ring-ars-red w-4 h-4"
        />
        <label htmlFor={`${id}-hidden`} className="text-xs text-ars-ink cursor-pointer font-sans">
          This is a hidden network (SSID is not broadcasted)
        </label>
      </div>
    </div>
  );
};

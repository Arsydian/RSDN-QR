/**
 * @file CryptoForm.tsx
 * @description Form input for Cryptocurrency wallet address QR codes.
 */

import React, { useId } from 'react';
import { Coins } from 'lucide-react';
import { CryptoPayload } from '../../types/qr';

interface CryptoFormProps {
  data: CryptoPayload;
  onChange: (data: CryptoPayload) => void;
}

export const CryptoForm: React.FC<CryptoFormProps> = ({ data, onChange }) => {
  const id = useId();

  return (
    <div className="space-y-4">
      <div>
        <p
          id={`${id}-network`}
          className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5"
        >
          Cryptocurrency Network
        </p>
        <div
          role="group"
          aria-labelledby={`${id}-network`}
          className="grid grid-cols-2 sm:grid-cols-4 gap-2"
        >
          {(
            [
              { id: 'bitcoin', label: 'Bitcoin (BTC)' },
              { id: 'ethereum', label: 'Ethereum (ETH)' },
              { id: 'solana', label: 'Solana (SOL)' },
              // The generated payment link is an Ethereum ERC-20 token transfer
              { id: 'usdt', label: 'Tether (USDT, ERC-20)' },
            ] as const
          ).map((coin) => {
            const isSelected = data.currency === coin.id;
            return (
              <button
                key={coin.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onChange({ ...data, currency: coin.id })}
                className={`px-3 py-2 rounded-lg text-xs font-semibold font-display border text-center transition-all ${
                  isSelected
                    ? 'bg-ars-black text-white border-ars-black shadow-ars-xs'
                    : 'bg-ars-white text-ars-ink border-ars-grey-200 hover:border-ars-red'
                }`}
              >
                {coin.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label
          htmlFor={`${id}-address`}
          className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5"
        >
          Wallet Address
        </label>
        <div className="relative rounded-lg shadow-ars-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ars-grey-400">
            <Coins className="w-4 h-4" aria-hidden="true" />
          </div>
          <input
            id={`${id}-address`}
            type="text"
            value={data.address}
            onChange={(e) => onChange({ ...data, address: e.target.value })}
            className="block w-full pl-9 pr-3 py-2.5 text-xs bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-[#737277] focus:border-ars-red transition-all font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label
            htmlFor={`${id}-amount`}
            className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5"
          >
            Requested Amount (Optional)
          </label>
          <input
            id={`${id}-amount`}
            type="text"
            value={data.amount}
            onChange={(e) => onChange({ ...data, amount: e.target.value })}
            className="block w-full px-3 py-2 text-sm bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-[#737277] focus:border-ars-red transition-all font-mono"
          />
        </div>

        <div>
          <label
            htmlFor={`${id}-message`}
            className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5"
          >
            Memo / Message (Optional)
          </label>
          <input
            id={`${id}-message`}
            type="text"
            value={data.message}
            onChange={(e) => onChange({ ...data, message: e.target.value })}
            className="block w-full px-3 py-2 text-sm bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-[#737277] focus:border-ars-red transition-all font-sans"
          />
        </div>
      </div>
    </div>
  );
};

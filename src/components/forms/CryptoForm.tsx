/**
 * @file CryptoForm.tsx
 * @description Form input for Cryptocurrency wallet address QR codes.
 */

import React from 'react';
import { Coins } from 'lucide-react';
import { CryptoPayload } from '../../types/qr';

interface CryptoFormProps {
  data: CryptoPayload;
  onChange: (data: CryptoPayload) => void;
}

export const CryptoForm: React.FC<CryptoFormProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5">
          Cryptocurrency Network
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(
            [
              { id: 'bitcoin', label: 'Bitcoin (BTC)' },
              { id: 'ethereum', label: 'Ethereum (ETH)' },
              { id: 'solana', label: 'Solana (SOL)' },
              { id: 'usdt', label: 'Tether (USDT)' },
            ] as const
          ).map((coin) => (
            <button
              key={coin.id}
              type="button"
              onClick={() => onChange({ ...data, currency: coin.id })}
              className={`px-3 py-2 rounded-lg text-xs font-semibold font-display border text-center transition-all ${
                data.currency === coin.id
                  ? 'bg-ars-black text-white border-ars-black shadow-ars-xs'
                  : 'bg-ars-white text-ars-ink border-ars-grey-200 hover:border-ars-red'
              }`}
            >
              {coin.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5">
          Wallet Address
        </label>
        <div className="relative rounded-lg shadow-ars-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ars-grey-400">
            <Coins className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={data.address}
            onChange={(e) => onChange({ ...data, address: e.target.value })}
            placeholder={
              data.currency === 'bitcoin'
                ? 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq'
                : data.currency === 'ethereum' || data.currency === 'usdt'
                ? '0x71C...397'
                : 'SolanaAddress...'
            }
            className="block w-full pl-9 pr-3 py-2.5 text-xs bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-ars-grey-400 focus:border-ars-red transition-all font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5">
            Requested Amount (Optional)
          </label>
          <input
            type="text"
            value={data.amount}
            onChange={(e) => onChange({ ...data, amount: e.target.value })}
            placeholder="0.05"
            className="block w-full px-3 py-2 text-sm bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-ars-grey-400 focus:border-ars-red transition-all font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-display font-bold uppercase tracking-wider text-ars-ink mb-1.5">
            Memo / Message (Optional)
          </label>
          <input
            type="text"
            value={data.message}
            onChange={(e) => onChange({ ...data, message: e.target.value })}
            placeholder="Invoice #1042"
            className="block w-full px-3 py-2 text-sm bg-ars-white border border-ars-grey-200 rounded-lg text-ars-ink placeholder:text-ars-grey-400 focus:border-ars-red transition-all font-sans"
          />
        </div>
      </div>
    </div>
  );
};

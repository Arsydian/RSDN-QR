/**
 * @file TypeSelector.tsx
 * @description Tab navigation for selecting the active QR payload category.
 */

import React from 'react';
import {
  Globe,
  FileText,
  Mail,
  Phone,
  MessageSquare,
  Wifi,
  Contact,
  MessageCircle,
  Coins,
  Calendar,
} from 'lucide-react';
import { QrType } from '../../types/qr';

interface TypeSelectorProps {
  activeType: QrType;
  onSelectType: (type: QrType) => void;
}

interface TypeItem {
  type: QrType;
  label: string;
  icon: React.ElementType;
}

const QR_TYPES: TypeItem[] = [
  { type: 'url', label: 'Website / Link', icon: Globe },
  { type: 'vcard', label: 'Contact Card', icon: Contact },
  { type: 'wifi', label: 'Wi-Fi Network', icon: Wifi },
  { type: 'text', label: 'Plain Text', icon: FileText },
  { type: 'email', label: 'Email', icon: Mail },
  { type: 'phone', label: 'Phone Call', icon: Phone },
  { type: 'sms', label: 'SMS Message', icon: MessageSquare },
  { type: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { type: 'crypto', label: 'Crypto Wallet', icon: Coins },
  { type: 'event', label: 'Calendar Event', icon: Calendar },
];

export const TypeSelector: React.FC<TypeSelectorProps> = ({
  activeType,
  onSelectType,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
      {QR_TYPES.map(({ type, label, icon: Icon }) => {
        const isActive = activeType === type;
        return (
          <button
            key={type}
            type="button"
            onClick={() => onSelectType(type)}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all ${
              isActive
                ? 'bg-ars-black text-white border-ars-black shadow-ars-sm'
                : 'bg-ars-white text-ars-ink border-ars-grey-200 hover:border-ars-red hover:bg-ars-grey-50'
            }`}
          >
            <div className={`p-1.5 rounded-md mb-1.5 ${isActive ? 'bg-ars-red text-white' : 'text-ars-grey-600'}`}>
              <Icon className="w-4 h-4" />
            </div>
            <span className="font-display font-semibold text-xs tracking-tight">{label}</span>
          </button>
        );
      })}
    </div>
  );
};

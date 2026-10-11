/**
 * @file payloadFormatters.ts
 * @description Standard-compliant serializers that transform user form inputs into
 * machine-readable QR code data strings (e.g., vCard 3.0, Wi-Fi, iCal, Crypto URI, SMS).
 */

import {
  UrlPayload,
  TextPayload,
  EmailPayload,
  PhonePayload,
  SmsPayload,
  WifiPayload,
  VCardPayload,
  WhatsAppPayload,
  CryptoPayload,
  EventPayload,
  QrType,
  QrPayloadState,
} from '../types/qr';

// ---------------------------------------------------------------------------
// Helper Utilities
// ---------------------------------------------------------------------------

/**
 * Escapes reserved characters in Wi-Fi QR fields (; , : \ ").
 * @param str The raw input string.
 * @returns The escaped string safe for the WIFI: format.
 */
function escapeWifi(str: string): string {
  if (!str) return '';
  return str.replace(/([\\;:,"])/g, '\\$1');
}

/**
 * Escapes vCard 3.0 / iCalendar TEXT values: backslash, semicolon, comma and line breaks
 * (RFC 2426 §4, RFC 5545 §3.3.11). Colons and quotes must NOT be escaped in these formats.
 * @param str The raw input string.
 * @returns The escaped string.
 */
function escapeText(str: string): string {
  if (!str) return '';
  return str.replace(/([\\;,])/g, '\\$1').replace(/\r\n|\r|\n/g, '\\n');
}

/**
 * Converts a decimal amount (e.g. "1.5") into an integer count of base units (e.g. wei).
 * @param amount Decimal amount in the coin's normal units.
 * @param decimals Number of decimal places the token uses (18 for ETH, 6 for USDT).
 * @returns Integer string, or '' if the amount is not a positive number with at most `decimals` decimals.
 */
function toBaseUnits(amount: string, decimals: number): string {
  const match = /^(\d*)(?:\.(\d*))?$/.exec(amount.trim());
  if (!match || (!match[1] && !match[2])) return '';
  const [, whole = '', fraction = ''] = match;
  if (fraction.length > decimals) return '';
  const units = BigInt((whole || '0') + fraction.padEnd(decimals, '0'));
  return units > 0n ? units.toString() : '';
}

/** Tether (USDT) ERC-20 token contract on Ethereum mainnet. */
const USDT_CONTRACT = '0xdAC17F958D2ee523a2206206994597C13D831ec7';

/**
 * Converts an ISO-like datetime string (YYYY-MM-DDTHH:mm) into iCalendar UTC/Local format (YYYYMMDDTHHMMSSZ).
 * @param isoDateString String from datetime-local input.
 * @returns Formatted iCal timestamp string.
 */
function formatICalDate(isoDateString: string): string {
  if (!isoDateString) return '';
  const date = new Date(isoDateString);
  if (isNaN(date.getTime())) return '';
  
  // Format as UTC YYYYMMDDTHHMMSSZ
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());

  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

// ---------------------------------------------------------------------------
// Individual Serializers
// ---------------------------------------------------------------------------

/**
 * Formats Website URL payload. Prepends https:// if protocol is omitted.
 * @param payload URL form data.
 * @returns Standardized URL string.
 */
export function formatUrl(payload: UrlPayload): string {
  const trimmed = payload.url.trim();
  if (!trimmed) return '';
  // Check if starts with http:// or https:// or any protocol
  if (/^[a-zA-Z]+:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/**
 * Formats Plain Text payload.
 * @param payload Text form data.
 * @returns Raw text string, or '' if it is blank.
 */
export function formatText(payload: TextPayload): string {
  return payload.text.trim() ? payload.text : '';
}

/**
 * Formats Email into a mailto: URI string with optional subject and body.
 * @param payload Email form data.
 * @returns mailto URI string.
 */
export function formatEmail(payload: EmailPayload): string {
  const email = payload.email.trim();
  if (!email) return '';

  // RFC 6068: percent-encode (spaces as %20, not "+") and send line breaks as CRLF
  const encode = (value: string) => encodeURIComponent(value.replace(/\r?\n/g, '\r\n'));
  const params: string[] = [];
  if (payload.subject.trim()) params.push(`subject=${encode(payload.subject.trim())}`);
  if (payload.body.trim()) params.push(`body=${encode(payload.body.trim())}`);

  return params.length > 0 ? `mailto:${email}?${params.join('&')}` : `mailto:${email}`;
}

/**
 * Formats Phone Number into a tel: URI string.
 * @param payload Phone form data.
 * @returns tel URI string.
 */
export function formatPhone(payload: PhonePayload): string {
  const cleaned = payload.phone.replace(/[^0-9+]/g, '');
  return cleaned ? `tel:${cleaned}` : '';
}

/**
 * Formats SMS message into smsto: URI.
 * @param payload SMS form data.
 * @returns smsto:NUMBER:BODY string.
 */
export function formatSms(payload: SmsPayload): string {
  const cleanedPhone = payload.phone.replace(/[^0-9+]/g, '');
  if (!cleanedPhone) return '';
  return `smsto:${cleanedPhone}:${payload.message}`;
}

/**
 * Formats Wi-Fi Network credentials into standard WIFI: protocol.
 * Spec: WIFI:T:<WPA|WEP|nopass>;S:<SSID>;P:<PASSWORD>;H:<true|false>;;
 * @param payload Wi-Fi form data.
 * @returns WIFI protocol string, or '' if no network name is set.
 */
export function formatWifi(payload: WifiPayload): string {
  if (!payload.ssid.trim()) return '';
  const ssid = escapeWifi(payload.ssid);
  const password = payload.encryption === 'nopass' ? '' : escapeWifi(payload.password);
  const enc = payload.encryption || 'WPA';
  const hidden = payload.hidden ? 'true' : 'false';

  return `WIFI:T:${enc};S:${ssid};P:${password};H:${hidden};;`;
}

/**
 * Formats Contact Card into standard vCard 3.0 format.
 * Compatible with iOS Contacts, Android Google Contacts, and desktop address books.
 * @param payload vCard form data.
 * @returns Serialized vCard 3.0 string, or '' if every field is blank.
 */
export function formatVCard(payload: VCardPayload): string {
  if (!Object.values(payload).some((value) => value.trim())) return '';
  const lines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${escapeText(payload.lastName)};${escapeText(payload.firstName)};;;`,
    `FN:${escapeText([payload.firstName, payload.lastName].filter(Boolean).join(' '))}`,
  ];

  if (payload.organization.trim()) lines.push(`ORG:${escapeText(payload.organization.trim())}`);
  if (payload.title.trim()) lines.push(`TITLE:${escapeText(payload.title.trim())}`);
  if (payload.phoneMobile.trim()) lines.push(`TEL;TYPE=CELL,VOICE:${payload.phoneMobile.trim()}`);
  if (payload.phoneWork.trim()) lines.push(`TEL;TYPE=WORK,VOICE:${payload.phoneWork.trim()}`);
  if (payload.email.trim()) lines.push(`EMAIL;TYPE=PREF,INTERNET:${payload.email.trim()}`);
  if (payload.url.trim()) lines.push(`URL:${payload.url.trim()}`);

  const hasAddress = payload.street || payload.city || payload.state || payload.zip || payload.country;
  if (hasAddress) {
    const street = escapeText(payload.street);
    const city = escapeText(payload.city);
    const state = escapeText(payload.state);
    const zip = escapeText(payload.zip);
    const country = escapeText(payload.country);
    lines.push(`ADR;TYPE=WORK:;;${street};${city};${state};${zip};${country}`);
  }

  if (payload.note.trim()) lines.push(`NOTE:${escapeText(payload.note.trim())}`);
  lines.push('END:VCARD');

  return lines.join('\n');
}

/**
 * Formats WhatsApp link with international phone number and pre-filled message.
 * @param payload WhatsApp form data.
 * @returns WhatsApp direct chat URL.
 */
export function formatWhatsApp(payload: WhatsAppPayload): string {
  const cleanPhone = payload.phone.replace(/[^0-9]/g, '');
  if (!cleanPhone) return '';
  const messageEncoded = encodeURIComponent(payload.message.trim());
  return messageEncoded
    ? `https://wa.me/${cleanPhone}?text=${messageEncoded}`
    : `https://wa.me/${cleanPhone}`;
}

/**
 * Formats Cryptocurrency wallet address with optional amount and memo.
 * @param payload Crypto form data.
 * @returns Standard crypto URI (e.g. bitcoin:1A1zP1...?amount=0.05).
 */
export function formatCrypto(payload: CryptoPayload): string {
  const addr = payload.address.trim();
  if (!addr) return '';

  const params: string[] = [];
  if (payload.amount.trim()) params.push(`amount=${encodeURIComponent(payload.amount.trim())}`);
  if (payload.message.trim()) params.push(`message=${encodeURIComponent(payload.message.trim())}`);

  const queryString = params.length > 0 ? `?${params.join('&')}` : '';

  switch (payload.currency) {
    case 'bitcoin':
      return `bitcoin:${addr}${queryString}`;
    case 'ethereum': {
      // EIP-681: `value` is an integer amount in wei
      const wei = toBaseUnits(payload.amount, 18);
      return wei ? `ethereum:${addr}?value=${wei}` : `ethereum:${addr}`;
    }
    case 'solana':
      return `solana:${addr}${queryString}`;
    case 'usdt': {
      // EIP-681 ERC-20 transfer: call transfer(address, uint256) on the USDT contract (6 decimals)
      const units = toBaseUnits(payload.amount, 6);
      const amountParam = units ? `&uint256=${units}` : '';
      return `ethereum:${USDT_CONTRACT}/transfer?address=${addr}${amountParam}`;
    }
    default:
      return addr;
  }
}

/**
 * Formats Calendar Event into standard iCal / VEVENT block.
 * @param payload Event form data.
 * @returns iCalendar string, or '' if there is no title or start time.
 */
export function formatEvent(payload: EventPayload): string {
  const start = formatICalDate(payload.startDate);
  const end = formatICalDate(payload.endDate);
  if (!payload.title.trim() && !start) return '';

  const lines: string[] = [
    'BEGIN:VEVENT',
    `SUMMARY:${escapeText(payload.title)}`,
  ];

  if (start) lines.push(`DTSTART:${start}`);
  if (end) lines.push(`DTEND:${end}`);
  if (payload.location.trim()) lines.push(`LOCATION:${escapeText(payload.location.trim())}`);
  if (payload.description.trim()) lines.push(`DESCRIPTION:${escapeText(payload.description.trim())}`);

  lines.push('END:VEVENT');
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Unified Serializer Dispatcher
// ---------------------------------------------------------------------------

/**
 * Generates the serialized QR payload string for any active QR type.
 * @param type The active QR type tab.
 * @param state The entire payload state map.
 * @returns The serialized payload string ready for QR code generation.
 */
export function serializeQrPayload(type: QrType, state: QrPayloadState): string {
  switch (type) {
    case 'url':
      return formatUrl(state.url);
    case 'text':
      return formatText(state.text);
    case 'email':
      return formatEmail(state.email);
    case 'phone':
      return formatPhone(state.phone);
    case 'sms':
      return formatSms(state.sms);
    case 'wifi':
      return formatWifi(state.wifi);
    case 'vcard':
      return formatVCard(state.vcard);
    case 'whatsapp':
      return formatWhatsApp(state.whatsapp);
    case 'crypto':
      return formatCrypto(state.crypto);
    case 'event':
      return formatEvent(state.event);
    default:
      return '';
  }
}

/**
 * @file qr.ts
 * @description Core TypeScript interfaces and type definitions for RSDN-QR Studio.
 * Defines payload structures for 10 QR code types, visual design parameters,
 * scannability health metrics, and export configuration.
 */

/** Supported QR Code payload categories */
export type QrType =
  | 'url'
  | 'text'
  | 'email'
  | 'phone'
  | 'sms'
  | 'wifi'
  | 'vcard'
  | 'whatsapp'
  | 'crypto'
  | 'event';

/** QR Code Error Correction Level */
export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

/** Dot pattern shape styles for the QR code body */
export type DotType =
  | 'rounded'
  | 'dots'
  | 'classy'
  | 'classy-rounded'
  | 'square'
  | 'extra-rounded';

/** Corner square (outer eye frame) shape styles */
export type CornerSquareType = 'dot' | 'square' | 'extra-rounded';

/** Corner dot (inner eye ball) shape styles */
export type CornerDotType = 'dot' | 'square';

/** Gradient type for body or corners */
export type GradientType = 'linear' | 'radial';

/** Single gradient stop definition */
export interface ColorStop {
  offset: number;
  color: string;
}

/** Gradient configuration */
export interface GradientConfig {
  type: GradientType;
  rotation: number; // in degrees (0 - 360)
  colorStops: ColorStop[];
}

/** Styling settings for the QR code body modules */
export interface DotsOptions {
  type: DotType;
  color: string;
  gradient?: GradientConfig;
  useGradient: boolean;
}

/** Styling settings for the corner eye outer frames */
export interface CornerSquareOptions {
  type: CornerSquareType;
  color: string;
  gradient?: GradientConfig;
  useGradient: boolean;
}

/** Styling settings for the corner eye inner dots */
export interface CornerDotOptions {
  type: CornerDotType;
  color: string;
  gradient?: GradientConfig;
  useGradient: boolean;
}

/** Background options */
export interface BackgroundOptions {
  color: string;
  isTransparent: boolean;
}

/** Logo image settings */
export interface LogoOptions {
  src: string; // Base64 data URL or SVG/image URL
  name?: string;
  size: number; // Normalized scale 0.1 to 0.35 (capped for readability)
  margin: number; // Padding around logo in pixels
  hideBackgroundDots: boolean; // Clear QR dots beneath logo
}

/** Complete visual design configuration */
export interface QrDesignConfig {
  width: number;
  height: number;
  margin: number;
  errorCorrectionLevel: ErrorCorrectionLevel;
  dotsOptions: DotsOptions;
  cornersSquareOptions: CornerSquareOptions;
  cornersDotOptions: CornerDotOptions;
  backgroundOptions: BackgroundOptions;
  imageOptions: LogoOptions;
}

// ---------------------------------------------------------------------------
// QR Payload Data Types
// ---------------------------------------------------------------------------

/** Website / Link Payload */
export interface UrlPayload {
  url: string;
}

/** Plain Text Payload */
export interface TextPayload {
  text: string;
}

/** Email Payload */
export interface EmailPayload {
  email: string;
  subject: string;
  body: string;
}

/** Phone Number Payload */
export interface PhonePayload {
  phone: string;
}

/** SMS Message Payload */
export interface SmsPayload {
  phone: string;
  message: string;
}

/** Wi-Fi Network Authentication Types */
export type WifiEncryption = 'WPA' | 'WEP' | 'nopass';

/** Wi-Fi Network Payload */
export interface WifiPayload {
  ssid: string;
  password: string;
  encryption: WifiEncryption;
  hidden: boolean;
}

/** Contact Card (vCard 3.0) Payload */
export interface VCardPayload {
  firstName: string;
  lastName: string;
  organization: string;
  title: string;
  phoneWork: string;
  phoneMobile: string;
  email: string;
  url: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  note: string;
}

/** WhatsApp Message Payload */
export interface WhatsAppPayload {
  phone: string; // E.164 format without +
  message: string;
}

/** Supported Cryptocurrencies */
export type CryptoCurrency = 'bitcoin' | 'ethereum' | 'solana' | 'usdt';

/** Crypto Wallet Payload */
export interface CryptoPayload {
  currency: CryptoCurrency;
  address: string;
  amount: string;
  message: string;
}

/** Calendar Event (iCal) Payload */
export interface EventPayload {
  title: string;
  startDate: string; // YYYY-MM-DDTHH:mm
  endDate: string;   // YYYY-MM-DDTHH:mm
  location: string;
  description: string;
}

/** Unified Payload State Map */
export interface QrPayloadState {
  url: UrlPayload;
  text: TextPayload;
  email: EmailPayload;
  phone: PhonePayload;
  sms: SmsPayload;
  wifi: WifiPayload;
  vcard: VCardPayload;
  whatsapp: WhatsAppPayload;
  crypto: CryptoPayload;
  event: EventPayload;
}

// ---------------------------------------------------------------------------
// Health & Scannability Metrics
// ---------------------------------------------------------------------------

export type HealthRating = 'excellent' | 'good' | 'warning' | 'critical';

export interface ScannabilityResult {
  score: number; // 0 - 100
  rating: HealthRating;
  contrastRatio: number; // WCAG contrast e.g. 7.5:1
  contrastPass: boolean;
  logoSafe: boolean;
  logoOcclusionPercent: number;
  dataDensitySafe: boolean;
  characterCount: number;
  recommendations: string[];
}

// ---------------------------------------------------------------------------
// Export Config
// ---------------------------------------------------------------------------

export type ExportFormat = 'png' | 'jpeg' | 'svg';
export type ExportResolution = 512 | 1024 | 2048 | 4096;

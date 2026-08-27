/**
 * @file builtInIcons.ts
 * @description Curated collection of crisp icons formatted as data URIs for 1-click
 * logo overlays in QR codes (Official Arsydian Brand Mark & Full Logo, Social, Network, Crypto, Contact).
 */

import {
  ARSYDIAN_MARK_DATA_URI,
  ARSYDIAN_MARK_INVERTED_DATA_URI,
  ARSYDIAN_LOGO_FULL_DATA_URI,
  ARSYDIAN_LOGO_FULL_INVERTED_DATA_URI,
} from './arsydianBrandAssets';

export interface PresetIcon {
  id: string;
  name: string;
  category: 'arsydian' | 'social' | 'network' | 'utility' | 'crypto';
  svgDataUri: string;
}

/** Helper to encode raw SVG string to base64 Data URI */
function svgToDataUri(svgContent: string): string {
  const base64 = btoa(unescape(encodeURIComponent(svgContent.trim())));
  return `data:image/svg+xml;base64,${base64}`;
}

export const BUILT_IN_ICONS: PresetIcon[] = [
  {
    id: 'arsydian-mark',
    name: 'Arsydian Mark (Light)',
    category: 'arsydian',
    svgDataUri: ARSYDIAN_MARK_DATA_URI,
  },
  {
    id: 'arsydian-mark-inverted',
    name: 'Arsydian Mark (Dark)',
    category: 'arsydian',
    svgDataUri: ARSYDIAN_MARK_INVERTED_DATA_URI,
  },
  {
    id: 'arsydian-logo-full',
    name: 'Arsydian Full Logo (Light)',
    category: 'arsydian',
    svgDataUri: ARSYDIAN_LOGO_FULL_DATA_URI,
  },
  {
    id: 'arsydian-logo-full-inverted',
    name: 'Arsydian Full Logo (Dark)',
    category: 'arsydian',
    svgDataUri: ARSYDIAN_LOGO_FULL_INVERTED_DATA_URI,
  },
  {
    id: 'globe',
    name: 'Website / Link',
    category: 'utility',
    svgDataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="48" fill="#18171A"/>
        <circle cx="50" cy="50" r="38" stroke="#FFFFFF" stroke-width="5"/>
        <ellipse cx="50" cy="50" rx="18" ry="38" stroke="#FFFFFF" stroke-width="5"/>
        <path d="M14 50H86" stroke="#FFFFFF" stroke-width="5"/>
      </svg>
    `),
  },
  {
    id: 'wifi',
    name: 'Wi-Fi',
    category: 'network',
    svgDataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="48" fill="#D82125"/>
        <path d="M22 36C38 22 62 22 78 36" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round"/>
        <path d="M32 49C42 39 58 39 68 49" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round"/>
        <path d="M42 62C46 58 54 58 58 62" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round"/>
        <circle cx="50" cy="74" r="5" fill="#FFFFFF"/>
      </svg>
    `),
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    category: 'social',
    svgDataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="48" fill="#25D366"/>
        <path d="M50 20C33.4 20 20 33.4 20 50C20 56 21.8 61.5 25 66.2L21 80L35.2 76.2C39.6 78.6 44.7 80 50 80C66.6 80 80 66.6 80 50C80 33.4 66.6 20 50 20ZM64.5 61.5C63.8 63.5 60.5 65.2 58.7 65.5C57 65.8 54.8 65.8 47.8 62.9C39 59.3 33.3 50.4 32.8 49.8C32.4 49.2 29.2 45 29.2 40.5C29.2 36 31.5 33.8 32.4 32.8C33.2 32 34.3 31.8 35.1 31.8C35.7 31.8 36.3 31.8 36.8 31.8C37.4 31.8 38.2 31.6 38.9 33.2C39.7 35.1 41.5 39.5 41.7 39.9C41.9 40.4 42 41 41.6 41.7C41.3 42.4 41 42.8 40.5 43.4C40 44 39.5 44.5 39 45.1C38.4 45.7 37.9 46.3 38.5 47.4C39.1 48.4 41.2 51.9 44.3 54.7C48.3 58.3 51.6 59.4 52.7 59.9C53.8 60.4 54.5 60.3 55.1 59.6C55.7 58.9 57.7 56.6 58.4 55.6C59.1 54.6 59.8 54.7 60.7 55.1C61.6 55.4 66.8 58 67.8 58.5C68.8 59 69.5 59.3 69.7 59.7C70 60.1 70 62 64.5 61.5Z" fill="#FFFFFF"/>
      </svg>
    `),
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    category: 'social',
    svgDataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="20" fill="#0A66C2"/>
        <path d="M30 40H40V72H30V40ZM35 25C31.7 25 29 27.7 29 31C29 34.3 31.7 37 35 37C38.3 37 41 34.3 41 31C41 27.7 38.3 25 35 25Z" fill="#FFFFFF"/>
        <path d="M46 40H55V44.5C56.3 42 59.5 39.5 64.5 39.5C74 39.5 76 45.5 76 54V72H66V56C66 52 65 47 60 47C55 47 54 51 54 55.5V72H46V40Z" fill="#FFFFFF"/>
      </svg>
    `),
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'social',
    svgDataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="48" fill="#18171A"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M50 20C33.4 20 20 33.4 20 50C20 63.3 28.6 74.5 40.6 78.5C42.1 78.8 42.6 77.8 42.6 77C42.6 76.3 42.6 73.8 42.6 71.1C34.2 72.9 32.5 67.5 32.5 67.5C31.1 64 29.2 63.1 29.2 63.1C26.5 61.2 29.4 61.3 29.4 61.3C32.4 61.5 34 64.4 34 64.4C36.6 68.9 40.9 67.6 42.6 66.8C42.9 64.9 43.7 63.6 44.5 62.9C37.8 62.1 30.8 59.5 30.8 48C30.8 44.7 32 42 33.9 39.9C33.6 39.1 32.6 36 34.2 31.8C34.2 31.8 36.7 31 42.5 34.9C44.9 34.2 47.5 33.9 50 33.9C52.5 33.9 55.1 34.2 57.5 34.9C63.3 31 65.8 31.8 65.8 31.8C67.4 36 66.4 39.1 66.1 39.9C68 42 69.2 44.7 69.2 48C69.2 59.5 62.1 62.1 55.4 62.8C56.5 63.8 57.4 65.6 57.4 68.3C57.4 72.2 57.4 75.3 57.4 76.3C57.4 77.1 57.9 78.1 59.5 77.8C71.4 73.7 80 62.8 80 50C80 33.4 66.6 20 50 20Z" fill="#FFFFFF"/>
      </svg>
    `),
  },
  {
    id: 'youtube',
    name: 'YouTube',
    category: 'social',
    svgDataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="20" fill="#FF0000"/>
        <path d="M78 36C77.2 33 74.8 30.6 71.8 29.8C66.4 28.3 50 28.3 50 28.3C50 28.3 33.6 28.3 28.2 29.8C25.2 30.6 22.8 33 22 36C20.5 41.4 20.5 50 20.5 50C20.5 50 20.5 58.6 22 64C22.8 67 25.2 69.4 28.2 70.2C33.6 71.7 50 71.7 50 71.7C50 71.7 66.4 71.7 71.8 70.2C74.8 69.4 77.2 67 78 64C79.5 58.6 79.5 50 79.5 50C79.5 50 79.5 41.4 78 36Z" fill="#FFFFFF"/>
        <path d="M44 42L58 50L44 58V42Z" fill="#FF0000"/>
      </svg>
    `),
  },
  {
    id: 'x-twitter',
    name: 'X (Twitter)',
    category: 'social',
    svgDataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="48" fill="#0C0A0B"/>
        <path d="M62.5 28H71.5L51.8 50.5L75 81.2H56.9L42.7 62.6L26.5 81.2H17.5L38.6 57L16.5 28H35L47.8 45L62.5 28ZM59.3 75.8H64.3L32.4 33.2H27L59.3 75.8Z" fill="#FFFFFF"/>
      </svg>
    `),
  },
  {
    id: 'instagram',
    name: 'Instagram',
    category: 'social',
    svgDataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
        <defs>
          <radialGradient id="ig" cx="30%" cy="100%" r="130%">
            <stop offset="0%" stop-color="#FFDD55"/>
            <stop offset="25%" stop-color="#FF543E"/>
            <stop offset="60%" stop-color="#C837AB"/>
            <stop offset="100%" stop-color="#3771C8"/>
          </radialGradient>
        </defs>
        <rect width="100" height="100" rx="24" fill="url(#ig)"/>
        <rect x="24" y="24" width="52" height="52" rx="14" stroke="#FFFFFF" stroke-width="6"/>
        <circle cx="50" cy="50" r="13" stroke="#FFFFFF" stroke-width="6"/>
        <circle cx="65" cy="35" r="3.5" fill="#FFFFFF"/>
      </svg>
    `),
  },
  {
    id: 'email',
    name: 'Email / Mail',
    category: 'utility',
    svgDataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="48" fill="#18171A"/>
        <rect x="22" y="30" width="56" height="40" rx="6" stroke="#FFFFFF" stroke-width="5"/>
        <path d="M24 33L50 52L76 33" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>
      </svg>
    `),
  },
  {
    id: 'phone',
    name: 'Phone Call',
    category: 'utility',
    svgDataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="48" fill="#1F8A4C"/>
        <path d="M36 28C34 28 32 30 32 32C32 46 44 68 68 68C70 68 72 66 72 64V56C72 54 70 52 68 52L60 50C58 49.5 56 50.5 55 52L52 56C46 53 43 50 40 44L44 41C45.5 40 46.5 38 46 36L44 28C44 26 42 24 40 24L36 28Z" fill="#FFFFFF"/>
      </svg>
    `),
  },
  {
    id: 'bitcoin',
    name: 'Bitcoin (BTC)',
    category: 'crypto',
    svgDataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="48" fill="#F7931A"/>
        <path d="M64 43C65.5 39 63.5 35 58 34V26H52V33.5H47V26H41V33.5H33V39H37C38.5 39 39 39.5 39 41V59C39 60.5 38.5 61 37 61H33V66.5H41V74H47V66.5H52V74H58V66.5C65.5 65.5 68 61 67 56C66 52 63.5 49.5 60 48.5C62.5 47.5 64 45.5 64 43ZM47 40H55C57.5 40 59 41.5 59 44C59 46.5 57.5 48 55 48H47V40ZM56 60.5H47V52H56C58.5 52 60.5 53.5 60.5 56.5C60.5 59.5 58.5 60.5 56 60.5Z" fill="#FFFFFF"/>
      </svg>
    `),
  },
  {
    id: 'ethereum',
    name: 'Ethereum (ETH)',
    category: 'crypto',
    svgDataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="48" fill="#627EEA"/>
        <path d="M50 20L49.5 21.7V61L50 61.5L68 51L50 20Z" fill="#FFFFFF" fill-opacity="0.8"/>
        <path d="M50 20L32 51L50 61.5V20Z" fill="#FFFFFF"/>
        <path d="M50 65.5L49.7 65.9V79.6L50 80L68 55L50 65.5Z" fill="#FFFFFF" fill-opacity="0.8"/>
        <path d="M50 80V65.5L32 55L50 80Z" fill="#FFFFFF"/>
      </svg>
    `),
  },
  {
    id: 'solana',
    name: 'Solana (SOL)',
    category: 'crypto',
    svgDataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="48" fill="#0C0A0B"/>
        <path d="M28 35.5L35.5 28H76.5L69 35.5H28Z" fill="#14F195"/>
        <path d="M28 53.5L35.5 46H76.5L69 53.5H28Z" fill="#9945FF"/>
        <path d="M28 72L35.5 64.5H76.5L69 72H28Z" fill="#00C2FF"/>
      </svg>
    `),
  },
];

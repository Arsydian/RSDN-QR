# RSDN-QR — Customizable QR Code Studio

[![Version](https://img.shields.io/badge/version-1.0.0-D82125.svg)](https://arsydian.com)
[![License](https://img.shields.io/badge/license-MIT-0C0A0B.svg)](LICENSE)
[![Design](https://img.shields.io/badge/design_system-arsydian.com-D82125.svg)](https://arsydian.com)

Live at **[qr.arsydian.com](https://qr.arsydian.com)**.

**RSDN-QR** is a high-performance, client-side web application for generating fully customized, print-ready QR codes with dynamic format builders, custom dot and corner geometry, linear/radial gradients, safe logo overlays, real-time scannability health analytics, and high-volume batch CSV export.

Styled strictly in accordance with the **Arsydian Design System** (`arsydian.com`), featuring precision technical borders, Arsydian Crimson accents (`#D82125`), Deep Obsidian surfaces, and Montserrat + Inter typography.

---

## Key Features

- **10 Standard & Advanced Payload Types**:
  - 🌐 **Website / Link** (with automatic https prefixing)
  - 📄 **Plain Text** (raw text / markdown / instructions)
  - ✉️ **Email** (`mailto:` with recipient, subject, and body)
  - 📞 **Phone Call** (`tel:` direct dialer)
  - 💬 **SMS Message** (`smsto:` with recipient and pre-filled message)
  - 📶 **Wi-Fi Network** (WPA/WPA2/WPA3, WEP, Open, and Hidden network flags)
  - 👤 **Contact Card** (Standard vCard 3.0 compatible with iOS & Android address books)
  - 📱 **WhatsApp** (Direct chat link with phone number and pre-filled text)
  - 🪙 **Crypto Wallet** (Bitcoin BIP 21, Ethereum and USDT ERC-20 payment links per EIP-681, and Solana Pay, with amount and memo)
  - 📅 **Calendar Event** (iCalendar / VEVENT with start/end time, location, and description)

- **Comprehensive Visual Customization**:
  - **Body Shapes**: Smooth Rounded, Circular Dots, Classy Matrix, Classy Rounded, Extra Rounded, and Classic Square.
  - **Corner Eyes**: Outer frame geometries (Rounded, Circular Ring, Sharp Square) and Inner ball shapes (Dot, Square).
  - **Color Engine**: Solid colors, 2-stop Linear gradients (with custom 0°–360° rotation slider), Radial gradients, and transparent backgrounds.
  - **Logo & Graphic Engine**: Custom image upload (PNG, SVG, JPG, WebP) + 17 built-in brand/utility icons, safe scaling slider (capped at 35% to guarantee camera readability), padding margin, and background dot clearance.
  - **Error Correction**: Reed-Solomon levels L (7%), M (15%), Q (25%), and H (30%).

- **Real-Time Camera Scannability Health Meter**:
  - Live WCAG 2.1 contrast check using the weakest of the dot, corner and gradient colors, with a warning for inverted (light-on-dark) codes.
  - Logo cover calculated the way the renderer actually sizes logos, with advice on error correction levels.
  - Payload size in UTF-8 bytes, with a capacity check that explains when content is too long instead of failing.

- **High-Resolution & Vector Export**:
  - **Raster**: PNG and JPEG at 512px, 1024px (HD), 2048px (2K Print), and 4096px (4K Ultra Print-Ready).
  - **Vector**: Infinite-resolution scalable SVG for Illustrator and professional printing.
  - **1-Click Copy**: Direct copy to system clipboard.

- **High-Volume Batch CSV Processing**:
  - Drag-and-drop CSV upload with auto column detection, column mapping, and optional header row.
  - Table preview with per-row status and a sample dataset loader.
  - Duplicate-safe file names (non-English names are kept).
  - Client-side asynchronous generation and DEFLATE-compressed `.zip` archive export, with a report of any rows that failed.

- **Privacy-First, Zero-Server Architecture**:
  - All rendering and zip processing runs in local browser memory. QR content (links, Wi-Fi passwords, contacts) is never sent anywhere.
  - Fonts and images are self-hosted; the app makes no third-party requests.
  - The hosted site at qr.arsydian.com uses Cloudflare Web Analytics for cookie-free page-view counts, which never sees what you enter.

---

## Tech Stack

- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS + Arsydian Design Tokens + Lucide Icons + self-hosted Fontsource fonts
- **QR Rendering**: `qr-code-styling`
- **Compression**: `jszip` + `file-saver`
- **CSV Parsing**: `papaparse`
- **Color Parsing**: `colord`
- **Testing**: Vitest + React Testing Library

---

## Quick Start (Local Development)

```bash
# Clone the repository
git clone https://github.com/Arsydian/RSDN-QR.git
cd RSDN-QR

# Install dependencies
npm install

# Start local development server
npm run dev
```

The application will be running at `http://localhost:5173`.

---

## Automated Testing

Run the full Vitest suite:

```bash
npm test
```

---

## Cloudflare Pages Deployment (Production Build)

RSDN-QR is a 100% static single-page application and requires zero server configuration.

1. Build the production assets:
   ```bash
   npm run build
   ```
2. The output bundle will be located in the `dist/` directory.
3. Deploy to **Cloudflare Pages**:
   - **Framework preset**: None / Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Security headers (Content Security Policy, frame and referrer policies) and long-term caching for hashed assets are set in `public/_headers`, which Cloudflare Pages applies automatically.

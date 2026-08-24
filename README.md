# RSDN-QR — Customizable QR Code Studio

[![Version](https://img.shields.io/badge/version-1.0.0-D82125.svg)](https://arsydian.com)
[![License](https://img.shields.io/badge/license-MIT-0C0A0B.svg)](LICENSE)
[![Design](https://img.shields.io/badge/design_system-arsydian.com-D82125.svg)](https://arsydian.com)

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
  - 🪙 **Crypto Wallet** (Bitcoin, Ethereum, Solana, USDT URI schemes with amount and memo)
  - 📅 **Calendar Event** (iCalendar / VEVENT with start/end time, location, and description)

- **Comprehensive Visual Customization**:
  - **Body Shapes**: Smooth Rounded, Circular Dots, Classy Matrix, Classy Rounded, Extra Rounded, and Classic Square.
  - **Corner Eyes**: Outer frame geometries (Rounded, Circular Ring, Sharp Square) and Inner ball shapes (Dot, Square).
  - **Color Engine**: Solid colors, 2-stop Linear gradients (with custom 0°–360° rotation slider), Radial gradients, and transparent backgrounds.
  - **Logo & Graphic Engine**: Custom image upload (PNG, SVG, JPG, WebP) + 14 built-in brand/utility icons, safe scaling slider (capped at 35% to guarantee camera readability), padding margin, and background dot clearance.
  - **Error Correction**: Reed-Solomon levels L (7%), M (15%), Q (25%), and H (30%).

- **Real-Time Camera Scannability Health Meter**:
  - Live WCAG 2.1 contrast ratio calculator (e.g. `21.0:1 AAA Pass`).
  - Logo surface area occlusion monitoring against Error Correction capacity.
  - Payload character density checks with dynamic recommendations and warning badges.

- **High-Resolution & Vector Export**:
  - **Raster**: PNG and JPEG at 512px, 1024px (HD), 2048px (2K Print), and 4096px (4K Ultra Print-Ready).
  - **Vector**: Infinite-resolution scalable SVG for Illustrator and professional printing.
  - **1-Click Copy**: Direct copy to system clipboard.

- **High-Volume Batch CSV Processing**:
  - Drag-and-drop CSV upload with auto column detection.
  - Table preview with sample dataset loader.
  - Client-side asynchronous generation and compressed `.zip` archive export.

- **100% Privacy & Zero-Server Architecture**:
  - All rendering and zip processing executes strictly in local browser memory.
  - Zero data is transmitted to external servers.

---

## Tech Stack

- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS + Arsydian Design Tokens + Lucide Icons
- **QR Rendering**: `qr-code-styling`
- **Compression**: `jszip` + `file-saver`
- **CSV Parsing**: `papaparse`
- **Testing**: Vitest + React Testing Library

---

## Quick Start (Local Development)

```bash
# Clone or open repository
cd d:/Dev/RSDN-QR

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

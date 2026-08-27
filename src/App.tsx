/**
 * @file App.tsx
 * @description Main application controller and responsive two-column layout for RSDN-QR Studio.
 * Integrates real-time payload serialization, live canvas rendering, Arsydian design controls,
 * scannability health analytics, and CSV batch processing.
 */

import { useState, useMemo } from 'react';
import {
  FileCode,
  Shapes,
  Palette,
  Image as ImageIcon,
  ShieldCheck,
} from 'lucide-react';

// Types
import {
  QrType,
  QrPayloadState,
  QrDesignConfig,
} from './types/qr';

// Serializers & Analytics
import { serializeQrPayload } from './utils/payloadFormatters';
import { analyzeScannability } from './utils/scannability';

// Layout & Forms
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { TypeSelector } from './components/forms/TypeSelector';
import { UrlForm } from './components/forms/UrlForm';
import { TextForm } from './components/forms/TextForm';
import { EmailForm } from './components/forms/EmailForm';
import { PhoneForm } from './components/forms/PhoneForm';
import { SmsForm } from './components/forms/SmsForm';
import { WifiForm } from './components/forms/WifiForm';
import { VCardForm } from './components/forms/VCardForm';
import { WhatsAppForm } from './components/forms/WhatsAppForm';
import { CryptoForm } from './components/forms/CryptoForm';
import { EventForm } from './components/forms/EventForm';

// Design Editors
import { PatternControls } from './components/design/PatternControls';
import { ColorControls } from './components/design/ColorControls';
import { LogoControls } from './components/design/LogoControls';
import { ErrorCorrectionControls } from './components/design/ErrorCorrectionControls';

// Preview & Batch
import { QrPreviewPanel } from './components/preview/QrPreviewPanel';
import { BatchTab } from './components/batch/BatchTab';

// Default initial state
const INITIAL_PAYLOADS: QrPayloadState = {
  url: { url: 'https://arsydian.com' },
  text: { text: 'Arsydian IT & Security Services — No jargon, no finger-pointing.' },
  email: { email: '', subject: '', body: '' },
  phone: { phone: '' },
  sms: { phone: '', message: '' },
  wifi: { ssid: '', password: '', encryption: 'WPA', hidden: false },
  vcard: {
    firstName: '',
    lastName: '',
    organization: '',
    title: '',
    phoneMobile: '',
    phoneWork: '',
    email: '',
    url: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    note: '',
  },
  whatsapp: { phone: '', message: '' },
  crypto: { currency: 'bitcoin', address: '', amount: '', message: '' },
  event: {
    title: '',
    startDate: '',
    endDate: '',
    location: '',
    description: '',
  },
};

const INITIAL_DESIGN: QrDesignConfig = {
  width: 360,
  height: 360,
  margin: 12,
  errorCorrectionLevel: 'M',
  dotsOptions: {
    type: 'rounded',
    color: '#0C0A0B',
    useGradient: false,
  },
  cornersSquareOptions: {
    type: 'extra-rounded',
    color: '#D82125',
    useGradient: false,
  },
  cornersDotOptions: {
    type: 'dot',
    color: '#D82125',
    useGradient: false,
  },
  backgroundOptions: {
    color: '#FFFFFF',
    isTransparent: false,
  },
  imageOptions: {
    src: '',
    size: 0.22,
    margin: 4,
    hideBackgroundDots: true,
  },
};

type StudioSubTab = 'content' | 'pattern' | 'colors' | 'logo' | 'security';

export function App() {
  const [activeMode, setActiveMode] = useState<'single' | 'batch'>('single');
  const [activeType, setActiveType] = useState<QrType>('url');
  const [activeSubTab, setActiveSubTab] = useState<StudioSubTab>('content');

  const [payloads, setPayloads] = useState<QrPayloadState>(INITIAL_PAYLOADS);
  const [design, setDesign] = useState<QrDesignConfig>(INITIAL_DESIGN);

  // Compute active serialized payload string
  const activePayloadString = useMemo(() => {
    return serializeQrPayload(activeType, payloads);
  }, [activeType, payloads]);

  // Compute live scannability health report
  const scannabilityReport = useMemo(() => {
    return analyzeScannability(activePayloadString, design);
  }, [activePayloadString, design]);

  // Render form based on selected type
  const renderContentForm = () => {
    switch (activeType) {
      case 'url':
        return <UrlForm data={payloads.url} onChange={(url) => setPayloads({ ...payloads, url })} />;
      case 'text':
        return <TextForm data={payloads.text} onChange={(text) => setPayloads({ ...payloads, text })} />;
      case 'email':
        return <EmailForm data={payloads.email} onChange={(email) => setPayloads({ ...payloads, email })} />;
      case 'phone':
        return <PhoneForm data={payloads.phone} onChange={(phone) => setPayloads({ ...payloads, phone })} />;
      case 'sms':
        return <SmsForm data={payloads.sms} onChange={(sms) => setPayloads({ ...payloads, sms })} />;
      case 'wifi':
        return <WifiForm data={payloads.wifi} onChange={(wifi) => setPayloads({ ...payloads, wifi })} />;
      case 'vcard':
        return <VCardForm data={payloads.vcard} onChange={(vcard) => setPayloads({ ...payloads, vcard })} />;
      case 'whatsapp':
        return <WhatsAppForm data={payloads.whatsapp} onChange={(whatsapp) => setPayloads({ ...payloads, whatsapp })} />;
      case 'crypto':
        return <CryptoForm data={payloads.crypto} onChange={(crypto) => setPayloads({ ...payloads, crypto })} />;
      case 'event':
        return <EventForm data={payloads.event} onChange={(event) => setPayloads({ ...payloads, event })} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-ars-paper flex flex-col font-sans selection:bg-ars-red selection:text-white">
      {/* Header */}
      <Header activeMode={activeMode} onModeChange={setActiveMode} />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        
        {activeMode === 'batch' ? (
          /* CSV Batch Processing View */
          <div className="space-y-6">
            <BatchTab design={design} />
          </div>
        ) : (
          /* Single QR Code Studio View */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Form & Design Customizer (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Type Selector Pills */}
              <div className="ars-card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-display font-bold uppercase tracking-wider text-ars-ink">
                    1. Select QR Code Type
                  </span>
                  <span className="text-[11px] font-mono text-ars-grey-600">
                    10 Formats Supported
                  </span>
                </div>
                <TypeSelector
                  activeType={activeType}
                  onSelectType={(type) => {
                    setActiveType(type);
                    setActiveSubTab('content');
                  }}
                />
              </div>

              {/* Customization Tabs */}
              <div className="ars-card overflow-hidden">
                {/* Tab Header Bar */}
                <div className="flex items-center border-b border-ars-grey-200 bg-ars-grey-50 px-2 pt-2 gap-1 overflow-x-auto">
                  {(
                    [
                      { id: 'content', label: 'Content Data', icon: FileCode },
                      { id: 'pattern', label: 'Shapes & Eyes', icon: Shapes },
                      { id: 'colors', label: 'Colors & Gradients', icon: Palette },
                      { id: 'logo', label: 'Logo Overlay', icon: ImageIcon },
                      { id: 'security', label: 'Error Correction', icon: ShieldCheck },
                    ] as const
                  ).map(({ id, label, icon: Icon }) => {
                    const isActive = activeSubTab === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setActiveSubTab(id)}
                        className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-t-lg font-display font-bold text-xs transition-all border-t border-x -mb-px whitespace-nowrap ${
                          isActive
                            ? 'bg-ars-white text-ars-black border-ars-grey-200 shadow-ars-xs'
                            : 'border-transparent text-ars-grey-600 hover:text-ars-black hover:bg-ars-grey-100'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-ars-red' : 'text-ars-grey-400'}`} />
                        <span>{label}</span>
                        {id === 'logo' && design.imageOptions.src && (
                          <span className="w-1.5 h-1.5 rounded-full bg-ars-red" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Sub Tab Content Pane */}
                <div className="p-5">
                  {activeSubTab === 'content' && renderContentForm()}
                  {activeSubTab === 'pattern' && (
                    <PatternControls design={design} onChange={setDesign} />
                  )}
                  {activeSubTab === 'colors' && (
                    <ColorControls design={design} onChange={setDesign} />
                  )}
                  {activeSubTab === 'logo' && (
                    <LogoControls design={design} onChange={setDesign} />
                  )}
                  {activeSubTab === 'security' && (
                    <ErrorCorrectionControls design={design} onChange={setDesign} />
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Live Preview & Health Meter (5 cols) */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
              <QrPreviewPanel
                payloadString={activePayloadString}
                design={design}
                scannabilityReport={scannabilityReport}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;

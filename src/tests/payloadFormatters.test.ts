/**
 * @file payloadFormatters.test.ts
 * @description Unit tests for all 10 QR code data payload serializers.
 */

import { describe, it, expect } from 'vitest';
import {
  formatUrl,
  formatText,
  formatEmail,
  formatPhone,
  formatSms,
  formatWifi,
  formatVCard,
  formatWhatsApp,
  formatCrypto,
  formatEvent,
  serializeQrPayload,
} from '../utils/payloadFormatters';
import { QrPayloadState } from '../types/qr';

describe('Payload Formatters', () => {
  it('formats URLs correctly with https prefix when omitted', () => {
    expect(formatUrl({ url: 'arsydian.com' })).toBe('https://arsydian.com');
    expect(formatUrl({ url: 'http://custom.org/path' })).toBe('http://custom.org/path');
    expect(formatUrl({ url: 'https://example.com' })).toBe('https://example.com');
    expect(formatUrl({ url: '' })).toBe('');
  });

  it('formats Plain Text correctly', () => {
    expect(formatText({ text: 'Hello World' })).toBe('Hello World');
  });

  it('formats Email mailto URI correctly', () => {
    expect(formatEmail({ email: 'contact@arsydian.com', subject: 'Inquiry', body: 'Hello there' }))
      .toBe('mailto:contact@arsydian.com?subject=Inquiry&body=Hello+there');
    expect(formatEmail({ email: 'info@test.com', subject: '', body: '' }))
      .toBe('mailto:info@test.com');
  });

  it('formats Phone number correctly', () => {
    expect(formatPhone({ phone: '+1 (555) 019-2834' })).toBe('tel:+15550192834');
    expect(formatPhone({ phone: '' })).toBe('');
  });

  it('formats SMS smsto URI correctly', () => {
    expect(formatSms({ phone: '+1-555-4321', message: 'Ready to connect' }))
      .toBe('smsto:+15554321:Ready to connect');
  });

  it('formats Wi-Fi credentials with character escaping', () => {
    const wifi = formatWifi({
      ssid: 'Arsydian;Guest:Network',
      password: 'Pass;word,123',
      encryption: 'WPA',
      hidden: false,
    });
    expect(wifi).toBe('WIFI:T:WPA;S:Arsydian\\;Guest\\:Network;P:Pass\\;word\\,123;H:false;;');

    const openWifi = formatWifi({
      ssid: 'PublicHotspot',
      password: '',
      encryption: 'nopass',
      hidden: true,
    });
    expect(openWifi).toBe('WIFI:T:nopass;S:PublicHotspot;P:;H:true;;');
  });

  it('formats vCard 3.0 correctly', () => {
    const vcard = formatVCard({
      firstName: 'John',
      lastName: 'Doe',
      organization: 'Arsydian',
      title: 'Security Lead',
      phoneMobile: '+15551234567',
      phoneWork: '+15557654321',
      email: 'john@arsydian.com',
      url: 'https://arsydian.com',
      street: '100 Tech Blvd',
      city: 'Boston',
      state: 'MA',
      zip: '02108',
      country: 'USA',
      note: 'Verified contact',
    });

    expect(vcard).toContain('BEGIN:VCARD');
    expect(vcard).toContain('VERSION:3.0');
    expect(vcard).toContain('N:Doe;John;;;');
    expect(vcard).toContain('FN:John Doe');
    expect(vcard).toContain('ORG:Arsydian');
    expect(vcard).toContain('EMAIL;TYPE=PREF,INTERNET:john@arsydian.com');
    expect(vcard).toContain('ADR;TYPE=WORK:;;100 Tech Blvd;Boston;MA;02108;USA');
    expect(vcard).toContain('END:VCARD');
  });

  it('formats WhatsApp links correctly', () => {
    expect(formatWhatsApp({ phone: '+1 (555) 999-0000', message: 'Hello Arsydian' }))
      .toBe('https://wa.me/15559990000?text=Hello%20Arsydian');
  });

  it('formats Crypto URIs correctly', () => {
    expect(formatCrypto({ currency: 'bitcoin', address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', amount: '0.05', message: 'Payment' }))
      .toBe('bitcoin:1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa?amount=0.05&message=Payment');

    expect(formatCrypto({ currency: 'ethereum', address: '0x00000000219ab540356cbb839cbe05303d7705fa', amount: '1.5', message: '' }))
      .toBe('ethereum:0x00000000219ab540356cbb839cbe05303d7705fa?value=1.5');

    expect(formatCrypto({ currency: 'solana', address: 'SolanaWalletAddress123', amount: '10', message: '' }))
      .toBe('solana:SolanaWalletAddress123?amount=10');
  });

  it('formats Calendar Event correctly', () => {
    const event = formatEvent({
      title: 'Team Briefing',
      startDate: '2026-09-01T10:00',
      endDate: '2026-09-01T11:00',
      location: 'Virtual',
      description: 'Quarterly review',
    });

    expect(event).toContain('BEGIN:VEVENT');
    expect(event).toContain('SUMMARY:Team Briefing');
    expect(event).toContain('DTSTART:');
    expect(event).toContain('LOCATION:Virtual');
    expect(event).toContain('END:VEVENT');
  });

  it('dispatches serialized payload correctly through serializeQrPayload', () => {
    const state: QrPayloadState = {
      url: { url: 'https://arsydian.com' },
      text: { text: 'test text' },
      email: { email: 'test@example.com', subject: '', body: '' },
      phone: { phone: '1234567890' },
      sms: { phone: '1234567890', message: 'hi' },
      wifi: { ssid: 'Net', password: 'pwd', encryption: 'WPA', hidden: false },
      vcard: {
        firstName: 'Jane',
        lastName: 'Smith',
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
      whatsapp: { phone: '12345', message: '' },
      crypto: { currency: 'bitcoin', address: '123', amount: '', message: '' },
      event: { title: 'Meet', startDate: '', endDate: '', location: '', description: '' },
    };

    expect(serializeQrPayload('url', state)).toBe('https://arsydian.com');
    expect(serializeQrPayload('text', state)).toBe('test text');
  });
});

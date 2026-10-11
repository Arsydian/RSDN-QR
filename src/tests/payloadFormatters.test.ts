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
      .toBe('mailto:contact@arsydian.com?subject=Inquiry&body=Hello%20there');
    expect(formatEmail({ email: 'a@b.co', subject: 'Q&A + more', body: 'Line 1\nLine 2' }))
      .toBe('mailto:a@b.co?subject=Q%26A%20%2B%20more&body=Line%201%0D%0ALine%202');
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

  it('escapes vCard text values per RFC 2426', () => {
    const vcard = formatVCard({
      firstName: 'Ana', lastName: 'López, Jr.', organization: 'R&D; Labs', title: '', phoneMobile: '',
      phoneWork: '', email: '', url: 'https://example.com', street: '', city: '', state: '', zip: '',
      country: '', note: 'Line one\nSee https://example.com: "quoted"',
    });
    const lines = vcard.split('\n');
    expect(lines).toContain('N:López\\, Jr.;Ana;;;');
    expect(lines).toContain('ORG:R&D\\; Labs');
    expect(lines).toContain('URL:https://example.com');
    expect(lines).toContain('NOTE:Line one\\nSee https://example.com: "quoted"');
  });

  it('formats WhatsApp links correctly', () => {
    expect(formatWhatsApp({ phone: '+1 (555) 999-0000', message: 'Hello Arsydian' }))
      .toBe('https://wa.me/15559990000?text=Hello%20Arsydian');
  });

  it('formats Crypto URIs correctly', () => {
    expect(formatCrypto({ currency: 'bitcoin', address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', amount: '0.05', message: 'Payment' }))
      .toBe('bitcoin:1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa?amount=0.05&message=Payment');

    expect(formatCrypto({ currency: 'solana', address: 'SolanaWalletAddress123', amount: '10', message: '' }))
      .toBe('solana:SolanaWalletAddress123?amount=10');
  });

  it('formats Ethereum amounts in wei (EIP-681)', () => {
    const address = '0x00000000219ab540356cbb839cbe05303d7705fa';
    expect(formatCrypto({ currency: 'ethereum', address, amount: '1.5', message: '' }))
      .toBe(`ethereum:${address}?value=1500000000000000000`);
    expect(formatCrypto({ currency: 'ethereum', address, amount: '0.000000000000000001', message: '' }))
      .toBe(`ethereum:${address}?value=1`);
    expect(formatCrypto({ currency: 'ethereum', address, amount: '', message: '' })).toBe(`ethereum:${address}`);
    expect(formatCrypto({ currency: 'ethereum', address, amount: 'abc', message: '' })).toBe(`ethereum:${address}`);
  });

  it('formats USDT as an ERC-20 transfer (EIP-681)', () => {
    const address = '0x1111111111111111111111111111111111111111';
    expect(formatCrypto({ currency: 'usdt', address, amount: '25.5', message: '' }))
      .toBe(`ethereum:0xdAC17F958D2ee523a2206206994597C13D831ec7/transfer?address=${address}&uint256=25500000`);
    expect(formatCrypto({ currency: 'usdt', address, amount: '', message: '' }))
      .toBe(`ethereum:0xdAC17F958D2ee523a2206206994597C13D831ec7/transfer?address=${address}`);
  });

  it('formats Calendar Event correctly', () => {
    const event = formatEvent({
      title: 'Team Briefing',
      startDate: '2026-09-01T10:00',
      endDate: '2026-09-01T11:00',
      location: 'Virtual',
      description: 'Quarterly review',
    });

    // Local wall-clock time converted to UTC (the expectation follows the test machine's time zone)
    const utc = (local: string) => new Date(local).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

    expect(event).toContain('BEGIN:VEVENT');
    expect(event).toContain('SUMMARY:Team Briefing');
    expect(event).toContain(`DTSTART:${utc('2026-09-01T10:00')}`);
    expect(event).toContain(`DTEND:${utc('2026-09-01T11:00')}`);
    expect(event).toContain('LOCATION:Virtual');
    expect(event).toContain('END:VEVENT');
  });

  it('escapes iCalendar text without escaping colons (RFC 5545)', () => {
    const event = formatEvent({
      title: 'Kickoff, phase 1',
      startDate: '2026-09-01T10:00',
      endDate: '',
      location: 'https://zoom.us/j/123',
      description: 'Agenda:\n1. Intro; 2. Plan',
    });
    const lines = event.split('\n');
    expect(lines).toContain('SUMMARY:Kickoff\\, phase 1');
    expect(lines).toContain('LOCATION:https://zoom.us/j/123');
    expect(lines).toContain('DESCRIPTION:Agenda:\\n1. Intro\\; 2. Plan');
  });

  it('returns an empty payload for blank forms', () => {
    expect(formatText({ text: '   ' })).toBe('');
    expect(formatWifi({ ssid: '', password: 'secret', encryption: 'WPA', hidden: false })).toBe('');
    expect(formatVCard({
      firstName: '', lastName: '', organization: '', title: '', phoneMobile: '', phoneWork: '',
      email: '', url: '', street: '', city: '', state: '', zip: '', country: '', note: ' ',
    })).toBe('');
    expect(formatEvent({ title: '', startDate: '', endDate: '', location: 'Room 1', description: '' })).toBe('');
    expect(formatEvent({ title: '', startDate: '2026-09-01T10:00', endDate: '', location: '', description: '' }))
      .toContain('DTSTART:');
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

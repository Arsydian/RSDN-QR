/**
 * @file components.test.tsx
 * @description Component tests for the preview placeholder states and the export dialog's
 * keyboard and focus behaviour.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, within } from '@testing-library/react';
import { QrPreviewPanel } from '../components/preview/QrPreviewPanel';
import { ExportModal } from '../components/preview/ExportModal';
import { analyzeScannability } from '../utils/scannability';
import { QrDesignConfig } from '../types/qr';

const design: QrDesignConfig = {
  margin: 12,
  errorCorrectionLevel: 'M',
  dotsOptions: { type: 'rounded', color: '#0C0A0B', useGradient: false },
  cornersSquareOptions: { type: 'extra-rounded', color: '#D82125', useGradient: false },
  cornersDotOptions: { type: 'dot', color: '#D82125', useGradient: false },
  backgroundOptions: { color: '#FFFFFF', isTransparent: false },
  imageOptions: { src: '', size: 0.22, margin: 4, hideBackgroundDots: true },
};

const renderPreview = (payload: string) =>
  render(
    <QrPreviewPanel
      payloadString={payload}
      design={design}
      scannabilityReport={analyzeScannability(payload, design)}
    />
  );

afterEach(cleanup);

describe('QrPreviewPanel', () => {
  it('shows a placeholder and disables every action when the form is empty', () => {
    renderPreview('');
    expect(screen.getByText('Your QR code will appear here')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Copy to Clipboard/ })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Quick PNG/ })).toBeDisabled();
    expect(screen.getByRole('button', { name: /High-Resolution/ })).toBeDisabled();
  });

  it('explains instead of crashing when there is too much content', () => {
    renderPreview('x'.repeat(2400));
    const status = within(screen.getByRole('status'));
    expect(status.getByText('Too much content for one QR code')).toBeInTheDocument();
    expect(status.getByText(/2,400 of 2,331 bytes/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /High-Resolution/ })).toBeDisabled();
  });
});

describe('ExportModal', () => {
  const renderModal = (onClose = vi.fn()) => {
    render(<ExportModal isOpen onClose={onClose} payloadString="https://arsydian.com" design={design} />);
    return onClose;
  };

  it('is a labelled modal dialog that moves focus inside', () => {
    renderModal();
    const dialog = screen.getByRole('dialog', { name: 'Export High-Resolution QR Code' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
    expect(screen.getByRole('button', { name: 'Close export dialog' })).toBeInTheDocument();
    expect(screen.getByLabelText('File Name')).toHaveValue('rsdn-custom-qr');
  });

  it('closes on Escape', () => {
    const onClose = renderModal();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('keeps Tab focus inside the dialog', () => {
    renderModal();
    const dialog = screen.getByRole('dialog');
    const buttons = Array.from(dialog.querySelectorAll('button'));
    const last = buttons[buttons.length - 1];
    last.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(buttons[0]);
  });

  it('marks the selected format and warns that JPEG cannot be transparent', () => {
    render(
      <ExportModal
        isOpen
        onClose={vi.fn()}
        payloadString="x"
        design={{ ...design, backgroundOptions: { color: '#FFFFFF', isTransparent: true } }}
      />
    );
    const jpeg = screen.getByRole('button', { name: /JPEG Image/ });
    expect(jpeg).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(jpeg);
    expect(jpeg).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(/JPEG can't be transparent/)).toBeInTheDocument();
  });

  it('returns focus to the opener when closed', () => {
    const opener = document.createElement('button');
    document.body.appendChild(opener);
    opener.focus();
    const { rerender } = render(<ExportModal isOpen onClose={vi.fn()} payloadString="x" design={design} />);
    expect(document.activeElement).not.toBe(opener);
    rerender(<ExportModal isOpen={false} onClose={vi.fn()} payloadString="x" design={design} />);
    expect(document.activeElement).toBe(opener);
    opener.remove();
  });
});

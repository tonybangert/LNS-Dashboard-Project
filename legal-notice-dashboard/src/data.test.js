import { describe, it, expect } from 'vitest';
import { getBadgeClass, getFlags, formatCurrency, formatDate, STATUS_CONFIG } from './data';

describe('getBadgeClass', () => {
  it('returns correct class for each known status', () => {
    expect(getBadgeClass('Received')).toBe('badge-received');
    expect(getBadgeClass('On Hold')).toBe('badge-onhold');
    expect(getBadgeClass('Placed')).toBe('badge-placed');
    expect(getBadgeClass('Completed')).toBe('badge-completed');
    expect(getBadgeClass('Canceled')).toBe('badge-canceled');
  });

  it('returns badge-verified for run-verified statuses', () => {
    expect(getBadgeClass('1st Run Verified')).toBe('badge-verified');
    expect(getBadgeClass('3rd Run Verified')).toBe('badge-verified');
  });
});

describe('getFlags', () => {
  it('flags missing certificate of mailing', () => {
    const record = {
      CertificateOfMailingRequired: 'yes',
      CertificateOfMailingUploaded: 'no',
      InitialRunAmt: 100,
      NoticeStatusName: 'Placed',
    };
    const flags = getFlags(record);
    expect(flags).toEqual([{ type: 'warn', text: 'Cert missing' }]);
  });

  it('flags $0 amount for non-Received/non-Canceled notices', () => {
    const record = {
      CertificateOfMailingRequired: 'no',
      CertificateOfMailingUploaded: 'no',
      InitialRunAmt: 0,
      NoticeStatusName: 'Placed',
    };
    const flags = getFlags(record);
    expect(flags).toEqual([{ type: 'err', text: '$0 amt' }]);
  });

  it('does not flag $0 amount for Received status', () => {
    const record = {
      CertificateOfMailingRequired: 'no',
      CertificateOfMailingUploaded: 'no',
      InitialRunAmt: 0,
      NoticeStatusName: 'Received',
    };
    expect(getFlags(record)).toEqual([]);
  });

  it('returns empty array when no flags apply', () => {
    const record = {
      CertificateOfMailingRequired: 'no',
      CertificateOfMailingUploaded: 'yes',
      InitialRunAmt: 50,
      NoticeStatusName: 'Completed',
    };
    expect(getFlags(record)).toEqual([]);
  });
});

describe('formatCurrency', () => {
  it('formats a number as USD', () => {
    expect(formatCurrency(1234.5)).toBe('$1,234.50');
  });

  it('returns $0.00 for falsy values', () => {
    expect(formatCurrency(0)).toBe('$0.00');
    expect(formatCurrency(null)).toBe('$0.00');
    expect(formatCurrency(undefined)).toBe('$0.00');
  });
});

describe('formatDate', () => {
  it('returns empty string for invalid date markers', () => {
    expect(formatDate('')).toBe('');
    expect(formatDate('0')).toBe('');
    expect(formatDate('NaT')).toBe('');
    expect(formatDate(null)).toBe('');
  });

  it('formats a valid date string', () => {
    const result = formatDate('2024-01-15');
    expect(result).toContain('Jan');
    expect(result).toContain('2024');
  });
});

describe('STATUS_CONFIG', () => {
  it('contains all expected statuses', () => {
    expect(Object.keys(STATUS_CONFIG)).toContain('Received');
    expect(Object.keys(STATUS_CONFIG)).toContain('Completed');
    expect(Object.keys(STATUS_CONFIG)).toContain('On Hold');
  });

  it('has severity for each status', () => {
    for (const config of Object.values(STATUS_CONFIG)) {
      expect(['critical', 'warning', 'info', 'ok']).toContain(config.severity);
    }
  });
});

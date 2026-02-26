import rawData from '../data/notices.json';

/**
 * Expand compressed field names back to full names.
 * The JSON uses short keys to reduce file size.
 */
function expandRecord(r) {
  return {
    NoticeID: r.id,
    FirmTrackingNumber: r.ft,
    CourtCaseNumber: r.cc,
    CountyName: r.co,
    FirmName: r.fn,
    LegalDate: r.ld,
    NoticeStatusName: r.st,
    NoticeTypeName: r.nt,
    Plaintiff: r.pl,
    Defendant: r.de,
    InitialRunAmt: r.ia,
    FinalRunAmt: r.fa,
    CreatedOn: r.cr,
    FirstNewspaperName: r.np,
    LegalFirstRunDate: r.r1,
    LegalSecondRunDate: r.r2,
    LegalThirdRunDate: r.r3,
    LegalFourthRunDate: r.r4,
    LegalFifthRunDate: r.r5,
    LegalSixthRunDate: r.r6,
    CertificateOfMailingRequired: r.cmr,
    CertificateOfMailingUploaded: r.cmu,
    FiledCertificateOfPublication: r.fcp,
    SubmittedBy: r.sb,
  };
}

export const DATA = rawData.map(expandRecord);

/**
 * Status configuration: severity, display order, description
 */
export const STATUS_CONFIG = {
  Received: { severity: 'critical', order: 0, desc: 'New — needs assignment' },
  'On Hold': { severity: 'warning', order: 1, desc: 'Blocked — needs attention' },
  '1st Run Verified': { severity: 'info', order: 2, desc: 'In progress' },
  '2nd Run Verified': { severity: 'info', order: 3, desc: 'In progress' },
  '3rd Run Verified': { severity: 'info', order: 4, desc: 'In progress' },
  '4th Run Verified': { severity: 'info', order: 5, desc: 'In progress' },
  '5th Run Verified': { severity: 'info', order: 6, desc: 'In progress' },
  Canceled: { severity: 'warning', order: 7, desc: 'Review needed' },
  Placed: { severity: 'ok', order: 8, desc: 'On track' },
  Completed: { severity: 'ok', order: 9, desc: 'Done' },
};

/**
 * Map status name to CSS badge class
 */
export function getBadgeClass(status) {
  if (status === 'Received') return 'badge-received';
  if (status === 'On Hold') return 'badge-onhold';
  if (status === 'Placed') return 'badge-placed';
  if (status === 'Completed') return 'badge-completed';
  if (status === 'Canceled') return 'badge-canceled';
  return 'badge-verified';
}

/**
 * Generate flags/alerts for a given record
 */
export function getFlags(record) {
  const flags = [];
  if (
    record.CertificateOfMailingRequired === 'yes' &&
    record.CertificateOfMailingUploaded === 'no'
  ) {
    flags.push({ type: 'warn', text: 'Cert missing' });
  }
  if (
    record.InitialRunAmt === 0 &&
    record.NoticeStatusName !== 'Received' &&
    record.NoticeStatusName !== 'Canceled'
  ) {
    flags.push({ type: 'err', text: '$0 amt' });
  }
  return flags;
}

/**
 * Format a number as USD currency
 */
export function formatCurrency(value) {
  return value
    ? '$' +
        Number(value).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
    : '$0.00';
}

/**
 * Format a date string for display
 */
export function formatDate(d) {
  if (!d || d === '0' || d === 'NaT') return '';
  try {
    return new Date(d).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return d;
  }
}

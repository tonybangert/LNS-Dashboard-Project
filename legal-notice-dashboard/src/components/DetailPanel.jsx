import { getBadgeClass, getFlags, formatCurrency, formatDate } from '../data';

export default function DetailPanel({ record, onClose }) {
  const runs = [
    ['Run 1', record.LegalFirstRunDate],
    ['Run 2', record.LegalSecondRunDate],
    ['Run 3', record.LegalThirdRunDate],
    ['Run 4', record.LegalFourthRunDate],
    ['Run 5', record.LegalFifthRunDate],
    ['Run 6', record.LegalSixthRunDate],
  ];
  const flags = getFlags(record);

  return (
    <div
      className="detail-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="detail-panel">
        {/* Header */}
        <div className="detail-header">
          <div>
            <div className="detail-id">Notice #{record.NoticeID}</div>
            <div style={{ marginTop: 5 }}>
              <span className={`badge ${getBadgeClass(record.NoticeStatusName)}`}>
                {record.NoticeStatusName}
              </span>
              {flags.map((f, i) => (
                <span
                  key={i}
                  className={`flag flag-${f.type}`}
                  style={{ marginLeft: 5 }}
                >
                  ⚠ {f.text}
                </span>
              ))}
            </div>
          </div>
          <button className="detail-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Case Information */}
        <div className="detail-section">
          <div className="detail-section-title">Case Information</div>
          <div className="detail-grid">
            <div className="detail-field">
              <label>Court Case #</label>
              <div className="val">{record.CourtCaseNumber}</div>
            </div>
            <div className="detail-field">
              <label>Firm Tracking #</label>
              <div className="val">{record.FirmTrackingNumber || '—'}</div>
            </div>
            <div className="detail-field">
              <label>County</label>
              <div className="val">{record.CountyName}</div>
            </div>
            <div className="detail-field">
              <label>Notice Type</label>
              <div className="val">{record.NoticeTypeName}</div>
            </div>
            <div className="detail-field">
              <label>Firm</label>
              <div className="val">{record.FirmName}</div>
            </div>
            <div className="detail-field">
              <label>Submitted By</label>
              <div className="val">{record.SubmittedBy || '—'}</div>
            </div>
            <div className="detail-field full-width">
              <label>Plaintiff</label>
              <div className="val">{record.Plaintiff || '—'}</div>
            </div>
            <div className="detail-field full-width">
              <label>Defendant</label>
              <div className="val">{record.Defendant || '—'}</div>
            </div>
          </div>
        </div>

        {/* Dates & Financials */}
        <div className="detail-section">
          <div className="detail-section-title">Dates & Financials</div>
          <div className="detail-grid">
            <div className="detail-field">
              <label>Created</label>
              <div className="val">{formatDate(record.CreatedOn)}</div>
            </div>
            <div className="detail-field">
              <label>Legal Date</label>
              <div className="val">{formatDate(record.LegalDate) || '—'}</div>
            </div>
            <div className="detail-field">
              <label>Initial Amount</label>
              <div className="val">{formatCurrency(record.InitialRunAmt)}</div>
            </div>
            <div className="detail-field">
              <label>Final Amount</label>
              <div className="val">{formatCurrency(record.FinalRunAmt)}</div>
            </div>
            <div className="detail-field">
              <label>Newspaper</label>
              <div className="val">{record.FirstNewspaperName || '—'}</div>
            </div>
          </div>
        </div>

        {/* Publication Runs */}
        <div className="detail-section">
          <div className="detail-section-title">Publication Runs</div>
          <div className="run-timeline">
            {runs.map(([label, date]) => (
              <div
                key={label}
                className={`run-item ${date ? 'filled' : 'empty'}`}
              >
                <div style={{ fontWeight: 600 }}>{label}</div>
                <div>{date ? formatDate(date) : '—'}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance */}
        <div className="detail-section">
          <div className="detail-section-title">Compliance</div>
          <div className="detail-grid">
            <div className="detail-field">
              <label>Cert Mailing Required</label>
              <div className="val">{record.CertificateOfMailingRequired}</div>
            </div>
            <div className="detail-field">
              <label>Cert Mailing Uploaded</label>
              <div
                className="val"
                style={{
                  color:
                    record.CertificateOfMailingRequired === 'yes' &&
                    record.CertificateOfMailingUploaded === 'no'
                      ? 'var(--red)'
                      : 'inherit',
                }}
              >
                {record.CertificateOfMailingUploaded}
                {record.CertificateOfMailingRequired === 'yes' &&
                  record.CertificateOfMailingUploaded === 'no' &&
                  ' ⚠'}
              </div>
            </div>
            <div className="detail-field">
              <label>Filed Cert of Publication</label>
              <div className="val">{record.FiledCertificateOfPublication}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

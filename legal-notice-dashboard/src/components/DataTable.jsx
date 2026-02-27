import { useCallback } from 'react';
import { getBadgeClass, getFlags, formatCurrency, formatDate } from '../data';

const PER_PAGE = 50;

export default function DataTable({
  filtered,
  sortCol,
  sortDir,
  onSort,
  page,
  onPageChange,
  onRowClick,
  title,
  showAlertFilter,
}) {
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const pageData = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const sortIndicator = (col) =>
    sortCol === col ? (sortDir === 'asc' ? ' ↑' : ' ↓') : '';

  const handleSort = useCallback(
    (col) => {
      if (sortCol === col) {
        onSort(col, sortDir === 'asc' ? 'desc' : 'asc');
      } else {
        onSort(col, 'asc');
      }
    },
    [sortCol, sortDir, onSort]
  );

  return (
    <div className="table-container">
      <div className="table-header-bar">
        <div className="table-title">
          {title || 'All Notices'}
          {showAlertFilter && ' — Certificate Missing'}
        </div>
        <div className="table-count">{filtered.length} notices</div>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('NoticeID')}>
                ID{sortIndicator('NoticeID')}
              </th>
              <th onClick={() => handleSort('NoticeStatusName')}>
                Status{sortIndicator('NoticeStatusName')}
              </th>
              <th onClick={() => handleSort('NoticeTypeName')}>
                Type{sortIndicator('NoticeTypeName')}
              </th>
              <th onClick={() => handleSort('CountyName')}>
                County{sortIndicator('CountyName')}
              </th>
              <th onClick={() => handleSort('FirmName')}>
                Firm{sortIndicator('FirmName')}
              </th>
              <th onClick={() => handleSort('CourtCaseNumber')}>
                Case #{sortIndicator('CourtCaseNumber')}
              </th>
              <th onClick={() => handleSort('CreatedOn')}>
                Created{sortIndicator('CreatedOn')}
              </th>
              <th onClick={() => handleSort('InitialRunAmt')}>
                Amount{sortIndicator('InitialRunAmt')}
              </th>
              <th>Flags</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((r) => {
              const flags = getFlags(r);
              return (
                <tr
                  key={r.NoticeID}
                  className="clickable-row"
                  onClick={() => onRowClick(r)}
                >
                  <td style={{ fontFamily: 'var(--m)', fontWeight: 600 }}>
                    {r.NoticeID}
                  </td>
                  <td>
                    <span
                      className={`badge ${getBadgeClass(r.NoticeStatusName)}`}
                    >
                      {r.NoticeStatusName}
                    </span>
                  </td>
                  <td>
                    {r.NoticeTypeName.replace('IL - ', '').replace('IL- ', '')}
                  </td>
                  <td>{r.CountyName}</td>
                  <td title={r.FirmName}>
                    {r.FirmName.length > 26
                      ? r.FirmName.slice(0, 26) + '…'
                      : r.FirmName}
                  </td>
                  <td style={{ fontFamily: 'var(--m)' }}>
                    {r.CourtCaseNumber}
                  </td>
                  <td>{formatDate(r.CreatedOn)}</td>
                  <td style={{ fontFamily: 'var(--m)' }}>
                    {formatCurrency(r.InitialRunAmt)}
                  </td>
                  <td>
                    {flags.map((f, i) => (
                      <span key={i} className={`flag flag-${f.type}`}>
                        {f.text}
                      </span>
                    ))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            disabled={page === 1}
            onClick={() => onPageChange(1)}
          >
            «
          </button>
          <button
            className="page-btn"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            ‹
          </button>
          <span className="page-info">
            Page {page} of {totalPages}
          </span>
          <button
            className="page-btn"
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            ›
          </button>
          <button
            className="page-btn"
            disabled={page === totalPages}
            onClick={() => onPageChange(totalPages)}
          >
            »
          </button>
        </div>
      )}
    </div>
  );
}

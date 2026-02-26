import React, { useState, useMemo, useCallback } from 'react';
import {
  DATA,
  STATUS_CONFIG,
  getBadgeClass,
  getFlags,
  formatCurrency,
  formatDate,
} from './data';
import DetailPanel from './DetailPanel';

const PER_PAGE = 50;

export default function App() {
  const [activeStatus, setActiveStatus] = useState(null);
  const [filterType, setFilterType] = useState('');
  const [filterCounty, setFilterCounty] = useState('');
  const [filterFirm, setFilterFirm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [page, setPage] = useState(1);
  const [sortCol, setSortCol] = useState('CreatedOn');
  const [sortDir, setSortDir] = useState('desc');
  const [showAlertFilter, setShowAlertFilter] = useState(false);

  // ---- Derived data ----

  const statusCounts = useMemo(() => {
    const counts = {};
    DATA.forEach((r) => {
      counts[r.NoticeStatusName] = (counts[r.NoticeStatusName] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => {
        const cfg = STATUS_CONFIG[name] || {
          severity: 'info',
          order: 99,
          desc: '',
        };
        return { name, count, ...cfg };
      })
      .sort((a, b) => a.order - b.order);
  }, []);

  const alertCount = useMemo(
    () =>
      DATA.filter(
        (r) =>
          r.CertificateOfMailingRequired === 'yes' &&
          r.CertificateOfMailingUploaded === 'no'
      ).length,
    []
  );

  const noticeTypes = useMemo(
    () => [...new Set(DATA.map((r) => r.NoticeTypeName))].sort(),
    []
  );
  const counties = useMemo(
    () => [...new Set(DATA.map((r) => r.CountyName))].sort(),
    []
  );
  const firms = useMemo(
    () => [...new Set(DATA.map((r) => r.FirmName))].sort(),
    []
  );

  const nonPlacedCount = useMemo(
    () =>
      DATA.filter(
        (r) =>
          r.NoticeStatusName !== 'Placed' &&
          r.NoticeStatusName !== 'Completed'
      ).length,
    []
  );

  // ---- Filtering & sorting ----

  const filtered = useMemo(() => {
    let result = DATA;
    if (activeStatus)
      result = result.filter((r) => r.NoticeStatusName === activeStatus);
    if (filterType)
      result = result.filter((r) => r.NoticeTypeName === filterType);
    if (filterCounty)
      result = result.filter((r) => r.CountyName === filterCounty);
    if (filterFirm)
      result = result.filter((r) => r.FirmName === filterFirm);
    if (showAlertFilter)
      result = result.filter(
        (r) =>
          r.CertificateOfMailingRequired === 'yes' &&
          r.CertificateOfMailingUploaded === 'no'
      );
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          String(r.NoticeID).includes(q) ||
          (r.CourtCaseNumber || '').toLowerCase().includes(q) ||
          (r.Plaintiff || '').toLowerCase().includes(q) ||
          (r.Defendant || '').toLowerCase().includes(q) ||
          (r.FirmName || '').toLowerCase().includes(q) ||
          (r.CountyName || '').toLowerCase().includes(q) ||
          (r.FirmTrackingNumber || '').toLowerCase().includes(q)
      );
    }
    // Sort
    result = [...result].sort((a, b) => {
      let va = a[sortCol];
      let vb = b[sortCol];
      if (sortCol === 'InitialRunAmt' || sortCol === 'FinalRunAmt') {
        va = Number(va) || 0;
        vb = Number(vb) || 0;
      } else {
        va = String(va || '');
        vb = String(vb || '');
      }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [
    activeStatus,
    filterType,
    filterCounty,
    filterFirm,
    searchQuery,
    sortCol,
    sortDir,
    showAlertFilter,
  ]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const pageData = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // ---- Summary data ----

  const topCounties = useMemo(() => {
    const c = {};
    filtered.forEach((r) => {
      c[r.CountyName] = (c[r.CountyName] || 0) + 1;
    });
    return Object.entries(c)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [filtered]);

  const topFirms = useMemo(() => {
    const c = {};
    filtered.forEach((r) => {
      c[r.FirmName] = (c[r.FirmName] || 0) + 1;
    });
    return Object.entries(c)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [filtered]);

  const totalRevenue = useMemo(
    () => filtered.reduce((s, r) => s + (Number(r.InitialRunAmt) || 0), 0),
    [filtered]
  );

  const maxCounty = topCounties.length ? topCounties[0][1] : 1;
  const maxFirm = topFirms.length ? topFirms[0][1] : 1;

  // ---- Handlers ----

  const handleSort = useCallback(
    (col) => {
      if (sortCol === col) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortCol(col);
        setSortDir('asc');
      }
    },
    [sortCol]
  );

  const clearFilters = () => {
    setActiveStatus(null);
    setFilterType('');
    setFilterCounty('');
    setFilterFirm('');
    setSearchQuery('');
    setShowAlertFilter(false);
    setPage(1);
  };

  const handleStatusClick = (name) => {
    setActiveStatus((prev) => (prev === name ? null : name));
    setPage(1);
  };

  const sortIndicator = (col) =>
    sortCol === col ? (sortDir === 'asc' ? ' ↑' : ' ↓') : '';

  const hasFilters =
    activeStatus ||
    filterType ||
    filterCounty ||
    filterFirm ||
    searchQuery ||
    showAlertFilter;

  // ---- Render ----

  return (
    <div className="app">
      {/* Header */}
      <div className="header">
        <h1>
          Legal Notice <span>Intelligence</span>
        </h1>
        <div className="header-meta">
          <div className="header-stat">
            Total: <strong>{DATA.length}</strong>
          </div>
          <div className="header-stat">
            Attention:{' '}
            <strong style={{ color: 'var(--amb)' }}>{nonPlacedCount}</strong>
          </div>
          <div className="header-stat">
            Revenue: <strong>{formatCurrency(totalRevenue)}</strong>
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      {alertCount > 0 && (
        <div
          className="alert-banner"
          onClick={() => {
            setShowAlertFilter((v) => !v);
            setPage(1);
          }}
        >
          <div className="alert-dot" />
          <strong>{alertCount} notices</strong> require Certificate of Mailing
          but haven't uploaded it
          {showAlertFilter && (
            <span style={{ marginLeft: 'auto', fontSize: 10 }}>✕ Clear</span>
          )}
        </div>
      )}

      {/* Status Tiles */}
      <div className="status-grid">
        {statusCounts.map((s) => (
          <div
            key={s.name}
            className={`status-tile sev-${s.severity} ${
              activeStatus === s.name ? 'active' : ''
            }`}
            onClick={() => handleStatusClick(s.name)}
          >
            <div className="tile-count">{s.count}</div>
            <div className="tile-label">{s.name}</div>
            <div className="tile-sub">{s.desc}</div>
          </div>
        ))}
      </div>

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <a onClick={clearFilters}>All Notices</a>
        {activeStatus && (
          <>
            <span className="sep">›</span>
            <span>{activeStatus}</span>
          </>
        )}
        {showAlertFilter && (
          <>
            <span className="sep">›</span>
            <span style={{ color: 'var(--amb)' }}>Cert Missing</span>
          </>
        )}
      </div>

      {/* Filters Bar */}
      <div className="filters-bar">
        <input
          className="search-input"
          placeholder="Search ID, case #, plaintiff, defendant, firm…"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
        />
        <div className="filter-group">
          <span className="filter-label">Type</span>
          <select
            className="filter-select"
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Types</option>
            {noticeTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <span className="filter-label">County</span>
          <select
            className="filter-select"
            value={filterCounty}
            onChange={(e) => {
              setFilterCounty(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Counties</option>
            {counties.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <span className="filter-label">Firm</span>
          <select
            className="filter-select"
            value={filterFirm}
            onChange={(e) => {
              setFilterFirm(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Firms</option>
            {firms.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
        {hasFilters && (
          <button className="clear-btn" onClick={clearFilters}>
            Clear All
          </button>
        )}
      </div>

      {/* Data Table */}
      <div className="table-container">
        <div className="table-header-bar">
          <div className="table-title">
            {activeStatus || 'All Notices'}
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
                    onClick={() => setSelectedRecord(r)}
                  >
                    <td style={{ fontFamily: 'var(--m)', fontWeight: 600 }}>
                      {r.NoticeID}
                    </td>
                    <td>
                      <span
                        className={`badge ${getBadgeClass(
                          r.NoticeStatusName
                        )}`}
                      >
                        {r.NoticeStatusName}
                      </span>
                    </td>
                    <td>
                      {r.NoticeTypeName.replace('IL - ', '').replace(
                        'IL- ',
                        ''
                      )}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="page-btn"
              disabled={page === 1}
              onClick={() => setPage(1)}
            >
              «
            </button>
            <button
              className="page-btn"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ‹
            </button>
            <span className="page-info">
              Page {page} of {totalPages}
            </span>
            <button
              className="page-btn"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              ›
            </button>
            <button
              className="page-btn"
              disabled={page === totalPages}
              onClick={() => setPage(totalPages)}
            >
              »
            </button>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card">
          <h3>Top Counties (filtered)</h3>
          {topCounties.map(([name, count]) => (
            <div className="summary-row" key={name}>
              <span className="summary-label">{name}</span>
              <div className="bar-container">
                <div
                  className="bar-fill"
                  style={{
                    width: `${(count / maxCounty) * 100}%`,
                    background: 'var(--cyan)',
                  }}
                />
              </div>
              <span className="summary-value">{count}</span>
            </div>
          ))}
        </div>
        <div className="summary-card">
          <h3>Top Firms (filtered)</h3>
          {topFirms.map(([name, count]) => (
            <div className="summary-row" key={name}>
              <span
                className="summary-label"
                title={name}
                style={{ maxWidth: 140 }}
              >
                {name.length > 22 ? name.slice(0, 22) + '…' : name}
              </span>
              <div className="bar-container">
                <div
                  className="bar-fill"
                  style={{
                    width: `${(count / maxFirm) * 100}%`,
                    background: 'var(--pur)',
                  }}
                />
              </div>
              <span className="summary-value">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Slide-out Panel */}
      {selectedRecord && (
        <DetailPanel
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}
    </div>
  );
}

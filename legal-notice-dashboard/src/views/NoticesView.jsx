import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  DATA,
  STATUS_CONFIG,
  formatCurrency,
} from '../data';
import StatusTilesGrid from '../components/StatusTilesGrid';
import FilterBar from '../components/FilterBar';
import DataTable from '../components/DataTable';
import DetailPanel from '../components/DetailPanel';

export default function NoticesView({ initialFilters, globalSearch }) {
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

  // Apply drill-down filters from dashboard
  useEffect(() => {
    if (!initialFilters) return;
    if (initialFilters.activeStatus) setActiveStatus(initialFilters.activeStatus);
    if (initialFilters.filterCounty) setFilterCounty(initialFilters.filterCounty);
    if (initialFilters.filterFirm) setFilterFirm(initialFilters.filterFirm);
    if (initialFilters.filterType) setFilterType(initialFilters.filterType);
    if (initialFilters.showAlertFilter) setShowAlertFilter(true);
    setPage(1);
  }, [initialFilters]);

  // Apply global search from header bar
  useEffect(() => {
    if (globalSearch !== undefined) {
      setSearchQuery(globalSearch);
      setPage(1);
    }
  }, [globalSearch]);

  // Derived data
  const statusCounts = useMemo(() => {
    const counts = {};
    DATA.forEach((r) => {
      counts[r.NoticeStatusName] = (counts[r.NoticeStatusName] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => {
        const cfg = STATUS_CONFIG[name] || { severity: 'info', order: 99, desc: '' };
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

  // Filtering & sorting
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

  const totalRevenue = useMemo(
    () => filtered.reduce((s, r) => s + (Number(r.InitialRunAmt) || 0), 0),
    [filtered]
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

  const handleSort = useCallback((col, dir) => {
    setSortCol(col);
    setSortDir(dir);
  }, []);

  const hasFilters =
    activeStatus || filterType || filterCounty || filterFirm || searchQuery || showAlertFilter;

  return (
    <div className="notices-view">
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
          but haven&apos;t uploaded it
          {showAlertFilter && (
            <span style={{ marginLeft: 'auto', fontSize: 10 }}>✕ Clear</span>
          )}
        </div>
      )}

      {/* Status Tiles */}
      <StatusTilesGrid
        statusCounts={statusCounts}
        activeStatus={activeStatus}
        onStatusClick={handleStatusClick}
      />

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <a onClick={clearFilters}>All Notices</a>
        {activeStatus && (
          <>
            <span className="sep">›</span>
            <span>{activeStatus}</span>
          </>
        )}
        {filterCounty && (
          <>
            <span className="sep">›</span>
            <span>{filterCounty}</span>
          </>
        )}
        {filterFirm && (
          <>
            <span className="sep">›</span>
            <span style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block', verticalAlign: 'bottom' }}>{filterFirm}</span>
          </>
        )}
        {showAlertFilter && (
          <>
            <span className="sep">›</span>
            <span style={{ color: 'var(--amb)' }}>Cert Missing</span>
          </>
        )}
      </div>

      {/* Summary bar */}
      <div className="notices-summary-bar">
        <span>
          <strong>{filtered.length}</strong> notices
        </span>
        <span>
          Revenue: <strong>{formatCurrency(totalRevenue)}</strong>
        </span>
      </div>

      {/* Filters Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={(v) => { setSearchQuery(v); setPage(1); }}
        filterType={filterType}
        onFilterTypeChange={(v) => { setFilterType(v); setPage(1); }}
        filterCounty={filterCounty}
        onFilterCountyChange={(v) => { setFilterCounty(v); setPage(1); }}
        filterFirm={filterFirm}
        onFilterFirmChange={(v) => { setFilterFirm(v); setPage(1); }}
        noticeTypes={noticeTypes}
        counties={counties}
        firms={firms}
        hasFilters={hasFilters}
        onClearFilters={clearFilters}
      />

      {/* Data Table */}
      <DataTable
        filtered={filtered}
        sortCol={sortCol}
        sortDir={sortDir}
        onSort={handleSort}
        page={page}
        onPageChange={setPage}
        onRowClick={setSelectedRecord}
        title={activeStatus || 'All Notices'}
        showAlertFilter={showAlertFilter}
      />

      {/* Detail Panel */}
      {selectedRecord && (
        <DetailPanel
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}
    </div>
  );
}

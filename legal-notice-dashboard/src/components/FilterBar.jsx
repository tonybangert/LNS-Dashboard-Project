export default function FilterBar({
  searchQuery,
  onSearchChange,
  filterType,
  onFilterTypeChange,
  filterCounty,
  onFilterCountyChange,
  filterFirm,
  onFilterFirmChange,
  noticeTypes,
  counties,
  firms,
  hasFilters,
  onClearFilters,
}) {
  return (
    <div className="filters-bar">
      <input
        className="search-input"
        placeholder="Search ID, case #, plaintiff, defendant, firm…"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <div className="filter-group">
        <span className="filter-label">Type</span>
        <select
          className="filter-select"
          value={filterType}
          onChange={(e) => onFilterTypeChange(e.target.value)}
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
          onChange={(e) => onFilterCountyChange(e.target.value)}
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
          onChange={(e) => onFilterFirmChange(e.target.value)}
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
        <button className="clear-btn" onClick={onClearFilters}>
          Clear All
        </button>
      )}
    </div>
  );
}

const VIEW_TITLES = {
  dashboard: 'Dashboard',
  notices: 'Notice Explorer',
};

export default function HeaderBar({
  activeView,
  globalSearch,
  onSearchChange,
  alertCount,
  onAlertClick,
}) {
  return (
    <header className="header-bar">
      <h1 className="header-bar-title">{VIEW_TITLES[activeView]}</h1>

      <div className="header-bar-actions">
        <input
          className="header-search"
          type="text"
          placeholder="Search all notices…"
          value={globalSearch}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {alertCount > 0 && (
          <button className="header-alert-btn" onClick={onAlertClick}>
            <span className="alert-dot-sm" />
            {alertCount}
          </button>
        )}
      </div>
    </header>
  );
}

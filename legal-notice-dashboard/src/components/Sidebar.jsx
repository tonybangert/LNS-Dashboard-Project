const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '◫' },
  { id: 'notices', label: 'Notice Explorer', icon: '☰' },
];

export default function Sidebar({
  activeView,
  collapsed,
  onToggle,
  onNavigate,
  alertCount,
}) {
  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && (
          <span className="sidebar-brand">
            LN<span className="brand-accent">I</span>
          </span>
        )}
        <button
          className="sidebar-toggle"
          onClick={onToggle}
          aria-label="Toggle sidebar"
        >
          {collapsed ? '»' : '«'}
        </button>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`sidebar-item ${activeView === item.id ? 'sidebar-item-active' : ''}`}
            onClick={() => onNavigate(item.id)}
            title={collapsed ? item.label : undefined}
          >
            <span className="sidebar-icon">{item.icon}</span>
            {!collapsed && <span className="sidebar-label">{item.label}</span>}
            {item.id === 'notices' && alertCount > 0 && (
              <span className="sidebar-badge">{alertCount}</span>
            )}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default function StatusTilesGrid({
  statusCounts,
  activeStatus,
  onStatusClick,
}) {
  return (
    <div className="status-grid">
      {statusCounts.map((s) => (
        <div
          key={s.name}
          className={`status-tile sev-${s.severity} ${
            activeStatus === s.name ? 'active' : ''
          }`}
          onClick={() => onStatusClick(s.name)}
        >
          <div className="tile-count">{s.count}</div>
          <div className="tile-label">{s.name}</div>
          <div className="tile-sub">{s.desc}</div>
        </div>
      ))}
    </div>
  );
}

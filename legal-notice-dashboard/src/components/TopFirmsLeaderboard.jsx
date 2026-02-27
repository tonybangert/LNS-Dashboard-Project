import { formatCurrency } from '../data';

export default function TopFirmsLeaderboard({ firms, onFirmClick }) {
  if (!firms.length) return null;
  const maxCount = firms[0].count;

  return (
    <div className="leaderboard">
      {firms.map((f, i) => (
        <div
          key={f.firm}
          className="leaderboard-row"
          onClick={() => onFirmClick?.(f.firm)}
          title={`${f.firm}: ${f.count} notices, ${formatCurrency(f.revenue)}`}
        >
          <span className="leaderboard-rank">{i + 1}</span>
          <div className="leaderboard-info">
            <span className="leaderboard-name">
              {f.firm.length > 28 ? f.firm.slice(0, 28) + '…' : f.firm}
            </span>
            <span className="leaderboard-meta">
              {f.count} notices · {formatCurrency(f.revenue)}
            </span>
          </div>
          <div className="leaderboard-bar-wrap">
            <div
              className="leaderboard-bar-fill"
              style={{ width: `${(f.count / maxCount) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

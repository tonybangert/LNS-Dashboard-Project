import { formatCurrency } from '../data';

const CARDS = [
  { key: 'total', label: 'Total Notices', severity: 'info', format: (v) => v },
  { key: 'active', label: 'Active', severity: 'warning', format: (v) => v },
  {
    key: 'revenue',
    label: 'Total Revenue',
    severity: 'ok',
    format: (v) => formatCurrency(v),
  },
  { key: 'alertCount', label: 'Alerts', severity: 'critical', format: (v) => v },
  {
    key: 'completionRate',
    label: 'Completion Rate',
    severity: 'ok',
    format: (v) => `${v}%`,
  },
];

export default function KPICards({ kpis }) {
  return (
    <div className="kpi-row">
      {CARDS.map((card) => (
        <div key={card.key} className={`kpi-card sev-border-${card.severity}`}>
          <div className="kpi-value">{card.format(kpis[card.key])}</div>
          <div className="kpi-label">{card.label}</div>
        </div>
      ))}
    </div>
  );
}

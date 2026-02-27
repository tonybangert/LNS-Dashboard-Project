import { STATUS_CONFIG } from './data';

/**
 * Compute executive KPI metrics from records.
 */
export function computeKPIs(records) {
  const total = records.length;
  const active = records.filter(
    (r) =>
      r.NoticeStatusName !== 'Completed' && r.NoticeStatusName !== 'Canceled'
  ).length;
  const revenue = records.reduce(
    (sum, r) => sum + (Number(r.InitialRunAmt) || 0),
    0
  );
  const alertCount = records.filter(
    (r) =>
      r.CertificateOfMailingRequired === 'yes' &&
      r.CertificateOfMailingUploaded === 'no'
  ).length;
  const completed = records.filter(
    (r) => r.NoticeStatusName === 'Completed'
  ).length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { total, active, revenue, alertCount, completionRate };
}

/**
 * Compute status distribution for donut chart.
 */
export function computeStatusDistribution(records) {
  const counts = {};
  records.forEach((r) => {
    counts[r.NoticeStatusName] = (counts[r.NoticeStatusName] || 0) + 1;
  });

  const FILL_MAP = {
    critical: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
    ok: '#10b981',
  };

  return Object.entries(counts)
    .map(([name, value]) => {
      const cfg = STATUS_CONFIG[name] || { severity: 'info', order: 99 };
      return {
        name,
        value,
        severity: cfg.severity,
        fill: FILL_MAP[cfg.severity] || '#3b82f6',
      };
    })
    .sort((a, b) => {
      const oa = STATUS_CONFIG[a.name]?.order ?? 99;
      const ob = STATUS_CONFIG[b.name]?.order ?? 99;
      return oa - ob;
    });
}

/**
 * Compute revenue by county for horizontal bar chart.
 */
export function computeRevenueByCounty(records, topN = 10) {
  const byCounty = {};
  records.forEach((r) => {
    byCounty[r.CountyName] =
      (byCounty[r.CountyName] || 0) + (Number(r.InitialRunAmt) || 0);
  });

  return Object.entries(byCounty)
    .map(([county, revenue]) => ({ county, revenue: Math.round(revenue * 100) / 100 }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, topN);
}

/**
 * Compute notices grouped by week for area chart.
 */
export function computeNoticesByPeriod(records) {
  const byWeek = {};

  records.forEach((r) => {
    if (!r.CreatedOn || r.CreatedOn === '0' || r.CreatedOn === 'NaT') return;
    const d = new Date(r.CreatedOn);
    if (isNaN(d.getTime())) return;
    // Get Monday of the week
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d);
    monday.setDate(diff);
    const key = monday.toISOString().slice(0, 10);

    if (!byWeek[key]) byWeek[key] = { count: 0, revenue: 0 };
    byWeek[key].count += 1;
    byWeek[key].revenue += Number(r.InitialRunAmt) || 0;
  });

  return Object.entries(byWeek)
    .map(([period, data]) => ({
      period,
      label: new Date(period).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      count: data.count,
      revenue: Math.round(data.revenue * 100) / 100,
    }))
    .sort((a, b) => a.period.localeCompare(b.period));
}

/**
 * Compute top firms ranked by notice count and revenue.
 */
export function computeTopFirms(records, topN = 8) {
  const byFirm = {};
  records.forEach((r) => {
    if (!byFirm[r.FirmName]) byFirm[r.FirmName] = { count: 0, revenue: 0 };
    byFirm[r.FirmName].count += 1;
    byFirm[r.FirmName].revenue += Number(r.InitialRunAmt) || 0;
  });

  return Object.entries(byFirm)
    .map(([firm, data]) => ({
      firm,
      count: data.count,
      revenue: Math.round(data.revenue * 100) / 100,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
}

/**
 * Compute pipeline stages — collapses verified statuses into one stage.
 * TODO(human): Implement this function
 */
// eslint-disable-next-line no-unused-vars
export function computePipelineStages(records) {
  // TODO(human): Implement pipeline stage grouping logic
  // See the Learn by Doing request below for guidance
  return [];
}

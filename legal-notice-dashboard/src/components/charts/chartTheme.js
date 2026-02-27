/**
 * Shared Recharts theme — hex colors because SVG doesn't resolve CSS vars.
 */

export const COLORS = {
  red: '#ef4444',
  amber: '#f59e0b',
  blue: '#3b82f6',
  green: '#10b981',
  purple: '#8b5cf6',
  cyan: '#06b6d4',
  bg0: '#080c14',
  bg1: '#0f1623',
  bg2: '#171f30',
  bg3: '#1e2940',
  text1: '#e8ecf4',
  text2: '#8b96b0',
  text3: '#5c6780',
  border: '#2a3650',
};

export const STATUS_COLORS = {
  Received: COLORS.red,
  'On Hold': COLORS.amber,
  Verified: COLORS.blue,
  '1st Run Verified': COLORS.blue,
  '2nd Run Verified': COLORS.blue,
  '3rd Run Verified': COLORS.blue,
  '4th Run Verified': COLORS.blue,
  '5th Run Verified': COLORS.blue,
  Placed: COLORS.green,
  Completed: COLORS.green,
  Canceled: COLORS.purple,
};

export const TOOLTIP_STYLE = {
  contentStyle: {
    background: COLORS.bg2,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 8,
    fontSize: 12,
    color: COLORS.text1,
    fontFamily: "'DM Sans', sans-serif",
  },
  itemStyle: {
    color: COLORS.text2,
  },
  cursor: { fill: 'rgba(59, 130, 246, 0.06)' },
};

export const AXIS_STYLE = {
  tick: { fill: COLORS.text3, fontSize: 10 },
  axisLine: { stroke: COLORS.border },
  tickLine: false,
};

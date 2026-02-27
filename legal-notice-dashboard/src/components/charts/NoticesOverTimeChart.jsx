import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { TOOLTIP_STYLE, AXIS_STYLE, COLORS } from './chartTheme';

export default function NoticesOverTimeChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: 0 }}>
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLORS.cyan} stopOpacity={0.3} />
            <stop offset="95%" stopColor={COLORS.cyan} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={COLORS.border}
          vertical={false}
        />
        <XAxis dataKey="label" {...AXIS_STYLE} />
        <YAxis {...AXIS_STYLE} allowDecimals={false} />
        <Tooltip
          {...TOOLTIP_STYLE}
          formatter={(value, name) => [
            name === 'revenue'
              ? `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
              : value,
            name === 'revenue' ? 'Revenue' : 'Notices',
          ]}
        />
        <Area
          type="monotone"
          dataKey="count"
          stroke={COLORS.cyan}
          strokeWidth={2}
          fill="url(#areaGradient)"
          dot={{ fill: COLORS.cyan, r: 3, strokeWidth: 0 }}
          activeDot={{ r: 5, fill: COLORS.cyan }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { TOOLTIP_STYLE, AXIS_STYLE, COLORS } from './chartTheme';

export default function RevenueByCountyChart({ data, onBarClick }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 20, bottom: 4, left: 4 }}
      >
        <XAxis
          type="number"
          {...AXIS_STYLE}
          tickFormatter={(v) =>
            v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`
          }
        />
        <YAxis
          type="category"
          dataKey="county"
          width={110}
          {...AXIS_STYLE}
          tick={{ fill: COLORS.text2, fontSize: 11 }}
        />
        <Tooltip
          {...TOOLTIP_STYLE}
          formatter={(value) => [
            `$${Number(value).toLocaleString('en-US', {
              minimumFractionDigits: 2,
            })}`,
            'Revenue',
          ]}
        />
        <Bar
          dataKey="revenue"
          radius={[0, 4, 4, 0]}
          cursor="pointer"
          onClick={(entry) => onBarClick?.(entry?.county)}
        >
          {data.map((_, idx) => (
            <Cell
              key={idx}
              fill={idx === 0 ? COLORS.cyan : idx < 3 ? COLORS.blue : COLORS.text3}
              fillOpacity={0.8}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

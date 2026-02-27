import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { TOOLTIP_STYLE, COLORS } from './chartTheme';

export default function StatusDonutChart({ data, onSliceClick }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const total = data.reduce((s, d) => s + d.value, 0);

  const renderLabel = ({ cx, cy }) => (
    <text
      x={cx}
      y={cy}
      textAnchor="middle"
      dominantBaseline="central"
      fill={COLORS.text1}
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      <tspan x={cx} dy="-8" fontSize="22" fontWeight="700">
        {total}
      </tspan>
      <tspan x={cx} dy="20" fontSize="10" fill={COLORS.text3}>
        Total
      </tspan>
    </text>
  );

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={65}
          outerRadius={activeIndex !== null ? 105 : 100}
          dataKey="value"
          nameKey="name"
          onClick={(_, idx) => onSliceClick?.(data[idx]?.name)}
          onMouseEnter={(_, idx) => setActiveIndex(idx)}
          onMouseLeave={() => setActiveIndex(null)}
          stroke={COLORS.bg2}
          strokeWidth={2}
          style={{ cursor: 'pointer' }}
          labelLine={false}
          label={renderLabel}
        >
          {data.map((entry, idx) => (
            <Cell
              key={entry.name}
              fill={entry.fill}
              opacity={activeIndex !== null && activeIndex !== idx ? 0.5 : 1}
            />
          ))}
        </Pie>
        <Tooltip
          {...TOOLTIP_STYLE}
          formatter={(value, name) => [
            `${value} (${Math.round((value / total) * 100)}%)`,
            name,
          ]}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

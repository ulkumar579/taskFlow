import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import AnimatedCounter from './AnimatedCounter';

const data = [
  { name: 'High',       value: 16, pct: '38%', color: '#ef4444' },
  { name: 'Medium',     value: 14, pct: '33%', color: '#f97316' },
  { name: 'Low',        value: 8,  pct: '19%', color: '#22c55e' },
  { name: 'No Priority',value: 4,  pct: '10%', color: '#d1d5db' },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0];
    return (
      <div className="card px-3 py-2 text-xs font-medium" style={{ color: 'var(--color-text)' }}>
        <span style={{ color: d.payload.color }}>●</span> {d.name}: {d.value} tasks
      </div>
    );
  }
  return null;
};

export default function TasksByPriority() {
  const [hovered, setHovered] = useState(null);
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="card p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>
          Tasks by Priority
        </h2>
      </div>

      <div className="flex items-center gap-6">
        {/* Donut */}
        <div className="donut-wrapper relative w-44 h-44 shrink-0 transition-all duration-300">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                startAngle={90}
                endAngle={-270}
                paddingAngle={2}
                dataKey="value"
                onMouseEnter={(_, i) => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                strokeWidth={0}
                animationDuration={1000}
                animationEasing="ease-out"
              >
                {data.map((entry, i) => (
                  <Cell
                    key={entry.name}
                    fill={entry.color}
                    opacity={hovered === null || hovered === i ? 1 : 0.45}
                    style={{ transition: 'opacity .2s ease', cursor: 'pointer' }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
              <AnimatedCounter end={total} />
            </span>
            <span className="text-[11px]" style={{ color: 'var(--color-muted)' }}>Total Tasks</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 flex-1">
          {data.map((d, i) => (
            <div
              key={d.name}
              className="flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all duration-200"
              style={{ background: hovered === i ? `${d.color}14` : 'transparent' }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                <span className="text-sm" style={{ color: 'var(--color-text)' }}>{d.name}</span>
              </div>
              <span className="text-xs font-semibold" style={{ color: 'var(--color-muted)' }}>
                {d.value} ({d.pct})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

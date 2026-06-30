import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronDown } from 'lucide-react';

const data = [
  { name: 'Completed', value: 68, color: '#6366f1' },
  { name: 'In Progress', value: 20, color: '#3b82f6' },
  { name: 'On Hold',     value: 8,  color: '#f59e0b' },
  { name: 'Not Started', value: 4,  color: '#e5e7eb' },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0];
    return (
      <div className="card px-3 py-2 text-xs font-medium" style={{ color: 'var(--color-text)' }}>
        <span style={{ color: d.payload.color }}>●</span> {d.name}: {d.value}%
      </div>
    );
  }
  return null;
};

export default function ProjectOverview() {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="card p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>
          Project Overview
        </h2>
      </div>

      {/* Chart + Legend */}
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Donut */}
        <div className="donut-wrapper relative shrink-0 w-44 h-44 transition-all duration-300">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={70}
                startAngle={90}
                endAngle={-270}
                paddingAngle={2}
                dataKey="value"
                onMouseEnter={(_, i) => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                strokeWidth={0}
              >
                {data.map((entry, i) => (
                  <Cell
                    key={entry.name}
                    fill={entry.color}
                    opacity={hovered === null || hovered === i ? 1 : 0.5}
                    style={{ transition: 'opacity .2s ease', cursor: 'pointer' }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>68%</span>
            <span className="text-[11px]" style={{ color: 'var(--color-muted)' }}>Total Progress</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-3 flex-1 w-full">
          {data.map((d, i) => (
            <div
              key={d.name}
              className="flex items-center justify-between rounded-lg px-3 py-2 cursor-pointer transition-all duration-200"
              style={{
                background: hovered === i ? `${d.color}12` : 'transparent',
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ background: d.color }} />
                <span className="text-sm" style={{ color: 'var(--color-text)' }}>{d.name}</span>
              </div>
              <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                {d.value}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
        <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
          Overall project completion
        </p>
        <button className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border border-[var(--color-border)] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors" style={{ color: 'var(--color-text)' }}>
          This Month <ChevronDown size={12} />
        </button>
      </div>
    </div>
  );
}

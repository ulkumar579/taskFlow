import { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { ChevronDown } from 'lucide-react';

const weekData = [
  { day: 'Mon', value: 42 },
  { day: 'Tue', value: 58 },
  { day: 'Wed', value: 78 },
  { day: 'Thu', value: 65 },
  { day: 'Fri', value: 85 },
  { day: 'Sat', value: 52 },
  { day: 'Sun', value: 70 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="card px-4 py-3 text-sm min-w-[120px]">
        <p className="font-semibold text-indigo-600 text-base">{payload[0].value}%</p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>{label}</p>
      </div>
    );
  }
  return null;
};

const CustomDot = (props) => {
  const { cx, cy, payload } = props;
  if (payload.day !== 'Wed') return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r={6} fill="#6366f1" stroke="#fff" strokeWidth={2} />
    </g>
  );
};

export default function TeamProductivity() {
  return (
    <div className="card p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>
          Team Productivity
        </h2>
        <button className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border border-[var(--color-border)] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors" style={{ color: 'var(--color-text)' }}>
          This Week <ChevronDown size={12} />
        </button>
      </div>

      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={weekData} margin={{ top: 10, right: 6, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} />
            <YAxis
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 10, fill: 'var(--color-muted)' }}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#6366f1"
              strokeWidth={2.5}
              fill="url(#prodGrad)"
              dot={<CustomDot />}
              activeDot={{ r: 5, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

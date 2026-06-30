import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import AnimatedCounter from './AnimatedCounter';
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';

export default function AnalyticsCard({
  title,
  value,
  change,
  positive,
  icon: Icon,
  iconBg,
  iconColor,
  cardBg,
  borderColor,
  graphColor,
  graphData,
  delay = 0,
}) {
  return (
    <div
      className="analytics-card card flex flex-col p-5"
      style={{
        background: cardBg,
        borderColor,
        animationDelay: `${delay}ms`,
        animation: `fadeUp .7s cubic-bezier(.22,.61,.36,1) ${delay}ms both`,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div
            className="card-icon w-11 h-11 rounded-xl flex items-center justify-center mb-3"
            style={{ background: iconBg }}
          >
            <Icon size={20} style={{ color: iconColor }} />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: iconColor }}>
            {title}
          </p>
        </div>
        <button className="w-7 h-7 rounded-lg border border-[var(--color-border)] bg-white/60 flex items-center justify-center hover:bg-white transition-colors">
          <ArrowUpRight size={13} className="text-gray-400" />
        </button>
      </div>

      {/* Value */}
      <div className="mb-1">
        <span className="text-4xl font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>
          <AnimatedCounter end={value} duration={1400} />
        </span>
      </div>

      {/* Change */}
      <div className="flex items-center gap-1 mb-4">
        {positive ? (
          <TrendingUp size={13} className="text-emerald-500" />
        ) : (
          <TrendingDown size={13} className="text-red-400" />
        )}
        <span className={`text-xs font-medium ${positive ? 'text-emerald-600' : 'text-red-500'}`}>
          {change}
        </span>
        <span className="text-xs" style={{ color: 'var(--color-muted)' }}>from last month</span>
      </div>

      {/* Sparkline */}
      <div className="mini-graph h-16 -mx-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={graphData} margin={{ top: 2, right: 4, left: 4, bottom: 2 }}>
            <defs>
              <linearGradient id={`grad-${title.replace(/\s/g,'')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={graphColor} stopOpacity={0.18} />
                <stop offset="95%" stopColor={graphColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={graphColor}
              strokeWidth={2}
              fill={`url(#grad-${title.replace(/\s/g,'')})`}
              dot={false}
              activeDot={{ r: 3, fill: graphColor }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

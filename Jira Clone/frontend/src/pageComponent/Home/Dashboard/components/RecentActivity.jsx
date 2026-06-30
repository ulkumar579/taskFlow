const activities = [
  {
    id: 1,
    user: 'Sarah',
    action: 'completed',
    tag: 'Design System',
    tagColor: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    time: '2 minutes ago',
    dotColor: '#6366f1',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1',
  },
  {
    id: 2,
    user: 'Mike',
    action: 'updated',
    tag: 'Landing Page',
    tagColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    time: '15 minutes ago',
    dotColor: '#3b82f6',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1',
  },
  {
    id: 3,
    user: 'Emma',
    action: 'created',
    tag: 'User Research',
    tagColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    time: '1 hour ago',
    dotColor: '#22c55e',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1',
  },
  {
    id: 4,
    user: 'John',
    action: 'commented on',
    tag: 'Mobile App',
    tagColor: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    time: '2 hours ago',
    dotColor: '#f97316',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1',
  },
];

export default function RecentActivity() {
  return (
    <div className="card p-6 h-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>
          Recent Activity
        </h2>
        <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
          View all
        </button>
      </div>

      <div className="flex flex-col gap-1 relative">
        {/* Vertical line */}
        <div
          className="absolute left-[18px] top-6 bottom-0 w-px"
          style={{ background: 'var(--color-border)' }}
        />

        {activities.map((item, idx) => (
          <div
            key={item.id}
            className="activity-item flex items-start gap-3 p-3 cursor-default"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            {/* Timeline dot */}
            <div className="relative shrink-0 z-10">
              <img
                src={item.avatar}
                alt={item.user}
                className="activity-avatar w-9 h-9 rounded-full object-cover ring-2 ring-white dark:ring-[#1e1e2e]"
              />
              <span
                className="timeline-dot absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-[#1e1e2e]"
                style={{ background: item.dotColor }}
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm leading-snug" style={{ color: 'var(--color-text)' }}>
                <span className="font-semibold">{item.user}</span>{' '}
                <span style={{ color: 'var(--color-muted)' }}>{item.action}</span>{' '}
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${item.tagColor}`}>
                  {item.tag}
                </span>
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
                {item.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

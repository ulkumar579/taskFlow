import { ChevronRight } from 'lucide-react';

const deadlines = [
  {
    id: 1,
    month: 'MAY',
    day: 22,
    title: 'Design System Audit',
    project: 'TaskFlow Redesign',
    daysLeft: 2,
    urgent: true,
    avatars: [
      'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=1',
      'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=1',
      'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=1',
    ],
    extra: 2,
  },
  {
    id: 2,
    month: 'MAY',
    day: 25,
    title: 'API Integration',
    project: 'Mobile App',
    daysLeft: 5,
    urgent: true,
    avatars: [
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=1',
      'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=1',
    ],
    extra: 3,
  },
  {
    id: 3,
    month: 'MAY',
    day: 28,
    title: 'User Testing',
    project: 'Marketing Website',
    daysLeft: 8,
    urgent: false,
    avatars: [
      'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=1',
      'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=1',
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=1',
    ],
    extra: 1,
  },
  {
    id: 4,
    month: 'MAY',
    day: 30,
    title: 'Content Strategy',
    project: 'Marketing Website',
    daysLeft: 10,
    urgent: false,
    avatars: [
      'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=1',
      'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=60&h=80&dpr=1',
    ],
    extra: 2,
  },
];

function AvatarGroup({ avatars, extra }) {
  return (
    <div className="deadline-avatar-group flex items-center">
      {avatars.slice(0, 3).map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          className="w-7 h-7 rounded-full object-cover ring-2 ring-white dark:ring-[#1e1e2e]"
          style={{ marginLeft: i === 0 ? 0 : -8, zIndex: avatars.length - i }}
        />
      ))}
      {extra > 0 && (
        <div
          className="w-7 h-7 rounded-full ring-2 ring-white dark:ring-[#1e1e2e] bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-[10px] font-semibold text-indigo-600 dark:text-indigo-300"
          style={{ marginLeft: -8, zIndex: 0 }}
        >
          +{extra}
        </div>
      )}
    </div>
  );
}

export default function UpcomingDeadlines() {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>
          Upcoming Deadlines
        </h2>
        <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-0.5">
          View all deadlines <ChevronRight size={12} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {deadlines.map((d, i) => (
          <div
            key={d.id}
            className="deadline-card card p-4 cursor-pointer"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-start gap-3">
              {/* Date badge */}
              <div
                className="deadline-date-badge flex flex-col items-center justify-center w-12 rounded-xl shrink-0 overflow-hidden"
                style={{
                  border: `2px solid ${d.urgent ? '#ef4444' : '#f97316'}`,
                }}
              >
                <span
                  className="text-[10px] font-bold w-full text-center py-0.5 text-white"
                  style={{ background: d.urgent ? '#ef4444' : '#f97316' }}
                >
                  {d.month}
                </span>
                <span
                  className="text-lg font-bold leading-none py-1"
                  style={{ color: d.urgent ? '#ef4444' : '#f97316' }}
                >
                  {d.day}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold leading-tight truncate" style={{ color: 'var(--color-text)' }}>
                  {d.title}
                </p>
                <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--color-muted)' }}>
                  {d.project}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-3 flex items-center justify-between">
              <AvatarGroup avatars={d.avatars} extra={d.extra} />
              <span
                className="text-xs font-semibold"
                style={{ color: d.urgent ? '#ef4444' : '#f97316' }}
              >
                {d.daysLeft} days left
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

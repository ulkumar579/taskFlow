export default function ProjectSkeleton() {
  return (
    <div className="card p-5 pl-7 overflow-hidden" style={{ borderRadius: 20 }}>
      {/* Priority badge skeleton */}
      <div className="flex items-center justify-between mb-4">
        <div className="skeleton h-3.5 w-24 rounded" />
        <div className="skeleton w-7 h-7 rounded-lg" />
      </div>

      {/* Icon + name */}
      <div className="flex items-start gap-3 mb-3">
        <div className="skeleton w-12 h-12 rounded-2xl shrink-0" />
        <div className="flex-1 pt-1 space-y-2">
          <div className="skeleton h-4 w-40 rounded" />
          <div className="skeleton h-3 w-28 rounded" />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1.5 mb-4">
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-3/4 rounded" />
      </div>

      {/* Avatars + % */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton w-7 h-7 rounded-full" style={{ marginLeft: i === 0 ? 0 : -8 }} />
          ))}
        </div>
        <div className="skeleton h-4 w-10 rounded" />
      </div>

      {/* Progress bar */}
      <div className="skeleton h-2 w-full rounded-full mb-4" />

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="skeleton h-3 w-28 rounded" />
        <div className="skeleton h-5 w-16 rounded-full" />
      </div>
    </div>
  );
}

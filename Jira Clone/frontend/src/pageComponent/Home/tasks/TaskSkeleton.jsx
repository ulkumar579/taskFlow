export default function TaskSkeleton() {
  return (
    <div
      className="flex items-center gap-4 px-5 py-4 rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden"
    >
      {/* Priority strip skeleton */}
      <div className="skeleton w-1 h-full absolute left-0 top-0 bottom-0 rounded-l-[18px]" style={{ width: 4 }} />

      {/* Checkbox */}
      <div className="skeleton w-5 h-5 rounded-md shrink-0" />

      {/* Icon */}
      <div className="skeleton w-10 h-10 rounded-xl shrink-0" />

      {/* Name + description */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="skeleton h-3.5 w-48 rounded" />
        <div className="skeleton h-2.5 w-72 rounded" />
      </div>

      {/* Project badge */}
      <div className="skeleton h-6 w-20 rounded-full hidden md:block" />

      {/* Status badge */}
      <div className="skeleton h-6 w-24 rounded-full hidden md:block" />

      {/* Due date */}
      <div className="hidden lg:flex flex-col gap-1">
        <div className="skeleton h-2.5 w-20 rounded" />
        <div className="skeleton h-2.5 w-14 rounded" />
      </div>

      {/* Avatars */}
      <div className="hidden sm:flex gap-1">
        <div className="skeleton w-7 h-7 rounded-full" />
        <div className="skeleton w-7 h-7 rounded-full" style={{ marginLeft: -10 }} />
      </div>

      {/* Meta */}
      <div className="hidden xl:flex items-center gap-4">
        <div className="skeleton h-3 w-8 rounded" />
        <div className="skeleton h-3 w-8 rounded" />
        <div className="skeleton h-3 w-8 rounded" />
      </div>

      {/* Menu */}
      <div className="skeleton w-8 h-8 rounded-lg shrink-0" />
    </div>
  );
}

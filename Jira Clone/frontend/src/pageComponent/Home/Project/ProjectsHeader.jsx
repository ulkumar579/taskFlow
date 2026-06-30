import { useEffect, useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';

export default function ProjectsHeader() {
  const [sparklePos, setSparklePos] = useState({ x: '20%', y: '30%' });

  useEffect(() => {
    let id;
    const move = () => {
      setSparklePos({
        x: `${10 + Math.random() * 80}%`,
        y: `${10 + Math.random() * 80}%`,
      });
      id = setTimeout(move, 2500 + Math.random() * 1500);
    };
    id = setTimeout(move, 2500);
    return () => clearTimeout(id);
  }, []);

  return (
    <div
      className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6"
      style={{ animation: 'slideUp .6s cubic-bezier(.22,.61,.36,1) both' }}
    >
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Projects
          </h1>
          <Sparkles size={22} className="text-yellow-400" fill="#facc15" />
        </div>
        <p className="mt-1 text-sm" style={{ color: 'var(--color-muted)' }}>
          Organize, track and deliver your projects efficiently 🎯
        </p>
      </div>

      {/* New Project btn */}
      <button className="new-project-btn self-start flex items-center gap-2 text-white font-semibold text-sm px-5 py-2.5 rounded-xl">
        {/* Sparkle inside button */}
        <span
          className="sparkle"
          style={{ top: sparklePos.y, left: sparklePos.x, transitionDuration: '1s' }}
        />
        <Plus size={17} className="btn-arrow" />
        New Project
        <Sparkles size={13} fill="rgba(255,255,255,.6)" className="text-white/60" />
      </button>
    </div>
  );
}

import Button from './Button';

const confettiPieces = [
  { color: '#fbbf24', left: '12%', delay: '0s',   duration: '3.2s', size: 7 },
  { color: '#a78bfa', left: '25%', delay: '0.5s',  duration: '2.8s', size: 5 },
  { color: '#34d399', left: '40%', delay: '1.1s',  duration: '3.5s', size: 6 },
  { color: '#f87171', left: '60%', delay: '0.3s',  duration: '2.5s', size: 8 },
  { color: '#60a5fa', left: '75%', delay: '0.9s',  duration: '3.1s', size: 5 },
  { color: '#fbbf24', left: '88%', delay: '0.7s',  duration: '2.9s', size: 6 },
  { color: '#f472b6', left: '18%', delay: '1.4s',  duration: '3.4s', size: 5 },
  { color: '#4ade80', left: '52%', delay: '0.2s',  duration: '2.7s', size: 7 },
];

export default function AchievementCard() {
  return (
    <div
      className="achievement-card card h-full flex flex-col items-center justify-center p-6 text-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #3730a3 50%, #4338ca 100%)',
        border: 'none',
        minHeight: 200,
      }}
    >
      {/* Confetti */}
      {confettiPieces.map((p, i) => (
        <span
          key={i}
          className="confetti-particle"
          style={{
            left: p.left,
            top: '-10px',
            width: p.size,
            height: p.size,
            background: p.color,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}

      {/* Trophy */}
      <div className="anim-float mb-4 relative z-10">
        <div className="text-6xl select-none">🏆</div>
        {/* Glow */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(251,191,36,.35) 0%, transparent 70%)',
            filter: 'blur(8px)',
          }}
        />
      </div>

      <h3 className="text-white font-bold text-lg mb-2 relative z-10">
        Great Progress! 🎉
      </h3>
      <p className="text-indigo-200 text-xs leading-relaxed mb-5 max-w-[200px] relative z-10">
        You&apos;ve completed 18% more tasks this week compared to last week.
      </p>

      <button
        className="shine-btn relative overflow-hidden bg-white text-indigo-700 font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-indigo-50 transition-all duration-200 hover:scale-105 z-10"
      >
        View Achievements
      </button>
    </div>
  );
}

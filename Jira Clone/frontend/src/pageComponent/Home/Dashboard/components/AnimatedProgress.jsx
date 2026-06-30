import { useState, useRef, useEffect } from 'react';

export default function AnimatedProgress({ value, color, delay = 0 }) {
  const [width, setWidth] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setWidth(value), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, delay]);

  return (
    <div ref={ref} className="progress-bar w-full">
      <div
        className="progress-fill"
        style={{
          width: `${width}%`,
          background: color,
          transitionDelay: `${delay}ms`,
        }}
      />
    </div>
  );
}

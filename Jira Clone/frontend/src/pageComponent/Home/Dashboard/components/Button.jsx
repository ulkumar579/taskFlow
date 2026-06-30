import { useRef } from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  ...props
}) {
  const btnRef = useRef(null);

  const handleClick = (e) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    const diameter = Math.max(rect.width, rect.height);
    ripple.className = 'btn-ripple';
    ripple.style.cssText = `
      width: ${diameter}px;
      height: ${diameter}px;
      left: ${e.clientX - rect.left - diameter / 2}px;
      top: ${e.clientY - rect.top - diameter / 2}px;
    `;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
    onClick?.(e);
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    secondary: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10',
    outline: 'border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300',
  };

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      className={`btn inline-flex items-center gap-2 font-medium rounded-xl ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

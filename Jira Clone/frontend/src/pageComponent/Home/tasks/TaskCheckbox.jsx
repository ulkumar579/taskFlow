import { useState, useRef, memo } from 'react';

const TaskCheckbox = memo(function TaskCheckbox({ checked, onChange }) {
  const [rippling, setRippling] = useState(false);
  const timeoutRef = useRef(null);

  const handleClick = () => {
    onChange(!checked);
    if (!checked) {
      setRippling(true);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setRippling(false), 480);
    }
  };

  return (
    <div className="task-checkbox-wrap" onClick={(e) => e.stopPropagation()}>
      <div
        className={`task-checkbox ${checked ? 'checked' : ''}`}
        onClick={handleClick}
        role="checkbox"
        aria-checked={checked}
        tabIndex={0}
        onKeyDown={(e) => e.key === ' ' && handleClick()}
      >
        {checked && (
          <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
            <path
              className="check-svg"
              d="M1 4L4 7.5L10 1"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="20"
            />
          </svg>
        )}
      </div>
      {rippling && <div className="checkbox-ripple" />}
    </div>
  );
});

export default TaskCheckbox;

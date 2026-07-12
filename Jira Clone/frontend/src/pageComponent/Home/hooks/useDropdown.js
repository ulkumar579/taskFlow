import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Coordinates multiple dropdowns so only one is open at a time.
 * Returns the active id, a toggle fn, an isOpen helper, and a close fn.
 * Closes on outside click or Escape.
 */
export function useDropdown() {
  const [openId, setOpenId] = useState(null);
  const containerRef = useRef(null);

  const toggle = useCallback((id) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);

  const close = useCallback(() => setOpenId(null), []);

  const isOpen = useCallback((id) => openId === id, [openId]);

  useEffect(() => {
    if (openId === null) return;
    const onMouseDown = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpenId(null);
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpenId(null);
    };
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [openId]);

  return { openId, toggle, close, isOpen, containerRef };
}

import { useEffect, useRef } from 'react';

/**
 * Subtle magnetic cursor. Hidden on touch devices. Expands over [data-magnetic] or interactive elements.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isFine = window.matchMedia('(pointer: fine)').matches;
    if (!isFine) return;
    document.documentElement.classList.add('has-custom-cursor');

    const dot = dotRef.current;
    const ring = ringRef.current;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx, ry = my;
    let raf = 0;

    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      if (dot) dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
    };
    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ring) ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    const onOver = (e) => {
      const target = e.target;
      if (!ring) return;
      if (target.closest && target.closest('a, button, [role="button"], input, textarea, select, [data-magnetic]')) {
        ring.dataset.hover = '1';
      } else {
        ring.dataset.hover = '0';
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        style={{
          position: 'fixed', left: 0, top: 0, width: 6, height: 6,
          background: 'hsl(var(--primary))', borderRadius: 9999,
          pointerEvents: 'none', zIndex: 9998, mixBlendMode: 'difference',
        }}
      />
      <div
        ref={ringRef}
        aria-hidden
        data-hover="0"
        style={{
          position: 'fixed', left: 0, top: 0, width: 36, height: 36,
          border: '1px solid hsl(var(--primary))', borderRadius: 9999,
          pointerEvents: 'none', zIndex: 9997,
          transition: 'width 200ms ease, height 200ms ease, border-color 200ms ease, background-color 200ms ease',
        }}
      />
      <style>{`
        [data-hover="1"] {
          width: 64px !important;
          height: 64px !important;
          background-color: hsl(var(--primary) / 0.12);
        }
      `}</style>
    </>
  );
}

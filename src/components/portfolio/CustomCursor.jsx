import { useEffect, useRef } from 'react';

// Evaluated once at module load — synchronous, no re-render needed.
// On touch/tablet devices this is false and the component renders nothing.
const HAS_FINE_POINTER =
  typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

/**
 * Subtle magnetic cursor. Renders only on devices that report a fine pointer
 * (mouse / trackpad). Returns null immediately on touch/tablet so no DOM nodes
 * are created and no event listeners are attached.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    // Guard covers SSR and any edge case where the module-level check ran
    // before the browser reported the correct pointer capability.
    if (!HAS_FINE_POINTER) return;
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

  // Don't mount any DOM nodes on touch/tablet — nothing to get stuck in a corner.
  if (!HAS_FINE_POINTER) return null;

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

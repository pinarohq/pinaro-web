import { useEffect, useState } from 'react';

export default function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="absolute left-0 right-0 bottom-0 h-px bg-border/40">
      <div
        className="h-full bg-primary transition-[width] duration-150 ease-out"
        style={{ width: `${p}%` }}
        aria-hidden
      />
    </div>
  );
}

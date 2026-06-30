import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RotateCw } from 'lucide-react';

/**
 * Interactive 404 — a tiny "catch the falling pixels" game.
 */
export default function NotFound() {
  const ref = useRef(null);
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(false);
  const [pos, setPos] = useState(50);
  const items = useRef([]);
  const raf = useRef(0);

  const reset = () => { setScore(0); items.current = []; setRunning(true); };

  useEffect(() => {
    if (!running) return;
    const W = 100, H = 100;
    let last = performance.now();
    let spawnT = 0;
    const tick = (t) => {
      const dt = (t - last) / 1000; last = t;
      spawnT += dt;
      if (spawnT > 0.6) { spawnT = 0; items.current.push({ x: Math.random() * 96 + 2, y: -2, v: 20 + Math.random() * 20 }); }
      items.current = items.current.map((it) => ({ ...it, y: it.y + it.v * dt })).filter((it) => {
        if (it.y > H + 5) return false;
        if (it.y > H - 8 && Math.abs(it.x - pos) < 9) { setScore((s) => s + 1); return false; }
        return true;
      });
      const el = ref.current;
      if (el) {
        el.querySelectorAll('[data-it]').forEach(n => n.remove());
        items.current.forEach((it) => {
          const d = document.createElement('div');
          d.dataset.it = '1';
          d.style.cssText = `position:absolute;left:${it.x}%;top:${it.y}%;width:8px;height:8px;background:hsl(var(--primary));border-radius:9999px;transform:translate(-50%,-50%);box-shadow:0 0 18px hsl(var(--primary)/0.7);`;
          el.appendChild(d);
        });
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [running, pos]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') setPos((p) => Math.max(4, p - 4));
      if (e.key === 'ArrowRight') setPos((p) => Math.min(96, p + 4));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="container-prem grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-5">
          <div className="font-mono text-xs uppercase tracking-widest text-primary">404 · lost</div>
          <h1 className="mt-3 font-display text-[clamp(5rem,18vw,12rem)] leading-[0.85] font-black tracking-tighter">
            4<span className="text-primary italic font-medium">0</span>4
          </h1>
          <p className="mt-6 max-w-md text-muted-foreground text-lg">
            This page wandered off. While you&rsquo;re here, catch some falling pixels with your arrow keys.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 font-semibold"><ArrowLeft className="h-4 w-4" /> Take me home</Link>
            <button onClick={reset} className="inline-flex items-center gap-2 rounded-full border border-border/80 px-5 py-2.5 font-semibold">
              <RotateCw className="h-4 w-4" /> {running ? 'Restart' : 'Play'}
            </button>
            <span className="font-mono text-sm">Score: <span className="text-primary">{score}</span></span>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div
            ref={ref}
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setPos(((e.clientX - r.left) / r.width) * 100);
            }}
            className="relative aspect-[4/3] rounded-2xl border border-border/60 bg-card overflow-hidden cursor-crosshair"
          >
            <div className="absolute inset-0 bg-grid-sm opacity-40" />
            <div
              className="absolute bottom-3 h-2 w-20 rounded-full bg-primary"
              style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

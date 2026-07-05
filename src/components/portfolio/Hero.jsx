import { useEffect, useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, Sparkles, Terminal } from 'lucide-react';
import MagneticButton from './MagneticButton';
import { PORTFOLIO } from '../../constants/testIds/portfolio';

const SNIPPET_REACT = `export function Hero() {
  return (
    <section className="relative">
      <h1 className="font-display">
        Cinematic. Fast.
        <span>Considered.</span>
      </h1>
    </section>
  );
}`;

const SNIPPET_TS = `type Result<T> = { ok: true; value: T }
  | { ok: false; error: string }

async function ship<T>(fn: () => Promise<T>) {
  try { return { ok: true, value: await fn() } }
  catch (e) { return { ok: false, error: \`\${e}\` } }
}`;

const ROLES = ['Senior Frontend Engineer', 'UI/UX Designer', 'Full-stack Builder', 'Motion Specialist'];

export default function Hero() {
  const ref = useRef(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 80, damping: 20 });
  const sy = useSpring(my, { stiffness: 80, damping: 20 });
  const spotlight = useMotionTemplate`radial-gradient(600px circle at calc(${sx} * 100%) calc(${sy} * 100%), hsl(var(--primary) / 0.15), transparent 60%)`;
  const [roleIdx, setRoleIdx] = useState(0);
  const [typed, setTyped] = useState('');

  useEffect(() => {
    const target = ROLES[roleIdx];
    let i = 0;
    let deleting = false;
    let pause = 0;
    const id = setInterval(() => {
      if (pause > 0) { pause -= 1; return; }
      if (!deleting) {
        i += 1;
        setTyped(target.slice(0, i));
        if (i >= target.length) { deleting = true; pause = 20; }
      } else {
        i -= 1;
        setTyped(target.slice(0, i));
        if (i <= 0) {
          clearInterval(id);
          setRoleIdx((r) => (r + 1) % ROLES.length);
        }
      }
    }, 50);
    return () => clearInterval(id);
  }, [roleIdx]);

  const onMouseMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };

  return (
    <section
      id="home"
      ref={ref}
      onMouseMove={onMouseMove}
      className="relative pt-20 md:pt-24 pb-20 md:pb-28 overflow-hidden"
    >
      {/* Animated grid */}
      <div className="absolute inset-0 bg-grid opacity-30" aria-hidden />

      {/* Mouse-follow spotlight */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: spotlight }}
      />

      {/* Subtle particles */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {[...Array(18)].map((_, i) => (
          <span key={i} className="absolute h-1 w-1 rounded-full bg-primary/40 anim-float-slow" style={{ left: `${(i*53)%100}%`, top: `${(i*37)%100}%`, animationDelay: `${i*0.3}s` }} />
        ))}
      </div>

      <div className="container-prem relative z-10 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7">
          <motion.div
            data-testid={PORTFOLIO.heroAvailability}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/40 backdrop-blur px-3 py-1.5"
          >
            <span className="relative h-2 w-2 rounded-full bg-primary pulse-dot" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Available · Accepting 2 clients for Q1
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display mt-6 text-5xl sm:text-6xl lg:text-[7.5rem] leading-[0.88] font-black tracking-tighter"
          >
            Cinematic.
            <br />
            <span className="text-gradient">Considered.</span>
            <br />
            <span className="italic font-medium text-primary">Shipped.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-7 flex items-center gap-2 font-mono text-sm text-muted-foreground"
          >
            <Terminal className="h-4 w-4 text-primary" />
            <span>$&nbsp;{typed}<span className="inline-block w-2 h-4 bg-primary align-middle animate-pulse ml-0.5" /></span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed"
          >
            I build fast, polished digital products that convert.
            <br />
            Design, frontend, backend — one engineer, full responsibility.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="mt-6 flex flex-wrap items-center gap-3"
          >
            <MagneticButton
              testid={PORTFOLIO.heroCtaPrimary}
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Start a project <ArrowRight className="h-4 w-4" />
            </MagneticButton>
            <button
              data-testid={PORTFOLIO.heroCtaSecondary}
              onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 rounded-full border border-border/80 px-6 py-3 text-sm font-semibold hover:border-primary/60 hover:text-primary transition-colors"
            >
              <Sparkles className="h-4 w-4" /> See selected work
            </button>
          </motion.div>
        </div>

        {/* Floating glass UI windows */}
        <div className="lg:col-span-5 relative h-[440px] hidden lg:block">
          <FloatingWindow style={{ top: 0, right: 0 }} delay={0.2}>
            <WinHeader name="Hero.jsx" />
            <pre className="text-[11px] leading-relaxed font-mono p-4 overflow-hidden">
              <code className="text-muted-foreground whitespace-pre">{SNIPPET_REACT}</code>
            </pre>
          </FloatingWindow>

          <FloatingWindow style={{ bottom: 0, left: -20 }} delay={0.45}>
            <WinHeader name="ship.ts" />
            <pre className="text-[11px] leading-relaxed font-mono p-4 overflow-hidden">
              <code className="text-muted-foreground whitespace-pre">{SNIPPET_TS}</code>
            </pre>
          </FloatingWindow>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="absolute top-[44%] left-[10%] glass rounded-2xl p-4 anim-float w-52"
          >
            <div className="flex items-center justify-between">
              <span className="h-2 w-2 rounded-full bg-primary pulse-dot" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Status</span>
            </div>
            <div className="font-display text-4xl font-black mt-2">7<span className="text-primary">+</span></div>
            <div className="text-[11px] text-muted-foreground mt-1">projects shipped · 2 slots open</div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground">
        <span className="font-mono text-[11px] uppercase tracking-widest opacity-60">scroll</span>
        <span className="relative h-12 w-px overflow-hidden">
          <motion.span
            className="absolute top-0 left-0 h-full w-full bg-gradient-to-b from-primary via-primary to-transparent"
            animate={{ y: ['0%', '100%'] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </div>

    </section>
  );
}

function FloatingWindow({ children, style, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      style={style}
      className="absolute w-72 glass rounded-xl overflow-hidden anim-float-slow"
    >
      {children}
    </motion.div>
  );
}

function WinHeader({ name }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 border-b border-border/60">
      <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
      <span className="h-2.5 w-2.5 rounded-full bg-primary/70" />
      <span className="h-2.5 w-2.5 rounded-full bg-foreground/30" />
      <span className="ml-2 font-mono text-[10px] text-muted-foreground">{name}</span>
    </div>
  );
}

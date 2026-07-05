import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import {
  Search, Layers, PenTool, Code2, FlaskConical, Rocket, LifeBuoy,
  TrendingUp, CheckCircle2, Circle, ClipboardList,
} from 'lucide-react';

const STEPS = [
  { num: '01', title: 'Research', body: 'Stakeholder interviews, audit, jobs-to-be-done. We define what success actually looks like.', icon: Search },
  { num: '02', title: 'UX', body: 'Information architecture, wireframes, content modeling. Pixels come later.', icon: Layers },
  { num: '03', title: 'Design', body: 'A bespoke visual system: typography, motion, color, components.', icon: PenTool },
  { num: '04', title: 'Development', body: 'Type-safe, accessible, observable code. Lighthouse 95+ baked in.', icon: Code2 },
  { num: '05', title: 'Testing', body: 'E2E, visual regression, Web Vitals on every PR.', icon: FlaskConical },
  { num: '06', title: 'Launch', body: 'A choreographed go-live with smoke tests, monitoring and a rollback plan.', icon: Rocket },
  { num: '07', title: 'Support', body: 'Retainer-based iteration. The launch is the start, not the end.', icon: LifeBuoy },
];

// ─── single timeline step ──────────────────────────────────────────────────
// Tracks its own position through the viewport so the dot/label can read as
// "active" while it's near the center of the screen, without touching layout.
function ProcessStep({ step, index, reduced }) {
  const itemRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: itemRef, offset: ['start end', 'end start'] });

  const rawActive = useTransform(scrollYProgress, [0, 0.35, 0.5, 0.65, 1], [0, 0, 1, 0, 0]);
  const smoothedActive = useSpring(rawActive, { stiffness: 260, damping: 32, mass: 0.4 });
  const active = reduced ? rawActive : smoothedActive;

  const dotScale = useTransform(active, [0, 1], [1, reduced ? 1.08 : 1.32]);
  const haloScale = useTransform(active, [0, 1], [0.6, 1.7]);
  const haloOpacity = useTransform(active, [0, 1], [0, reduced ? 0.18 : 0.5]);
  const ringOpacity = useTransform(active, [0, 1], [0, reduced ? 0 : 0.45]);
  const contentOpacity = useTransform(active, [0, 1], [0.62, 1]);

  const Icon = step.icon;

  return (
    <motion.div
      ref={itemRef}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: index * 0.04 }}
      className="relative group"
    >
      {/* Indicator stack — positioned exactly where the original dot sat */}
      <div className="absolute -left-8 sm:-left-16 top-2 h-3 w-3">
        <motion.span
          aria-hidden
          style={{ x: '-50%', y: '-50%', scale: haloScale, opacity: haloOpacity }}
          className="absolute left-1/2 top-1/2 h-7 w-7 rounded-full bg-primary blur-md"
        />
        <motion.span
          aria-hidden
          style={{ x: '-50%', y: '-50%', scale: haloScale, opacity: ringOpacity }}
          className="absolute left-1/2 top-1/2 h-5 w-5 rounded-full border border-primary"
        />
        <motion.span
          style={{ scale: dotScale }}
          className="absolute inset-0 rounded-full bg-primary ring-4 ring-background"
        />
      </div>

      <motion.div style={{ opacity: contentOpacity }}>
        <div className="flex items-center gap-2">
          <Icon
            aria-hidden
            className="h-3.5 w-3.5 text-muted-foreground transition-all duration-300 ease-out
                       group-hover:text-primary group-hover:rotate-6 group-hover:scale-110"
          />
          <div className="font-mono text-xs uppercase tracking-widest text-primary">{step.num}</div>
        </div>
        <div
          className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter mt-1
                     transition-transform duration-200 ease-out group-hover:-translate-y-0.5"
        >
          {step.title}
        </div>
      </motion.div>

      <p className="mt-3 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">{step.body}</p>
    </motion.div>
  );
}

// ─── ambient right-side composition ────────────────────────────────────────
// Fills the previously empty right margin on larger screens with a small
// cluster of floating artifact cards — the kind of ephemera that actually
// exists mid-process (a metrics readout, a wireframe, a roadmap) — instead of
// abstract shapes. Hidden below `lg`.
//
// Each card is built from independently-transformed layers so nothing fights
// over the `transform` property:
//   1. outer motion.div  — fade-in (opacity) + re-enables pointer-events for
//                          just this card, since the whole decor layer is
//                          pointer-events-none so it never blocks the page
//   2. middle motion.div — scroll-linked parallax (translateY via style)
//   3. inner div          — perpetual multi-axis drift, plain CSS @keyframes
//                          (anim-drift-a/b/c in index.css) — the same proven
//                          mechanism as the ambient anim-float glows, just
//                          animating both x and y instead of one axis
//   4. innermost div      — static tilt + hover response (CSS transition)
//
// Each card uses a different drift keyframe/duration so the three never
// share a rhythm. `motion-reduce:animate-none` disables the drift for
// reduced-motion users; hover response still works since it's a deliberate
// user action rather than ambient motion.
function ProcessDecor({ scrollYProgress, reduced }) {
  const yGraph = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -60]);
  const yWireframe = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 45]);
  const yRoadmap = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -35]);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 hidden lg:block overflow-hidden">
      {/* ambient light pooling behind the cluster */}
      <div className="absolute right-[6%] top-[10%] h-72 w-72 rounded-full bg-primary/[0.06] blur-3xl anim-float-slow motion-reduce:animate-none" />
      <div className="absolute right-[1%] top-[58%] h-56 w-56 rounded-full bg-primary/[0.05] blur-3xl anim-float motion-reduce:animate-none" />

      {/* card 1 — analytics / metrics readout */}
      <motion.div
        className="absolute right-[8%] top-[4%] w-[210px] pointer-events-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7 }}
      >
        <motion.div style={{ y: yGraph }}>
          {/* drift layer — only translate(x,y) keyframe lives here */}
          <div className="anim-drift-a motion-reduce:animate-none" style={{ animationDelay: '0s' }}>
            {/* tilt + hover layer — rotate and hover transforms are isolated here */}
            <div
              className="glass rounded-2xl p-5 shadow-[0_20px_60px_-24px_hsl(var(--primary)/0.25)]
                         cursor-default will-change-transform
                         transition-[transform,box-shadow,border-color] duration-300 ease-out
                         [transform:rotate(-6deg)]
                         hover:[transform:rotate(-2deg)_translateY(-4px)_scale(1.04)]
                         hover:border-primary/40 hover:shadow-[0_28px_70px_-18px_hsl(var(--primary)/0.35)]"
            >
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-primary" />
                <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Metrics</span>
              </div>
              <svg viewBox="0 0 120 40" className="mt-3 h-12 w-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="processDecorGraphFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,30 L20,25 L40,28 L60,15 L80,19 L100,7 L120,11 L120,40 L0,40 Z" fill="url(#processDecorGraphFill)" />
                <path
                  d="M0,30 L20,25 L40,28 L60,15 L80,19 L100,7 L120,11"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="mt-2.5 font-mono text-[11px] text-muted-foreground">
                Conversion <span className="text-primary">+64%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* card 2 — wireframe / information architecture */}
      <motion.div
        className="absolute right-[-1%] top-[34%] w-[222px] pointer-events-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        <motion.div style={{ y: yWireframe }}>
          {/* drift layer */}
          <div className="anim-drift-b motion-reduce:animate-none" style={{ animationDelay: '0.4s' }}>
            {/* tilt + hover layer */}
            <div
              className="glass rounded-2xl p-5 shadow-[0_20px_60px_-24px_hsl(var(--primary)/0.2)]
                         cursor-default will-change-transform
                         transition-[transform,box-shadow,border-color] duration-300 ease-out
                         [transform:rotate(3deg)]
                         hover:[transform:rotate(1deg)_translateY(-4px)_scale(1.04)]
                         hover:border-primary/40 hover:shadow-[0_28px_70px_-18px_hsl(var(--primary)/0.3)]"
            >
              <div className="flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-primary" />
                <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Wireframe</span>
              </div>
              <div className="mt-3 space-y-1.5">
                <div className="h-2 w-3/5 rounded-full bg-muted-foreground/30" />
                <div className="h-2 w-full rounded-full bg-border" />
              </div>
              <div className="mt-2.5 grid grid-cols-3 gap-1.5">
                <div className="col-span-1 h-10 rounded-md bg-muted" />
                <div className="col-span-2 h-10 rounded-md border border-dashed border-border/80" />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* card 3 — roadmap / plan */}
      <motion.div
        className="absolute right-[13%] top-[62%] w-[198px] pointer-events-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <motion.div style={{ y: yRoadmap }}>
          {/* drift layer */}
          <div className="anim-drift-c motion-reduce:animate-none" style={{ animationDelay: '0.8s' }}>
            {/* tilt + hover layer */}
            <div
              className="glass rounded-2xl p-5 shadow-[0_20px_60px_-24px_hsl(var(--primary)/0.2)]
                         cursor-default will-change-transform
                         transition-[transform,box-shadow,border-color] duration-300 ease-out
                         [transform:rotate(-2deg)]
                         hover:[transform:rotate(0deg)_translateY(-4px)_scale(1.04)]
                         hover:border-primary/40 hover:shadow-[0_28px_70px_-18px_hsl(var(--primary)/0.3)]"
            >
              <div className="flex items-center gap-1.5">
                <ClipboardList className="h-3.5 w-3.5 text-primary" />
                <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Roadmap</span>
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                  <div className="h-1.5 w-28 rounded-full bg-muted-foreground/25" />
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                  <div className="h-1.5 w-20 rounded-full bg-muted-foreground/25" />
                </div>
                <div className="flex items-center gap-2">
                  <Circle className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                  <div className="h-1.5 w-24 rounded-full bg-muted-foreground/15" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function Process() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  // Progress line: smoothed with a spring so growth feels organic rather than
  // scrubbing 1:1 with the scrollbar.
  const rawFill = useTransform(scrollYProgress, [0.05, 0.95], [0, 100]);
  const springFill = useSpring(rawFill, { stiffness: 90, damping: 22, mass: 0.5 });
  const fillProgress = reduced ? rawFill : springFill;
  const fillHeight = useTransform(fillProgress, (v) => `${v}%`);

  // A soft light that drifts down the section as the reader scrolls through it.
  const glowY = useTransform(scrollYProgress, [0, 1], ['10%', '75%']);

  return (
    <section id="process" ref={ref} className="relative py-24 md:py-32 lg:py-40 border-t border-border/60 overflow-hidden">
      <motion.div
        aria-hidden="true"
        style={{ top: glowY }}
        className="pointer-events-none absolute right-[4%] z-0 hidden md:block h-[380px] w-[380px]
                   -translate-y-1/2 rounded-full bg-primary/[0.07] blur-[100px] motion-reduce:hidden"
      />

      <ProcessDecor scrollYProgress={scrollYProgress} reduced={reduced} />

      <div className="container-prem relative z-10">
        <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">05 · Process</div>
        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tighter leading-[0.95] font-black max-w-3xl">
          A repeatable way to ship <span className="text-primary italic font-medium">remarkable</span> work.
        </h2>

        <div className="relative mt-16 pl-8 sm:pl-16">
          <div className="absolute left-2 sm:left-6 top-0 bottom-0 w-px bg-border/70" />

          {/* Glow duplicate sits behind the crisp fill line for a soft halo */}
          <motion.div
            style={{ height: fillHeight }}
            className="absolute left-2 sm:left-6 top-0 w-[3px] -translate-x-1/2 rounded-full
                       bg-primary/30 blur-[3px] origin-top motion-reduce:blur-none"
          />
          <motion.div
            style={{
              height: fillHeight,
              backgroundImage: 'linear-gradient(to bottom, hsl(var(--primary) / 0.55), hsl(var(--primary)))',
            }}
            className="absolute left-2 sm:left-6 top-0 w-px origin-top"
          />
          <motion.span
            aria-hidden
            style={{ top: fillHeight, x: '-50%', y: '-50%' }}
            className="absolute left-2 sm:left-6 h-2 w-2 rounded-full bg-primary
                       shadow-[0_0_10px_2px_hsl(var(--primary)/0.7)] motion-reduce:hidden"
          />

          <div className="space-y-12 sm:space-y-16">
            {STEPS.map((s, i) => (
              <ProcessStep key={s.num} step={s} index={i} reduced={reduced} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
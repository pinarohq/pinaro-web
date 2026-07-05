import { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { skills, skillCategories } from '../../data/skills';

/* ─── animation constants ─────────────────────────────── */
const EASE = [0.22, 1, 0.36, 1];
const SPRING = { type: 'spring', stiffness: 390, damping: 22 };

/* ─── word-split headline reveal ──────────────────────── */
const headlineWords = ['Opinionated', 'tools,', 'sharpened', 'over'];
const accentWord = 'time.';

function HeadlineWord({ word, delay }) {
  return (
    <motion.span
      className="inline-block mr-[0.22em]"
      initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay, ease: EASE }}
    >
      {word}
    </motion.span>
  );
}

/* ─── tech cloud pill ─────────────────────────────────── */
function TechPill({ s, i }) {
  const [hovered, setHovered] = useState(false);
  const floatDelay  = (i * 0.37) % 2.4;
  const floatDur    = 3.2 + (i * 0.23) % 1.6;

  return (
    <motion.div
      key={s.name}
      initial={{ opacity: 0, scale: 0.82, y: 6 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.045, duration: 0.45, ease: EASE }}
      style={{ animationDelay: `${floatDelay}s`, animationDuration: `${floatDur}s` }}
      className="anim-float-slow"
    >
      <motion.span
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{ y: -3, scale: 1.04 }}
        transition={SPRING}
        className="relative inline-flex items-center gap-2 rounded-full border bg-background/60 backdrop-blur px-4 py-2 font-mono uppercase tracking-widest cursor-default select-none overflow-hidden"
        style={{
          fontSize: `${0.68 + s.level / 220}rem`,
          borderColor: hovered ? 'hsl(var(--primary) / 0.6)' : 'hsl(var(--border) / 0.8)',
          color: hovered ? 'hsl(var(--primary))' : undefined,
          transition: 'border-color 200ms, color 200ms',
        }}
      >
        {/* subtle shimmer sweep on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.span
              className="absolute inset-0 rounded-full pointer-events-none"
              initial={{ opacity: 0, x: '-100%' }}
              animate={{ opacity: 1, x: '100%' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, hsl(var(--primary)/0.12) 50%, transparent 100%)',
              }}
            />
          )}
        </AnimatePresence>

        {/* dot — pulses once on hover */}
        <motion.span
          className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0"
          animate={hovered ? { scale: [1, 1.7, 1] } : { scale: 1 }}
          transition={{ duration: 0.35 }}
        />

        {s.name}
      </motion.span>
    </motion.div>
  );
}

/* ─── skill bar row ───────────────────────────────────── */
function SkillBar({ s, i }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      key={s.name}
      initial={{ opacity: 0, x: 16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.055, duration: 0.4, ease: EASE }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group"
    >
      <div className="flex items-baseline justify-between mb-2">
        {/* name — nudges right on hover */}
        <motion.span
          className="font-semibold text-sm"
          animate={{ x: hovered ? 3 : 0 }}
          transition={SPRING}
        >
          {s.name}
        </motion.span>

        {/* benefit tag — fades in sharply on hover */}
        <motion.span
          className="font-mono text-xs"
          animate={{
            color: hovered ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
            scale: hovered ? 1.05 : 1,
          }}
          transition={{ duration: 0.18 }}
        >
          {s.benefit}
        </motion.span>
      </div>

      {/* track */}
      <div className="h-px w-full bg-border rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${s.level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: i * 0.055, ease: EASE }}
          animate={{ opacity: hovered ? 1 : 0.7 }}
          className="h-full rounded-full relative overflow-hidden"
          style={{ background: 'hsl(var(--primary))' }}
        >
          {/* moving highlight along bar on hover */}
          <AnimatePresence>
            {hovered && (
              <motion.span
                className="absolute inset-y-0 w-8 pointer-events-none"
                initial={{ left: '-2rem' }}
                animate={{ left: '110%' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: EASE }}
                style={{
                  background:
                    'linear-gradient(90deg, transparent, hsl(var(--primary-foreground)/0.35), transparent)',
                }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─── category pill ───────────────────────────────────── */
function CategoryPill({ c, active, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      transition={SPRING}
      className={`relative rounded-full border px-4 py-1.5 text-xs font-mono uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        active
          ? 'bg-primary text-primary-foreground border-primary'
          : 'border-border/80 text-muted-foreground hover:text-foreground'
      }`}
    >
      {c}
      {active && (
        <motion.span
          layoutId="cat-active"
          className="absolute inset-0 rounded-full bg-primary -z-10"
          transition={{ type: 'spring', stiffness: 420, damping: 30 }}
        />
      )}
    </motion.button>
  );
}

/* ─── main component ──────────────────────────────────── */
export default function Skills() {
  const [cat, setCat] = useState('Frontend');
  const filtered = skills.filter((s) => s.category === cat);

  return (
    <section
      id="skills"
      className="relative py-24 md:py-32 lg:py-40 border-t border-border/60 overflow-hidden"
    >
      <div className="container-prem">
        {/* eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: EASE }}
          className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3"
        >
          04 · Toolkit
        </motion.div>

        {/* headline — word-by-word reveal */}
        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tighter leading-[0.95] font-black max-w-3xl">
          {headlineWords.map((w, i) => (
            <HeadlineWord key={w} word={w} delay={0.08 + i * 0.07} />
          ))}
          {/* accent word springs gently on hover */}
          <motion.span
            className="text-primary italic font-medium inline-block"
            initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.38, ease: EASE }}
            whileHover={{ y: -3, scale: 1.04 }}
            // @ts-ignore
            hoverTransition={SPRING}
          >
            {accentWord}
          </motion.span>
        </h2>

        {/* category filters */}
        <motion.div
          className="mt-12 flex flex-wrap gap-2"
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.2, ease: EASE }}
        >
          {skillCategories.map((c) => (
            <CategoryPill
              key={c}
              c={c}
              active={cat === c}
              onClick={() => setCat(c)}
            />
          ))}
        </motion.div>

        {/* content grid */}
        <div className="mt-12 grid md:grid-cols-12 gap-8">

          {/* ── tech cloud ── */}
          <div className="md:col-span-7 relative min-h-[360px] rounded-2xl border border-border/60 bg-card overflow-hidden">
            <div className="absolute inset-0 bg-grid-sm opacity-40" />

            <AnimatePresence mode="wait">
              <motion.div
                key={cat}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="relative h-full p-8 flex flex-wrap content-center gap-3"
              >
                {filtered.map((s, i) => (
                  <TechPill key={s.name} s={s} i={i} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── skill bars ── */}
          <div className="md:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={cat}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="space-y-5"
              >
                {filtered.map((s, i) => (
                  <SkillBar key={s.name} s={s} i={i} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}

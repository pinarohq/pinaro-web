import { useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Plus, Check, ArrowRight } from 'lucide-react';
import { services } from '../../data/services';
import { PORTFOLIO } from '../../constants/testIds/portfolio';

// ─── animation helpers ────────────────────────────────────────────────────────

const panelItem = (delay = 0, reduced = false) => ({
  initial: { opacity: 0, y: reduced ? 0 : 8, filter: reduced ? 'none' : 'blur(3px)' },
  animate: { opacity: 1, y: 0,               filter: 'blur(0px)' },
  exit:    { opacity: 0, y: reduced ? 0 : 4, filter: reduced ? 'none' : 'blur(2px)' },
  transition: { duration: 0.32, delay, ease: [0.22, 1, 0.36, 1] },
});

function cardVariants(state, reduced) {
  if (state === 'selected') return {
    opacity: 1, scale: reduced ? 1 : 1.015,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  };
  if (state === 'dimmed') return {
    opacity: 0.42, scale: reduced ? 1 : 0.99,
    transition: { duration: 0.3, ease: 'easeOut' },
  };
  return { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } };
}

// ─── component ────────────────────────────────────────────────────────────────

export default function Services() {
  const [openId,  setOpenId]  = useState(services[0].id);
  const [hoverId, setHoverId] = useState(null);
  const reduced  = useReducedMotion();
  const timerRef = useRef(null);

  const switchCard = (id) => {
    if (openId === id) { setOpenId(null); return; }
    if (openId) {
      setOpenId(null);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setOpenId(id), 180);
    } else {
      setOpenId(id);
    }
  };

  return (
    <section id="services" className="relative py-24 md:py-32 lg:py-40 border-t border-border/60">
      <div className="container-prem">

        {/* ── Section header ── */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
              02 · Services
            </div>
            {/* Heading: fade-up on scroll enter + subtle lift on hover */}
            <motion.h2
              initial={{ opacity: 0, y: reduced ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: reduced ? 0 : -1 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tighter
                         leading-[0.95] font-black max-w-3xl cursor-default
                         transition-[letter-spacing] duration-300 hover:tracking-[-0.045em]"
            >
              Engagement models built for{' '}
              <span className="text-primary italic font-medium">serious</span> work.
            </motion.h2>
          </div>

          {/* Sub-text pulses subtly whenever openId changes — ambient acknowledgement */}
          <AnimatePresence mode="wait">
            <motion.p
              key={openId ?? 'none'}
              initial={{ opacity: reduced ? 1 : 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="max-w-md text-muted-foreground"
            >
              Four ways to work together — from a focused launch site to a long-running product partnership.
            </motion.p>
          </AnimatePresence>
        </div>

        {/* ── Service list ── */}
        <div className="grid gap-px bg-border/60 rounded-xl overflow-visible" role="list">
          {services.map((s) => {
            const open    = openId  === s.id;
            const hovered = hoverId === s.id;
            let spotState = 'idle';
            if (openId)        { spotState = open    ? 'selected' : 'dimmed'; }
            else if (hoverId)  { spotState = hovered ? 'idle'     : 'dimmed'; }

            return (
              <motion.div
                key={s.id}
                role="listitem"
                data-testid={`${PORTFOLIO.serviceCard}-${s.id}`}
                animate={cardVariants(spotState, reduced)}
                onMouseEnter={() => setHoverId(s.id)}
                onMouseLeave={() => setHoverId(null)}
                style={{ position: 'relative', zIndex: open ? 2 : 1 }}
                className="bg-card rounded-[inherit] group"
              >
                {/* Left accent line */}
                <motion.span
                  aria-hidden
                  animate={{ scaleY: open ? 1 : hovered ? 0.6 : 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute left-0 top-0 bottom-0 w-px bg-primary origin-top pointer-events-none"
                />

                {/* ── Row trigger ── */}
                <button
                  onClick={() => switchCard(s.id)}
                  aria-expanded={open}
                  aria-controls={`panel-${s.id}`}
                  className="w-full text-left px-6 py-7 sm:px-8 sm:py-8
                             flex flex-col sm:flex-row sm:items-center gap-4
                             focus-visible:outline-none focus-visible:ring-2
                             focus-visible:ring-primary focus-visible:ring-inset rounded-[inherit]"
                >
                  <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground w-28 shrink-0">
                    {s.price}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-display text-2xl sm:text-3xl font-bold tracking-tight
                                    transition-transform duration-200 ease-out group-hover:-translate-y-px">
                      {s.name}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1
                                    transition-colors duration-200 ease-out group-hover:text-foreground/70">
                      {s.tagline}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-xs text-muted-foreground hidden sm:block">
                      {s.duration}
                    </span>

                    {/* Toggle button — spring bounce on hover, pulse-scale on open */}
                    <motion.span
                      animate={{ rotate: open ? 45 : 0, scale: open ? 1.1 : 1 }}
                      whileHover={{ scale: open ? 1.15 : 1.12 }}
                      whileTap={{ scale: 0.92 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                      className={`h-9 w-9 grid place-items-center rounded-full border
                                  transition-colors duration-250
                                  ${open
                                    ? 'bg-primary border-primary text-primary-foreground'
                                    : 'border-border/80 group-hover:border-primary/50'}`}
                      aria-hidden
                    >
                      <Plus className="h-4 w-4" />
                    </motion.span>
                  </div>
                </button>

                {/* ── Detail panel ── */}
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      key="panel"
                      id={`panel-${s.id}`}
                      role="region"
                      aria-label={`${s.name} details`}
                      initial={{ height: 0,      opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{    height: 0,      opacity: 0 }}
                      transition={{
                        height:  { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
                        opacity: { duration: 0.28, ease: 'easeOut' },
                      }}
                      className="overflow-hidden border-t border-border/60"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: reduced ? 0 : 12, filter: reduced ? 'none' : 'blur(4px)' }}
                        animate={{ opacity: 1, y: 0,                filter: 'blur(0px)' }}
                        exit={{    opacity: 0, y: reduced ? 0 : 6,  filter: reduced ? 'none' : 'blur(2px)' }}
                        transition={{ duration: 0.38, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                        className="px-6 sm:px-8 py-8 grid md:grid-cols-3 gap-8"
                      >

                        {/* ── Deliverables ── */}
                        <motion.div {...panelItem(0.04, reduced)}>
                          {/* Section label slides in from left */}
                          <motion.div
                            initial={{ opacity: 0, x: reduced ? 0 : -4 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.12, ease: 'easeOut' }}
                            className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-3"
                          >
                            Deliverables
                          </motion.div>
                          <ul className="space-y-2.5 text-sm">
                            {s.deliverables.map((d, i) => (
                              <motion.li
                                key={d}
                                initial={{ opacity: 0, x: reduced ? 0 : -4 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.25, delay: 0.14 + i * 0.05, ease: 'easeOut' }}
                                whileHover={{ x: reduced ? 0 : 2 }}
                                className="flex gap-2.5 group/item cursor-default"
                              >
                                <Check className="h-4 w-4 text-primary mt-0.5 shrink-0
                                                   transition-transform duration-200 group-hover/item:scale-110" />
                                <span className="leading-snug">{d}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>

                        {/* ── Process + Ideal for ── */}
                        <motion.div {...panelItem(0.1, reduced)}>
                          <motion.div
                            initial={{ opacity: 0, x: reduced ? 0 : -4 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.18, ease: 'easeOut' }}
                            className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-3"
                          >
                            Process
                          </motion.div>
                          <ol className="space-y-2 text-sm">
                            {s.process.map((step, i) => (
                              <motion.li
                                key={step}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.22, delay: 0.2 + i * 0.05 }}
                                className="flex gap-3 group/step"
                              >
                                {/* Step number springs on hover */}
                                <motion.span
                                  whileHover={{ scale: reduced ? 1 : 1.2 }}
                                  transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                                  className="font-mono text-xs text-primary mt-0.5 shrink-0 w-5"
                                >
                                  0{i + 1}
                                </motion.span>
                                <span>{step}</span>
                              </motion.li>
                            ))}
                          </ol>
                          <div className="font-mono text-[11px] uppercase tracking-widest
                                          text-muted-foreground mb-2 mt-6">
                            Ideal for
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">{s.idealFor}</p>
                        </motion.div>

                        {/* ── FAQ + CTA ── */}
                        <motion.div {...panelItem(0.16, reduced)} className="flex flex-col justify-between gap-6">
                          <div>
                            <motion.div
                              initial={{ opacity: 0, x: reduced ? 0 : -4 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 0.24, ease: 'easeOut' }}
                              className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-3"
                            >
                              FAQ
                            </motion.div>
                            <div className="space-y-4">
                              {s.faqs.map((f, i) => (
                                <motion.div
                                  key={f.q}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.25, delay: 0.26 + i * 0.06 }}
                                  className="group/faq"
                                >
                                  {/* FAQ question — underline sweeps on hover */}
                                  <div className="relative inline-block text-sm font-semibold">
                                    {f.q}
                                    <span className="absolute left-0 -bottom-px h-px w-full bg-foreground/30
                                                     scale-x-0 group-hover/faq:scale-x-100 origin-left
                                                     transition-transform duration-250 ease-out" />
                                  </div>
                                  <div className="text-sm text-muted-foreground mt-1 leading-relaxed">{f.a}</div>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          {/* CTA */}
                          <motion.button
                            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                            whileHover={{ x: reduced ? 0 : 2 }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                            className="group/cta inline-flex items-center gap-2 text-sm font-semibold
                                       text-primary w-fit focus-visible:outline-none focus-visible:underline"
                          >
                            Discuss this service
                            <ArrowRight className="h-4 w-4 transition-transform duration-200
                                                    group-hover/cta:translate-x-0.5" />
                          </motion.button>
                        </motion.div>

                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

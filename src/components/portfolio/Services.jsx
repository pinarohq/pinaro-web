import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Plus, Check } from 'lucide-react';
import { services } from '../../data/services';
import { PORTFOLIO } from '../../constants/testIds/portfolio';

// Staggered fade-up for content inside the open panel
const panelItem = (delay = 0, reduced = false) => ({
  initial: { opacity: 0, y: reduced ? 0 : 6 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function Services() {
  const [openId, setOpenId] = useState(services[0].id);
  const [hoverId, setHoverId] = useState(null);
  const reduced = useReducedMotion();

  return (
    <section id="services" className="relative py-24 md:py-32 lg:py-40 border-t border-border/60">
      <div className="container-prem">

        {/* Section header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
              02 · Services
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tighter leading-[0.95] font-black max-w-3xl">
              Engagement models built for{' '}
              <span className="text-primary italic font-medium">serious</span> work.
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground">
            Four ways to work together — from a focused launch site to a long-running product partnership.
          </p>
        </div>

        {/* Service list */}
        <div
          className="grid gap-px bg-border/60 rounded-xl overflow-hidden"
          role="list"
        >
          {services.map((s) => {
            const open = openId === s.id;
            // When any card is hovered, dim others slightly
            const dimmed = hoverId !== null && hoverId !== s.id;

            return (
              <motion.div
                key={s.id}
                layout
                role="listitem"
                data-testid={`${PORTFOLIO.serviceCard}-${s.id}`}
                animate={{ opacity: dimmed ? 0.55 : 1 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                onMouseEnter={() => setHoverId(s.id)}
                onMouseLeave={() => setHoverId(null)}
                className="relative bg-card group"
              >
                {/* Primary left-edge accent — grows in on hover */}
                <span
                  className="absolute left-0 top-0 bottom-0 w-px bg-primary origin-top
                             scale-y-0 group-hover:scale-y-100
                             transition-transform duration-300 ease-out"
                  aria-hidden
                />

                {/* Row trigger */}
                <button
                  onClick={() => setOpenId(open ? null : s.id)}
                  aria-expanded={open}
                  aria-controls={`panel-${s.id}`}
                  className="w-full text-left px-6 py-7 sm:px-8 sm:py-8
                             flex flex-col sm:flex-row sm:items-center gap-4
                             focus-visible:outline-none focus-visible:ring-2
                             focus-visible:ring-primary focus-visible:ring-inset"
                >
                  {/* Price */}
                  <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground w-28 shrink-0">
                    {s.price}
                  </div>

                  {/* Name + tagline */}
                  <div className="flex-1 min-w-0">
                    <div
                      className="font-display text-2xl sm:text-3xl font-bold tracking-tight
                                 transition-transform duration-200 ease-out group-hover:-translate-y-px"
                    >
                      {s.name}
                    </div>
                    <div
                      className="text-sm text-muted-foreground mt-1
                                 transition-colors duration-200 group-hover:text-foreground/70"
                    >
                      {s.tagline}
                    </div>
                  </div>

                  {/* Duration + toggle */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-xs text-muted-foreground hidden sm:block">
                      {s.duration}
                    </span>
                    <motion.span
                      animate={{
                        rotate: open ? 45 : 0,
                        scale: open ? 1.08 : 1,
                      }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className={`h-9 w-9 grid place-items-center rounded-full border
                                  transition-colors duration-250
                                  ${open
                                    ? 'bg-primary border-primary text-primary-foreground'
                                    : 'border-border/80 group-hover:border-primary/50'
                                  }`}
                      aria-hidden
                    >
                      <Plus className="h-4 w-4" />
                    </motion.span>
                  </div>
                </button>

                {/* Expandable panel */}
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      key="panel"
                      id={`panel-${s.id}`}
                      role="region"
                      aria-label={`${s.name} details`}
                      initial={{ height: 0, opacity: 0, y: reduced ? 0 : 8 }}
                      animate={{ height: 'auto', opacity: 1, y: 0 }}
                      exit={{ height: 0, opacity: 0, y: reduced ? 0 : 4 }}
                      transition={{
                        height: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                        opacity: { duration: 0.3, ease: 'easeOut' },
                        y:       { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                      }}
                      className="overflow-hidden border-t border-border/60"
                    >
                      <div className="px-6 sm:px-8 py-8 grid md:grid-cols-3 gap-8">

                        {/* Deliverables */}
                        <motion.div {...panelItem(0.05, reduced)}>
                          <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-3">
                            Deliverables
                          </div>
                          <ul className="space-y-2 text-sm">
                            {s.deliverables.map((d) => (
                              <li key={d} className="flex gap-2 group/item">
                                <Check className="h-4 w-4 text-primary mt-0.5 shrink-0
                                                  transition-transform duration-200 group-hover/item:scale-110" />
                                <span>{d}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>

                        {/* Process + Ideal for */}
                        <motion.div {...panelItem(0.1, reduced)}>
                          <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-3">
                            Process
                          </div>
                          <ol className="space-y-2 text-sm">
                            {s.process.map((step, i) => (
                              <li key={step} className="flex gap-3">
                                <span className="font-mono text-xs text-primary mt-0.5 shrink-0">
                                  0{i + 1}
                                </span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                          <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-2 mt-6">
                            Ideal for
                          </div>
                          <div className="text-sm text-muted-foreground leading-relaxed">
                            {s.idealFor}
                          </div>
                        </motion.div>

                        {/* FAQ */}
                        <motion.div {...panelItem(0.15, reduced)}>
                          <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-3">
                            FAQ
                          </div>
                          <div className="space-y-4">
                            {s.faqs.map((f) => (
                              <div key={f.q}>
                                <div className="text-sm font-semibold">{f.q}</div>
                                <div className="text-sm text-muted-foreground mt-1 leading-relaxed">{f.a}</div>
                              </div>
                            ))}
                          </div>
                        </motion.div>

                      </div>
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

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check } from 'lucide-react';
import { services } from '../../data/services';
import { PORTFOLIO } from '../../constants/testIds/portfolio';

export default function Services() {
  const [openId, setOpenId] = useState(services[0].id);
  return (
    <section id="services" className="relative py-24 md:py-32 lg:py-40 border-t border-border/60">
      <div className="container-prem">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">02 · Services</div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tighter leading-[0.95] font-black max-w-3xl">
              Engagement models built for <span className="text-primary italic font-medium">serious</span> work.
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground">
            Four ways to work with me, from a single landing page to a long-running product engagement.
          </p>
        </div>

        <div className="grid gap-px bg-border/60 rounded-xl overflow-hidden">
          {services.map((s) => {
            const open = openId === s.id;
            return (
              <motion.div
                key={s.id}
                layout
                data-testid={`${PORTFOLIO.serviceCard}-${s.id}`}
                className="bg-card group"
              >
                <button
                  onClick={() => setOpenId(open ? null : s.id)}
                  className="w-full text-left px-6 py-7 sm:px-8 sm:py-8 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground w-20">{s.price}</div>
                  <div className="flex-1">
                    <div className="font-display text-2xl sm:text-3xl font-bold tracking-tight">{s.name}</div>
                    <div className="text-sm text-muted-foreground mt-1">{s.tagline}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-muted-foreground">{s.duration}</span>
                    <span className={`h-9 w-9 grid place-items-center rounded-full border border-border/80 transition-transform ${open ? 'rotate-45 bg-primary border-primary text-primary-foreground' : ''}`}>
                      <Plus className="h-4 w-4" />
                    </span>
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      key="panel"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden border-t border-border/60"
                    >
                      <div className="px-6 sm:px-8 py-8 grid md:grid-cols-3 gap-8">
                        <div>
                          <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-3">Deliverables</div>
                          <ul className="space-y-2 text-sm">
                            {s.deliverables.map((d) => (
                              <li key={d} className="flex gap-2"><Check className="h-4 w-4 text-primary mt-0.5 shrink-0" /> <span>{d}</span></li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-3">Process</div>
                          <ol className="space-y-2 text-sm">
                            {s.process.map((p, i) => (
                              <li key={p} className="flex gap-3">
                                <span className="font-mono text-xs text-primary mt-0.5">0{i + 1}</span>
                                <span>{p}</span>
                              </li>
                            ))}
                          </ol>
                          <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-2 mt-6">Ideal for</div>
                          <div className="text-sm">{s.idealFor}</div>
                        </div>
                        <div>
                          <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-3">FAQ</div>
                          <div className="space-y-3">
                            {s.faqs.map((f) => (
                              <div key={f.q}>
                                <div className="text-sm font-semibold">{f.q}</div>
                                <div className="text-sm text-muted-foreground mt-1">{f.a}</div>
                              </div>
                            ))}
                          </div>
                        </div>
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

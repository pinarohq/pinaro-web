import { useState } from 'react';
import { motion } from 'framer-motion';
import { skills, skillCategories } from '../../data/skills';

export default function Skills() {
  const [cat, setCat] = useState('Frontend');
  const filtered = skills.filter((s) => s.category === cat);
  return (
    <section id="skills" className="relative py-24 md:py-32 lg:py-40 border-t border-border/60 overflow-hidden">
      <div className="container-prem">
        <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">04 · Toolkit</div>
        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tighter leading-[0.95] font-black max-w-3xl">
          Opinionated tools, sharpened over <span className="text-primary italic font-medium">seven</span> years.
        </h2>

        <div className="mt-12 flex flex-wrap gap-2">
          {skillCategories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full border px-4 py-1.5 text-xs font-mono uppercase tracking-widest transition-colors ${
                cat === c ? 'bg-primary text-primary-foreground border-primary' : 'border-border/80 text-muted-foreground hover:text-foreground'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-12 grid md:grid-cols-12 gap-8">
          {/* Tech cloud */}
          <div className="md:col-span-7 relative min-h-[360px] rounded-2xl border border-border/60 bg-card overflow-hidden">
            <div className="absolute inset-0 bg-grid-sm opacity-40" />
            <div className="relative h-full p-8 flex flex-wrap content-center gap-3">
              {filtered.map((s, i) => (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04, duration: 0.4 }}
                  style={{ animationDelay: `${i * 0.2}s` }}
                  className="anim-float-slow"
                >
                  <span
                    className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/60 backdrop-blur px-4 py-2 font-mono text-xs uppercase tracking-widest hover:border-primary hover:text-primary transition-colors"
                    style={{ fontSize: `${0.7 + s.level / 200}rem` }}
                    title={`${s.years} years`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {s.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bars */}
          <div className="md:col-span-5 space-y-4">
            {filtered.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <div className="flex items-baseline justify-between mb-2">
                  <span className="font-semibold">{s.name}</span>
                  <span className="font-mono text-xs text-muted-foreground">{s.years}y · {s.level}%</span>
                </div>
                <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${s.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full bg-primary"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const STEPS = [
  { num: '01', title: 'Research', body: 'Stakeholder interviews, audit, jobs-to-be-done. We define what success actually looks like.' },
  { num: '02', title: 'UX', body: 'Information architecture, wireframes, content modeling. Pixels come later.' },
  { num: '03', title: 'Design', body: 'A bespoke visual system: typography, motion, color, components.' },
  { num: '04', title: 'Development', body: 'Type-safe, accessible, observable code. Lighthouse 95+ baked in.' },
  { num: '05', title: 'Testing', body: 'E2E, visual regression, Web Vitals on every PR.' },
  { num: '06', title: 'Launch', body: 'A choreographed go-live with smoke tests, monitoring and a rollback plan.' },
  { num: '07', title: 'Support', body: 'Retainer-based iteration. The launch is the start, not the end.' },
];

export default function Process() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const line = useTransform(scrollYProgress, [0.05, 0.95], ['0%', '100%']);

  return (
    <section id="process" ref={ref} className="relative py-24 md:py-32 lg:py-40 border-t border-border/60">
      <div className="container-prem">
        <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">05 · Process</div>
        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tighter leading-[0.95] font-black max-w-3xl">
          A repeatable way to ship <span className="text-primary italic font-medium">remarkable</span> work.
        </h2>

        <div className="relative mt-16 pl-8 sm:pl-16">
          <div className="absolute left-2 sm:left-6 top-0 bottom-0 w-px bg-border" />
          <motion.div style={{ height: line }} className="absolute left-2 sm:left-6 top-0 w-px bg-primary origin-top" />
          <div className="space-y-12 sm:space-y-16">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: i * 0.04 }}
                className="relative"
              >
                <span className="absolute -left-8 sm:-left-16 top-2 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
                <div className="font-mono text-xs uppercase tracking-widest text-primary">{s.num}</div>
                <div className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter mt-1">{s.title}</div>
                <p className="mt-3 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

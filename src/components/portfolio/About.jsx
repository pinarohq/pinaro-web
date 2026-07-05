import { motion } from 'framer-motion';
import { Layers, Gauge, MousePointer2, ShieldCheck } from 'lucide-react';
import { currentlyLearning } from '../../data/skills';

const PILLARS = [
  {
    tag: 'Approach',
    title: 'Business-first thinking',
    detail: 'Every decision starts with the outcome the client needs — not the technology I want to use.',
  },
  {
    tag: 'Craft',
    title: 'Design that earns trust',
    detail: 'Interfaces that feel considered: clear hierarchy, deliberate motion, nothing gratuitous.',
  },
  {
    tag: 'Engineering',
    title: 'Performance is non-negotiable',
    detail: 'Clean, type-safe code. Lighthouse 95+ baked in from the first commit, not bolted on at the end.',
  },
  {
    tag: 'Partnership',
    title: 'Clear, honest communication',
    detail: 'No black-box development. You see progress daily and have full ownership of everything shipped.',
  },
];

const BELIEFS = [
  'Quality over speed — but both matter.',
  'Performance is a design decision, not a tax.',
  'Accessibility is leverage, never an afterthought.',
  'Motion should guide attention, not distract from it.',
  'The best code is the code clients never have to think about.',
  'Long-term value beats short-term delivery.',
];

const SIGNALS = [
  { icon: Layers, label: 'Full-stack ownership', value: 'End-to-end' },
  { icon: Gauge, label: 'Performance target', value: '95+' },
  { icon: MousePointer2, label: 'Design approach', value: 'UI / UX' },
  { icon: ShieldCheck, label: 'Code standard', value: 'Type-safe' },
];

// Reusable scroll entrance: fade + rise + blur clears
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24, filter: 'blur(4px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function About() {
  return (
    <section id="about" className="relative py-24 md:py-32 lg:py-40">
      <div className="container-prem">
        <div className="grid lg:grid-cols-12 gap-12">

          {/* ── Left column ── */}
          <div className="lg:col-span-4">
            <motion.div {...fadeUp(0)}>
              <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
                01 · About
              </div>

              {/* Heading — subtle lift only, no color change */}
              <h2
                className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tighter leading-[0.95] font-black
                           transition-transform duration-200 ease-out hover:-translate-y-0.5 cursor-default"
              >
                I make websites that feel{' '}
                <span className="text-primary italic font-medium">considered</span>.
              </h2>

              <p className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed">
                I&rsquo;m Sumit, the engineer behind{' '}
                <span className="text-foreground font-semibold">Pinaro</span>. I design and build
                for the web — across product, marketing and performance work — with a focus on craft,
                clarity and outcomes that matter to your business.
              </p>
            </motion.div>

            <motion.div {...fadeUp(0.1)} className="mt-10">
              <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
                Currently learning
              </div>
              <div className="flex flex-wrap gap-2">
                {currentlyLearning.map((t) => (
                  <motion.span
                    key={t}
                    whileHover={{ y: -1 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="rounded-full border border-border/80 px-3 py-1 text-xs font-mono
                               hover:border-primary/50 transition-colors duration-200 cursor-default"
                  >
                    {t}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Right column ── */}
          <div className="lg:col-span-8">

            {/* Pillar cards — staggered scroll entrance + subtle hover lift */}
            <div className="grid sm:grid-cols-2 gap-px bg-border/60 rounded-xl overflow-hidden">
              {PILLARS.map((p, i) => (
                <motion.div
                  key={p.tag}
                  {...fadeUp(i * 0.1)}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="relative bg-card p-6 sm:p-8 overflow-hidden group"
                >
                  {/* Left-edge accent line that grows in on hover */}
                  <span
                    className="absolute left-0 top-4 bottom-4 w-px bg-primary
                               origin-top scale-y-0 group-hover:scale-y-100
                               transition-transform duration-300 ease-out"
                  />

                  <div className="font-mono text-xs text-primary uppercase tracking-widest">
                    {p.tag}
                  </div>

                  {/* Card headline — 2px rise on hover */}
                  <div
                    className="font-display text-2xl font-bold tracking-tight mt-2
                               transition-transform duration-200 ease-out group-hover:-translate-y-px"
                  >
                    {p.title}
                  </div>

                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {p.detail}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 grid md:grid-cols-2 gap-6">

              {/* Core beliefs */}
              <motion.div {...fadeUp(0.22)} className="glass rounded-xl p-6">
                <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
                  Core beliefs
                </div>
                <ul className="space-y-2.5">
                  {BELIEFS.map((b) => (
                    <motion.li
                      key={b}
                      whileHover={{ y: -1 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="flex gap-2 text-sm leading-relaxed group cursor-default"
                    >
                      <span className="text-primary mt-1 transition-transform duration-200 group-hover:translate-x-0.5">
                        →
                      </span>
                      <span>{b}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Capability signals */}
              <motion.div {...fadeUp(0.3)} className="glass rounded-xl p-6 grid grid-cols-2 gap-4">
                {SIGNALS.map(({ icon: Icon, label, value }) => (
                  <motion.div
                    key={label}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="group cursor-default"
                  >
                    <Icon
                      className="h-4 w-4 text-primary mb-2
                                 transition-transform duration-200 group-hover:scale-105"
                    />
                    <div
                      className="font-display text-2xl font-black
                                 transition-transform duration-200 group-hover:-translate-y-px"
                    >
                      {value}
                    </div>
                    <div className="text-[11px] text-muted-foreground uppercase tracking-widest font-mono mt-1">
                      {label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

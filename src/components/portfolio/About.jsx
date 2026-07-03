import { motion } from 'framer-motion';
import { Coffee, Code2, Headphones, BookOpen } from 'lucide-react';
import { currentlyLearning } from '../../data/skills';

const TIMELINE = [
  { year: '2019', title: 'First freelance contract', detail: 'Built a Shopify theme for a local boutique. Got hooked on shipping.' },
  { year: '2021', title: 'Joined a YC-backed startup', detail: 'Senior engineer on a real-time analytics product.' },
  { year: '2023', title: 'Founded Sumit Web Studio', detail: 'Independent, opinionated, and obsessively focused on craft.' },
  { year: '2025', title: '60+ projects shipped', detail: 'Across SaaS, e-commerce, fintech, healthcare, and Web3.' },
];

const BELIEFS = [
  'Performance is a design feature, not a tax.',
  'Accessibility is leverage — never an afterthought.',
  'Motion should communicate, not decorate.',
  'Ship small, iterate honestly.',
  'A great site reads like a great book.',
];

const FUN = [
  { icon: Coffee, label: 'Cups of coffee shipped per project', value: '~94' },
  { icon: Code2, label: 'Avg. PRs reviewed / month', value: '120' },
  { icon: Headphones, label: 'Hours of lo-fi during deep work', value: '∞' },
  { icon: BookOpen, label: 'Books read this year', value: '23' },
];

export default function About() {
  return (
    <section id="about" className="relative py-24 md:py-32 lg:py-40">
      <div className="container-prem">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">01 · About</div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tighter leading-[0.95] font-black">
              I make websites that feel <span className="text-primary italic font-medium">considered</span>.
            </h2>
            <p className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed">
              I&rsquo;m Sumit. For seven years I&rsquo;ve been designing and engineering on the web —
              moving between editorial design, performance work, and product engineering. Sumit Web Studio is the
              umbrella for that work.
            </p>

            <div className="mt-10">
              <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">Currently learning</div>
              <div className="flex flex-wrap gap-2">
                {currentlyLearning.map((t) => (
                  <span key={t} className="rounded-full border border-border/80 px-3 py-1 text-xs font-mono">{t}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="grid sm:grid-cols-2 gap-px bg-border/60 rounded-xl overflow-hidden">
              {TIMELINE.map((t, i) => (
                <motion.div
                  key={t.year}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  className="bg-card p-6 sm:p-8"
                >
                  <div className="font-mono text-xs text-primary uppercase tracking-widest">{t.year}</div>
                  <div className="font-display text-2xl font-bold tracking-tight mt-2">{t.title}</div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t.detail}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 grid md:grid-cols-2 gap-6">
              <div className="glass rounded-xl p-6">
                <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">Core beliefs</div>
                <ul className="space-y-2.5">
                  {BELIEFS.map((b) => (
                    <li key={b} className="flex gap-2 text-sm leading-relaxed">
                      <span className="text-primary mt-1">→</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="glass rounded-xl p-6 grid grid-cols-2 gap-4">
                {FUN.map(({ icon: Icon, label, value }) => (
                  <div key={label}>
                    <Icon className="h-4 w-4 text-primary mb-2" />
                    <div className="font-display text-2xl font-black">{value}</div>
                    <div className="text-[11px] text-muted-foreground uppercase tracking-widest font-mono mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Linkedin, Quote } from 'lucide-react';
import { testimonials } from '../../data/testimonials';

const EASE = [0.22, 1, 0.36, 1];

export default function Testimonials() {
  const [hover, setHover] = useState(null);
  const reduced = useReducedMotion();

  return (
    <section id="testimonials" className="relative py-24 md:py-32 lg:py-40 border-t border-border/60">
      <div className="container-prem">
        <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">06 · Testimonials</div>
        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tighter leading-[0.95] font-black max-w-3xl">
          What founders and CTOs <span className="text-primary italic font-medium">say</span>.
        </h2>
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
              whileHover={reduced ? {} : { y: -4 }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card p-6
                         shadow-sm transition-[box-shadow,border-color] duration-300 ease-out
                         hover:border-primary/30 hover:shadow-[0_12px_32px_-12px_hsl(var(--primary)/0.18)]"
            >
              <Quote
                className={`h-6 w-6 text-primary/70 mb-4 transition-transform duration-300 ${
                  hover === i ? 'scale-110 text-primary' : ''
                }`}
                strokeWidth={2.25}
              />
              <p className={`text-base leading-relaxed transition-all duration-300 ${hover === i ? '' : 'line-clamp-4'}`}>
                {t.quote}
              </p>
              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-border/50">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="h-10 w-10 rounded-full object-cover ring-1 ring-border/70 transition-transform duration-300 group-hover:scale-105"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{t.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{t.role} · {t.company}</div>
                </div>
                <a
                  href={t.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={`${t.name} on LinkedIn`}
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
              <div className="pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-primary/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>

        <div className="mt-10 max-w-2xl border-t border-border/50 pt-6 space-y-3">
          <p className="text-sm text-muted-foreground">
            Trust is earned through consistent work and clear communication, not exaggerated claims —
            that's the standard I hold every project to, whether it's a quick fix or a full build.
          </p>
          <p className="text-xs text-muted-foreground/50 leading-relaxed">
            The testimonials above are illustrative placeholders, included to demonstrate how real client
            feedback would be presented on your site. They do not represent actual clients or engagements.
            When your project ships, this section fills with the real thing.
          </p>
        </div>
      </div>
    </section>
  );
}

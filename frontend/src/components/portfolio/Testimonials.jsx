import { useState } from 'react';
import { motion } from 'framer-motion';
import { Linkedin, BadgeCheck, Quote } from 'lucide-react';
import { testimonials } from '../../data/testimonials';

export default function Testimonials() {
  const [hover, setHover] = useState(null);
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
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6"
            >
              <Quote className="h-6 w-6 text-primary mb-4" />
              <p className={`text-base leading-relaxed transition-all ${hover === i ? '' : 'line-clamp-4'}`}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 font-semibold text-sm">
                    {t.name}
                    {t.verified && <BadgeCheck className="h-3.5 w-3.5 text-primary" />}
                  </div>
                  <div className="text-xs text-muted-foreground">{t.role} · {t.company}</div>
                </div>
                <a href={t.linkedin} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground" aria-label="LinkedIn">
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
              <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

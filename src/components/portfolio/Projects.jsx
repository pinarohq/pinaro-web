import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Search } from 'lucide-react';
import { projects, industries } from '../../data/projects';
import { PORTFOLIO } from '../../constants/testIds/portfolio';

export default function Projects() {
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const f = filter === 'All' || p.industry === filter;
      const q = query.trim().toLowerCase();
      const m = !q || p.title.toLowerCase().includes(q) || p.tech.join(' ').toLowerCase().includes(q) || p.summary.toLowerCase().includes(q);
      return f && m;
    });
  }, [filter, query]);

  return (
    <section id="work" className="relative py-24 md:py-32 lg:py-40 border-t border-border/60">
      <div className="container-prem">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">03 · Selected Work</div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tighter leading-[0.95] font-black max-w-3xl">
              A small set of <span className="text-primary italic font-medium">deep</span> case studies.
            </h2>
          </div>
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              data-testid={PORTFOLIO.projectSearch}
              placeholder="Search projects, tech…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-card border border-border/80 rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          {industries.map((ind) => (
            <button
              key={ind}
              data-testid={`${PORTFOLIO.projectFilter}-${ind.toLowerCase()}`}
              onClick={() => setFilter(ind)}
              className={`rounded-full border px-4 py-1.5 text-xs font-mono uppercase tracking-widest transition-colors ${
                filter === ind ? 'bg-primary text-primary-foreground border-primary' : 'border-border/80 text-muted-foreground hover:border-foreground/40 hover:text-foreground'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>

        <motion.div layout className="grid md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.div
                key={p.slug}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, delay: i * 0.04 }}
                className={i % 3 === 0 ? 'md:col-span-2' : ''}
              >
                <Link
                  to={`/work/${p.slug}`}
                  data-testid={`${PORTFOLIO.projectCard}-${p.slug}`}
                  className="group block relative overflow-hidden rounded-2xl border border-border/60 bg-card"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={p.cover}
                      alt={p.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                      <span className="rounded-full bg-background/70 backdrop-blur px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest">{p.industry}</span>
                      <span className="rounded-full bg-background/70 backdrop-blur px-2.5 py-1 text-[10px] font-mono">{p.year}</span>
                    </div>
                  </div>
                  <div className="p-6 sm:p-7 flex items-start justify-between gap-6">
                    <div>
                      <div className="font-display text-2xl sm:text-3xl font-bold tracking-tight">{p.title}</div>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.summary}</p>
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {p.tech.slice(0, 4).map((t) => (
                          <span key={t} className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground border border-border/80 rounded-full px-2 py-0.5">{t}</span>
                        ))}
                      </div>
                    </div>
                    <span className="h-10 w-10 grid place-items-center rounded-full border border-border/80 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors shrink-0">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">No projects match.</div>
        )}
      </div>
    </section>
  );
}

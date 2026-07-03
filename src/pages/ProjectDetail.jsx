import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Download, Github } from 'lucide-react';
import { projects } from '../data/projects';

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);
  if (!project) {
    return (
      <div className="container-prem pt-32 pb-20">
        <p className="text-muted-foreground">Project not found.</p>
        <Link to="/" className="text-primary link-underline">Back home</Link>
      </div>
    );
  }
  const related = projects.filter((p) => p.industry === project.industry && p.slug !== project.slug).slice(0, 2);
  return (
    <article className="pt-28 pb-24">
      <div className="container-prem">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> All work</Link>
        <div className="mt-8 grid lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            <div className="font-mono text-xs uppercase tracking-widest text-primary">{project.industry} · {project.year}</div>
            <h1 className="mt-3 font-display text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.95]">
              {project.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{project.summary}</p>
          </div>
          <div className="lg:col-span-4 grid grid-cols-3 gap-4">
            <Stat label="Lighthouse" value={project.metrics.lighthouse} />
            <Stat label="LCP" value={project.metrics.lcp} />
            <Stat label="Conversion" value={project.metrics.conversionLift} />
          </div>
        </div>

        <div className="mt-12 aspect-[16/9] rounded-2xl overflow-hidden border border-border/60">
          <img src={project.cover} alt={project.title} className="h-full w-full object-cover" />
        </div>

        <div className="mt-16 grid lg:grid-cols-12 gap-10">
          <aside className="lg:col-span-3 space-y-6 lg:sticky lg:top-28 self-start">
            <Meta label="Client" value={project.client} />
            <Meta label="Role" value={project.role} />
            <Meta label="Difficulty" value={project.difficulty} />
            <Meta label="Stack" value={project.tech.join(' · ')} />
            <div className="flex flex-col gap-2 pt-4">
              <a href="#" className="inline-flex items-center gap-2 text-sm font-semibold link-underline"><ArrowUpRight className="h-4 w-4" /> Live demo</a>
              <a href="#" className="inline-flex items-center gap-2 text-sm font-semibold link-underline"><Github className="h-4 w-4" /> Source</a>
              <a href="#" className="inline-flex items-center gap-2 text-sm font-semibold link-underline"><Download className="h-4 w-4" /> Case study PDF</a>
            </div>
          </aside>

          <div className="lg:col-span-9 space-y-12 prose-portfolio">
            <Block title="Problem" body={`The client needed a ${project.category.toLowerCase()} that could match the engineering rigor and brand polish of category leaders, without ballooning timelines.`} />
            <Block title="Research" body="Stakeholder interviews, competitive teardown, analytics review and a usability audit of the existing experience. The brief was refined three times before we wrote any code." />
            <Block title="Design" body="A custom type/color system, motion language and component library. Editorial moments balanced with utility-first dense screens where needed." />
            <Block title="Development" body={`Built on ${project.tech.join(', ')}. Strict type-safety, accessibility audits per-route, and a budget-driven approach to JS payloads.`} />
            <Block title="Outcome" body={`Lighthouse ${project.metrics.lighthouse} across the board. LCP ${project.metrics.lcp}. ${project.metrics.conversionLift} measured against the prior baseline within 30 days of launch.`} />
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-24 pt-12 border-t border-border/60">
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-6">Related work</div>
            <div className="grid md:grid-cols-2 gap-6">
              {related.map((r) => (
                <Link key={r.slug} to={`/work/${r.slug}`} className="block rounded-2xl border border-border/60 overflow-hidden group">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src={r.cover} alt={r.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="p-6">
                    <div className="font-display text-2xl font-bold tracking-tight">{r.title}</div>
                    <div className="text-sm text-muted-foreground mt-1">{r.summary}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-border/60 p-4 bg-card text-center">
      <div className="font-display text-3xl font-black text-primary">{value}</div>
      <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
function Meta({ label, value }) {
  return (
    <div>
      <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold mt-1">{value}</div>
    </div>
  );
}
function Block({ title, body }) {
  return (
    <section>
      <h3 className="font-display text-3xl sm:text-4xl font-black tracking-tighter">{title}</h3>
      <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">{body}</p>
    </section>
  );
}

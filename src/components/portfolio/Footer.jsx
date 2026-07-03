import { useState } from 'react';
import { Github, Linkedin, MessageCircle, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';
import { PORTFOLIO } from '../../constants/testIds/portfolio';
import {
  assertEmailJsConfig,
  buildNewsletterOwnerParams,
  getEmailJsConfig,
  sendTemplate,
} from '../../lib/emailjs';

const COLS = [
  { title: 'Studio', links: [
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Work', href: '#work' },
    { label: 'Process', href: '#process' },
  ] },
  { title: 'Connect', links: [
    { label: 'Email', href: 'mailto:socialmain2025@gmail.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com/' },
    { label: 'GitHub', href: 'https://github.com/' },
    { label: 'WhatsApp', href: 'https://wa.me/' },
  ] },
  { title: 'Resources', links: [
    { label: 'Changelog', href: '#' },
    { label: 'Status', href: '#' },
    { label: 'Resume (PDF)', href: '#' },
    { label: 'Brand kit', href: '#' },
  ] },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);

  const subscribe = async (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) { toast.error('Enter a valid email'); return; }
    setBusy(true);
    try {
      const config = getEmailJsConfig();
      assertEmailJsConfig(config);

      await sendTemplate({
        serviceId: config.serviceId,
        templateId: config.ownerTemplateId,
        templateParams: buildNewsletterOwnerParams(email),
        publicKey: config.publicKey,
      });

      toast.success('Subscribed — see you in your inbox.');
      setEmail('');
    } catch (err) {
      const detail = err?.text || err?.message;
      toast.error(detail ? `Could not subscribe: ${detail}` : 'Could not subscribe. Try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <footer className="relative border-t border-border/60 pt-20 pb-10 overflow-hidden">
      <div className="container-prem">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">Newsletter</div>
            <h3 className="font-display text-3xl sm:text-4xl font-black tracking-tighter">One letter / month. No fluff.</h3>
            <p className="mt-3 text-muted-foreground max-w-md">A short note on what I&rsquo;m building, learning, and recommending. Unsubscribe anytime.</p>
            <form onSubmit={subscribe} className="mt-6 flex gap-2 max-w-md">
              <input
                data-testid={PORTFOLIO.footerNewsletterInput}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@studio.com"
                type="email"
                className="flex-1 bg-card border border-border/80 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
              />
              <button
                data-testid={PORTFOLIO.footerNewsletterSubmit}
                disabled={busy}
                className="rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold inline-flex items-center gap-2 hover:opacity-90 transition disabled:opacity-50"
              >
                {busy ? '…' : 'Subscribe'} <ArrowUpRight className="h-4 w-4" />
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-6">
            {COLS.map((c) => (
              <div key={c.title}>
                <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">{c.title}</div>
                <ul className="space-y-2.5 text-sm">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} target={l.href.startsWith('http') || l.href.startsWith('mailto') ? '_blank' : undefined} rel="noreferrer" className="link-underline">{l.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <div className="font-display text-[clamp(4rem,18vw,18rem)] leading-[0.85] font-black tracking-tighter text-foreground/95 select-none">
            SUMIT<span className="text-primary">.</span>
          </div>
        </div>

        <div className="mt-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pt-6 border-t border-border/60">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <span className="h-2 w-2 rounded-full bg-primary pulse-dot" />
            All systems operational · v2.0.0
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <a href="https://github.com/" target="_blank" rel="noreferrer" className="hover:text-foreground"><Github className="h-4 w-4" /></a>
            <a href="https://linkedin.com/" target="_blank" rel="noreferrer" className="hover:text-foreground"><Linkedin className="h-4 w-4" /></a>
            <a href="https://wa.me/" target="_blank" rel="noreferrer" className="hover:text-foreground"><MessageCircle className="h-4 w-4" /></a>
          </div>
          <div className="text-xs text-muted-foreground font-mono">
            © {new Date().getFullYear()} Sumit Web Studio. Hand-built in India.
          </div>
        </div>
      </div>
    </footer>
  );
}

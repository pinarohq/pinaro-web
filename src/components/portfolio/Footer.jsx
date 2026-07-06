import { useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  AnimatePresence,
  useReducedMotion,
} from 'framer-motion';
import { Github, Linkedin, MessageCircle, ArrowUpRight, Check } from 'lucide-react';
import { toast } from 'sonner';
import { PORTFOLIO } from '../../constants/testIds/portfolio';
import {
  assertEmailJsConfig,
  buildNewsletterOwnerParams,
  getEmailJsConfig,
  sendTemplate,
} from '../../lib/emailjs';

const EASE = [0.22, 1, 0.36, 1];
const SPRING_SOFT = { type: 'spring', stiffness: 180, damping: 28, mass: 0.6 };
const SPRING_SNAP = { type: 'spring', stiffness: 390, damping: 22 };

const COLS = [
  {
    title: 'Studio',
    links: [
      { label: 'About', href: '#about' },
      { label: 'Services', href: '#services' },
      { label: 'Work', href: '#work' },
      { label: 'Process', href: '#process' },
    ],
  },
  {
    title: 'Connect',
    links: [
      { label: 'Email', href: 'mailto:socialmain2025@gmail.com' },
      { label: 'LinkedIn', href: 'https://linkedin.com/' },
      { label: 'GitHub', href: 'https://github.com/' },
      { label: 'WhatsApp', href: 'https://wa.me/' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Changelog', href: '#' },
      { label: 'Status', href: '#' },
      { label: 'Resume (PDF)', href: '#' },
      { label: 'Brand kit', href: '#' },
    ],
  },
];

/* ─── nav link with directional nudge ─────────────────── */
function FooterLink({ label, href }) {
  return (
    <motion.a
      href={href}
      target={href.startsWith('http') || href.startsWith('mailto') ? '_blank' : undefined}
      rel="noreferrer"
      className="link-underline inline-block text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
      whileHover={{ x: 3 }}
      transition={SPRING_SNAP}
    >
      {label}
    </motion.a>
  );
}

/* ─── magnetic social icon ─────────────────────────────── */
function SocialIcon({ href, icon: Icon, label, reduced }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING_SOFT);
  const y = useSpring(rawY, SPRING_SOFT);

  const onMouseMove = (e) => {
    if (reduced) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rawX.set((e.clientX - cx) * 0.35);
    rawY.set((e.clientY - cy) * 0.35);
  };

  const onMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
    setHovered(false);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      style={{ x, y }}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onMouseLeave}
      whileHover={reduced ? {} : { scale: 1.18 }}
      transition={SPRING_SNAP}
      className="relative h-9 w-9 grid place-items-center rounded-full border border-border/60
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
                 transition-[border-color,color] duration-200"
      style={{
        x,
        y,
        borderColor: hovered ? 'hsl(var(--primary) / 0.5)' : undefined,
        color: hovered ? 'hsl(var(--primary))' : undefined,
      }}
    >
      {/* radial glow behind icon */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            key="glow"
            className="absolute inset-0 rounded-full pointer-events-none"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.22, ease: EASE }}
            style={{
              background: 'radial-gradient(circle, hsl(var(--primary)/0.18) 0%, transparent 70%)',
            }}
          />
        )}
      </AnimatePresence>
      <Icon className="h-4 w-4 relative z-10" />
    </motion.a>
  );
}

/* ─── newsletter form with constrained magnetic tilt ───── */
function NewsletterForm({ reduced }) {
  const formRef = useRef(null);
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [focused, setFocused] = useState(false);

  const rawRX = useMotionValue(0);
  const rawRY = useMotionValue(0);
  const rotateX = useSpring(rawRX, SPRING_SOFT);
  const rotateY = useSpring(rawRY, SPRING_SOFT);

  const onMouseMove = (e) => {
    if (reduced) return;
    const rect = formRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    rawRY.set(dx * 3.5);   // max ±3.5° yaw
    rawRX.set(-dy * 2.5);  // max ±2.5° pitch
  };

  const onMouseLeave = () => {
    rawRX.set(0);
    rawRY.set(0);
  };

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
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    } catch (err) {
      const detail = err?.text || err?.message;
      toast.error(detail ? `Could not subscribe: ${detail}` : 'Could not subscribe. Try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.form
      ref={formRef}
      onSubmit={subscribe}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="mt-6 flex gap-2 max-w-md"
      aria-label="Newsletter subscription"
    >
      <div
        className={`relative flex-1 transition-[box-shadow] duration-200 rounded-full ${
          focused ? 'shadow-[0_0_0_3px_hsl(var(--primary)/0.14)]' : ''
        }`}
      >
        <input
          data-testid={PORTFOLIO.footerNewsletterInput}
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (done) setDone(false); }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="you@studio.com"
          type="email"
          autoComplete="email"
          aria-label="Email address for newsletter"
          className={`w-full bg-card border rounded-full px-4 py-2.5 text-sm focus:outline-none
                      transition-[border-color] duration-200
                      ${focused
                        ? 'border-primary/60'
                        : 'border-border/80 hover:border-foreground/25'}`}
        />
      </div>

      <motion.button
        data-testid={PORTFOLIO.footerNewsletterSubmit}
        disabled={busy}
        type="submit"
        whileHover={busy ? {} : { scale: 1.03 }}
        whileTap={busy ? {} : { scale: 0.96 }}
        transition={SPRING_SNAP}
        className="rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold
                   inline-flex items-center gap-2 transition-opacity duration-200
                   disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-busy={busy}
      >
        <AnimatePresence mode="wait" initial={false}>
          {done ? (
            <motion.span key="done" className="flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.2, ease: EASE }}>
              <Check className="h-4 w-4" /> Done
            </motion.span>
          ) : (
            <motion.span key="sub" className="flex items-center gap-2"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              {busy ? '…' : 'Subscribe'}
              <motion.span
                whileHover={reduced ? {} : { x: 2, y: -2 }}
                transition={SPRING_SNAP}
                className="inline-block"
              >
                <ArrowUpRight className="h-4 w-4" />
              </motion.span>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.form>
  );
}

/* ─── wordmark with shimmer on hover ──────────────────── */
function Wordmark({ reduced }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative inline-block overflow-hidden select-none cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="font-display text-[clamp(4rem,18vw,18rem)] leading-[0.85] font-black tracking-tighter text-foreground/95">
        SUMIT<span className="text-primary">.</span>
      </div>
      {/* shimmer sweep */}
      <AnimatePresence>
        {hovered && !reduced && (
          <motion.div
            key="shimmer"
            className="absolute inset-0 pointer-events-none"
            initial={{ x: '-100%' }}
            animate={{ x: '110%' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: EASE }}
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, hsl(var(--foreground)/0.07) 40%, hsl(var(--primary)/0.12) 50%, hsl(var(--foreground)/0.07) 60%, transparent 100%)',
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── main footer ──────────────────────────────────────── */
export default function Footer() {
  const reduced = useReducedMotion();

  return (
    <footer className="relative border-t border-border/60 pt-20 pb-10 overflow-hidden">
      <div className="container-prem">
        <div className="grid lg:grid-cols-12 gap-12">

          {/* newsletter column */}
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">Newsletter</div>
            <h3 className="font-display text-3xl sm:text-4xl font-black tracking-tighter">
              One letter / month. No fluff.
            </h3>
            <p className="mt-3 text-muted-foreground max-w-md">
              A short note on what I&rsquo;m building, learning, and recommending. Unsubscribe anytime.
            </p>
            <NewsletterForm reduced={reduced} />
          </motion.div>

          {/* link columns */}
          <motion.div
            className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08, ease: EASE }}
          >
            {COLS.map((c, ci) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 + ci * 0.06, ease: EASE }}
              >
                <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
                  {c.title}
                </div>
                <ul className="space-y-2.5">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <FooterLink label={l.label} href={l.href} />
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* large wordmark */}
        <div className="mt-16">
          <Wordmark reduced={reduced} />
        </div>

        {/* bottom bar */}
        <div className="mt-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pt-6 border-t border-border/60">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <span className="h-2 w-2 rounded-full bg-primary pulse-dot flex-shrink-0" />
            All systems operational · v2.0.0
          </div>

          <div className="flex items-center gap-2">
            <SocialIcon href="https://github.com/"   icon={Github}        label="GitHub"    reduced={reduced} />
            <SocialIcon href="https://linkedin.com/" icon={Linkedin}      label="LinkedIn"  reduced={reduced} />
            <SocialIcon href="https://wa.me/"        icon={MessageCircle} label="WhatsApp"  reduced={reduced} />
          </div>

          <div className="text-xs text-muted-foreground font-mono">
            © {new Date().getFullYear()} Pinaro. Hand-built in India.
          </div>
        </div>
      </div>
    </footer>
  );
}

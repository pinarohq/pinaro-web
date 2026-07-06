import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Copy, Check, ArrowRight, Linkedin, Github, MessageCircle, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import MagneticButton from './MagneticButton';
import { PORTFOLIO } from '../../constants/testIds/portfolio';
import {
  OWNER_EMAIL,
  assertEmailJsConfig,
  buildContactCustomerParams,
  buildContactOwnerParams,
  getEmailJsConfig,
  sendTemplate,
} from '../../lib/emailjs';

const EASE = [0.22, 1, 0.36, 1];
const BUDGETS = ['< $5k', '$5k – $15k', '$15k – $40k', '$40k+'];
const TYPES = ['Marketing site', 'Web app / SaaS', 'E-commerce', 'Performance rescue', 'Retainer', 'Other'];

/* ─── progress calculation ─────────────────────────────── */
function calcProgress(form) {
  let filled = 0;
  if (form.name.trim().length >= 2) filled++;
  if (/^\S+@\S+\.\S+$/.test(form.email)) filled++;
  if (form.message.trim().length >= 10) filled++;
  // optional bonus — budget or project type adds the 4th step
  if (form.budget || form.project_type) filled++;
  return Math.round((filled / 4) * 100);
}

/* ─── single field wrapper ─────────────────────────────── */
function Field({ label, error, filled, children }) {
  return (
    <div className="relative">
      <label className="block">
        <span
          className={`block text-xs font-mono uppercase tracking-widest mb-2 transition-colors duration-200 ${
            error
              ? 'text-destructive'
              : filled
              ? 'text-primary/70'
              : 'text-muted-foreground'
          }`}
        >
          {label}
        </span>
        <div className="relative">
          {children}
          {/* filled checkmark */}
          <AnimatePresence>
            {filled && !error && (
              <motion.span
                key="check"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.2, ease: EASE }}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-primary"
                aria-hidden
              >
                <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {error && (
            <motion.span
              key="err"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: EASE }}
              className="block mt-1.5 text-xs text-destructive"
              role="alert"
            >
              {error}
            </motion.span>
          )}
        </AnimatePresence>
      </label>
    </div>
  );
}

/* ─── textarea with char hint ──────────────────────────── */
function MessageField({ value, onChange, error, reduced }) {
  const [focused, setFocused] = useState(false);
  const filled = value.trim().length >= 10;
  const showHint = focused && !filled;

  return (
    <Field label="Project details" error={error} filled={filled}>
      <div className="relative">
        <textarea
          data-testid={PORTFOLIO.contactMessageInput}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`field-input min-h-[140px] resize-y pr-8 ${filled ? 'field-input--filled' : ''} ${error ? 'field-input--error' : ''}`}
          placeholder="What are you building? Timelines, goals, anything you'd share with a senior collaborator."
          aria-invalid={!!error}
          aria-describedby={error ? 'msg-error' : undefined}
        />
        <AnimatePresence>
          {filled && !error && (
            <motion.span
              key="check-msg"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2, ease: EASE }}
              className="pointer-events-none absolute right-3 top-3 text-primary"
              aria-hidden
            >
              <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {showHint && (
          <motion.span
            key="hint"
            initial={reduced ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="block mt-1.5 font-mono text-[10px] text-muted-foreground/60 tabular-nums"
            aria-live="polite"
          >
            {value.trim().length} / 10 characters minimum
          </motion.span>
        )}
      </AnimatePresence>
    </Field>
  );
}

/* ─── main component ───────────────────────────────────── */
export default function Contact() {
  const reduced = useReducedMotion();
  const [form, setForm] = useState({ name: '', email: '', company: '', budget: '', project_type: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [time, setTime] = useState(new Date());
  const [formActive, setFormActive] = useState(false);

  const progress = calcProgress(form);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    // clear error on change
    if (errors[k]) setErrors((prev) => { const n = { ...prev }; delete n[k]; return n; });
  };

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = 'Please enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'A valid email helps me reply.';
    if (form.message.trim().length < 10) e.message = 'Tell me a little more (10+ chars).';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const config = getEmailJsConfig();
      assertEmailJsConfig(config);
      await sendTemplate({ serviceId: config.serviceId, templateId: config.ownerTemplateId, templateParams: buildContactOwnerParams(form), publicKey: config.publicKey });
      await sendTemplate({ serviceId: config.serviceId, templateId: config.customerTemplateId, templateParams: buildContactCustomerParams(form), publicKey: config.publicKey });
      setSuccess(true);
      toast.success("Message received — I'll reply within 4 hours (IST).");
      setForm({ name: '', email: '', company: '', budget: '', project_type: '', message: '' });
    } catch (err) {
      const detail = err?.text || err?.message;
      toast.error(detail ? `Could not send: ${detail}. Email ${OWNER_EMAIL} directly.` : `Something went wrong. Email ${OWNER_EMAIL} directly.`);
    } finally {
      setSubmitting(false);
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(OWNER_EMAIL);
      setCopied(true);
      toast.success('Email copied.');
      setTimeout(() => setCopied(false), 1800);
    } catch (_) { /* clipboard may be denied */ }
  };

  const ist = time.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false });

  // per-field fill states for label colour + checkmark
  const filled = {
    name: form.name.trim().length >= 2,
    email: /^\S+@\S+\.\S+$/.test(form.email),
    company: form.company.trim().length > 0,
    budget: !!form.budget,
    project_type: !!form.project_type,
  };

  return (
    <section id="contact" className="relative py-24 md:py-32 lg:py-40 border-t border-border/60">
      <div className="container-prem grid lg:grid-cols-12 gap-12">

        {/* ── left column ── */}
        <motion.div
          className="lg:col-span-5"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">07 · Contact</div>
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl tracking-tighter leading-[0.92] font-black">
            Let&rsquo;s build
            <br />
            something{' '}
            <motion.span
              className="text-primary italic font-medium inline-block"
              whileHover={reduced ? {} : { y: -2, scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 390, damping: 22 }}
            >
              unforgettable.
            </motion.span>
          </h2>
          <p className="mt-6 max-w-md text-muted-foreground text-base sm:text-lg">
            I reply to every serious inquiry within four hours during India business hours.
          </p>

          <div className="mt-10 space-y-3">
            <motion.button
              data-testid={PORTFOLIO.contactCopyEmail}
              onClick={copyEmail}
              whileHover={reduced ? {} : { x: 3 }}
              transition={{ type: 'spring', stiffness: 390, damping: 22 }}
              className="group flex items-center gap-3 text-base font-semibold link-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              aria-label={`Copy email address ${OWNER_EMAIL}`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {copied ? (
                  <motion.span key="check" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.18 }}>
                    <Check className="h-4 w-4 text-primary" />
                  </motion.span>
                ) : (
                  <motion.span key="copy" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.18 }}>
                    <Copy className="h-4 w-4" />
                  </motion.span>
                )}
              </AnimatePresence>
              {OWNER_EMAIL}
            </motion.button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>IST {ist} · response within 4h</span>
            </div>
          </div>

          <div className="mt-10 flex items-center gap-3">
            {[
              { href: 'https://wa.me/', icon: MessageCircle, label: 'WhatsApp' },
              { href: 'https://linkedin.com/', icon: Linkedin, label: 'LinkedIn' },
              { href: 'https://github.com/', icon: Github, label: 'GitHub' },
            ].map(({ href, icon: Icon, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                whileHover={reduced ? {} : { y: -3, scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 390, damping: 22 }}
                className="h-10 w-10 grid place-items-center rounded-full border border-border/80
                           hover:border-primary hover:text-primary transition-colors duration-200
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Icon className="h-4 w-4" />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* ── form column ── */}
        <div className="lg:col-span-7">
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1, ease: EASE }}
            onFocus={() => setFormActive(true)}
            onBlur={() => setFormActive(false)}
            noValidate
            aria-label="Contact form"
            className={`relative rounded-2xl border bg-card p-6 sm:p-8 lg:p-10 space-y-5 overflow-hidden
                        transition-[border-color,box-shadow] duration-300
                        ${formActive
                          ? 'border-primary/25 shadow-[0_0_0_1px_hsl(var(--primary)/0.08),0_16px_48px_-16px_hsl(var(--primary)/0.12)]'
                          : 'border-border/60'}`}
          >
            {/* progress bar — top edge of card */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-border/40 overflow-hidden rounded-t-2xl" aria-hidden>
              <motion.div
                className="h-full bg-primary origin-left"
                animate={{ scaleX: progress / 100 }}
                transition={reduced ? { duration: 0 } : { duration: 0.5, ease: EASE }}
                style={{ transformOrigin: 'left' }}
              />
            </div>

            {/* progress label — screen reader */}
            <span className="sr-only" aria-live="polite">
              Form {progress}% complete
            </span>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Your name" error={errors.name} filled={filled.name && !errors.name}>
                <input
                  data-testid={PORTFOLIO.contactNameInput}
                  value={form.name}
                  onChange={set('name')}
                  className={`field-input pr-8 ${filled.name && !errors.name ? 'field-input--filled' : ''} ${errors.name ? 'field-input--error' : ''}`}
                  placeholder="Jane Doe"
                  aria-invalid={!!errors.name}
                  autoComplete="name"
                />
              </Field>
              <Field label="Email" error={errors.email} filled={filled.email && !errors.email}>
                <input
                  data-testid={PORTFOLIO.contactEmailInput}
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  className={`field-input pr-8 ${filled.email && !errors.email ? 'field-input--filled' : ''} ${errors.email ? 'field-input--error' : ''}`}
                  placeholder="jane@company.com"
                  aria-invalid={!!errors.email}
                  autoComplete="email"
                />
              </Field>
            </div>

            <Field label="Company (optional)" filled={filled.company}>
              <input
                data-testid={PORTFOLIO.contactCompanyInput}
                value={form.company}
                onChange={set('company')}
                className={`field-input pr-8 ${filled.company ? 'field-input--filled' : ''}`}
                placeholder="Company Inc."
                autoComplete="organization"
              />
            </Field>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Budget" filled={filled.budget}>
                <select
                  data-testid={PORTFOLIO.contactBudgetSelect}
                  value={form.budget}
                  onChange={set('budget')}
                  className={`field-input ${filled.budget ? 'field-input--filled' : ''}`}
                >
                  <option value="">Select…</option>
                  {BUDGETS.map((b) => <option key={b}>{b}</option>)}
                </select>
              </Field>
              <Field label="Project type" filled={filled.project_type}>
                <select
                  data-testid={PORTFOLIO.contactProjectTypeSelect}
                  value={form.project_type}
                  onChange={set('project_type')}
                  className={`field-input ${filled.project_type ? 'field-input--filled' : ''}`}
                >
                  <option value="">Select…</option>
                  {TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </Field>
            </div>

            <MessageField
              value={form.message}
              onChange={set('message')}
              error={errors.message}
              reduced={reduced}
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <p className="text-xs text-muted-foreground font-mono">
                By submitting you agree to a one-time reply at{' '}
                <span className="text-foreground">{OWNER_EMAIL}</span>.
              </p>

              <motion.div
                whileHover={reduced || submitting || success ? {} : { scale: 1.02 }}
                whileTap={reduced || submitting || success ? {} : { scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 390, damping: 22 }}
              >
                <MagneticButton
                  testid={PORTFOLIO.contactSubmit}
                  type="submit"
                  disabled={submitting || success}
                  aria-busy={submitting}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {submitting ? (
                      <motion.span key="sending" className="flex items-center gap-2"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}>
                        <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                      </motion.span>
                    ) : success ? (
                      <motion.span key="sent" className="flex items-center gap-2 text-primary"
                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: EASE }}>
                        <Check className="h-4 w-4" /> Sent
                      </motion.span>
                    ) : (
                      <motion.span key="idle" className="flex items-center gap-2"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}>
                        Send message <ArrowRight className="h-4 w-4" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </MagneticButton>
              </motion.div>
            </div>
          </motion.form>
        </div>
      </div>

      <style>{`
        .field-input {
          width: 100%;
          background: hsl(var(--background));
          border: 1px solid hsl(var(--border));
          border-radius: 0.5rem;
          padding: 0.7rem 0.9rem;
          font-size: 0.95rem;
          color: hsl(var(--foreground));
          transition: border-color 200ms ease, box-shadow 200ms ease, background-color 200ms ease;
          will-change: border-color, box-shadow;
        }
        .field-input:hover:not(:focus) {
          border-color: hsl(var(--foreground) / 0.28);
        }
        .field-input:focus {
          outline: none;
          border-color: hsl(var(--primary) / 0.7);
          box-shadow: 0 0 0 3px hsl(var(--primary) / 0.14);
        }
        .field-input--filled:not(:focus) {
          border-color: hsl(var(--primary) / 0.35);
          background: hsl(var(--primary) / 0.03);
        }
        .field-input--error {
          border-color: hsl(var(--destructive) / 0.7) !important;
          box-shadow: 0 0 0 3px hsl(var(--destructive) / 0.1) !important;
        }
        .field-input::placeholder {
          color: hsl(var(--muted-foreground) / 0.6);
          transition: opacity 200ms ease;
        }
        .field-input:focus::placeholder {
          opacity: 0.4;
        }
        select.field-input {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='hsl(0 0% 50%)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          padding-right: 2.2rem;
          cursor: pointer;
        }
      `}</style>
    </section>
  );
}

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, ArrowRight, Linkedin, Github, MessageCircle, Clock } from 'lucide-react';
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

const BUDGETS = ['< $5k', '$5k – $15k', '$15k – $40k', '$40k+'];
const TYPES = ['Marketing site', 'Web app / SaaS', 'E-commerce', 'Performance rescue', 'Retainer', 'Other'];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', company: '', budget: '', project_type: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

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

      const ownerParams = buildContactOwnerParams(form);
      const customerParams = buildContactCustomerParams(form);

      await sendTemplate({
        serviceId: config.serviceId,
        templateId: config.ownerTemplateId,
        templateParams: ownerParams,
        publicKey: config.publicKey,
      });

      await sendTemplate({
        serviceId: config.serviceId,
        templateId: config.customerTemplateId,
        templateParams: customerParams,
        publicKey: config.publicKey,
      });

      setSuccess(true);
      toast.success("Message received — I'll reply within 4 hours (IST).");
      setForm({ name: '', email: '', company: '', budget: '', project_type: '', message: '' });
    } catch (err) {
      const detail = err?.text || err?.message;
      toast.error(
        detail
          ? `Could not send your message: ${detail}. Please email ${OWNER_EMAIL} directly.`
          : `Something went wrong. Please email ${OWNER_EMAIL} directly.`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(OWNER_EMAIL); setCopied(true); toast.success('Email copied.'); setTimeout(() => setCopied(false), 1800); } catch (_) { /* clipboard may be denied */ }
  };

  const ist = time.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <section id="contact" className="relative py-24 md:py-32 lg:py-40 border-t border-border/60">
      <div className="container-prem grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">07 · Contact</div>
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl tracking-tighter leading-[0.92] font-black">
            Let&rsquo;s build
            <br />
            something <span className="text-primary italic font-medium">unforgettable.</span>
          </h2>
          <p className="mt-6 max-w-md text-muted-foreground text-base sm:text-lg">
            I reply to every serious inquiry within four hours during India business hours.
          </p>

          <div className="mt-10 space-y-3">
            <button
              data-testid={PORTFOLIO.contactCopyEmail}
              onClick={copyEmail}
              className="group flex items-center gap-3 text-base font-semibold link-underline"
            >
              {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
              {OWNER_EMAIL}
            </button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>IST {ist} · response within 4h</span>
            </div>
          </div>

          <div className="mt-10 flex items-center gap-3">
            <a href="https://wa.me/" target="_blank" rel="noreferrer" className="h-10 w-10 grid place-items-center rounded-full border border-border/80 hover:border-primary hover:text-primary transition-colors" aria-label="WhatsApp"><MessageCircle className="h-4 w-4" /></a>
            <a href="https://linkedin.com/" target="_blank" rel="noreferrer" className="h-10 w-10 grid place-items-center rounded-full border border-border/80 hover:border-primary hover:text-primary transition-colors" aria-label="LinkedIn"><Linkedin className="h-4 w-4" /></a>
            <a href="https://github.com/" target="_blank" rel="noreferrer" className="h-10 w-10 grid place-items-center rounded-full border border-border/80 hover:border-primary hover:text-primary transition-colors" aria-label="GitHub"><Github className="h-4 w-4" /></a>
          </div>
        </div>

        <div className="lg:col-span-7">
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 lg:p-10 space-y-5"
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Your name" error={errors.name}>
                <input data-testid={PORTFOLIO.contactNameInput} value={form.name} onChange={set('name')} className="field-input" placeholder="Jane Doe" />
              </Field>
              <Field label="Email" error={errors.email}>
                <input data-testid={PORTFOLIO.contactEmailInput} type="email" value={form.email} onChange={set('email')} className="field-input" placeholder="jane@company.com" />
              </Field>
            </div>
            <Field label="Company (optional)">
              <input data-testid={PORTFOLIO.contactCompanyInput} value={form.company} onChange={set('company')} className="field-input" placeholder="Company Inc." />
            </Field>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Budget">
                <select data-testid={PORTFOLIO.contactBudgetSelect} value={form.budget} onChange={set('budget')} className="field-input">
                  <option value="">Select…</option>
                  {BUDGETS.map((b) => <option key={b}>{b}</option>)}
                </select>
              </Field>
              <Field label="Project type">
                <select data-testid={PORTFOLIO.contactProjectTypeSelect} value={form.project_type} onChange={set('project_type')} className="field-input">
                  <option value="">Select…</option>
                  {TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Project details" error={errors.message}>
              <textarea data-testid={PORTFOLIO.contactMessageInput} value={form.message} onChange={set('message')} className="field-input min-h-[140px] resize-y" placeholder="What are you building? Timelines, goals, anything you'd share with a senior collaborator." />
            </Field>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <p className="text-xs text-muted-foreground font-mono">
                By submitting you agree to a one-time reply at <span className="text-foreground">{OWNER_EMAIL}</span>.
              </p>
              <MagneticButton testid={PORTFOLIO.contactSubmit} type="submit">
                {submitting ? 'Sending…' : success ? 'Sent ✓' : 'Send message'} <ArrowRight className="h-4 w-4" />
              </MagneticButton>
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
          transition: border-color 200ms ease, box-shadow 200ms ease;
        }
        .field-input:focus { outline: none; border-color: hsl(var(--primary)); box-shadow: 0 0 0 3px hsl(var(--primary) / 0.18); }
        .field-input::placeholder { color: hsl(var(--muted-foreground)); }
      `}</style>
    </section>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">{label}</span>
      {children}
      {error && <span className="block mt-1.5 text-xs text-destructive">{error}</span>}
    </label>
  );
}

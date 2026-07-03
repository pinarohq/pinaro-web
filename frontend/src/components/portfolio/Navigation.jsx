import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Command, Moon, Sun, Menu, X } from 'lucide-react';
import ScrollProgress from './ScrollProgress';
import { useTheme } from '../../context/ThemeContext';
import { PORTFOLIO } from '../../constants/testIds/portfolio';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { id: 'about', label: 'About', testid: PORTFOLIO.navAbout },
  { id: 'services', label: 'Services', testid: PORTFOLIO.navServices },
  { id: 'work', label: 'Work', testid: PORTFOLIO.navWork },
  { id: 'process', label: 'Process', testid: PORTFOLIO.navProcess },
  { id: 'contact', label: 'Contact', testid: PORTFOLIO.navContact },
];

export default function Navigation({ onOpenCommand }) {
  const { theme, toggleTheme } = useTheme();
  const [active, setActive] = useState('home');
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  // Use a ref so tracking the previous scroll position never triggers a re-render
  const lastY = useRef(0);
  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === '/';
  // Keep onHome in a ref so the scroll handler always sees the current value
  // without being listed as a dependency (which would re-attach the listener)
  const onHomeRef = useRef(onHome);
  useEffect(() => { onHomeRef.current = onHome; }, [onHome]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const prev = lastY.current;
      lastY.current = y;
      // Only update React state when the hidden value actually changes,
      // preventing spurious re-renders on every scroll tick
      setHidden((h) => {
        const next = y > 120 && y > prev;
        return next !== h ? next : h;
      });
      if (!onHomeRef.current) return;
      const sections = ['home', 'about', 'services', 'work', 'process', 'testimonials', 'contact'];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 120) { setActive(sections[i]); break; }
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
    // Intentionally empty — the listener is stable for the component lifetime.
    // onHomeRef keeps the route flag current without triggering re-attachment.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goTo = (id) => {
    setMobileOpen(false);
    if (!onHome) {
      navigate('/', { state: { scrollTo: id } });
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: hidden ? -88 : 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
      style={{ willChange: 'transform' }}
    >
      <div className="glass relative border-b border-border/60">
        <div className="container-prem flex items-center justify-between h-16 md:h-20">
          <Link to="/" data-testid={PORTFOLIO.navLogo} className="group flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-primary grid place-items-center text-primary-foreground font-display font-black text-sm">S</div>
            <span className="font-display text-base md:text-lg font-black tracking-tight">
              SUMIT<span className="text-primary">.</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <button
                key={l.id}
                data-testid={l.testid}
                onClick={() => goTo(l.id)}
                className={cn(
                  'relative px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors',
                  active === l.id && 'text-foreground'
                )}
              >
                {l.label}
                {active === l.id && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute left-3 right-3 -bottom-0.5 h-px bg-primary"
                  />
                )}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              data-testid={PORTFOLIO.navCommandTrigger}
              onClick={onOpenCommand}
              className="hidden md:inline-flex items-center gap-2 rounded-full border border-border/80 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-primary/60 transition-colors"
              aria-label="Open command palette"
            >
              <Command className="h-3.5 w-3.5" />
              <span className="font-mono">Ctrl K</span>
            </button>
            <button
              data-testid={PORTFOLIO.navThemeToggle}
              onClick={toggleTheme}
              className="h-9 w-9 grid place-items-center rounded-full border border-border/80 hover:border-primary/60 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              data-testid={PORTFOLIO.navMobileToggle}
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden h-9 w-9 grid place-items-center rounded-full border border-border/80"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <ScrollProgress />
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden border-b border-border/60 bg-background/95 backdrop-blur-xl"
          >
            <div className="container-prem py-4 flex flex-col">
              {NAV_LINKS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => goTo(l.id)}
                  className="py-3 text-left text-base font-medium border-b border-border/40 last:border-none"
                >
                  {l.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

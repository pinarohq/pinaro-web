import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/portfolio/Hero';
import About from '../components/portfolio/About';
import Services from '../components/portfolio/Services';
import Projects from '../components/portfolio/Projects';
import Skills from '../components/portfolio/Skills';
import Process from '../components/portfolio/Process';
import Testimonials from '../components/portfolio/Testimonials';
import Contact from '../components/portfolio/Contact';
import { projects } from '../data/projects';

export default function Home() {
  const location = useLocation();
  useEffect(() => {
    const id = location.state?.scrollTo;
    if (id) {
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [location.state]);

  return (
    <>
      <Hero />
      <Marquee />
      <About />
      <Services />
      <Projects />
      <Skills />
      <Process />
      <Testimonials />
      <Contact />
    </>
  );
}

function Marquee() {
  const items = [...projects.map(p => p.client), 'Lighthouse 99+', 'WCAG AA', 'India + Remote', 'Cinematic motion', 'Available Q1'];
  const doubled = [...items, ...items];
  return (
    <section aria-hidden className="border-y border-border/60 overflow-hidden py-6">
      <div className="anim-marquee flex gap-12 whitespace-nowrap">
        {doubled.map((s, i) => (
          <span key={i} className="font-display text-2xl sm:text-3xl font-black tracking-tighter text-muted-foreground inline-flex items-center gap-12">
            {s} <span className="text-primary">★</span>
          </span>
        ))}
      </div>
    </section>
  );
}

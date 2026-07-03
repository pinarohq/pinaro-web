import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/context/ThemeContext';
import Navigation from '@/components/portfolio/Navigation';
import Footer from '@/components/portfolio/Footer';
import CustomCursor from '@/components/portfolio/CustomCursor';
import SmoothScroll from '@/components/portfolio/SmoothScroll';
import NoiseOverlay from '@/components/portfolio/NoiseOverlay';
import CommandPalette from '@/components/portfolio/CommandPalette';
import ScrollProgress from '@/components/portfolio/ScrollProgress';
import Home from '@/pages/Home';
import ProjectDetail from '@/pages/ProjectDetail';
import NotFound from '@/pages/NotFound';
import '@/App.css';

function Shell() {
  const [cmdOpen, setCmdOpen] = useState(false);
  return (
    <>
      <SmoothScroll />
      <ScrollProgress />
      <CustomCursor />
      <NoiseOverlay />
      <Navigation onOpenCommand={() => setCmdOpen(true)} />
      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />
      <main className="relative z-[2]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work/:slug" element={<ProjectDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Toaster theme="dark" position="bottom-right" richColors closeButton />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="App">
          <Shell />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

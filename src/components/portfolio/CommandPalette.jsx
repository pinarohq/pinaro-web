import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command as CommandIcon, Home, User, Briefcase, Folder, GitBranch, Mail, Sun, Moon, Copy } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { useTheme } from '../../context/ThemeContext';
import { projects } from '../../data/projects';
import { toast } from 'sonner';
import { PORTFOLIO } from '../../constants/testIds/portfolio';

export default function CommandPalette({ open, onOpenChange }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onKey = (e) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onOpenChange]);

  const goSection = useCallback((id) => {
    onOpenChange(false);
    if (window.location.pathname !== '/') {
      navigate('/', { state: { scrollTo: id } });
      return;
    }
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 50);
  }, [navigate, onOpenChange]);

  const copyEmail = () => {
    navigator.clipboard?.writeText('socialmain2025@gmail.com');
    toast.success('Email copied — socialmain2025@gmail.com');
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput data-testid={PORTFOLIO.cmdkInput} placeholder="Search projects, sections, commands…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Navigate">
          <CommandItem data-testid={PORTFOLIO.cmdkItem} onSelect={() => goSection('home')}><Home className="mr-2 h-4 w-4" /> Home</CommandItem>
          <CommandItem onSelect={() => goSection('about')}><User className="mr-2 h-4 w-4" /> About</CommandItem>
          <CommandItem onSelect={() => goSection('services')}><Briefcase className="mr-2 h-4 w-4" /> Services</CommandItem>
          <CommandItem onSelect={() => goSection('work')}><Folder className="mr-2 h-4 w-4" /> Work</CommandItem>
          <CommandItem onSelect={() => goSection('process')}><GitBranch className="mr-2 h-4 w-4" /> Process</CommandItem>
          <CommandItem onSelect={() => goSection('contact')}><Mail className="mr-2 h-4 w-4" /> Contact</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Projects">
          {projects.slice(0, 6).map((p) => (
            <CommandItem key={p.slug} onSelect={() => { onOpenChange(false); navigate(`/work/${p.slug}`); }}>
              <Folder className="mr-2 h-4 w-4" /> {p.title}
              <CommandShortcut>{p.industry}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Commands">
          <CommandItem onSelect={() => { toggleTheme(); }}>
            {theme === 'dark' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
            Toggle theme
            <CommandShortcut>⇧ D</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={copyEmail}>
            <Copy className="mr-2 h-4 w-4" /> Copy email
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

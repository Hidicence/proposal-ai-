'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: '功能特色', href: '#features' },
  { label: '運作方式', href: '#how-it-works' },
  { label: '方案定價', href: '#pricing' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-lg shadow-black/20' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <a href="/" className="flex items-center gap-2 cursor-pointer">
          <span className="w-2 h-2 rounded-full bg-indigo-400" />
          <span className="font-heading text-lg font-bold text-white">Proposal AI</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              {l.label}
            </a>
          ))}
        </div>

        <a
          href="#pricing"
          className="hidden md:inline-flex text-sm px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all cursor-pointer"
        >
          免費試用
        </a>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-zinc-400 hover:text-white cursor-pointer"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden glass border-t border-white/[0.06] px-6 py-4 space-y-3">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm text-zinc-300 hover:text-white cursor-pointer"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#pricing"
            className="block text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-medium text-center cursor-pointer"
          >
            免費試用
          </a>
        </div>
      )}
    </nav>
  );
}

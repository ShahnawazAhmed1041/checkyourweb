// src/components/Header.jsx
'use client';

import Image from 'next/image';
import { Sparkles } from 'lucide-react';

export default function Header() {
  const navLinks = [
    { label: 'Analyze Website', href: '#analyze-website' },
    { label: 'Google View', href: '#google-view' },
    { label: 'Visitor View', href: '#visitor-view' },
    { label: 'AI Bot View', href: '#ai-bot-view' },
    { label: 'SEO View', href: '#seo-view' },
    { label: 'AEO View', href: '#aeo-view' },
    { label: 'Business View', href: '#business-view' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <a href="#analyze-website" className="flex items-center gap-3 flex-shrink-0 cursor-pointer group">
          {/* Custom Logo Image */}
          <div className="relative w-9 h-9 flex items-center justify-center rounded-xl overflow-hidden shadow-xs">
            <Image
              src="/icon.png"
              alt="Check Your Web Logo"
              width={36}
              height={36}
              className="object-contain"
              onError={(e) => {
                // Agar path different ho toh fallback visual icon
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          <span className="font-extrabold text-xl tracking-tight text-slate-950">
            Check <span className="text-blue-600">Your</span> Web
          </span>
        </a>

        {/* Perspective Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Badge Status */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-100/90 px-3 py-1.5 rounded-full border border-slate-200/80 flex-shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
          <span className="hidden sm:inline">Instant 7-Perspective Audit</span>
          <span className="sm:hidden">Audit</span>
        </div>

      </div>
    </header>
  );
}
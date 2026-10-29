'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Instagram, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Início', href: '/' },
  { name: 'Serviços', href: '/servicos' },
  { name: 'Planos', href: '/planos' },
  { name: 'Galeria', href: '/galeria' },
  { name: 'Produtos', href: '/produtos' },
  { name: 'Sobre Nós', href: '/sobre' },
  { name: 'Dicas', href: '/dicas' },
  { name: 'Contato', href: '/contato' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4',
        scrolled ? 'bg-brand-black/90 backdrop-blur-md border-b border-brand-gold/20' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand */}
        <Link href="/" className="flex flex-col items-start shrink-0 group">
          <span className="text-2xl font-bold tracking-tighter text-brand-white group-hover:text-brand-gold transition-colors">
            RELUZ
          </span>
          <span className="text-[10px] tracking-[0.2em] text-brand-gold font-medium -mt-1 uppercase">
            Estética Automotiva
          </span>
        </Link>

        {/* Zone 2: Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-brand-gray">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'hover:text-brand-gold transition-colors whitespace-nowrap shrink-0 relative py-1',
                pathname === link.href && 'text-brand-gold'
              )}
            >
              {link.name}
              {pathname === link.href && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-gold"
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-4 shrink-0">
          <Link
            href="/agendamento"
            className="hidden sm:block px-5 py-2.5 text-xs font-bold uppercase tracking-widest bg-brand-gold text-brand-black rounded-sm hover:bg-brand-white transition-all transform hover:scale-105 whitespace-nowrap shrink-0"
          >
            Agendar Agora
          </Link>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-brand-white p-2"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-brand-graphite border-b border-brand-gold/20 p-6 md:hidden flex flex-col gap-4 shadow-2xl"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'text-lg font-medium py-2 border-b border-brand-white/5 last:border-0',
                  pathname === link.href ? 'text-brand-gold' : 'text-brand-white'
                )}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/agendamento"
              onClick={() => setIsOpen(false)}
              className="mt-4 w-full py-4 bg-brand-gold text-brand-black text-center font-bold uppercase tracking-widest rounded-sm"
            >
              Agendar Agora
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

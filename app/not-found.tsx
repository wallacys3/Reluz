'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-brand-black flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative"
      >
        <h1 className="text-[12rem] md:text-[20rem] font-bold text-brand-white/5 select-none">404</h1>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Página não encontrada</h2>
          <p className="text-brand-gray max-w-md mx-auto mb-10">
            Parece que você pegou o caminho errado. A página que você está procurando não existe ou foi movida.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/"
              className="px-8 py-4 bg-brand-gold text-brand-black font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-brand-white transition-all"
            >
              <Home size={16} /> Voltar ao Início
            </Link>
            <button
              onClick={() => window.history.back()}
              className="px-8 py-4 border border-brand-white/10 text-brand-white font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-brand-white hover:text-brand-black transition-all"
            >
              <ArrowLeft size={16} /> Voltar Anterior
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

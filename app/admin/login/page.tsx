'use client';

import { motion } from 'motion/react';
import { LogIn } from 'lucide-react';
import Link from 'next/link';

export default function AdminLogin() {
  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center p-6">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-gold via-transparent to-transparent" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-brand-graphite p-10 border border-brand-white/5 relative z-10"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex flex-col items-center group mb-8">
            <span className="text-3xl font-bold tracking-tighter text-brand-white group-hover:text-brand-gold transition-colors">
              RELUZ
            </span>
            <span className="text-[10px] tracking-[0.2em] text-brand-gold font-medium -mt-1 uppercase">
              Admin Panel
            </span>
          </Link>
          <h1 className="text-2xl font-bold mb-2">Bem-vindo de volta</h1>
          <p className="text-brand-gray text-sm">Acesse o painel administrativo para gerenciar seu negócio.</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">E-mail</label>
            <input
              type="email"
              className="w-full bg-brand-black border border-brand-white/10 px-4 py-4 text-sm focus:border-brand-gold outline-none transition-colors"
              placeholder="seu@email.com"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">Senha</label>
              <button type="button" className="text-[10px] font-bold uppercase tracking-widest text-brand-gray hover:text-brand-gold transition-colors">Esqueceu?</button>
            </div>
            <input
              type="password"
              className="w-full bg-brand-black border border-brand-white/10 px-4 py-4 text-sm focus:border-brand-gold outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-5 bg-brand-gold text-brand-black font-bold uppercase tracking-widest text-sm hover:bg-brand-white transition-all flex items-center justify-center gap-3"
          >
            Entrar no Painel <LogIn size={18} />
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-brand-white/5 text-center">
          <Link href="/" className="text-[10px] font-bold uppercase tracking-widest text-brand-gray hover:text-brand-white transition-colors">
            Voltar para o site oficial
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

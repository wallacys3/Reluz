'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LogIn, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem('reluz_admin_token');
    if (token === 'authenticated_adm') {
      router.push('/admin');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Mocking the specific credentials requested: adm / 1234
    setTimeout(() => {
      if (login === 'adm' && password === '1234') {
        localStorage.setItem('reluz_admin_token', 'authenticated_adm');
        router.push('/admin');
      } else {
        setError('Login ou senha incorretos.');
        setLoading(false);
      }
    }, 1000);
  };

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
          <h1 className="text-2xl font-bold mb-2">Painel de Controle</h1>
          <p className="text-brand-gray text-sm text-balance">Gerencie os serviços e conteúdos da Reluz Estética Automotiva.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/20 rounded-sm flex items-center gap-3 text-red-500 text-sm font-medium"
            >
              <AlertCircle size={18} />
              {error}
            </motion.div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">Usuário</label>
            <input
              type="text"
              required
              className="w-full bg-brand-black border border-brand-white/10 px-4 py-4 text-sm focus:border-brand-gold outline-none transition-colors"
              placeholder="Digite o login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">Senha</label>
            </div>
            <input
              type="password"
              required
              className="w-full bg-brand-black border border-brand-white/10 px-4 py-4 text-sm focus:border-brand-gold outline-none transition-colors"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-brand-gold text-brand-black font-bold uppercase tracking-widest text-sm hover:bg-brand-white transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? 'Autenticando...' : 'Entrar no Painel'} <LogIn size={18} />
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

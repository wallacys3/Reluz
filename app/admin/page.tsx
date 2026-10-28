'use client';

import { motion } from 'motion/react';
import { TrendingUp, Users, Calendar, Scissors, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Link from 'next/link';

const stats = [
  { name: 'Novos Orçamentos', value: '12', change: '+20%', positive: true, icon: TrendingUp },
  { name: 'Agendamentos Pendentes', value: '8', change: '-5%', positive: false, icon: Calendar },
  { name: 'Total de Clientes', value: '142', change: '+12%', positive: true, icon: Users },
  { name: 'Serviços Realizados', value: '45', change: '+8%', positive: true, icon: Scissors },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-brand-graphite p-6 border border-brand-white/5"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-brand-black border border-brand-gold/20 rounded-sm">
                <stat.icon className="text-brand-gold" size={20} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.positive ? 'text-emerald-500' : 'text-red-500'}`}>
                {stat.change}
                {stat.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              </div>
            </div>
            <p className="text-brand-gray text-xs uppercase tracking-widest font-bold mb-1">{stat.name}</p>
            <p className="text-3xl font-bold text-brand-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-brand-graphite border border-brand-white/5 flex flex-col">
          <div className="p-6 border-b border-brand-white/5 flex items-center justify-between">
            <h3 className="font-bold text-sm uppercase tracking-widest text-brand-gold">Últimos Agendamentos</h3>
            <button className="text-[10px] uppercase tracking-widest font-bold hover:text-brand-gold transition-colors">Ver todos</button>
          </div>
          <div className="flex-grow">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-brand-white/5 text-[10px] uppercase tracking-widest text-brand-gray">
                  <th className="px-6 py-4 font-bold">Cliente</th>
                  <th className="px-6 py-4 font-bold">Veículo</th>
                  <th className="px-6 py-4 font-bold">Serviço</th>
                  <th className="px-6 py-4 font-bold">Data/Hora</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-white/5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="text-sm hover:bg-brand-white/5 transition-colors group">
                    <td className="px-6 py-4 font-medium text-brand-white">João Silva {i}</td>
                    <td className="px-6 py-4 text-brand-gray">BMW M3 G80</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-brand-black text-brand-gold text-[10px] font-bold uppercase tracking-widest border border-brand-gold/10">Polimento</span>
                    </td>
                    <td className="px-6 py-4 text-brand-gray tabular-nums">28/10 · 14:00</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="text-xs">Pendente</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-brand-graphite border border-brand-white/5 p-6">
          <h3 className="font-bold text-sm uppercase tracking-widest text-brand-gold mb-8">Ações Rápidas</h3>
          <div className="space-y-4">
            <button className="w-full py-4 bg-brand-gold text-brand-black font-bold uppercase tracking-widest text-[10px] hover:bg-brand-white transition-all">
              Novo Orçamento
            </button>
            <button className="w-full py-4 border border-brand-white/10 text-brand-white font-bold uppercase tracking-widest text-[10px] hover:bg-brand-white hover:text-brand-black transition-all">
              Adicionar Galeria
            </button>
            <button className="w-full py-4 border border-brand-white/10 text-brand-white font-bold uppercase tracking-widest text-[10px] hover:bg-brand-white hover:text-brand-black transition-all">
              Novo Artigo
            </button>
          </div>

          <div className="mt-12 p-6 bg-brand-black border border-brand-gold/10">
            <h4 className="text-brand-gold font-bold uppercase tracking-widest text-[10px] mb-4 text-center">Atalhos</h4>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/" target="_blank" className="text-center p-4 bg-brand-graphite hover:text-brand-gold transition-all flex flex-col items-center gap-2">
                <ArrowUpRight size={16} />
                <span className="text-[10px] uppercase tracking-widest font-bold">Ver Site</span>
              </Link>
              <Link href="/admin/clientes" className="text-center p-4 bg-brand-graphite hover:text-brand-gold transition-all flex flex-col items-center gap-2">
                <Users size={16} />
                <span className="text-[10px] uppercase tracking-widest font-bold">Clientes</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Users, Calendar, Package, ArrowUpRight, ArrowDownRight, Clock, Car } from 'lucide-react';
import Link from 'next/link';

interface Stat {
  name: string;
  value: string;
  change: string;
  positive: boolean;
}

interface Booking {
  id: number;
  customerName: string;
  vehicleModel: string;
  serviceType: string;
  preferredDate: string;
  preferredTime: string;
  status: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data.stats);
        setRecentBookings(data.recentBookings);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-gold"></div>
      </div>
    );
  }

  const icons = [Users, Calendar, TrendingUp, Package];

  return (
    <div className="space-y-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = icons[i] || TrendingUp;
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-brand-graphite p-6 border border-brand-white/5"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-brand-black border border-brand-gold/20 rounded-sm">
                  <Icon className="text-brand-gold" size={20} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold ${stat.positive ? 'text-emerald-500' : 'text-red-500'}`}>
                  {stat.change}
                  {stat.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                </div>
              </div>
              <p className="text-brand-gray text-xs uppercase tracking-widest font-bold mb-1">{stat.name}</p>
              <p className="text-2xl font-bold text-brand-white">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-brand-graphite border border-brand-white/5 flex flex-col">
          <div className="p-6 border-b border-brand-white/5 flex items-center justify-between">
            <h3 className="font-bold text-sm uppercase tracking-widest text-brand-gold">Últimos Agendamentos</h3>
            <Link href="/admin/agendamentos" className="text-[10px] uppercase tracking-widest font-bold hover:text-brand-gold transition-colors">Ver todos</Link>
          </div>
          <div className="overflow-x-auto">
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
                {recentBookings.length > 0 ? recentBookings.map((booking) => (
                  <tr key={booking.id} className="text-sm hover:bg-brand-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-brand-white">{booking.customerName}</td>
                    <td className="px-6 py-4 text-brand-gray">{booking.vehicleModel}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-brand-black text-brand-gold text-[10px] font-bold uppercase tracking-widest border border-brand-gold/10">
                        {booking.serviceType.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-brand-gray tabular-nums">
                      {new Date(booking.preferredDate).toLocaleDateString('pt-BR')} · {booking.preferredTime}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          booking.status === 'pending' ? 'bg-amber-500' : 
                          booking.status === 'confirmed' ? 'bg-emerald-500' : 'bg-red-500'
                        }`} />
                        <span className="text-xs capitalize">{booking.status}</span>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-brand-gray italic">
                      Nenhum agendamento recente.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-brand-graphite border border-brand-white/5 p-6">
          <h3 className="font-bold text-sm uppercase tracking-widest text-brand-gold mb-8">Ações Rápidas</h3>
          <div className="space-y-4">
            <Link href="/admin/vendas" className="block w-full py-4 bg-brand-gold text-brand-black font-bold uppercase tracking-widest text-[10px] hover:bg-brand-white transition-all text-center">
              Nova Venda
            </Link>
            <Link href="/admin/produtos" className="block w-full py-4 border border-brand-white/10 text-brand-white font-bold uppercase tracking-widest text-[10px] hover:bg-brand-white hover:text-brand-black transition-all text-center">
              Gerenciar Estoque
            </Link>
            <Link href="/admin/clientes" className="block w-full py-4 border border-brand-white/10 text-brand-white font-bold uppercase tracking-widest text-[10px] hover:bg-brand-white hover:text-brand-black transition-all text-center">
              Cadastrar Cliente
            </Link>
          </div>

          <div className="mt-12 p-6 bg-brand-black border border-brand-gold/10">
            <h4 className="text-brand-gold font-bold uppercase tracking-widest text-[10px] mb-4 text-center">Atalhos do Sistema</h4>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/" target="_blank" className="text-center p-4 bg-brand-graphite hover:text-brand-gold transition-all flex flex-col items-center gap-2">
                <ArrowUpRight size={16} />
                <span className="text-[10px] uppercase tracking-widest font-bold">Ver Site</span>
              </Link>
              <Link href="/admin/config" className="text-center p-4 bg-brand-graphite hover:text-brand-gold transition-all flex flex-col items-center gap-2">
                <Package size={16} />
                <span className="text-[10px] uppercase tracking-widest font-bold">Config</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

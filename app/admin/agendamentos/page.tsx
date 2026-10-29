'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  User, 
  Car, 
  Search, 
  Plus, 
  X, 
  CheckCircle2, 
  Clock3, 
  XCircle, 
  Phone,
  MoreVertical,
  Trash2,
  ChevronDown
} from 'lucide-react';

interface Booking {
  id: number;
  customerName: string;
  customerWhatsapp: string;
  vehicleModel: string;
  vehicleYear: string;
  serviceType: string;
  preferredDate: string;
  preferredTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  observations: string;
}

export default function AdminAgendamentos() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    customerName: '',
    customerWhatsapp: '',
    vehicleModel: '',
    vehicleYear: '',
    serviceType: '',
    preferredDate: '',
    preferredTime: '',
    observations: '',
    status: 'pending'
  });

  const loadData = useCallback(async () => {
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = '/api/bookings';
    const method = selectedBooking ? 'PUT' : 'POST';
    const body = selectedBooking ? { ...formData, id: selectedBooking.id } : formData;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setSelectedBooking(null);
        setFormData({
          customerName: '',
          customerWhatsapp: '',
          vehicleModel: '',
          vehicleYear: '',
          serviceType: '',
          preferredDate: '',
          preferredTime: '',
          observations: '',
          status: 'pending'
        });
        loadData();
      }
    } catch (err) {
      console.error('Error saving booking:', err);
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      await fetch('/api/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      loadData();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const deleteBooking = async (id: number) => {
    if (!confirm('Deseja realmente excluir este agendamento?')) return;
    try {
      await fetch(`/api/bookings?id=${id}`, { method: 'DELETE' });
      loadData();
    } catch (err) {
      console.error('Error deleting booking:', err);
    }
  };

  const openEditModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setFormData({
      customerName: booking.customerName,
      customerWhatsapp: booking.customerWhatsapp,
      vehicleModel: booking.vehicleModel,
      vehicleYear: booking.vehicleYear || '',
      serviceType: booking.serviceType,
      preferredDate: booking.preferredDate,
      preferredTime: booking.preferredTime,
      observations: booking.observations || '',
      status: booking.status
    });
    setIsModalOpen(true);
  };

  const filteredBookings = bookings.filter(b => 
    b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusIcons = {
    pending: <Clock3 size={16} className="text-amber-500" />,
    confirmed: <CheckCircle2 size={16} className="text-emerald-500" />,
    cancelled: <XCircle size={16} className="text-red-500" />,
    completed: <CheckCircle2 size={16} className="text-blue-500" />
  };

  const statusLabels = {
    pending: 'Pendente',
    confirmed: 'Confirmado',
    cancelled: 'Cancelado',
    completed: 'Finalizado'
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-white">Agendamentos</h2>
          <p className="text-brand-gray text-sm">Gerencie as solicitações e horários da empresa</p>
        </div>
        <button 
          onClick={() => {
            setSelectedBooking(null);
            setFormData({
              customerName: '',
              customerWhatsapp: '',
              vehicleModel: '',
              vehicleYear: '',
              serviceType: '',
              preferredDate: '',
              preferredTime: '',
              observations: '',
              status: 'pending'
            });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-brand-gold text-brand-black px-6 py-3 font-bold uppercase tracking-widest text-xs hover:bg-brand-white transition-all"
        >
          <Plus size={16} /> Novo Agendamento
        </button>
      </div>

      {/* Filters */}
      <div className="bg-brand-graphite p-6 border border-brand-white/5 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray" size={18} />
          <input
            type="text"
            placeholder="Buscar por cliente ou veículo..."
            className="w-full bg-brand-black border border-brand-white/10 pl-12 pr-4 py-3 text-sm focus:border-brand-gold outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select className="bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none text-brand-white">
            <option value="">Todos os Status</option>
            <option value="pending">Pendente</option>
            <option value="confirmed">Confirmado</option>
            <option value="completed">Finalizado</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredBookings.map((booking) => (
            <motion.div
              key={booking.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-brand-graphite border border-brand-white/5 p-6 hover:border-brand-gold/30 transition-all flex flex-col gap-4"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-sm flex items-center gap-1.5 ${
                      booking.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                      booking.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500' :
                      booking.status === 'completed' ? 'bg-blue-500/10 text-blue-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {statusIcons[booking.status]}
                      {statusLabels[booking.status]}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-brand-white">{booking.customerName}</h3>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEditModal(booking)} className="p-2 text-brand-gray hover:text-brand-gold transition-colors">
                    <ChevronDown size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-3 py-4 border-y border-brand-white/5">
                <div className="flex items-center gap-3 text-sm">
                  <Car size={16} className="text-brand-gold shrink-0" />
                  <span className="text-brand-white">{booking.vehicleModel} {booking.vehicleYear ? `(${booking.vehicleYear})` : ''}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar size={16} className="text-brand-gold shrink-0" />
                  <span className="text-brand-white">
                    {new Date(booking.preferredDate).toLocaleDateString('pt-BR')} às {booking.preferredTime}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock size={16} className="text-brand-gold shrink-0" />
                  <span className="text-brand-gray capitalize">{booking.serviceType.replace('-', ' ')}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone size={16} className="text-brand-gold shrink-0" />
                  <a href={`https://wa.me/${booking.customerWhatsapp.replace(/\D/g, '')}`} target="_blank" className="text-brand-white hover:text-brand-gold underline underline-offset-4">{booking.customerWhatsapp}</a>
                </div>
              </div>

              {booking.observations && (
                <p className="text-xs text-brand-gray italic bg-brand-black/30 p-3 rounded-sm">
                   &quot;{booking.observations}&quot;
                </p>
              )}

              <div className="flex gap-2 mt-auto pt-2">
                {booking.status === 'pending' && (
                  <button 
                    onClick={() => updateStatus(booking.id, 'confirmed')}
                    className="flex-grow py-2.5 bg-emerald-600 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-emerald-500 transition-all"
                  >
                    Confirmar
                  </button>
                )}
                {booking.status === 'confirmed' && (
                  <button 
                    onClick={() => updateStatus(booking.id, 'completed')}
                    className="flex-grow py-2.5 bg-blue-600 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-blue-500 transition-all"
                  >
                    Finalizar
                  </button>
                )}
                <button 
                  onClick={() => deleteBooking(booking.id)}
                  className="p-2.5 bg-brand-black text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-brand-black/90 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-brand-graphite border border-brand-white/10 w-full max-w-2xl p-8 shadow-2xl"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-brand-gray hover:text-brand-white"
              >
                <X size={24} />
              </button>

              <h3 className="text-2xl font-bold text-brand-white mb-8">
                {selectedBooking ? 'Editar Agendamento' : 'Novo Agendamento'}
              </h3>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-brand-gray uppercase tracking-widest">Nome do Cliente</label>
                  <input
                    required
                    type="text"
                    className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-brand-gray uppercase tracking-widest">WhatsApp</label>
                  <input
                    required
                    type="text"
                    className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none"
                    value={formData.customerWhatsapp}
                    onChange={(e) => setFormData({ ...formData, customerWhatsapp: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-brand-gray uppercase tracking-widest">Modelo do Veículo</label>
                  <input
                    required
                    type="text"
                    className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none"
                    value={formData.vehicleModel}
                    onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-brand-gray uppercase tracking-widest">Ano (Opcional)</label>
                  <input
                    type="text"
                    className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none"
                    value={formData.vehicleYear}
                    onChange={(e) => setFormData({ ...formData, vehicleYear: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-brand-gray uppercase tracking-widest">Serviço</label>
                  <select
                    required
                    className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none"
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  >
                    <option value="">Selecione</option>
                    <option value="lavagem-detalhada">Lavagem Detalhada</option>
                    <option value="polimento-tecnico">Polimento Técnico</option>
                    <option value="protecao-ceramica">Proteção Cerâmica</option>
                    <option value="higienizacao-interna">Higienização Interna</option>
                    <option value="pacote-premium">Pacote Premium</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-brand-gray uppercase tracking-widest">Status</label>
                  <select
                    className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  >
                    <option value="pending">Pendente</option>
                    <option value="confirmed">Confirmado</option>
                    <option value="completed">Finalizado</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-brand-gray uppercase tracking-widest">Data</label>
                  <input
                    required
                    type="date"
                    className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-brand-gray uppercase tracking-widest">Horário</label>
                  <input
                    required
                    type="time"
                    className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none"
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] text-brand-gray uppercase tracking-widest">Observações</label>
                  <textarea
                    rows={3}
                    className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none resize-none"
                    value={formData.observations}
                    onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2 pt-4">
                  <button type="submit" className="w-full py-4 bg-brand-gold text-brand-black font-bold uppercase tracking-widest text-xs hover:bg-brand-white transition-all">
                    {selectedBooking ? 'Salvar Alterações' : 'Criar Agendamento'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

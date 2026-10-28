'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Pencil, Trash2, Save, X, Loader2, Search, User, Phone, MapPin, Car, Hash } from 'lucide-react';

interface Client {
  id: number;
  name: string;
  phone: string;
  address: string;
  carModel: string;
  licensePlate: string;
  createdAt: string;
}

export default function AdminClientes() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<Partial<Client> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    async function loadData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/clients?search=${encodeURIComponent(search)}`);
        const data = await res.json();
        if (isMounted) setClients(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, [search]);

  const handleEdit = (client: Client) => {
    setCurrentClient(client);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setCurrentClient({
      name: '',
      phone: '',
      address: '',
      carModel: '',
      licensePlate: '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) return;
    try {
      await fetch(`/api/clients?id=${id}`, { method: 'DELETE' });
      setClients(clients.filter(c => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const method = currentClient?.id ? 'PUT' : 'POST';
      const res = await fetch('/api/clients', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentClient),
      });

      if (res.ok) {
        setIsModalOpen(false);
        // Trigger a re-fetch by manually calling the logic or just searching again
        const resList = await fetch(`/api/clients?search=${encodeURIComponent(search)}`);
        const data = await resList.json();
        setClients(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold text-brand-white">Gerenciar Clientes</h1>
          <p className="text-brand-gray text-sm">Cadastre e consulte os clientes da Reluz Estética Automotiva.</p>
        </div>
        <button
          onClick={handleAdd}
          className="px-6 py-3 bg-brand-gold text-brand-black font-bold uppercase tracking-widest text-[10px] hover:bg-brand-white transition-all flex items-center gap-2"
        >
          <Plus size={16} /> Novo Cliente
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray" size={18} />
        <input
          type="text"
          placeholder="Buscar por nome, carro ou placa..."
          className="w-full bg-brand-graphite border border-brand-white/10 pl-12 pr-4 py-3 text-sm focus:border-brand-gold outline-none transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-brand-gold gap-4">
          <Loader2 className="animate-spin" size={48} />
          <p className="text-[10px] uppercase tracking-widest font-bold">Carregando clientes...</p>
        </div>
      ) : (
        <div className="bg-brand-graphite border border-brand-white/5 overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="border-b border-brand-white/5 text-[10px] uppercase tracking-widest text-brand-gray">
                <th className="px-6 py-5 font-bold">Cliente</th>
                <th className="px-6 py-5 font-bold">Veículo</th>
                <th className="px-6 py-5 font-bold">Placa</th>
                <th className="px-6 py-5 font-bold">Contato</th>
                <th className="px-6 py-5 font-bold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-white/5">
              {clients.map((client) => (
                <tr key={client.id} className="text-sm hover:bg-brand-white/5 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-black border border-brand-white/10 flex items-center justify-center text-brand-gold">
                        <User size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-brand-white">{client.name}</span>
                        <span className="text-[10px] text-brand-gray truncate max-w-[200px]">{client.address}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-brand-gray">
                    <div className="flex items-center gap-2">
                      <Car size={14} className="text-brand-gold" />
                      {client.carModel}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-2 py-1 bg-brand-black border border-brand-gold/20 text-brand-white font-mono text-xs font-bold uppercase tracking-widest">
                      {client.licensePlate}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-brand-gray">
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-brand-gold" />
                      {client.phone}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(client)}
                        className="p-2 text-brand-gray hover:text-brand-gold transition-colors"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
                        className="p-2 text-brand-gray hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {clients.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-brand-gray italic">
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form */}
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
              className="relative w-full max-w-2xl bg-brand-graphite border border-brand-white/10 p-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">{currentClient?.id ? 'Editar Cliente' : 'Novo Cliente'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-brand-gray hover:text-brand-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gold flex items-center gap-2">
                      <User size={12} /> Nome Completo
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none transition-all"
                      value={currentClient?.name || ''}
                      onChange={(e) => setCurrentClient({ ...currentClient, name: e.target.value })}
                      placeholder="João da Silva"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gold flex items-center gap-2">
                      <Phone size={12} /> WhatsApp/Telefone
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none transition-all"
                      value={currentClient?.phone || ''}
                      onChange={(e) => setCurrentClient({ ...currentClient, phone: e.target.value })}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gold flex items-center gap-2">
                    <MapPin size={12} /> Endereço
                  </label>
                  <input
                    type="text"
                    className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none transition-all"
                    value={currentClient?.address || ''}
                    onChange={(e) => setCurrentClient({ ...currentClient, address: e.target.value })}
                    placeholder="Rua, Número, Bairro, Cidade"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gold flex items-center gap-2">
                      <Car size={12} /> Modelo do Carro
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none transition-all"
                      value={currentClient?.carModel || ''}
                      onChange={(e) => setCurrentClient({ ...currentClient, carModel: e.target.value })}
                      placeholder="BMW M3 G80"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gold flex items-center gap-2">
                      <Hash size={12} /> Placa do Veículo
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none transition-all uppercase"
                      value={currentClient?.licensePlate || ''}
                      onChange={(e) => setCurrentClient({ ...currentClient, licensePlate: e.target.value.toUpperCase() })}
                      placeholder="ABC-1234"
                    />
                  </div>
                </div>

                <div className="pt-8 flex gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-grow py-4 bg-brand-gold text-brand-black font-bold uppercase tracking-widest text-xs hover:bg-brand-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Salvando...' : <><Save size={16} /> Salvar Cliente</>}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-10 py-4 border border-brand-white/10 text-brand-white font-bold uppercase tracking-widest text-xs hover:bg-brand-white hover:text-brand-black transition-all"
                  >
                    Cancelar
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

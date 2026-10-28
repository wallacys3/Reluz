'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Pencil, Trash2, Save, X, Loader2, Image as ImageIcon } from 'lucide-react';

interface Service {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
  isActive: boolean;
}

export default function AdminServicos() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<Service> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service: Service) => {
    setCurrentService(service);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setCurrentService({
      title: '',
      description: '',
      price: '',
      category: 'Estética Externa',
      imageUrl: '',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) return;
    
    try {
      await fetch(`/api/services?id=${id}`, { method: 'DELETE' });
      setServices(services.filter(s => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const method = currentService?.id ? 'PUT' : 'POST';
      const res = await fetch('/api/services', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentService),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchServices();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-white">Gerenciar Serviços</h1>
          <p className="text-brand-gray text-sm">Adicione, edite ou remova os serviços oferecidos no site.</p>
        </div>
        <button
          onClick={handleAdd}
          className="px-6 py-3 bg-brand-gold text-brand-black font-bold uppercase tracking-widest text-[10px] hover:bg-brand-white transition-all flex items-center gap-2"
        >
          <Plus size={16} /> Novo Serviço
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-brand-gold gap-4">
          <Loader2 className="animate-spin" size={48} />
          <p className="text-[10px] uppercase tracking-widest font-bold">Carregando serviços...</p>
        </div>
      ) : (
        <div className="bg-brand-graphite border border-brand-white/5">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-brand-white/5 text-[10px] uppercase tracking-widest text-brand-gray">
                <th className="px-6 py-5 font-bold">Título</th>
                <th className="px-6 py-5 font-bold">Categoria</th>
                <th className="px-6 py-5 font-bold">Preço</th>
                <th className="px-6 py-5 font-bold">Status</th>
                <th className="px-6 py-5 font-bold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-white/5">
              {services.map((service) => (
                <tr key={service.id} className="text-sm hover:bg-brand-white/5 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-black border border-brand-white/10 overflow-hidden relative shrink-0">
                        {service.imageUrl ? (
                          <img src={service.imageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-brand-gray/20">
                            <ImageIcon size={20} />
                          </div>
                        )}
                      </div>
                      <span className="font-bold text-brand-white">{service.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-brand-gray">{service.category}</td>
                  <td className="px-6 py-5 text-brand-gold font-mono">{service.price}</td>
                  <td className="px-6 py-5">
                    <span className={cn(
                      "px-2 py-1 text-[8px] font-bold uppercase tracking-widest",
                      service.isActive ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                    )}>
                      {service.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(service)}
                        className="p-2 text-brand-gray hover:text-brand-gold transition-colors"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="p-2 text-brand-gray hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
                <h2 className="text-2xl font-bold">{currentService?.id ? 'Editar Serviço' : 'Novo Serviço'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-brand-gray hover:text-brand-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">Título</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none"
                      value={currentService?.title || ''}
                      onChange={(e) => setCurrentService({ ...currentService, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">Preço (ex: A partir de R$ 150)</label>
                    <input
                      type="text"
                      className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none"
                      value={currentService?.price || ''}
                      onChange={(e) => setCurrentService({ ...currentService, price: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">Categoria</label>
                  <select
                    className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none appearance-none"
                    value={currentService?.category || 'Estética Externa'}
                    onChange={(e) => setCurrentService({ ...currentService, category: e.target.value })}
                  >
                    <option>Estética Externa</option>
                    <option>Estética Interna</option>
                    <option>Proteção</option>
                    <option>Especial</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">Descrição</label>
                  <textarea
                    required
                    rows={4}
                    className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none resize-none"
                    value={currentService?.description || ''}
                    onChange={(e) => setCurrentService({ ...currentService, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">URL da Imagem</label>
                  <input
                    type="text"
                    className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none"
                    value={currentService?.imageUrl || ''}
                    onChange={(e) => setCurrentService({ ...currentService, imageUrl: e.target.value })}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={currentService?.isActive || false}
                    onChange={(e) => setCurrentService({ ...currentService, isActive: e.target.checked })}
                    className="accent-brand-gold w-4 h-4"
                  />
                  <label htmlFor="isActive" className="text-sm font-bold text-brand-white cursor-pointer select-none">Serviço Ativo (visível no site)</label>
                </div>

                <div className="pt-8 flex gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-grow py-4 bg-brand-gold text-brand-black font-bold uppercase tracking-widest text-xs hover:bg-brand-white transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? 'Salvando...' : <><Save size={16} /> Salvar Serviço</>}
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

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

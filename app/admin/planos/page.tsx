'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Pencil, Trash2, Save, X, Loader2 } from 'lucide-react';

interface Plan {
  id: number;
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
}

export default function AdminPlanos() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<Partial<Plan> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch('/api/plans');
        const data = await res.json();
        if (isMounted) setPlans(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, []);

  const handleEdit = (plan: Plan) => {
    setCurrentPlan(plan);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setCurrentPlan({
      name: '',
      description: '',
      price: '',
      features: [],
      isPopular: false,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este plano?')) return;
    try {
      await fetch(`/api/plans?id=${id}`, { method: 'DELETE' });
      setPlans(plans.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const addFeature = () => {
    if (!featureInput.trim()) return;
    const currentFeatures = currentPlan?.features || [];
    setCurrentPlan({ ...currentPlan, features: [...currentFeatures, featureInput.trim()] });
    setFeatureInput('');
  };

  const removeFeature = (index: number) => {
    const currentFeatures = currentPlan?.features || [];
    setCurrentPlan({ ...currentPlan, features: currentFeatures.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const method = currentPlan?.id ? 'PUT' : 'POST';
      const res = await fetch('/api/plans', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentPlan),
      });

      if (res.ok) {
        setIsModalOpen(false);
        const resList = await fetch('/api/plans');
        const data = await resList.json();
        setPlans(data);
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
          <h1 className="text-3xl font-bold text-brand-white">Gerenciar Planos</h1>
          <p className="text-brand-gray text-sm">Configure os pacotes e preços exibidos na página de planos.</p>
        </div>
        <button
          onClick={handleAdd}
          className="px-6 py-3 bg-brand-gold text-brand-black font-bold uppercase tracking-widest text-[10px] hover:bg-brand-white transition-all flex items-center gap-2"
        >
          <Plus size={16} /> Novo Plano
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-brand-gold gap-4">
          <Loader2 className="animate-spin" size={48} />
          <p className="text-[10px] uppercase tracking-widest font-bold">Carregando planos...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className={`bg-brand-graphite border p-8 flex flex-col ${plan.isPopular ? 'border-brand-gold shadow-[0_0_20px_rgba(212,175,98,0.1)]' : 'border-brand-white/5'}`}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-brand-white">{plan.name}</h3>
                  <p className="text-brand-gold font-mono font-bold">R$ {Number(plan.price).toFixed(2)}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(plan)} className="p-2 text-brand-gray hover:text-brand-gold transition-colors"><Pencil size={18} /></button>
                  <button onClick={() => handleDelete(plan.id)} className="p-2 text-brand-gray hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                </div>
              </div>
              <p className="text-brand-gray text-sm mb-6 line-clamp-2">{plan.description}</p>
              <div className="text-[10px] uppercase tracking-widest font-bold text-brand-gray mb-4">{plan.features.length} Funcionalidades</div>
              
              <div className="mt-auto pt-6 border-t border-brand-white/5 flex items-center justify-between">
                <span className={`px-2 py-1 text-[8px] font-bold uppercase tracking-widest ${plan.isActive ? 'text-emerald-500' : 'text-red-500'}`}>
                  {plan.isActive ? 'Ativo' : 'Inativo'}
                </span>
                {plan.isPopular && <span className="text-[8px] font-bold uppercase tracking-widest text-brand-gold border border-brand-gold px-2 py-1">Popular</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-brand-black/90 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-2xl bg-brand-graphite border border-brand-white/10 p-10 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">{currentPlan?.id ? 'Editar Plano' : 'Novo Plano'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-brand-gray hover:text-brand-white"><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">Nome do Plano</label>
                    <input type="text" required className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none" value={currentPlan?.name || ''} onChange={(e) => setCurrentPlan({ ...currentPlan, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">Preço (Numérico)</label>
                    <input type="number" step="0.01" required className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none" value={currentPlan?.price || ''} onChange={(e) => setCurrentPlan({ ...currentPlan, price: e.target.value })} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">Descrição Curta</label>
                  <textarea required rows={2} className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none resize-none" value={currentPlan?.description || ''} onChange={(e) => setCurrentPlan({ ...currentPlan, description: e.target.value })} />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">Funcionalidades</label>
                  <div className="flex gap-2">
                    <input type="text" className="flex-grow bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none" placeholder="Adicionar funcionalidade..." value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())} />
                    <button type="button" onClick={addFeature} className="px-4 bg-brand-white/5 border border-brand-white/10 hover:bg-brand-gold hover:text-brand-black transition-all"><Plus size={20} /></button>
                  </div>
                  <ul className="space-y-2">
                    {(currentPlan?.features || []).map((feature, i) => (
                      <li key={i} className="flex items-center justify-between p-3 bg-brand-black/50 border border-brand-white/5 text-sm group">
                        <span className="text-brand-gray">{feature}</span>
                        <button type="button" onClick={() => removeFeature(i)} className="text-brand-gray hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><X size={14} /></button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-4">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="isPopular" checked={currentPlan?.isPopular || false} onChange={(e) => setCurrentPlan({ ...currentPlan, isPopular: e.target.checked })} className="accent-brand-gold" />
                    <label htmlFor="isPopular" className="text-sm font-bold text-brand-white cursor-pointer">Plano Popular</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="isActive" checked={currentPlan?.isActive || false} onChange={(e) => setCurrentPlan({ ...currentPlan, isActive: e.target.checked })} className="accent-brand-gold" />
                    <label htmlFor="isActive" className="text-sm font-bold text-brand-white cursor-pointer">Ativo no Site</label>
                  </div>
                </div>

                <div className="pt-8 flex gap-4">
                  <button type="submit" disabled={isSubmitting} className="flex-grow py-4 bg-brand-gold text-brand-black font-bold uppercase tracking-widest text-xs hover:bg-brand-white transition-all flex items-center justify-center gap-2">
                    {isSubmitting ? 'Salvando...' : <><Save size={16} /> Salvar Plano</>}
                  </button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-10 py-4 border border-brand-white/10 text-brand-white font-bold uppercase tracking-widest text-xs hover:bg-brand-white hover:text-brand-black transition-all">Cancelar</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

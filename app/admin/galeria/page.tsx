'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Pencil, Trash2, Save, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  isActive: boolean;
}

export default function AdminGaleria() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<GalleryItem> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch('/api/gallery?admin=true');
        const data = await res.json();
        if (isMounted) setItems(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, []);

  const handleEdit = (item: GalleryItem) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setCurrentItem({
      title: '',
      description: '',
      imageUrl: '',
      category: 'Polimento',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta imagem da galeria?')) return;
    
    try {
      await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' });
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const method = currentItem?.id ? 'PUT' : 'POST';
      const res = await fetch('/api/gallery', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentItem),
      });

      if (res.ok) {
        setIsModalOpen(false);
        const resList = await fetch('/api/gallery?admin=true');
        const data = await resList.json();
        setItems(data);
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
          <h1 className="text-3xl font-bold text-brand-white">Gerenciar Galeria</h1>
          <p className="text-brand-gray text-sm">Adicione fotos dos seus melhores trabalhos para exibir aos clientes.</p>
        </div>
        <button
          onClick={handleAdd}
          className="px-6 py-3 bg-brand-gold text-brand-black font-bold uppercase tracking-widest text-[10px] hover:bg-brand-white transition-all flex items-center gap-2"
        >
          <Plus size={16} /> Nova Imagem
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-brand-gold gap-4">
          <Loader2 className="animate-spin" size={48} />
          <p className="text-[10px] uppercase tracking-widest font-bold">Carregando galeria...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-brand-graphite border border-brand-white/5 group relative overflow-hidden">
              <div className="aspect-video bg-brand-black overflow-hidden relative">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand-gray/20">
                    <ImageIcon size={40} />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                   <span className={cn(
                    "px-2 py-1 text-[8px] font-bold uppercase tracking-widest",
                    item.isActive ? "bg-emerald-500/80 text-white" : "bg-red-500/80 text-white"
                  )}>
                    {item.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-brand-white line-clamp-1">{item.title}</h3>
                  <span className="text-[10px] uppercase tracking-widest text-brand-gold font-bold">{item.category}</span>
                </div>
                <p className="text-brand-gray text-xs line-clamp-2 mb-4 h-8">{item.description}</p>
                <div className="flex gap-2 border-t border-brand-white/5 pt-4">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 py-2 bg-brand-white/5 text-brand-white hover:bg-brand-gold hover:text-brand-black transition-all flex items-center justify-center gap-2 text-[10px] uppercase font-bold tracking-widest"
                  >
                    <Pencil size={14} /> Editar
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-brand-white/5 text-brand-gray hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
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
              className="relative w-full max-w-xl bg-brand-graphite border border-brand-white/10 p-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">{currentItem?.id ? 'Editar Imagem' : 'Adicionar à Galeria'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-brand-gray hover:text-brand-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">Título</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none"
                    value={currentItem?.title || ''}
                    onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })}
                    placeholder="Ex: Polimento em Porsche 911"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">Categoria</label>
                  <select
                    className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none appearance-none"
                    value={currentItem?.category || 'Polimento'}
                    onChange={(e) => setCurrentItem({ ...currentItem, category: e.target.value })}
                  >
                    <option>Polimento</option>
                    <option>Higienização</option>
                    <option>Proteção</option>
                    <option>Antes e Depois</option>
                    <option>Geral</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">Descrição Curta</label>
                  <textarea
                    rows={2}
                    className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none resize-none"
                    value={currentItem?.description || ''}
                    onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                    placeholder="Breve descrição do trabalho realizado"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">URL da Imagem</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none"
                    value={currentItem?.imageUrl || ''}
                    onChange={(e) => setCurrentItem({ ...currentItem, imageUrl: e.target.value })}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={currentItem?.isActive || false}
                    onChange={(e) => setCurrentItem({ ...currentItem, isActive: e.target.checked })}
                    className="accent-brand-gold w-4 h-4"
                  />
                  <label htmlFor="isActive" className="text-sm font-bold text-brand-white cursor-pointer select-none">Ativo (visível na galeria do site)</label>
                </div>

                <div className="pt-8 flex gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-grow py-4 bg-brand-gold text-brand-black font-bold uppercase tracking-widest text-xs hover:bg-brand-white transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? 'Salvando...' : <><Save size={16} /> Salvar na Galeria</>}
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

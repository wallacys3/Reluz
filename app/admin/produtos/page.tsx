'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Pencil, Trash2, Save, X, Loader2, Image as ImageIcon, ShoppingBag, TrendingUp, Box } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  sold: number;
  imageUrl: string;
  isActive: boolean;
  updatedAt: string;
}

export default function AdminProdutos() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch('/api/products?admin=true');
        const data = await res.json();
        if (isMounted) setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, []);

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setCurrentProduct({
      name: '',
      description: '',
      price: '',
      stock: 0,
      sold: 0,
      imageUrl: '',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    
    try {
      await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const method = currentProduct?.id ? 'PUT' : 'POST';
      const res = await fetch('/api/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentProduct),
      });

      if (res.ok) {
        setIsModalOpen(false);
        const resList = await fetch('/api/products?admin=true');
        const data = await resList.json();
        setProducts(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Stats
  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
  const totalSold = products.reduce((acc, p) => acc + p.sold, 0);
  const activeProducts = products.filter(p => p.isActive).length;

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-white">Gerenciar Produtos</h1>
          <p className="text-brand-gray text-sm">Controle seu estoque de produtos de estética automotiva.</p>
        </div>
        <button
          onClick={handleAdd}
          className="px-6 py-3 bg-brand-gold text-brand-black font-bold uppercase tracking-widest text-[10px] hover:bg-brand-white transition-all flex items-center gap-2"
        >
          <Plus size={16} /> Novo Produto
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-brand-graphite border border-brand-white/5 p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-black flex items-center justify-center border border-brand-gold/20">
            <Box className="text-brand-gold" size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-brand-gray font-bold">Total em Estoque</p>
            <p className="text-2xl font-bold text-brand-white">{totalStock}</p>
          </div>
        </div>
        <div className="bg-brand-graphite border border-brand-white/5 p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-black flex items-center justify-center border border-brand-gold/20">
            <TrendingUp className="text-brand-gold" size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-brand-gray font-bold">Total Vendidos</p>
            <p className="text-2xl font-bold text-brand-white">{totalSold}</p>
          </div>
        </div>
        <div className="bg-brand-graphite border border-brand-white/5 p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-black flex items-center justify-center border border-brand-gold/20">
            <ShoppingBag className="text-brand-gold" size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-brand-gray font-bold">Produtos Ativos</p>
            <p className="text-2xl font-bold text-brand-white">{activeProducts}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-brand-gold gap-4">
          <Loader2 className="animate-spin" size={48} />
          <p className="text-[10px] uppercase tracking-widest font-bold">Carregando produtos...</p>
        </div>
      ) : (
        <div className="bg-brand-graphite border border-brand-white/5 overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead>
              <tr className="border-b border-brand-white/5 text-[10px] uppercase tracking-widest text-brand-gray">
                <th className="px-6 py-5 font-bold">Produto</th>
                <th className="px-6 py-5 font-bold">Preço</th>
                <th className="px-6 py-5 font-bold">Estoque</th>
                <th className="px-6 py-5 font-bold">Vendidos</th>
                <th className="px-6 py-5 font-bold">Status</th>
                <th className="px-6 py-5 font-bold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-white/5">
              {products.map((product) => (
                <tr key={product.id} className="text-sm hover:bg-brand-white/5 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-black border border-brand-white/10 overflow-hidden relative shrink-0">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-brand-gray/20">
                            <ImageIcon size={20} />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-brand-white">{product.name}</span>
                        <span className="text-[10px] text-brand-gray truncate max-w-xs">{product.description}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-brand-gold font-mono">R$ {parseFloat(product.price).toFixed(2)}</td>
                  <td className="px-6 py-5">
                    <span className={cn(
                      "font-bold",
                      product.stock <= 5 ? "text-red-500" : "text-brand-white"
                    )}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-brand-gray">{product.sold}</td>
                  <td className="px-6 py-5">
                    <span className={cn(
                      "px-2 py-1 text-[8px] font-bold uppercase tracking-widest",
                      product.isActive ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                    )}>
                      {product.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 text-brand-gray hover:text-brand-gold transition-colors"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
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
                <h2 className="text-2xl font-bold">{currentProduct?.id ? 'Editar Produto' : 'Novo Produto'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-brand-gray hover:text-brand-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">Nome do Produto</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none"
                      value={currentProduct?.name || ''}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                      placeholder="Ex: Cera de Carnaúba Premium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">Preço (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none"
                      value={currentProduct?.price || ''}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">Quantidade em Estoque</label>
                    <input
                      type="number"
                      required
                      className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none"
                      value={currentProduct?.stock || 0}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, stock: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">Quantidade Vendida</label>
                    <input
                      type="number"
                      required
                      className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none"
                      value={currentProduct?.sold || 0}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, sold: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">Descrição</label>
                  <textarea
                    required
                    rows={3}
                    className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none resize-none"
                    value={currentProduct?.description || ''}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                    placeholder="Descrição detalhada do produto e seus benefícios."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">URL da Imagem</label>
                  <input
                    type="text"
                    className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none"
                    value={currentProduct?.imageUrl || ''}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, imageUrl: e.target.value })}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={currentProduct?.isActive || false}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, isActive: e.target.checked })}
                    className="accent-brand-gold w-4 h-4"
                  />
                  <label htmlFor="isActive" className="text-sm font-bold text-brand-white cursor-pointer select-none">Produto Ativo (disponível no sistema)</label>
                </div>

                <div className="pt-8 flex gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-grow py-4 bg-brand-gold text-brand-black font-bold uppercase tracking-widest text-xs hover:bg-brand-white transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? 'Salvando...' : <><Save size={16} /> Salvar Produto</>}
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

'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Save, X, Loader2, DollarSign, Calendar, Filter, ShoppingBag, Scissors, CreditCard, Landmark, Banknote } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Sale {
  id: number;
  type: 'service' | 'product';
  itemId: number | null;
  itemName: string;
  quantity: number;
  totalAmount: string;
  paymentMethod: string;
  createdAt: string;
}

interface Product {
  id: number;
  name: string;
  price: string;
  stock: number;
}

interface Service {
  id: number;
  title: string;
  price: string;
}

export default function AdminVendas() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterDate, setFilterDate] = useState('today'); // today, yesterday, month, all
  
  // Form state
  const [saleType, setSaleType] = useState<'service' | 'product'>('service');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [customPrice, setCustomPrice] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('pix');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      let url = '/api/sales';
      const now = new Date();
      if (filterDate === 'today') {
        url += `?startDate=${now.toISOString().split('T')[0]}&endDate=${now.toISOString().split('T')[0]}`;
      } else if (filterDate === 'yesterday') {
        const yesterday = new Date();
        yesterday.setDate(now.getDate() - 1);
        url += `?startDate=${yesterday.toISOString().split('T')[0]}&endDate=${yesterday.toISOString().split('T')[0]}`;
      } else if (filterDate === 'month') {
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        url += `?startDate=${firstDay.toISOString().split('T')[0]}`;
      }
      
      const res = await fetch(url);
      const data = await res.json();
      setSales(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filterDate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
      fetch('/api/products?admin=true').then(res => res.json()).then(data => setProducts(data));
      fetch('/api/services').then(res => res.json()).then(data => setServices(data));
    }, 0);
    return () => clearTimeout(timer);
  }, [filterDate, loadData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const selectedItem = saleType === 'product' 
        ? products.find(p => p.id === parseInt(selectedItemId))
        : services.find(s => s.id === parseInt(selectedItemId));

      const body = {
        type: saleType,
        itemId: selectedItemId,
        itemName: selectedItem ? (saleType === 'product' ? (selectedItem as Product).name : (selectedItem as Service).title) : 'Venda Avulsa',
        quantity: saleType === 'product' ? quantity : 1,
        totalAmount: customPrice || (selectedItem ? (saleType === 'product' ? (selectedItem as Product).price : (selectedItem as Service).price.replace(/\D/g, '')) : '0'),
        paymentMethod,
      };

      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setIsModalOpen(false);
        loadData();
        // Reset form
        setSelectedItemId('');
        setQuantity(1);
        setCustomPrice('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalRevenue = sales.reduce((acc, s) => acc + parseFloat(s.totalAmount), 0);
  const totalSalesCount = sales.length;

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'credit_card': return <CreditCard size={14} />;
      case 'pix': return <Landmark size={14} />;
      case 'cash': return <Banknote size={14} />;
      default: return null;
    }
  };

  const getPaymentLabel = (method: string) => {
    switch (method) {
      case 'credit_card': return 'Cartão';
      case 'pix': return 'PIX';
      case 'cash': return 'Dinheiro';
      default: return method;
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-white">Faturamento e Vendas</h1>
          <p className="text-brand-gray text-sm">Registre novos serviços e vendas de produtos para controle financeiro.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-brand-gold text-brand-black font-bold uppercase tracking-widest text-[10px] hover:bg-brand-white transition-all flex items-center gap-2"
        >
          <Plus size={16} /> Registrar Venda
        </button>
      </div>

      {/* Filters and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 bg-brand-graphite border border-brand-white/5 p-6 space-y-6">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-brand-gold flex items-center gap-2">
            <Filter size={14} /> Período
          </h3>
          <div className="flex flex-col gap-2">
            {[
              { id: 'today', label: 'Hoje' },
              { id: 'yesterday', label: 'Ontem' },
              { id: 'month', label: 'Este Mês' },
              { id: 'all', label: 'Tudo' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterDate(f.id)}
                className={cn(
                  "text-left px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all",
                  filterDate === f.id ? "bg-brand-gold text-brand-black" : "text-brand-gray hover:bg-brand-white/5 hover:text-brand-white"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-brand-graphite border border-brand-white/5 p-8 flex items-center gap-6">
            <div className="w-16 h-16 bg-brand-black flex items-center justify-center border border-brand-gold/20">
              <DollarSign className="text-brand-gold" size={32} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-brand-gray font-bold mb-1">Faturamento {filterDate === 'today' ? 'de Hoje' : 'no Período'}</p>
              <p className="text-4xl font-bold text-brand-white">R$ {totalRevenue.toFixed(2)}</p>
            </div>
          </div>
          <div className="bg-brand-graphite border border-brand-white/5 p-8 flex items-center gap-6">
            <div className="w-16 h-16 bg-brand-black flex items-center justify-center border border-brand-gold/20">
              <ShoppingBag className="text-brand-gold" size={32} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-brand-gray font-bold mb-1">Total de Vendas</p>
              <p className="text-4xl font-bold text-brand-white">{totalSalesCount}</p>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-brand-gold gap-4">
          <Loader2 className="animate-spin" size={48} />
          <p className="text-[10px] uppercase tracking-widest font-bold">Carregando histórico...</p>
        </div>
      ) : (
        <div className="bg-brand-graphite border border-brand-white/5 overflow-hidden">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="border-b border-brand-white/5 text-[10px] uppercase tracking-widest text-brand-gray">
                <th className="px-6 py-5 font-bold">Data/Hora</th>
                <th className="px-6 py-5 font-bold">Item</th>
                <th className="px-6 py-5 font-bold">Tipo</th>
                <th className="px-6 py-5 font-bold">Qtd</th>
                <th className="px-6 py-5 font-bold">Valor</th>
                <th className="px-6 py-5 font-bold">Pagamento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-white/5">
              {sales.map((sale) => (
                <tr key={sale.id} className="text-sm hover:bg-brand-white/5 transition-colors">
                  <td className="px-6 py-5 text-brand-gray">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-brand-gold/50" />
                      {new Date(sale.createdAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="px-6 py-5 font-bold text-brand-white">{sale.itemName}</td>
                  <td className="px-6 py-5">
                    <span className={cn(
                      "px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest rounded-full",
                      sale.type === 'service' ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                    )}>
                      {sale.type === 'service' ? 'Serviço' : 'Produto'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-brand-gray">{sale.quantity}</td>
                  <td className="px-6 py-5 text-brand-gold font-mono font-bold">R$ {parseFloat(sale.totalAmount).toFixed(2)}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-xs text-brand-gray capitalize">
                      <span className="text-brand-gold">{getPaymentIcon(sale.paymentMethod)}</span>
                      {getPaymentLabel(sale.paymentMethod)}
                    </div>
                  </td>
                </tr>
              ))}
              {sales.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-brand-gray text-xs uppercase tracking-widest italic">
                    Nenhuma venda registrada no período selecionado.
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
              className="relative w-full max-w-xl bg-brand-graphite border border-brand-white/10 p-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Registrar Venda</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-brand-gray hover:text-brand-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => { setSaleType('service'); setSelectedItemId(''); }}
                    className={cn(
                      "py-4 border flex flex-col items-center gap-2 transition-all",
                      saleType === 'service' ? "bg-brand-gold text-brand-black border-brand-gold" : "bg-brand-black text-brand-gray border-brand-white/10 hover:border-brand-gold/50"
                    )}
                  >
                    <Scissors size={20} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Serviço</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSaleType('product'); setSelectedItemId(''); }}
                    className={cn(
                      "py-4 border flex flex-col items-center gap-2 transition-all",
                      saleType === 'product' ? "bg-brand-gold text-brand-black border-brand-gold" : "bg-brand-black text-brand-gray border-brand-white/10 hover:border-brand-gold/50"
                    )}
                  >
                    <ShoppingBag size={20} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Produto</span>
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">Selecionar {saleType === 'service' ? 'Serviço' : 'Produto'}</label>
                  <select
                    required
                    className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none appearance-none"
                    value={selectedItemId}
                    onChange={(e) => setSelectedItemId(e.target.value)}
                  >
                    <option value="">Selecione um item...</option>
                    {saleType === 'service' ? (
                      services.map(s => <option key={s.id} value={s.id}>{s.title} ({s.price})</option>)
                    ) : (
                      products.map(p => <option key={p.id} value={p.id} disabled={p.stock <= 0}>{p.name} - Est: {p.stock} (R$ {parseFloat(p.price).toFixed(2)})</option>)
                    )}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {saleType === 'product' && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">Quantidade</label>
                      <input
                        type="number"
                        min="1"
                        required
                        className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">Valor Total (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none"
                      value={customPrice}
                      onChange={(e) => setCustomPrice(e.target.value)}
                      placeholder="Deixe em branco p/ usar preço padrão"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">Forma de Pagamento</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'pix', label: 'PIX', icon: Landmark },
                      { id: 'credit_card', label: 'Cartão', icon: CreditCard },
                      { id: 'cash', label: 'Dinheiro', icon: Banknote },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id)}
                        className={cn(
                          "py-3 border flex flex-col items-center gap-1 transition-all",
                          paymentMethod === m.id ? "bg-brand-gold/10 text-brand-gold border-brand-gold" : "bg-brand-black text-brand-gray border-brand-white/10 hover:border-brand-gold/30"
                        )}
                      >
                        <m.icon size={16} />
                        <span className="text-[8px] font-bold uppercase tracking-widest">{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-8 flex gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-grow py-4 bg-brand-gold text-brand-black font-bold uppercase tracking-widest text-xs hover:bg-brand-white transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? 'Registrando...' : <><Save size={16} /> Confirmar Venda</>}
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

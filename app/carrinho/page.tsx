'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag, CreditCard, Wallet, Banknote as Cash, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart, CartItem } from '@/components/CartContext';

export default function CarrinhoPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const [whatsapp, setWhatsapp] = useState('557988594996');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix' | 'cash'>('pix');
  const [orderComplete, setOrderComplete] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.whatsapp) setWhatsapp(data.whatsapp);
      })
      .catch(err => console.error('Error fetching settings:', err));
  }, []);

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      // Record sales in the database
      for (const item of items) {
        await fetch('/api/sales', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: item.type,
            itemId: item.id,
            itemName: item.name,
            quantity: item.quantity,
            totalAmount: item.price * item.quantity,
            paymentMethod: paymentMethod
          }),
        });
      }

      // Prepare WhatsApp message
      const itemsList = items.map(item => 
        `• ${item.name} (${item.quantity}x) - R$ ${(item.price * item.quantity).toFixed(2)}`
      ).join('\n');
      
      const paymentLabels = {
        credit_card: 'Cartão de Crédito',
        pix: 'PIX',
        cash: 'Dinheiro'
      };

      const message = `Olá Reluz! Gostaria de finalizar meu pedido:
\n${itemsList}
\n*Total: R$ ${totalPrice.toFixed(2)}*
*Forma de Pagamento: ${paymentLabels[paymentMethod]}*
\nPor favor, me informe os próximos passos.`;

      const whatsappUrl = `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
      
      setOrderComplete(true);
      clearCart();
      
      // Delay redirect to show success state
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 2000);

    } catch (error) {
      console.error('Checkout error:', error);
      alert('Ocorreu um erro ao processar seu pedido. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-brand-gold rounded-full flex items-center justify-center mb-8"
        >
          <CheckCircle2 size={48} className="text-brand-black" />
        </motion.div>
        <h1 className="text-4xl font-bold mb-4">Pedido Enviado!</h1>
        <p className="text-brand-gray max-w-md mb-8">
          Seu pedido foi registrado com sucesso. Estamos te redirecionando para o WhatsApp para combinar a entrega ou agendamento.
        </p>
        <Link 
          href="/"
          className="px-8 py-3 bg-brand-gold text-brand-black font-bold uppercase tracking-widest text-sm hover:bg-brand-white transition-all"
        >
          Voltar para o Início
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 bg-brand-graphite rounded-full flex items-center justify-center mb-6 text-brand-gray">
          <ShoppingCart size={40} />
        </div>
        <h1 className="text-3xl font-bold mb-4">Seu carrinho está vazio</h1>
        <p className="text-brand-gray mb-8">Adicione produtos ou serviços para começar.</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/produtos"
            className="px-8 py-3 bg-brand-gold text-brand-black font-bold uppercase tracking-widest text-sm hover:bg-brand-white transition-all"
          >
            Ver Produtos
          </Link>
          <Link 
            href="/servicos"
            className="px-8 py-3 border border-brand-white/20 text-brand-white font-bold uppercase tracking-widest text-sm hover:bg-brand-white hover:text-brand-black transition-all"
          >
            Ver Serviços
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-black min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-12 flex items-center gap-4">
          Seu <span className="gold-text-gradient">Carrinho</span>
          <span className="text-sm font-normal text-brand-gray bg-brand-graphite px-3 py-1 rounded-full">
            {items.length} {items.length === 1 ? 'item' : 'itens'}
          </span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={`${item.type}-${item.id}`}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-brand-graphite/40 border border-brand-white/5 p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-6 group hover:border-brand-gold/20 transition-colors"
                >
                  <div className="w-24 h-24 relative bg-brand-black shrink-0 overflow-hidden">
                    <img
                      src={item.imageUrl || 'https://picsum.photos/seed/reluz/200/200'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-0 left-0 bg-brand-gold text-brand-black text-[8px] font-bold px-2 py-0.5 uppercase tracking-tighter">
                      {item.type === 'product' ? 'Produto' : 'Serviço'}
                    </div>
                  </div>

                  <div className="flex-grow text-center sm:text-left">
                    <h3 className="text-lg font-bold text-brand-white mb-1">{item.name}</h3>
                    <p className="text-brand-gold font-bold">
                      R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 bg-brand-black/50 p-2 border border-brand-white/10">
                    <button
                      onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}
                      className="p-1 hover:text-brand-gold transition-colors"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}
                      className="p-1 hover:text-brand-gold transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  <div className="text-right hidden sm:block min-w-[100px]">
                    <p className="text-xs text-brand-gray uppercase tracking-widest mb-1">Subtotal</p>
                    <p className="font-bold">
                      R$ {(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>

                  <button
                    onClick={() => removeItem(item.id, item.type)}
                    className="p-2 text-brand-gray hover:text-red-500 transition-colors"
                    title="Remover item"
                  >
                    <Trash2 size={20} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-brand-graphite border border-brand-white/5 p-8 sticky top-32">
              <h2 className="text-xl font-bold mb-8 border-b border-brand-white/5 pb-4">Resumo do Pedido</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-brand-gray">
                  <span>Itens ({items.length})</span>
                  <span>R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-brand-gray">
                  <span>Frete / Deslocamento</span>
                  <span className="text-green-500 font-bold uppercase text-xs">Grátis*</span>
                </div>
                <div className="pt-4 border-t border-brand-white/5 flex justify-between items-end">
                  <span className="font-bold uppercase tracking-widest text-xs">Total</span>
                  <span className="text-3xl font-bold text-brand-gold">
                    R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-gray mb-4">Forma de Pagamento</p>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => setPaymentMethod('pix')}
                    className={`flex items-center gap-3 p-4 border transition-all ${
                      paymentMethod === 'pix' ? 'border-brand-gold bg-brand-gold/10' : 'border-brand-white/10 hover:border-brand-white/30'
                    }`}
                  >
                    <Wallet size={20} className={paymentMethod === 'pix' ? 'text-brand-gold' : 'text-brand-gray'} />
                    <span className="text-sm font-bold">PIX</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`flex items-center gap-3 p-4 border transition-all ${
                      paymentMethod === 'credit_card' ? 'border-brand-gold bg-brand-gold/10' : 'border-brand-white/10 hover:border-brand-white/30'
                    }`}
                  >
                    <CreditCard size={20} className={paymentMethod === 'credit_card' ? 'text-brand-gold' : 'text-brand-gray'} />
                    <span className="text-sm font-bold">Cartão de Crédito</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('cash')}
                    className={`flex items-center gap-3 p-4 border transition-all ${
                      paymentMethod === 'cash' ? 'border-brand-gold bg-brand-gold/10' : 'border-brand-white/10 hover:border-brand-white/30'
                    }`}
                  >
                    <Cash size={20} className={paymentMethod === 'cash' ? 'text-brand-gold' : 'text-brand-gray'} />
                    <span className="text-sm font-bold">Dinheiro</span>
                  </button>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full py-4 bg-brand-gold text-brand-black font-bold uppercase tracking-widest text-sm hover:bg-brand-white transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>Processando...</>
                ) : (
                  <>Finalizar Pedido <ArrowRight size={18} /></>
                )}
              </button>
              
              <p className="mt-4 text-[10px] text-brand-gray text-center leading-relaxed">
                Ao clicar em finalizar, seu pedido será registrado e você será levado ao nosso WhatsApp para concluir o pagamento e agendar a entrega.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

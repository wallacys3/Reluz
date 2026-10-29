'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Search, Filter, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  imageUrl: string;
  isActive: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [whatsapp, setWhatsapp] = useState('557988594996');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, settingsRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/settings')
        ]);
        
        const prodData = await prodRes.json();
        setProducts(prodData.filter((p: Product) => p.isActive));
        
        const settingsData = await settingsRes.json();
        if (settingsData.whatsapp) setWhatsapp(settingsData.whatsapp);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-brand-black min-h-screen pb-24">
      {/* Header */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-7xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            Nossa Loja de <span className="gold-text-gradient">Produtos</span>
          </motion.h1>
          <p className="text-brand-gray text-xl max-w-2xl mx-auto leading-relaxed">
            Produtos selecionados de alta performance para manter o brilho e proteção do seu veículo em casa.
          </p>
        </div>
      </section>

      {/* Filters & Search */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-brand-graphite/30 p-6 border border-brand-white/5">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray" size={18} />
            <input
              type="text"
              placeholder="Buscar produtos..."
              className="w-full bg-brand-black border border-brand-white/10 pl-12 pr-4 py-3 text-sm focus:border-brand-gold outline-none transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4 text-brand-gray">
            <Filter size={18} />
            <span className="text-xs uppercase tracking-widest font-bold">Mostrando {filteredProducts.length} itens</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-[4/5] bg-brand-graphite animate-pulse border border-brand-white/5" />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-brand-graphite border border-brand-white/5 group overflow-hidden"
              >
                <div className="aspect-square relative overflow-hidden bg-brand-black">
                  <Image
                    src={product.imageUrl || 'https://picsum.photos/seed/product/800/800'}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-brand-black/80 flex items-center justify-center">
                      <span className="text-brand-white font-bold uppercase tracking-widest text-xs border border-brand-white/20 px-4 py-2">Esgotado</span>
                    </div>
                  )}
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-brand-white mb-1">{product.name}</h3>
                    <p className="text-brand-gray text-xs line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-brand-white/5">
                    <span className="text-brand-gold font-bold text-xl">
                      R$ {parseFloat(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-brand-gray">
                      {product.stock} em estoque
                    </span>
                  </div>
                  <a
                    href={`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=Olá! Gostaria de comprar o produto: ${product.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-3 ${product.stock > 0 ? 'bg-brand-gold text-brand-black' : 'bg-brand-white/10 text-brand-gray cursor-not-allowed'} font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all hover:bg-brand-white`}
                  >
                    <ShoppingBag size={14} /> {product.stock > 0 ? 'Comprar pelo WhatsApp' : 'Indisponível'}
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-brand-graphite/30 border border-brand-white/5">
            <AlertCircle className="mx-auto text-brand-gold mb-4" size={48} />
            <p className="text-brand-gray uppercase tracking-widest text-sm font-bold">Nenhum produto encontrado</p>
          </div>
        )}
      </div>

      {/* CTA */}
      <section className="mt-24 max-w-7xl mx-auto px-6">
        <div className="bg-brand-gold p-12 text-center">
          <h2 className="text-brand-black text-3xl md:text-5xl font-bold mb-6">Não encontrou o que procurava?</h2>
          <p className="text-brand-black/70 mb-8 max-w-2xl mx-auto font-medium">
            Temos acesso aos melhores fornecedores do mercado. Entre em contato e veja se podemos encomendar o que você precisa.
          </p>
          <Link
            href="/contato"
            className="inline-block px-10 py-4 border-2 border-brand-black text-brand-black font-bold uppercase tracking-widest text-sm hover:bg-brand-black hover:text-brand-gold transition-all"
          >
            Falar com Especialista
          </Link>
        </div>
      </section>
    </div>
  );
}

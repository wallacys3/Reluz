'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import { X, Maximize2, Loader2 } from 'lucide-react';

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
}

const categories = ['Todos', 'Polimento', 'Interior', 'Proteção', 'Processo'];

export default function GaleriaPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Todos');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  useEffect(() => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredItems = filter === 'Todos' 
    ? items 
    : items.filter(item => item.category === filter);

  return (
    <div className="bg-brand-black min-h-screen pb-24">
      <section className="py-24 px-6 border-b border-brand-white/5 mb-20">
        <div className="max-w-7xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            Galeria de <span className="gold-text-gradient">Resultados</span>
          </motion.h1>
          <p className="text-brand-gray text-xl max-w-2xl leading-relaxed">
            Veja o padrão de entrega da Reluz em veículos reais. Qualidade sem filtros, apenas técnica e dedicação.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-all rounded-sm ${
                filter === cat 
                  ? 'bg-brand-gold text-brand-black' 
                  : 'bg-brand-graphite text-brand-gray hover:text-brand-white border border-brand-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-brand-gold gap-4">
            <Loader2 className="animate-spin" size={48} />
            <p className="text-xs uppercase tracking-widest">Carregando galeria...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode='popLayout'>
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group relative aspect-square bg-brand-graphite border border-brand-white/5 overflow-hidden cursor-pointer"
                  onClick={() => setSelectedImage(item)}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-brand-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                    <Maximize2 className="text-brand-gold" size={32} />
                    <p className="text-brand-white text-xs font-bold uppercase tracking-widest">{item.category}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {filteredItems.length === 0 && (
              <div className="col-span-full text-center py-20 text-brand-gray italic">
                Nenhum item encontrado nesta categoria.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-brand-black/95 backdrop-blur-xl flex items-center justify-center p-6 sm:p-20"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-8 right-8 text-brand-white hover:text-brand-gold transition-colors p-2"
              onClick={() => setSelectedImage(null)}
            >
              <X size={40} />
            </button>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full flex-grow">
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="mt-8 text-center">
                <p className="text-brand-gold text-xs font-bold uppercase tracking-[0.3em] mb-2">{selectedImage.category}</p>
                <h2 className="text-2xl font-bold">{selectedImage.title}</h2>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

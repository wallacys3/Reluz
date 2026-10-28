'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
}

export default function WorkGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => {
        setItems(data.slice(0, 4));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-24 bg-brand-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-brand-gold font-bold uppercase tracking-[0.3em] text-xs mb-4">Galeria de Trabalhos</h2>
          <h3 className="text-4xl font-bold">Brilho que fala por si</h3>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-brand-gold gap-4">
            <Loader2 className="animate-spin" size={32} />
            <p className="text-[10px] uppercase tracking-widest">Carregando fotos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map((img, i) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative aspect-square border border-brand-white/5 overflow-hidden group"
              >
                <img
                  src={img.imageUrl}
                  alt={img.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-brand-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold border border-brand-gold px-3 py-1">
                    Ver Detalhes
                  </span>
                  <p className="text-brand-white text-[8px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                    {img.category}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/galeria"
            className="inline-flex items-center gap-4 text-brand-gray hover:text-brand-gold transition-colors font-bold uppercase tracking-widest text-xs group"
          >
            Acessar galeria completa
            <div className="w-12 h-px bg-brand-gold group-hover:w-16 transition-all" />
          </Link>
        </div>
      </div>
    </section>
  );
}

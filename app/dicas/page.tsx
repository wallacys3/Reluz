'use client';

import { motion } from 'motion/react';

import Link from 'next/link';

const articles = [
  {
    id: 1,
    title: '5 Dicas para manter o brilho do seu carro por mais tempo',
    excerpt: 'Saiba como evitar manchas e riscos na pintura no dia a dia com cuidados simples que fazem toda a diferença.',
    category: 'Cuidados',
    date: '24 Out, 2026',
    image: '/src/assets/images/hero_car_detail_1793147455460.jpg'
  },
  {
    id: 2,
    title: 'Lavagem técnica vs. Lavagem comum: Qual a diferença?',
    excerpt: 'Descubra por que o método de lavagem pode ser o melhor amigo ou o pior inimigo do verniz do seu carro.',
    category: 'Técnica',
    date: '15 Out, 2026',
    image: '/src/assets/images/service_polishing_1793147456067.jpg'
  },
  {
    id: 3,
    title: 'Por que hidratar bancos de couro é essencial no calor?',
    excerpt: 'O couro é um material orgânico e precisa de hidratação constante para não ressecar e rachar com a exposição ao sol.',
    category: 'Interior',
    date: '02 Out, 2026',
    image: '/src/assets/images/service_interior_1793147455958.jpg'
  }
];

export default function DicasPage() {
  return (
    <div className="bg-brand-black min-h-screen pb-24">
      <section className="py-24 px-6 border-b border-brand-white/5 mb-20">
        <div className="max-w-7xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            Dicas & <span className="gold-text-gradient">Artigos</span>
          </motion.h1>
          <p className="text-brand-gray text-xl max-w-2xl leading-relaxed">
            Compartilhamos nosso conhecimento para que você possa cuidar melhor do seu patrimônio entre um serviço e outro.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {articles.map((article, index) => (
          <motion.article
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group flex flex-col"
          >
            <div className="relative aspect-[16/10] overflow-hidden mb-8 border border-brand-white/5">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-brand-gold text-brand-black px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                {article.category}
              </div>
            </div>
            <div className="flex items-center gap-3 text-brand-gold text-[10px] font-bold uppercase tracking-widest mb-4">
              <span>{article.date}</span>
              <div className="w-4 h-px bg-brand-gold/30" />
              <span>Reluz Estética</span>
            </div>
            <h2 className="text-2xl font-bold mb-4 group-hover:text-brand-gold transition-colors leading-tight">
              {article.title}
            </h2>
            <p className="text-brand-gray text-sm leading-relaxed mb-8 flex-grow">
              {article.excerpt}
            </p>
            <Link
              href={`/dicas/${article.id}`}
              className="text-brand-white font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 group-hover:gap-4 transition-all"
            >
              Ler artigo completo <div className="w-12 h-px bg-brand-gold" />
            </Link>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

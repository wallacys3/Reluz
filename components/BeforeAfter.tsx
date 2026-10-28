'use client';

import { motion } from 'motion/react';


export default function BeforeAfter() {
  return (
    <section className="py-24 bg-brand-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-brand-gold font-bold uppercase tracking-[0.3em] text-sm mb-4">Resultados que Impressionam</h2>
            <h3 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
              A diferença está nos <span className="gold-text-gradient">detalhes</span>
            </h3>
            <p className="text-brand-gray text-lg mb-8 leading-relaxed">
              Nosso processo de polimento técnico remove riscos superficiais, oxidações e manchas, devolvendo a cor original e a profundidade do brilho do seu veículo.
            </p>
            
            <div className="space-y-6">
              {[
                { title: 'Remoção de riscos (Swirl Marks)', value: '100%' },
                { title: 'Aumento de profundidade de cor', value: '100%' },
                { title: 'Proteção contra intempéries', value: 'Até 3 anos' },
              ].map((item, i) => (
                <div key={item.title}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-brand-white uppercase tracking-widest">{item.title}</span>
                    <span className="text-sm font-bold text-brand-gold">{item.value}</span>
                  </div>
                  <div className="h-1 bg-brand-graphite overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '100%' }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                      className="h-full bg-brand-gold"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative group"
          >
            <div className="absolute -inset-4 bg-brand-gold/10 blur-2xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative aspect-[4/3] border border-brand-gold/20 overflow-hidden bg-brand-graphite">
              <img
                src="/src/assets/images/gallery_before_after_1793147455342.jpg"
                alt="Antes e Depois de um Polimento Técnico na Reluz"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-brand-black/80 backdrop-blur px-3 py-1 text-[10px] font-bold uppercase tracking-widest">Antes</div>
              <div className="absolute top-4 right-4 bg-brand-gold/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-black">Depois</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

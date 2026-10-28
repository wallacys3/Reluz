'use client';

import { motion } from 'motion/react';


export default function SobrePage() {
  return (
    <div className="bg-brand-black min-h-screen">
      {/* Header Section */}
      <section className="relative py-32 overflow-hidden border-b border-brand-white/5">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Paixão por <span className="gold-text-gradient">perfeição.</span>
            </h1>
            <p className="text-brand-gray text-xl leading-relaxed">
              A Reluz Estética Automotiva nasceu do desejo de elevar o cuidado com o veículo a um nível de arte. Não fazemos apenas limpeza, entregamos transformação.
            </p>
          </motion.div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-gold via-transparent to-transparent" />
        </div>
      </section>

      {/* Story & Philosophy */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative aspect-square border border-brand-gold/20 overflow-hidden">
              <img
                src="/src/assets/images/hero_car_detail_1793147455460.jpg"
                alt="Nossa oficina"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-8">
              <div>
                <h2 className="text-brand-gold font-bold uppercase tracking-[0.3em] text-xs mb-4">Nossa História</h2>
                <h3 className="text-3xl font-bold mb-6">Comprometimento com a Excelência</h3>
                <p className="text-brand-gray leading-relaxed">
                  Localizada no coração da cidade, a Reluz é referência em estética automotiva de luxo. Combinamos anos de experiência prática com as melhores tecnologias mundiais em produtos de detalhamento.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-brand-white font-bold mb-3 uppercase tracking-widest text-sm">Missão</h4>
                  <p className="text-brand-gray text-sm leading-relaxed">
                    Proporcionar a melhor experiência em estética automotiva, preservando e valorizando o patrimônio de nossos clientes através de processos técnicos rigorosos.
                  </p>
                </div>
                <div>
                  <h4 className="text-brand-white font-bold mb-3 uppercase tracking-widest text-sm">Valores</h4>
                  <p className="text-brand-gray text-sm leading-relaxed">
                    Transparência total, respeito ao veículo, busca constante por inovação e paixão inabalável por cada detalhe.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-24 bg-brand-graphite">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <h2 className="text-brand-gold font-bold uppercase tracking-[0.3em] text-xs mb-4">Nosso Processo</h2>
          <h3 className="text-4xl font-bold">O Diferencial Reluz</h3>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          {[
            { step: '01', title: 'Avaliação Técnica', desc: 'Análise minuciosa da condição real da pintura e interior.' },
            { step: '02', title: 'Preparação', desc: 'Descontaminação química e mecânica completa do veículo.' },
            { step: '03', title: 'Execução', desc: 'Aplicação das técnicas de detalhamento por especialistas.' },
            { step: '04', title: 'Entrega Premium', desc: 'Revisão final de qualidade e entrega do veículo impecável.' },
          ].map((item) => (
            <div key={item.step} className="p-8 bg-brand-black border border-brand-white/5 flex flex-col items-center">
              <span className="text-4xl font-bold text-brand-gold/20 mb-6">{item.step}</span>
              <h4 className="text-lg font-bold mb-4">{item.title}</h4>
              <p className="text-brand-gray text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

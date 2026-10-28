'use client';

import { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import ServicesSummary from '@/components/ServicesSummary';
import BeforeAfter from '@/components/BeforeAfter';
import WorkGallery from '@/components/WorkGallery';
import Link from 'next/link';

export default function Home() {
  const [whatsapp, setWhatsapp] = useState('5511999999999');

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.whatsapp) setWhatsapp(data.whatsapp);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="flex flex-col">
      <Hero />
      <ServicesSummary />
      <BeforeAfter />
      <WorkGallery />
      
      {/* Testimonials Placeholder */}
      <section className="py-24 bg-brand-graphite border-y border-brand-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-brand-gold font-bold uppercase tracking-[0.3em] text-sm mb-4">Experiência Reluz</h2>
          <h3 className="text-4xl md:text-5xl font-bold mb-12">O que dizem nossos clientes</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-8 bg-brand-black border border-brand-white/5 text-left">
                <div className="flex text-brand-gold mb-4">
                  {'★'.repeat(5)}
                </div>
                <p className="text-brand-gray text-sm mb-6 italic leading-relaxed">
                  &quot;O atendimento da Reluz é impecável. Deixei meu carro para um polimento e ele voltou parecendo que acabou de sair da concessionária. Recomendo fortemente!&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-graphite" />
                  <div>
                    <p className="text-sm font-bold text-brand-white">João Silva {i}</p>
                    <p className="text-[10px] uppercase tracking-widest text-brand-gold">Proprietário de Veículo Premium</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-brand-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-gold via-transparent to-transparent" />
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            Pronto para ver seu carro <span className="gold-text-gradient">brilhar?</span>
          </h2>
          <p className="text-brand-gray text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Agende agora seu atendimento ou solicite um orçamento personalizado pelo WhatsApp. Estamos prontos para superar suas expectativas.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              href="/agendamento"
              className="px-10 py-5 bg-brand-gold text-brand-black font-bold uppercase tracking-widest text-sm hover:bg-brand-white transition-all transform hover:scale-105"
            >
              Agendar Agora
            </Link>
            <a
              href={`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=Olá, gostaria de solicitar um orçamento para meu veículo.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 border border-brand-gold text-brand-gold font-bold uppercase tracking-widest text-sm hover:bg-brand-gold hover:text-brand-black transition-all"
            >
              Orçamento via WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

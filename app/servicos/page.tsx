'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, ArrowRight, Loader2 } from 'lucide-react';

interface Service {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
}

export default function ServicosPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        setServices(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const categories = Array.from(new Set(services.map(s => s.category)));

  return (
    <div className="bg-brand-black min-h-screen pb-24">
      <section className="py-24 px-6 border-b border-brand-white/5 mb-20">
        <div className="max-w-7xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            Serviços <span className="gold-text-gradient">Especializados</span>
          </motion.h1>
          <p className="text-brand-gray text-xl max-w-2xl leading-relaxed">
            Soluções completas para valorização e proteção do seu veículo, com os melhores produtos do mercado mundial.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 space-y-32">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-brand-gold gap-4">
            <Loader2 className="animate-spin" size={48} />
            <p className="text-xs uppercase tracking-widest">Carregando serviços...</p>
          </div>
        ) : (
          categories.map((category, catIndex) => (
            <div key={category}>
              <h2 className="text-brand-gold font-bold uppercase tracking-[0.3em] text-sm mb-12 flex items-center gap-4">
                {category}
                <div className="flex-grow h-px bg-brand-gold/20" />
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.filter(s => s.category === category).map((service, index) => (
                  <motion.div
                    key={service.id}
                    id={service.slug}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-brand-graphite border border-brand-white/5 flex flex-col group h-full"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden bg-brand-graphite">
                      <img
                        src={service.imageUrl || '/src/assets/images/hero_car_detail_1793147455460.jpg'}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-8 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold mb-2 text-brand-white">{service.title}</h3>
                      <p className="text-brand-gold font-bold text-sm mb-4 uppercase tracking-widest">{service.price}</p>
                      <p className="text-brand-gray text-sm leading-relaxed mb-8 flex-grow">
                        {service.description}
                      </p>
                      <div className="pt-6 border-t border-brand-white/5 mt-auto flex flex-col gap-4">
                        <Link
                          href={`/agendamento?plano=${service.slug}`}
                          className="w-full py-3 bg-brand-gold text-brand-black text-center font-bold uppercase tracking-widest text-[10px] hover:bg-brand-white transition-colors"
                        >
                          Agendar este serviço
                        </Link>
                        <a
                          href={`https://wa.me/5511999999999?text=Olá, gostaria de saber mais sobre o serviço de ${service.title}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3 border border-brand-white/10 text-brand-white text-center font-bold uppercase tracking-widest text-[10px] hover:bg-brand-white hover:text-brand-black transition-colors flex items-center justify-center gap-2"
                        >
                          Dúvidas via WhatsApp <ArrowRight size={14} />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <section className="mt-32 max-w-7xl mx-auto px-6">
        <div className="bg-brand-graphite border border-brand-gold/20 p-12 md:p-20 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-6">Não encontrou o que procurava?</h2>
            <p className="text-brand-gray mb-10 max-w-xl mx-auto">
              Realizamos projetos personalizados de detalhamento. Entre em contato para uma avaliação gratuita do seu veículo.
            </p>
            <Link
              href="/contato"
              className="inline-block px-10 py-4 bg-brand-gold text-brand-black font-bold uppercase tracking-widest text-sm hover:bg-brand-white transition-all"
            >
              Falar com Especialista
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

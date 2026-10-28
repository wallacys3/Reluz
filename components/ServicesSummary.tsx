'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Shield, Droplets, Loader2 } from 'lucide-react';

interface Service {
  id: number;
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
}

const iconMap: Record<string, any> = {
  'Polimento Técnico': Sparkles,
  'Higienização Interna': Shield,
  'Proteção Cerâmica': Droplets,
  'default': Sparkles
};

export default function ServicesSummary() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        setServices(data.slice(0, 3));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-24 bg-brand-graphite">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-brand-gold font-bold uppercase tracking-[0.3em] text-sm mb-4">Nossos Serviços</h2>
            <p className="text-4xl md:text-5xl font-bold leading-tight">
              Excelência em <span className="gold-text-gradient">Estética Automotiva</span>
            </p>
          </div>
          <Link href="/servicos" className="text-brand-gold hover:text-brand-white transition-colors flex items-center gap-2 group font-bold uppercase tracking-widest text-xs mb-2">
            Ver catálogo completo
            <div className="w-8 h-px bg-brand-gold group-hover:w-12 transition-all" />
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-brand-gold gap-4">
            <Loader2 className="animate-spin" size={32} />
            <p className="text-[10px] uppercase tracking-widest">Carregando serviços...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = iconMap[service.title] || iconMap.default;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  className="group relative bg-brand-black border border-brand-white/5 overflow-hidden"
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={service.imageUrl || '/src/assets/images/hero_car_detail_1793147455460.jpg'}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 brightness-75"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-black to-transparent" />
                    <div className="absolute bottom-6 left-6">
                      <Icon className="text-brand-gold mb-2" size={32} />
                      <h3 className="text-xl font-bold text-brand-white">{service.title}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-brand-gray text-sm leading-relaxed mb-6 line-clamp-2">
                      {service.description}
                    </p>
                    <Link
                      href={`/servicos#${service.slug}`}
                      className="text-brand-gold font-bold uppercase tracking-[0.2em] text-[10px] hover:text-brand-white transition-colors"
                    >
                      Saiba mais
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

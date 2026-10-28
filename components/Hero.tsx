'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative h-[90vh] min-h-[600px] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/src/assets/images/hero_car_detail_1793147455460.jpg"
          alt="Reluz Estética Automotiva - Detalhamento Premium"
          fill
          priority
          className="object-cover brightness-[0.4]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block text-brand-gold font-bold tracking-[0.3em] uppercase text-xs mb-4"
          >
            Exclusividade em cada detalhe
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-5xl md:text-7xl font-bold leading-tight mb-6"
          >
            Seu carro merece mais do que limpeza. <br />
            <span className="gold-text-gradient">Merece brilhar.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-brand-gray text-lg md:text-xl mb-10 leading-relaxed max-w-lg"
          >
            Transformamos a aparência do seu veículo com técnicas avançadas de detalhamento, proteção e revitalização.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/agendamento"
              className="px-8 py-4 bg-brand-gold text-brand-black font-bold uppercase tracking-widest text-sm text-center hover:bg-brand-white transition-all transform hover:scale-105"
            >
              Agendar Atendimento
            </Link>
            <Link
              href="/servicos"
              className="px-8 py-4 border border-brand-white/20 text-brand-white font-bold uppercase tracking-widest text-sm text-center hover:bg-brand-white hover:text-brand-black transition-all"
            >
              Conhecer Serviços
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-brand-gray/60">Explore</span>
        <div className="w-px h-12 bg-gradient-to-b from-brand-gold to-transparent" />
      </motion.div>
    </section>
  );
}

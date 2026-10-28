'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { Check, Info, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Plan {
  id: number;
  name: string;
  slug: string;
  price: string;
  description: string;
  features: string[];
  isPopular: boolean;
}

export default function PlanosPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/plans')
      .then(res => res.json())
      .then(data => {
        setPlans(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-brand-black min-h-screen pb-24">
      <section className="py-24 px-6 text-center">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Planos e <span className="gold-text-gradient">Pacotes</span>
            </h1>
            <p className="text-brand-gray text-xl max-w-2xl mx-auto leading-relaxed">
              Escolha o nível de cuidado ideal para o seu momento. Do essencial ao extraordinário.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-32 text-brand-gold gap-4">
            <Loader2 className="animate-spin" size={48} />
            <p className="text-xs uppercase tracking-widest">Carregando planos...</p>
          </div>
        ) : (
          plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "relative bg-brand-graphite border p-10 flex flex-col h-full",
                plan.isPopular ? "border-brand-gold ring-1 ring-brand-gold shadow-[0_0_40px_rgba(212,175,98,0.1)]" : "border-brand-white/5"
              )}
            >
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-gold text-brand-black text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">
                  Mais Procurado
                </div>
              )}

              <div className="mb-10 text-center">
                <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-brand-gray text-sm uppercase tracking-widest">R$</span>
                  <span className="text-5xl font-bold text-brand-white">{Number(plan.price).toFixed(0)}</span>
                  <span className="text-brand-gray text-sm italic">/inicial</span>
                </div>
                <p className="text-brand-gray text-sm mt-6 leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-4 mb-12 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-brand-gray">
                    <Check className="text-brand-gold shrink-0 mt-0.5" size={16} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/agendamento?plano=${plan.slug}`}
                className={cn(
                  "w-full py-5 text-center font-bold uppercase tracking-widest text-xs transition-all",
                  plan.isPopular ? "bg-brand-gold text-brand-black hover:bg-brand-white" : "bg-brand-white/5 text-brand-white hover:bg-brand-white hover:text-brand-black"
                )}
              >
                Solicitar Orçamento
              </Link>
            </motion.div>
          ))
        )}
      </div>

      <section className="max-w-5xl mx-auto px-6 mt-32 text-center">
        <div className="flex flex-col items-center gap-6 p-8 bg-brand-graphite border border-brand-white/5 rounded-sm">
          <Info className="text-brand-gold" size={32} />
          <p className="text-brand-gray text-sm max-w-2xl">
            Os valores acima são estimativas baseadas em veículos de passeio pequenos e médios. Para utilitários, SUVs de grande porte ou estados críticos de conservação, uma avaliação presencial poderá ser necessária para ajuste de valores.
          </p>
        </div>
      </section>
    </div>
  );
}

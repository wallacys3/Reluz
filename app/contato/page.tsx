'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Clock, Instagram, Facebook, Loader2, CheckCircle2 } from 'lucide-react';

export default function ContatoPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call for contact message
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <div className="bg-brand-black min-h-screen">
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Entre em <span className="gold-text-gradient">Contato</span>
            </h1>
            <p className="text-brand-gray text-lg max-w-2xl mx-auto">
              Estamos prontos para tirar suas dúvidas e agendar o melhor cuidado para o seu veículo.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-brand-graphite p-8 md:p-12 border border-brand-white/5"
            >
              {isSuccess ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12">
                  <CheckCircle2 className="text-brand-gold" size={64} />
                  <h2 className="text-2xl font-bold">Mensagem Enviada!</h2>
                  <p className="text-brand-gray text-sm">Obrigado pelo contato. Retornaremos em breve.</p>
                  <button onClick={() => setIsSuccess(false)} className="text-brand-gold font-bold uppercase tracking-widest text-[10px] hover:underline">Enviar outra mensagem</button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-8">Envie uma mensagem</h2>
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-brand-gold">Nome</label>
                        <input
                          required
                          type="text"
                          className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none transition-colors"
                          placeholder="Seu nome completo"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-brand-gold">WhatsApp</label>
                        <input
                          required
                          type="text"
                          className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none transition-colors"
                          placeholder="(00) 00000-0000"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-brand-gold">Assunto</label>
                      <select className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none transition-colors appearance-none">
                        <option>Dúvida Geral</option>
                        <option>Orçamento Personalizado</option>
                        <option>Parceria</option>
                        <option>Outros</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-brand-gold">Mensagem</label>
                      <textarea
                        required
                        rows={5}
                        className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none transition-colors resize-none"
                        placeholder="Como podemos te ajudar?"
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-brand-gold text-brand-black font-bold uppercase tracking-widest text-sm hover:bg-brand-white transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {isSubmitting ? <><Loader2 className="animate-spin" size={18} /> Enviando...</> : 'Enviar Mensagem'}
                    </button>
                  </form>
                </>
              )}
            </motion.div>

            {/* Contact Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-12"
            >
              <div className="space-y-8">
                <h2 className="text-3xl font-bold">Informações de Acesso</h2>
                {loading ? (
                  <div className="py-10 text-brand-gold">
                    <Loader2 className="animate-spin" size={24} />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex gap-6">
                      <div className="w-12 h-12 bg-brand-graphite flex items-center justify-center border border-brand-gold/20 shrink-0">
                        <Phone className="text-brand-gold" size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-brand-white mb-1">WhatsApp & Telefone</h4>
                        <p className="text-brand-gray text-sm">{settings?.whatsapp || '(11) 99999-9999'}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-6">
                      <div className="w-12 h-12 bg-brand-graphite flex items-center justify-center border border-brand-gold/20 shrink-0">
                        <Mail className="text-brand-gold" size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-brand-white mb-1">E-mail</h4>
                        <p className="text-brand-gray text-sm">{settings?.email || 'contato@reluzestetica.com.br'}</p>
                      </div>
                    </div>

                    <div className="flex gap-6">
                      <div className="w-12 h-12 bg-brand-graphite flex items-center justify-center border border-brand-gold/20 shrink-0">
                        <MapPin className="text-brand-gold" size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-brand-white mb-1">Endereço</h4>
                        <p className="text-brand-gray text-sm leading-relaxed">
                          {settings?.address || 'Rua Exemplo, 123 - Bairro Estético, Cidade - Estado'}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-6">
                      <div className="w-12 h-12 bg-brand-graphite flex items-center justify-center border border-brand-gold/20 shrink-0">
                        <Clock className="text-brand-gold" size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-brand-white mb-1">Horário de Atendimento</h4>
                        <p className="text-brand-gray text-sm leading-relaxed">
                          Seg - Sex: {settings?.hours_week || '08:00 às 18:00'}<br />
                          Sáb: {settings?.hours_sat || '08:00 às 14:00'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6 pt-6">
                <h3 className="font-bold uppercase tracking-[0.2em] text-xs text-brand-gold">Nossas Redes</h3>
                <div className="flex gap-4">
                  <a href="#" className="flex items-center gap-2 text-brand-gray hover:text-brand-gold transition-colors group">
                    <Instagram size={20} className="group-hover:scale-110 transition-transform" />
                    <span className="text-sm">Instagram</span>
                  </a>
                  <a href="#" className="flex items-center gap-2 text-brand-gray hover:text-brand-gold transition-colors group">
                    <Facebook size={20} className="group-hover:scale-110 transition-transform" />
                    <span className="text-sm">Facebook</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

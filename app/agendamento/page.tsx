'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import { Calendar, Clock, Car, User, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { formatWhatsAppLink } from '@/lib/utils';

function BookingForm() {
  const searchParams = useSearchParams();
  const initialService = searchParams.get('plano') || '';

  const [formData, setFormData] = useState({
    nome: '',
    whatsapp: '',
    veiculo: '',
    ano: '',
    servico: initialService,
    data: '',
    horario: '',
    observacoes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Save to database
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Falha ao processar agendamento');

      // Open WhatsApp
      const message = `Olá Reluz! Gostaria de agendar um atendimento:
- Nome: ${formData.nome}
- WhatsApp: ${formData.whatsapp}
- Veículo: ${formData.veiculo} ${formData.ano ? `(${formData.ano})` : ''}
- Serviço: ${formData.servico}
- Data pretendida: ${formData.data}
- Horário: ${formData.horario}
- Observações: ${formData.observacoes || 'Nenhuma'}`;

      window.open(formatWhatsAppLink('5511999999999', message), '_blank');
      
      setIsSuccess(true);
      setFormData({
        nome: '',
        whatsapp: '',
        veiculo: '',
        ano: '',
        servico: '',
        data: '',
        horario: '',
        observacoes: ''
      });
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar agendamento. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-brand-graphite p-12 border border-brand-gold/20 text-center space-y-6"
      >
        <div className="flex justify-center">
          <CheckCircle2 className="text-brand-gold" size={64} />
        </div>
        <h2 className="text-3xl font-bold">Solicitação Enviada!</h2>
        <p className="text-brand-gray">
          Recebemos sua solicitação. Caso o WhatsApp não tenha aberto automaticamente, clique no botão flutuante para falar conosco. Nossa equipe entrará em contato em breve para confirmar seu horário.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="px-8 py-3 bg-brand-gold text-brand-black font-bold uppercase tracking-widest text-xs"
        >
          Novo Agendamento
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-brand-graphite p-8 md:p-12 border border-brand-white/5 space-y-8"
      onSubmit={handleSubmit}
    >
      {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Person Info */}
        <div className="space-y-6">
          <h3 className="text-brand-gold font-bold uppercase tracking-widest text-xs flex items-center gap-2">
            <User size={14} /> Seus Dados
          </h3>
          <div className="space-y-4">
            <input
              required
              type="text"
              placeholder="Seu Nome"
              className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            />
            <input
              required
              type="text"
              placeholder="WhatsApp"
              className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
            />
          </div>
        </div>

        {/* Vehicle Info */}
        <div className="space-y-6">
          <h3 className="text-brand-gold font-bold uppercase tracking-widest text-xs flex items-center gap-2">
            <Car size={14} /> Veículo
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <input
              required
              type="text"
              placeholder="Modelo (ex: BMW M3)"
              className="col-span-2 w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none"
              value={formData.veiculo}
              onChange={(e) => setFormData({ ...formData, veiculo: e.target.value })}
            />
            <input
              type="text"
              placeholder="Ano"
              className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none"
              value={formData.ano}
              onChange={(e) => setFormData({ ...formData, ano: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-4 border-t border-brand-white/5">
        <h3 className="text-brand-gold font-bold uppercase tracking-widest text-xs flex items-center gap-2">
          <Calendar size={14} /> Agendamento
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] text-brand-gray uppercase tracking-widest">Serviço Desejado</label>
            <select
              required
              className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none appearance-none"
              value={formData.servico}
              onChange={(e) => setFormData({ ...formData, servico: e.target.value })}
            >
              <option value="">Selecione um serviço</option>
              <option value="lavagem-detalhada">Lavagem Detalhada</option>
              <option value="polimento-tecnico">Polimento Técnico</option>
              <option value="protecao-ceramica">Proteção Cerâmica</option>
              <option value="higienizacao-interna">Higienização Interna</option>
              <option value="reluz-essencial">Plano Reluz Essencial</option>
              <option value="reluz-premium">Plano Reluz Premium</option>
              <option value="reluz-black">Plano Reluz Black</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] text-brand-gray uppercase tracking-widest">Data Pretendida</label>
            <input
              required
              type="date"
              className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none"
              value={formData.data}
              onChange={(e) => setFormData({ ...formData, data: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] text-brand-gray uppercase tracking-widest">Horário</label>
            <input
              required
              type="time"
              className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none"
              value={formData.horario}
              onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-4 border-t border-brand-white/5">
        <h3 className="text-brand-gold font-bold uppercase tracking-widest text-xs flex items-center gap-2">
          <MessageSquare size={14} /> Observações Adicionais
        </h3>
        <textarea
          rows={4}
          placeholder="Algum detalhe especial que devemos saber?"
          className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none resize-none"
          value={formData.observacoes}
          onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
        ></textarea>
      </div>

      <div className="pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-5 bg-brand-gold text-brand-black font-bold uppercase tracking-widest text-sm hover:bg-brand-white transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isSubmitting ? 'Processando...' : 'Confirmar e enviar via WhatsApp'} <Send size={18} />
        </button>
        <p className="mt-4 text-center text-brand-gray text-[10px] italic uppercase tracking-widest">
          O agendamento será confirmado por nossa equipe após o envio.
        </p>
      </div>
    </motion.form>
  );
}

export default function AgendamentoPage() {
  return (
    <div className="bg-brand-black min-h-screen pb-24">
      <section className="py-24 px-6 text-center">
        <div className="max-w-7xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            Solicitar <span className="gold-text-gradient">Agendamento</span>
          </motion.h1>
          <p className="text-brand-gray text-xl max-w-2xl mx-auto leading-relaxed">
            Reserve o seu horário agora. Em poucos cliques você garante o melhor cuidado para o seu veículo.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6">
        <Suspense fallback={<div className="text-center py-20 text-brand-gold">Carregando formulário...</div>}>
          <BookingForm />
        </Suspense>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Save, Loader2, CheckCircle2, Phone, MapPin, Clock, Instagram, Mail } from 'lucide-react';

export default function AdminConfig() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsSuccess(false);

    try {
      // In a real app, this would be a PUT /api/settings
      // For now, we'll simulate or implement the route if needed
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateSetting = (key: string, value: string) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <div className="max-w-4xl space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-brand-white">Configurações Gerais</h1>
        <p className="text-brand-gray text-sm">Gerencie as informações de contato e funcionamento da empresa.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-brand-gold gap-4">
          <Loader2 className="animate-spin" size={48} />
          <p className="text-[10px] uppercase tracking-widest font-bold">Carregando configurações...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-brand-graphite border border-brand-white/5 p-8 space-y-8">
            <h2 className="text-xl font-bold flex items-center gap-3">
              <Phone size={20} className="text-brand-gold" /> Contato
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">WhatsApp (apenas números)</label>
                <input type="text" className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none" value={settings.whatsapp || ''} onChange={(e) => updateSetting('whatsapp', e.target.value)} placeholder="5511999999999" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">E-mail de Contato</label>
                <input type="email" className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none" value={settings.email || ''} onChange={(e) => updateSetting('email', e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">Instagram (@usuario)</label>
                <input type="text" className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none" value={settings.instagram || ''} onChange={(e) => updateSetting('instagram', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="bg-brand-graphite border border-brand-white/5 p-8 space-y-8">
            <h2 className="text-xl font-bold flex items-center gap-3">
              <MapPin size={20} className="text-brand-gold" /> Localização
            </h2>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">Endereço Completo</label>
              <input type="text" className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none" value={settings.address || ''} onChange={(e) => updateSetting('address', e.target.value)} />
            </div>
          </div>

          <div className="bg-brand-graphite border border-brand-white/5 p-8 space-y-8">
            <h2 className="text-xl font-bold flex items-center gap-3">
              <Clock size={20} className="text-brand-gold" /> Horários
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">Segunda a Sexta</label>
                <input type="text" className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none" value={settings.hours_week || ''} onChange={(e) => updateSetting('hours_week', e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">Sábado</label>
                <input type="text" className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none" value={settings.hours_sat || ''} onChange={(e) => updateSetting('hours_sat', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-10 py-4 bg-brand-gold text-brand-black font-bold uppercase tracking-widest text-xs hover:bg-brand-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Salvando...' : <><Save size={18} /> Salvar Alterações</>}
            </button>
            {isSuccess && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-emerald-500 flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
                <CheckCircle2 size={18} /> Alterações salvas com sucesso!
              </motion.div>
            )}
          </div>
        </form>
      )}
    </div>
  );
}

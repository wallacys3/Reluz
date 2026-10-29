'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  const [settings, setSettings] = useState<any>(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error('Error fetching settings for footer:', err));
  }, []);

  return (
    <footer className="bg-brand-black border-t border-brand-white/10 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Brand info */}
        <div className="flex flex-col gap-6">
          <Link href="/" className="flex flex-col items-start group">
            <span className="text-3xl font-bold tracking-tighter text-brand-white group-hover:text-brand-gold transition-colors">
              RELUZ
            </span>
            <span className="text-xs tracking-[0.2em] text-brand-gold font-medium -mt-1 uppercase">
              Estética Automotiva
            </span>
          </Link>
          <p className="text-brand-gray text-sm leading-relaxed max-w-xs">
            Especialistas em detalhamento automotivo premium. Cuidamos do seu veículo com a exclusividade e a tecnologia que ele merece.
          </p>
          <div className="flex gap-4">
            <a href={`https://instagram.com/${settings?.instagram?.replace('@', '') || ''}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-brand-graphite rounded-full hover:bg-brand-gold hover:text-brand-black transition-all">
              <Instagram size={20} />
            </a>
            <a href="#" className="p-2 bg-brand-graphite rounded-full hover:bg-brand-gold hover:text-brand-black transition-all">
              <Facebook size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-brand-gold font-bold uppercase tracking-widest text-sm mb-6">Navegação</h4>
          <ul className="flex flex-col gap-4 text-sm text-brand-gray">
            <li><Link href="/" className="hover:text-brand-white transition-colors">Início</Link></li>
            <li><Link href="/servicos" className="hover:text-brand-white transition-colors">Serviços</Link></li>
            <li><Link href="/planos" className="hover:text-brand-white transition-colors">Planos e Pacotes</Link></li>
            <li><Link href="/galeria" className="hover:text-brand-white transition-colors">Galeria de Resultados</Link></li>
            <li><Link href="/sobre" className="hover:text-brand-white transition-colors">Sobre a Reluz</Link></li>
            <li className="mt-4 pt-4 border-t border-brand-white/5"><Link href="/admin/login" className="text-[10px] text-brand-gray/30 hover:text-brand-gold transition-colors uppercase tracking-widest">Acesso Administrativo</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-brand-gold font-bold uppercase tracking-widest text-sm mb-6">Contato</h4>
          <ul className="flex flex-col gap-5 text-sm text-brand-gray">
            <li className="flex items-start gap-3">
              <Phone size={18} className="text-brand-gold shrink-0" />
              <span>{settings?.whatsapp || '(11) 99999-9999'}</span>
            </li>
            <li className="flex items-start gap-3">
              <Mail size={18} className="text-brand-gold shrink-0" />
              <span>{settings?.email || 'contato@reluzestetica.com.br'}</span>
            </li>
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-brand-gold shrink-0" />
              <span className="whitespace-pre-line">{settings?.address || 'Rua Exemplo, 123 - Bairro\nCidade - Estado'}</span>
            </li>
          </ul>
        </div>

        {/* Hours */}
        <div>
          <h4 className="text-brand-gold font-bold uppercase tracking-widest text-sm mb-6">Funcionamento</h4>
          <ul className="flex flex-col gap-4 text-sm text-brand-gray">
            <li className="flex items-center gap-3">
              <Clock size={18} className="text-brand-gold" />
              <div>
                <p className="font-medium text-brand-white">Segunda a Sexta</p>
                <p>{settings?.hours_week || '08:00 - 18:00'}</p>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <Clock size={18} className="text-brand-gold" />
              <div>
                <p className="font-medium text-brand-white">Sábado</p>
                <p>{settings?.hours_sat || '08:00 - 14:00'}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-brand-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-brand-gray/50">
        <p>© {currentYear} Reluz Estética Automotiva. Todos os direitos reservados.</p>
        <p>Desenvolvido com excelência</p>
      </div>
    </footer>
  );
}


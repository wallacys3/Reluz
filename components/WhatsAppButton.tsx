'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function WhatsAppButton() {
  const pathname = usePathname();
  const [whatsapp, setWhatsapp] = useState('5511999999999');
  
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.whatsapp) setWhatsapp(data.whatsapp);
      })
      .catch(err => console.error(err));
  }, []);

  if (pathname?.startsWith('/admin')) return null;

  return (
    <motion.a
      href={`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Olá, conheci a Reluz pelo site e gostaria de mais informações.')}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-8 right-8 z-[100] bg-[#25D366] text-white p-4 rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.4)] flex items-center justify-center group"
    >
      <div className="absolute right-full mr-4 bg-white text-brand-black px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
        Fale conosco agora
      </div>
      <MessageCircle size={28} />
    </motion.a>
  );
}

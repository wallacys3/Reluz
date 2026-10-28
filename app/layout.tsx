import type {Metadata} from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

export const metadata: Metadata = {
  title: 'Reluz Estética Automotiva | Seu carro merece brilhar',
  description: 'Especialistas em detalhamento automotivo premium. Polimento, higienização e proteção cerâmica com tecnologia de ponta.',
  openGraph: {
    title: 'Reluz Estética Automotiva | Seu carro merece brilhar',
    description: 'Especialistas em detalhamento automotivo premium. Polimento, higienização e proteção cerâmica com tecnologia de ponta.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reluz Estética Automotiva | Seu carro merece brilhar',
    description: 'Especialistas em detalhamento automotivo premium. Polimento, higienização e proteção cerâmica com tecnologia de ponta.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body suppressHydrationWarning className="bg-brand-black text-brand-white min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-20">
          {children}
        </main>
        <WhatsAppButton />
        <Footer />
      </body>
    </html>
  );
}

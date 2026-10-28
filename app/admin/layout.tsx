'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, Scissors, Package, Image as ImageIcon, FileText, Settings, LogOut, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const sidebarLinks = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Serviços', href: '/admin/servicos', icon: Scissors },
  { name: 'Planos', href: '/admin/planos', icon: Package },
  { name: 'Galeria', href: '/admin/galeria', icon: ImageIcon },
  { name: 'Blog/Dicas', href: '/admin/dicas', icon: FileText },
  { name: 'Configurações', href: '/admin/config', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // If it's the login page, don't show the sidebar
  if (pathname === '/admin/login') return <>{children}</>;

  return (
    <div className="min-h-screen bg-brand-black flex">
      {/* Sidebar */}
      <aside className={cn(
        "bg-brand-graphite border-r border-brand-white/5 transition-all duration-300 flex flex-col",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="p-6 border-b border-brand-white/5 mb-6">
          <Link href="/admin" className="flex flex-col items-start">
            <span className={cn("font-bold tracking-tighter text-brand-white transition-all", isSidebarOpen ? "text-xl" : "text-sm")}>
              RELUZ
            </span>
            {isSidebarOpen && <span className="text-[8px] tracking-[0.2em] text-brand-gold font-medium uppercase">Admin Panel</span>}
          </Link>
        </div>

        <nav className="flex-grow px-3 space-y-2">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-sm transition-all group",
                pathname === link.href ? "bg-brand-gold text-brand-black" : "text-brand-gray hover:bg-brand-white/5 hover:text-brand-white"
              )}
            >
              <link.icon size={20} className={cn(pathname === link.href ? "text-brand-black" : "text-brand-gold group-hover:scale-110 transition-transform")} />
              {isSidebarOpen && <span className="text-sm font-medium">{link.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-brand-white/5">
          <button className="w-full flex items-center gap-3 px-3 py-3 text-brand-gray hover:text-red-400 transition-colors">
            <LogOut size={20} />
            {isSidebarOpen && <span className="text-sm font-medium">Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow h-screen overflow-auto">
        <header className="sticky top-0 z-30 bg-brand-black/80 backdrop-blur-md border-b border-brand-white/5 px-8 py-4 flex items-center justify-between">
          <h2 className="font-bold uppercase tracking-widest text-xs text-brand-gold">
            {sidebarLinks.find(l => l.href === pathname)?.name || 'Painel'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-brand-white">Administrador</span>
              <span className="text-[10px] text-brand-gray">admin@reluzestetica.com</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-brand-gold flex items-center justify-center text-brand-black font-bold">
              AD
            </div>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

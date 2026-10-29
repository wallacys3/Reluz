'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Pencil, Trash2, Save, X, Loader2, Image as ImageIcon, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl: string;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
}

export default function AdminDicas() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Partial<Article> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch('/api/articles?admin=true');
        const data = await res.json();
        if (isMounted) setArticles(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, []);

  const handleEdit = (article: Article) => {
    setCurrentArticle(article);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setCurrentArticle({
      title: '',
      excerpt: '',
      content: '',
      category: 'Cuidados Externos',
      imageUrl: '',
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este artigo?')) return;
    
    try {
      await fetch(`/api/articles?id=${id}`, { method: 'DELETE' });
      setArticles(articles.filter(a => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const method = currentArticle?.id ? 'PUT' : 'POST';
      const res = await fetch('/api/articles', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentArticle),
      });

      if (res.ok) {
        setIsModalOpen(false);
        const resList = await fetch('/api/articles?admin=true');
        const data = await resList.json();
        setArticles(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-white">Gerenciar Dicas Automotivas</h1>
          <p className="text-brand-gray text-sm">Publique conteúdos informativos para educar seus clientes e melhorar o SEO.</p>
        </div>
        <button
          onClick={handleAdd}
          className="px-6 py-3 bg-brand-gold text-brand-black font-bold uppercase tracking-widest text-[10px] hover:bg-brand-white transition-all flex items-center gap-2"
        >
          <Plus size={16} /> Novo Artigo
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-brand-gold gap-4">
          <Loader2 className="animate-spin" size={48} />
          <p className="text-[10px] uppercase tracking-widest font-bold">Carregando artigos...</p>
        </div>
      ) : (
        <div className="bg-brand-graphite border border-brand-white/5 overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead>
              <tr className="border-b border-brand-white/5 text-[10px] uppercase tracking-widest text-brand-gray">
                <th className="px-6 py-5 font-bold">Título</th>
                <th className="px-6 py-5 font-bold">Categoria</th>
                <th className="px-6 py-5 font-bold">Status</th>
                <th className="px-6 py-5 font-bold">Data</th>
                <th className="px-6 py-5 font-bold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-white/5">
              {articles.map((article) => (
                <tr key={article.id} className="text-sm hover:bg-brand-white/5 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-black border border-brand-white/10 overflow-hidden relative shrink-0">
                        {article.imageUrl ? (
                          <img src={article.imageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-brand-gray/20">
                            <BookOpen size={20} />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-brand-white">{article.title}</span>
                        <span className="text-[10px] text-brand-gray truncate max-w-xs">{article.excerpt}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-brand-gray">{article.category}</td>
                  <td className="px-6 py-5">
                    <span className={cn(
                      "px-2 py-1 text-[8px] font-bold uppercase tracking-widest",
                      article.isPublished ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                    )}>
                      {article.isPublished ? 'Publicado' : 'Rascunho'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-brand-gray text-xs">
                    {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('pt-BR') : '-'}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(article)}
                        className="p-2 text-brand-gray hover:text-brand-gold transition-colors"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="p-2 text-brand-gray hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-brand-black/90 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-brand-graphite border border-brand-white/10 p-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">{currentArticle?.id ? 'Editar Artigo' : 'Novo Artigo'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-brand-gray hover:text-brand-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">Título</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none"
                      value={currentArticle?.title || ''}
                      onChange={(e) => setCurrentArticle({ ...currentArticle, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">Categoria</label>
                    <select
                      className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none appearance-none"
                      value={currentArticle?.category || 'Cuidados Externos'}
                      onChange={(e) => setCurrentArticle({ ...currentArticle, category: e.target.value })}
                    >
                      <option>Cuidados Externos</option>
                      <option>Cuidados Internos</option>
                      <option>Proteção e Estética</option>
                      <option>Dicas do Especialista</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">Resumo (Excerpt)</label>
                  <textarea
                    required
                    rows={2}
                    className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none resize-none"
                    value={currentArticle?.excerpt || ''}
                    onChange={(e) => setCurrentArticle({ ...currentArticle, excerpt: e.target.value })}
                    placeholder="Uma breve descrição que aparece na listagem do blog."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">Conteúdo</label>
                  <textarea
                    required
                    rows={12}
                    className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none resize-none font-sans"
                    value={currentArticle?.content || ''}
                    onChange={(e) => setCurrentArticle({ ...currentArticle, content: e.target.value })}
                    placeholder="Escreva o conteúdo do seu artigo aqui..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">URL da Imagem de Capa</label>
                  <input
                    type="text"
                    className="w-full bg-brand-black border border-brand-white/10 px-4 py-3 text-sm focus:border-brand-gold outline-none"
                    value={currentArticle?.imageUrl || ''}
                    onChange={(e) => setCurrentArticle({ ...currentArticle, imageUrl: e.target.value })}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={currentArticle?.isPublished || false}
                    onChange={(e) => setCurrentArticle({ ...currentArticle, isPublished: e.target.checked })}
                    className="accent-brand-gold w-4 h-4"
                  />
                  <label htmlFor="isPublished" className="text-sm font-bold text-brand-white cursor-pointer select-none">Publicar Imediatamente</label>
                </div>

                <div className="pt-8 flex gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-grow py-4 bg-brand-gold text-brand-black font-bold uppercase tracking-widest text-xs hover:bg-brand-white transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? 'Salvando...' : <><Save size={16} /> Salvar Artigo</>}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-10 py-4 border border-brand-white/10 text-brand-white font-bold uppercase tracking-widest text-xs hover:bg-brand-white hover:text-brand-black transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

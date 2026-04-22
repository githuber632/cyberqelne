"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search, Tag, Clock, Calendar, ChevronRight, Newspaper } from "lucide-react";
import { useContentStore } from "@/store/contentStore";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { cn } from "@/lib/utils";

const categoryColors: Record<string, string> = {
  "Турниры": "text-cyber-neon bg-cyber-neon/20 border-cyber-neon/40",
  "Анонс": "text-yellow-400 bg-yellow-500/20 border-yellow-500/40",
  "Интервью": "text-pink-400 bg-pink-500/20 border-pink-500/40",
  "Аналитика": "text-blue-400 bg-blue-500/20 border-blue-500/40",
  "Новости": "text-green-400 bg-green-500/20 border-green-500/40",
};
const defaultColor = "text-gray-400 bg-gray-500/20 border-gray-500/40";

const CATEGORIES = ["Все", "Турниры", "Анонс", "Интервью", "Аналитика", "Новости"];

export default function NewsPage() {
  const { news } = useContentStore();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Все");

  const published = news
    .filter((n) => n.published)
    .filter((n) => !search || n.title.toLowerCase().includes(search.toLowerCase()))
    .filter((n) => category === "Все" || n.category === category)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const featured = published.find((n) => n.featured) ?? published[0];
  const rest = published.filter((n) => n.id !== featured?.id);

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-cyber-purple/20 to-transparent py-16">
        <div className="absolute inset-0 cyber-grid-bg opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display font-black text-4xl sm:text-5xl text-white mb-3">Новости</h1>
            <p className="text-gray-400 max-w-xl mx-auto">Будь в курсе событий киберспортивной сцены СНГ</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск новостей..."
              className="w-full bg-cyber-purple/20 border border-cyber-glass-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyber-neon/50 font-mono" />
          </div>
          <div className="flex gap-1 flex-wrap">
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCategory(c)}
                className={cn("px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all",
                  category === c ? "bg-cyber-neon/20 text-cyber-neon border border-cyber-neon/40" : "text-gray-500 hover:text-white hover:bg-white/5 border border-transparent")}>
                {c}
              </button>
            ))}
          </div>
        </motion.div>

        {published.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            <Newspaper className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-lg">Новостей пока нет</p>
            <p className="text-sm mt-1 text-gray-700">Следи за обновлениями — скоро здесь появятся новости</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Featured */}
            {featured && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="lg:col-span-2">
                <Link href={`/news/${featured.id}`}>
                  <motion.article whileHover={{ y: -4 }} className="glass-card rounded-2xl overflow-hidden group cursor-pointer h-full">
                    <div className="relative h-64 bg-gradient-to-br from-cyber-purple to-cyber-dark overflow-hidden">
                      {featured.image ? <img src={featured.image} className="absolute inset-0 w-full h-full object-cover" alt="" /> : <div className="absolute inset-0 cyber-grid-bg opacity-30" />}
                      <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark/80 to-transparent" />
                      <div className={cn("absolute top-4 left-4 flex items-center gap-1.5 border rounded-full px-3 py-1 text-xs font-mono font-bold", categoryColors[featured.category] ?? defaultColor)}>
                        <Tag className="w-3 h-3" />{featured.category}
                      </div>
                      {featured.featured && (
                        <div className="absolute top-4 right-4 bg-cyber-neon/20 border border-cyber-neon/40 rounded-full px-2.5 py-1 text-xs font-mono font-bold text-cyber-neon">⭐ Featured</div>
                      )}
                    </div>
                    <div className="p-6">
                      <h2 className="font-display font-bold text-xl text-white mb-3 group-hover:text-cyber-neon transition-colors line-clamp-2">{featured.title}</h2>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-3">{featured.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-gray-600 font-mono">
                        <span>{featured.author}</span>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{format(new Date(featured.publishedAt), "d MMM yyyy", { locale: ru })}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{featured.readTime} мин</span>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                </Link>
              </motion.div>
            )}

            {/* Side list */}
            <div className="space-y-4">
              {rest.slice(0, 4).map((article, i) => (
                <motion.div key={article.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.08 }}>
                  <Link href={`/news/${article.id}`}>
                    <motion.article whileHover={{ x: 3 }} className="glass-card rounded-xl p-4 group cursor-pointer">
                      <div className={cn("inline-flex items-center gap-1 border rounded-full px-2 py-0.5 text-xs font-mono font-bold mb-2", categoryColors[article.category] ?? defaultColor)}>
                        {article.category}
                      </div>
                      <h3 className="font-display font-bold text-sm text-white mb-2 group-hover:text-cyber-neon transition-colors line-clamp-2">{article.title}</h3>
                      <div className="flex justify-between text-xs text-gray-600 font-mono">
                        <span>{format(new Date(article.publishedAt), "d MMM", { locale: ru })}</span>
                        <span>{article.readTime} мин</span>
                      </div>
                    </motion.article>
                  </Link>
                </motion.div>
              ))}
              {rest.length > 4 && (
                <p className="text-center text-gray-600 text-sm font-mono pt-2">{rest.length - 4} ещё...</p>
              )}
            </div>
          </div>
        )}

        {/* All articles grid */}
        {rest.length > 4 && (
          <div className="mt-12">
            <h2 className="font-display font-bold text-xl text-white mb-6">Все новости</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.slice(4).map((article, i) => (
                <motion.div key={article.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }}>
                  <Link href={`/news/${article.id}`}>
                    <motion.article whileHover={{ y: -4 }} className="glass-card rounded-xl overflow-hidden group cursor-pointer h-full">
                      <div className="h-32 bg-gradient-to-br from-cyber-purple to-cyber-dark overflow-hidden relative">
                        {article.image ? <img src={article.image} className="w-full h-full object-cover" alt="" /> : <div className="absolute inset-0 cyber-grid-bg opacity-20" />}
                        <div className={cn("absolute top-3 left-3 flex items-center gap-1 border rounded-full px-2 py-0.5 text-xs font-mono font-bold", categoryColors[article.category] ?? defaultColor)}>
                          {article.category}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-display font-bold text-sm text-white group-hover:text-cyber-neon transition-colors line-clamp-2 mb-2">{article.title}</h3>
                        <div className="flex justify-between text-xs text-gray-600 font-mono">
                          <span>{article.author}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.readTime} мин</span>
                        </div>
                      </div>
                    </motion.article>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

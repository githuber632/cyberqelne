"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Calendar, Tag, User } from "lucide-react";
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

export default function NewsArticlePage() {
  const { id } = useParams<{ id: string }>();
  const { news } = useContentStore();
  const article = news.find((n) => n.id === id);
  const related = news.filter((n) => n.published && n.id !== id).slice(0, 3);

  if (!article) {
    return (
      <div className="min-h-screen pt-32 pb-16 text-center">
        <h1 className="font-display font-black text-3xl text-white mb-4">Статья не найдена</h1>
        <Link href="/news" className="text-cyber-neon hover:underline">← Все новости</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <Link href="/news" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm font-mono">
            <ArrowLeft className="w-4 h-4" />Назад к новостям
          </Link>
        </motion.div>

        {/* Article */}
        <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          {/* Cover */}
          <div className="relative h-72 sm:h-96 bg-gradient-to-br from-cyber-purple to-cyber-dark rounded-2xl overflow-hidden mb-8">
            {article.image ? <img src={article.image} className="w-full h-full object-cover" alt="" /> : <div className="absolute inset-0 cyber-grid-bg opacity-30" />}
            <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark/60 to-transparent" />
            <div className={cn("absolute top-6 left-6 flex items-center gap-1.5 border rounded-full px-3 py-1 text-xs font-mono font-bold", categoryColors[article.category] ?? defaultColor)}>
              <Tag className="w-3 h-3" />{article.category}
            </div>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 font-mono mb-6">
            <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{article.author}</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{format(new Date(article.publishedAt), "d MMMM yyyy", { locale: ru })}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{article.readTime} мин чтения</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-4xl text-white leading-tight mb-6">{article.title}</h1>
          <p className="text-gray-300 text-lg leading-relaxed mb-8 border-l-4 border-cyber-neon/40 pl-4 italic">{article.excerpt}</p>

          <div className="prose prose-invert prose-lg max-w-none">
            {article.content.split("\n").map((para, i) => para.trim() && (
              <p key={i} className="text-gray-300 leading-relaxed mb-4">{para}</p>
            ))}
          </div>
        </motion.article>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display font-bold text-xl text-white mb-6">Читайте также</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((a, i) => (
                <motion.div key={a.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                  <Link href={`/news/${a.id}`}>
                    <div className="glass-card rounded-xl p-4 hover:border-cyber-neon/30 transition-all group cursor-pointer">
                      <div className={cn("inline-flex items-center gap-1 border rounded-full px-2 py-0.5 text-xs font-mono font-bold mb-2", categoryColors[a.category] ?? defaultColor)}>
                        {a.category}
                      </div>
                      <h3 className="font-display font-bold text-sm text-white group-hover:text-cyber-neon transition-colors line-clamp-2">{a.title}</h3>
                    </div>
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

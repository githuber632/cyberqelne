"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, Clock, ChevronRight, Tag } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useContentStore } from "@/store/contentStore";
import { Newspaper } from "lucide-react";

const categoryColorMap: Record<string, string> = {
  "Турниры": "bg-cyber-neon/20 text-cyber-neon border-cyber-neon/40",
  "Анонс": "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
  "Интервью": "bg-cyber-neon-pink/20 text-cyber-neon-pink border-cyber-neon-pink/40",
  "Аналитика": "bg-blue-500/20 text-blue-400 border-blue-500/40",
  "Новости": "bg-green-500/20 text-green-400 border-green-500/40",
  "Обновления": "bg-orange-500/20 text-orange-400 border-orange-500/40",
};
const defaultColor = "bg-gray-500/20 text-gray-400 border-gray-500/40";

export function NewsSection() {
  const { news } = useContentStore();

  const visible = [...news]
    .filter((n) => n.published)
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    })
    .slice(0, 4);

  const featured = visible[0];
  const rest = visible.slice(1);

  if (visible.length === 0) return null;

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Новости"
          title="Последние новости"
          subtitle="Будь в курсе событий киберспорта СНГ"
          link={{ href: "/news", label: "Все новости" }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured article */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <Link href={`/news/${featured.id}`}>
              <motion.article
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="glass-card rounded-2xl overflow-hidden h-full group cursor-pointer"
              >
                <div className="relative h-64 bg-gradient-to-br from-cyber-purple to-cyber-dark overflow-hidden">
                  {featured.image ? (
                    <img src={featured.image} className="absolute inset-0 w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="absolute inset-0 cyber-grid-bg opacity-30" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark to-transparent" />
                  <div className={`absolute top-4 left-4 flex items-center gap-1.5 border rounded-full px-3 py-1 text-xs font-mono font-bold ${categoryColorMap[featured.category] ?? defaultColor}`}>
                    <Tag className="w-3 h-3" />
                    {featured.category}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-gray-400 text-xs font-mono">
                      {format(new Date(featured.publishedAt), "d MMMM yyyy", { locale: ru })}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="font-display font-bold text-xl text-white mb-3 group-hover:text-cyber-neon transition-colors leading-snug line-clamp-2">
                    {featured.title}
                  </h2>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyber-purple-bright to-cyber-neon flex items-center justify-center text-white text-xs font-bold">
                        {featured.author[0]}
                      </div>
                      <span className="text-gray-400 text-sm">{featured.author}</span>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-gray-600 font-mono">
                      <Clock className="w-3 h-3" />
                      {featured.readTime} мин
                    </span>
                  </div>
                </div>
              </motion.article>
            </Link>
          </motion.div>

          {/* Side articles */}
          <div className="space-y-4">
            {rest.map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Link href={`/news/${article.id}`}>
                  <motion.article
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                    className="glass-card rounded-xl p-4 group cursor-pointer"
                  >
                    <div className={`inline-flex items-center gap-1 border rounded-full px-2 py-0.5 text-xs font-mono font-bold mb-2 ${categoryColorMap[article.category] ?? defaultColor}`}>
                      {article.category}
                    </div>
                    <h3 className="font-display font-bold text-sm text-white mb-2 group-hover:text-cyber-neon transition-colors leading-snug line-clamp-2">
                      {article.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-gray-600 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(article.publishedAt), "d MMM", { locale: ru })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readTime} мин
                      </span>
                    </div>
                  </motion.article>
                </Link>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Link
                href="/news"
                className="flex items-center justify-center gap-2 py-4 glass-card rounded-xl text-gray-400 hover:text-cyber-neon hover:border-cyber-neon/30 transition-all duration-300 text-sm font-mono"
              >
                Все новости
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

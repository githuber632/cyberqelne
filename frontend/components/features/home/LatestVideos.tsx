"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Play, Eye, Clock, Flame, Video } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";
import { useContentStore } from "@/store/contentStore";

const categoryMeta: Record<string, { label: string; color: string; emoji: string; gradient: string }> = {
  highlight: { label: "Хайлайт", color: "text-yellow-400 bg-yellow-500/20 border-yellow-500/40", emoji: "🔥", gradient: "from-yellow-900 to-cyber-dark" },
  tournament: { label: "Турнир", color: "text-cyber-neon bg-cyber-neon/20 border-cyber-neon/40", emoji: "⚔️", gradient: "from-purple-900 to-cyber-dark" },
  stream: { label: "Стрим", color: "text-red-400 bg-red-500/20 border-red-500/40", emoji: "📡", gradient: "from-red-900 to-cyber-dark" },
  educational: { label: "Обучение", color: "text-blue-400 bg-blue-500/20 border-blue-500/40", emoji: "🎓", gradient: "from-indigo-900 to-cyber-dark" },
};
const defaultMeta = { label: "Видео", color: "text-gray-400 bg-gray-500/20 border-gray-500/40", emoji: "🎬", gradient: "from-cyber-purple to-cyber-dark" };

function formatViews(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

export function LatestVideos() {
  const { videos } = useContentStore();

  const sorted = [...videos].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  }).slice(0, 4);

  const featured = sorted[0];
  const rest = sorted.slice(1);

  if (!featured) return null;

  const featuredMeta = categoryMeta[featured.category] ?? defaultMeta;

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-dark/50 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Медиа"
          title="Видео & Хайлайты"
          subtitle="Смотри лучшие матчи, разборы и обучающий контент"
          link={{ href: "/media", label: "Все видео" }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured video */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <Link href={`/media/${featured.id}`}>
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
                className="glass-card rounded-2xl overflow-hidden group cursor-pointer"
              >
                <div className={cn("relative h-64 lg:h-80 bg-gradient-to-br overflow-hidden", featuredMeta.gradient)}>
                  {featured.thumbnailUrl ? (
                    <img src={featured.thumbnailUrl} className="absolute inset-0 w-full h-full object-cover" alt="" />
                  ) : (
                    <>
                      <div className="absolute inset-0 cyber-grid-bg opacity-20" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-7xl opacity-30">{featuredMeta.emoji}</span>
                      </div>
                    </>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:bg-cyber-neon/30 group-hover:border-cyber-neon/60 transition-all duration-300"
                    >
                      <Play className="w-8 h-8 text-white fill-white ml-1" />
                    </motion.div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className={cn("border rounded-full px-2.5 py-1 text-xs font-mono font-bold", featuredMeta.color)}>
                      {featuredMeta.label}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1">
                    <Flame className="w-3 h-3 text-red-400" />
                    <span className="text-white text-xs font-mono font-bold">{featured.duration}</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-display font-bold text-lg text-white leading-snug line-clamp-2 group-hover:text-cyber-neon transition-colors">
                      {featured.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {formatViews(featured.views)} просмотров
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>

          {/* Side videos */}
          <div className="space-y-4">
            {rest.map((video, i) => {
              const meta = categoryMeta[video.category] ?? defaultMeta;
              return (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/media/${video.id}`}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                      className="glass-card rounded-xl overflow-hidden group cursor-pointer flex gap-4 p-0"
                    >
                      <div className={cn("relative w-32 flex-shrink-0 bg-gradient-to-br overflow-hidden", meta.gradient)}>
                        {video.thumbnailUrl ? (
                          <img src={video.thumbnailUrl} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl opacity-40">{meta.emoji}</span>
                          </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                          <Play className="w-6 h-6 text-white fill-white" />
                        </div>
                        <div className="absolute bottom-1 right-1 bg-black/70 rounded px-1 py-0.5">
                          <span className="text-white text-xs font-mono">{video.duration}</span>
                        </div>
                      </div>

                      <div className="py-3 pr-4 flex-1 flex flex-col justify-between">
                        <div>
                          <span className={cn("text-xs font-mono font-bold", meta.color.split(" ")[0])}>
                            {meta.label}
                          </span>
                          <h4 className="text-sm font-semibold text-white mt-1 line-clamp-2 group-hover:text-cyber-neon transition-colors leading-snug">
                            {video.title}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600 font-mono mt-2">
                          <Eye className="w-3 h-3" />
                          {formatViews(video.views)}
                          <Clock className="w-3 h-3" />
                          {video.duration}
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

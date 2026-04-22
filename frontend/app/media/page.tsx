"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Eye, Search, X } from "lucide-react";
import { useContentStore } from "@/store/contentStore";
import { cn } from "@/lib/utils";

const catMeta: Record<string, { label: string; color: string; emoji: string; gradient: string }> = {
  highlight: { label: "Хайлайт", color: "text-yellow-400 bg-yellow-500/20 border-yellow-500/40", emoji: "🔥", gradient: "from-yellow-900 to-cyber-dark" },
  tournament: { label: "Турнир", color: "text-cyber-neon bg-cyber-neon/20 border-cyber-neon/40", emoji: "⚔️", gradient: "from-purple-900 to-cyber-dark" },
  stream: { label: "Стрим", color: "text-red-400 bg-red-500/20 border-red-500/40", emoji: "📡", gradient: "from-red-900 to-cyber-dark" },
  educational: { label: "Обучение", color: "text-blue-400 bg-blue-500/20 border-blue-500/40", emoji: "🎓", gradient: "from-indigo-900 to-cyber-dark" },
  interview: { label: "Интервью", color: "text-pink-400 bg-pink-500/20 border-pink-500/40", emoji: "🎤", gradient: "from-pink-900 to-cyber-dark" },
};
const defMeta = { label: "Видео", color: "text-gray-400 bg-gray-500/20 border-gray-500/40", emoji: "🎬", gradient: "from-cyber-purple to-cyber-dark" };

function fmt(n: number) { return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n); }

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([^&\n?#]+)/);
  return m ? m[1] : null;
}

const CATS = ["Все", "highlight", "tournament", "stream", "educational", "interview"];

interface Video {
  id: string; title: string; description: string; thumbnailUrl: string;
  videoUrl: string; duration: string; category: string; views: number; featured: boolean;
}

function VideoModal({ video, onClose }: { video: Video; onClose: () => void }) {
  const ytId = video.videoUrl ? getYouTubeId(video.videoUrl) : null;
  const meta = catMeta[video.category] ?? defMeta;
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Reset play state when video changes
  useEffect(() => { setPlaying(false); }, [video.id]);

  const thumbnail = video.thumbnailUrl || (ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : "");

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.93 }}
          transition={{ type: "spring", stiffness: 280, damping: 26 }}
          className="w-full max-w-4xl bg-[#0d0d14] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        >
          {/* Video area */}
          <div className="relative bg-black" style={{ paddingTop: "56.25%" }}>
            {playing && ytId ? (
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : playing && video.videoUrl && !ytId ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-cyber-dark">
                <p className="text-gray-500 text-sm font-mono">Не удалось встроить — открываем в новой вкладке</p>
                <a href={video.videoUrl} target="_blank" rel="noopener noreferrer" onClick={onClose}
                  className="px-5 py-2.5 bg-cyber-neon/20 border border-cyber-neon/40 rounded-xl text-cyber-neon text-sm font-mono hover:bg-cyber-neon/30 transition-all">
                  Открыть видео →
                </a>
              </div>
            ) : (
              /* Thumbnail / preview */
              <div className="absolute inset-0 group cursor-pointer" onClick={() => setPlaying(true)}>
                {thumbnail ? (
                  <img src={thumbnail} className="w-full h-full object-cover" alt={video.title} />
                ) : (
                  <div className={cn("w-full h-full bg-gradient-to-br flex items-center justify-center", meta.gradient)}>
                    <span className="text-8xl opacity-20">{meta.emoji}</span>
                  </div>
                )}
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-20 h-20 rounded-full bg-white/15 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center group-hover:bg-red-600/80 group-hover:border-red-400 transition-all duration-200"
                  >
                    <Play className="w-8 h-8 text-white fill-white ml-1" />
                  </motion.div>
                </div>
                {/* Duration badge */}
                {video.duration && (
                  <div className="absolute bottom-3 right-3 bg-black/80 rounded px-2 py-0.5 text-white text-xs font-mono backdrop-blur-sm">
                    {video.duration}
                  </div>
                )}
              </div>
            )}

            {/* Close button */}
            <button onClick={onClose}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-all backdrop-blur-sm border border-white/10">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Info panel */}
          <div className="px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={cn("text-xs font-mono font-bold border rounded-full px-2.5 py-0.5", meta.color)}>{meta.label}</span>
                  <div className="flex items-center gap-1 text-xs text-gray-500 font-mono">
                    <Eye className="w-3 h-3" />{fmt(video.views)} просмотров
                  </div>
                </div>
                <h2 className="font-display font-bold text-white text-lg leading-snug mb-1">{video.title}</h2>
                {video.description && <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{video.description}</p>}
              </div>
              {!playing && video.videoUrl && (
                <button onClick={() => setPlaying(true)}
                  className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-red-600/90 hover:bg-red-500 text-white text-sm font-semibold rounded-xl transition-colors">
                  <Play className="w-4 h-4 fill-white" /> Смотреть
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function MediaPage() {
  const { videos } = useContentStore();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("Все");
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

  useEffect(() => {
    const c = searchParams.get("cat");
    if (c && CATS.includes(c)) setCat(c);
  }, [searchParams]);

  const filtered = (videos as Video[])
    .filter((v) => !search || v.title.toLowerCase().includes(search.toLowerCase()))
    .filter((v) => cat === "Все" || v.category === cat)
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.views - a.views;
    });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="relative overflow-hidden bg-gradient-to-b from-cyber-purple/20 to-transparent py-16">
        <div className="absolute inset-0 cyber-grid-bg opacity-20" />
        <div className="max-w-7xl mx-auto px-4 relative text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display font-black text-4xl sm:text-5xl text-white mb-3">Медиа</h1>
            <p className="text-gray-400">Смотри лучшие матчи, разборы и обучающий контент</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск видео..."
              className="w-full bg-cyber-purple/20 border border-cyber-glass-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyber-neon/50 font-mono" />
          </div>
          <div className="flex gap-1 flex-wrap">
            {CATS.map((c) => {
              const m = catMeta[c];
              return (
                <button key={c} onClick={() => setCat(c)}
                  className={cn("px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all",
                    cat === c ? "bg-cyber-neon/20 text-cyber-neon border border-cyber-neon/40" : "text-gray-500 hover:text-white hover:bg-white/5 border border-transparent")}>
                  {c === "Все" ? "Все" : m?.label ?? c}
                </button>
              );
            })}
          </div>
        </motion.div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            <p className="text-lg">Видео не найдено</p>
          </div>
        ) : (
          <>
            {/* Featured */}
            {featured && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-8">
                <motion.div
                  whileHover={{ scale: 1.005 }}
                  onClick={() => setActiveVideo(featured)}
                  className="glass-card rounded-2xl overflow-hidden group cursor-pointer"
                >
                  <div className={cn("relative h-64 lg:h-96 bg-gradient-to-br overflow-hidden", (catMeta[featured.category] ?? defMeta).gradient)}>
                    {featured.thumbnailUrl ? (
                      <img src={featured.thumbnailUrl} className="absolute inset-0 w-full h-full object-cover" alt="" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-8xl opacity-20">{(catMeta[featured.category] ?? defMeta).emoji}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark via-transparent to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div whileHover={{ scale: 1.1 }} className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:bg-cyber-neon/30 group-hover:border-cyber-neon/60 transition-all">
                        <Play className="w-8 h-8 text-white fill-white ml-1" />
                      </motion.div>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className={cn("border rounded-full px-2.5 py-1 text-xs font-mono font-bold", (catMeta[featured.category] ?? defMeta).color)}>
                        {(catMeta[featured.category] ?? defMeta).label}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 bg-black/60 rounded-full px-3 py-1 text-white text-xs font-mono">{featured.duration}</div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h2 className="font-display font-bold text-xl text-white line-clamp-2 group-hover:text-cyber-neon transition-colors">{featured.title}</h2>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-400 font-mono">
                        <Eye className="w-3.5 h-3.5" />{fmt(featured.views)} просмотров
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {rest.map((video) => {
                const meta = catMeta[video.category] ?? defMeta;
                return (
                  <div key={video.id} onClick={() => setActiveVideo(video)}
                    className="glass-card rounded-xl overflow-hidden group cursor-pointer hover:-translate-y-1 transition-transform duration-200">
                    <div className={cn("relative h-40 bg-gradient-to-br overflow-hidden", meta.gradient)}>
                      {video.thumbnailUrl ? (
                        <img src={video.thumbnailUrl} className="absolute inset-0 w-full h-full object-cover" alt="" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-4xl opacity-30">{meta.emoji}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                        <Play className="w-10 h-10 text-white fill-white" />
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 rounded px-1.5 py-0.5 text-xs text-white font-mono">{video.duration}</div>
                    </div>
                    <div className="p-3">
                      <span className={cn("text-xs font-mono font-bold", meta.color.split(" ")[0])}>{meta.label}</span>
                      <h3 className="text-sm font-semibold text-white mt-1 line-clamp-2 group-hover:text-cyber-neon transition-colors">{video.title}</h3>
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-600 font-mono">
                        <Eye className="w-3 h-3" />{fmt(video.views)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Video modal */}
      {activeVideo && <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />}
    </div>
  );
}

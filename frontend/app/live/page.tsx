"use client";

import { motion } from "framer-motion";
import { Radio, ExternalLink } from "lucide-react";
import { useContentStore } from "@/store/contentStore";
import { cn } from "@/lib/utils";

export default function LivePage() {
  const { liveBanners } = useContentStore();
  const active = liveBanners.filter((b) => b.active);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="relative overflow-hidden bg-gradient-to-b from-red-900/20 to-transparent py-16">
        <div className="absolute inset-0 cyber-grid-bg opacity-20" />
        <div className="max-w-7xl mx-auto px-4 relative text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-4 py-1.5 mb-4">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest">Live & Видео</span>
            </div>
            <h1 className="font-display font-black text-4xl sm:text-5xl text-white mb-3">Прямой эфир</h1>
            <p className="text-gray-400">Смотри турниры и контент CyberQELN на YouTube</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {active.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-2xl py-24 text-center text-gray-600">
            <Radio className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="font-display font-bold text-lg text-gray-500">Прямых эфиров нет</p>
            <p className="text-gray-600 text-sm font-mono mt-1">Следи за анонсами в разделе Новости</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {active.map((b, i) => (
              <motion.a
                key={b.id}
                href={b.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass-card rounded-2xl overflow-hidden group cursor-pointer block"
              >
                {/* Thumbnail */}
                <div className="relative h-48 bg-gradient-to-br from-red-900/60 to-cyber-dark overflow-hidden">
                  {b.thumbnailUrl ? (
                    <img src={b.thumbnailUrl} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Radio className="w-16 h-16 text-red-400/30 group-hover:text-red-400/50 transition-colors" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark/80 to-transparent" />

                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 bg-red-600/90 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  {b.isLive && (
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-600 rounded-full px-2.5 py-1">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      <span className="text-white text-xs font-mono font-bold">LIVE</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-display font-bold text-white text-base mb-1.5 group-hover:text-red-400 transition-colors line-clamp-2">
                    {b.title}
                  </h3>
                  {b.description && (
                    <p className="text-gray-500 text-xs mb-3 line-clamp-2 leading-relaxed">{b.description}</p>
                  )}
                  <div className="flex items-center gap-1.5 text-red-400 text-xs font-mono font-bold">
                    <ExternalLink className="w-3.5 h-3.5" />
                    Смотреть на YouTube
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

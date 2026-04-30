"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import Link from "next/link";
import { Trophy, Play, ChevronRight } from "lucide-react";
import { useContentStore, useMediaBlobStore } from "@/store/contentStore";
import { loadVideoDB } from "@/lib/videoDB";

export function HeroSection() {
  const { heroSettings, siteSettings } = useContentStore();
  const { heroBlobVideo, setHeroBlobVideo } = useMediaBlobStore();

  // On mount: restore video from IndexedDB if not already in memory
  useEffect(() => {
    if (heroBlobVideo) return;
    loadVideoDB("hero-bg").then((url) => {
      if (url) setHeroBlobVideo(url);
    });
  }, []);

  const activeVideo = heroBlobVideo || heroSettings.backgroundVideo || "";

  const headline = heroSettings.headline || "CYBERQELN";
  const subheadline = heroSettings.subheadline || "ESPORTS ECOSYSTEM";
  const ctaText = heroSettings.ctaText || "Участвовать";

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-cyber-black">
      {/* Background — video takes priority over image */}
      <div className="absolute inset-0">
        {activeVideo ? (
          <video
            key={activeVideo}
            src={activeVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <img
            src={heroSettings.backgroundImage || "/images/hero-bg.jpg"}
            className="w-full h-full object-cover object-center"
            alt=""
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        )}
        <div
          className="absolute inset-0 bg-cyber-black"
          style={{ opacity: (heroSettings.backgroundOverlay ?? 60) / 100 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-cyber-black/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-black/60 via-transparent to-cyber-black/40" />
      </div>

      {/* Background grid overlay */}
      <div className="absolute inset-0 cyber-grid-bg opacity-20" />

      {/* Glowing orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-cyber-purple rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute -bottom-32 right-1/4 w-[400px] h-[400px] bg-cyber-neon-pink rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/3 right-10 w-[200px] h-[200px] bg-cyber-neon-pink rounded-full blur-[80px]"
        />
      </div>

      {/* Scan line */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ y: ["-5%", "105%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 6 }}
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-neon/60 to-transparent"
        />
      </div>

      {/* Content — NO scroll-based opacity to prevent blank page */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full">
        <div className="max-w-3xl">
          <div>
            {heroSettings.showLiveBadge && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 mb-6"
              >
                <span className="flex items-center gap-2 bg-red-500/20 border border-red-500/40 text-red-400 px-3 py-1 rounded-full text-xs font-mono font-semibold">
                  <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                  LIVE NOW
                </span>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mb-4"
            >
              {heroSettings.heroMode === "logo" && heroSettings.heroLogoUrl ? (
                <img
                  src={heroSettings.heroLogoUrl}
                  alt={siteSettings.siteName || "CyberQELN"}
                  style={{
                    height: `${heroSettings.heroLogoHeight ?? 120}px`,
                    transform: `translate(${heroSettings.heroLogoOffsetX ?? 0}px, ${heroSettings.heroLogoOffsetY ?? 0}px)`,
                  }}
                  className="object-contain mb-2"
                />
              ) : (
                <h1 className="font-display font-black leading-none">
                  <span
                    className="block text-3xl sm:text-5xl lg:text-7xl"
                    style={{ color: heroSettings.headlineColor || "#ffffff" }}
                  >
                    {headline.length > 6 ? headline.slice(0, Math.ceil(headline.length / 2)) : headline}
                  </span>
                  {headline.length > 3 && (
                    <span
                      className="block text-3xl sm:text-5xl lg:text-7xl"
                      style={{ color: heroSettings.headlineColor2 || "#a855f7" }}
                    >
                      {headline.length > 6 ? headline.slice(Math.ceil(headline.length / 2)) : ""}
                    </span>
                  )}
                </h1>
              )}
              <span
                className="block text-base sm:text-xl lg:text-3xl font-light mt-2 tracking-widest font-display"
                style={{ color: heroSettings.subheadlineColor || "#9ca3af" }}
              >
                {subheadline}
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-gray-400 text-sm sm:text-lg max-w-lg mb-8 leading-relaxed"
            >
              {siteSettings.tagline || "Главная киберспортивная платформа СНГ. Участвуй в турнирах, создавай команды, следи за лучшими игроками региона."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10"
            >
              <Link href="/tournaments" className="group relative flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-cyber-purple-bright to-cyber-neon text-white font-display font-semibold rounded-xl hover:shadow-neon transition-all duration-300 hover:scale-105">
                <Trophy className="w-5 h-5" />
                {ctaText}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/media" className="group flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 glass-card rounded-xl text-white font-display font-semibold hover:border-cyber-neon/50 transition-all duration-300">
                <Play className="w-5 h-5 text-cyber-neon-pink" />
                Смотреть Live
              </Link>
            </motion.div>

          </div>

        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-gray-600 font-sans tracking-widest">SCROLL</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-px h-8 bg-gradient-to-b from-cyber-neon to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}

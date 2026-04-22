"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Trophy, Users, Play, ChevronRight, Zap, Calendar } from "lucide-react";
import { useContentStore } from "@/store/contentStore";

export function HeroSection() {
  const { heroSettings, siteSettings, tournaments } = useContentStore();

  const featuredTournament = heroSettings.featuredTournamentId
    ? tournaments.find((t) => t.id === heroSettings.featuredTournamentId) ?? tournaments[0] ?? null
    : tournaments[0] ?? null;

  const headline = heroSettings.headline || "CYBERQELN";
  const subheadline = heroSettings.subheadline || "ESPORTS ECOSYSTEM";
  const ctaText = heroSettings.ctaText || "Участвовать";

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-cyber-black">
      {/* Background */}
      <div className="absolute inset-0 cyber-grid-bg opacity-40" />

      {/* Background image */}
      {heroSettings.backgroundImage && (
        <div className="absolute inset-0">
          <img src={heroSettings.backgroundImage} className="w-full h-full object-cover opacity-20" alt="" />
          <div className="absolute inset-0 bg-gradient-to-b from-cyber-black/70 via-transparent to-cyber-black/80" />
        </div>
      )}

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
          className="absolute -bottom-32 right-1/4 w-[400px] h-[400px] bg-cyber-neon-blue rounded-full blur-[100px]"
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
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
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

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display font-black leading-none mb-4"
            >
              <span className="block text-5xl sm:text-6xl lg:text-7xl text-white">
                {headline.length > 6 ? headline.slice(0, Math.ceil(headline.length / 2)) : headline}
              </span>
              {headline.length > 3 && (
                <span className="block text-5xl sm:text-6xl lg:text-7xl text-gradient-cyber">
                  {headline.length > 6 ? headline.slice(Math.ceil(headline.length / 2)) : ""}
                </span>
              )}
              <span className="block text-xl sm:text-2xl lg:text-3xl text-gray-400 font-light mt-2 tracking-widest">
                {subheadline}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-gray-400 text-lg max-w-lg mb-8 leading-relaxed"
            >
              {siteSettings.tagline || "Главная киберспортивная платформа СНГ. Участвуй в турнирах, создавай команды, следи за лучшими игроками региона."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4 mb-10"
            >
              <Link href="/tournaments" className="group relative flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyber-purple-bright to-cyber-neon text-white font-display font-semibold rounded-xl hover:shadow-neon transition-all duration-300 hover:scale-105">
                <Trophy className="w-5 h-5" />
                {ctaText}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/media" className="group flex items-center gap-2 px-8 py-4 glass-card rounded-xl text-white font-display font-semibold hover:border-cyber-neon/50 transition-all duration-300">
                <Play className="w-5 h-5 text-cyber-neon-blue" />
                Смотреть Live
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-3 gap-6"
            >
              {[
                { label: "Игроков", value: "12,400+", icon: Users },
                { label: "Турниров", value: "340+", icon: Trophy },
                { label: "Призовой", value: "500M+", icon: Zap },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <stat.icon className="w-5 h-5 text-cyber-neon mx-auto mb-1" />
                  <div className="font-display font-bold text-xl text-white">{stat.value}</div>
                  <div className="text-xs text-gray-500 font-mono">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Tournament card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            {featuredTournament ? (
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-cyber-purple/30 to-cyber-neon-blue/20 rounded-3xl blur-xl" />
                <motion.div whileHover={{ scale: 1.02, y: -4 }} transition={{ duration: 0.3 }} className="relative glass-card rounded-2xl overflow-hidden gradient-border">
                  <div className="relative h-48 bg-gradient-to-br from-cyber-purple to-cyber-dark overflow-hidden">
                    {featuredTournament.banner ? (
                      <img src={featuredTournament.banner} className="absolute inset-0 w-full h-full object-cover" alt="" />
                    ) : (
                      <>
                        <div className="absolute inset-0 cyber-grid-bg opacity-30" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-6xl opacity-30">{featuredTournament.gameIcon}</span>
                        </div>
                      </>
                    )}
                    {featuredTournament.status === "active" && (
                      <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500/30 backdrop-blur-sm border border-red-500/50 rounded-full px-3 py-1">
                        <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                        <span className="text-red-300 text-xs font-bold font-mono">LIVE</span>
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-cyber-neon/20 backdrop-blur-sm border border-cyber-neon/40 rounded-full px-3 py-1">
                      <span className="text-cyber-neon text-xs font-bold font-mono">{featuredTournament.prizePool} UZS</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display font-bold text-xl text-white mb-1">{featuredTournament.title}</h3>
                    <p className="text-cyber-neon text-sm font-mono mb-4">{featuredTournament.game} • {featuredTournament.format}</p>
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div className="bg-cyber-purple/20 rounded-xl p-3 border border-cyber-glass-border">
                        <Users className="w-4 h-4 text-cyber-neon mb-1" />
                        <div className="text-white font-bold font-mono text-sm">{featuredTournament.teamsRegistered}/{featuredTournament.maxTeams}</div>
                        <div className="text-gray-500 text-xs">Команды</div>
                      </div>
                      <div className="bg-cyber-purple/20 rounded-xl p-3 border border-cyber-glass-border">
                        <Calendar className="w-4 h-4 text-cyber-neon mb-1" />
                        <div className="text-white font-bold font-mono text-sm">{featuredTournament.startDate}</div>
                        <div className="text-gray-500 text-xs">Начало</div>
                      </div>
                    </div>
                    <Link href={`/tournaments/${featuredTournament.id}`} className="block w-full text-center py-3 bg-gradient-to-r from-cyber-purple-bright to-cyber-neon rounded-xl font-display font-semibold text-white text-sm hover:shadow-neon transition-all">
                      {featuredTournament.status === "active" ? "Смотреть" : featuredTournament.status === "registration" ? "Зарегистрироваться" : "Подробнее"}
                    </Link>
                  </div>
                </motion.div>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-cyber-purple/30 to-cyber-neon-blue/20 rounded-3xl blur-xl" />
                <div className="relative glass-card rounded-2xl p-8 text-center">
                  <Trophy className="w-20 h-20 text-cyber-neon/30 mx-auto mb-4" />
                  <h3 className="font-display font-bold text-xl text-white mb-2">Турниры CyberQELN</h3>
                  <p className="text-gray-400 text-sm mb-6">Регистрируйся и борись за призы</p>
                  <Link href="/tournaments" className="block w-full text-center py-3 bg-gradient-to-r from-cyber-purple-bright to-cyber-neon rounded-xl font-display font-semibold text-white text-sm hover:shadow-neon transition-all">
                    Все турниры
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-gray-600 font-mono tracking-widest">SCROLL</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-px h-8 bg-gradient-to-b from-cyber-neon to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}

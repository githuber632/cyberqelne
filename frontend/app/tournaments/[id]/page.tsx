"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Trophy, Users, DollarSign, Calendar, Clock, Shield, ChevronRight } from "lucide-react";
import { useContentStore } from "@/store/contentStore";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

const statusConfig = {
  registration: { label: "Регистрация открыта", dot: "bg-green-400", badge: "text-green-400 bg-green-500/20 border-green-500/40" },
  active: { label: "LIVE", dot: "bg-red-400 animate-pulse", badge: "text-red-400 bg-red-500/20 border-red-500/40" },
  upcoming: { label: "Скоро", dot: "bg-yellow-400", badge: "text-yellow-400 bg-yellow-500/20 border-yellow-500/40" },
  finished: { label: "Завершён", dot: "bg-gray-500", badge: "text-gray-500 bg-gray-500/10 border-gray-500/20" },
};

export default function TournamentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { tournaments } = useContentStore();
  const { isAuthenticated } = useAuthStore();
  const tournament = tournaments.find((t) => t.id === id);

  if (!tournament) {
    return (
      <div className="min-h-screen pt-32 pb-16 text-center">
        <Trophy className="w-16 h-16 text-gray-700 mx-auto mb-4" />
        <h1 className="font-display font-black text-3xl text-white mb-4">Турнир не найден</h1>
        <Link href="/tournaments" className="text-cyber-neon hover:underline">← Все турниры</Link>
      </div>
    );
  }

  const status = statusConfig[tournament.status];
  const regPercent = (tournament.teamsRegistered / tournament.maxTeams) * 100;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <Link href="/tournaments" className="flex items-center gap-2 text-gray-500 hover:text-white text-sm font-mono">
            <ArrowLeft className="w-4 h-4" />Все турниры
          </Link>
        </motion.div>

        {/* Cover */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative h-60 sm:h-80 bg-gradient-to-br from-cyber-purple to-cyber-dark rounded-2xl overflow-hidden mb-8">
          {tournament.banner ? (
            <img src={tournament.banner} className="absolute inset-0 w-full h-full object-cover" alt="" />
          ) : (
            <>
              <div className="absolute inset-0 cyber-grid-bg opacity-30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-8xl opacity-20">{tournament.gameIcon}</span>
              </div>
            </>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark/80 to-transparent" />
          <div className={cn("absolute top-5 left-5 flex items-center gap-2 border rounded-full px-3 py-1.5", status.badge)}>
            <span className={cn("w-2 h-2 rounded-full", status.dot)} />
            <span className="text-sm font-bold font-mono">{status.label}</span>
          </div>
          {tournament.featured && (
            <div className="absolute top-5 right-5 bg-cyber-neon/20 border border-cyber-neon/40 rounded-full px-3 py-1 text-cyber-neon text-sm font-mono font-bold">⭐ Featured</div>
          )}
          <div className="absolute bottom-5 left-5">
            <h1 className="font-display font-black text-3xl sm:text-4xl text-white">{tournament.title}</h1>
            <p className="text-cyber-neon font-mono mt-1">{tournament.game} • {tournament.format}</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Призовой фонд", value: `${tournament.prizePool} UZS`, icon: DollarSign, color: "text-cyber-neon" },
                { label: "Дата начала", value: tournament.startDate, icon: Calendar, color: "text-white" },
                { label: "Взнос", value: tournament.entryFee, icon: Clock, color: "text-white" },
                { label: "Организатор", value: tournament.organizer, icon: Shield, color: "text-white" },
              ].map((stat) => (
                <div key={stat.label} className="glass-card rounded-xl p-4">
                  <stat.icon className={cn("w-4 h-4 mb-2", stat.color)} />
                  <div className={cn("font-display font-bold text-sm", stat.color)}>{stat.value}</div>
                  <div className="text-gray-600 text-xs font-mono mt-0.5">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Description */}
            {tournament.description && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card rounded-2xl p-6">
                <h2 className="font-display font-bold text-white mb-3">О турнире</h2>
                <p className="text-gray-400 leading-relaxed">{tournament.description}</p>
              </motion.div>
            )}

            {/* Teams progress */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-white">Регистрация команд</h2>
                <span className="text-cyber-neon font-mono font-bold">{tournament.teamsRegistered}/{tournament.maxTeams}</span>
              </div>
              <div className="h-3 bg-cyber-purple-mid rounded-full overflow-hidden mb-2">
                <motion.div initial={{ width: 0 }} animate={{ width: `${regPercent}%` }} transition={{ duration: 1.2, delay: 0.3 }}
                  className={cn("h-full rounded-full", regPercent >= 100 ? "bg-red-500" : "bg-gradient-to-r from-cyber-purple-bright to-cyber-neon")} />
              </div>
              <p className="text-gray-500 text-sm font-mono">
                {regPercent >= 100 ? "Слоты заполнены" : `Осталось ${tournament.maxTeams - tournament.teamsRegistered} мест`}
              </p>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="space-y-4">
            {/* CTA */}
            {tournament.status === "registration" && (
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-display font-bold text-white mb-4">Участие</h3>
                {isAuthenticated ? (
                  <button className="w-full py-3.5 bg-gradient-to-r from-cyber-purple-bright to-cyber-neon text-white font-display font-bold rounded-xl hover:shadow-neon transition-all">
                    Зарегистрировать команду
                  </button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-gray-400 text-sm text-center">Войди чтобы зарегистрироваться</p>
                    <Link href="/auth/login" className="block w-full py-3.5 text-center bg-gradient-to-r from-cyber-purple-bright to-cyber-neon text-white font-display font-bold rounded-xl hover:shadow-neon transition-all">
                      Войти
                    </Link>
                    <Link href="/auth/register" className="block w-full py-3 text-center glass-card rounded-xl text-gray-300 hover:text-white hover:border-cyber-neon/30 transition-all text-sm">
                      Создать аккаунт
                    </Link>
                  </div>
                )}
              </div>
            )}

            {tournament.status === "active" && (
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2.5 h-2.5 bg-red-400 rounded-full animate-pulse" />
                  <span className="text-red-400 font-mono font-bold text-sm">LIVE</span>
                </div>
                <p className="text-gray-400 text-sm mb-4">Турнир идёт прямо сейчас</p>
                <button className="w-full py-3 bg-red-500/20 border border-red-500/40 text-red-400 font-display font-bold rounded-xl hover:bg-red-500/30 transition-all text-sm">
                  Смотреть трансляцию
                </button>
              </div>
            )}

            {/* Bracket placeholder */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-display font-bold text-white mb-3 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-cyber-neon" />Формат
              </h3>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex justify-between"><span>Тип:</span><span className="text-white font-mono">{tournament.format}</span></div>
                <div className="flex justify-between"><span>Игра:</span><span className="text-white font-mono">{tournament.game}</span></div>
                <div className="flex justify-between"><span>Конец:</span><span className="text-white font-mono">{tournament.endDate}</span></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

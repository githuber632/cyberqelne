"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Crown, TrendingUp, Minus, Shield, Trophy } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useContentStore } from "@/store/contentStore";
import { cn } from "@/lib/utils";

type LeaderboardTab = "players" | "teams";

const rankColors: Record<number, string> = {
  1: "from-yellow-500/30 to-amber-500/20 border-yellow-500/40",
  2: "from-gray-400/20 to-gray-500/10 border-gray-400/30",
  3: "from-amber-700/20 to-amber-800/10 border-amber-700/30",
};

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Trophy className="w-12 h-12 text-cyber-neon/20 mb-4" />
      <p className="text-gray-500 font-mono text-sm">{label} пока нет</p>
      <p className="text-gray-600 text-xs mt-1">Добавьте данные в админ-панели</p>
    </div>
  );
}

export function LeaderboardSection() {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>("players");
  const { users, teams } = useContentStore();

  const players = [...users]
    .filter((u) => u.status === "active")
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  const sortedTeams = [...teams]
    .filter((t) => t.active)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-purple/5 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Рейтинг"
          title="Топ игроки & команды"
          subtitle="Лучшие представители киберспорта СНГ по версии CyberQELN"
          link={{ href: "/leaderboard", label: "Полный рейтинг" }}
        />

        <div className="flex justify-center mb-8">
          <div className="glass-card rounded-xl p-1 flex gap-1">
            {(["players", "teams"] as LeaderboardTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "relative px-8 py-3 rounded-lg font-display text-sm font-semibold uppercase tracking-widest transition-all duration-300",
                  activeTab === tab ? "text-white" : "text-gray-500 hover:text-gray-300"
                )}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="leaderboard-tab"
                    className="absolute inset-0 bg-gradient-to-r from-cyber-purple-bright to-cyber-neon rounded-lg"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab === "players" ? "Игроки" : "Команды"}</span>
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="glass-card rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-cyber-glass-border text-xs font-mono text-gray-500 uppercase tracking-widest">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-5">{activeTab === "players" ? "Игрок" : "Команда"}</div>
            <div className="col-span-2 text-center hidden sm:block">{activeTab === "players" ? "Страна" : "Игроки"}</div>
            <div className="col-span-2 text-center">Рейтинг</div>
            <div className="col-span-2 text-center">{activeTab === "players" ? "Роль" : "W/L"}</div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: activeTab === "players" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "players" ? (
                players.length === 0 ? (
                  <EmptyState label="Игроки" />
                ) : (
                  players.map((user, i) => {
                    const rank = i + 1;
                    const isTop3 = rank <= 3;
                    const initials = user.nickname.slice(0, 2).toUpperCase();
                    return (
                      <motion.div key={user.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        <div className={cn(
                          "grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-cyber-glass-border hover:bg-cyber-neon/5 transition-all duration-200",
                          isTop3 && `bg-gradient-to-r ${rankColors[rank]}`
                        )}>
                          <div className="col-span-1 flex items-center justify-center gap-1">
                            {rank === 1 ? <Crown className="w-5 h-5 text-yellow-400" /> : <span className="font-display font-bold text-gray-400 text-sm">{rank}</span>}
                            <TrendingUp className="w-3 h-3 text-gray-600" />
                          </div>
                          <div className="col-span-5 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyber-purple-bright to-cyber-neon flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                              {initials}
                            </div>
                            <div>
                              <div className="font-display font-bold text-white text-sm">{user.nickname}</div>
                              <div className="text-xs text-gray-500 font-mono">{user.email}</div>
                            </div>
                          </div>
                          <div className="col-span-2 text-center hidden sm:block">
                            <span className="text-xs text-gray-400 font-mono">{user.country || "—"}</span>
                          </div>
                          <div className="col-span-2 text-center">
                            <span className="font-display font-bold text-cyber-neon text-sm">{user.rating.toLocaleString()}</span>
                          </div>
                          <div className="col-span-2 text-center">
                            <span className="text-xs text-gray-400 font-mono capitalize">{user.role}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )
              ) : (
                sortedTeams.length === 0 ? (
                  <EmptyState label="Команды" />
                ) : (
                  sortedTeams.map((team, i) => {
                    const rank = i + 1;
                    const isTop3 = rank <= 3;
                    const initials = team.tag || team.name.slice(0, 2).toUpperCase();
                    return (
                      <motion.div key={team.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        <div className={cn(
                          "grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-cyber-glass-border hover:bg-cyber-neon/5 transition-all duration-200",
                          isTop3 && `bg-gradient-to-r ${rankColors[rank]}`
                        )}>
                          <div className="col-span-1 flex items-center justify-center gap-1">
                            {rank === 1 ? <Crown className="w-5 h-5 text-yellow-400" /> : <span className="font-display font-bold text-gray-400 text-sm">{rank}</span>}
                            <Minus className="w-3 h-3 text-gray-600" />
                          </div>
                          <div className="col-span-5 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyber-purple-bright to-cyber-neon-blue flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                              {initials}
                            </div>
                            <div>
                              <div className="font-display font-bold text-white text-sm">{team.name}</div>
                              <div className="flex items-center gap-1 text-xs text-gray-500 font-mono">
                                <Shield className="w-3 h-3" />
                                {team.members} игроков
                              </div>
                            </div>
                          </div>
                          <div className="col-span-2 text-center hidden sm:block">
                            <span className="text-xs text-gray-400 font-mono">{team.members} / 5</span>
                          </div>
                          <div className="col-span-2 text-center">
                            <span className="font-display font-bold text-cyber-neon text-sm">{team.rating.toLocaleString()}</span>
                          </div>
                          <div className="col-span-2 text-center">
                            <span className="font-bold text-sm font-mono">
                              <span className="text-green-400">{team.wins}W</span>
                              <span className="text-gray-600"> / </span>
                              <span className="text-red-400">{team.losses}L</span>
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

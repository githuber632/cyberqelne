"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Crown, TrendingUp, TrendingDown, Minus, Shield, Star } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";

type LeaderboardTab = "players" | "teams";

interface Player {
  rank: number;
  prevRank: number;
  nickname: string;
  avatar: string;
  team: string;
  rating: number;
  winRate: number;
  matches: number;
  country: string;
}

interface Team {
  rank: number;
  prevRank: number;
  name: string;
  logo: string;
  members: number;
  rating: number;
  wins: number;
  losses: number;
  country: string;
}

const mockPlayers: Player[] = [
  { rank: 1, prevRank: 2, nickname: "PhantomX", avatar: "PX", team: "Team Phantom", rating: 3450, winRate: 78, matches: 284, country: "🇺🇿" },
  { rank: 2, prevRank: 1, nickname: "ShadowBlade", avatar: "SB", team: "Shadow Force", rating: 3380, winRate: 74, matches: 312, country: "🇰🇿" },
  { rank: 3, prevRank: 3, nickname: "NeonStrike", avatar: "NS", team: "Neon Wolves", rating: 3290, winRate: 71, matches: 267, country: "🇺🇿" },
  { rank: 4, prevRank: 6, nickname: "CyberLord", avatar: "CL", team: "CyberQELN Pro", rating: 3210, winRate: 69, matches: 298, country: "🇷🇺" },
  { rank: 5, prevRank: 4, nickname: "IronFist", avatar: "IF", team: "Iron Legion", rating: 3150, winRate: 67, matches: 321, country: "🇰🇬" },
];

const mockTeams: Team[] = [
  { rank: 1, prevRank: 1, name: "Team Phantom", logo: "PH", members: 5, rating: 4200, wins: 48, losses: 12, country: "🇺🇿" },
  { rank: 2, prevRank: 3, name: "Shadow Force", logo: "SF", members: 5, rating: 4050, wins: 44, losses: 16, country: "🇰🇿" },
  { rank: 3, prevRank: 2, name: "Neon Wolves", logo: "NW", members: 5, rating: 3980, wins: 42, losses: 18, country: "🇺🇿" },
  { rank: 4, prevRank: 5, name: "CyberQELN Pro", logo: "CQ", members: 5, rating: 3840, wins: 38, losses: 22, country: "🇷🇺" },
  { rank: 5, prevRank: 4, name: "Iron Legion", logo: "IL", members: 5, rating: 3720, wins: 35, losses: 25, country: "🇰🇬" },
];

const rankColors = {
  1: "from-yellow-500/30 to-amber-500/20 border-yellow-500/40",
  2: "from-gray-400/20 to-gray-500/10 border-gray-400/30",
  3: "from-amber-700/20 to-amber-800/10 border-amber-700/30",
};

export function LeaderboardSection() {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>("players");

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

        {/* Tab switcher */}
        <div className="flex justify-center mb-8">
          <div className="glass-card rounded-xl p-1 flex gap-1">
            {(["players", "teams"] as LeaderboardTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "relative px-8 py-3 rounded-lg font-display text-sm font-semibold uppercase tracking-widest transition-all duration-300",
                  activeTab === tab
                    ? "text-white"
                    : "text-gray-500 hover:text-gray-300"
                )}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="leaderboard-tab"
                    className="absolute inset-0 bg-gradient-to-r from-cyber-purple-bright to-cyber-neon rounded-lg"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">
                  {tab === "players" ? "Игроки" : "Команды"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard table */}
        <motion.div
          layout
          className="glass-card rounded-2xl overflow-hidden"
        >
          {/* Table header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-cyber-glass-border text-xs font-mono text-gray-500 uppercase tracking-widest">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-5">{activeTab === "players" ? "Игрок" : "Команда"}</div>
            <div className="col-span-2 text-center hidden sm:block">
              {activeTab === "players" ? "Команда" : "Игроки"}
            </div>
            <div className="col-span-2 text-center">Рейтинг</div>
            <div className="col-span-2 text-center">
              {activeTab === "players" ? "Винрейт" : "W/L"}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: activeTab === "players" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "players"
                ? mockPlayers.map((player, i) => (
                    <PlayerRow key={player.nickname} player={player} index={i} />
                  ))
                : mockTeams.map((team, i) => (
                    <TeamRow key={team.name} team={team} index={i} />
                  ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

function RankChange({ current, prev }: { current: number; prev: number }) {
  const diff = prev - current;
  if (diff > 0) return <TrendingUp className="w-3 h-3 text-green-400" />;
  if (diff < 0) return <TrendingDown className="w-3 h-3 text-red-400" />;
  return <Minus className="w-3 h-3 text-gray-600" />;
}

function PlayerRow({ player, index }: { player: Player; index: number }) {
  const isTop3 = player.rank <= 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/players/${player.nickname.toLowerCase()}`}>
        <div
          className={cn(
            "grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-cyber-glass-border hover:bg-cyber-neon/5 transition-all duration-200 group",
            isTop3 && `bg-gradient-to-r ${rankColors[player.rank as 1 | 2 | 3]}`
          )}
        >
          {/* Rank */}
          <div className="col-span-1 flex items-center justify-center gap-1">
            {player.rank === 1 ? (
              <Crown className="w-5 h-5 text-yellow-400" />
            ) : (
              <span className="font-display font-bold text-gray-400 text-sm">{player.rank}</span>
            )}
            <RankChange current={player.rank} prev={player.prevRank} />
          </div>

          {/* Player info */}
          <div className="col-span-5 flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyber-purple-bright to-cyber-neon flex items-center justify-center text-white font-bold text-sm">
                {player.avatar}
              </div>
              {isTop3 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-yellow-500/20 border border-yellow-500/50 flex items-center justify-center">
                  <Star className="w-2.5 h-2.5 text-yellow-400" />
                </div>
              )}
            </div>
            <div>
              <div className="font-display font-bold text-white text-sm group-hover:text-cyber-neon transition-colors">
                {player.country} {player.nickname}
              </div>
              <div className="text-xs text-gray-500 font-mono">{player.team}</div>
            </div>
          </div>

          {/* Team */}
          <div className="col-span-2 text-center hidden sm:block">
            <span className="text-xs text-gray-400 font-mono">{player.team}</span>
          </div>

          {/* Rating */}
          <div className="col-span-2 text-center">
            <span className="font-display font-bold text-cyber-neon text-sm">
              {player.rating.toLocaleString()}
            </span>
          </div>

          {/* Winrate */}
          <div className="col-span-2 text-center">
            <span
              className={cn(
                "font-bold text-sm font-mono",
                player.winRate >= 70 ? "text-green-400" : player.winRate >= 60 ? "text-yellow-400" : "text-gray-400"
              )}
            >
              {player.winRate}%
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function TeamRow({ team, index }: { team: Team; index: number }) {
  const isTop3 = team.rank <= 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/teams/${team.name.toLowerCase().replace(/\s/g, "-")}`}>
        <div
          className={cn(
            "grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-cyber-glass-border hover:bg-cyber-neon/5 transition-all duration-200 group",
            isTop3 && `bg-gradient-to-r ${rankColors[team.rank as 1 | 2 | 3]}`
          )}
        >
          {/* Rank */}
          <div className="col-span-1 flex items-center justify-center gap-1">
            {team.rank === 1 ? (
              <Crown className="w-5 h-5 text-yellow-400" />
            ) : (
              <span className="font-display font-bold text-gray-400 text-sm">{team.rank}</span>
            )}
            <RankChange current={team.rank} prev={team.prevRank} />
          </div>

          {/* Team info */}
          <div className="col-span-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyber-purple-bright to-cyber-neon-blue flex items-center justify-center text-white font-bold text-sm">
              {team.logo}
            </div>
            <div>
              <div className="font-display font-bold text-white text-sm group-hover:text-cyber-neon transition-colors">
                {team.country} {team.name}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500 font-mono">
                <Shield className="w-3 h-3" />
                {team.members} игроков
              </div>
            </div>
          </div>

          {/* Members */}
          <div className="col-span-2 text-center hidden sm:block">
            <span className="text-xs text-gray-400 font-mono">{team.members} / 5</span>
          </div>

          {/* Rating */}
          <div className="col-span-2 text-center">
            <span className="font-display font-bold text-cyber-neon text-sm">
              {team.rating.toLocaleString()}
            </span>
          </div>

          {/* W/L */}
          <div className="col-span-2 text-center">
            <span className="font-bold text-sm font-mono">
              <span className="text-green-400">{team.wins}W</span>
              <span className="text-gray-600"> / </span>
              <span className="text-red-400">{team.losses}L</span>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

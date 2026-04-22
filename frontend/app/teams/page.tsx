"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search, Trophy, Users, TrendingUp } from "lucide-react";
import { useContentStore } from "@/store/contentStore";
import { cn } from "@/lib/utils";

export default function TeamsPage() {
  const { teams } = useContentStore();
  const [search, setSearch] = useState("");

  const filtered = teams
    .filter((t) => t.active)
    .filter((t) => !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.tag.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.rating - a.rating);

  const top3 = filtered.slice(0, 3);
  const rest = filtered.slice(3);

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-cyber-purple/20 to-transparent py-16">
        <div className="absolute inset-0 cyber-grid-bg opacity-20" />
        <div className="max-w-7xl mx-auto px-4 relative text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display font-black text-4xl sm:text-5xl text-white mb-3">Команды</h1>
            <p className="text-gray-400">Лучшие команды СНГ по рейтингу</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top 3 podium */}
        {top3.length >= 3 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-3 gap-4 mb-10">
            {[top3[1], top3[0], top3[2]].map((team, pos) => {
              const rank = top3.indexOf(team) + 1;
              const heights = ["h-48", "h-56", "h-44"];
              return (
                <motion.div key={team.id} whileHover={{ y: -4 }} className={cn("glass-card rounded-2xl overflow-hidden flex flex-col items-center justify-end p-5 relative", heights[pos])}>
                  <div className={cn("absolute top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center font-display font-black text-sm",
                    rank === 1 ? "bg-yellow-500 text-black" : rank === 2 ? "bg-gray-300 text-black" : "bg-amber-700 text-white"
                  )}>
                    {rank}
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyber-purple-bright to-cyber-neon flex items-center justify-center text-white font-bold text-lg mb-2 flex-shrink-0">
                    {team.logo ? <img src={team.logo} className="w-14 h-14 rounded-2xl object-cover" alt="" /> : team.tag}
                  </div>
                  <div className="font-display font-bold text-white text-sm text-center">{team.name}</div>
                  <div className="text-cyber-neon font-mono font-bold text-xs">{team.rating.toLocaleString()} MMR</div>
                  <div className="text-gray-600 text-xs font-mono">{team.country}</div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск команды..."
            className="w-full bg-cyber-purple/20 border border-cyber-glass-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyber-neon/50 font-mono" />
        </motion.div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg">Команды не найдены</p>
            <Link href="/admin/teams" className="text-cyber-neon text-sm mt-2 inline-block hover:underline">Добавить команду →</Link>
          </div>
        ) : (
          <div className="glass-card rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cyber-glass-border">
                  {["#", "Команда", "Тег", "Страна", "Рейтинг", "Победы/Поражения"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs text-gray-500 font-mono uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-cyber-glass-border">
                {filtered.map((team, i) => (
                  <motion.tr key={team.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-gray-500 font-mono text-sm">
                      {i < 3 ? (
                        <span className={cn("w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold inline-flex",
                          i === 0 ? "bg-yellow-500 text-black" : i === 1 ? "bg-gray-300 text-black" : "bg-amber-700 text-white")}>
                          {i + 1}
                        </span>
                      ) : i + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyber-purple-bright to-cyber-neon flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                          {team.logo ? <img src={team.logo} className="w-9 h-9 rounded-xl object-cover" alt="" /> : team.tag}
                        </div>
                        <div>
                          <div className="text-white font-semibold text-sm">{team.name}</div>
                          {team.description && <div className="text-gray-600 text-xs line-clamp-1">{team.description}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-cyber-neon font-mono text-sm font-bold">[{team.tag}]</td>
                    <td className="px-4 py-3 text-2xl">{team.country}</td>
                    <td className="px-4 py-3 text-cyber-neon font-display font-bold">{team.rating.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm font-mono">
                      <span className="text-green-400">{team.wins}W</span>
                      <span className="text-gray-600"> / </span>
                      <span className="text-red-400">{team.losses}L</span>
                      {(team.wins + team.losses) > 0 && (
                        <span className="text-gray-500 ml-2 text-xs">({Math.round(team.wins / (team.wins + team.losses) * 100)}%)</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

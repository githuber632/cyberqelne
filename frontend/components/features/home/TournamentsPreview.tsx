"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Trophy, Calendar, Users, DollarSign, ChevronRight, Clock } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useContentStore, type Tournament } from "@/store/contentStore";
import { cn } from "@/lib/utils";

const statusConfig = {
  registration: { label: "Регистрация", dot: "bg-green-400", badge: "text-green-400 bg-green-500/20 border-green-500/40" },
  active: { label: "Live", dot: "bg-red-400 animate-pulse", badge: "text-red-400 bg-red-500/20 border-red-500/40" },
  upcoming: { label: "Скоро", dot: "bg-yellow-400", badge: "text-yellow-400 bg-yellow-500/20 border-yellow-500/40" },
  finished: { label: "Завершён", dot: "bg-gray-500", badge: "text-gray-500 bg-gray-500/10 border-gray-500/20" },
};

export function TournamentsPreview() {
  const { tournaments } = useContentStore();

  // Показываем featured и registration/active в первую очередь
  const visible = [...tournaments]
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      const order = { active: 0, registration: 1, upcoming: 2, finished: 3 };
      return order[a.status] - order[b.status];
    })
    .slice(0, 4);

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 cyber-grid-bg opacity-20" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Турниры"
          title="Ближайшие турниры"
          subtitle="Регистрируйся и борись за призовые фонды вместе с лучшими командами СНГ"
          link={{ href: "/tournaments", label: "Все турниры" }}
        />

        {visible.length === 0 ? null : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {visible.map((tournament, index) => (
              <TournamentCard key={tournament.id} tournament={tournament} index={index} />
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/tournaments" className="inline-flex items-center gap-2 px-8 py-4 glass-card rounded-xl text-gray-300 hover:text-white hover:border-cyber-neon/40 transition-all duration-300 font-display text-sm uppercase tracking-widest">
            Смотреть все турниры
            <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function TournamentCard({ tournament, index }: { tournament: Tournament; index: number }) {
  const status = statusConfig[tournament.status as keyof typeof statusConfig];
  const registrationPercent = (tournament.teamsRegistered / tournament.maxTeams) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Link href={`/tournaments/${tournament.id}`}>
        <motion.div
          whileHover={{ y: -8, scale: 1.02 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
          className={cn("glass-card rounded-2xl overflow-hidden cursor-pointer group h-full", tournament.featured && "ring-1 ring-cyber-neon/40")}
        >
          <div className="relative h-28 bg-gradient-to-br from-cyber-purple to-cyber-dark overflow-hidden">
            {tournament.banner ? (
              <img src={tournament.banner} className="w-full h-full object-cover absolute inset-0" alt="" />
            ) : (
              <>
                <div className="absolute inset-0 cyber-grid-bg opacity-40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl opacity-30 group-hover:opacity-50 transition-opacity">{tournament.gameIcon}</span>
                </div>
              </>
            )}
            {tournament.featured && (
              <div className="absolute top-3 left-3 flex items-center gap-1 bg-cyber-neon/30 border border-cyber-neon/50 rounded-full px-2 py-0.5">
                <span className="text-cyber-neon text-xs font-bold font-mono">FEATURED</span>
              </div>
            )}
            <div className={cn("absolute top-3 right-3 flex items-center gap-1.5 border rounded-full px-2.5 py-1", status.badge)}>
              <span className={cn("w-1.5 h-1.5 rounded-full", status.dot)} />
              <span className="text-xs font-bold font-mono">{status.label}</span>
            </div>
          </div>

          <div className="p-5">
            <h3 className="font-display font-bold text-base text-white mb-1 group-hover:text-cyber-neon transition-colors leading-tight">{tournament.title}</h3>
            <p className="text-xs text-gray-500 font-mono mb-4">{tournament.game} • {tournament.format}</p>

            <div className="space-y-2.5 mb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-gray-500"><DollarSign className="w-3.5 h-3.5" />Призовой</span>
                <span className="text-cyber-neon font-bold font-mono">{tournament.prizePool} UZS</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-gray-500"><Calendar className="w-3.5 h-3.5" />Начало</span>
                <span className="text-gray-300 font-mono">{tournament.startDate}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-gray-500"><Clock className="w-3.5 h-3.5" />Взнос</span>
                <span className="text-gray-300 font-mono">{tournament.entryFee}</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="flex items-center gap-1 text-gray-500"><Users className="w-3.5 h-3.5" />Команды</span>
                <span className="text-gray-300 font-mono">{tournament.teamsRegistered}/{tournament.maxTeams}</span>
              </div>
              <div className="h-1.5 bg-cyber-purple-mid rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${registrationPercent}%` }}
                  transition={{ duration: 1 }}
                  viewport={{ once: true }}
                  className={cn("h-full rounded-full", registrationPercent >= 100 ? "bg-red-500" : "bg-gradient-to-r from-cyber-purple-bright to-cyber-neon")}
                />
              </div>
            </div>

            <div className={cn(
              "w-full text-center py-2.5 rounded-xl text-xs font-display font-semibold uppercase tracking-wider transition-all duration-300",
              tournament.status === "registration" ? "bg-gradient-to-r from-cyber-purple-bright to-cyber-neon text-white group-hover:shadow-neon" :
              tournament.status === "active" ? "bg-red-500/20 border border-red-500/40 text-red-400" :
              "bg-cyber-purple/20 border border-cyber-glass-border text-gray-400"
            )}>
              {tournament.status === "registration" ? "Зарегистрироваться" :
               tournament.status === "active" ? "Смотреть Live" :
               tournament.status === "upcoming" ? "Подробнее" : "Архив"}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

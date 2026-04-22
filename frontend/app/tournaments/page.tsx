"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Trophy, Search, Users, DollarSign,
  Calendar, Clock, ChevronRight, Zap, X,
  Gamepad2, CheckCircle, Loader2, Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useContentStore, Tournament } from "@/store/contentStore";
import { useAuthStore } from "@/store/authStore";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

type FilterStatus = "all" | "registration" | "active" | "upcoming" | "finished";

const statusConfig = {
  registration: { label: "Регистрация", dot: "bg-green-400", badge: "text-green-400 bg-green-500/20 border-green-500/40" },
  active: { label: "Live", dot: "bg-red-400 animate-pulse", badge: "text-red-400 bg-red-500/20 border-red-500/40" },
  upcoming: { label: "Скоро", dot: "bg-yellow-400", badge: "text-yellow-400 bg-yellow-500/20 border-yellow-500/40" },
  finished: { label: "Завершён", dot: "bg-gray-500", badge: "text-gray-500 bg-gray-500/10 border-gray-500/20" },
};

const GAMES = [
  { id: "MLBB", label: "Mobile Legends", icon: "🎮", color: "from-purple-600 to-purple-800" },
  { id: "PUBG", label: "PUBG Mobile", icon: "🔫", color: "from-yellow-600 to-yellow-800" },
  { id: "HOK", label: "Honor of Kings", icon: "⚔️", color: "from-cyan-600 to-cyan-800" },
];

interface AppForm {
  game: string;
  teamName: string;
  inGameId: string;
  nickname: string;
  telegram: string;
}

function RegisterModal({ tournament, onClose }: { tournament: Tournament; onClose: () => void }) {
  const { user } = useAuthStore();
  const [form, setForm] = useState<AppForm>({
    game: tournament.game && GAMES.find((g) => g.id === tournament.game) ? tournament.game : GAMES[0].id,
    teamName: "",
    inGameId: "",
    nickname: user?.nickname || "",
    telegram: "",
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function setF<K extends keyof AppForm>(k: K, v: AppForm[K]) { setForm((f) => ({ ...f, [k]: v })); }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.teamName.trim() || !form.inGameId.trim() || !form.nickname.trim() || !form.telegram.trim()) return;
    setLoading(true);
    try {
      await addDoc(collection(db, "tournament_applications"), {
        tournamentId: tournament.id,
        tournamentTitle: tournament.title,
        game: form.game,
        teamName: form.teamName.trim(),
        inGameId: form.inGameId.trim(),
        nickname: form.nickname.trim(),
        telegram: form.telegram.trim().replace(/^@/, ""),
        userId: user?.id || null,
        userEmail: user?.email || null,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setDone(true);
    } catch (e) { console.warn(e); }
    finally { setLoading(false); }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.93 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        className="w-full max-w-lg bg-[#0d0d14] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-gradient-to-r from-cyber-purple/20 to-transparent">
          <div>
            <p className="text-gray-500 text-xs font-mono uppercase tracking-wider mb-0.5">Подача заявки</p>
            <h2 className="font-display font-bold text-white text-lg leading-tight line-clamp-1">{tournament.title}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {done ? (
          <div className="px-6 py-12 text-center">
            <CheckCircle className="w-14 h-14 text-green-400 mx-auto mb-4" />
            <h3 className="font-display font-bold text-2xl text-white mb-2">Заявка принята!</h3>
            <p className="text-gray-400 text-sm mb-1">Мы свяжемся с тобой в Telegram</p>
            <p className="text-cyber-neon font-mono text-sm font-bold">@{form.telegram}</p>
            <button onClick={onClose} className="mt-6 px-6 py-2.5 glass-card rounded-xl text-gray-400 hover:text-white text-sm transition-colors">
              Закрыть
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="p-6 space-y-5">
            {/* Game selection */}
            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2.5">Игра</label>
              <div className="grid grid-cols-3 gap-2">
                {GAMES.map((g) => (
                  <button key={g.id} type="button" onClick={() => setF("game", g.id)}
                    className={cn(
                      "relative py-3 rounded-xl border transition-all text-center group",
                      form.game === g.id
                        ? "border-cyber-neon/60 bg-cyber-neon/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    )}>
                    <div className="text-2xl mb-1">{g.icon}</div>
                    <div className={cn("text-xs font-mono font-bold", form.game === g.id ? "text-cyber-neon" : "text-gray-400")}>{g.id}</div>
                    <div className={cn("text-[10px] text-gray-600 leading-tight px-1", form.game === g.id && "text-gray-400")}>{g.label}</div>
                    {form.game === g.id && (
                      <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyber-neon" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Fields */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                  Название команды <span className="text-red-400">*</span>
                </label>
                <input required value={form.teamName} onChange={(e) => setF("teamName", e.target.value)}
                  placeholder="Например: Phantom Squad"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyber-neon/50 text-sm font-mono" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                    ID в игре <span className="text-red-400">*</span>
                  </label>
                  <input required value={form.inGameId} onChange={(e) => setF("inGameId", e.target.value)}
                    placeholder="123456789"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyber-neon/50 text-sm font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                    Ник в игре <span className="text-red-400">*</span>
                  </label>
                  <input required value={form.nickname} onChange={(e) => setF("nickname", e.target.value)}
                    placeholder="PhantomX"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyber-neon/50 text-sm font-mono" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                  Telegram <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-sm">@</span>
                  <input required value={form.telegram} onChange={(e) => setF("telegram", e.target.value.replace(/^@/, ""))}
                    placeholder="username"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyber-neon/50 text-sm font-mono" />
                </div>
                <p className="text-gray-600 text-xs font-mono mt-1">Мы свяжемся с тобой для подтверждения</p>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-cyber-purple-bright to-cyber-neon text-white font-display font-bold rounded-xl hover:shadow-neon transition-all disabled:opacity-50">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {loading ? "Отправка..." : "Подать заявку"}
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function TournamentsPage() {
  const { tournaments } = useContentStore();
  const { user } = useAuthStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [gameFilter, setGameFilter] = useState("all");
  const [registering, setRegistering] = useState<Tournament | null>(null);

  const games = ["all", ...Array.from(new Set(tournaments.map((t) => t.game)))];

  const filtered = tournaments.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    const matchesGame = gameFilter === "all" || t.game === gameFilter;
    return matchesSearch && matchesStatus && matchesGame;
  });

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Page header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-cyber-purple/20 to-transparent py-16">
        <div className="absolute inset-0 cyber-grid-bg opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-cyber-neon" />
              <span className="text-cyber-neon font-mono text-xs font-bold uppercase tracking-widest">Киберспорт</span>
              <div className="w-8 h-px bg-gradient-to-l from-transparent to-cyber-neon" />
            </div>
            <h1 className="font-display font-black text-4xl sm:text-5xl text-white mb-4">Турниры</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Участвуй в официальных турнирах CyberQELN и борись за призовые фонды вместе с лучшими командами СНГ
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-4 mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input type="text" placeholder="Поиск турниров..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-cyber-purple/20 border border-cyber-glass-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyber-neon/50 transition-colors font-mono" />
          </div>

          <div className="flex gap-1 flex-wrap">
            {(["all", "registration", "active", "upcoming", "finished"] as FilterStatus[]).map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={cn("px-3 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all",
                  statusFilter === s ? "bg-cyber-neon/20 text-cyber-neon border border-cyber-neon/40" : "text-gray-500 hover:text-white hover:bg-white/5 border border-transparent")}>
                {s === "all" ? "Все" : statusConfig[s]?.label || s}
              </button>
            ))}
          </div>

          <select value={gameFilter} onChange={(e) => setGameFilter(e.target.value)}
            className="bg-cyber-purple/20 border border-cyber-glass-border rounded-xl px-3 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-cyber-neon/50 font-mono cursor-pointer">
            {games.map((g) => <option key={g} value={g}>{g === "all" ? "Все игры" : g}</option>)}
          </select>
        </motion.div>

        {/* Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500 text-sm font-mono">
            Найдено: <span className="text-white font-bold">{filtered.length}</span> турниров
          </p>
          {user?.role === "admin" && (
            <Link href="/admin/tournaments"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyber-purple-bright to-cyber-neon text-white text-sm font-semibold rounded-xl hover:shadow-neon transition-all duration-300">
              <Zap className="w-4 h-4" />
              Организовать турнир
            </Link>
          )}
        </div>

        {/* Tournament grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} onRegister={setRegistering} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Trophy className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Турниры не найдены</p>
            <p className="text-gray-700 text-sm mt-1">Следи за анонсами — скоро откроются новые турниры</p>
          </div>
        )}
      </div>

      {/* Registration modal */}
      <AnimatePresence>
        {registering && <RegisterModal tournament={registering} onClose={() => setRegistering(null)} />}
      </AnimatePresence>
    </div>
  );
}

function TournamentCard({ tournament, onRegister }: { tournament: Tournament; onRegister: (t: Tournament) => void }) {
  const status = statusConfig[tournament.status];
  const regPercent = (tournament.teamsRegistered / tournament.maxTeams) * 100;

  const canRegister = tournament.status === "registration" || tournament.status === "upcoming";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl overflow-hidden flex flex-col hover:-translate-y-1 transition-transform duration-200"
    >
      {/* Banner */}
      <Link href={`/tournaments/${tournament.id}`} className="block">
        <div className="relative h-32 bg-gradient-to-br from-cyber-purple to-cyber-dark overflow-hidden group">
          {tournament.banner ? (
            <img src={tournament.banner} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
          ) : (
            <>
              <div className="absolute inset-0 cyber-grid-bg opacity-30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl opacity-20">{tournament.gameIcon}</span>
              </div>
            </>
          )}
          <div className={cn("absolute top-3 right-3 flex items-center gap-1.5 border rounded-full px-2.5 py-1", status.badge)}>
            <span className={cn("w-1.5 h-1.5 rounded-full", status.dot)} />
            <span className="text-xs font-bold font-mono">{status.label}</span>
          </div>
          {tournament.featured && (
            <div className="absolute top-3 left-3 text-xs text-cyber-neon font-mono bg-cyber-neon/10 border border-cyber-neon/30 rounded-full px-2 py-0.5">⭐ Featured</div>
          )}
          <div className="absolute bottom-3 left-3">
            <span className="text-xs text-gray-500 font-mono bg-black/40 backdrop-blur-sm rounded px-2 py-0.5">by {tournament.organizer}</span>
          </div>
        </div>
      </Link>

      <div className="p-5 flex-1 flex flex-col">
        <Link href={`/tournaments/${tournament.id}`}>
          <h3 className="font-display font-bold text-base text-white hover:text-cyber-neon transition-colors leading-tight mb-1">
            {tournament.title}
          </h3>
        </Link>
        <p className="text-xs text-gray-500 font-mono mb-4">{tournament.game} • {tournament.format}</p>

        <div className="space-y-2.5 mb-4 flex-1">
          <div className="flex justify-between text-xs">
            <span className="flex items-center gap-1 text-gray-500"><DollarSign className="w-3.5 h-3.5" />Приз</span>
            <span className="text-cyber-neon font-bold font-mono">{tournament.prizePool} UZS</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="flex items-center gap-1 text-gray-500"><Calendar className="w-3.5 h-3.5" />Дата</span>
            <span className="text-gray-300 font-mono">{tournament.startDate}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="flex items-center gap-1 text-gray-500"><Clock className="w-3.5 h-3.5" />Взнос</span>
            <span className="text-gray-300 font-mono">{tournament.entryFee}</span>
          </div>
        </div>

        {/* Teams progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="flex items-center gap-1 text-gray-500"><Users className="w-3.5 h-3.5" />Команды</span>
            <span className="text-gray-300 font-mono">{tournament.teamsRegistered}/{tournament.maxTeams}</span>
          </div>
          <div className="h-1.5 bg-cyber-purple-mid rounded-full overflow-hidden">
            <div style={{ width: `${regPercent}%` }}
              className={cn("h-full rounded-full transition-all duration-700", regPercent >= 100 ? "bg-red-500" : "bg-gradient-to-r from-cyber-purple-bright to-cyber-neon")} />
          </div>
        </div>

        {/* Action button */}
        {canRegister ? (
          <button
            onClick={() => onRegister(tournament)}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-display font-semibold uppercase tracking-wider bg-gradient-to-r from-cyber-purple-bright to-cyber-neon text-white hover:shadow-neon transition-all duration-300"
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            Участвовать
          </button>
        ) : (
          <Link href={`/tournaments/${tournament.id}`}>
            <div className={cn(
              "flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-display font-semibold uppercase tracking-wider transition-all duration-300",
              tournament.status === "active" ? "bg-red-500/20 border border-red-500/40 text-red-400" :
              "bg-cyber-purple/20 border border-cyber-glass-border text-gray-400"
            )}>
              {tournament.status === "active" ? "Смотреть Live" :
               tournament.status === "upcoming" ? "Подробнее" : "Архив"}
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        )}
      </div>
    </motion.div>
  );
}

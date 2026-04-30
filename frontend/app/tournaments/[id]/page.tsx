"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  ArrowLeft, Trophy, Users, DollarSign, Calendar, Clock, Shield,
  X, Phone, User, Hash, Plus, Minus, Send, CheckCircle,
} from "lucide-react";
import { useContentStore } from "@/store/contentStore";
import { useAuthStore } from "@/store/authStore";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp, getDocs, query, where } from "firebase/firestore";
import { cn } from "@/lib/utils";

type AppStatus = "pending" | "approved" | "rejected" | null;

const statusConfig = {
  registration: { label: "Регистрация открыта", dot: "bg-green-400", badge: "text-green-400 bg-green-500/20 border-green-500/40" },
  active: { label: "LIVE", dot: "bg-red-400 animate-pulse", badge: "text-red-400 bg-red-500/20 border-red-500/40" },
  upcoming: { label: "Скоро", dot: "bg-yellow-400", badge: "text-yellow-400 bg-yellow-500/20 border-yellow-500/40" },
  finished: { label: "Завершён", dot: "bg-gray-500", badge: "text-gray-500 bg-gray-500/10 border-gray-500/20" },
};

interface PlayerField { gameId: string; nickname: string; }

export default function TournamentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { tournaments } = useContentStore();
  const { isAuthenticated, user } = useAuthStore();
  const tournament = tournaments.find((t) => t.id === id);

  const [modal, setModal] = useState(false);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [teamSize, setTeamSize] = useState(5);
  const [appStatus, setAppStatus] = useState<AppStatus>(null);

  useEffect(() => {
    if (!user || !id) return;
    getDocs(query(collection(db, "tournament_applications"), where("captainId", "==", user.id), where("tournamentId", "==", id)))
      .then((snap) => {
        if (!snap.empty) setAppStatus(snap.docs[0].data().status as AppStatus);
      })
      .catch(() => {});
  }, [user, id]);
  const [captainPhone, setCaptainPhone] = useState("");
  const [players, setPlayers] = useState<PlayerField[]>(
    Array.from({ length: 5 }, () => ({ gameId: "", nickname: "" }))
  );

  function handleSizeChange(size: number) {
    setTeamSize(size);
    setPlayers((prev) => {
      const next = [...prev];
      while (next.length < size) next.push({ gameId: "", nickname: "" });
      return next.slice(0, size);
    });
  }

  function updatePlayer(idx: number, field: keyof PlayerField, value: string) {
    setPlayers((prev) => prev.map((p, i) => i === idx ? { ...p, [field]: value } : p));
  }

  async function submitApplication() {
    if (!user || !captainPhone.trim()) return;
    const allFilled = players.every((p) => p.gameId.trim() && p.nickname.trim());
    if (!allFilled) return;
    setLoading(true);
    try {
      await addDoc(collection(db, "tournament_applications"), {
        tournamentId: id,
        tournamentTitle: tournament?.title || "",
        captainId: user.id,
        captainNickname: user.nickname,
        captainEmail: user.email,
        captainPhone: captainPhone.trim(),
        teamSize,
        players,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setDone(true);
      setAppStatus("pending");
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  }

  function closeModal() {
    setModal(false);
    setDone(false);
    setCaptainPhone("");
    setTeamSize(5);
    setPlayers(Array.from({ length: 5 }, () => ({ gameId: "", nickname: "" })));
  }

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
          <div className="lg:col-span-2 space-y-6">
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

            {tournament.description && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card rounded-2xl p-6">
                <h2 className="font-display font-bold text-white mb-3">О турнире</h2>
                <p className="text-gray-400 leading-relaxed">{tournament.description}</p>
              </motion.div>
            )}

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
            {tournament.status === "registration" && (
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-display font-bold text-white mb-4">Участие</h3>
                {!isAuthenticated ? (
                  <div className="space-y-3">
                    <p className="text-gray-400 text-sm text-center">Войди чтобы зарегистрироваться</p>
                    <Link href="/auth/login" className="block w-full py-3.5 text-center bg-gradient-to-r from-cyber-purple-bright to-cyber-neon text-white font-display font-bold rounded-xl hover:shadow-neon transition-all">Войти</Link>
                    <Link href="/auth/register" className="block w-full py-3 text-center glass-card rounded-xl text-gray-300 hover:text-white text-sm">Создать аккаунт</Link>
                  </div>
                ) : appStatus === "pending" ? (
                  <div className="w-full py-3.5 flex items-center justify-center gap-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-display font-bold rounded-xl text-sm">
                    <Clock className="w-4 h-4" />На рассмотрении
                  </div>
                ) : appStatus === "approved" ? (
                  <div className="w-full py-3.5 flex items-center justify-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 font-display font-bold rounded-xl text-sm">
                    <CheckCircle className="w-4 h-4" />Заявка принята!
                  </div>
                ) : (
                  <button onClick={() => setModal(true)}
                    className="w-full py-3.5 bg-gradient-to-r from-cyber-purple-bright to-cyber-neon text-white font-display font-bold rounded-xl hover:shadow-neon transition-all">
                    Подать заявку
                  </button>
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
                <button className="w-full py-3 bg-red-500/20 border border-red-500/40 text-red-400 font-display font-bold rounded-xl hover:bg-red-500/30 transition-all text-sm">Смотреть трансляцию</button>
              </div>
            )}

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

      {/* Registration modal */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && closeModal()}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="glass-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

              {done ? (
                <div className="p-10 text-center">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="font-display font-black text-2xl text-white mb-2">Заявка отправлена!</h3>
                  <p className="text-gray-400 mb-6">Администратор рассмотрит вашу заявку и свяжется с вами.</p>
                  <button onClick={closeModal}
                    className="px-6 py-3 bg-gradient-to-r from-cyber-purple-bright to-cyber-neon text-white font-display font-bold rounded-xl hover:shadow-neon transition-all">
                    Закрыть
                  </button>
                </div>
              ) : (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-display font-black text-xl text-white">Заявка на турнир</h3>
                      <p className="text-gray-500 text-sm font-mono mt-0.5">{tournament.title}</p>
                    </div>
                    <button onClick={closeModal} className="text-gray-500 hover:text-white transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Team size selector */}
                  <div className="mb-6">
                    <label className="block text-xs font-mono text-gray-500 uppercase mb-3">Количество игроков в команде</label>
                    <div className="flex gap-2">
                      {[5, 6, 7].map((n) => (
                        <button key={n} onClick={() => handleSizeChange(n)}
                          className={cn(
                            "flex-1 py-3 rounded-xl font-display font-bold text-lg transition-all",
                            teamSize === n
                              ? "bg-gradient-to-r from-cyber-purple-bright to-cyber-neon text-white shadow-neon"
                              : "glass-card text-gray-400 hover:text-white"
                          )}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Players */}
                  <div className="mb-6">
                    <label className="block text-xs font-mono text-gray-500 uppercase mb-3">
                      Игроки <span className="text-cyber-neon">(Игрок 1 — капитан)</span>
                    </label>
                    <div className="space-y-3">
                      {players.map((p, i) => (
                        <div key={i} className="flex gap-3 items-start">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1",
                            i === 0 ? "bg-yellow-500/20 border border-yellow-500/40 text-yellow-400" : "bg-cyber-purple/20 border border-cyber-glass-border text-gray-400"
                          )}>
                            {i + 1}
                          </div>
                          <div className="flex-1 grid grid-cols-2 gap-2">
                            <div className="relative">
                              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
                              <input
                                value={p.gameId}
                                onChange={(e) => updatePlayer(i, "gameId", e.target.value)}
                                placeholder="ID в игре"
                                className="w-full pl-8 pr-3 py-2.5 bg-cyber-purple/20 border border-cyber-glass-border rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyber-neon/50 font-mono"
                              />
                            </div>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
                              <input
                                value={p.nickname}
                                onChange={(e) => updatePlayer(i, "nickname", e.target.value)}
                                placeholder="Никнейм"
                                className="w-full pl-8 pr-3 py-2.5 bg-cyber-purple/20 border border-cyber-glass-border rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyber-neon/50 font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Captain phone */}
                  <div className="mb-6">
                    <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Телефон капитана</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                      <input
                        value={captainPhone}
                        onChange={(e) => setCaptainPhone(e.target.value)}
                        placeholder="+998 90 123 45 67"
                        className="w-full pl-10 pr-4 py-3 bg-cyber-purple/20 border border-cyber-glass-border rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-cyber-neon/50 font-mono"
                      />
                    </div>
                  </div>

                  {/* Captain info (read-only) */}
                  <div className="mb-6 p-4 bg-cyber-purple/10 border border-cyber-glass-border rounded-xl">
                    <p className="text-xs font-mono text-gray-500 uppercase mb-2">Капитан (ваш аккаунт)</p>
                    <p className="text-white text-sm font-semibold">{user?.nickname}</p>
                    <p className="text-gray-500 text-xs font-mono">{user?.email}</p>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={closeModal}
                      className="flex-1 py-3 glass-card rounded-xl text-gray-400 hover:text-white text-sm transition-all">
                      Отмена
                    </button>
                    <button
                      onClick={submitApplication}
                      disabled={loading || !captainPhone.trim() || !players.every((p) => p.gameId.trim() && p.nickname.trim())}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyber-purple-bright to-cyber-neon text-white font-display font-bold rounded-xl hover:shadow-neon transition-all disabled:opacity-40">
                      <Send className="w-4 h-4" />
                      {loading ? "Отправка..." : "Отправить заявку"}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

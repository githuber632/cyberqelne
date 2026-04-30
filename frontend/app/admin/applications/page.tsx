"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ClipboardList, RefreshCw, CheckCircle, XCircle, Clock, Phone, User, Hash, Trophy, ChevronDown, ChevronUp } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, addDoc, orderBy, query, increment, serverTimestamp } from "firebase/firestore";
import { cn } from "@/lib/utils";

interface Player { gameId: string; nickname: string; }

interface Application {
  id: string;
  tournamentId: string;
  tournamentTitle: string;
  captainId: string;
  captainNickname: string;
  captainEmail: string;
  captainPhone: string;
  teamSize: number;
  players: Player[];
  status: "pending" | "approved" | "rejected";
  createdAt?: { seconds: number };
  adminNote?: string;
}

const STATUS_STYLE = {
  pending:  { label: "Ожидает",   cls: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30" },
  approved: { label: "Принята",   cls: "text-green-400 bg-green-500/10 border-green-500/30" },
  rejected: { label: "Отклонена", cls: "text-red-400 bg-red-500/10 border-red-500/30" },
};

export default function ApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  async function load() {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, "tournament_applications"), orderBy("createdAt", "desc")));
      setApps(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Application)));
    } catch (e) { console.warn(e); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function setStatus(id: string, status: "approved" | "rejected") {
    setActionLoading(id + status);
    const app = apps.find((a) => a.id === id);
    if (!app) return;
    try {
      await updateDoc(doc(db, "tournament_applications", id), { status });

      if (status === "approved") {
        // Увеличиваем счётчик занятых мест в турнире
        await updateDoc(doc(db, "tournaments", app.tournamentId), {
          teamsRegistered: increment(1),
        });
        // Уведомление пользователю
        await addDoc(collection(db, "broadcasts"), {
          title: "Заявка принята! 🎉",
          message: `Ваша заявка на турнир «${app.tournamentTitle}» принята. Ждём вас на старте!`,
          fromName: "Организатор",
          fromRole: "admin",
          to: app.captainId,
          readBy: [],
          type: "application_approved",
          createdAt: serverTimestamp(),
        });
      } else if (status === "rejected") {
        // Если ранее была принята — освобождаем место
        if (app.status === "approved") {
          await updateDoc(doc(db, "tournaments", app.tournamentId), {
            teamsRegistered: increment(-1),
          });
        }
        // Уведомление об отклонении
        await addDoc(collection(db, "broadcasts"), {
          title: "Заявка отклонена",
          message: `К сожалению, ваша заявка на турнир «${app.tournamentTitle}» была отклонена.`,
          fromName: "Организатор",
          fromRole: "admin",
          to: app.captainId,
          readBy: [],
          type: "application_rejected",
          createdAt: serverTimestamp(),
        });
      }

      setApps((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
    } catch (e) { console.warn(e); }
    finally { setActionLoading(null); }
  }

  const filtered = filter === "all" ? apps : apps.filter((a) => a.status === filter);

  function formatDate(ts?: { seconds: number }) {
    if (!ts) return "—";
    return new Date(ts.seconds * 1000).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" });
  }

  const counts = {
    all: apps.length,
    pending: apps.filter((a) => a.status === "pending").length,
    approved: apps.filter((a) => a.status === "approved").length,
    rejected: apps.filter((a) => a.status === "rejected").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-2xl text-white">Заявки на турниры</h1>
          <p className="text-gray-500 text-sm mt-1">{apps.length} заявок всего</p>
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 glass-card rounded-xl text-gray-400 hover:text-white text-sm transition-all disabled:opacity-50">
          <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          Обновить
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "pending", "approved", "rejected"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-mono transition-all",
              filter === f ? "bg-cyber-neon/20 border border-cyber-neon/40 text-cyber-neon" : "glass-card text-gray-500 hover:text-white"
            )}>
            {f === "all" ? "Все" : STATUS_STYLE[f].label} ({counts[f]})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card rounded-2xl py-16 text-center text-gray-600">
          <ClipboardList className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="font-mono text-sm">{loading ? "Загрузка..." : "Нет заявок"}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app, i) => (
            <motion.div key={app.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="glass-card rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-4 p-4 cursor-pointer" onClick={() => setExpanded(expanded === app.id ? null : app.id)}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-display font-bold text-white">{app.captainNickname}</span>
                    <span className={cn("text-xs font-mono px-2 py-0.5 rounded-full border", STATUS_STYLE[app.status].cls)}>
                      {STATUS_STYLE[app.status].label}
                    </span>
                    <span className="text-xs font-mono text-gray-500 flex items-center gap-1">
                      <Trophy className="w-3 h-3" />{app.tournamentTitle}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 font-mono flex-wrap">
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{app.captainPhone}</span>
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{app.teamSize} игроков</span>
                    <span>{formatDate(app.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {app.status === "pending" && (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); setStatus(app.id, "approved"); }}
                        disabled={!!actionLoading}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 rounded-lg text-xs font-mono transition-all disabled:opacity-40">
                        <CheckCircle className="w-3.5 h-3.5" />Принять
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setStatus(app.id, "rejected"); }}
                        disabled={!!actionLoading}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 rounded-lg text-xs font-mono transition-all disabled:opacity-40">
                        <XCircle className="w-3.5 h-3.5" />Отклонить
                      </button>
                    </>
                  )}
                  {expanded === app.id ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </div>
              </div>

              {/* Expanded details */}
              {expanded === app.id && (
                <div className="border-t border-cyber-glass-border p-4 bg-cyber-purple/5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Captain info */}
                    <div>
                      <p className="text-xs font-mono text-gray-500 uppercase mb-3">Капитан</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex gap-2"><span className="text-gray-500 w-20">Ник:</span><span className="text-white font-mono">{app.captainNickname}</span></div>
                        <div className="flex gap-2"><span className="text-gray-500 w-20">Email:</span><span className="text-white font-mono">{app.captainEmail}</span></div>
                        <div className="flex gap-2"><span className="text-gray-500 w-20">Телефон:</span><span className="text-cyber-neon font-mono font-bold">{app.captainPhone}</span></div>
                      </div>
                    </div>
                    {/* Players list */}
                    <div>
                      <p className="text-xs font-mono text-gray-500 uppercase mb-3">Состав команды ({app.teamSize} чел.)</p>
                      <div className="space-y-2">
                        {app.players?.map((p, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-sm">
                            <span className={cn("w-6 h-6 rounded flex items-center justify-center text-xs font-bold",
                              idx === 0 ? "bg-yellow-500/20 text-yellow-400" : "bg-cyber-purple/20 text-gray-500")}>
                              {idx + 1}
                            </span>
                            <span className="text-gray-400 font-mono flex items-center gap-1"><Hash className="w-3 h-3" />{p.gameId}</span>
                            <span className="text-white font-mono">{p.nickname}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

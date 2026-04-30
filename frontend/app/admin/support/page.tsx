"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeadphonesIcon, RefreshCw, MessageSquare, Send, X, CheckCircle, ChevronDown, ChevronUp, Image as ImageIcon } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, addDoc, orderBy, query, serverTimestamp } from "firebase/firestore";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

interface SupportTicket {
  id: string;
  userId: string;
  userNickname: string;
  userEmail: string;
  subject: string;
  message: string;
  screenshotUrl?: string;
  status: "open" | "answered" | "closed";
  createdAt?: { seconds: number };
  adminReply?: string;
}

const STATUS_STYLE = {
  open:     { label: "Открыт",  cls: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30" },
  answered: { label: "Отвечен", cls: "text-green-400 bg-green-500/10 border-green-500/30" },
  closed:   { label: "Закрыт",  cls: "text-gray-400 bg-gray-500/10 border-gray-500/30" },
};

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "open" | "answered" | "closed">("all");
  const { user } = useAuthStore();

  async function load() {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, "support_tickets"), orderBy("createdAt", "desc")));
      setTickets(snap.docs.map((d) => ({ id: d.id, ...d.data() } as SupportTicket)));
    } catch (e) { console.warn(e); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function sendReply(ticket: SupportTicket) {
    const text = replyText[ticket.id]?.trim();
    if (!text) return;
    setActionLoading(ticket.id);
    try {
      await updateDoc(doc(db, "support_tickets", ticket.id), {
        adminReply: text,
        status: "answered",
        repliedAt: serverTimestamp(),
        repliedBy: user?.nickname || "Admin",
      });
      // Отправляем уведомление пользователю с кнопкой "Посмотреть"
      await addDoc(collection(db, "broadcasts"), {
        title: `Ответ на обращение: ${ticket.subject}`,
        message: text,
        fromName: user?.nickname || "Поддержка",
        fromRole: user?.role || "admin",
        to: ticket.userId,
        readBy: [],
        type: "support_reply",
        link: "/dashboard?tab=support",
        createdAt: serverTimestamp(),
      });
      setTickets((prev) => prev.map((t) => t.id === ticket.id ? { ...t, adminReply: text, status: "answered" } : t));
      setReplyText((prev) => ({ ...prev, [ticket.id]: "" }));
    } catch (e) { console.warn(e); }
    finally { setActionLoading(null); }
  }

  async function closeTicket(id: string) {
    try {
      await updateDoc(doc(db, "support_tickets", id), { status: "closed" });
      setTickets((prev) => prev.map((t) => t.id === id ? { ...t, status: "closed" } : t));
    } catch (e) { console.warn(e); }
  }

  const filtered = filter === "all" ? tickets : tickets.filter((t) => t.status === filter);

  const counts = {
    all: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    answered: tickets.filter((t) => t.status === "answered").length,
    closed: tickets.filter((t) => t.status === "closed").length,
  };

  function formatDate(ts?: { seconds: number }) {
    if (!ts) return "—";
    return new Date(ts.seconds * 1000).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-2xl text-white">Поддержка</h1>
          <p className="text-gray-500 text-sm mt-1">{counts.open} открытых обращений</p>
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 glass-card rounded-xl text-gray-400 hover:text-white text-sm transition-all disabled:opacity-50">
          <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          Обновить
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(["all", "open", "answered", "closed"] as const).map((f) => (
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
          <HeadphonesIcon className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="font-mono text-sm">{loading ? "Загрузка..." : "Нет обращений"}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((ticket, i) => (
            <motion.div key={ticket.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="glass-card rounded-2xl overflow-hidden">
              <div className="flex items-center gap-4 p-4 cursor-pointer" onClick={() => setExpanded(expanded === ticket.id ? null : ticket.id)}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-display font-bold text-white">{ticket.subject}</span>
                    <span className={cn("text-xs font-mono px-2 py-0.5 rounded-full border", STATUS_STYLE[ticket.status].cls)}>
                      {STATUS_STYLE[ticket.status].label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 font-mono">
                    <span>{ticket.userNickname} · {ticket.userEmail}</span>
                    <span>{formatDate(ticket.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {ticket.status !== "closed" && (
                    <button onClick={(e) => { e.stopPropagation(); closeTicket(ticket.id); }}
                      className="px-3 py-1.5 glass-card text-gray-500 hover:text-white rounded-lg text-xs font-mono transition-all">
                      Закрыть
                    </button>
                  )}
                  {expanded === ticket.id ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </div>
              </div>

              {expanded === ticket.id && (
                <div className="border-t border-cyber-glass-border p-4 space-y-4 bg-cyber-purple/5">
                  {/* User message */}
                  <div>
                    <p className="text-xs font-mono text-gray-500 uppercase mb-2">Сообщение пользователя</p>
                    <p className="text-gray-300 text-sm leading-relaxed bg-cyber-purple/10 rounded-xl p-4">{ticket.message}</p>
                  </div>

                  {/* Screenshot */}
                  {ticket.screenshotUrl && (
                    <div>
                      <p className="text-xs font-mono text-gray-500 uppercase mb-2 flex items-center gap-1.5">
                        <ImageIcon className="w-3 h-3" />Скриншот
                      </p>
                      <img src={ticket.screenshotUrl} alt="screenshot"
                        className="max-w-sm rounded-xl border border-cyber-glass-border cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(ticket.screenshotUrl, "_blank")} />
                    </div>
                  )}

                  {/* Admin reply */}
                  {ticket.adminReply && (
                    <div>
                      <p className="text-xs font-mono text-green-500 uppercase mb-2">Ответ администратора</p>
                      <p className="text-green-300 text-sm leading-relaxed bg-green-500/5 border border-green-500/20 rounded-xl p-4">{ticket.adminReply}</p>
                    </div>
                  )}

                  {/* Reply input */}
                  {ticket.status !== "closed" && (
                    <div>
                      <p className="text-xs font-mono text-gray-500 uppercase mb-2">
                        {ticket.adminReply ? "Обновить ответ" : "Ответить"}
                      </p>
                      <textarea
                        value={replyText[ticket.id] || ""}
                        onChange={(e) => setReplyText((prev) => ({ ...prev, [ticket.id]: e.target.value }))}
                        placeholder="Напиши ответ пользователю..."
                        rows={3}
                        className="w-full bg-cyber-purple/20 border border-cyber-glass-border rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyber-neon/50 resize-none"
                      />
                      <button
                        onClick={() => sendReply(ticket)}
                        disabled={!replyText[ticket.id]?.trim() || actionLoading === ticket.id}
                        className="mt-2 flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyber-purple-bright to-cyber-neon text-white font-semibold rounded-xl text-sm hover:shadow-neon transition-all disabled:opacity-40">
                        <Send className="w-4 h-4" />
                        {actionLoading === ticket.id ? "Отправка..." : "Отправить ответ"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

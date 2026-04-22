"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Megaphone, Send, Users, User, CheckCircle, Loader2, Search, ChevronDown } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { useAuthStore } from "@/store/authStore";
import { ROLE_COLORS } from "@/lib/roles";
import { cn } from "@/lib/utils";

type Target = "all" | "uid";

interface FbUser { uid: string; name: string; email: string; role: string; }

export default function AdminBroadcastPage() {
  const { user } = useAuthStore();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState<Target>("all");
  const [selectedUser, setSelectedUser] = useState<FbUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [history, setHistory] = useState<{ title: string; to: string; at: string }[]>([]);

  const [fbUsers, setFbUsers] = useState<FbUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (target !== "uid" || fbUsers.length > 0) return;
    setUsersLoading(true);
    getDocs(collection(db, "users"))
      .then((snap) => setFbUsers(snap.docs.map((d) => ({ uid: d.id, ...d.data() } as FbUser))))
      .catch(console.warn)
      .finally(() => setUsersLoading(false));
  }, [target]);

  const filtered = fbUsers.filter(
    (u) => !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
  );

  async function send() {
    if (!title.trim() || !message.trim()) return;
    if (target === "uid" && !selectedUser) return;
    setLoading(true);
    try {
      await addDoc(collection(db, "broadcasts"), {
        title: title.trim(),
        message: message.trim(),
        fromName: user?.nickname || "Admin",
        fromRole: user?.role || "admin",
        to: target === "all" ? "all" : selectedUser!.uid,
        createdAt: serverTimestamp(),
        readBy: [],
      });
      setHistory((h) => [{
        title,
        to: target === "all" ? "Всем" : (selectedUser?.name || selectedUser?.email || ""),
        at: new Date().toLocaleString("ru-RU"),
      }, ...h]);
      setTitle(""); setMessage(""); setSelectedUser(null); setSent(true);
      setTimeout(() => setSent(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-cyber-purple-bright to-cyber-neon rounded-xl flex items-center justify-center">
          <Megaphone className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-display font-black text-2xl text-white">Рассылка</h1>
          <p className="text-gray-500 text-sm font-mono">Отправить уведомление пользователям</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 space-y-5">
        {/* Target selector */}
        <div>
          <label className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-widest mb-3">Получатель</label>
          <div className="flex gap-3">
            {([
              { id: "all", label: "Всем пользователям", icon: Users },
              { id: "uid", label: "Конкретному пользователю", icon: User },
            ] as const).map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => { setTarget(id as Target); setSelectedUser(null); }}
                className={cn("flex-1 flex items-center gap-3 p-4 rounded-xl border transition-all text-left",
                  target === id
                    ? "border-cyber-neon/60 bg-cyber-neon/10 text-white"
                    : "border-cyber-glass-border bg-cyber-purple/10 text-gray-400 hover:border-cyber-neon/30 hover:text-white")}>
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-display font-bold">{label}</span>
              </button>
            ))}
          </div>

          <AnimatePresence>
            {target === "uid" && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-3 overflow-hidden">
                {/* User picker dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen((v) => !v)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-mono transition-all",
                      selectedUser
                        ? "border-cyber-neon/40 bg-cyber-neon/5 text-white"
                        : "border-cyber-glass-border bg-cyber-purple/20 text-gray-500"
                    )}
                  >
                    {selectedUser ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-xs font-bold">
                          {selectedUser.name?.[0]?.toUpperCase() ?? "?"}
                        </div>
                        <span className="text-white">{selectedUser.name || selectedUser.email}</span>
                        <span className={cn("text-xs px-1.5 py-0.5 rounded border font-bold", ROLE_COLORS[selectedUser.role] ?? ROLE_COLORS.user)}>
                          {selectedUser.role}
                        </span>
                      </div>
                    ) : (
                      <span>{usersLoading ? "Загрузка..." : "Выбрать пользователя..."}</span>
                    )}
                    <ChevronDown className={cn("w-4 h-4 text-gray-500 transition-transform", dropdownOpen && "rotate-180")} />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                        className="absolute top-full left-0 right-0 mt-1 z-50 glass-card rounded-xl overflow-hidden border border-cyber-glass-border"
                      >
                        <div className="p-2 border-b border-cyber-glass-border">
                          <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                            <input
                              autoFocus
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                              placeholder="Поиск по имени или email..."
                              className="w-full bg-cyber-purple/20 rounded-lg pl-8 pr-3 py-1.5 text-sm text-white placeholder-gray-600 focus:outline-none font-mono"
                            />
                          </div>
                        </div>
                        <div className="max-h-52 overflow-y-auto">
                          {usersLoading ? (
                            <div className="flex items-center justify-center py-6">
                              <Loader2 className="w-5 h-5 text-cyber-neon animate-spin" />
                            </div>
                          ) : filtered.length === 0 ? (
                            <p className="text-center text-gray-600 text-sm font-mono py-4">Не найдено</p>
                          ) : (
                            filtered.map((u) => (
                              <button
                                key={u.uid}
                                onClick={() => { setSelectedUser(u); setDropdownOpen(false); setSearch(""); }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left"
                              >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                  {u.name?.[0]?.toUpperCase() ?? "?"}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-white text-sm font-semibold truncate">{u.name || "—"}</div>
                                  <div className="text-gray-500 text-xs font-mono truncate">{u.email}</div>
                                </div>
                                <span className={cn("text-xs px-1.5 py-0.5 rounded border font-bold flex-shrink-0", ROLE_COLORS[u.role] ?? ROLE_COLORS.user)}>
                                  {u.role}
                                </span>
                              </button>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-widest mb-2">Заголовок уведомления</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="Новый турнир, Важное объявление..."
            className="w-full bg-cyber-purple/20 border border-cyber-glass-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyber-neon/50 font-mono" />
        </div>

        {/* Message */}
        <div>
          <label className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-widest mb-2">Текст сообщения</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)}
            placeholder="Введите текст уведомления..." rows={5}
            className="w-full bg-cyber-purple/20 border border-cyber-glass-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyber-neon/50 font-mono resize-none" />
          <div className="text-right text-xs text-gray-600 font-mono mt-1">{message.length} символов</div>
        </div>

        {/* Send button */}
        <div className="flex gap-3 items-center">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={send}
            disabled={loading || !title.trim() || !message.trim() || (target === "uid" && !selectedUser)}
            className={cn("flex items-center gap-2 px-6 py-3 rounded-xl font-display font-bold text-sm uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed",
              sent
                ? "bg-green-500/20 border border-green-500/40 text-green-400"
                : "bg-gradient-to-r from-cyber-purple-bright to-cyber-neon text-white hover:shadow-neon")}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : sent ? <CheckCircle className="w-4 h-4" /> : <Send className="w-4 h-4" />}
            {loading ? "Отправка..." : sent ? "Отправлено!" : "Отправить"}
          </motion.button>
          <span className="text-gray-600 text-xs font-mono">
            {target === "all" ? "Уведомление получат все пользователи" : selectedUser ? `→ ${selectedUser.name || selectedUser.email}` : "Выберите получателя"}
          </span>
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-display font-bold text-white mb-4">История сессии</h3>
          <div className="space-y-2">
            {history.map((h, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-cyber-glass-border/50">
                <div>
                  <span className="text-white text-sm font-display font-bold">{h.title}</span>
                  <span className="text-gray-500 text-xs font-mono ml-2">→ {h.to}</span>
                </div>
                <span className="text-gray-600 text-xs font-mono">{h.at}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

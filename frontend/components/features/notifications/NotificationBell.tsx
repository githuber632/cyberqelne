"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Megaphone, CheckCheck, Trash2, HeadphonesIcon, ExternalLink } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import {
  collection, onSnapshot, query, where, orderBy,
  updateDoc, deleteDoc, doc, arrayUnion, limit,
} from "firebase/firestore";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  fromName: string;
  fromRole: string;
  to: string;
  createdAt: { seconds: number } | null;
  readBy: string[];
  type?: string;
  link?: string;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();
  const uid = user?.id;

  useEffect(() => {
    if (!uid) return;
    const q = query(
      collection(db, "broadcasts"),
      orderBy("createdAt", "desc"),
      limit(30)
    );
    const unsub = onSnapshot(q, (snap) => {
      const all = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Notification));
      setNotifications(all.filter((n) => n.to === "all" || n.to === uid));
    });
    return unsub;
  }, [uid]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const unread = uid ? notifications.filter((n) => !n.readBy?.includes(uid)) : [];

  async function markAllRead() {
    if (!uid) return;
    for (const n of unread) {
      try {
        await updateDoc(doc(db, "broadcasts", n.id), { readBy: arrayUnion(uid) });
      } catch {}
    }
  }

  async function deleteNotification(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await deleteDoc(doc(db, "broadcasts", id));
    } catch {}
  }

  function handleOpen() {
    setOpen(!open);
    if (!open && unread.length > 0) markAllRead();
  }

  function formatTime(ts: { seconds: number } | null) {
    if (!ts) return "";
    const d = new Date(ts.seconds * 1000);
    return d.toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div ref={ref} className="relative">
      <button onClick={handleOpen}
        className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
        <Bell className="w-5 h-5" />
        {unread.length > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-cyber-neon-pink rounded-full text-white text-[9px] font-bold flex items-center justify-center">
            {unread.length > 9 ? "9+" : unread.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] glass-card rounded-xl overflow-hidden z-50 shadow-neon"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-cyber-glass-border">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-cyber-neon" />
                <span className="font-display font-bold text-white text-sm">Уведомления</span>
                {unread.length > 0 && (
                  <span className="bg-cyber-neon-pink/20 text-cyber-neon-pink text-xs font-mono px-1.5 py-0.5 rounded-full">
                    {unread.length}
                  </span>
                )}
              </div>
              <button onClick={() => setOpen(false)} className="text-gray-600 hover:text-gray-300 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-10 text-center text-gray-600">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-xs font-mono">Нет уведомлений</p>
                </div>
              ) : (
                notifications.map((n) => {
                  const isUnread = uid && !n.readBy?.includes(uid);
                  return (
                    <div key={n.id}
                      className={cn("px-4 py-3 border-b border-cyber-glass-border/50 transition-colors group",
                        isUnread ? "bg-cyber-neon/5" : "hover:bg-white/5")}>
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
                          n.type === "support_reply"
                            ? "bg-gradient-to-br from-green-600 to-teal-600"
                            : "bg-gradient-to-br from-cyber-purple-bright to-cyber-neon"
                        )}>
                          {n.type === "support_reply"
                            ? <HeadphonesIcon className="w-4 h-4 text-white" />
                            : <Megaphone className="w-4 h-4 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <span className="font-display font-bold text-white text-xs truncate">{n.title}</span>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              {isUnread && <span className="w-2 h-2 bg-cyber-neon-pink rounded-full" />}
                              <button
                                onClick={(e) => deleteNotification(n.id, e)}
                                className="opacity-0 group-hover:opacity-100 p-0.5 text-gray-600 hover:text-red-400 transition-all"
                                title="Удалить"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{n.message}</p>
                          <div className="flex items-center justify-between mt-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600 text-xs font-mono">{n.fromName}</span>
                              <span className="text-gray-700 text-xs">·</span>
                              <span className="text-gray-600 text-xs font-mono">{formatTime(n.createdAt)}</span>
                            </div>
                            {n.type === "support_reply" && n.link && (
                              <Link href={n.link} onClick={() => setOpen(false)}
                                className="flex items-center gap-1 text-xs font-mono text-cyber-neon hover:text-white transition-colors flex-shrink-0">
                                <ExternalLink className="w-3 h-3" />Посмотреть
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {unread.length > 0 && (
              <button onClick={markAllRead}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-mono text-gray-500 hover:text-cyber-neon border-t border-cyber-glass-border transition-colors">
                <CheckCheck className="w-3.5 h-3.5" />
                Отметить все как прочитанные
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

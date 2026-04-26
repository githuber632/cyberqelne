"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, UserCog, Ban, ShieldCheck, Trash2, Bell, X, Send, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuthStore } from "@/store/authStore";
import { ROLE_COLORS, isCEO, isAdmin } from "@/lib/roles";

interface FirebaseUser {
  uid: string;
  name: string;
  email: string;
  role: string;
  banned?: boolean;
  createdAt?: string;
}

export default function AdminUsersPage() {
  const [fbUsers, setFbUsers] = useState<FirebaseUser[]>([]);
  const [fbLoading, setFbLoading] = useState(false);
  const [notifyModal, setNotifyModal] = useState<{ uid: string; name: string } | null>(null);
  const [notifyText, setNotifyText] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { user: currentUser } = useAuthStore();

  const canBan = isAdmin(currentUser?.role);       // admin + ceo
  const canDelete = isAdmin(currentUser?.role);    // admin + ceo
  const canNotify = isAdmin(currentUser?.role);    // admin + ceo
  const canChangeRole = isCEO(currentUser?.role);  // ceo only

  async function loadFirebaseUsers() {
    setFbLoading(true);
    try {
      const snap = await getDocs(collection(db, "users"));
      setFbUsers(snap.docs.map((d) => ({ uid: d.id, ...d.data() } as FirebaseUser)));
    } catch (e) {
      console.warn("Firebase fetch failed:", e);
    } finally {
      setFbLoading(false);
    }
  }

  useEffect(() => { loadFirebaseUsers(); }, []);

  async function banUser(uid: string, ban: boolean) {
    setActionLoading(uid + (ban ? "-ban" : "-unban"));
    try {
      await updateDoc(doc(db, "users", uid), { banned: ban });
      setFbUsers((prev) => prev.map((u) => u.uid === uid ? { ...u, banned: ban } : u));
    } catch (e) { console.warn(e); }
    finally { setActionLoading(null); }
  }

  async function deleteUser(uid: string) {
    setActionLoading(uid + "-delete");
    try {
      await deleteDoc(doc(db, "users", uid));
      setFbUsers((prev) => prev.filter((u) => u.uid !== uid));
    } catch (e) { console.warn(e); }
    finally { setActionLoading(null); setDeleteConfirm(null); }
  }

  async function sendNotification() {
    if (!notifyModal || !notifyText.trim()) return;
    setActionLoading(notifyModal.uid + "-notify");
    try {
      await addDoc(collection(db, "notifications"), {
        userId: notifyModal.uid,
        message: notifyText.trim(),
        fromAdmin: currentUser?.nickname || "Admin",
        read: false,
        createdAt: serverTimestamp(),
      });
      setNotifyText("");
      setNotifyModal(null);
    } catch (e) { console.warn(e); }
    finally { setActionLoading(null); }
  }

  async function changeRole(uid: string, role: string) {
    try {
      await updateDoc(doc(db, "users", uid), { role });
      setFbUsers((prev) => prev.map((u) => u.uid === uid ? { ...u, role } : u));
    } catch (e) { console.warn(e); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-2xl text-white">Управление пользователями</h1>
          <p className="text-gray-500 text-sm mt-1">{fbUsers.length} пользователей</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Permissions legend */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-600 font-mono">
            {canChangeRole && <span className="px-2 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded text-yellow-500">CEO: все права</span>}
            {!canChangeRole && canBan && <span className="px-2 py-1 bg-red-500/10 border border-red-500/20 rounded text-red-400">Admin: бан/удаление/уведомления</span>}
            {!canBan && <span className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded text-blue-400">Moderator: только просмотр</span>}
          </div>
          <button onClick={loadFirebaseUsers} disabled={fbLoading}
            className="flex items-center gap-2 px-4 py-2.5 glass-card rounded-xl text-gray-400 hover:text-white text-sm transition-all disabled:opacity-50">
            <RefreshCw className={cn("w-4 h-4", fbLoading && "animate-spin")} />
            Обновить
          </button>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        {fbUsers.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            <UserCog className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="font-mono text-sm">{fbLoading ? "Загрузка..." : "Нет пользователей"}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cyber-glass-border">
                  {[
                    "Пользователь", "Email", "Роль", "Статус",
                    ...(canChangeRole ? ["Изменить роль"] : []),
                    ...(canBan || canDelete || canNotify ? ["Действия"] : []),
                  ].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs text-gray-500 font-mono uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-cyber-glass-border">
                {fbUsers.map((u, i) => (
                  <motion.tr key={u.uid} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className={cn("hover:bg-white/5 transition-colors", u.banned && "opacity-60")}>

                    {/* User */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyber-purple-bright to-cyber-neon flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                          {u.name?.[0]?.toUpperCase() ?? "?"}
                        </div>
                        <div>
                          <div className="text-white font-semibold text-sm">{u.name || "—"}</div>
                          <div className="text-gray-600 text-xs font-mono">{u.uid.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3 text-gray-400 text-xs font-mono max-w-[160px] truncate">{u.email}</td>

                    {/* Role badge */}
                    <td className="px-4 py-3">
                      <span className={cn("text-xs font-mono font-bold px-2 py-0.5 rounded-full border",
                        ROLE_COLORS[u.role] ?? ROLE_COLORS.user)}>
                        {u.role || "user"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      {u.banned
                        ? <span className="text-xs font-mono text-red-400 bg-red-500/10 border border-red-500/30 px-2 py-0.5 rounded-full">Забанен</span>
                        : <span className="text-xs font-mono text-green-400 bg-green-500/10 border border-green-500/30 px-2 py-0.5 rounded-full">Активен</span>}
                    </td>

                    {/* Role change — CEO only */}
                    {canChangeRole && (
                      <td className="px-4 py-3">
                        <select value={u.role || "user"} onChange={(e) => changeRole(u.uid, e.target.value)}
                          className="bg-cyber-purple/20 border border-cyber-glass-border rounded-lg px-2 py-1 text-xs text-white font-mono focus:outline-none focus:border-cyber-neon/50">
                          <option value="user">user</option>
                          <option value="moderator">moderator</option>
                          <option value="admin">admin</option>
                          <option value="ceo">ceo</option>
                        </select>
                      </td>
                    )}

                    {/* Actions — admin + ceo */}
                    {(canBan || canDelete || canNotify) && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {/* Ban / Unban */}
                          {canBan && (
                            u.banned ? (
                              <button
                                onClick={() => banUser(u.uid, false)}
                                disabled={actionLoading === u.uid + "-unban"}
                                title="Разбанить"
                                className="p-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 transition-all disabled:opacity-40"
                              >
                                <ShieldCheck className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => banUser(u.uid, true)}
                                disabled={actionLoading === u.uid + "-ban"}
                                title="Забанить"
                                className="p-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500/20 transition-all disabled:opacity-40"
                              >
                                <Ban className="w-3.5 h-3.5" />
                              </button>
                            )
                          )}

                          {/* Notify */}
                          {canNotify && (
                            <button
                              onClick={() => setNotifyModal({ uid: u.uid, name: u.name })}
                              title="Уведомление"
                              className="p-1.5 rounded-lg bg-cyber-neon/10 border border-cyber-neon/20 text-cyber-neon hover:bg-cyber-neon/20 transition-all"
                            >
                              <Bell className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Delete */}
                          {canDelete && (
                            <button
                              onClick={() => setDeleteConfirm(u.uid)}
                              title="Удалить аккаунт"
                              className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Notification modal */}
      <AnimatePresence>
        {notifyModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setNotifyModal(null)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="glass-card rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-cyber-neon" />
                  Уведомление → {notifyModal.name}
                </h3>
                <button onClick={() => setNotifyModal(null)} className="text-gray-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <textarea
                value={notifyText}
                onChange={(e) => setNotifyText(e.target.value)}
                placeholder="Текст уведомления..."
                rows={4}
                className="w-full bg-cyber-purple/20 border border-cyber-glass-border rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyber-neon/50 resize-none"
              />
              <div className="flex gap-3 mt-4">
                <button onClick={() => setNotifyModal(null)}
                  className="flex-1 py-2.5 glass-card rounded-xl text-gray-400 hover:text-white text-sm transition-all">
                  Отмена
                </button>
                <button onClick={sendNotification} disabled={!notifyText.trim() || !!actionLoading}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-cyber-purple-bright to-cyber-neon text-white font-semibold rounded-xl text-sm hover:shadow-neon transition-all disabled:opacity-40">
                  <Send className="w-4 h-4" />
                  Отправить
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirm modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setDeleteConfirm(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="glass-card rounded-2xl p-6 w-full max-w-sm">
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <h3 className="font-display font-bold text-white">Удалить аккаунт?</h3>
              </div>
              <p className="text-gray-500 text-sm mb-5">Это действие нельзя отменить. Все данные пользователя будут удалены.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 glass-card rounded-xl text-gray-400 hover:text-white text-sm transition-all">
                  Отмена
                </button>
                <button onClick={() => deleteUser(deleteConfirm)} disabled={!!actionLoading}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-600 text-white font-semibold rounded-xl text-sm hover:bg-red-700 transition-all disabled:opacity-40">
                  <Trash2 className="w-4 h-4" />
                  Удалить
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Crown, RefreshCw, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { useAuthStore } from "@/store/authStore";
import { isCEO, ROLE_COLORS, ROLE_LABELS } from "@/lib/roles";

interface FirebaseUser {
  uid: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
}

const ALL_ROLES = ["ceo", "admin", "moderator", "user"] as const;

export default function CeoPanelPage() {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<FirebaseUser[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadUsers() {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "users"));
      setUsers(snap.docs.map((d) => ({ uid: d.id, ...d.data() } as FirebaseUser)));
    } catch (e) {
      console.warn("Failed to load users:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadUsers(); }, []);

  async function changeRole(uid: string, role: string) {
    try {
      await updateDoc(doc(db, "users", uid), { role });
      setUsers((prev) => prev.map((u) => u.uid === uid ? { ...u, role } : u));
    } catch (e) {
      console.warn("Role update failed:", e);
    }
  }

  if (!isCEO(currentUser?.role)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <ShieldAlert className="w-16 h-16 text-red-400/50" />
        <h2 className="font-display font-black text-2xl text-white">Нет доступа</h2>
        <p className="text-gray-500 font-mono text-sm">Этот раздел доступен только CEO</p>
      </div>
    );
  }

  const countByRole = ALL_ROLES.reduce<Record<string, number>>((acc, r) => {
    acc[r] = users.filter((u) => u.role === r).length;
    return acc;
  }, {});

  const roleCardColors: Record<string, string> = {
    ceo: "from-yellow-500/20 to-yellow-600/5 border-yellow-500/30",
    admin: "from-red-500/20 to-red-600/5 border-red-500/30",
    moderator: "from-blue-500/20 to-blue-600/5 border-blue-500/30",
    user: "from-gray-500/10 to-gray-600/5 border-gray-500/20",
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display font-black text-2xl text-white">CEO Панель</h1>
            <p className="text-gray-500 text-sm font-mono">Управление ролями пользователей</p>
          </div>
        </div>
        <button onClick={loadUsers} disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 glass-card rounded-xl text-gray-400 hover:text-white text-sm transition-all disabled:opacity-50">
          <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          Обновить
        </button>
      </div>

      {/* Role stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {ALL_ROLES.map((role) => (
          <motion.div key={role} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={cn("glass-card rounded-xl p-4 text-center bg-gradient-to-b border", roleCardColors[role])}>
            <div className="font-display font-black text-3xl text-white mb-1">{countByRole[role] ?? 0}</div>
            <div className="text-xs font-mono text-gray-400">{ROLE_LABELS[role]}</div>
          </motion.div>
        ))}
      </div>

      {/* Users table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {users.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            <Crown className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="font-mono text-sm">{loading ? "Загрузка..." : "Нет пользователей"}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cyber-glass-border">
                  {["Пользователь", "Email", "UID", "Текущая роль", "Назначить роль"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs text-gray-500 font-mono uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-cyber-glass-border">
                {users.map((u, i) => (
                  <motion.tr key={u.uid} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }} className="hover:bg-white/5">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyber-purple-bright to-cyber-neon flex items-center justify-center text-white font-bold text-xs">
                          {u.name?.[0]?.toUpperCase() ?? "?"}
                        </div>
                        <span className="text-white font-semibold text-sm">{u.name || "—"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs font-mono max-w-[180px] truncate">{u.email}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs font-mono">{u.uid.slice(0, 8)}...</td>
                    <td className="px-4 py-3">
                      <span className={cn("text-xs font-mono font-bold px-2 py-0.5 rounded-full border",
                        ROLE_COLORS[u.role] ?? ROLE_COLORS.user)}>
                        {ROLE_LABELS[u.role] ?? u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select value={u.role || "user"} onChange={(e) => changeRole(u.uid, e.target.value)}
                        className="bg-cyber-purple/20 border border-cyber-glass-border rounded-lg px-2 py-1 text-xs text-white font-mono focus:outline-none focus:border-cyber-neon/50">
                        {ALL_ROLES.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
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

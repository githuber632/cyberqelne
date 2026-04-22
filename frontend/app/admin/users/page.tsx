"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw, UserCog } from "lucide-react";
import { cn } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { useAuthStore } from "@/store/authStore";
import { ROLE_COLORS, isAdmin } from "@/lib/roles";

interface FirebaseUser {
  uid: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
}

export default function AdminUsersPage() {
  const [fbUsers, setFbUsers] = useState<FirebaseUser[]>([]);
  const [fbLoading, setFbLoading] = useState(false);
  const { user: currentUser } = useAuthStore();

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

  async function changeFirebaseRole(uid: string, role: string) {
    try {
      await updateDoc(doc(db, "users", uid), { role });
      setFbUsers((prev) => prev.map((u) => u.uid === uid ? { ...u, role } : u));
    } catch (e) {
      console.warn("Role update failed:", e);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-2xl text-white">Управление пользователями</h1>
          <p className="text-gray-500 text-sm mt-1">{fbUsers.length} пользователей Firebase</p>
        </div>
        <button onClick={loadFirebaseUsers} disabled={fbLoading}
          className="flex items-center gap-2 px-4 py-2.5 glass-card rounded-xl text-gray-400 hover:text-white text-sm transition-all disabled:opacity-50">
          <RefreshCw className={cn("w-4 h-4", fbLoading && "animate-spin")} />
          Обновить
        </button>
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
                  {["Пользователь", "Email", "UID", "Роль", "Дата", "Изменить роль"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs text-gray-500 font-mono uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-cyber-glass-border">
                {fbUsers.map((u, i) => (
                  <motion.tr key={u.uid} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="hover:bg-white/5">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-xs">
                          {u.name?.[0]?.toUpperCase() ?? "?"}
                        </div>
                        <span className="text-white font-semibold text-sm">{u.name || "—"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs font-mono max-w-[160px] truncate">{u.email}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs font-mono">{u.uid.slice(0, 8)}...</td>
                    <td className="px-4 py-3">
                      <span className={cn("text-xs font-mono font-bold px-2 py-0.5 rounded-full border",
                        ROLE_COLORS[u.role] ?? ROLE_COLORS.user)}>
                        {u.role || "user"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs font-mono">{u.createdAt?.slice(0, 10) ?? "—"}</td>
                    <td className="px-4 py-3">
                      <select value={u.role || "user"} onChange={(e) => changeFirebaseRole(u.uid, e.target.value)}
                        className="bg-cyber-purple/20 border border-cyber-glass-border rounded-lg px-2 py-1 text-xs text-white font-mono focus:outline-none focus:border-cyber-neon/50">
                        <option value="user">user</option>
                        <option value="moderator">moderator</option>
                        <option value="admin">admin</option>
                        {isAdmin(currentUser?.role) && <option value="ceo">ceo</option>}
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

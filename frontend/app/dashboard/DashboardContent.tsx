"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Trophy, TrendingUp, Settings,
  Plus, BarChart3, LogOut, Save, Camera,
} from "lucide-react";
import { FileUpload } from "@/components/ui/FileUpload";
import { useAuthStore } from "@/store/authStore";
import { useContentStore } from "@/store/contentStore";
import { cn } from "@/lib/utils";
import { auth, db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { ROLE_COLORS, ROLE_LABELS } from "@/lib/roles";

// Only these tabs are shown to all users
const BASE_SIDEBAR_ITEMS = [
  { label: "Обзор", icon: BarChart3, id: "overview" },
  { label: "Турниры", icon: Trophy, id: "tournaments" },
  { label: "Настройки", icon: Settings, id: "settings" },
];

export function DashboardContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "overview");
  const { user, logout, isAuthenticated, updateUser } = useAuthStore();
  const { tournaments } = useContentStore();
  const router = useRouter();

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  // Settings tab state
  const [nickname, setNickname] = useState("");
  const [savingNickname, setSavingNickname] = useState(false);
  const [nicknameSaved, setNicknameSaved] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const activeTournaments = tournaments.filter((t) => t.status === "active" || t.status === "registration");

  async function handleLogout() {
    try { await signOut(auth); } catch {}
    logout();
    router.push("/");
  }

  async function saveNickname() {
    if (!user || !nickname.trim() || nickname.trim() === user.nickname) return;
    setSavingNickname(true);
    try {
      await updateDoc(doc(db, "users", user.id), { name: nickname.trim() });
      updateUser({ nickname: nickname.trim() });
      setNicknameSaved(true);
      setTimeout(() => setNicknameSaved(false), 2500);
    } catch (e) {
      console.warn("Nickname update failed", e);
    } finally {
      setSavingNickname(false);
    }
  }

  async function saveAvatar(url: string) {
    if (!user) return;
    try {
      await updateDoc(doc(db, "users", user.id), { avatar: url });
      updateUser({ avatar: url });
    } catch (e) {
      console.warn("Avatar update failed", e);
    }
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen pt-32 pb-16 text-center">
        <Trophy className="w-16 h-16 text-gray-700 mx-auto mb-4" />
        <h1 className="font-display font-black text-3xl text-white mb-4">Требуется вход</h1>
        <p className="text-gray-500 mb-6">Войди в аккаунт чтобы видеть дашборд</p>
        <Link href="/auth/login" className="px-6 py-3 bg-gradient-to-r from-cyber-purple-bright to-cyber-neon text-white font-display font-bold rounded-xl hover:shadow-neon transition-all">
          Войти
        </Link>
      </div>
    );
  }

  const avatarInitials = user.nickname?.slice(0, 2).toUpperCase() || user.email?.slice(0, 2).toUpperCase() || "??";

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="glass-card rounded-2xl p-6 mb-4 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-cyber-purple/20 to-transparent" />
              <div className="relative">
                <div className="relative inline-block mb-4">
                  {user.avatar ? (
                    <img src={user.avatar} className="w-20 h-20 rounded-full object-cover shadow-neon" alt="" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyber-purple-bright to-cyber-neon flex items-center justify-center text-white font-display font-black text-2xl shadow-neon">
                      {avatarInitials}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-cyber-dark" />
                </div>
                <div className="mb-3">
                  <FileUpload compact storagePath="avatars" onUpload={saveAvatar} />
                </div>

                <h2 className="font-display font-bold text-xl text-white">{user.nickname}</h2>
                <p className="text-gray-500 text-sm mb-2 font-mono">{user.email}</p>
                <div className="inline-block px-2 py-0.5 rounded text-xs font-mono border mb-4
                  text-cyber-neon border-cyber-neon/40 bg-cyber-neon/10">
                  {user.role}
                </div>

                <button onClick={handleLogout} className="flex items-center gap-2 mx-auto text-sm text-gray-500 hover:text-red-400 transition-colors">
                  <LogOut className="w-3.5 h-3.5" />
                  Выйти
                </button>
              </div>
            </motion.div>

            <motion.nav initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              className="glass-card rounded-2xl overflow-hidden">
              {BASE_SIDEBAR_ITEMS.map((item) => (
                <button key={item.id} onClick={() => setActiveTab(item.id)}
                  className={cn("w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-all duration-200",
                    activeTab === item.id ? "bg-cyber-neon/10 text-cyber-neon border-l-2 border-cyber-neon" : "text-gray-500 hover:text-white hover:bg-white/5 border-l-2 border-transparent")}>
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
              {(user.role === "admin" || user.role === "moderator" || user.role === "ceo") && (
                <Link href="/admin" className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-cyber-neon-pink hover:bg-white/5 border-l-2 border-transparent transition-all">
                  <Settings className="w-4 h-4" />
                  Панель админа
                </Link>
              )}
            </motion.nav>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3 space-y-6">

            {/* Settings tab */}
            {activeTab === "settings" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {/* Avatar */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="font-display font-bold text-lg text-white mb-5 flex items-center gap-2">
                    <Camera className="w-5 h-5 text-cyber-neon" /> Фото профиля
                  </h3>
                  <div className="flex items-center gap-6">
                    <div className="relative flex-shrink-0">
                      {user.avatar ? (
                        <img src={user.avatar} className="w-20 h-20 rounded-full object-cover shadow-neon" alt="" />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyber-purple-bright to-cyber-neon flex items-center justify-center text-white font-display font-black text-2xl">
                          {user.nickname?.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-400 text-sm mb-3">Загрузи новый аватар. Поддерживаются PNG, JPG, WebP.</p>
                      <FileUpload
                        storagePath="avatars"
                        onUpload={saveAvatar}
                        onUploadingChange={setAvatarUploading}
                        currentUrl={user.avatar}
                        compact
                      />
                    </div>
                  </div>
                </div>

                {/* Nickname */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="font-display font-bold text-lg text-white mb-5 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-cyber-neon" /> Профиль
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono text-gray-500 uppercase mb-1.5">Никнейм</label>
                      <div className="flex gap-3">
                        <input
                          value={nickname || user.nickname}
                          onChange={(e) => setNickname(e.target.value)}
                          onFocus={() => { if (!nickname) setNickname(user.nickname); }}
                          placeholder={user.nickname}
                          className="flex-1 bg-cyber-purple/20 border border-cyber-glass-border rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyber-neon/50 text-sm font-mono"
                        />
                        <button
                          onClick={saveNickname}
                          disabled={savingNickname || !nickname.trim() || nickname.trim() === user.nickname}
                          className={cn(
                            "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all",
                            nicknameSaved
                              ? "bg-green-500/20 border border-green-500/40 text-green-400"
                              : "bg-cyber-neon/20 border border-cyber-neon/40 text-cyber-neon hover:bg-cyber-neon/30 disabled:opacity-40"
                          )}
                        >
                          <Save className="w-4 h-4" />
                          {nicknameSaved ? "Сохранено!" : savingNickname ? "..." : "Сохранить"}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-gray-500 uppercase mb-1.5">Email</label>
                      <div className="bg-cyber-purple/10 border border-cyber-glass-border rounded-xl px-4 py-2.5 text-gray-400 text-sm font-mono">
                        {user.email}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-gray-500 uppercase mb-1.5">Роль</label>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-sm font-mono font-bold px-3 py-1.5 rounded-full border",
                          ROLE_COLORS[user.role] ?? ROLE_COLORS.user
                        )}>
                          {ROLE_LABELS[user.role] ?? user.role}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Danger zone */}
                <div className="glass-card rounded-2xl p-6 border border-red-500/20">
                  <h3 className="font-display font-bold text-lg text-red-400 mb-4">Выход из аккаунта</h3>
                  <p className="text-gray-500 text-sm mb-4">Ты выйдешь из текущего сеанса на этом устройстве.</p>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-500/20 border border-red-500/40 rounded-xl text-red-400 hover:bg-red-500/30 transition-all text-sm font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    Выйти из аккаунта
                  </button>
                </div>
              </motion.div>
            )}

            {/* Overview (default) tab */}
            {activeTab === "overview" && (<>

            {/* Welcome banner */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 cyber-grid-bg opacity-10" />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10">
                <Trophy className="w-24 h-24 text-cyber-neon" />
              </div>
              <div className="relative">
                <p className="text-gray-500 font-mono text-sm mb-1">Добро пожаловать,</p>
                <h1 className="font-display font-black text-2xl text-white mb-2">{user.nickname} 👋</h1>
                <p className="text-gray-400 text-sm">
                  Сейчас доступно{" "}
                  <span className="text-cyber-neon font-semibold">{activeTournaments.length} турниров</span> для участия.
                </p>
              </div>
            </motion.div>


            {/* Active tournaments */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-lg text-white">Доступные турниры</h3>
                <Link href="/tournaments" className="flex items-center gap-1.5 text-sm text-cyber-neon hover:text-white transition-colors">
                  <Plus className="w-4 h-4" />
                  Все турниры
                </Link>
              </div>
              {activeTournaments.length === 0 ? (
                <p className="text-gray-500 text-sm font-mono text-center py-6">Нет активных турниров</p>
              ) : (
                <div className="space-y-3">
                  {activeTournaments.slice(0, 4).map((t) => (
                    <Link key={t.id} href={`/tournaments/${t.id}`}>
                      <div className="flex items-center justify-between p-4 bg-cyber-purple/10 rounded-xl border border-cyber-glass-border hover:border-cyber-neon/30 transition-all">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{t.gameIcon}</span>
                          <div>
                            <div className="font-semibold text-white text-sm">{t.title}</div>
                            <div className="text-xs text-gray-500 font-mono">{t.game} • {t.format}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-cyber-neon font-mono font-bold text-xs">{t.prizePool} UZS</div>
                          <div className="flex items-center gap-1 justify-end mt-1">
                            {t.status === "active" && <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />}
                            <span className="text-xs text-gray-400 font-mono">
                              {t.status === "active" ? "LIVE" : t.startDate}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>
            </>)}

          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, User, Settings, LogOut, Shield, Trophy } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

interface UserMenuProps {
  user: { nickname: string; avatar?: string; role: string } | null;
}

export function UserMenu({ user }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    try { await signOut(auth); } catch {}
    logout();
    router.push("/");
    setOpen(false);
  };

  if (!user) return null;

  const menuItems = [
    { label: "Дашборд", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Профиль", icon: User, href: `/players/${encodeURIComponent(user.nickname)}` },
    { label: "Мои турниры", icon: Trophy, href: "/tournaments" },
    ...(user.role === "admin" || user.role === "moderator" || user.role === "ceo"
      ? [{ label: "Админ панель", icon: Shield, href: "/admin" }]
      : []),
    { label: "Настройки", icon: Settings, href: "/dashboard" },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/5 transition-colors"
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyber-purple-bright to-cyber-neon flex items-center justify-center text-white font-bold text-sm shadow-neon overflow-hidden">
          {user.avatar ? (
            <img src={user.avatar} alt="" className="w-full h-full object-cover" />
          ) : (
            user.nickname[0].toUpperCase()
          )}
        </div>
        <div className="hidden md:block text-left">
          <div className="text-white text-sm font-semibold leading-none">{user.nickname}</div>
          <div className="text-cyber-neon text-xs font-mono capitalize">{user.role}</div>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-56 glass-card rounded-xl overflow-hidden py-2 z-50"
          >
            {/* User info */}
            <div className="px-4 py-3 border-b border-cyber-glass-border">
              <div className="font-semibold text-white">{user.nickname}</div>
              <div className="text-xs text-gray-500 font-mono capitalize">{user.role}</div>
            </div>

            {/* Menu items */}
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-cyber-neon/10 transition-all duration-150"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}

            {/* Logout */}
            <div className="border-t border-cyber-glass-border mt-2 pt-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-150"
              >
                <LogOut className="w-4 h-4" />
                Выйти
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

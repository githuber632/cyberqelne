"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  BarChart3, Newspaper, Trophy, ShoppingBag, Play,
  Gamepad2, Users, UserCog, Home, Settings, Shield,
  ChevronLeft, ChevronRight, Globe, Radio, Megaphone, Crown, LayoutTemplate,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { isCEO, isModerator } from "@/lib/roles";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const navItems = [
  { label: "Обзор", href: "/admin", icon: BarChart3, exact: true },
  { label: "Гл. страница", href: "/admin/hero", icon: Home },
  { label: "Новости", href: "/admin/news", icon: Newspaper },
  { label: "Турниры", href: "/admin/tournaments", icon: Trophy },
  { label: "Игры", href: "/admin/games", icon: Gamepad2 },
  { label: "Команды", href: "/admin/teams", icon: Users },
  { label: "Пользователи", href: "/admin/users", icon: UserCog },
  { label: "Магазин", href: "/admin/shop", icon: ShoppingBag },
  { label: "Медиа", href: "/admin/media", icon: Play },
  { label: "Прямой эфир", href: "/admin/live", icon: Radio },
  { label: "Рассылка", href: "/admin/broadcast", icon: Megaphone },
  { label: "Сообщество", href: "/admin/community", icon: Globe },
  { label: "Футер", href: "/admin/footer", icon: LayoutTemplate },
  { label: "Настройки", href: "/admin/settings", icon: Settings },
  { label: "CEO Панель", href: "/admin/ceo", icon: Crown, ceoOnly: true },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated === false || (user && !isModerator(user.role))) {
      router.replace("/");
    }
  }, [user, isAuthenticated, router]);

  const visibleItems = navItems.filter((item) => !item.ceoOnly || isCEO(user?.role));

  if (!user || !isModerator(user.role)) return null;

  return (
    <div className="min-h-screen pt-16 flex">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 220 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-16 bottom-0 z-40 flex flex-col bg-cyber-dark/95 backdrop-blur-xl border-r border-cyber-glass-border overflow-hidden"
      >
        {/* Admin badge */}
        <div className="flex items-center gap-2 px-4 py-4 border-b border-cyber-glass-border flex-shrink-0">
          <div className="w-8 h-8 bg-red-500/20 border border-red-500/40 rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4 text-red-400" />
          </div>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="text-white text-sm font-display font-bold leading-none">Admin</div>
              <div className="text-red-400 text-xs font-mono">Panel</div>
            </motion.div>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-3">
          {visibleItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname?.startsWith(item.href) && item.href !== "/admin";

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 transition-all duration-200 border-l-2",
                    isActive
                      ? "bg-cyber-neon/10 text-cyber-neon border-cyber-neon"
                      : item.ceoOnly
                        ? "text-yellow-500/70 hover:text-yellow-400 hover:bg-yellow-500/5 border-transparent"
                        : "text-gray-500 hover:text-white hover:bg-white/5 border-transparent"
                  )}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {!collapsed && (
                    <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Collapse button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center p-4 border-t border-cyber-glass-border text-gray-600 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </motion.aside>

      {/* Main content */}
      <motion.main
        animate={{ marginLeft: collapsed ? 64 : 220 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex-1 min-h-screen min-w-0 overflow-x-hidden"
      >
        <div className="p-4 sm:p-6 max-w-full">{children}</div>
      </motion.main>
    </div>
  );
}

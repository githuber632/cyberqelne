"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3, Newspaper, Trophy, ShoppingBag, Play,
  Users, UserCog, Home, Settings, Shield,
  ChevronLeft, ChevronRight, Globe, Radio, Megaphone, Crown, LayoutTemplate,
  ClipboardList, HeadphonesIcon, Menu, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { isCEO, isModerator } from "@/lib/roles";
import { useRouter } from "next/navigation";

const navItems = [
  { label: "Обзор",        href: "/admin",              icon: BarChart3,       exact: true },
  { label: "Гл. страница", href: "/admin/hero",         icon: Home },
  { label: "Новости",      href: "/admin/news",         icon: Newspaper },
  { label: "Турниры",      href: "/admin/tournaments",  icon: Trophy },
  { label: "Заявки",       href: "/admin/applications", icon: ClipboardList },
  { label: "Поддержка",    href: "/admin/support",      icon: HeadphonesIcon },
  { label: "Команды",      href: "/admin/teams",        icon: Users },
  { label: "Пользователи", href: "/admin/users",        icon: UserCog },
  { label: "Магазин",      href: "/admin/shop",         icon: ShoppingBag },
  { label: "Медиа",        href: "/admin/media",        icon: Play },
  { label: "Прямой эфир",  href: "/admin/live",         icon: Radio },
  { label: "Рассылка",     href: "/admin/broadcast",    icon: Megaphone },
  { label: "Сообщество",   href: "/admin/community",    icon: Globe },
  { label: "Футер",        href: "/admin/footer",       icon: LayoutTemplate },
  { label: "Настройки",    href: "/admin/settings",     icon: Settings },
  { label: "CEO Панель",   href: "/admin/ceo",          icon: Crown, ceoOnly: true },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated === false || (user && !isModerator(user.role))) {
      router.replace("/");
    }
  }, [user, isAuthenticated, router]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const visibleItems = navItems.filter((item) => !item.ceoOnly || isCEO(user?.role));

  if (!user || !isModerator(user.role)) return null;

  return (
    <div className="min-h-screen pt-16 bg-cyber-dark">

      {/* ── Desktop sidebar ─────────────────────────────────────────── */}
      <aside
        className={cn(
          "hidden lg:flex fixed left-0 top-16 bottom-0 z-40 flex-col bg-cyber-dark/95 backdrop-blur-xl border-r border-cyber-glass-border overflow-hidden transition-all duration-300",
          collapsed ? "w-16" : "w-[220px]"
        )}
      >
        <div className="flex items-center gap-2 px-4 py-4 border-b border-cyber-glass-border flex-shrink-0">
          <div className="w-8 h-8 bg-red-500/20 border border-red-500/40 rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4 text-red-400" />
          </div>
          {!collapsed && (
            <div>
              <div className="text-white text-sm font-display font-bold leading-none">Admin</div>
              <div className="text-red-400 text-xs font-mono">Panel</div>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-3">
          {visibleItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname?.startsWith(item.href) && item.href !== "/admin";
            return (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  "flex items-center gap-3 px-4 py-2.5 transition-all duration-200 border-l-2",
                  isActive
                    ? "bg-cyber-neon/10 text-cyber-neon border-cyber-neon"
                    : item.ceoOnly
                      ? "text-yellow-500/70 hover:text-yellow-400 hover:bg-yellow-500/5 border-transparent"
                      : "text-gray-500 hover:text-white hover:bg-white/5 border-transparent"
                )}>
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {!collapsed && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center p-4 border-t border-cyber-glass-border text-gray-600 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </aside>

      {/* ── Mobile drawer ────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed left-0 top-0 bottom-0 w-64 z-50 lg:hidden flex flex-col bg-[#0d0d1a] border-r border-cyber-glass-border"
            >
              <div className="flex items-center gap-3 px-4 py-4 border-b border-cyber-glass-border">
                <div className="w-8 h-8 bg-red-500/20 border border-red-500/40 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-red-400" />
                </div>
                <div className="flex-1">
                  <div className="text-white text-sm font-display font-bold leading-none">Admin Panel</div>
                  <div className="text-red-400 text-xs font-mono">CyberQELN</div>
                </div>
                <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto py-2">
                {visibleItems.map((item) => {
                  const isActive = item.exact
                    ? pathname === item.href
                    : pathname?.startsWith(item.href) && item.href !== "/admin";
                  return (
                    <Link key={item.href} href={item.href}>
                      <div className={cn(
                        "flex items-center gap-3 mx-2 px-3 py-3 rounded-xl transition-all duration-200 mb-0.5",
                        isActive
                          ? "bg-cyber-neon/15 text-cyber-neon"
                          : item.ceoOnly
                            ? "text-yellow-500/70 hover:text-yellow-400 hover:bg-yellow-500/10"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                      )}>
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <div className={cn(
        "transition-all duration-300 min-h-screen",
        collapsed ? "lg:ml-16" : "lg:ml-[220px]"
      )}>
        {/* Mobile header bar */}
        <div className="lg:hidden sticky top-16 z-30 flex items-center gap-3 px-4 py-3 bg-cyber-dark/98 border-b border-cyber-glass-border backdrop-blur-xl">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl bg-white/5 border border-cyber-glass-border text-gray-400 hover:text-white active:scale-95 transition-all"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-red-400" />
            <span className="text-white text-sm font-display font-bold">Admin Panel</span>
          </div>
          <div className="ml-auto flex items-center gap-1.5 px-2 py-1 bg-red-500/20 border border-red-500/30 rounded-lg">
            <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
            <span className="text-red-400 text-xs font-mono">LIVE</span>
          </div>
        </div>

        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}

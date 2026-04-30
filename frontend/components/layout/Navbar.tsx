"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Users,
  ShoppingBag,
  Play,
  Newspaper,
  LayoutDashboard,
  Menu,
  X,
  ChevronDown,
  Zap,
} from "lucide-react";
import { NotificationBell } from "@/components/features/notifications/NotificationBell";
import { useAuthStore } from "@/store/authStore";
import { useContentStore } from "@/store/contentStore";
import { UserMenu } from "@/components/features/auth/UserMenu";
import { cn } from "@/lib/utils";

const navLinks = [
  {
    label: "Турниры",
    href: "/tournaments",
    icon: Trophy,
    children: [
      { label: "Все турниры", href: "/tournaments" },
      { label: "Активные", href: "/tournaments?status=active" },
      { label: "Upcoming", href: "/tournaments?status=upcoming" },
      { label: "Архив", href: "/tournaments/archive" },
    ],
  },
  {
    label: "Команды",
    href: "/teams",
    icon: Users,
    children: [
      { label: "Рейтинг команд", href: "/teams" },
      { label: "Создать команду", href: "/teams/create" },
      { label: "Найти команду", href: "/teams/find" },
    ],
  },
  {
    label: "Медиа",
    href: "/media",
    icon: Play,
    children: [
      { label: "Все видео", href: "/media" },
      { label: "Хайлайты", href: "/media?cat=highlight" },
      { label: "Стримы", href: "/media?cat=stream" },
      { label: "Обучение", href: "/media?cat=educational" },
    ],
  },
  { label: "Новости", href: "/news", icon: Newspaper },
  { label: "Магазин", href: "/shop", icon: ShoppingBag },
  { label: "Сообщество", href: "/community", icon: Users },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();
  const { siteSettings } = useContentStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-cyber-dark/95 backdrop-blur-xl border-b border-cyber-glass-border shadow-glow"
          : "bg-transparent"
      )}
    >
      {/* Top ticker - live updates */}
      <div className="bg-cyber-purple-bright/20 border-b border-cyber-purple-bright/30 py-1 px-4 overflow-hidden">
        <div
          className="flex items-center gap-8 whitespace-nowrap animate-[ticker_30s_linear_infinite]"
        >
          <span className="flex items-center gap-2 text-xs text-cyber-neon font-sans">
            <Zap className="w-3 h-3 animate-pulse" />
            LIVE: CyberQELN Championship Season 2 — Финал через 2 часа
          </span>
          <span className="text-xs text-gray-500">•</span>
          <span className="text-xs text-gray-400 font-sans">
            🏆 Team Phantom vs Shadow Force — Полуфинал
          </span>
          <span className="text-xs text-gray-500">•</span>
          <span className="text-xs text-cyber-neon-pink font-sans">
            Новый скин "Neon Phantom" в магазине
          </span>
          <span className="text-xs text-gray-500">•</span>
          <span className="text-xs text-gray-400 font-sans">
            🎮 Открыта регистрация на квалификации Q2 2026
          </span>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            {siteSettings.logoUrl ? (
              <img
                src={siteSettings.logoUrl}
                alt={siteSettings.siteName || "CyberQELN"}
                style={{
                  height: `${siteSettings.logoHeight ?? 40}px`,
                  transform: `translate(${siteSettings.logoOffsetX ?? 0}px, ${siteSettings.logoOffsetY ?? 0}px)`,
                }}
                className="w-auto object-contain transition-opacity duration-300 group-hover:opacity-80"
              />
            ) : (
              <>
                <div className="relative mr-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyber-purple-bright to-cyber-neon-pink rounded-lg flex items-center justify-center shadow-neon">
                    <span className="font-display font-black text-white text-sm">{siteSettings.logoText || "CQ"}</span>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-cyber-purple-bright to-cyber-neon-pink rounded-lg opacity-0 group-hover:opacity-30 blur transition-opacity duration-300" />
                </div>
                <div>
                  <span className="font-display font-black text-xl text-gradient-cyber tracking-wider">
                    {(siteSettings.siteName || "CyberQELN").slice(0, 5).toUpperCase()}
                  </span>
                  <span className="font-display font-black text-xl text-white">
                    {(siteSettings.siteName || "CyberQELN").slice(5).toUpperCase()}
                  </span>
                </div>
              </>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => link.children && setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    pathname?.startsWith(link.href) && link.href !== "/"
                      ? "text-cyber-neon bg-cyber-neon/10"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                  {link.children && (
                    <ChevronDown
                      className={cn(
                        "w-3 h-3 transition-transform duration-200",
                        activeDropdown === link.label && "rotate-180"
                      )}
                    />
                  )}
                </Link>

                {/* Dropdown */}
                <AnimatePresence>
                  {link.children && activeDropdown === link.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-52 glass-card rounded-xl overflow-hidden py-2"
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-cyber-neon/10 transition-colors duration-150"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <NotificationBell />

                {/* Dashboard link */}
                <Link
                  href="/dashboard"
                  className="hidden md:flex items-center gap-1.5 px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                >
                  <LayoutDashboard className="w-4 h-4" />
                </Link>

                <UserMenu user={user} />
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="hidden sm:block px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Войти
                </Link>
                <Link
                  href="/auth/register"
                  className="hidden sm:block px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-cyber-purple-bright to-cyber-neon rounded-lg hover:shadow-neon transition-all duration-300"
                >
                  Регистрация
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>


      {/* Mobile menu — full screen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-cyber-dark/98 backdrop-blur-xl border-l border-cyber-glass-border z-50 lg:hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-cyber-glass-border">
                <span className="font-display font-bold text-white">Меню</span>
                <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto py-3 px-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-gray-300 hover:text-white hover:bg-cyber-neon/10 transition-all duration-200 mb-1"
                  >
                    <link.icon className="w-5 h-5 text-cyber-neon flex-shrink-0" />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                ))}
                {isAuthenticated && (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-gray-300 hover:text-white hover:bg-cyber-neon/10 transition-all duration-200 mb-1"
                  >
                    <LayoutDashboard className="w-5 h-5 text-cyber-neon flex-shrink-0" />
                    <span className="font-medium">Личный кабинет</span>
                  </Link>
                )}
              </nav>

              {/* Auth buttons */}
              {!isAuthenticated && (
                <div className="p-4 border-t border-cyber-glass-border flex flex-col gap-3">
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className="w-full text-center py-3.5 rounded-xl border border-cyber-glass-border text-gray-300 hover:text-white hover:bg-white/5 font-semibold transition-colors"
                  >
                    Войти
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setMobileOpen(false)}
                    className="w-full text-center py-3.5 rounded-xl bg-gradient-to-r from-cyber-purple-bright to-cyber-neon text-white font-semibold hover:shadow-neon transition-all"
                  >
                    Регистрация
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

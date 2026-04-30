"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users, Trophy, ShoppingBag, Newspaper, Play, Gamepad2,
  TrendingUp, AlertCircle, CheckCircle, XCircle, Shield,
  Eye, Edit, Trash2, UserCog, Home, Settings, ArrowRight, BarChart2,
} from "lucide-react";
import { useContentStore } from "@/store/contentStore";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  const { news, tournaments, products, videos, games, teams, users, siteSettings } = useContentStore();

  const activeUsers = users.filter((u) => u.status === "active").length;
  const activeTournaments = tournaments.filter((t) => t.status === "active" || t.status === "registration").length;
  const publishedNews = news.filter((n) => n.published).length;
  const bannedUsers = users.filter((u) => u.status === "banned").length;

  const stats = [
    { label: "Пользователей", value: users.length, sub: `${activeUsers} активных`, icon: Users, color: "text-cyber-neon", href: "/admin/users" },
    { label: "Турниров", value: tournaments.length, sub: `${activeTournaments} активных`, icon: Trophy, color: "text-yellow-400", href: "/admin/tournaments" },
    { label: "Товаров", value: products.length, sub: "в магазине", icon: ShoppingBag, color: "text-green-400", href: "/admin/shop" },
    { label: "Новостей", value: news.length, sub: `${publishedNews} опубликовано`, icon: Newspaper, color: "text-cyber-neon-pink", href: "/admin/news" },
    { label: "Видео", value: videos.length, sub: "в медиатеке", icon: Play, color: "text-cyber-neon-pink", href: "/admin/media" },
    { label: "Заблокировано", value: bannedUsers, sub: "пользователей", icon: AlertCircle, color: "text-red-400", href: "/admin/users" },
  ];

  const quickLinks = [
    { label: "Гл. страница", desc: "Hero, featured, баннер", icon: Home, href: "/admin/hero", color: "from-violet-600 to-purple-700" },
    { label: "Добавить новость", desc: "Опубликовать статью", icon: Newspaper, href: "/admin/news", color: "from-blue-600 to-cyan-600" },
    { label: "Новый турнир", desc: "Создать турнир", icon: Trophy, href: "/admin/tournaments", color: "from-yellow-600 to-orange-600" },
    { label: "Добавить товар", desc: "В магазин", icon: ShoppingBag, href: "/admin/shop", color: "from-green-600 to-teal-600" },
    { label: "Статистика главной", desc: "Цифры под hero-секцией", icon: BarChart2, href: "/admin/stats", color: "from-cyan-600 to-teal-600" },
    { label: "Настройки сайта", desc: "Название, цвета, баннер", icon: Settings, href: "/admin/settings", color: "from-gray-600 to-slate-600" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-red-500/20 border border-red-500/40 rounded-xl flex items-center justify-center">
          <Shield className="w-5 h-5 text-red-400" />
        </div>
        <div>
          <h1 className="font-display font-black text-2xl text-white">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm font-mono">CyberQELN Control Center</p>
        </div>
        <div className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-red-500/20 border border-red-500/40 rounded-lg">
          <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
          <span className="text-red-400 text-xs font-mono font-bold">ADMIN MODE</span>
        </div>
      </div>

      {/* Site info */}
      <div className="glass-card rounded-2xl p-4 flex items-center gap-4">
        <div className="w-10 h-10 bg-gradient-to-br from-cyber-purple-bright to-cyber-neon rounded-xl flex items-center justify-center text-white font-display font-black">
          {siteSettings.logoText}
        </div>
        <div>
          <p className="text-white font-bold">{siteSettings.siteName}</p>
          <p className="text-gray-500 text-sm">{siteSettings.tagline}</p>
        </div>
        {siteSettings.maintenanceMode && (
          <div className="ml-auto px-3 py-1 bg-yellow-500/20 border border-yellow-500/40 rounded-full text-yellow-400 text-xs font-mono">
            ⚠ Режим обслуживания
          </div>
        )}
        <Link href="/" target="_blank" className="ml-auto flex items-center gap-1.5 text-sm text-cyber-neon hover:text-white transition-colors">
          <Eye className="w-4 h-4" />
          Открыть сайт
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={stat.href}>
              <div className="stat-card cursor-pointer group">
                <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
                <div className={`font-display font-black text-2xl ${stat.color}`}>{stat.value}</div>
                <div className="text-white text-xs font-semibold">{stat.label}</div>
                <div className="text-gray-600 text-xs">{stat.sub}</div>
                <ArrowRight className="w-3 h-3 text-gray-700 group-hover:text-cyber-neon mt-1 transition-colors" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="font-display font-bold text-lg text-white mb-4">Быстрые действия</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {quickLinks.map((link, i) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
            >
              <Link href={link.href}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "p-5 rounded-2xl bg-gradient-to-br text-white cursor-pointer group",
                    link.color
                  )}
                >
                  <link.icon className="w-6 h-6 mb-3 group-hover:scale-110 transition-transform" />
                  <div className="font-display font-bold text-sm">{link.label}</div>
                  <div className="text-white/60 text-xs mt-0.5">{link.desc}</div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent activity - последние новости */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent news */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-cyber-glass-border">
            <h3 className="font-display font-bold text-white">Последние новости</h3>
            <Link href="/admin/news" className="text-cyber-neon text-xs hover:text-white transition-colors">
              Управление →
            </Link>
          </div>
          <div className="divide-y divide-cyber-glass-border">
            {news.slice(0, 4).map((article) => (
              <div key={article.id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition-colors">
                <div className={cn(
                  "w-2 h-2 rounded-full flex-shrink-0",
                  article.published ? "bg-green-400" : "bg-gray-600"
                )} />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">{article.title}</p>
                  <p className="text-gray-600 text-xs">{article.category} • {article.author}</p>
                </div>
                {article.featured && (
                  <span className="text-xs text-yellow-400 font-mono">★</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tournaments */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-cyber-glass-border">
            <h3 className="font-display font-bold text-white">Турниры</h3>
            <Link href="/admin/tournaments" className="text-cyber-neon text-xs hover:text-white transition-colors">
              Управление →
            </Link>
          </div>
          <div className="divide-y divide-cyber-glass-border">
            {tournaments.slice(0, 4).map((t) => (
              <div key={t.id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition-colors">
                <span className="text-lg">{t.gameIcon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">{t.title}</p>
                  <p className="text-gray-600 text-xs">{t.game} • {t.prizePool} UZS</p>
                </div>
                <span className={cn(
                  "text-xs font-mono px-2 py-0.5 rounded-full border",
                  t.status === "active" ? "text-red-400 bg-red-500/20 border-red-500/40" :
                  t.status === "registration" ? "text-green-400 bg-green-500/20 border-green-500/40" :
                  t.status === "upcoming" ? "text-yellow-400 bg-yellow-500/20 border-yellow-500/40" :
                  "text-gray-400 bg-gray-500/20 border-gray-500/40"
                )}>
                  {t.status === "active" ? "Live" : t.status === "registration" ? "Регистрация" : t.status === "upcoming" ? "Скоро" : "Завершён"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

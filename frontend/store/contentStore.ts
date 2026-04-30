import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  saveConfig, saveItem, deleteItem,
} from "@/lib/firestoreContent";

// ─── ТИПЫ ───────────────────────────────────────────────

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: number;
  featured: boolean;
  published: boolean;
  image: string;
}

export interface Tournament {
  id: string;
  title: string;
  game: string;
  status: "registration" | "active" | "upcoming" | "finished";
  prizePool: string;
  teamsRegistered: number;
  maxTeams: number;
  startDate: string;
  endDate: string;
  entryFee: string;
  gameIcon: string;
  featured: boolean;
  description: string;
  format: string;
  organizer: string;
  banner: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  category: string;
  badge?: string;
  badgeColor?: string;
  icon: string;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  featured: boolean;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  category: "highlight" | "tournament" | "stream" | "educational" | "interview";
  views: number;
  featured: boolean;
  publishedAt: string;
}

export interface Game {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  image: string;
  active: boolean;
  featured: boolean;
  description: string;
  color: string;
}

export interface HeroSettings {
  featuredTournamentId: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  backgroundStyle: "default" | "custom";
  backgroundImage: string;
  backgroundVideo: string;
  backgroundOverlay: number;
  showLiveBadge: boolean;
  heroMode: "text" | "logo";
  heroLogoUrl: string;
  heroLogoHeight: number;
  heroLogoOffsetX: number;
  heroLogoOffsetY: number;
  headlineColor: string;
  headlineColor2: string;
  subheadlineColor: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  logoText: string;
  logoUrl: string;
  logoHeight: number;
  logoOffsetX: number;
  logoOffsetY: number;
  primaryColor: string;
  accentColor: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  announcementBanner: string;
  announcementEnabled: boolean;
}

export interface SocialLink {
  id: string;
  name: string;
  desc: string;
  icon: string;
  color: string;
  members: string;
  href: string;
}

export interface FaqItem {
  id: string;
  q: string;
  a: string;
}

export interface CommunityStat {
  id: string;
  label: string;
  value: string;
  iconName: "Users" | "Trophy" | "Star" | "MessageCircle";
  color: string;
}

export interface StatItem {
  id: string;
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
  icon: "Users" | "Trophy" | "DollarSign" | "Gamepad2" | "Globe" | "Zap" | "Star" | "Shield";
  color: string;
  description: string;
  source?: "players" | "tournaments_finished" | "registrations_approved" | "prize_total";
}

export interface ShopPromo {
  enabled: boolean;
  title: string;
  description: string;
  promoCode: string;
  buttonText: string;
  buttonHref: string;
}

export interface LiveBanner {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  youtubeUrl: string;
  isLive: boolean;
  active: boolean;
  publishedAt: string;
}

export interface CommunitySettings {
  title: string;
  subtitle: string;
  stats: CommunityStat[];
  socialsTitle: string;
  socials: SocialLink[];
  faqTitle: string;
  faq: FaqItem[];
  ctaTitle: string;
  ctaSubtitle: string;
  ctaPrimaryText: string;
  ctaPrimaryHref: string;
  ctaSecondaryText: string;
  ctaSecondaryHref: string;
}

export interface Team {
  id: string;
  name: string;
  tag: string;
  logo: string;
  country: string;
  rating: number;
  wins: number;
  losses: number;
  members: number;
  active: boolean;
  description: string;
  createdAt: string;
}

export interface SiteUser {
  id: string;
  nickname: string;
  email: string;
  role: "user" | "moderator" | "admin";
  status: "active" | "banned" | "suspended";
  rating: number;
  country: string;
  joinedAt: string;
  lastSeen: string;
}

export interface FooterLink { id: string; label: string; href: string; }
export interface FooterSection { id: string; title: string; links: FooterLink[]; }
export interface FooterSocial { id: string; label: string; href: string; iconId: string; }
export interface FooterSettings {
  description: string;
  copyright: string;
  sections: FooterSection[];
  socials: FooterSocial[];
}

// ─── НАЧАЛЬНЫЕ ДАННЫЕ ────────────────────────────────────

const initialGames: Game[] = [
  { id: "g1", name: "Mobile Legends: Bang Bang", shortName: "MLBB", icon: "🎮", image: "", active: true, featured: true, description: "Главная игра платформы CyberQELN в регионе СНГ.", color: "#a855f7" },
  { id: "g2", name: "PUBG Mobile", shortName: "PUBG", icon: "🔫", image: "", active: true, featured: true, description: "Battle Royale на мобильных устройствах.", color: "#f59e0b" },
  { id: "g3", name: "Honor of Kings", shortName: "HOK", icon: "⚔️", image: "", active: true, featured: true, description: "Популярная MOBA от Tencent.", color: "#a855f7" },
];

const initialLiveBanners: LiveBanner[] = [
  { id: "lb1", title: "CyberQELN Championship S2 — Финал", description: "Смотри финальный матч в прямом эфире на нашем YouTube канале", thumbnailUrl: "", youtubeUrl: "https://youtube.com/live/example", isLive: true, active: true, publishedAt: "2026-04-22T18:00:00" },
  { id: "lb2", title: "Обзор патча 1.8.94 — Mobile Legends", description: "Полный разбор изменений новой меты с профессиональным аналитиком", thumbnailUrl: "", youtubeUrl: "https://youtube.com/watch?v=example2", isLive: false, active: true, publishedAt: "2026-04-20T14:00:00" },
];

const initialCommunitySettings: CommunitySettings = {
  title: "Сообщество", subtitle: "Присоединяйся к растущему сообществу CyberQELN",
  stats: [
    { id: "s1", label: "Игроков", value: "12,400+", iconName: "Users", color: "text-cyber-neon" },
    { id: "s2", label: "Турниров", value: "340+", iconName: "Trophy", color: "text-yellow-400" },
    { id: "s3", label: "Команд", value: "890+", iconName: "Star", color: "text-pink-400" },
    { id: "s4", label: "Сообщений", value: "150K+", iconName: "MessageCircle", color: "text-blue-400" },
  ],
  socialsTitle: "Наши платформы",
  socials: [
    { id: "sc1", name: "Telegram", desc: "Основной канал новостей и анонсов", icon: "✈️", color: "from-blue-600 to-blue-400", members: "12.4K", href: "#" },
    { id: "sc2", name: "Discord", desc: "Общение, поиск тиммейтов, турниры", icon: "🎮", color: "from-indigo-600 to-indigo-400", members: "8.7K", href: "#" },
    { id: "sc3", name: "YouTube", desc: "Хайлайты, разборы и стримы", icon: "▶️", color: "from-red-600 to-red-400", members: "24K", href: "#" },
    { id: "sc4", name: "Instagram", desc: "Фото с турниров и жизнь платформы", icon: "📸", color: "from-pink-600 to-orange-400", members: "18K", href: "#" },
  ],
  faqTitle: "Частые вопросы",
  faq: [
    { id: "f1", q: "Как зарегистрироваться на турнир?", a: "Создай аккаунт, перейди в раздел Турниры, выбери подходящий и нажми «Зарегистрироваться». Нужна команда минимум из 5 игроков." },
    { id: "f2", q: "Как создать команду?", a: "После регистрации зайди в личный кабинет → Команда → Создать. Пригласи участников по их никнейму или email." },
    { id: "f3", q: "Как получить приз?", a: "После завершения турнира призы выплачиваются на банковскую карту в течение 7 рабочих дней. Нужен верифицированный аккаунт." },
    { id: "f4", q: "Можно ли участвовать из другой страны?", a: "Да! Платформа открыта для всего СНГ. Турниры доступны игрокам из Узбекистана, Казахстана, России, Кыргызстана и других стран." },
  ],
  ctaTitle: "Готов присоединиться?", ctaSubtitle: "Создай аккаунт и начни участвовать в турнирах уже сегодня",
  ctaPrimaryText: "Регистрация", ctaPrimaryHref: "/auth/register",
  ctaSecondaryText: "Смотреть турниры", ctaSecondaryHref: "/tournaments",
};

const initialFooterSettings: FooterSettings = {
  description: "Главная киберспортивная экосистема СНГ. Объединяем игроков, команды и болельщиков.",
  copyright: "© 2026 CyberQELN. Все права защищены.",
  sections: [
    { id: "fs1", title: "Платформа", links: [{ id: "fl1", label: "О нас", href: "/about" }, { id: "fl2", label: "Турниры", href: "/tournaments" }, { id: "fl3", label: "Команды", href: "/teams" }, { id: "fl4", label: "Медиа", href: "/media" }] },
    { id: "fs2", title: "Сообщество", links: [{ id: "fl5", label: "Discord", href: "https://discord.gg/cyberqeln" }, { id: "fl6", label: "Телеграм", href: "https://t.me/cyberqeln" }, { id: "fl7", label: "Новости", href: "/news" }] },
    { id: "fs3", title: "Магазин", links: [{ id: "fl8", label: "Мерч", href: "/shop" }, { id: "fl9", label: "Доставка", href: "/shop/delivery" }] },
    { id: "fs4", title: "Поддержка", links: [{ id: "fl10", label: "FAQ", href: "/faq" }, { id: "fl11", label: "Правила", href: "/rules" }, { id: "fl12", label: "Контакты", href: "/contact" }] },
  ],
  socials: [
    { id: "fsoc1", label: "YouTube", href: "https://youtube.com/@cyberqeln", iconId: "youtube" },
    { id: "fsoc2", label: "Telegram", href: "https://t.me/cyberqeln", iconId: "telegram" },
    { id: "fsoc3", label: "Instagram", href: "https://instagram.com/cyberqeln", iconId: "instagram" },
    { id: "fsoc4", label: "Twitter", href: "https://twitter.com/cyberqeln", iconId: "twitter" },
  ],
};

// ─── STORE ───────────────────────────────────────────────

interface ContentState {
  news: NewsArticle[];
  tournaments: Tournament[];
  products: Product[];
  videos: Video[];
  games: Game[];
  teams: Team[];
  users: SiteUser[];
  homeStats: StatItem[];
  shopPromo: ShopPromo;
  heroSettings: HeroSettings;
  siteSettings: SiteSettings;
  communitySettings: CommunitySettings;
  footerSettings: FooterSettings;
  liveBanners: LiveBanner[];

  // Used by FirestoreSync to push remote data without triggering re-write to Firestore
  _syncFromFirestore: (patch: Partial<Omit<ContentState, keyof ContentActions | "_syncFromFirestore">>) => void;

  // News
  addNews: (item: Omit<NewsArticle, "id">) => void;
  updateNews: (id: string, data: Partial<NewsArticle>) => void;
  deleteNews: (id: string) => void;

  // Tournaments
  addTournament: (item: Omit<Tournament, "id">) => void;
  updateTournament: (id: string, data: Partial<Tournament>) => void;
  deleteTournament: (id: string) => void;

  // Products
  addProduct: (item: Omit<Product, "id">) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Videos
  addVideo: (item: Omit<Video, "id">) => void;
  updateVideo: (id: string, data: Partial<Video>) => void;
  deleteVideo: (id: string) => void;

  // Games
  addGame: (item: Omit<Game, "id">) => void;
  updateGame: (id: string, data: Partial<Game>) => void;
  deleteGame: (id: string) => void;

  // Teams
  addTeam: (item: Omit<Team, "id">) => void;
  updateTeam: (id: string, data: Partial<Team>) => void;
  deleteTeam: (id: string) => void;

  // Users (local only — real users are in Firestore users collection)
  updateUser: (id: string, data: Partial<SiteUser>) => void;
  deleteUser: (id: string) => void;
  addUser: (item: Omit<SiteUser, "id">) => void;

  // Stats
  addStat: (item: Omit<StatItem, "id">) => void;
  updateStat: (id: string, data: Partial<StatItem>) => void;
  deleteStat: (id: string) => void;

  // ShopPromo
  updateShopPromo: (data: Partial<ShopPromo>) => void;

  // Settings
  updateHeroSettings: (data: Partial<HeroSettings>) => void;
  updateSiteSettings: (data: Partial<SiteSettings>) => void;
  updateFooterSettings: (data: Partial<FooterSettings>) => void;
  addFooterSection: (item: Omit<FooterSection, "id">) => void;
  updateFooterSection: (id: string, data: Partial<FooterSection>) => void;
  deleteFooterSection: (id: string) => void;
  addFooterLink: (sectionId: string, item: Omit<FooterLink, "id">) => void;
  updateFooterLink: (sectionId: string, linkId: string, data: Partial<FooterLink>) => void;
  deleteFooterLink: (sectionId: string, linkId: string) => void;
  addFooterSocial: (item: Omit<FooterSocial, "id">) => void;
  updateFooterSocial: (id: string, data: Partial<FooterSocial>) => void;
  deleteFooterSocial: (id: string) => void;
  addLiveBanner: (item: Omit<LiveBanner, "id">) => void;
  updateLiveBanner: (id: string, data: Partial<LiveBanner>) => void;
  deleteLiveBanner: (id: string) => void;
  updateCommunitySettings: (data: Partial<CommunitySettings>) => void;
  addSocial: (item: Omit<SocialLink, "id">) => void;
  updateSocial: (id: string, data: Partial<SocialLink>) => void;
  deleteSocial: (id: string) => void;
  addFaq: (item: Omit<FaqItem, "id">) => void;
  updateFaq: (id: string, data: Partial<FaqItem>) => void;
  deleteFaq: (id: string) => void;
  updateCommunityStat: (id: string, data: Partial<CommunityStat>) => void;
}

type ContentActions = Omit<ContentState,
  "news" | "tournaments" | "products" | "videos" | "games" | "teams" | "users" |
  "homeStats" | "shopPromo" | "heroSettings" | "siteSettings" | "communitySettings" |
  "footerSettings" | "liveBanners"
>;

const uid = () => Math.random().toString(36).slice(2, 10);

// Debounce helpers for settings (sliders fire rapidly)
const debounceMap = new Map<string, ReturnType<typeof setTimeout>>();
function debouncedSaveConfig(key: string, data: object, ms = 600) {
  if (debounceMap.has(key)) clearTimeout(debounceMap.get(key)!);
  debounceMap.set(key, setTimeout(() => { saveConfig(key, data); debounceMap.delete(key); }, ms));
}

export const useContentStore = create<ContentState>()(
  persist(
    (set, get) => ({
      news: [],
      tournaments: [],
      products: [],
      videos: [],
      games: initialGames,
      teams: [],
      users: [],
      homeStats: [],
      shopPromo: { enabled: false, title: "", description: "", promoCode: "", buttonText: "Открыть магазин", buttonHref: "/shop" },

      heroSettings: {
        featuredTournamentId: "t1",
        headline: "CYBERQELN",
        subheadline: "ESPORTS ECOSYSTEM",
        ctaText: "Участвовать",
        backgroundStyle: "default",
        backgroundImage: "",
        backgroundVideo: "",
        backgroundOverlay: 60,
        showLiveBadge: true,
        heroMode: "text",
        heroLogoUrl: "",
        heroLogoHeight: 120,
        heroLogoOffsetX: 0,
        heroLogoOffsetY: 0,
        headlineColor: "#ffffff",
        headlineColor2: "#a855f7",
        subheadlineColor: "#9ca3af",
      },

      siteSettings: {
        siteName: "CyberQELN",
        tagline: "Главная киберспортивная платформа СНГ",
        logoText: "CQ",
        logoUrl: "",
        logoHeight: 40,
        logoOffsetX: 0,
        logoOffsetY: 0,
        primaryColor: "#a855f7",
        accentColor: "#e879f9",
        maintenanceMode: false,
        registrationEnabled: true,
        announcementBanner: "🏆 CyberQELN Championship S2 — Финал уже скоро!",
        announcementEnabled: true,
      },

      communitySettings: initialCommunitySettings,
      footerSettings: initialFooterSettings,
      liveBanners: initialLiveBanners,

      // Internal: push Firestore data to store without triggering re-write
      _syncFromFirestore: (patch) => set(patch as Partial<ContentState>),

      // ── LiveBanners ──────────────────────────────
      addLiveBanner: (item) => set((s) => {
        const n = { ...item, id: uid() };
        const next = [n, ...s.liveBanners];
        saveConfig("liveBanners", { items: next });
        return { liveBanners: next };
      }),
      updateLiveBanner: (id, data) => set((s) => {
        const next = s.liveBanners.map((b) => b.id === id ? { ...b, ...data } : b);
        saveConfig("liveBanners", { items: next });
        return { liveBanners: next };
      }),
      deleteLiveBanner: (id) => set((s) => {
        const next = s.liveBanners.filter((b) => b.id !== id);
        saveConfig("liveBanners", { items: next });
        return { liveBanners: next };
      }),

      // ── News ─────────────────────────────────────
      addNews: (item) => set((s) => {
        const n = { ...item, id: uid() };
        saveItem("news", n.id, n);
        return { news: [n, ...s.news] };
      }),
      updateNews: (id, data) => set((s) => {
        const next = s.news.map((n) => n.id === id ? { ...n, ...data } : n);
        const updated = next.find((n) => n.id === id);
        if (updated) saveItem("news", id, updated);
        return { news: next };
      }),
      deleteNews: (id) => set((s) => {
        deleteItem("news", id);
        return { news: s.news.filter((n) => n.id !== id) };
      }),

      // ── Tournaments ──────────────────────────────
      addTournament: (item) => set((s) => {
        const n = { ...item, id: uid() };
        saveItem("tournaments", n.id, n);
        return { tournaments: [n, ...s.tournaments] };
      }),
      updateTournament: (id, data) => set((s) => {
        const next = s.tournaments.map((t) => t.id === id ? { ...t, ...data } : t);
        const updated = next.find((t) => t.id === id);
        if (updated) saveItem("tournaments", id, updated);
        return { tournaments: next };
      }),
      deleteTournament: (id) => set((s) => {
        deleteItem("tournaments", id);
        return { tournaments: s.tournaments.filter((t) => t.id !== id) };
      }),

      // ── Products ─────────────────────────────────
      addProduct: (item) => set((s) => {
        const n = { ...item, id: uid() };
        saveItem("products", n.id, n);
        return { products: [n, ...s.products] };
      }),
      updateProduct: (id, data) => set((s) => {
        const next = s.products.map((p) => p.id === id ? { ...p, ...data } : p);
        const updated = next.find((p) => p.id === id);
        if (updated) saveItem("products", id, updated);
        return { products: next };
      }),
      deleteProduct: (id) => set((s) => {
        deleteItem("products", id);
        return { products: s.products.filter((p) => p.id !== id) };
      }),

      // ── Videos ───────────────────────────────────
      addVideo: (item) => set((s) => {
        const n = { ...item, id: uid() };
        saveItem("videos", n.id, n);
        return { videos: [n, ...s.videos] };
      }),
      updateVideo: (id, data) => set((s) => {
        const next = s.videos.map((v) => v.id === id ? { ...v, ...data } : v);
        const updated = next.find((v) => v.id === id);
        if (updated) saveItem("videos", id, updated);
        return { videos: next };
      }),
      deleteVideo: (id) => set((s) => {
        deleteItem("videos", id);
        return { videos: s.videos.filter((v) => v.id !== id) };
      }),

      // ── Games ────────────────────────────────────
      addGame: (item) => set((s) => {
        const n = { ...item, id: uid() };
        saveItem("games", n.id, n);
        return { games: [n, ...s.games] };
      }),
      updateGame: (id, data) => set((s) => {
        const next = s.games.map((g) => g.id === id ? { ...g, ...data } : g);
        const updated = next.find((g) => g.id === id);
        if (updated) saveItem("games", id, updated);
        return { games: next };
      }),
      deleteGame: (id) => set((s) => {
        deleteItem("games", id);
        return { games: s.games.filter((g) => g.id !== id) };
      }),

      // ── Teams ────────────────────────────────────
      addTeam: (item) => set((s) => {
        const n = { ...item, id: uid() };
        saveItem("teams", n.id, n);
        return { teams: [n, ...s.teams] };
      }),
      updateTeam: (id, data) => set((s) => {
        const next = s.teams.map((t) => t.id === id ? { ...t, ...data } : t);
        const updated = next.find((t) => t.id === id);
        if (updated) saveItem("teams", id, updated);
        return { teams: next };
      }),
      deleteTeam: (id) => set((s) => {
        deleteItem("teams", id);
        return { teams: s.teams.filter((t) => t.id !== id) };
      }),

      // ── Users (local) ────────────────────────────
      addUser: (item) => set((s) => ({ users: [{ ...item, id: uid() }, ...s.users] })),
      updateUser: (id, data) => set((s) => ({ users: s.users.map((u) => u.id === id ? { ...u, ...data } : u) })),
      deleteUser: (id) => set((s) => ({ users: s.users.filter((u) => u.id !== id) })),

      // ── Stats ────────────────────────────────────
      addStat: (item) => set((s) => {
        const next = [...s.homeStats, { ...item, id: uid() }];
        saveConfig("homeStats", { items: next });
        return { homeStats: next };
      }),
      updateStat: (id, data) => set((s) => {
        const next = s.homeStats.map((st) => st.id === id ? { ...st, ...data } : st);
        saveConfig("homeStats", { items: next });
        return { homeStats: next };
      }),
      deleteStat: (id) => set((s) => {
        const next = s.homeStats.filter((st) => st.id !== id);
        saveConfig("homeStats", { items: next });
        return { homeStats: next };
      }),

      // ── ShopPromo ────────────────────────────────
      updateShopPromo: (data) => set((s) => {
        const next = { ...s.shopPromo, ...data };
        saveConfig("shopPromo", next);
        return { shopPromo: next };
      }),

      // ── Settings (debounced for sliders) ─────────
      updateHeroSettings: (data) => set((s) => {
        const next = { ...s.heroSettings, ...data };
        debouncedSaveConfig("heroSettings", next);
        return { heroSettings: next };
      }),
      updateSiteSettings: (data) => set((s) => {
        const next = { ...s.siteSettings, ...data };
        debouncedSaveConfig("siteSettings", next);
        return { siteSettings: next };
      }),
      updateCommunitySettings: (data) => set((s) => {
        const next = { ...s.communitySettings, ...data };
        saveConfig("communitySettings", next);
        return { communitySettings: next };
      }),

      // ── Community sub-actions ────────────────────
      addSocial: (item) => set((s) => {
        const cs = { ...s.communitySettings, socials: [...s.communitySettings.socials, { ...item, id: uid() }] };
        saveConfig("communitySettings", cs);
        return { communitySettings: cs };
      }),
      updateSocial: (id, data) => set((s) => {
        const cs = { ...s.communitySettings, socials: s.communitySettings.socials.map((sc) => sc.id === id ? { ...sc, ...data } : sc) };
        saveConfig("communitySettings", cs);
        return { communitySettings: cs };
      }),
      deleteSocial: (id) => set((s) => {
        const cs = { ...s.communitySettings, socials: s.communitySettings.socials.filter((sc) => sc.id !== id) };
        saveConfig("communitySettings", cs);
        return { communitySettings: cs };
      }),
      addFaq: (item) => set((s) => {
        const cs = { ...s.communitySettings, faq: [...s.communitySettings.faq, { ...item, id: uid() }] };
        saveConfig("communitySettings", cs);
        return { communitySettings: cs };
      }),
      updateFaq: (id, data) => set((s) => {
        const cs = { ...s.communitySettings, faq: s.communitySettings.faq.map((f) => f.id === id ? { ...f, ...data } : f) };
        saveConfig("communitySettings", cs);
        return { communitySettings: cs };
      }),
      deleteFaq: (id) => set((s) => {
        const cs = { ...s.communitySettings, faq: s.communitySettings.faq.filter((f) => f.id !== id) };
        saveConfig("communitySettings", cs);
        return { communitySettings: cs };
      }),
      updateCommunityStat: (id, data) => set((s) => {
        const cs = { ...s.communitySettings, stats: s.communitySettings.stats.map((st) => st.id === id ? { ...st, ...data } : st) };
        saveConfig("communitySettings", cs);
        return { communitySettings: cs };
      }),

      // ── Footer actions ───────────────────────────
      updateFooterSettings: (data) => set((s) => {
        const next = { ...s.footerSettings, ...data };
        saveConfig("footerSettings", next);
        return { footerSettings: next };
      }),
      addFooterSection: (item) => set((s) => {
        const next = { ...s.footerSettings, sections: [...s.footerSettings.sections, { ...item, id: uid() }] };
        saveConfig("footerSettings", next);
        return { footerSettings: next };
      }),
      updateFooterSection: (id, data) => set((s) => {
        const next = { ...s.footerSettings, sections: s.footerSettings.sections.map((sec) => sec.id === id ? { ...sec, ...data } : sec) };
        saveConfig("footerSettings", next);
        return { footerSettings: next };
      }),
      deleteFooterSection: (id) => set((s) => {
        const next = { ...s.footerSettings, sections: s.footerSettings.sections.filter((sec) => sec.id !== id) };
        saveConfig("footerSettings", next);
        return { footerSettings: next };
      }),
      addFooterLink: (sectionId, item) => set((s) => {
        const next = { ...s.footerSettings, sections: s.footerSettings.sections.map((sec) => sec.id === sectionId ? { ...sec, links: [...sec.links, { ...item, id: uid() }] } : sec) };
        saveConfig("footerSettings", next);
        return { footerSettings: next };
      }),
      updateFooterLink: (sectionId, linkId, data) => set((s) => {
        const next = { ...s.footerSettings, sections: s.footerSettings.sections.map((sec) => sec.id === sectionId ? { ...sec, links: sec.links.map((l) => l.id === linkId ? { ...l, ...data } : l) } : sec) };
        saveConfig("footerSettings", next);
        return { footerSettings: next };
      }),
      deleteFooterLink: (sectionId, linkId) => set((s) => {
        const next = { ...s.footerSettings, sections: s.footerSettings.sections.map((sec) => sec.id === sectionId ? { ...sec, links: sec.links.filter((l) => l.id !== linkId) } : sec) };
        saveConfig("footerSettings", next);
        return { footerSettings: next };
      }),
      addFooterSocial: (item) => set((s) => {
        const next = { ...s.footerSettings, socials: [...s.footerSettings.socials, { ...item, id: uid() }] };
        saveConfig("footerSettings", next);
        return { footerSettings: next };
      }),
      updateFooterSocial: (id, data) => set((s) => {
        const next = { ...s.footerSettings, socials: s.footerSettings.socials.map((soc) => soc.id === id ? { ...soc, ...data } : soc) };
        saveConfig("footerSettings", next);
        return { footerSettings: next };
      }),
      deleteFooterSocial: (id) => set((s) => {
        const next = { ...s.footerSettings, socials: s.footerSettings.socials.filter((soc) => soc.id !== id) };
        saveConfig("footerSettings", next);
        return { footerSettings: next };
      }),
    }),
    {
      name: "cyberqeln-content-v5",
      partialize: (state) => ({
        ...state,
        heroSettings: {
          ...state.heroSettings,
          backgroundVideo: state.heroSettings.backgroundVideo?.startsWith("blob:") || state.heroSettings.backgroundVideo?.startsWith("data:")
            ? "" : (state.heroSettings.backgroundVideo ?? ""),
          backgroundImage: state.heroSettings.backgroundImage?.startsWith("blob:")
            ? "" : (state.heroSettings.backgroundImage ?? ""),
        },
      }),
    }
  )
);

// In-memory store for video blob URLs (not persisted)
interface MediaBlobState {
  heroBlobVideo: string;
  setHeroBlobVideo: (url: string) => void;
}
export const useMediaBlobStore = create<MediaBlobState>()((set) => ({
  heroBlobVideo: "",
  setHeroBlobVideo: (url) => set({ heroBlobVideo: url }),
}));

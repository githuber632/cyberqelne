import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─── ТИПЫ ───────────────────────────────────────────────

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  publishedAt: string; // ISO string
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
  showLiveBadge: boolean;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  logoText: string;
  logoUrl: string;
  logoHeight: number;
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

// ─── НАЧАЛЬНЫЕ ДАННЫЕ ────────────────────────────────────

const initialNews: NewsArticle[] = [];

const initialTournaments: Tournament[] = [];

const initialProducts: Product[] = [];

const initialVideos: Video[] = [];

const initialGames: Game[] = [
  {
    id: "g1",
    name: "Mobile Legends: Bang Bang",
    shortName: "MLBB",
    icon: "🎮",
    image: "",
    active: true,
    featured: true,
    description: "Главная игра платформы CyberQELN в регионе СНГ.",
    color: "#a855f7",
  },
  {
    id: "g2",
    name: "PUBG Mobile",
    shortName: "PUBG",
    icon: "🔫",
    image: "",
    active: true,
    featured: true,
    description: "Battle Royale на мобильных устройствах.",
    color: "#f59e0b",
  },
  {
    id: "g3",
    name: "Honor of Kings",
    shortName: "HOK",
    icon: "⚔️",
    image: "",
    active: true,
    featured: true,
    description: "Популярная MOBA от Tencent.",
    color: "#22d3ee",
  },
];

const initialStats: StatItem[] = [];

const initialShopPromo: ShopPromo = {
  enabled: false,
  title: "",
  description: "",
  promoCode: "",
  buttonText: "Открыть магазин",
  buttonHref: "/shop",
};

const initialTeams: Team[] = [];

const initialUsers: SiteUser[] = [];

const initialLiveBanners: LiveBanner[] = [
  {
    id: "lb1",
    title: "CyberQELN Championship S2 — Финал",
    description: "Смотри финальный матч в прямом эфире на нашем YouTube канале",
    thumbnailUrl: "",
    youtubeUrl: "https://youtube.com/live/example",
    isLive: true,
    active: true,
    publishedAt: "2026-04-22T18:00:00",
  },
  {
    id: "lb2",
    title: "Обзор патча 1.8.94 — Mobile Legends",
    description: "Полный разбор изменений новой меты с профессиональным аналитиком",
    thumbnailUrl: "",
    youtubeUrl: "https://youtube.com/watch?v=example2",
    isLive: false,
    active: true,
    publishedAt: "2026-04-20T14:00:00",
  },
];

const initialCommunitySettings: CommunitySettings = {
  title: "Сообщество",
  subtitle: "Присоединяйся к растущему сообществу CyberQELN",
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
  ctaTitle: "Готов присоединиться?",
  ctaSubtitle: "Создай аккаунт и начни участвовать в турнирах уже сегодня",
  ctaPrimaryText: "Регистрация",
  ctaPrimaryHref: "/auth/register",
  ctaSecondaryText: "Смотреть турниры",
  ctaSecondaryHref: "/tournaments",
};

// ─── FOOTER ─────────────────────────────────────────────

export interface FooterLink {
  id: string;
  label: string;
  href: string;
}

export interface FooterSection {
  id: string;
  title: string;
  links: FooterLink[];
}

export interface FooterSocial {
  id: string;
  label: string;
  href: string;
  iconId: string; // key from SOCIAL_PLATFORMS (e.g. "youtube", "telegram")
}

export interface FooterSettings {
  description: string;
  copyright: string;
  sections: FooterSection[];
  socials: FooterSocial[];
}

const initialFooterSettings: FooterSettings = {
  description: "Главная киберспортивная экосистема СНГ. Объединяем игроков, команды и болельщиков.",
  copyright: "© 2026 CyberQELN. Все права защищены.",
  sections: [
    {
      id: "fs1", title: "Платформа", links: [
        { id: "fl1", label: "О нас", href: "/about" },
        { id: "fl2", label: "Турниры", href: "/tournaments" },
        { id: "fl3", label: "Команды", href: "/teams" },
        { id: "fl4", label: "Медиа", href: "/media" },
      ],
    },
    {
      id: "fs2", title: "Сообщество", links: [
        { id: "fl5", label: "Discord", href: "https://discord.gg/cyberqeln" },
        { id: "fl6", label: "Телеграм", href: "https://t.me/cyberqeln" },
        { id: "fl7", label: "Новости", href: "/news" },
      ],
    },
    {
      id: "fs3", title: "Магазин", links: [
        { id: "fl8", label: "Мерч", href: "/shop" },
        { id: "fl9", label: "Доставка", href: "/shop/delivery" },
      ],
    },
    {
      id: "fs4", title: "Поддержка", links: [
        { id: "fl10", label: "FAQ", href: "/faq" },
        { id: "fl11", label: "Правила", href: "/rules" },
        { id: "fl12", label: "Контакты", href: "/contact" },
      ],
    },
  ],
  socials: [
    { id: "fsoc1", label: "YouTube",   href: "https://youtube.com/@cyberqeln",  iconId: "youtube"   },
    { id: "fsoc2", label: "Telegram",  href: "https://t.me/cyberqeln",          iconId: "telegram"  },
    { id: "fsoc3", label: "Instagram", href: "https://instagram.com/cyberqeln", iconId: "instagram" },
    { id: "fsoc4", label: "Twitter",   href: "https://twitter.com/cyberqeln",   iconId: "twitter"   },
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

  // Users
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

const uid = () => Math.random().toString(36).slice(2, 10);

export const useContentStore = create<ContentState>()(
  persist(
    (set) => ({
      news: initialNews,
      tournaments: initialTournaments,
      products: initialProducts,
      videos: initialVideos,
      games: initialGames,
      teams: initialTeams,
      users: initialUsers,
      homeStats: initialStats,
      shopPromo: initialShopPromo,

      heroSettings: {
        featuredTournamentId: "t1",
        headline: "CYBERQELN",
        subheadline: "ESPORTS ECOSYSTEM",
        ctaText: "Участвовать",
        backgroundStyle: "default",
        backgroundImage: "",
        showLiveBadge: true,
      },

      siteSettings: {
        siteName: "CyberQELN",
        tagline: "Главная киберспортивная платформа СНГ",
        logoText: "CQ",
        logoUrl: "",
        logoHeight: 40,
        primaryColor: "#a855f7",
        accentColor: "#22d3ee",
        maintenanceMode: false,
        registrationEnabled: true,
        announcementBanner: "🏆 CyberQELN Championship S2 — Финал уже скоро!",
        announcementEnabled: true,
      },

      communitySettings: initialCommunitySettings,
      footerSettings: initialFooterSettings,
      liveBanners: initialLiveBanners,

      // LiveBanner actions
      addLiveBanner: (item) => set((s) => ({ liveBanners: [{ ...item, id: uid() }, ...s.liveBanners] })),
      updateLiveBanner: (id, data) => set((s) => ({ liveBanners: s.liveBanners.map((b) => b.id === id ? { ...b, ...data } : b) })),
      deleteLiveBanner: (id) => set((s) => ({ liveBanners: s.liveBanners.filter((b) => b.id !== id) })),

      // News actions
      addNews: (item) => set((s) => ({ news: [{ ...item, id: uid() }, ...s.news] })),
      updateNews: (id, data) => set((s) => ({ news: s.news.map((n) => n.id === id ? { ...n, ...data } : n) })),
      deleteNews: (id) => set((s) => ({ news: s.news.filter((n) => n.id !== id) })),

      // Tournaments actions
      addTournament: (item) => set((s) => ({ tournaments: [{ ...item, id: uid() }, ...s.tournaments] })),
      updateTournament: (id, data) => set((s) => ({ tournaments: s.tournaments.map((t) => t.id === id ? { ...t, ...data } : t) })),
      deleteTournament: (id) => set((s) => ({ tournaments: s.tournaments.filter((t) => t.id !== id) })),

      // Products actions
      addProduct: (item) => set((s) => ({ products: [{ ...item, id: uid() }, ...s.products] })),
      updateProduct: (id, data) => set((s) => ({ products: s.products.map((p) => p.id === id ? { ...p, ...data } : p) })),
      deleteProduct: (id) => set((s) => ({ products: s.products.filter((p) => p.id !== id) })),

      // Videos actions
      addVideo: (item) => set((s) => ({ videos: [{ ...item, id: uid() }, ...s.videos] })),
      updateVideo: (id, data) => set((s) => ({ videos: s.videos.map((v) => v.id === id ? { ...v, ...data } : v) })),
      deleteVideo: (id) => set((s) => ({ videos: s.videos.filter((v) => v.id !== id) })),

      // Games actions
      addGame: (item) => set((s) => ({ games: [{ ...item, id: uid() }, ...s.games] })),
      updateGame: (id, data) => set((s) => ({ games: s.games.map((g) => g.id === id ? { ...g, ...data } : g) })),
      deleteGame: (id) => set((s) => ({ games: s.games.filter((g) => g.id !== id) })),

      // Teams actions
      addTeam: (item) => set((s) => ({ teams: [{ ...item, id: uid() }, ...s.teams] })),
      updateTeam: (id, data) => set((s) => ({ teams: s.teams.map((t) => t.id === id ? { ...t, ...data } : t) })),
      deleteTeam: (id) => set((s) => ({ teams: s.teams.filter((t) => t.id !== id) })),

      // Users actions
      addUser: (item) => set((s) => ({ users: [{ ...item, id: uid() }, ...s.users] })),
      updateUser: (id, data) => set((s) => ({ users: s.users.map((u) => u.id === id ? { ...u, ...data } : u) })),
      deleteUser: (id) => set((s) => ({ users: s.users.filter((u) => u.id !== id) })),

      // Stats actions
      addStat: (item) => set((s) => ({ homeStats: [...s.homeStats, { ...item, id: uid() }] })),
      updateStat: (id, data) => set((s) => ({ homeStats: s.homeStats.map((st) => st.id === id ? { ...st, ...data } : st) })),
      deleteStat: (id) => set((s) => ({ homeStats: s.homeStats.filter((st) => st.id !== id) })),

      // ShopPromo actions
      updateShopPromo: (data) => set((s) => ({ shopPromo: { ...s.shopPromo, ...data } })),

      // Settings actions
      updateHeroSettings: (data) => set((s) => ({ heroSettings: { ...s.heroSettings, ...data } })),
      updateSiteSettings: (data) => set((s) => ({ siteSettings: { ...s.siteSettings, ...data } })),
      updateCommunitySettings: (data) => set((s) => ({ communitySettings: { ...s.communitySettings, ...data } })),

      // Community actions
      addSocial: (item) => set((s) => {
        const cs = s.communitySettings;
        return { communitySettings: { ...cs, socials: [...cs.socials, { ...item, id: uid() }] } };
      }),
      updateSocial: (id, data) => set((s) => {
        const cs = s.communitySettings;
        return { communitySettings: { ...cs, socials: cs.socials.map((sc) => sc.id === id ? { ...sc, ...data } : sc) } };
      }),
      deleteSocial: (id) => set((s) => {
        const cs = s.communitySettings;
        return { communitySettings: { ...cs, socials: cs.socials.filter((sc) => sc.id !== id) } };
      }),
      addFaq: (item) => set((s) => {
        const cs = s.communitySettings;
        return { communitySettings: { ...cs, faq: [...cs.faq, { ...item, id: uid() }] } };
      }),
      updateFaq: (id, data) => set((s) => {
        const cs = s.communitySettings;
        return { communitySettings: { ...cs, faq: cs.faq.map((f) => f.id === id ? { ...f, ...data } : f) } };
      }),
      deleteFaq: (id) => set((s) => {
        const cs = s.communitySettings;
        return { communitySettings: { ...cs, faq: cs.faq.filter((f) => f.id !== id) } };
      }),
      updateCommunityStat: (id, data) => set((s) => {
        const cs = s.communitySettings;
        return { communitySettings: { ...cs, stats: cs.stats.map((st) => st.id === id ? { ...st, ...data } : st) } };
      }),

      // Footer actions
      updateFooterSettings: (data) => set((s) => ({ footerSettings: { ...s.footerSettings, ...data } })),
      addFooterSection: (item) => set((s) => ({ footerSettings: { ...s.footerSettings, sections: [...s.footerSettings.sections, { ...item, id: uid() }] } })),
      updateFooterSection: (id, data) => set((s) => ({ footerSettings: { ...s.footerSettings, sections: s.footerSettings.sections.map((sec) => sec.id === id ? { ...sec, ...data } : sec) } })),
      deleteFooterSection: (id) => set((s) => ({ footerSettings: { ...s.footerSettings, sections: s.footerSettings.sections.filter((sec) => sec.id !== id) } })),
      addFooterLink: (sectionId, item) => set((s) => ({
        footerSettings: {
          ...s.footerSettings,
          sections: s.footerSettings.sections.map((sec) =>
            sec.id === sectionId ? { ...sec, links: [...sec.links, { ...item, id: uid() }] } : sec
          ),
        },
      })),
      updateFooterLink: (sectionId, linkId, data) => set((s) => ({
        footerSettings: {
          ...s.footerSettings,
          sections: s.footerSettings.sections.map((sec) =>
            sec.id === sectionId ? { ...sec, links: sec.links.map((l) => l.id === linkId ? { ...l, ...data } : l) } : sec
          ),
        },
      })),
      deleteFooterLink: (sectionId, linkId) => set((s) => ({
        footerSettings: {
          ...s.footerSettings,
          sections: s.footerSettings.sections.map((sec) =>
            sec.id === sectionId ? { ...sec, links: sec.links.filter((l) => l.id !== linkId) } : sec
          ),
        },
      })),
      addFooterSocial: (item) => set((s) => ({ footerSettings: { ...s.footerSettings, socials: [...s.footerSettings.socials, { ...item, id: uid() }] } })),
      updateFooterSocial: (id, data) => set((s) => ({ footerSettings: { ...s.footerSettings, socials: s.footerSettings.socials.map((soc) => soc.id === id ? { ...soc, ...data } : soc) } })),
      deleteFooterSocial: (id) => set((s) => ({ footerSettings: { ...s.footerSettings, socials: s.footerSettings.socials.filter((soc) => soc.id !== id) } })),
    }),
    { name: "cyberqeln-content-v4" }
  )
);

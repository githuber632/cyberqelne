"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";
import { useContentStore } from "@/store/contentStore";
import { subscribeConfig, subscribeCollection, saveItem } from "@/lib/firestoreContent";
import type { Tournament, NewsArticle, Product, Video, Game, Team, LiveBanner } from "@/store/contentStore";

function parseRuDate(s: string): Date | null {
  if (!s) return null;
  const [d, m, y] = s.split(".");
  if (!d || !m || !y) return null;
  return new Date(+y, +m - 1, +d);
}

function autoUpdateTournamentStatuses(items: Tournament[]) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  for (const t of items) {
    if (t.status === "finished") continue;
    const start = parseRuDate(t.startDate);
    const end = parseRuDate(t.endDate);
    let next: Tournament["status"] = t.status;
    if (end && end < now) {
      next = "finished";
    } else if (start && start <= now && t.status === "upcoming") {
      next = "registration";
    }
    if (next !== t.status) {
      saveItem("tournaments", t.id, { ...t, status: next });
    }
  }
}

// Subscribes to Firestore and pushes all admin changes to every connected browser in real-time
function FirestoreSync() {
  const sync = useContentStore((s) => s._syncFromFirestore);

  useEffect(() => {
    const unsubs = [
      subscribeConfig("heroSettings",      (d) => d && sync({ heroSettings: d as never })),
      subscribeConfig("siteSettings",      (d) => d && sync({ siteSettings: d as never })),
      subscribeConfig("communitySettings", (d) => d && sync({ communitySettings: d as never })),
      subscribeConfig("footerSettings",    (d) => d && sync({ footerSettings: d as never })),
      subscribeConfig("shopPromo",         (d) => d && sync({ shopPromo: d as never })),
      subscribeConfig("homeStats",         (d) => d?.items && sync({ homeStats: d.items as never })),
      subscribeConfig("liveBanners",       (d) => d?.items && sync({ liveBanners: d.items as never })),
      // Для коллекций: синхронизируем только если в Firestore есть данные.
      // Если Firestore пустой — оставляем локальные значения (дефолтные игры и т.д.)
      subscribeCollection<Tournament>("tournaments", (items) => {
        if (items.length > 0) {
          autoUpdateTournamentStatuses(items);
          sync({ tournaments: items });
        }
      }),
      subscribeCollection<NewsArticle>("news",        (items) => { if (items.length > 0) sync({ news: items }); }),
      subscribeCollection<Product>("products",        (items) => { if (items.length > 0) sync({ products: items }); }),
      subscribeCollection<Video>("videos",            (items) => { if (items.length > 0) sync({ videos: items }); }),
      subscribeCollection<Game>("games",              (items) => { if (items.length > 0) sync({ games: items }); }),
      subscribeCollection<Team>("teams",              (items) => { if (items.length > 0) sync({ teams: items }); }),
    ];
    return () => unsubs.forEach((u) => u());
  }, [sync]);

  return null;
}

function AuthSync() {
  const { setUser, logout } = useAuthStore();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        if (useAuthStore.getState().user?.id === "guest-demo") return;
        logout();
        return;
      }
      try {
        const snap = await getDoc(doc(db, "users", firebaseUser.uid));
        if (snap.exists()) {
          const data = snap.data() as {
            name: string; email: string; avatar?: string;
            role: "user" | "moderator" | "admin" | "ceo"; rating: number;
          };
          setUser(
            {
              id: firebaseUser.uid,
              nickname: data.name || firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Player",
              email: data.email || firebaseUser.email || "",
              avatar: data.avatar || firebaseUser.photoURL || undefined,
              role: data.role || "user",
              rating: data.rating ?? 0,
            },
            firebaseUser.uid
          );
        }
      } catch {
        // Firestore unavailable — keep cached state
      }
    });
    return unsub;
  }, [setUser, logout]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60 * 1000, retry: 1 },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <AuthSync />
        <FirestoreSync />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}

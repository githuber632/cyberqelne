"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";
import { useContentStore } from "@/store/contentStore";
import { subscribeConfig, subscribeCollection, saveItem } from "@/lib/firestoreContent";
import type { Tournament, NewsArticle, Product, Video, Game, Team } from "@/store/contentStore";

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
    if (end && end < now) next = "finished";
    else if (start && start <= now && t.status === "upcoming") next = "registration";
    if (next !== t.status) saveItem("tournaments", t.id, { ...t, status: next });
  }
}

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
      subscribeCollection<Tournament>("tournaments", (items) => {
        if (items.length > 0) { autoUpdateTournamentStatuses(items); sync({ tournaments: items }); }
      }),
      subscribeCollection<NewsArticle>("news",     (items) => { if (items.length > 0) sync({ news: items }); }),
      subscribeCollection<Product>("products",     (items) => { if (items.length > 0) sync({ products: items }); }),
      subscribeCollection<Video>("videos",         (items) => { if (items.length > 0) sync({ videos: items }); }),
      subscribeCollection<Game>("games",           (items) => { if (items.length > 0) sync({ games: items }); }),
      subscribeCollection<Team>("teams",           (items) => { if (items.length > 0) sync({ teams: items }); }),
    ];
    return () => unsubs.forEach((u) => u());
  }, [sync]);

  return null;
}

function AuthSync() {
  const { setUser, logout } = useAuthStore();

  useEffect(() => {
    let userDocUnsub: (() => void) | null = null;

    const authUnsub = onAuthStateChanged(auth, async (firebaseUser) => {
      // Отписываемся от предыдущего слушателя документа
      if (userDocUnsub) { userDocUnsub(); userDocUnsub = null; }

      if (!firebaseUser) {
        if (useAuthStore.getState().user?.id === "guest-demo") return;
        logout();
        return;
      }

      try {
        const snap = await getDoc(doc(db, "users", firebaseUser.uid));

        if (!snap.exists()) {
          // Проверяем — удалён ли аккаунт администратором
          const deletedSnap = await getDoc(doc(db, "deleted_accounts", firebaseUser.uid));
          if (deletedSnap.exists()) {
            if (typeof window !== "undefined" && !window.location.pathname.startsWith("/deleted")) {
              window.location.href = "/deleted";
            }
            return;
          }

          // Новый пользователь (Google/email) — создаём профиль
          const newProfile = {
            name: firebaseUser.displayName ?? firebaseUser.email?.split("@")[0] ?? "Player",
            email: firebaseUser.email ?? "",
            avatar: firebaseUser.photoURL ?? "",
            role: "user" as const,
            rating: 1000,
          };
          await setDoc(doc(db, "users", firebaseUser.uid), {
            ...newProfile,
            uid: firebaseUser.uid,
            createdAt: new Date().toISOString(),
          });
          setUser({ id: firebaseUser.uid, nickname: newProfile.name, email: newProfile.email, avatar: newProfile.avatar || undefined, role: newProfile.role, rating: newProfile.rating }, firebaseUser.uid);
          if (typeof window !== "undefined" && window.location.pathname.startsWith("/auth/")) {
            window.location.href = "/dashboard";
          }
          return;
        }

        const profile = snap.data() as {
          name: string; email: string; avatar?: string;
          role: "user" | "moderator" | "admin" | "ceo";
          rating: number; banned?: boolean;
        };

        // Заблокирован?
        if (profile.banned) {
          if (typeof window !== "undefined" && !window.location.pathname.startsWith("/banned")) {
            window.location.href = "/banned";
          }
          return;
        }

        setUser(
          {
            id: firebaseUser.uid,
            nickname: profile.name || firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Player",
            email: profile.email || firebaseUser.email || "",
            avatar: profile.avatar || firebaseUser.photoURL || undefined,
            role: profile.role || "user",
            rating: profile.rating ?? 0,
          },
          firebaseUser.uid
        );

        if (typeof window !== "undefined" && window.location.pathname.startsWith("/auth/")) {
          window.location.href = "/dashboard";
        }

        // Реалтайм слежение за баном/разбаном пользователя
        userDocUnsub = onSnapshot(doc(db, "users", firebaseUser.uid), (docSnap) => {
          if (!docSnap.exists()) {
            // Документ удалён — проверяем deleted_accounts
            getDoc(doc(db, "deleted_accounts", firebaseUser.uid)).then((del) => {
              if (del.exists() && typeof window !== "undefined" && !window.location.pathname.startsWith("/deleted")) {
                window.location.href = "/deleted";
              }
            });
            return;
          }
          const data = docSnap.data() as { banned?: boolean };
          if (data.banned && typeof window !== "undefined" && !window.location.pathname.startsWith("/banned")) {
            window.location.href = "/banned";
          } else if (!data.banned && typeof window !== "undefined" && window.location.pathname.startsWith("/banned")) {
            window.location.href = "/dashboard";
          }
        });

      } catch {
        // Firestore unavailable — keep cached state
      }
    });

    return () => {
      authUnsub();
      if (userDocUnsub) userDocUnsub();
    };
  }, [setUser, logout]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 60 * 1000, retry: 1 } },
  }));

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

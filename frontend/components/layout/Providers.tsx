"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";

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
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}

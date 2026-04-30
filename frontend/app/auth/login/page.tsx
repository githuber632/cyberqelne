"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, Zap, LogIn, X, Ghost } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { loginUser, loginWithGoogle, getGoogleRedirectResult } from "@/lib/firebaseRegister";
import { cn } from "@/lib/utils";
import type { UserProfile } from "@/lib/firebaseRegister";

const schema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(6, "Минимум 6 символов"),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { setUser, isAuthenticated } = useAuthStore();
  const router = useRouter();

  // Если уже авторизован — идём на дашборд (после Google redirect)
  useEffect(() => {
    if (isAuthenticated) router.push("/dashboard");
  }, [isAuthenticated, router]);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const applyUser = (profile: UserProfile) => {
    setUser(
      { id: profile.uid, nickname: profile.name, email: profile.email, avatar: profile.avatar || undefined, role: profile.role, rating: profile.rating },
      profile.uid
    );
    router.push("/dashboard");
  };


  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const profile = await loginUser(data.email, data.password);
      applyUser(profile);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential") {
        setErrorMsg("Неверный email или пароль.");
      } else if (code === "auth/network-request-failed") {
        setErrorMsg("Нет подключения к интернету.");
      } else if (code === "auth/too-many-requests") {
        setErrorMsg("Слишком много попыток. Подожди немного.");
      } else {
        setErrorMsg(`Ошибка: ${code || "неизвестная"}`);
      }
      setIsLoading(false);
    }
  };

  const handleGuest = () => {
    setGuestLoading(true);
    setUser(
      { id: "guest-demo", nickname: "Гость", email: "guest@demo.local", role: "moderator", rating: 1337 },
      "guest-demo-token"
    );
    window.location.href = "/dashboard";
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setErrorMsg("");
    try {
      const profile = await loginWithGoogle();
      applyUser(profile);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      if (code !== "auth/popup-closed-by-user" && code !== "auth/cancelled-popup-request") {
        setErrorMsg(`Google ошибка: ${code}`);
      }
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-y-auto pt-20 pb-6">
      <div className="absolute inset-0 cyber-grid-bg opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-purple/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyber-neon-blue/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="glass-card rounded-2xl p-5 sm:p-8 gradient-border">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-cyber-purple-bright to-cyber-neon rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-neon">
              <span className="font-display font-black text-white text-xl">CQ</span>
            </div>
            <h1 className="font-display font-black text-2xl text-white mb-1">Вход в аккаунт</h1>
            <p className="text-gray-500 text-sm">
              Нет аккаунта?{" "}
              <Link href="/auth/register" className="text-cyber-neon hover:text-white transition-colors font-medium">
                Зарегистрироваться
              </Link>
            </p>
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading || isLoading}
            className="w-full flex items-center justify-center gap-3 py-3 mb-6 glass-card rounded-xl text-white font-semibold hover:border-cyber-neon/40 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Войти через Google
              </>
            )}
          </button>

          {/* Guest button */}
          <button
            type="button"
            onClick={handleGuest}
            disabled={isLoading || googleLoading || guestLoading}
            className="w-full flex items-center justify-center gap-3 py-3 mb-3 rounded-xl text-gray-400 font-semibold border border-dashed border-cyber-glass-border hover:border-cyber-neon/40 hover:text-white hover:bg-white/5 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {guestLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Ghost className="w-5 h-5" />
            )}
            {guestLoading ? "Входим..." : "Войти как гость"}
          </button>

          <p className="text-center text-gray-700 text-xs font-mono mb-4">
            Демо-доступ · все функции включая админку
          </p>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-cyber-glass-border" />
            <span className="text-gray-600 text-xs font-mono">или email</span>
            <div className="flex-1 h-px bg-cyber-glass-border" />
          </div>

          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-5 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2"
              >
                <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-xs font-mono">{errorMsg}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Email</label>
              <input
                {...register("email")}
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className={cn(
                  "w-full bg-cyber-purple/20 border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none transition-colors duration-150 font-mono text-sm",
                  errors.email ? "border-red-500/60" : "border-cyber-glass-border focus:border-cyber-neon/60"
                )}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1 font-mono">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Пароль</label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={cn(
                    "w-full bg-cyber-purple/20 border rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-600 focus:outline-none transition-colors duration-150 font-mono text-sm",
                    errors.password ? "border-red-500/60" : "border-cyber-glass-border focus:border-cyber-neon/60"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1 font-mono">{errors.password.message}</p>}
            </div>

            <div className="text-right">
              <Link href="/auth/forgot-password" className="text-xs text-gray-500 hover:text-cyber-neon transition-colors">
                Забыл пароль?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-cyber-purple-bright to-cyber-neon rounded-xl text-white font-display font-bold text-sm uppercase tracking-widest active:scale-[0.98] transition-all duration-150 hover:shadow-neon disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Входим...</>
              ) : (
                <><Zap className="w-4 h-4" />Войти<LogIn className="w-4 h-4" /></>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

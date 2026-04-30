"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, UserPlus, X, CheckCircle2, User, Mail, Lock, Zap, Ghost } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { registerUser, loginWithGoogle, type RegisterStep } from "@/lib/firebaseRegister";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Минимум 2 символа").max(32, "Максимум 32 символа"),
  email: z.string().email("Введите корректный email"),
  password: z.string().min(6, "Минимум 6 символов"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

const stepLabels: Record<RegisterStep, string> = {
  idle: "",
  creating_account: "Создание аккаунта...",
  saving_profile: "Сохранение профиля...",
  done: "Готово!",
  error: "Ошибка",
};

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [step, setStep] = useState<RegisterStep>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const applyUser = (profile: { uid: string; name: string; email: string; avatar: string; role: "user" | "moderator" | "admin" | "ceo"; rating: number }) => {
    setUser({ id: profile.uid, nickname: profile.name, email: profile.email, avatar: profile.avatar || undefined, role: profile.role, rating: profile.rating }, profile.uid);
  };

  const onSubmit = async (data: FormData) => {
    setErrorMsg("");
    try {
      const profile = await registerUser({ name: data.name, email: data.email, password: data.password }, setStep);
      applyUser(profile);
      setSuccess(true);
      reset();
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err: unknown) {
      setStep("error");
      const code = (err as { code?: string }).code ?? "";
      console.error("Register error:", code, err);
      if (code === "auth/email-already-in-use") setErrorMsg("Этот email уже зарегистрирован.");
      else if (code === "auth/weak-password") setErrorMsg("Пароль слишком простой.");
      else if (code === "auth/network-request-failed") setErrorMsg("Нет подключения к интернету.");
      else if (code === "auth/operation-not-allowed") setErrorMsg("Включи Email/Password в Firebase Console → Authentication.");
      else setErrorMsg(`Ошибка: ${code || "неизвестная"}`);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setErrorMsg("");
    try {
      const profile = await loginWithGoogle();
      if (profile) {
        applyUser(profile);
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      if (code === "auth/popup-closed-by-user") setErrorMsg("Окно входа закрыто.");
      else if (code === "auth/cancelled-popup-request") setErrorMsg("");
      else setErrorMsg(`Google ошибка: ${code}`);
    } finally {
      setGoogleLoading(false);
    }
  };

  const isLoading = (step !== "idle" && step !== "error" && !success);

  const handleGuest = () => {
    setUser(
      { id: "guest-demo", nickname: "Гость", email: "guest@demo.local", role: "moderator", rating: 1337 },
      "guest-demo-token"
    );
    window.location.href = "/dashboard";
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid-bg opacity-20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-purple/20 rounded-full blur-[120px] pointer-events-none" />
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="relative z-10 glass-card rounded-2xl p-12 text-center max-w-sm mx-4">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }} className="w-20 h-20 bg-gradient-to-br from-cyber-purple-bright to-cyber-neon rounded-full flex items-center justify-center mx-auto mb-6 shadow-neon">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="font-display font-black text-2xl text-white mb-2">Добро пожаловать!</h2>
          <p className="text-gray-400 text-sm mb-4">Аккаунт создан. Переходим...</p>
          <Loader2 className="w-5 h-5 text-cyber-neon animate-spin mx-auto" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12">
      {/* Backgrounds — pointer-events-none so they never block form */}
      <div className="absolute inset-0 cyber-grid-bg opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyber-purple/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyber-neon-blue/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Form — z-10 ensures it's above all backgrounds */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="glass-card rounded-2xl p-5 sm:p-8 gradient-border">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-cyber-purple-bright to-cyber-neon rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-neon">
              <span className="font-display font-black text-white text-xl">CQ</span>
            </div>
            <h1 className="font-display font-black text-2xl text-white mb-1">Создать аккаунт</h1>
            <p className="text-gray-500 text-sm">
              Уже есть аккаунт?{" "}
              <Link href="/auth/login" className="text-cyber-neon hover:text-white transition-colors font-medium">Войти</Link>
            </p>
          </div>

          {/* Google button */}
          <motion.button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading || isLoading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full flex items-center justify-center gap-3 py-3 mb-6 glass-card rounded-xl text-white font-semibold hover:border-cyber-neon/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                Продолжить с Google
              </>
            )}
          </motion.button>

          {/* Guest button */}
          <motion.button
            type="button"
            onClick={handleGuest}
            disabled={isLoading || googleLoading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full flex items-center justify-center gap-3 py-3 mb-3 rounded-xl text-gray-400 font-semibold border border-dashed border-cyber-glass-border hover:border-cyber-neon/40 hover:text-white hover:bg-white/5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Ghost className="w-5 h-5" />
            Войти как гость
          </motion.button>

          <p className="text-center text-gray-700 text-xs font-mono mb-4">
            Демо-доступ · все функции включая админку
          </p>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-cyber-glass-border" />
            <span className="text-gray-600 text-xs font-mono">или email</span>
            <div className="flex-1 h-px bg-cyber-glass-border" />
          </div>

          {/* Error */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-5 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2">
                <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-xs font-mono">{errorMsg}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading steps */}
          <AnimatePresence>
            {isLoading && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-5 overflow-hidden">
                <div className="p-3 bg-cyber-purple/10 border border-cyber-glass-border rounded-xl space-y-2">
                  {(["creating_account", "saving_profile"] as RegisterStep[]).map((s) => {
                    const done = s === "creating_account" && (step === "saving_profile" || step === "done");
                    const current = step === s;
                    return (
                      <div key={s} className="flex items-center gap-2">
                        <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0", done ? "border-cyber-neon bg-cyber-neon/20" : current ? "border-cyber-neon animate-pulse" : "border-gray-700")}>
                          {done && <CheckCircle2 className="w-2.5 h-2.5 text-cyber-neon" />}
                          {current && <div className="w-1.5 h-1.5 rounded-full bg-cyber-neon" />}
                        </div>
                        <span className={cn("text-xs font-mono", done ? "text-cyber-neon" : current ? "text-white" : "text-gray-600")}>{stepLabels[s]}</span>
                        {current && <Loader2 className="w-3 h-3 text-cyber-neon animate-spin ml-auto" />}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-400 mb-1.5">
                <User className="w-3.5 h-3.5" />Игровое имя
              </label>
              <input
                {...register("name")}
                type="text"
                placeholder="PhantomX"
                autoComplete="username"
                className={cn("w-full bg-cyber-purple/20 border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none transition-all duration-200 font-mono text-sm",
                  errors.name ? "border-red-500/60" : "border-cyber-glass-border focus:border-cyber-neon/60")}
              />
              {errors.name && <p className="text-red-400 text-xs mt-1 font-mono">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-400 mb-1.5">
                <Mail className="w-3.5 h-3.5" />Email
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className={cn("w-full bg-cyber-purple/20 border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none transition-all duration-200 font-mono text-sm",
                  errors.email ? "border-red-500/60" : "border-cyber-glass-border focus:border-cyber-neon/60")}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1 font-mono">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-400 mb-1.5">
                <Lock className="w-3.5 h-3.5" />Пароль
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Минимум 6 символов"
                  autoComplete="new-password"
                  className={cn("w-full bg-cyber-purple/20 border rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-600 focus:outline-none transition-all duration-200 font-mono text-sm",
                    errors.password ? "border-red-500/60" : "border-cyber-glass-border focus:border-cyber-neon/60")}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors p-1">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1 font-mono">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-400 mb-1.5">
                <Lock className="w-3.5 h-3.5" />Подтверди пароль
              </label>
              <div className="relative">
                <input
                  {...register("confirmPassword")}
                  type={showConfirm ? "text" : "password"}
                  placeholder="Повтори пароль"
                  autoComplete="new-password"
                  className={cn("w-full bg-cyber-purple/20 border rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-600 focus:outline-none transition-all duration-200 font-mono text-sm",
                    errors.confirmPassword ? "border-red-500/60" : "border-cyber-glass-border focus:border-cyber-neon/60")}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors p-1">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1 font-mono">{errors.confirmPassword.message}</p>}
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={isLoading ? {} : { scale: 1.01 }}
              whileTap={isLoading ? {} : { scale: 0.99 }}
              className="w-full flex items-center justify-center gap-2 py-4 mt-2 bg-gradient-to-r from-cyber-purple-bright to-cyber-neon rounded-xl text-white font-display font-bold text-sm uppercase tracking-widest transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-neon"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" />{stepLabels[step]}</>
              ) : (
                <><Zap className="w-4 h-4" />Зарегистрироваться<UserPlus className="w-4 h-4" /></>
              )}
            </motion.button>
          </form>

          <p className="text-center text-gray-700 text-xs font-mono mt-4">Защищено Firebase Authentication</p>
        </div>
      </motion.div>
    </div>
  );
}

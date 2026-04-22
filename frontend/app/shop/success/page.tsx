"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle, Zap, ArrowLeft } from "lucide-react";
import { Suspense } from "react";

const GAME_NAMES: Record<string, string> = {
  pubg: "PUBG Mobile",
  ml: "Mobile Legends",
  cs2: "CS2",
};

const GAME_ICONS: Record<string, string> = {
  pubg: "🎮",
  ml: "⚔️",
  cs2: "🔫",
};

function SuccessContent() {
  const params = useSearchParams();
  const game = params.get("game") || "";
  const playerId = params.get("player_id") || "";
  const amount = params.get("amount") || "";

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="glass-card rounded-2xl overflow-hidden"
        >
          {/* Top glow strip */}
          <div className="h-1 bg-gradient-to-r from-cyber-purple-bright via-cyber-neon to-cyber-neon-blue" />

          <div className="p-8 text-center">
            {/* Success icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2, duration: 0.5 }}
              className="w-20 h-20 rounded-full bg-cyber-neon-green/10 border border-cyber-neon-green/30 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-cyber-neon-green" style={{ filter: "drop-shadow(0 0 12px #4ade80)" }} />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h1 className="font-display font-black text-2xl text-white mb-2">Оплата прошла успешно!</h1>
              <p className="text-gray-400 text-sm font-mono mb-8">Ваш аккаунт будет пополнен в течение нескольких минут</p>
            </motion.div>

            {/* Details */}
            {game && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-cyber-purple/20 border border-cyber-glass-border rounded-xl p-4 mb-6 text-left space-y-3"
              >
                {game && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Игра</span>
                    <span className="text-sm font-display font-bold text-white flex items-center gap-2">
                      <span>{GAME_ICONS[game]}</span>
                      {GAME_NAMES[game] || game}
                    </span>
                  </div>
                )}
                {playerId && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Аккаунт</span>
                    <span className="text-sm font-mono text-gray-300">{playerId}</span>
                  </div>
                )}
                {amount && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Сумма</span>
                    <span className="text-sm font-display font-bold text-cyber-neon">
                      {Number(amount).toLocaleString()} UZS
                    </span>
                  </div>
                )}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex gap-3"
            >
              <Link href="/shop" className="flex-1">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 py-3 border border-cyber-glass-border rounded-xl text-gray-300 text-sm font-display font-bold hover:border-cyber-neon/30 hover:text-white transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Назад
                </motion.div>
              </Link>
              <Link href="/shop" className="flex-1">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyber-purple-bright to-cyber-neon rounded-xl text-white text-sm font-display font-bold uppercase tracking-wider hover:shadow-neon transition-all"
                >
                  <Zap className="w-4 h-4" />
                  Ещё раз
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}

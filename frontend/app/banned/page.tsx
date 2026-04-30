"use client";

import { motion } from "framer-motion";
import { ShieldX, MessageCircle } from "lucide-react";

const TG_LINK = "https://t.me/Sky_1302";

export default function BannedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-cyber-dark">
      <div className="absolute inset-0 cyber-grid-bg opacity-10 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md text-center"
      >
        <div className="glass-card rounded-2xl p-8 border border-red-500/20">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-red-500/20 border border-red-500/40 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <ShieldX className="w-10 h-10 text-red-400" />
          </motion.div>

          <h1 className="font-display font-black text-2xl text-white mb-3">
            Аккаунт заблокирован
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed mb-2">
            Ваш аккаунт был заблокирован администрацией CyberQELN.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            Если вы считаете это ошибкой — обратитесь в поддержку через Telegram.
          </p>

          <a
            href={TG_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-gradient-to-r from-[#229ED9] to-[#1a7fb3] text-white font-display font-bold text-sm uppercase tracking-widest hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] transition-all duration-150"
          >
            <MessageCircle className="w-5 h-5" />
            Обратиться в поддержку
          </a>

          <p className="text-gray-700 text-xs font-mono mt-4">
            Telegram: @Sky_1302
          </p>
        </div>
      </motion.div>
    </div>
  );
}

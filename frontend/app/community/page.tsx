"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Users, MessageCircle, Trophy, Star, ExternalLink } from "lucide-react";
import { useContentStore } from "@/store/contentStore";
import { cn } from "@/lib/utils";

const ICON_MAP = { Users, Trophy, Star, MessageCircle };

export default function CommunityPage() {
  const { communitySettings: c } = useContentStore();

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="relative overflow-hidden bg-gradient-to-b from-cyber-purple/20 to-transparent py-16">
        <div className="absolute inset-0 cyber-grid-bg opacity-20" />
        <div className="max-w-7xl mx-auto px-4 relative text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display font-black text-4xl sm:text-5xl text-white mb-3">{c.title}</h1>
            <p className="text-gray-400 max-w-xl mx-auto">{c.subtitle}</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {c.stats.map((s, i) => {
            const Icon = ICON_MAP[s.iconName];
            return (
              <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }} className="glass-card rounded-2xl p-6 text-center">
                <Icon className={cn("w-6 h-6 mx-auto mb-2", s.color)} />
                <div className={cn("font-display font-black text-2xl", s.color)}>{s.value}</div>
                <div className="text-gray-500 text-sm font-mono">{s.label}</div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Socials */}
        <div>
          <h2 className="font-display font-bold text-2xl text-white mb-6">{c.socialsTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {c.socials.map((s, i) => (
              <motion.a key={s.id} href={s.href} target="_blank" rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}
                whileHover={{ y: -6, scale: 1.02 }} className="glass-card rounded-2xl p-6 group cursor-pointer block">
                <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-2xl mb-4", s.color)}>
                  {s.icon}
                </div>
                <h3 className="font-display font-bold text-white mb-1 group-hover:text-cyber-neon transition-colors">{s.name}</h3>
                <p className="text-gray-500 text-sm mb-3">{s.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-cyber-neon font-mono font-bold text-sm">{s.members}</span>
                  <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-cyber-neon transition-colors" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="font-display font-bold text-2xl text-white mb-6">{c.faqTitle}</h2>
          <div className="space-y-3">
            {c.faq.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }} className="glass-card rounded-xl p-6">
                <h3 className="font-display font-bold text-white mb-2">{item.q}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card rounded-2xl p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 cyber-grid-bg opacity-10" />
          <div className="relative">
            <h2 className="font-display font-black text-3xl text-white mb-3">{c.ctaTitle}</h2>
            <p className="text-gray-400 mb-8">{c.ctaSubtitle}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={c.ctaPrimaryHref} className="px-8 py-4 bg-gradient-to-r from-cyber-purple-bright to-cyber-neon text-white font-display font-bold rounded-xl hover:shadow-neon transition-all">
                {c.ctaPrimaryText}
              </Link>
              <Link href={c.ctaSecondaryHref} className="px-8 py-4 glass-card rounded-xl text-white font-display font-semibold hover:border-cyber-neon/40 transition-all">
                {c.ctaSecondaryText}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

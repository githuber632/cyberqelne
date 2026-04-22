"use client";

import { motion } from "framer-motion";

const partners = [
  { name: "Payme", logo: "💳" },
  { name: "Click", logo: "🔵" },
  { name: "Uzcard", logo: "🏦" },
  { name: "Humo", logo: "💰" },
  { name: "Uzmobile", logo: "📱" },
  { name: "Beeline UZ", logo: "🐝" },
];

export function PartnersSection() {
  return (
    <section className="py-16 border-t border-cyber-glass-border relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-gray-600 font-mono text-sm uppercase tracking-widest">Наши партнёры</p>
        </div>

        {/* Scrolling partners */}
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-cyber-black to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-cyber-black to-transparent z-10" />

          <motion.div
            animate={{ x: [0, -600] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="flex gap-12 items-center"
          >
            {[...partners, ...partners].map((partner, i) => (
              <div
                key={`${partner.name}-${i}`}
                className="flex items-center gap-3 glass-card rounded-xl px-6 py-3 whitespace-nowrap opacity-60 hover:opacity-100 transition-opacity flex-shrink-0"
              >
                <span className="text-2xl">{partner.logo}</span>
                <span className="font-display font-bold text-gray-400 text-sm">{partner.name}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

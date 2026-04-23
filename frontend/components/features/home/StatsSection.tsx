"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { Users, Trophy, DollarSign, Gamepad2, Globe, Zap, Star, Shield } from "lucide-react";
import { useContentStore } from "@/store/contentStore";

const iconMap = {
  Users, Trophy, DollarSign, Gamepad2, Globe, Zap, Star, Shield,
};

function AnimatedCounter({ value, suffix, prefix = "" }: { value: number; suffix: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 100, damping: 30 });

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, value, motionValue]);

  useEffect(() => {
    return spring.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${Math.round(latest).toLocaleString()}${suffix}`;
      }
    });
  }, [spring, suffix, prefix]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}

export function StatsSection() {
  const { homeStats } = useContentStore();

  if (homeStats.length === 0) return null;

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-cyber-purple/10 via-transparent to-cyber-neon-blue/10" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyber-neon/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyber-neon/40 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {homeStats.map((stat, index) => {
            const Icon = iconMap[stat.icon];
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="stat-card text-center"
              >
                <div className="flex justify-center mb-3">
                  <div className="w-10 h-10 rounded-xl bg-cyber-purple/30 flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
                <div className={`font-display font-black text-2xl lg:text-3xl mb-1 ${stat.color}`}>
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
                </div>
                <div className="text-white font-semibold text-sm mb-0.5">{stat.label}</div>
                <div className="text-gray-600 text-xs font-mono">{stat.description}</div>
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent ${stat.color} opacity-50`} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

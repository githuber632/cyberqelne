"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  badge: string;
  title: string;
  subtitle?: string;
  link?: { href: string; label: string };
  centered?: boolean;
}

export function SectionHeader({ badge, title, subtitle, link, centered = false }: SectionHeaderProps) {
  return (
    <div className={`flex flex-col ${centered ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between"} mb-12`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className={centered ? "flex flex-col items-center" : ""}
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-3">
          <div className="w-8 h-px bg-gradient-to-r from-transparent to-cyber-neon" />
          <span className="text-cyber-neon font-mono text-xs font-bold uppercase tracking-widest">
            {badge}
          </span>
          <div className="w-8 h-px bg-gradient-to-l from-transparent to-cyber-neon" />
        </div>

        {/* Title */}
        <h2 className="font-display font-black text-3xl sm:text-4xl text-white mb-2">
          {title}
        </h2>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-gray-500 text-sm max-w-lg leading-relaxed">{subtitle}</p>
        )}
      </motion.div>

      {/* View all link */}
      {link && !centered && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="mt-4 sm:mt-0 flex-shrink-0"
        >
          <Link
            href={link.href}
            className="flex items-center gap-1.5 text-cyber-neon hover:text-white transition-colors font-mono text-sm group"
          >
            {link.label}
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      )}
    </div>
  );
}

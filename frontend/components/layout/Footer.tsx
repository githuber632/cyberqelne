"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { useContentStore } from "@/store/contentStore";
import { getSocialPlatform } from "@/lib/socialIcons";
import { cn } from "@/lib/utils";

export function Footer() {
  const { footerSettings } = useContentStore();
  const { description, copyright, sections, socials } = footerSettings;

  return (
    <footer className="relative mt-24 border-t border-cyber-glass-border overflow-hidden">
      <div className="absolute inset-0 bg-cyber-dark/80" />
      <div className="absolute inset-0 cyber-grid-bg opacity-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-cyber-neon/40 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyber-purple-bright to-cyber-neon rounded-lg flex items-center justify-center shadow-neon">
                <span className="font-display font-black text-white text-sm">CQ</span>
              </div>
              <div>
                <span className="font-display font-black text-xl text-gradient-cyber">CYBER</span>
                <span className="font-display font-black text-xl text-white">QELN</span>
              </div>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">{description}</p>

            {/* Social links */}
            <div className="flex items-center gap-3 flex-wrap">
              {socials.map((social) => {
                const platform = getSocialPlatform(social.iconId);
                const Icon = platform.Icon;
                return (
                  <motion.a
                    key={social.id}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={social.label}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className={cn(
                      "w-9 h-9 glass-card rounded-lg flex items-center justify-center text-gray-500 transition-all duration-200",
                      platform.color
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Link sections */}
          {sections.map((section) => (
            <div key={section.id}>
              <h4 className="font-display font-bold text-sm text-white mb-4 uppercase tracking-wider">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.id}>
                    <Link href={link.href} className="text-gray-500 hover:text-cyber-neon text-sm transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-cyber-glass-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm font-mono">{copyright}</p>
          <div className="flex items-center gap-6 text-xs text-gray-600">
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">Конфиденциальность</Link>
            <Link href="/terms" className="hover:text-gray-400 transition-colors">Условия</Link>
            <Link href="/cookies" className="hover:text-gray-400 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

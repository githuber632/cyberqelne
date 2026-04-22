import { Youtube, Send, Instagram, Twitter, Music2, MessageCircle, Globe } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface SocialPlatform {
  id: string;
  label: string;
  Icon: LucideIcon;
  color: string;
}

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  { id: "youtube",   label: "YouTube",   Icon: Youtube,       color: "hover:text-red-400 hover:border-red-400/40" },
  { id: "telegram",  label: "Telegram",  Icon: Send,          color: "hover:text-blue-400 hover:border-blue-400/40" },
  { id: "instagram", label: "Instagram", Icon: Instagram,     color: "hover:text-pink-400 hover:border-pink-400/40" },
  { id: "twitter",   label: "Twitter/X", Icon: Twitter,       color: "hover:text-sky-400 hover:border-sky-400/40" },
  { id: "tiktok",    label: "TikTok",    Icon: Music2,        color: "hover:text-white hover:border-white/40" },
  { id: "discord",   label: "Discord",   Icon: MessageCircle, color: "hover:text-indigo-400 hover:border-indigo-400/40" },
  { id: "vk",        label: "VK",        Icon: Globe,         color: "hover:text-blue-500 hover:border-blue-500/40" },
];

export function getSocialPlatform(iconId: string): SocialPlatform {
  return SOCIAL_PLATFORMS.find((p) => p.id === iconId) ?? {
    id: iconId,
    label: iconId,
    Icon: Globe,
    color: "hover:text-cyber-neon hover:border-cyber-neon/40",
  };
}

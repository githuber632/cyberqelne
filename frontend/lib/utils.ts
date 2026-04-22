import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function formatCurrency(amount: number, currency = "UZS"): string {
  return `${amount.toLocaleString("ru-RU")} ${currency}`;
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim();
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function generateGradient(seed: string): string {
  const gradients = [
    "from-purple-600 to-cyan-500",
    "from-pink-600 to-purple-600",
    "from-cyan-500 to-blue-600",
    "from-violet-600 to-pink-500",
    "from-indigo-600 to-cyan-400",
  ];
  const index = seed.charCodeAt(0) % gradients.length;
  return gradients[index];
}

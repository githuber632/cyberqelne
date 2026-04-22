export type Role = "user" | "moderator" | "admin" | "ceo";

export const ROLE_HIERARCHY: Record<Role, number> = {
  user: 0,
  moderator: 1,
  admin: 2,
  ceo: 3,
};

export const isModerator = (role?: string) =>
  role === "moderator" || role === "admin" || role === "ceo";

export const isAdmin = (role?: string) => role === "admin" || role === "ceo";

export const isCEO = (role?: string) => role === "ceo";

export const ROLE_LABELS: Record<string, string> = {
  user: "Игрок",
  moderator: "Модератор",
  admin: "Администратор",
  ceo: "CEO",
};

export const ROLE_COLORS: Record<string, string> = {
  ceo: "text-yellow-400 bg-yellow-500/20 border-yellow-500/40",
  admin: "text-red-400 bg-red-500/20 border-red-500/40",
  moderator: "text-blue-400 bg-blue-500/20 border-blue-500/40",
  user: "text-gray-400 bg-gray-500/20 border-gray-500/40",
};

// Shared types between frontend and backend

export type UserRole = "USER" | "MODERATOR" | "ADMIN" | "SUPER_ADMIN";
export type UserStatus = "ACTIVE" | "BANNED" | "SUSPENDED" | "PENDING_VERIFICATION";
export type TournamentStatus = "DRAFT" | "REGISTRATION" | "CHECKIN" | "ACTIVE" | "FINISHED" | "CANCELLED";
export type TournamentFormat = "SINGLE_ELIMINATION" | "DOUBLE_ELIMINATION" | "ROUND_ROBIN" | "SWISS" | "LEAGUE";
export type MatchStatus = "PENDING" | "SCHEDULED" | "LIVE" | "FINISHED" | "CANCELLED" | "FORFEIT";
export type TeamRole = "OWNER" | "CAPTAIN" | "PLAYER" | "SUBSTITUTE";
export type PaymentMethod = "PAYME" | "CLICK" | "UZCARD" | "HUMO" | "CRYPTO" | "CYBERCOINS";

export interface RankTier {
  name: string;
  min: number;
  max: number;
  color: string;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface WsMatchUpdate {
  matchId: string;
  score1: number;
  score2: number;
  status: MatchStatus;
  event?: string;
  timestamp: Date;
}

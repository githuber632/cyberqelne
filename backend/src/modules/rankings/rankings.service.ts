import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";

export const RANK_TIERS = [
  { name: "Bronze", min: 0, max: 999, color: "#cd7f32" },
  { name: "Silver", min: 1000, max: 1499, color: "#c0c0c0" },
  { name: "Gold", min: 1500, max: 1999, color: "#ffd700" },
  { name: "Platinum", min: 2000, max: 2499, color: "#00e5ff" },
  { name: "Diamond", min: 2500, max: 2999, color: "#00b0ff" },
  { name: "Master", min: 3000, max: 3499, color: "#aa00ff" },
  { name: "Grandmaster", min: 3500, max: 3999, color: "#ff6d00" },
  { name: "Challenger", min: 4000, max: Infinity, color: "#ff1744" },
];

@Injectable()
export class RankingsService {
  constructor(private prisma: PrismaService) {}

  async getPlayerLeaderboard(options: {
    page?: number;
    limit?: number;
    country?: string;
  }) {
    const { page = 1, limit = 50, country } = options;

    const where: any = { status: "ACTIVE" };
    if (country) where.country = country;

    const [players, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        orderBy: { rating: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          nickname: true,
          avatar: true,
          country: true,
          rating: true,
          team: { select: { team: { select: { name: true, tag: true } } } },
          playerStats: {
            select: { wins: true, losses: true, winRate: true, tournamentsWon: true, mvpCount: true },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: players.map((p, i) => ({
        ...p,
        rank: (page - 1) * limit + i + 1,
        tier: this.getTier(p.rating),
        teamName: p.team?.team?.name,
        teamTag: p.team?.team?.tag,
      })),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getTeamLeaderboard(options: { page?: number; limit?: number; country?: string }) {
    const { page = 1, limit = 50, country } = options;

    const where: any = { status: "ACTIVE" };
    if (country) where.country = country;

    const [teams, total] = await Promise.all([
      this.prisma.team.findMany({
        where,
        orderBy: { rating: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          members: {
            select: { user: { select: { nickname: true, avatar: true } } },
          },
          teamStats: true,
        },
      }),
      this.prisma.team.count({ where }),
    ]);

    return {
      data: teams.map((t, i) => ({
        ...t,
        rank: (page - 1) * limit + i + 1,
        tier: this.getTier(t.rating),
      })),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async updatePlayerRating(userId: string, delta: number, reason: string, matchId?: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { rating: { increment: delta } },
    });

    // Record in history
    await this.prisma.ratingHistory.create({
      data: { userId, rating: user.rating, delta, reason, matchId },
    });

    // Update peak rating
    await this.prisma.playerStats.update({
      where: { userId },
      data: { peakRating: { ...(delta > 0 ? { set: Math.max(user.rating) } : {}) } },
    });

    return { newRating: user.rating, delta, tier: this.getTier(user.rating) };
  }

  async getRatingHistory(userId: string, limit = 20) {
    return this.prisma.ratingHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  getTier(rating: number) {
    return (
      RANK_TIERS.findLast((t) => rating >= t.min) || RANK_TIERS[0]
    );
  }
}

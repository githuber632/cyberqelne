"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RankingsService = exports.RANK_TIERS = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
exports.RANK_TIERS = [
    { name: "Bronze", min: 0, max: 999, color: "#cd7f32" },
    { name: "Silver", min: 1000, max: 1499, color: "#c0c0c0" },
    { name: "Gold", min: 1500, max: 1999, color: "#ffd700" },
    { name: "Platinum", min: 2000, max: 2499, color: "#00e5ff" },
    { name: "Diamond", min: 2500, max: 2999, color: "#00b0ff" },
    { name: "Master", min: 3000, max: 3499, color: "#aa00ff" },
    { name: "Grandmaster", min: 3500, max: 3999, color: "#ff6d00" },
    { name: "Challenger", min: 4000, max: Infinity, color: "#ff1744" },
];
let RankingsService = class RankingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPlayerLeaderboard(options) {
        const { page = 1, limit = 50, country } = options;
        const where = { status: "ACTIVE" };
        if (country)
            where.country = country;
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
    async getTeamLeaderboard(options) {
        const { page = 1, limit = 50, country } = options;
        const where = { status: "ACTIVE" };
        if (country)
            where.country = country;
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
    async updatePlayerRating(userId, delta, reason, matchId) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: { rating: { increment: delta } },
        });
        await this.prisma.ratingHistory.create({
            data: { userId, rating: user.rating, delta, reason, matchId },
        });
        await this.prisma.playerStats.update({
            where: { userId },
            data: { peakRating: { ...(delta > 0 ? { set: Math.max(user.rating) } : {}) } },
        });
        return { newRating: user.rating, delta, tier: this.getTier(user.rating) };
    }
    async getRatingHistory(userId, limit = 20) {
        return this.prisma.ratingHistory.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: limit,
        });
    }
    getTier(rating) {
        return (exports.RANK_TIERS.findLast((t) => rating >= t.min) || exports.RANK_TIERS[0]);
    }
};
exports.RankingsService = RankingsService;
exports.RankingsService = RankingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RankingsService);
//# sourceMappingURL=rankings.service.js.map
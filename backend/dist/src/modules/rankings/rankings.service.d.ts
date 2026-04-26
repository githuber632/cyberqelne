import { PrismaService } from "../../common/prisma/prisma.service";
export declare const RANK_TIERS: {
    name: string;
    min: number;
    max: number;
    color: string;
}[];
export declare class RankingsService {
    private prisma;
    constructor(prisma: PrismaService);
    getPlayerLeaderboard(options: {
        page?: number;
        limit?: number;
        country?: string;
    }): Promise<{
        data: {
            rank: number;
            tier: {
                name: string;
                min: number;
                max: number;
                color: string;
            };
            teamName: string;
            teamTag: string;
            id: string;
            nickname: string;
            avatar: string;
            country: string;
            rating: number;
            team: {
                team: {
                    name: string;
                    tag: string;
                };
            };
            playerStats: {
                wins: number;
                losses: number;
                winRate: number;
                mvpCount: number;
                tournamentsWon: number;
            };
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getTeamLeaderboard(options: {
        page?: number;
        limit?: number;
        country?: string;
    }): Promise<{
        data: {
            rank: number;
            tier: {
                name: string;
                min: number;
                max: number;
                color: string;
            };
            members: {
                user: {
                    nickname: string;
                    avatar: string;
                };
            }[];
            teamStats: {
                id: string;
                wins: number;
                losses: number;
                winRate: number;
                tournamentsWon: number;
                totalEarnings: bigint;
                teamId: string;
            };
            id: string;
            country: string | null;
            status: import(".prisma/client").$Enums.TeamStatus;
            rating: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            tag: string;
            logo: string | null;
            description: string | null;
            ownerId: string;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    updatePlayerRating(userId: string, delta: number, reason: string, matchId?: string): Promise<{
        newRating: number;
        delta: number;
        tier: {
            name: string;
            min: number;
            max: number;
            color: string;
        };
    }>;
    getRatingHistory(userId: string, limit?: number): Promise<{
        id: string;
        rating: number;
        createdAt: Date;
        userId: string;
        matchId: string | null;
        delta: number;
        reason: string;
    }[]>;
    getTier(rating: number): {
        name: string;
        min: number;
        max: number;
        color: string;
    };
}

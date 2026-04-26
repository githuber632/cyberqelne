import { RankingsService } from "./rankings.service";
export declare class RankingsController {
    private rankings;
    constructor(rankings: RankingsService);
    getPlayers(q: any): Promise<{
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
    getTeams(q: any): Promise<{
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
}

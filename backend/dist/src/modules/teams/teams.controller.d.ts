import { TeamsService } from "./teams.service";
export declare class TeamsController {
    private teams;
    constructor(teams: TeamsService);
    findAll(q: any): Promise<{
        data: ({
            members: ({
                user: {
                    nickname: string;
                    avatar: string;
                    rating: number;
                };
            } & {
                id: string;
                role: import(".prisma/client").$Enums.TeamRole;
                userId: string;
                position: string | null;
                joinedAt: Date;
                teamId: string;
            })[];
            teamStats: {
                id: string;
                wins: number;
                losses: number;
                winRate: number;
                tournamentsWon: number;
                totalEarnings: bigint;
                teamId: string;
            };
        } & {
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        members: ({
            user: {
                id: string;
                email: string;
                nickname: string;
                mlbbId: string | null;
                passwordHash: string;
                avatar: string | null;
                bio: string | null;
                country: string | null;
                birthDate: Date | null;
                role: import(".prisma/client").$Enums.UserRole;
                status: import(".prisma/client").$Enums.UserStatus;
                rating: number;
                createdAt: Date;
                updatedAt: Date;
                lastSeenAt: Date | null;
                mlbbServer: string | null;
            };
        } & {
            id: string;
            role: import(".prisma/client").$Enums.TeamRole;
            userId: string;
            position: string | null;
            joinedAt: Date;
            teamId: string;
        })[];
        teamStats: {
            id: string;
            wins: number;
            losses: number;
            winRate: number;
            tournamentsWon: number;
            totalEarnings: bigint;
            teamId: string;
        };
    } & {
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
    }>;
    create(body: any, req: any): Promise<{
        members: {
            id: string;
            role: import(".prisma/client").$Enums.TeamRole;
            userId: string;
            position: string | null;
            joinedAt: Date;
            teamId: string;
        }[];
    } & {
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
    }>;
    invite(id: string, body: any, req: any): Promise<{
        id: string;
        role: import(".prisma/client").$Enums.TeamRole;
        userId: string;
        position: string | null;
        joinedAt: Date;
        teamId: string;
    }>;
}

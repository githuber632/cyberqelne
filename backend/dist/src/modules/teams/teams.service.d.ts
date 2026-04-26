import { PrismaService } from "../../common/prisma/prisma.service";
export declare class TeamsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number, country?: string): Promise<{
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
    create(data: {
        name: string;
        tag: string;
        country?: string;
        logo?: string;
    }, captainId: string): Promise<{
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
    inviteMember(teamId: string, userId: string, captainId: string): Promise<{
        id: string;
        role: import(".prisma/client").$Enums.TeamRole;
        userId: string;
        position: string | null;
        joinedAt: Date;
        teamId: string;
    }>;
}

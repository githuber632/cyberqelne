import { PrismaService } from "../../common/prisma/prisma.service";
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number): Promise<{
        data: {
            id: string;
            email: string;
            nickname: string;
            avatar: string;
            country: string;
            role: import(".prisma/client").$Enums.UserRole;
            status: import(".prisma/client").$Enums.UserStatus;
            rating: number;
            createdAt: Date;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        team: {
            team: {
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
            };
        } & {
            id: string;
            role: import(".prisma/client").$Enums.TeamRole;
            userId: string;
            position: string | null;
            joinedAt: Date;
            teamId: string;
        };
        playerStats: {
            id: string;
            updatedAt: Date;
            totalMatches: number;
            wins: number;
            losses: number;
            winRate: number;
            mvpCount: number;
            killDeathRatio: number;
            tournamentsPlayed: number;
            tournamentsWon: number;
            totalEarnings: bigint;
            peakRating: number;
            userId: string;
        };
    } & {
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
    }>;
    findByNickname(nickname: string): Promise<{
        playerStats: {
            id: string;
            updatedAt: Date;
            totalMatches: number;
            wins: number;
            losses: number;
            winRate: number;
            mvpCount: number;
            killDeathRatio: number;
            tournamentsPlayed: number;
            tournamentsWon: number;
            totalEarnings: bigint;
            peakRating: number;
            userId: string;
        };
    } & {
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
    }>;
    updateProfile(id: string, data: {
        nickname?: string;
        avatar?: string;
        country?: string;
    }): Promise<{
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
    }>;
}

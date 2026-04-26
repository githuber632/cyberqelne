import { AdminService } from "./admin.service";
export declare class AdminController {
    private admin;
    constructor(admin: AdminService);
    getStats(): Promise<{
        users: number;
        tournaments: number;
        teams: number;
        orders: number;
    }>;
    banUser(id: string): Promise<{
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
    setRole(id: string, body: {
        role: string;
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

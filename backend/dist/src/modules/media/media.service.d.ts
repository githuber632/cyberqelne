import { PrismaService } from "../../common/prisma/prisma.service";
export declare class MediaService {
    private prisma;
    constructor(prisma: PrismaService);
    getVideos(page?: number, limit?: number, category?: string): Promise<{
        data: {
            id: string;
            createdAt: Date;
            description: string | null;
            title: string;
            featured: boolean;
            category: import(".prisma/client").$Enums.VideoCategory;
            authorId: string | null;
            viewCount: number;
            thumbnailUrl: string | null;
            videoUrl: string;
            duration: number | null;
            tournamentId: string | null;
            matchId: string | null;
            publishedAt: Date | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getVideo(id: string): Promise<{
        id: string;
        createdAt: Date;
        description: string | null;
        title: string;
        featured: boolean;
        category: import(".prisma/client").$Enums.VideoCategory;
        authorId: string | null;
        viewCount: number;
        thumbnailUrl: string | null;
        videoUrl: string;
        duration: number | null;
        tournamentId: string | null;
        matchId: string | null;
        publishedAt: Date | null;
    }>;
}

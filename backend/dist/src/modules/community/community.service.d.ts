import { PrismaService } from "../../common/prisma/prisma.service";
export declare class CommunityService {
    private prisma;
    constructor(prisma: PrismaService);
    getPosts(page?: number, limit?: number): Promise<{
        data: ({
            _count: {
                comments: number;
                likes: number;
            };
            author: {
                nickname: string;
                avatar: string;
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.PostStatus;
            createdAt: Date;
            updatedAt: Date;
            title: string | null;
            category: import(".prisma/client").$Enums.PostCategory;
            media: string[];
            authorId: string;
            content: string;
            pinned: boolean;
            viewCount: number;
            likeCount: number;
            commentCount: number;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    createPost(userId: string, data: {
        title: string;
        content: string;
        type?: string;
    }): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.PostStatus;
        createdAt: Date;
        updatedAt: Date;
        title: string | null;
        category: import(".prisma/client").$Enums.PostCategory;
        media: string[];
        authorId: string;
        content: string;
        pinned: boolean;
        viewCount: number;
        likeCount: number;
        commentCount: number;
    }>;
    likePost(postId: string, userId: string): Promise<{
        liked: boolean;
    }>;
}

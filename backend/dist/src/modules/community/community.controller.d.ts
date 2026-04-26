import { CommunityService } from "./community.service";
export declare class CommunityController {
    private community;
    constructor(community: CommunityService);
    getPosts(q: any): Promise<{
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
    createPost(body: any, req: any): Promise<{
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
    likePost(id: string, req: any): Promise<{
        liked: boolean;
    }>;
}

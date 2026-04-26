import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";

@Injectable()
export class CommunityService {
  constructor(private prisma: PrismaService) {}

  async getPosts(page = 1, limit = 20) {
    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        skip: (page - 1) * limit,
        take: limit,
        include: { author: { select: { nickname: true, avatar: true } }, _count: { select: { comments: true, likes: true } } },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.post.count(),
    ]);
    return { data: posts, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async createPost(userId: string, data: { title: string; content: string; type?: string }) {
    return this.prisma.post.create({ data: { ...data, authorId: userId } });
  }

  async likePost(postId: string, userId: string) {
    const existing = await this.prisma.like.findUnique({ where: { userId_postId: { postId, userId } } });
    if (existing) {
      await this.prisma.like.delete({ where: { id: existing.id } });
      return { liked: false };
    }
    await this.prisma.like.create({ data: { postId, userId } });
    return { liked: true };
  }
}

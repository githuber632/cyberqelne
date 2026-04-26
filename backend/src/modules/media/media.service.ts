import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}

  async getVideos(page = 1, limit = 20, category?: string) {
    const where: any = {};
    if (category) where.category = category;
    const [videos, total] = await Promise.all([
      this.prisma.video.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: "desc" } }),
      this.prisma.video.count({ where }),
    ]);
    return { data: videos, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async getVideo(id: string) {
    return this.prisma.video.findUnique({ where: { id } });
  }
}

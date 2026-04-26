import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20) {
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
        select: { id: true, nickname: true, email: true, avatar: true, country: true, rating: true, role: true, status: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.user.count(),
    ]);
    return { data: users, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { playerStats: true, team: { include: { team: true } } },
    });
    if (!user) throw new NotFoundException("Пользователь не найден");
    return user;
  }

  async findByNickname(nickname: string) {
    const user = await this.prisma.user.findUnique({
      where: { nickname },
      include: { playerStats: true },
    });
    if (!user) throw new NotFoundException("Пользователь не найден");
    return user;
  }

  async updateProfile(id: string, data: { nickname?: string; avatar?: string; country?: string }) {
    return this.prisma.user.update({ where: { id }, data });
  }
}

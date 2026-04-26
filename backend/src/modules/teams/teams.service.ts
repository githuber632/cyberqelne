import { Injectable, NotFoundException, ForbiddenException, ConflictException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20, country?: string) {
    const where: any = { status: "ACTIVE" };
    if (country) where.country = country;
    const [teams, total] = await Promise.all([
      this.prisma.team.findMany({ where, skip: (page - 1) * limit, take: limit, include: { members: { include: { user: { select: { nickname: true, avatar: true, rating: true } } } }, teamStats: true }, orderBy: { rating: "desc" } }),
      this.prisma.team.count({ where }),
    ]);
    return { data: teams, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const team = await this.prisma.team.findFirst({
      where: { OR: [{ id }, { tag: id }] },
      include: { members: { include: { user: true } }, teamStats: true },
    });
    if (!team) throw new NotFoundException("Команда не найдена");
    return team;
  }

  async create(data: { name: string; tag: string; country?: string; logo?: string }, captainId: string) {
    const existing = await this.prisma.team.findFirst({ where: { OR: [{ name: data.name }, { tag: data.tag }] } });
    if (existing) throw new ConflictException("Название или тег уже заняты");

    return this.prisma.team.create({
      data: { ...data, ownerId: captainId, members: { create: { userId: captainId, role: "CAPTAIN" } }, teamStats: { create: {} } },
      include: { members: true },
    });
  }

  async inviteMember(teamId: string, userId: string, captainId: string) {
    const team = await this.prisma.team.findUnique({ where: { id: teamId } });
    if (!team) throw new NotFoundException("Команда не найдена");
    if (team.ownerId !== captainId) throw new ForbiddenException("Только капитан может приглашать");
    return this.prisma.teamMember.create({ data: { teamId, userId, role: "PLAYER" } });
  }
}

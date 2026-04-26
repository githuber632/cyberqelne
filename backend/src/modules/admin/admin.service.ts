import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [users, tournaments, teams, orders] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.tournament.count(),
      this.prisma.team.count(),
      this.prisma.order.count(),
    ]);
    return { users, tournaments, teams, orders };
  }

  async banUser(id: string) {
    return this.prisma.user.update({ where: { id }, data: { status: "BANNED" } });
  }

  async setUserRole(id: string, role: string) {
    return this.prisma.user.update({ where: { id }, data: { role: role as any } });
  }
}

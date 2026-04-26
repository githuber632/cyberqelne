"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
let TeamsService = class TeamsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(page = 1, limit = 20, country) {
        const where = { status: "ACTIVE" };
        if (country)
            where.country = country;
        const [teams, total] = await Promise.all([
            this.prisma.team.findMany({ where, skip: (page - 1) * limit, take: limit, include: { members: { include: { user: { select: { nickname: true, avatar: true, rating: true } } } }, teamStats: true }, orderBy: { rating: "desc" } }),
            this.prisma.team.count({ where }),
        ]);
        return { data: teams, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async findOne(id) {
        const team = await this.prisma.team.findFirst({
            where: { OR: [{ id }, { tag: id }] },
            include: { members: { include: { user: true } }, teamStats: true },
        });
        if (!team)
            throw new common_1.NotFoundException("Команда не найдена");
        return team;
    }
    async create(data, captainId) {
        const existing = await this.prisma.team.findFirst({ where: { OR: [{ name: data.name }, { tag: data.tag }] } });
        if (existing)
            throw new common_1.ConflictException("Название или тег уже заняты");
        return this.prisma.team.create({
            data: { ...data, ownerId: captainId, members: { create: { userId: captainId, role: "CAPTAIN" } }, teamStats: { create: {} } },
            include: { members: true },
        });
    }
    async inviteMember(teamId, userId, captainId) {
        const team = await this.prisma.team.findUnique({ where: { id: teamId } });
        if (!team)
            throw new common_1.NotFoundException("Команда не найдена");
        if (team.ownerId !== captainId)
            throw new common_1.ForbiddenException("Только капитан может приглашать");
        return this.prisma.teamMember.create({ data: { teamId, userId, role: "PLAYER" } });
    }
};
exports.TeamsService = TeamsService;
exports.TeamsService = TeamsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TeamsService);
//# sourceMappingURL=teams.service.js.map
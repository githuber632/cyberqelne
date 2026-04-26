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
exports.TournamentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
let TournamentsService = class TournamentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(filters) {
        const { status, game, page = 1, limit = 12, search } = filters;
        const where = {};
        if (status)
            where.status = status;
        if (game)
            where.game = { contains: game, mode: "insensitive" };
        if (search)
            where.title = { contains: search, mode: "insensitive" };
        const [tournaments, total] = await Promise.all([
            this.prisma.tournament.findMany({
                where,
                orderBy: [{ featured: "desc" }, { startDate: "asc" }],
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    registrations: {
                        where: { status: "APPROVED" },
                        select: { id: true },
                    },
                    _count: { select: { registrations: true, matches: true } },
                },
            }),
            this.prisma.tournament.count({ where }),
        ]);
        return {
            data: tournaments.map((t) => ({
                ...t,
                registeredTeams: t._count.registrations,
                totalMatches: t._count.matches,
            })),
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async findOne(id) {
        const tournament = await this.prisma.tournament.findFirst({
            where: { OR: [{ id }, { slug: id }] },
            include: {
                registrations: {
                    where: { status: "APPROVED" },
                    include: { team: { include: { members: { include: { user: true } } } } },
                },
                brackets: {
                    include: { matches: { include: { team1: true, team2: true, winner: true } } },
                    orderBy: { round: "asc" },
                },
                prizeDistribution: { orderBy: { place: "asc" } },
            },
        });
        if (!tournament)
            throw new common_1.NotFoundException("Турнир не найден");
        return tournament;
    }
    async create(dto, adminId) {
        const slug = this.generateSlug(dto.title);
        const { prizePool, entryFee, registrationStartAt, registrationEndAt, startDate, endDate, format, region: _region, ...rest } = dto;
        return this.prisma.tournament.create({
            data: {
                ...rest,
                ...(format ? { format: format } : {}),
                slug,
                organizerId: adminId,
                prizePool: BigInt(prizePool),
                entryFee: BigInt(entryFee || 0),
                registrationStartAt: new Date(registrationStartAt),
                registrationEndAt: new Date(registrationEndAt),
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : new Date(startDate),
            },
        });
    }
    async registerTeam(tournamentId, teamId, userId) {
        const tournament = await this.prisma.tournament.findUnique({
            where: { id: tournamentId },
            include: { registrations: { where: { status: "APPROVED" } } },
        });
        if (!tournament)
            throw new common_1.NotFoundException("Турнир не найден");
        if (tournament.status !== "REGISTRATION") {
            throw new common_1.BadRequestException("Регистрация закрыта");
        }
        const currentCount = tournament.registrations.length;
        if (currentCount >= tournament.maxTeams) {
            throw new common_1.BadRequestException("Все слоты заняты");
        }
        const member = await this.prisma.teamMember.findFirst({
            where: { teamId, userId },
        });
        if (!member)
            throw new common_1.ForbiddenException("Вы не состоите в этой команде");
        const existing = await this.prisma.tournamentRegistration.findUnique({
            where: { tournamentId_teamId: { tournamentId, teamId } },
        });
        if (existing)
            throw new common_1.BadRequestException("Команда уже зарегистрирована");
        return this.prisma.tournamentRegistration.create({
            data: {
                tournamentId,
                teamId,
                userId,
                status: "APPROVED",
            },
        });
    }
    async generateBracket(tournamentId) {
        const tournament = await this.prisma.tournament.findUnique({
            where: { id: tournamentId },
            include: {
                registrations: {
                    where: { status: "APPROVED" },
                    include: { team: true },
                    orderBy: { seed: "asc" },
                },
            },
        });
        if (!tournament)
            throw new common_1.NotFoundException("Турнир не найден");
        if (tournament.registrations.length < 2) {
            throw new common_1.BadRequestException("Недостаточно команд для генерации сетки");
        }
        const teams = tournament.registrations.map((r) => r.team);
        const matches = this.buildSingleEliminationBracket(teams, tournamentId);
        await this.prisma.tournament.update({
            where: { id: tournamentId },
            data: { status: "ACTIVE" },
        });
        return this.prisma.bracket.create({
            data: {
                tournamentId,
                round: 1,
                bracketType: "winners",
                matches: { createMany: { data: matches } },
            },
            include: { matches: { include: { team1: true, team2: true } } },
        });
    }
    async reportMatchResult(matchId, winnerId, score1, score2, adminId) {
        const match = await this.prisma.match.findUnique({ where: { id: matchId } });
        if (!match)
            throw new common_1.NotFoundException("Матч не найден");
        const updatedMatch = await this.prisma.match.update({
            where: { id: matchId },
            data: {
                winnerId,
                score1,
                score2,
                status: "FINISHED",
                finishedAt: new Date(),
            },
            include: { winner: true, team1: true, team2: true },
        });
        await this.updateRatings(match, winnerId);
        return updatedMatch;
    }
    buildSingleEliminationBracket(teams, tournamentId) {
        const matches = [];
        for (let i = 0; i < teams.length; i += 2) {
            matches.push({
                tournamentId,
                team1Id: teams[i]?.id || null,
                team2Id: teams[i + 1]?.id || null,
                status: "PENDING",
                roundNumber: 1,
                matchNumber: Math.floor(i / 2) + 1,
            });
        }
        return matches;
    }
    async updateRatings(match, winnerId) {
        const loserId = match.team1Id === winnerId ? match.team2Id : match.team1Id;
        const K = 32;
        const [winner, loser] = await Promise.all([
            this.prisma.team.findUnique({ where: { id: winnerId } }),
            this.prisma.team.findUnique({ where: { id: loserId } }),
        ]);
        if (!winner || !loser)
            return;
        const expectedWin = 1 / (1 + Math.pow(10, (loser.rating - winner.rating) / 400));
        const delta = Math.round(K * (1 - expectedWin));
        await Promise.all([
            this.prisma.team.update({ where: { id: winnerId }, data: { rating: { increment: delta } } }),
            this.prisma.team.update({ where: { id: loserId }, data: { rating: { decrement: delta } } }),
        ]);
    }
    generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .trim() + "-" + Date.now().toString(36);
    }
};
exports.TournamentsService = TournamentsService;
exports.TournamentsService = TournamentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TournamentsService);
//# sourceMappingURL=tournaments.service.js.map
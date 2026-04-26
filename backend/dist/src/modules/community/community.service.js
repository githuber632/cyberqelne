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
exports.CommunityService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
let CommunityService = class CommunityService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
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
    async createPost(userId, data) {
        return this.prisma.post.create({ data: { ...data, authorId: userId } });
    }
    async likePost(postId, userId) {
        const existing = await this.prisma.like.findUnique({ where: { userId_postId: { postId, userId } } });
        if (existing) {
            await this.prisma.like.delete({ where: { id: existing.id } });
            return { liked: false };
        }
        await this.prisma.like.create({ data: { postId, userId } });
        return { liked: true };
    }
};
exports.CommunityService = CommunityService;
exports.CommunityService = CommunityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CommunityService);
//# sourceMappingURL=community.service.js.map
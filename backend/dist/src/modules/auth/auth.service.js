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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../../common/prisma/prisma.service");
let AuthService = class AuthService {
    prisma;
    jwt;
    config;
    constructor(prisma, jwt, config) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
    }
    async register(dto) {
        const existing = await this.prisma.user.findFirst({
            where: { OR: [{ email: dto.email }, { nickname: dto.nickname }] },
        });
        if (existing) {
            throw new common_1.ConflictException(existing.email === dto.email
                ? "Email уже используется"
                : "Никнейм уже занят");
        }
        const passwordHash = await bcrypt.hash(dto.password, 12);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                nickname: dto.nickname,
                passwordHash,
                country: dto.country || "UZ",
                playerStats: { create: {} },
            },
        });
        return this.generateTokens(user);
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
            throw new common_1.UnauthorizedException("Неверный email или пароль");
        }
        if (user.status === "BANNED") {
            throw new common_1.UnauthorizedException("Аккаунт заблокирован");
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastSeenAt: new Date() },
        });
        return this.generateTokens(user);
    }
    async refreshToken(token) {
        const stored = await this.prisma.refreshToken.findUnique({
            where: { token },
            include: { user: true },
        });
        if (!stored || stored.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException("Invalid refresh token");
        }
        await this.prisma.refreshToken.delete({ where: { id: stored.id } });
        return this.generateTokens(stored.user);
    }
    async logout(userId, refreshToken) {
        await this.prisma.refreshToken.deleteMany({
            where: { userId, token: refreshToken },
        });
    }
    async generateTokens(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            nickname: user.nickname,
            role: user.role,
        };
        const expiresIn = 15 * 60;
        const accessToken = await this.jwt.signAsync(payload, {
            secret: this.config.get("JWT_SECRET"),
            expiresIn,
        });
        const refreshTokenValue = crypto.randomUUID();
        const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await this.prisma.refreshToken.create({
            data: {
                userId: user.id,
                token: refreshTokenValue,
                expiresAt: refreshExpiresAt,
            },
        });
        return { accessToken, refreshToken: refreshTokenValue, expiresIn };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
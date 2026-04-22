import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../../common/prisma/prisma.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

export interface JwtPayload {
  sub: string;
  email: string;
  nickname: string;
  role: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService
  ) {}

  async register(dto: RegisterDto): Promise<AuthTokens> {
    // Check for existing user
    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.email }, { nickname: dto.nickname }] },
    });

    if (existing) {
      throw new ConflictException(
        existing.email === dto.email
          ? "Email уже используется"
          : "Никнейм уже занят"
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        nickname: dto.nickname,
        passwordHash,
        country: dto.country || "UZ",
        playerStats: { create: {} }, // init stats
      },
    });

    return this.generateTokens(user);
  }

  async login(dto: LoginDto): Promise<AuthTokens> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException("Неверный email или пароль");
    }

    if (user.status === "BANNED") {
      throw new UnauthorizedException("Аккаунт заблокирован");
    }

    // Update last seen
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastSeenAt: new Date() },
    });

    return this.generateTokens(user);
  }

  async refreshToken(token: string): Promise<AuthTokens> {
    const stored = await this.prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    // Rotate refresh token
    await this.prisma.refreshToken.delete({ where: { id: stored.id } });
    return this.generateTokens(stored.user);
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { userId, token: refreshToken },
    });
  }

  private async generateTokens(user: { id: string; email: string; nickname: string; role: string }): Promise<AuthTokens> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      nickname: user.nickname,
      role: user.role,
    };

    const expiresIn = 15 * 60; // 15 minutes
    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.config.get("JWT_SECRET"),
      expiresIn,
    });

    const refreshTokenValue = crypto.randomUUID();
    const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshTokenValue,
        expiresAt: refreshExpiresAt,
      },
    });

    return { accessToken, refreshToken: refreshTokenValue, expiresIn };
  }
}

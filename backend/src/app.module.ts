import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { PrismaModule } from "./common/prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { TournamentsModule } from "./modules/tournaments/tournaments.module";
import { TeamsModule } from "./modules/teams/teams.module";
import { RankingsModule } from "./modules/rankings/rankings.module";
import { ShopModule } from "./modules/shop/shop.module";
import { CommunityModule } from "./modules/community/community.module";
import { MediaModule } from "./modules/media/media.module";
import { AdminModule } from "./modules/admin/admin.module";
import { WebsocketsModule } from "./modules/websockets/websockets.module";

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({ isGlobal: true }),

    // Rate limiting
    ThrottlerModule.forRoot([
      { name: "short", ttl: 1000, limit: 10 },
      { name: "medium", ttl: 10000, limit: 50 },
      { name: "long", ttl: 60000, limit: 200 },
    ]),

    // Database
    PrismaModule,

    // Feature modules
    AuthModule,
    UsersModule,
    TournamentsModule,
    TeamsModule,
    RankingsModule,
    ShopModule,
    CommunityModule,
    MediaModule,
    AdminModule,
    WebsocketsModule,
  ],
})
export class AppModule {}

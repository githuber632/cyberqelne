"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const prisma_module_1 = require("./common/prisma/prisma.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const tournaments_module_1 = require("./modules/tournaments/tournaments.module");
const teams_module_1 = require("./modules/teams/teams.module");
const rankings_module_1 = require("./modules/rankings/rankings.module");
const shop_module_1 = require("./modules/shop/shop.module");
const community_module_1 = require("./modules/community/community.module");
const media_module_1 = require("./modules/media/media.module");
const admin_module_1 = require("./modules/admin/admin.module");
const websockets_module_1 = require("./modules/websockets/websockets.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            throttler_1.ThrottlerModule.forRoot([
                { name: "short", ttl: 1000, limit: 10 },
                { name: "medium", ttl: 10000, limit: 50 },
                { name: "long", ttl: 60000, limit: 200 },
            ]),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            tournaments_module_1.TournamentsModule,
            teams_module_1.TeamsModule,
            rankings_module_1.RankingsModule,
            shop_module_1.ShopModule,
            community_module_1.CommunityModule,
            media_module_1.MediaModule,
            admin_module_1.AdminModule,
            websockets_module_1.WebsocketsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
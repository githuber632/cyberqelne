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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RankingsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const rankings_service_1 = require("./rankings.service");
let RankingsController = class RankingsController {
    rankings;
    constructor(rankings) {
        this.rankings = rankings;
    }
    getPlayers(q) { return this.rankings.getPlayerLeaderboard(q); }
    getTeams(q) { return this.rankings.getTeamLeaderboard(q); }
};
exports.RankingsController = RankingsController;
__decorate([
    (0, common_1.Get)("players"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RankingsController.prototype, "getPlayers", null);
__decorate([
    (0, common_1.Get)("teams"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RankingsController.prototype, "getTeams", null);
exports.RankingsController = RankingsController = __decorate([
    (0, swagger_1.ApiTags)("rankings"),
    (0, common_1.Controller)("rankings"),
    __metadata("design:paramtypes", [rankings_service_1.RankingsService])
], RankingsController);
//# sourceMappingURL=rankings.controller.js.map
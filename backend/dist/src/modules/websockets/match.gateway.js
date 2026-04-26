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
exports.MatchGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
let MatchGateway = class MatchGateway {
    server;
    logger = new common_1.Logger("MatchGateway");
    roomClients = new Map();
    handleConnection(client) {
        this.logger.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
        this.roomClients.forEach((clients, room) => {
            clients.delete(client.id);
        });
    }
    handleJoinMatch(client, data) {
        const room = `match:${data.matchId}`;
        client.join(room);
        if (!this.roomClients.has(room)) {
            this.roomClients.set(room, new Set());
        }
        this.roomClients.get(room).add(client.id);
        const viewerCount = this.roomClients.get(room).size;
        this.server.to(room).emit("viewer_count", { count: viewerCount });
        this.logger.log(`Client ${client.id} joined match room ${room}`);
        client.emit("joined", { room, viewerCount });
    }
    handleLeaveMatch(client, data) {
        const room = `match:${data.matchId}`;
        client.leave(room);
        this.roomClients.get(room)?.delete(client.id);
        const viewerCount = this.roomClients.get(room)?.size || 0;
        this.server.to(room).emit("viewer_count", { count: viewerCount });
    }
    handleJoinTournament(client, data) {
        const room = `tournament:${data.tournamentId}`;
        client.join(room);
        client.emit("joined", { room });
    }
    emitMatchUpdate(matchId, update) {
        this.server.to(`match:${matchId}`).emit("match_update", update);
    }
    emitMatchResult(matchId, result) {
        this.server.to(`match:${matchId}`).emit("match_finished", result);
    }
    emitBracketUpdate(tournamentId, bracket) {
        this.server.to(`tournament:${tournamentId}`).emit("bracket_update", bracket);
    }
    broadcastLiveEvent(event, data) {
        this.server.emit("live_event", { event, data, timestamp: new Date() });
    }
};
exports.MatchGateway = MatchGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], MatchGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("join_match"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], MatchGateway.prototype, "handleJoinMatch", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("leave_match"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], MatchGateway.prototype, "handleLeaveMatch", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("join_tournament"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], MatchGateway.prototype, "handleJoinTournament", null);
exports.MatchGateway = MatchGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:3000",
            credentials: true,
        },
        namespace: "/matches",
    })
], MatchGateway);
//# sourceMappingURL=match.gateway.js.map
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";

// WebSocket gateway для real-time обновлений матчей
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  },
  namespace: "/matches",
})
export class MatchGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger("MatchGateway");
  private roomClients = new Map<string, Set<string>>();

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    // Clean up rooms
    this.roomClients.forEach((clients, room) => {
      clients.delete(client.id);
    });
  }

  // Join match room for live updates
  @SubscribeMessage("join_match")
  handleJoinMatch(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { matchId: string }
  ) {
    const room = `match:${data.matchId}`;
    client.join(room);

    if (!this.roomClients.has(room)) {
      this.roomClients.set(room, new Set());
    }
    this.roomClients.get(room)!.add(client.id);

    const viewerCount = this.roomClients.get(room)!.size;
    this.server.to(room).emit("viewer_count", { count: viewerCount });

    this.logger.log(`Client ${client.id} joined match room ${room}`);
    client.emit("joined", { room, viewerCount });
  }

  @SubscribeMessage("leave_match")
  handleLeaveMatch(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { matchId: string }
  ) {
    const room = `match:${data.matchId}`;
    client.leave(room);
    this.roomClients.get(room)?.delete(client.id);
    const viewerCount = this.roomClients.get(room)?.size || 0;
    this.server.to(room).emit("viewer_count", { count: viewerCount });
  }

  // Join tournament room for bracket updates
  @SubscribeMessage("join_tournament")
  handleJoinTournament(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { tournamentId: string }
  ) {
    const room = `tournament:${data.tournamentId}`;
    client.join(room);
    client.emit("joined", { room });
  }

  // Called by backend when match score updates
  emitMatchUpdate(matchId: string, update: {
    score1: number;
    score2: number;
    status: string;
    event?: string;
  }) {
    this.server.to(`match:${matchId}`).emit("match_update", update);
  }

  // Called when match finishes
  emitMatchResult(matchId: string, result: {
    winnerId: string;
    winnerName: string;
    score1: number;
    score2: number;
  }) {
    this.server.to(`match:${matchId}`).emit("match_finished", result);
  }

  // Bracket update after match result
  emitBracketUpdate(tournamentId: string, bracket: any) {
    this.server.to(`tournament:${tournamentId}`).emit("bracket_update", bracket);
  }

  // Live notification to all clients
  broadcastLiveEvent(event: string, data: any) {
    this.server.emit("live_event", { event, data, timestamp: new Date() });
  }
}

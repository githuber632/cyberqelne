import { OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
export declare class MatchGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private logger;
    private roomClients;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinMatch(client: Socket, data: {
        matchId: string;
    }): void;
    handleLeaveMatch(client: Socket, data: {
        matchId: string;
    }): void;
    handleJoinTournament(client: Socket, data: {
        tournamentId: string;
    }): void;
    emitMatchUpdate(matchId: string, update: {
        score1: number;
        score2: number;
        status: string;
        event?: string;
    }): void;
    emitMatchResult(matchId: string, result: {
        winnerId: string;
        winnerName: string;
        score1: number;
        score2: number;
    }): void;
    emitBracketUpdate(tournamentId: string, bracket: any): void;
    broadcastLiveEvent(event: string, data: any): void;
}

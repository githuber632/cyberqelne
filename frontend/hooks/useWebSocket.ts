"use client";

import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/store/authStore";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:4000";

interface MatchUpdate {
  score1: number;
  score2: number;
  status: string;
  event?: string;
}

interface UseMatchSocketOptions {
  matchId: string;
  onUpdate?: (data: MatchUpdate) => void;
  onFinished?: (data: any) => void;
  onViewerCount?: (count: number) => void;
}

export function useMatchSocket({ matchId, onUpdate, onFinished, onViewerCount }: UseMatchSocketOptions) {
  const socketRef = useRef<Socket | null>(null);
  const { token } = useAuthStore();

  useEffect(() => {
    const socket = io(`${WS_URL}/matches`, {
      auth: { token },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      socket.emit("join_match", { matchId });
    });

    socket.on("match_update", (data: MatchUpdate) => onUpdate?.(data));
    socket.on("match_finished", (data: any) => onFinished?.(data));
    socket.on("viewer_count", ({ count }: { count: number }) => onViewerCount?.(count));

    socketRef.current = socket;

    return () => {
      socket.emit("leave_match", { matchId });
      socket.disconnect();
    };
  }, [matchId, token]);

  return socketRef;
}

export function useTournamentSocket(tournamentId: string, onBracketUpdate?: (data: any) => void) {
  const { token } = useAuthStore();

  useEffect(() => {
    const socket = io(`${WS_URL}/matches`, {
      auth: { token },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      socket.emit("join_tournament", { tournamentId });
    });

    socket.on("bracket_update", (data: any) => onBracketUpdate?.(data));

    return () => {
      socket.disconnect();
    };
  }, [tournamentId, token]);
}

export function useLiveEvents(onEvent?: (event: string, data: any) => void) {
  useEffect(() => {
    const socket = io(`${WS_URL}/matches`, { transports: ["websocket"] });

    socket.on("live_event", ({ event, data }: { event: string; data: any }) => {
      onEvent?.(event, data);
    });

    return () => socket.disconnect();
  }, []);
}

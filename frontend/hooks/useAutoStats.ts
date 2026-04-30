"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getCountFromServer, query, where, getDocs } from "firebase/firestore";

export interface AutoStats {
  players: number;
  tournamentsFinished: number;
  registrationsApproved: number;
  prizeTotal: number;
  loading: boolean;
}

export function useAutoStats(): AutoStats {
  const [stats, setStats] = useState<AutoStats>({
    players: 0,
    tournamentsFinished: 0,
    registrationsApproved: 0,
    prizeTotal: 0,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;
    async function calculate() {
      try {
        const [playersSnap, finishedSnap, approvedSnap, tournamentsSnap] = await Promise.all([
          getCountFromServer(collection(db, "users")),
          getCountFromServer(query(collection(db, "tournaments"), where("status", "==", "finished"))),
          getCountFromServer(query(collection(db, "tournament_applications"), where("status", "==", "approved"))),
          getDocs(collection(db, "tournaments")),
        ]);

        const prizeTotal = tournamentsSnap.docs.reduce((sum, d) => {
          const prize = d.data().prizePool;
          if (typeof prize === "number") return sum + prize;
          const num = parseInt(String(prize).replace(/\D/g, ""), 10);
          return sum + (isNaN(num) ? 0 : num);
        }, 0);

        if (!cancelled) {
          setStats({
            players: playersSnap.data().count,
            tournamentsFinished: finishedSnap.data().count,
            registrationsApproved: approvedSnap.data().count,
            prizeTotal,
            loading: false,
          });
        }
      } catch {
        if (!cancelled) setStats((prev) => ({ ...prev, loading: false }));
      }
    }
    calculate();
    return () => { cancelled = true; };
  }, []);

  return stats;
}

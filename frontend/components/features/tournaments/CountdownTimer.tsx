"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(targetDate: Date): TimeLeft {
  const diff = Math.max(0, targetDate.getTime() - Date.now());
  return {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

export function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [time, setTime] = useState<TimeLeft>(getTimeLeft(targetDate));

  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeLeft(targetDate)), 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex items-center gap-2">
      {[
        { value: time.hours, label: "ч" },
        { value: time.minutes, label: "м" },
        { value: time.seconds, label: "с" },
      ].map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-2">
          <div className="bg-cyber-purple/40 border border-cyber-glass-border rounded-lg px-3 py-2 min-w-[52px] text-center">
            <motion.div
              key={unit.value}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="font-display font-bold text-xl text-cyber-neon"
            >
              {String(unit.value).padStart(2, "0")}
            </motion.div>
            <div className="text-gray-600 text-xs font-mono">{unit.label}</div>
          </div>
          {i < 2 && <span className="text-cyber-neon font-bold text-xl">:</span>}
        </div>
      ))}
    </div>
  );
}
